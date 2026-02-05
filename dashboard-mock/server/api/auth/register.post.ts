import { db, generateId, generatePassword, generateToken } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  if (!body.email || !body.full_name || !body.phone) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }

  // Check if user exists
  const existingUser = db.getUserByEmail(body.email)
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'Email already registered'
    })
  }

  // Create user
  const password = generatePassword()
  const user = {
    id: generateId('usr'),
    email: body.email,
    password: password,
    full_name: body.full_name,
    phone: body.phone,
    role: 'user',
    is_active: true,
    created_at: new Date().toISOString()
  }

  db.createUser(user)

  // Generate tokens
  const accessToken = generateToken(user.id)
  const refreshToken = generateToken(user.id)

  return {
    id: user.id,
    email: user.email,
    password: password, // In real app, this would be sent via email
    tokens: {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }
})
