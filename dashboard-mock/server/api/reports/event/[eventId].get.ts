import { db } from '../../../utils/db'

export default defineEventHandler((event) => {
  const eventId = getRouterParam(event, 'eventId')
  
  if (!eventId) {
    throw createError({
      statusCode: 400,
      message: 'Event ID required'
    })
  }

  const eventData = db.getEventById(eventId)
  if (!eventData) {
    throw createError({
      statusCode: 404,
      message: 'Event not found'
    })
  }

  // Get all registrations for this event
  const registrations = db.getRegistrationsByEventId(eventId)
  
  // Calculate stats
  const totalRegistrations = registrations.length
  const paid = registrations.filter(r => r.status === 'paid').length
  const pending = registrations.filter(r => r.status === 'pending').length
  const checkedIn = registrations.filter(r => r.checked_in_at).length
  
  // Calculate revenue
  const revenue = registrations
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.amount, 0)
  
  // Group by ticket type
  const byTicket = eventData.tickets.map(ticket => {
    const ticketRegs = registrations.filter(r => 
      r.ticket_id === ticket.id && r.status === 'paid'
    )
    
    return {
      name: ticket.name,
      count: ticketRegs.length,
      revenue: ticketRegs.reduce((sum, r) => sum + r.amount, 0)
    }
  })

  return {
    event: {
      id: eventData.id,
      title: eventData.title,
      event_date: eventData.event_date,
      location: eventData.location
    },
    total_registrations: totalRegistrations,
    paid,
    pending,
    checked_in,
    revenue,
    by_ticket: byTicket
  }
})
