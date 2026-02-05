<template>
  <div>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-wider mb-2">EVENTS MANAGEMENT</h1>
          <p class="text-sm text-gray-400">Manage all events and tickets</p>
        </div>
        <UButton color="green" @click="createEvent">
          <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
          CREATE EVENT
        </UButton>
      </div>

      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
      </div>

      <div v-else-if="events.length === 0" class="border border-[#2a2a2a] bg-[#0d0d0d] p-12 text-center">
        <p class="text-gray-400">No events found</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="event in events" 
          :key="event.id"
          class="border border-[#2a2a2a] bg-[#0d0d0d] p-6 hover:border-green-500 transition-colors cursor-pointer"
          @click="navigateTo(`/admin/events/${event.id}`)"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <div v-if="event.image" class="w-full md:w-48 h-32 bg-[#151515] border border-[#2a2a2a]">
              <img :src="event.image" :alt="event.title" class="w-full h-full object-cover" />
            </div>

            <div class="flex-1">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-xl font-bold mb-1">{{ event.title }}</h3>
                  <p class="text-sm text-gray-400 line-clamp-2">{{ event.description }}</p>
                </div>
                <span 
                  class="px-3 py-1 text-xs font-bold uppercase"
                  :class="event.is_active ? 'bg-green-900 text-green-500' : 'bg-gray-800 text-gray-500'"
                >
                  {{ event.is_active ? 'ACTIVE' : 'INACTIVE' }}
                </span>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p class="text-gray-500 text-xs mb-1">DATE</p>
                  <p class="font-mono">{{ formatDate(event.event_date) }}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-xs mb-1">LOCATION</p>
                  <p class="truncate">{{ event.location }}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-xs mb-1">TICKETS</p>
                  <p>{{ event.tickets?.length || 0 }} types</p>
                </div>
                <div>
                  <p class="text-gray-500 text-xs mb-1">REGISTRATIONS</p>
                  <p class="text-green-500 font-bold">{{ getEventStats(event.id).registrations }}</p>
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

const { getEvents } = useApi()

const events = ref<any[]>([])
const loading = ref(true)
const eventStats = ref<Record<string, any>>({})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getEventStats = (eventId: string) => {
  return eventStats.value[eventId] || { registrations: 0, revenue: 0 }
}

const createEvent = () => {
  // TODO: Open create event modal
  alert('Create event feature coming soon')
}

onMounted(async () => {
  try {
    const response = await getEvents()
    events.value = response.data || []

    // Load stats for each event
    // In real app, this would be a single API call
    for (const event of events.value) {
      eventStats.value[event.id] = {
        registrations: Math.floor(Math.random() * 50),
        revenue: Math.floor(Math.random() * 10000000)
      }
    }
  } catch (error) {
    console.error('Failed to load events:', error)
  } finally {
    loading.value = false
  }
})
</script>
