'use server';
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { serverUserSchema } from "@/schema/user";


export async function syncUser() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) return;

        const email = user.emailAddresses?.[0]?.emailAddress;
        const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || undefined;

        if (!email) {
            console.log("Email not found");
            return
        }

        // creating server side payload to matach serverUserSchema
        const playLoad = {
            clerkId: userId,
            email,
            name
        };

        // validate payload with zod
        const parsed = serverUserSchema.safeParse(playLoad);

        if (!parsed.success) {
            console.log("Validation Failed:", parsed.error.format());
            return;
        }

        // upsert user by clerkId
        const dbUser = await prisma.user.upsert({
            where: { clerkId: userId },
            update: {
                email: parsed.data.email,
                name: parsed.data.name,
            },
            create: parsed.data
        });

        return dbUser;
    } catch (error) {
        console.log("Error syncing user with database:", error);
    }
}