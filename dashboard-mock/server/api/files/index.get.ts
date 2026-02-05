import { db } from '../../utils/db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  
  let registrations = db.getRegistrations()
  
  // Filter by event
  if (query.event_id) {
    registrations = registrations.filter(r => r.event_id === query.event_id)
  }
  
  // Filter by user
  if (query.user_id) {
    registrations = registrations.filter(r => r.user_id === query.user_id)
  }

  // Collect all files with metadata
  const files: any[] = []
  
  registrations.forEach(reg => {
    if (reg.files && reg.files.length > 0) {
      const user = db.getUserById(reg.user_id)
      const eventData = db.getEventById(reg.event_id)
      
      reg.files.forEach((file: any) => {
        files.push({
          ...file,
          registration_id: reg.id,
          user_name: user?.full_name || 'Unknown',
          user_email: user?.email || 'Unknown',
          event_title: eventData?.title || 'Unknown'
        })
      })
    }
  })

  return {
    data: files
  }
})
