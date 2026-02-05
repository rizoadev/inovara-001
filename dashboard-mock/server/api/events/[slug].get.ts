import { db } from '../../utils/db'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug required'
    })
  }

  const eventData = db.getEventBySlug(slug)
  
  if (!eventData) {
    throw createError({
      statusCode: 404,
      message: 'Event not found'
    })
  }

  return {
    ...eventData,
    tickets: eventData.tickets.map(t => ({
      ...t,
      available: t.quota - t.sold
    }))
  }
})
