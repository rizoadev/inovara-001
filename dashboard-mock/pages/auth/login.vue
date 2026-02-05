<template>
  <div>
      <div class="container mx-auto px-4 py-20">
        <div class="max-w-md mx-auto">
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-8">
            <h1 class="text-3xl font-bold tracking-wider mb-2 text-center">LOGIN</h1>
            <p class="text-sm text-gray-400 text-center mb-8">
              Access your tickets and registrations
            </p>

            <form @submit.prevent="handleLogin" class="space-y-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Email</label>
                <input 
                  v-model="form.email" 
                  type="email"
                  class="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label class="block text-sm text-gray-400 mb-2">Password</label>
                <input 
                  v-model="form.password" 
                  type="password"
                  class="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div v-if="error" class="bg-red-900/30 border border-red-500 px-4 py-3 text-sm text-red-400">
                {{ error }}
              </div>

              <UButton 
                type="submit" 
                color="green" 
                size="lg" 
                block
                :loading="loading"
              >
                LOGIN
              </UButton>
            </form>

            <div class="mt-6 pt-6 border-t border-[#2a2a2a] text-center text-sm text-gray-400">
              <p>Password sent to your email after registration</p>
            </div>

            <div class="mt-4 p-4 bg-[#0a0a0a] border border-[#2a2a2a]">
              <p class="text-xs text-gray-500 mb-2">Demo Accounts:</p>
              <div class="space-y-1 text-xs font-mono">
                <div class="text-green-500">Admin: admin@eventhub.id / admin123</div>
                <div class="text-blue-500">User: john@example.com / pass123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { login, isAuthenticated, isAdmin } = useAuth()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

// Redirect if already logged in
watchEffect(() => {
  if (isAuthenticated.value) {
    if (isAdmin.value) {
      navigateTo('/admin')
    } else {
      navigateTo('/dashboard')
    }
  }
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await login(form.value.email, form.value.password)
    // Redirect handled by watchEffect
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
