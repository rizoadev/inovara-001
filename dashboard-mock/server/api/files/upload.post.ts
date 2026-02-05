import { db, generateId } from '../../utils/db'

export default defineEventHandler(async (event) => {
  // In a real app, this would handle multipart/form-data
  // For mock, we'll accept JSON with file metadata
  const body = await readBody(event)
  
  if (!body.registration_id || !body.filename) {
    throw createError({
      statusCode: 400,
      message: 'Registration ID and filename required'
    })
  }

  // Validate file type
  const allowedTypes = ['.pdf', '.ppt', '.pptx']
  const ext = body.filename.substring(body.filename.lastIndexOf('.')).toLowerCase()
  if (!allowedTypes.includes(ext)) {
    throw createError({
      statusCode: 400,
      message: 'Only PDF, PPT, PPTX files allowed'
    })
  }

  // Validate file size (max 10MB)
  if (body.filesize && body.filesize > 10 * 1024 * 1024) {
    throw createError({
      statusCode: 400,
      message: 'File size exceeds 10MB limit'
    })
  }

  // Get registration
  const registration = db.getRegistrationById(body.registration_id)
  if (!registration) {
    throw createError({
      statusCode: 404,
      message: 'Registration not found'
    })
  }

  // Create file record
  const fileId = generateId('file')
  const file = {
    id: fileId,
    filename: body.filename,
    filetype: body.filetype || 'application/octet-stream',
    filesize: body.filesize || 0,
    uploaded_at: new Date().toISOString()
  }

  // Add file to registration
  const updatedFiles = [...(registration.files || []), file]
  db.updateRegistration(body.registration_id, {
    files: updatedFiles
  })

  return {
    ...file,
    url: `/api/files/${fileId}/download`
  }
})
