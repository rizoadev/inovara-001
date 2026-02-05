import { db } from '../../utils/db'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Registration ID required'
    })
  }

  const registration = db.getRegistrationWithDetails(id)
  
  if (!registration) {
    throw createError({
      statusCode: 404,
      message: 'Registration not found'
    })
  }

  return registration
})
