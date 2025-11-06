import { z } from 'zod'

// Validation schemas
export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
})

export const updateNoteSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
})
