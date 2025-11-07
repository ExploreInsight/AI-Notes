// app/api/ai/route.ts
import { Hono } from "hono";
// removed axios
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getNote } from "@/actions/notes.action";

// google genai SDK
import { GoogleGenAI as GenAIClient } from "@google/genai";

export const runtime = "nodejs";

const app = new Hono();

// SDK client init helper
function createGenAIClient() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  // If you use other auth flows (ADC / service account), you can omit apiKey here.
  if (apiKey) {
    return new GenAIClient({ apiKey });
  }
  throw new Error("Missing GOOGLE_GEMINI_API_KEY or Expired credentials")
}

const GENAI_MODEL = process.env.GEMINI_MODEL || "gemini-pro";

// ---- Helper: call Gemini using official SDK ----
async function callGemini(prompt: string): Promise<string> {
  const client = createGenAIClient();

  try {
    // generateContent shape per SDK examples
    const result = await client.models.generateContent({
      model: GENAI_MODEL,
      // keep a simple text-only prompt
      contents: [{ parts: [{ text: prompt }] }],
      // you can tune temperature, max output tokens, etc. here if the SDK supports them
    });

    // Many examples expose `text` directly; fall back to other shapes defensively.
    // prefer response.text if present
    const candidateText =
      // @ts-ignore - SDK response shapes can vary between versions; try common fields
      result?.text ||
      // some SDKs return result.output_text
      // @ts-ignore
      result?.output_text ||
      // other nested candidates
      // @ts-ignore
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      // last resort - stringify response for debugging
      null;

    if (!candidateText) {
      console.warn("Unexpected Gemini response shape:", JSON.stringify(result));
      throw new Error("Unexpected Gemini response");
    }

    return String(candidateText);
  } catch (err: any) {
    // try to give useful error text
    console.error("Gemini API Error:", err?.message ?? err);
    // If SDK error contains structured info, try to surface it
    const msg =
      err?.message ||
      (err?.response && JSON.stringify(err.response)) ||
      "Gemini call failed";
    throw new Error(msg);
  }
}

// ---- Helper to get authenticated Clerk user and Prisma user ----
async function getAuthenticatedUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

// ---- POST /summary ----
app.post("/summary", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const noteId = String(body?.noteId || "").trim();
    if (!noteId) return c.json({ error: "noteId required" }, 400);

    const user = await getAuthenticatedUser();

    const { note } = await getNote(noteId, user.id);
    if (!note) return c.json({ error: "Note not found" }, 404);

    const prompt = `Summarize the following note in 2-3 sentences. Be concise.

Title: ${note.title ?? ""}
Content: ${note.content ?? ""}

Summary:`;

    const summaryText = (await callGemini(prompt)).trim();

    await prisma.note.update({
      where: { id: noteId },
      data: { summary: summaryText },
    });

    return c.json({ success: true, summary: summaryText }, 200);
  } catch (err: any) {
    console.error("Error generating summary:", err);
    const status = err?.message === "Unauthorized" ? 401 : 500;
    return c.json({ error: err?.message ?? "Failed to generate summary" }, status);
  }
});

// ---- POST /tags ----
app.post("/tags", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const noteId = String(body?.noteId || "").trim();
    if (!noteId) return c.json({ error: "noteId required" }, 400);

    const user = await getAuthenticatedUser();

    const note = await prisma.note.findFirst({
      where: { id: noteId, authorId: user.id },
    });
    if (!note) return c.json({ error: "Note not found" }, 404);

    const prompt = `Generate 3-5 relevant tags for the note. Return only tags as a comma separated list (lowercase single words, no extra commentary).

Title: ${note.title ?? ""}
Content: ${note.content ?? ""}

Tags:`;

    const tagsResponse = (await callGemini(prompt)).trim();
    const tags = tagsResponse
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10); // cap to prevent huge arrays

    // For Prisma String[] fields use `set:` when updating
    await prisma.note.update({
      where: { id: noteId },
      data: { tags: { set: tags } },
    });

    return c.json({ success: true, tags }, 200);
  } catch (err: any) {
    console.error("Error generating tags:", err);
    const status = err?.message === "Unauthorized" ? 401 : 500;
    return c.json({ error: err?.message ?? "Failed to generate tags" }, status);
  }
});

// health
app.get("/health", (c) => c.json({ status: "ok" }));

function stripApiAiPrefix(req: Request): Request {
  const url = new URL(req.url);
  // remove leading /api/ai from pathname if present
  url.pathname = url.pathname.replace(/^\/api\/ai/, "") || "/";
  return new Request(url.toString(), req);
}

export const GET = (req: Request) => app.fetch(stripApiAiPrefix(req) as any);
export const POST = (req: Request) => app.fetch(stripApiAiPrefix(req) as any);
export const PUT = (req: Request) => app.fetch(stripApiAiPrefix(req) as any);
export const DELETE = (req: Request) => app.fetch(stripApiAiPrefix(req) as any);
