import { db } from '../../utils/db'

export default defineEventHandler((event) => {
  const events = db.getEvents()
  
  // Only return active events for public
  const activeEvents = events
    .filter(e => e.is_active)
    .map(e => ({
      ...e,
      tickets: e.tickets.map(t => ({
        ...t,
        available: t.quota - t.sold
      }))
    }))

  return {
    data: activeEvents
  }
})
