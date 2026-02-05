<template>
  <div>
    <div class="space-y-6">
      <div class="flex items-center gap-4 mb-6">
        <UButton color="gray" icon="i-heroicons-arrow-left" @click="navigateTo('/admin/events')">
          BACK
        </UButton>
        <div class="flex-1">
          <h1 class="text-3xl font-bold tracking-wider">EVENT DETAIL</h1>
        </div>
        <UButton color="green" @click="editEvent">
          <UIcon name="i-heroicons-pencil" class="w-4 h-4 mr-2" />
          EDIT
        </UButton>
      </div>

      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
      </div>

      <div v-else-if="!event" class="border border-[#2a2a2a] bg-[#0d0d0d] p-12 text-center">
        <p class="text-gray-400">Event not found</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Event Info -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <div class="flex items-start justify-between mb-4">
            <h2 class="text-2xl font-bold">{{ event.title }}</h2>
            <span 
              class="px-3 py-1 text-xs font-bold uppercase"
              :class="event.is_active ? 'bg-green-900 text-green-500' : 'bg-gray-800 text-gray-500'"
            >
              {{ event.is_active ? 'ACTIVE' : 'INACTIVE' }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-gray-500 text-xs mb-2">DESCRIPTION</p>
              <p class="text-sm">{{ event.description }}</p>
            </div>
            <div class="space-y-3">
              <div>
                <p class="text-gray-500 text-xs mb-1">DATE & TIME</p>
                <p class="font-mono">{{ formatDateTime(event.event_date) }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs mb-1">LOCATION</p>
                <p>{{ event.location }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs mb-1">SLUG</p>
                <p class="font-mono text-sm text-gray-400">{{ event.slug }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tickets -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">TICKETS</h2>
          <div class="space-y-3">
            <div 
              v-for="ticket in event.tickets" 
              :key="ticket.id"
              class="border border-[#1a1a1a] bg-[#0a0a0a] p-4"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold">{{ ticket.name }}</h3>
                  <p class="text-sm text-gray-400">Rp {{ formatPrice(ticket.price) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500">Quota</p>
                  <p class="font-bold">
                    <span class="text-green-500">{{ ticket.sold || 0 }}</span> / {{ ticket.quota }}
                  </p>
                </div>
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
            <p class="text-xs text-gray-500 uppercase mb-2">Checked In</p>
            <p class="text-3xl font-bold text-green-500">
              {{ registrations.filter(r => r.checked_in_at).length }}
            </p>
          </div>
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <p class="text-xs text-gray-500 uppercase mb-2">Revenue</p>
            <p class="text-2xl font-bold">
              Rp {{ formatPrice(totalRevenue) }}
            </p>
          </div>
        </div>

        <!-- Registrations -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">REGISTRATIONS</h2>
          
          <div v-if="registrations.length === 0" class="text-center py-8 text-gray-500">
            No registrations yet
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="border-b border-[#2a2a2a]">
                <tr class="text-left text-gray-500">
                  <th class="pb-3 font-normal">Participant</th>
                  <th class="pb-3 font-normal">Ticket</th>
                  <th class="pb-3 font-normal">Status</th>
                  <th class="pb-3 font-normal">Amount</th>
                  <th class="pb-3 font-normal">Check-in</th>
                  <th class="pb-3 font-normal">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="reg in registrations" 
                  :key="reg.id"
                  class="border-b border-[#1a1a1a]"
                >
                  <td class="py-3">{{ reg.user?.full_name || '-' }}</td>
                  <td class="py-3">{{ reg.ticket?.name || '-' }}</td>
                  <td class="py-3">
                    <span 
                      class="px-2 py-1 text-xs uppercase"
                      :class="{
                        'bg-green-900 text-green-500': reg.status === 'paid',
                        'bg-yellow-900 text-yellow-500': reg.status === 'pending'
                      }"
                    >
                      {{ reg.status }}
                    </span>
                  </td>
                  <td class="py-3">Rp {{ formatPrice(reg.amount) }}</td>
                  <td class="py-3">
                    <span v-if="reg.checked_in_at" class="text-green-500">
                      <UIcon name="i-heroicons-check-circle" class="w-4 h-4 inline" />
                      {{ formatDate(reg.checked_in_at) }}
                    </span>
                    <span v-else class="text-gray-500">-</span>
                  </td>
                  <td class="py-3 text-gray-500">{{ formatDate(reg.created_at) }}</td>
                </tr>
              </tbody>
            </table>
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
const { getEventBySlug } = useApi()

const event = ref<any>(null)
const registrations = ref<any[]>([])
const loading = ref(true)

const totalRevenue = computed(() => {
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
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editEvent = () => {
  alert('Edit event feature coming soon')
}

onMounted(async () => {
  try {
    const eventId = route.params.id as string
    
    // Load event
    const eventsResponse = await $fetch('/api/events')
    event.value = eventsResponse.data.find((e: any) => e.id === eventId)

    if (event.value) {
      // Load registrations for this event
      const usersResponse = await $fetch('/api/users')
      const allRegs: any[] = []
      
      for (const user of usersResponse.data) {
        const userDetail = await $fetch(`/api/users/${user.id}`)
        if (userDetail.registrations) {
          const eventRegs = userDetail.registrations
            .filter((r: any) => r.event_id === eventId)
            .map((r: any) => ({
              ...r,
              user: { full_name: user.full_name, email: user.email }
            }))
          allRegs.push(...eventRegs)
        }
      }
      
      registrations.value = allRegs
    }
  } catch (error) {
    console.error('Failed to load event:', error)
  } finally {
    loading.value = false
  }
})
</script>
