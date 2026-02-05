import { db, generateId, generateQRCode, generatePassword } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate
  if (!body.event_id || !body.ticket_id || !body.participant) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }

  const { email, full_name, phone } = body.participant

  // Check if event exists
  const eventData = db.getEventById(body.event_id)
  if (!eventData) {
    throw createError({
      statusCode: 404,
      message: 'Event not found'
    })
  }

  // Check if ticket exists
  const ticket = eventData.tickets.find(t => t.id === body.ticket_id)
  if (!ticket) {
    throw createError({
      statusCode: 404,
      message: 'Ticket not found'
    })
  }

  // Check quota
  if (ticket.sold >= ticket.quota) {
    throw createError({
      statusCode: 400,
      message: 'Ticket sold out'
    })
  }

  // Get or create user
  let user = db.getUserByEmail(email)
  if (!user) {
    const password = generatePassword()
    user = {
      id: generateId('usr'),
      email,
      password,
      full_name,
      phone,
      role: 'user',
      is_active: true,
      created_at: new Date().toISOString()
    }
    db.createUser(user)
  }

  // Create registration
  const regId = generateId('reg')
  const registration = {
    id: regId,
    user_id: user.id,
    event_id: body.event_id,
    ticket_id: body.ticket_id,
    qr_code: generateQRCode(body.event_id, regId),
    status: 'pending',
    amount: ticket.price,
    payment_ref: `PAY-${regId}`,
    paid_at: null,
    checked_in_at: null,
    created_at: new Date().toISOString(),
    files: []
  }

  db.createRegistration(registration)

  // Mock payment URL
  const paymentUrl = `/payment/pending?registration_id=${regId}`
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

  return {
    registration_id: regId,
    amount: ticket.price,
    payment: {
      redirect_url: paymentUrl,
      expires_at: expiresAt
    }
  }
})
