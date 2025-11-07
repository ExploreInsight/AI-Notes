# 🧠 AI Notes — Smart Note Assistant

**AI Notes** is a full-stack Next.js application that helps users create, organize, and summarize notes intelligently.  
It uses **Google Gemini AI** to generate summaries and tags, and **Clerk** for authentication — built with **Hono**, **Prisma**, and a modern **React + Tailwind** UI.

---

## 🚀 Features

- 🔐 **User Authentication** — powered by [Clerk](https://clerk.com/)
- 🗒️ **Create, Edit & Delete Notes** — manage your personal notes securely
- 🤖 **AI Summarization** — Gemini summarizes notes in 2–3 sentences
- 🏷️ **AI Tag Generation** — Gemini generates 3–5 relevant tags for each note
- 🔍 **Search Functionality**
  - Searches only when pressing **Enter** or clicking the **search icon**
  - Clean, responsive design
- ⚡ **Tech Stack**
  - **Next.js 16 (App Router)**
  - **Hono** for API routing
  - **Prisma ORM + PostgreSQL**
  - **Google Gemini AI (via @google/genai SDK)**
  - **Tailwind CSS + ShadCN UI**
  - **Clerk Auth**

---

## 🧩 Project Structure

```shell
app/
├── api/
│ └── ai/
│ └── [[...route]]/
│ └── route.ts # Hono + Gemini AI endpoints
components/
│ ├── AiButtons.tsx # Buttons for AI summary & tags
│ └── Header.tsx # Search + Create note header
lib/
│ ├── ai-client.ts # Axios client for AI routes
│ └── prisma.ts # Prisma client instance
actions/
│ └── notes.action.ts # getNote, CRUD actions
```

---

---

## ⚙️ Setup Instructions

### 1️⃣ Clone & Install

```bash
git clone https://github.com/yourusername/ai-notes.git
cd ai-notes
pnpm install
```

### 2️⃣ Environment Variables

Create a .env.local file in the root:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
```

---

### 3️⃣ Prisma Setup

```bash
npx prisma generate
npx prisma db push

```
---
### 4️⃣ Run the Dev Server

```bash
pnpm dev
# or
npm run dev

Your app will be live at http://localhost:3000
```
---

###  AI Integration Details

The AI endpoints are handled with Hono inside
app/api/ai/[[...route]]/route.ts.

Endpoints:
```shell
Route	Method	Description
/api/ai/summary	POST	Generate AI summary
/api/ai/tags	POST	Generate AI tags
/api/ai/health	GET	Check API health status
```
Example Request:

```bash
POST /api/ai/summary
{
  "noteId": "clxyz12345"
}

```

Response:
```bash
{
  "success": true,
  "summary": "This note explains how AI helps summarize content efficiently."
}
```
---

### 🧪 Commands Reference

Command	Description
```bash
pnpm dev	Start development server
pnpm build	Build for production
pnpm start	Run production build
npx prisma studio	Visualize database
```
---
### 💡 Future Improvements
```bash
✅ Add toasts instead of browser alerts for better UX

✅ Add debounce-based search (optional)

🔄 Add note rewriting and translation using Gemini

💾 Implement caching and rate limiting for API calls

🌍 Add export/import notes functionality
```
---

### 📜 License

License © 2025 Chirag

Made with ❤️ by Chirag — powered by Gemini AI + Next.js + Hono
