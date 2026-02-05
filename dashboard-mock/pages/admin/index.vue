<template>
  <div>
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold tracking-wider mb-2">ADMIN OVERVIEW</h1>
          <p class="text-sm text-gray-400">System statistics and quick actions</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs text-gray-500 uppercase tracking-wider">Total Events</h3>
              <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-green-500" />
            </div>
            <p class="text-3xl font-bold">{{ stats.totalEvents }}</p>
          </div>

          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs text-gray-500 uppercase tracking-wider">Total Users</h3>
              <UIcon name="i-heroicons-users" class="w-5 h-5 text-blue-500" />
            </div>
            <p class="text-3xl font-bold">{{ stats.totalUsers }}</p>
          </div>

          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs text-gray-500 uppercase tracking-wider">Registrations</h3>
              <UIcon name="i-heroicons-ticket" class="w-5 h-5 text-yellow-500" />
            </div>
            <p class="text-3xl font-bold">{{ stats.totalRegistrations }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stats.paidRegistrations }} paid</p>
          </div>

          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs text-gray-500 uppercase tracking-wider">Revenue</h3>
              <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-green-500" />
            </div>
            <p class="text-2xl font-bold">Rp {{ formatPrice(stats.totalRevenue) }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">QUICK ACTIONS</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UButton 
              color="green" 
              size="lg" 
              block
              @click="navigateTo('/admin/scan')"
            >
              <UIcon name="i-heroicons-qr-code" class="w-5 h-5 mr-2" />
              SCAN QR CODE
            </UButton>
            <UButton 
              color="blue" 
              size="lg" 
              block
              @click="navigateTo('/admin/events')"
            >
              <UIcon name="i-heroicons-calendar" class="w-5 h-5 mr-2" />
              MANAGE EVENTS
            </UButton>
            <UButton 
              color="gray" 
              size="lg" 
              block
              @click="navigateTo('/admin/reports')"
            >
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 mr-2" />
              VIEW REPORTS
            </UButton>
          </div>
        </div>

        <!-- Recent Registrations -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">RECENT REGISTRATIONS</h2>
          
          <div v-if="loadingRegs" class="text-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-green-500" />
          </div>

          <div v-else-if="recentRegistrations.length === 0" class="text-center py-8 text-gray-500">
            No registrations yet
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="border-b border-[#2a2a2a]">
                <tr class="text-left text-gray-500">
                  <th class="pb-3 font-normal">ID</th>
                  <th class="pb-3 font-normal">Event</th>
                  <th class="pb-3 font-normal">Participant</th>
                  <th class="pb-3 font-normal">Status</th>
                  <th class="pb-3 font-normal">Amount</th>
                  <th class="pb-3 font-normal">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="reg in recentRegistrations.slice(0, 10)" 
                  :key="reg.id"
                  class="border-b border-[#1a1a1a]"
                >
                  <td class="py-3 font-mono text-xs">{{ reg.id.substring(0, 12) }}...</td>
                  <td class="py-3">{{ reg.event?.title || '-' }}</td>
                  <td class="py-3">{{ reg.user?.full_name || '-' }}</td>
                  <td class="py-3">
                    <span 
                      class="px-2 py-1 text-xs uppercase"
                      :class="{
                        'bg-green-900 text-green-500': reg.status === 'paid',
                        'bg-yellow-900 text-yellow-500': reg.status === 'pending',
                        'bg-red-900 text-red-500': reg.status === 'cancelled'
                      }"
                    >
                      {{ reg.status }}
                    </span>
                  </td>
                  <td class="py-3">Rp {{ formatPrice(reg.amount) }}</td>
                  <td class="py-3 text-gray-500">{{ formatDate(reg.created_at) }}</td>
                </tr>
              </tbody>
            </table>
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

const { getUsers } = useApi()

const stats = ref({
  totalEvents: 0,
  totalUsers: 0,
  totalRegistrations: 0,
  paidRegistrations: 0,
  totalRevenue: 0
})

const recentRegistrations = ref<any[]>([])
const loadingRegs = ref(true)

const formatPrice = (price: number) => {
  return price.toLocaleString('id-ID')
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  try {
    // Load stats from mock data
    const eventsData = await $fetch('/api/events')
    const usersData = await getUsers()
    
    // Calculate stats from registrations
    const allRegs: any[] = []
    for (const user of usersData.data) {
      const userRegs = await $fetch(`/api/users/${user.id}`)
      if (userRegs.registrations) {
        allRegs.push(...userRegs.registrations.map((r: any) => ({
          ...r,
          user: { full_name: user.full_name, email: user.email }
        })))
      }
    }

    stats.value = {
      totalEvents: eventsData.data.length,
      totalUsers: usersData.data.length,
      totalRegistrations: allRegs.length,
      paidRegistrations: allRegs.filter((r: any) => r.status === 'paid').length,
      totalRevenue: allRegs
        .filter((r: any) => r.status === 'paid')
        .reduce((sum: number, r: any) => sum + r.amount, 0)
    }

    recentRegistrations.value = allRegs.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } catch (error) {
    console.error('Failed to load stats:', error)
  } finally {
    loadingRegs.value = false
  }
})
</script>
