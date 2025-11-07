import axios from 'axios'

// Generate summary for a note
export async function generateSummary(noteId: string) {
  try {
    const response = await axios.post('/api/ai/summary', { noteId }, { withCredentials: true })
    return { 
      success: true, 
      summary: response.data.summary 
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to generate summary' 
      }
    }
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Generate tags for a note
export async function generateTags(noteId: string) {
  try {
    const response = await axios.post('/api/ai/tags', { noteId }, { withCredentials: true })
    return { 
      success: true, 
      tags: response.data.tags 
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to generate tags' 
      }
    }
    return { success: false, error: 'An unexpected error occurred' }
  }
}