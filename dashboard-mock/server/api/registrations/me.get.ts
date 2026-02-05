import { db } from '../../utils/db'

export default defineEventHandler((event) => {
  // Get user from auth header (mock)
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Extract user_id from token (mock)
  const token = authHeader.replace('Bearer ', '')
  const userId = token.split('_')[1] // token format: token_userId_timestamp

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }

  // Get user's registrations
  const registrations = db.getRegistrationsByUserId(userId)
  
  // Enrich with event and ticket details
  const enrichedRegistrations = registrations.map(reg => {
    const event = db.getEventById(reg.event_id)
    const ticket = event?.tickets.find(t => t.id === reg.ticket_id)
    
    return {
      ...reg,
      event: event ? {
        id: event.id,
        title: event.title,
        slug: event.slug,
        event_date: event.event_date,
        location: event.location
      } : null,
      ticket: ticket ? {
        id: ticket.id,
        name: ticket.name,
        price: ticket.price
      } : null
    }
  })

  return {
    data: enrichedRegistrations
  }
})
