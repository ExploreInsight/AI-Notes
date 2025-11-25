'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { createNoteSchema, updateNoteSchema } from '@/schema/notes'

// Get all notes for current user
export async function getNotes() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: 'User not found' }
    }

    const notes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: 'desc' },
    })

    return { notes }
  } catch (error) {
    console.error('Error fetching notes:', error)
    return { error: 'Failed to fetch notes' }
  }
}

// Get single note
export async function getNote(noteId: string, id: string) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: 'User not found' }
    }

    const note = await prisma.note.findFirst({
      where: { 
        id: noteId,
        authorId: user.id 
      },
    })

    if (!note) {
      return { error: 'Note not found' }
    }

    return { note }
  } catch (error) {
    console.error('Error fetching note:', error)
    return { error: 'Failed to fetch note' }
  }
}

// Create new note
export async function createNote(data: z.infer<typeof createNoteSchema>) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    // Validate input
    const validated = createNoteSchema.parse(data)

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: 'User not found' }
    }

      const note = await prisma.note.create({
      data: {
        title: validated.title,
        content: validated.content,
        authorId: user.id,
        summary: '',
        tags:[],    
      },
    });
   revalidatePath('/')
    return { note }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error}
    }
    console.error('Error creating note:', error)
    return { error: 'Failed to create note' }
  }
}

// Update note
export async function updateNote(data: z.infer<typeof updateNoteSchema>) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    // Validate input
    const validated = updateNoteSchema.parse(data)

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: 'User not found' }
    }

    // Check if note belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: validated.id,
        authorId: user.id,
      },
    })

    if (!existingNote) {
      return { error: 'Note not found or unauthorized' }
    }

    const note = await prisma.note.update({
      where: { id: validated.id },
      data: {
        title: validated.title,
        content: validated.content,
      },
    })

    revalidatePath('/')
    return { note }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error }
    }
    console.error('Error updating note:', error)
    return { error: 'Failed to update note' }
  }
}

// Delete note
export async function deleteNote(noteId: string) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: 'User not found' }
    }

    // Check if note belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        authorId: user.id,
      },
    })

    if (!existingNote) {
      return { error: 'Note not found or unauthorized' }
    }

    await prisma.note.delete({
      where: { id: noteId },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting note:', error)
    return { error: 'Failed to delete note' }
  }
}

// Search notes
export async function searchNotes(query: string) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return { error: 'Unauthorized' }
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { error: 'User not found' }
    }

    const notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { updatedAt: 'desc' },
    })

    return { notes }
  } catch (error) {
    console.error('Error searching notes:', error)
    return { error: 'Failed to search notes' }
  }
}
