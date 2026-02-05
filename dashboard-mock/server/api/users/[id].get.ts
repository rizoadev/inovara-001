import { db } from '../../utils/db'

export default defineEventHandler((event) => {
  const userId = getRouterParam(event, 'id')
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'User ID required'
    })
  }

  const user = db.getUserById(userId)
  
  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  // Get user's registrations with details
  const registrations = db.getRegistrationsByUserId(userId).map(reg => {
    const eventData = db.getEventById(reg.event_id)
    const ticket = eventData?.tickets.find(t => t.id === reg.ticket_id)
    
    return {
      ...reg,
      event: eventData ? {
        id: eventData.id,
        title: eventData.title,
        event_date: eventData.event_date,
        location: eventData.location
      } : null,
      ticket: ticket ? {
        id: ticket.id,
        name: ticket.name,
        price: ticket.price
      } : null
    }
  })

  return {
    ...user,
    password: undefined, // Don't expose password
    registrations
  }
})
