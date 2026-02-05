import { db } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.qr_code) {
    throw createError({
      statusCode: 400,
      message: 'QR code required'
    })
  }

  // Find registration by QR code
  const registration = db.getRegistrationByQR(body.qr_code)
  
  if (!registration) {
    return {
      valid: false,
      reason: 'qr_invalid',
      message: 'Invalid QR code'
    }
  }

  // Check if paid
  if (registration.status !== 'paid') {
    return {
      valid: false,
      reason: 'not_paid',
      message: 'Payment not confirmed'
    }
  }

  // Check if already checked in
  if (registration.checked_in_at) {
    return {
      valid: false,
      reason: 'already_checked_in',
      checked_in_at: registration.checked_in_at,
      message: 'Already checked in'
    }
  }

  // Get details
  const eventData = db.getEventById(registration.event_id)
  const user = db.getUserById(registration.user_id)
  const ticket = eventData?.tickets.find(t => t.id === registration.ticket_id)

  // Record check-in
  const checkedInAt = new Date().toISOString()
  db.updateRegistration(registration.id, {
    checked_in_at: checkedInAt
  })

  return {
    valid: true,
    registration: {
      id: registration.id,
      participant_name: user?.full_name || 'Unknown',
      ticket_name: ticket?.name || 'Unknown',
      status: registration.status,
      event_title: eventData?.title || 'Unknown'
    },
    checked_in_at: checkedInAt
  }
})
