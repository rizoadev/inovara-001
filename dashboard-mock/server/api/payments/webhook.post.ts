import { db, generateQRCode } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Mock webhook from payment gateway
  const { order_id, transaction_status } = body
  
  if (!order_id) {
    throw createError({
      statusCode: 400,
      message: 'Order ID required'
    })
  }

  // Extract registration ID from order_id (format: PAY-reg-xxx)
  const regId = order_id.replace('PAY-', '')
  const registration = db.getRegistrationById(regId)
  
  if (!registration) {
    throw createError({
      statusCode: 404,
      message: 'Registration not found'
    })
  }

  // Update status based on transaction status
  if (transaction_status === 'settlement' || transaction_status === 'capture') {
    db.updateRegistration(regId, {
      status: 'paid',
      paid_at: new Date().toISOString()
    })
  } else if (transaction_status === 'expire') {
    db.updateRegistration(regId, {
      status: 'expired'
    })
  } else if (transaction_status === 'deny' || transaction_status === 'cancel') {
    db.updateRegistration(regId, {
      status: 'cancelled'
    })
  }

  return {
    status: 'ok'
  }
})
