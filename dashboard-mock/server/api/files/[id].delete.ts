import { db } from '../../utils/db'

export default defineEventHandler((event) => {
  const fileId = getRouterParam(event, 'id')
  
  if (!fileId) {
    throw createError({
      statusCode: 400,
      message: 'File ID required'
    })
  }

  // Find registration containing this file
  const registrations = db.getRegistrations()
  let found = false

  for (const reg of registrations) {
    if (reg.files && reg.files.length > 0) {
      const fileIndex = reg.files.findIndex((f: any) => f.id === fileId)
      if (fileIndex !== -1) {
        // Remove file
        const updatedFiles = reg.files.filter((f: any) => f.id !== fileId)
        db.updateRegistration(reg.id, { files: updatedFiles })
        found = true
        break
      }
    }
  }

  if (!found) {
    throw createError({
      statusCode: 404,
      message: 'File not found'
    })
  }

  return {
    success: true,
    message: 'File deleted'
  }
})
