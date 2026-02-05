export const useAuth = () => {
  const user = useState('user', () => null as any)
  const token = useState('token', () => '')

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      user.value = response.user
      token.value = response.tokens.access_token

      // Store in localStorage
      if (process.client) {
        localStorage.setItem('auth_token', response.tokens.access_token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
      }

      return response
    } catch (error: any) {
      throw new Error(error.data?.message || 'Login failed')
    }
  }

  const register = async (data: { email: string; full_name: string; phone: string }) => {
    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: data
      })

      user.value = {
        id: response.id,
        email: response.email,
        role: 'user'
      }
      token.value = response.tokens.access_token

      // Store in localStorage
      if (process.client) {
        localStorage.setItem('auth_token', response.tokens.access_token)
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }

      return response
    } catch (error: any) {
      throw new Error(error.data?.message || 'Registration failed')
    }
  }

  const logout = () => {
    user.value = null
    token.value = ''

    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }

    navigateTo('/auth/login')
  }

  const loadFromStorage = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    }
  }

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  return {
    user,
    token,
    login,
    register,
    logout,
    loadFromStorage,
    isAuthenticated,
    isAdmin
  }
}
