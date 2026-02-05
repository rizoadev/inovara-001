export const useApi = () => {
  const { token } = useAuth()

  const fetchWithAuth = async (url: string, options: any = {}) => {
    const headers: any = {
      ...options.headers
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    return $fetch(url, {
      ...options,
      headers
    })
  }

  // Events
  const getEvents = () => $fetch('/api/events')
  const getEvent = (slug: string) => $fetch(`/api/events/${slug}`)

  // Registrations
  const createRegistration = (data: any) => 
    $fetch('/api/registrations', {
      method: 'POST',
      body: data
    })

  const getMyRegistrations = () => fetchWithAuth('/api/registrations/me')
  const getRegistration = (id: string) => $fetch(`/api/registrations/${id}`)

  // Payments
  const simulatePayment = (registrationId: string, status: 'settlement' | 'expire' | 'cancel' = 'settlement') =>
    $fetch('/api/payments/webhook', {
      method: 'POST',
      body: {
        order_id: `PAY-${registrationId}`,
        transaction_status: status
      }
    })

  // Check-ins
  const scanQR = (qrCode: string) =>
    fetchWithAuth('/api/checkins/scan', {
      method: 'POST',
      body: { qr_code: qrCode }
    })

  const getEventCheckins = (eventId: string) =>
    fetchWithAuth(`/api/checkins/event/${eventId}`)

  // Files
  const uploadFile = (data: any) =>
    fetchWithAuth('/api/files/upload', {
      method: 'POST',
      body: data
    })

  const getFiles = (params?: { event_id?: string; user_id?: string }) =>
    fetchWithAuth(`/api/files?${new URLSearchParams(params as any).toString()}`)

  const deleteFile = (fileId: string) =>
    fetchWithAuth(`/api/files/${fileId}`, {
      method: 'DELETE'
    })

  // Users (Admin)
  const getUsers = () => fetchWithAuth('/api/users')
  const getUser = (userId: string) => fetchWithAuth(`/api/users/${userId}`)

  // Reports (Admin)
  const getEventReport = (eventId: string) =>
    fetchWithAuth(`/api/reports/event/${eventId}`)

  return {
    // Events
    getEvents,
    getEvent,
    
    // Registrations
    createRegistration,
    getMyRegistrations,
    getRegistration,
    
    // Payments
    simulatePayment,
    
    // Check-ins
    scanQR,
    getEventCheckins,
    
    // Files
    uploadFile,
    getFiles,
    deleteFile,
    
    // Users
    getUsers,
    getUser,
    
    // Reports
    getEventReport
  }
}
