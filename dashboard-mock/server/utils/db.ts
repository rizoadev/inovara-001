// Mock database using JSON files
import eventsData from '../../mock-data/events.json'
import usersData from '../../mock-data/users.json'
import registrationsData from '../../mock-data/registrations.json'

// In-memory storage (resets on server restart)
let events = [...eventsData]
let users = [...usersData]
let registrations = [...registrationsData]

export const db = {
  // Events
  getEvents: () => events,
  getEventById: (id: string) => events.find(e => e.id === id),
  getEventBySlug: (slug: string) => events.find(e => e.slug === slug),
  createEvent: (event: any) => {
    events.push(event)
    return event
  },
  updateEvent: (id: string, data: any) => {
    const index = events.findIndex(e => e.id === id)
    if (index !== -1) {
      events[index] = { ...events[index], ...data }
      return events[index]
    }
    return null
  },

  // Users
  getUsers: () => users,
  getUserById: (id: string) => users.find(u => u.id === id),
  getUserByEmail: (email: string) => users.find(u => u.email === email),
  createUser: (user: any) => {
    users.push(user)
    return user
  },
  updateUser: (id: string, data: any) => {
    const index = users.findIndex(u => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...data }
      return users[index]
    }
    return null
  },

  // Registrations
  getRegistrations: () => registrations,
  getRegistrationById: (id: string) => registrations.find(r => r.id === id),
  getRegistrationsByUserId: (userId: string) => registrations.filter(r => r.user_id === userId),
  getRegistrationsByEventId: (eventId: string) => registrations.filter(r => r.event_id === eventId),
  getRegistrationByQR: (qrCode: string) => registrations.find(r => r.qr_code === qrCode),
  createRegistration: (registration: any) => {
    registrations.push(registration)
    return registration
  },
  updateRegistration: (id: string, data: any) => {
    const index = registrations.findIndex(r => r.id === id)
    if (index !== -1) {
      registrations[index] = { ...registrations[index], ...data }
      return registrations[index]
    }
    return null
  },

  // Helper: Get registration with full details
  getRegistrationWithDetails: (id: string) => {
    const reg = registrations.find(r => r.id === id)
    if (!reg) return null

    const event = events.find(e => e.id === reg.event_id)
    const user = users.find(u => u.id === reg.user_id)
    const ticket = event?.tickets.find(t => t.id === reg.ticket_id)

    return {
      ...reg,
      event,
      user,
      ticket
    }
  }
}

// Helper functions
export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function generatePassword() {
  return Math.random().toString(36).slice(-8)
}

export function generateQRCode(eventId: string, regId: string) {
  return `EVTHUB-${eventId}-${regId}`
}

export function generateToken(userId: string) {
  return `token_${userId}_${Date.now()}`
}
