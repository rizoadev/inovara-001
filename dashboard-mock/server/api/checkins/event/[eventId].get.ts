import { db } from '../../../utils/db'

export default defineEventHandler((event) => {
  const eventId = getRouterParam(event, 'eventId')
  
  if (!eventId) {
    throw createError({
      statusCode: 400,
      message: 'Event ID required'
    })
  }

  // Get all registrations for event
  const registrations = db.getRegistrationsByEventId(eventId)
  
  // Filter only checked in
  const checkedIn = registrations
    .filter(r => r.checked_in_at)
    .map(r => {
      const user = db.getUserById(r.user_id)
      const eventData = db.getEventById(r.event_id)
      const ticket = eventData?.tickets.find(t => t.id === r.ticket_id)
      
      return {
        id: r.id,
        participant_name: user?.full_name || 'Unknown',
        ticket_name: ticket?.name || 'Unknown',
        checked_in_at: r.checked_in_at
      }
    })

  return {
    data: checkedIn
  }
})
