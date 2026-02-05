import { db } from '../../utils/db'

export default defineEventHandler((event) => {
  // Admin only endpoint
  const users = db.getUsers()
  
  // Get registration counts for each user
  const usersWithStats = users.map(user => {
    const registrations = db.getRegistrationsByUserId(user.id)
    
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      stats: {
        total_registrations: registrations.length,
        paid_registrations: registrations.filter(r => r.status === 'paid').length,
        checked_in: registrations.filter(r => r.checked_in_at).length
      }
    }
  })

  return {
    data: usersWithStats
  }
})
