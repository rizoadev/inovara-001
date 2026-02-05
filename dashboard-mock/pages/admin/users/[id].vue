<template>
  <div>
    <div class="space-y-6">
      <div class="flex items-center gap-4 mb-6">
        <UButton color="gray" icon="i-heroicons-arrow-left" @click="navigateTo('/admin/users')">
          BACK
        </UButton>
        <div class="flex-1">
          <h1 class="text-3xl font-bold tracking-wider">USER DETAIL</h1>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
      </div>

      <div v-else-if="!user" class="border border-[#2a2a2a] bg-[#0d0d0d] p-12 text-center">
        <p class="text-gray-400">User not found</p>
      </div>

      <div v-else class="space-y-6">
        <!-- User Info -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-2xl font-bold">{{ user.full_name }}</h2>
            <span 
              class="px-3 py-1 text-xs font-bold uppercase"
              :class="{
                'bg-purple-900 text-purple-500': user.role === 'admin',
                'bg-blue-900 text-blue-500': user.role === 'user'
              }"
            >
              {{ user.role }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div>
                <p class="text-gray-500 text-xs mb-1">EMAIL</p>
                <p>{{ user.email }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs mb-1">PHONE</p>
                <p>{{ user.phone || '-' }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div>
                <p class="text-gray-500 text-xs mb-1">USER ID</p>
                <p class="font-mono text-sm text-gray-400">{{ user.id }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs mb-1">CREATED AT</p>
                <p>{{ formatDate(user.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <p class="text-xs text-gray-500 uppercase mb-2">Total Registrations</p>
            <p class="text-3xl font-bold">{{ registrations.length }}</p>
          </div>
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <p class="text-xs text-gray-500 uppercase mb-2">Paid</p>
            <p class="text-3xl font-bold text-green-500">
              {{ registrations.filter(r => r.status === 'paid').length }}
            </p>
          </div>
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <p class="text-xs text-gray-500 uppercase mb-2">Total Spent</p>
            <p class="text-2xl font-bold">
              Rp {{ formatPrice(totalSpent) }}
            </p>
          </div>
        </div>

        <!-- Registrations -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">REGISTRATIONS</h2>
          
          <div v-if="registrations.length === 0" class="text-center py-8 text-gray-500">
            No registrations yet
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="reg in registrations" 
              :key="reg.id"
              class="border border-[#1a1a1a] bg-[#0a0a0a] p-4"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold">{{ reg.event?.title }}</h3>
                  <p class="text-sm text-gray-400">{{ reg.ticket?.name }}</p>
                </div>
                <div class="text-right">
                  <span 
                    class="px-2 py-1 text-xs uppercase"
                    :class="{
                      'bg-green-900 text-green-500': reg.status === 'paid',
                      'bg-yellow-900 text-yellow-500': reg.status === 'pending'
                    }"
                  >
                    {{ reg.status }}
                  </span>
                  <p class="text-sm text-gray-500 mt-1">Rp {{ formatPrice(reg.amount) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const route = useRoute()

const user = ref<any>(null)
const registrations = ref<any[]>([])
const loading = ref(true)

const totalSpent = computed(() => {
  return registrations.value
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.amount, 0)
})

const formatPrice = (price: number) => {
  return price.toLocaleString('id-ID')
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(async () => {
  try {
    const userId = route.params.id as string
    const response = await $fetch(`/api/users/${userId}`)
    
    user.value = response.user
    registrations.value = response.registrations || []
  } catch (error) {
    console.error('Failed to load user:', error)
  } finally {
    loading.value = false
  }
})
</script>
