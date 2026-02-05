import { db, generateToken } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password required'
    })
  }

  // Find user
  const user = db.getUserByEmail(body.email)
  if (!user || user.password !== body.password) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  // Generate tokens
  const accessToken = generateToken(user.id)
  const refreshToken = generateToken(user.id)

  return {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    },
    tokens: {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }
})
