import {email, z} from 'zod';

/**
 * Acceptable shape coming from client when creating/updating a user.
 * - clerkId is not expected from the client if you get it from Clerk (server).
 * - email is required for user creation
 * - name is optional.
 */

// HelperFucntion: turn empty strings to undefined

const nonEmptyString = z
    .string()
    .trim()
    .transform(( str) => (str === '' ? undefined : str));

// create user schmea

export const createUserSchema = z.object({
    email: z.string().email({ message: "Invalid email"}).max(254),
    name: nonEmptyString.optional(),
})

// udpate schema partial 
export const updateUserSchema = createUserSchema.partial();

// server side user schema
export const serverUserSchema = createUserSchema.extend({
    clerkId: z.string().min(1),
});

// Types 
export type createUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ServerUserInput = z.infer<typeof serverUserSchema>;