<template>
  <div>
      <div class="container mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold tracking-wider mb-8">UPCOMING EVENTS</h1>

        <div v-if="loading" class="text-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
        </div>

        <div v-else-if="events.length === 0" class="text-center py-12">
          <UIcon name="i-heroicons-calendar-days" class="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p class="text-gray-400">No events available</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="event in events" 
            :key="event.id"
            class="border border-[#2a2a2a] bg-[#0d0d0d] hover:border-green-500 transition cursor-pointer"
            @click="navigateTo(`/events/${event.slug}`)"
          >
            <div class="h-48 bg-[#151515] flex items-center justify-center">
              <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-700" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
              <p class="text-sm text-gray-400 mb-4 line-clamp-2">
                {{ event.description }}
              </p>
              <div class="space-y-2 text-sm text-gray-400 mb-4">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                  {{ formatDate(event.event_date) }}
                </div>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                  {{ event.location }}
                </div>
              </div>
              <div class="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                <span class="text-green-500 font-bold">
                  From Rp {{ formatPrice(event.tickets[0]?.price || 0) }}
                </span>
                <UButton size="sm" color="green">
                  REGISTER
                </UButton>
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

const { getEvents } = useApi()
const events = ref<any[]>([])
const loading = ref(true)

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  return price.toLocaleString('id-ID')
}

onMounted(async () => {
  try {
    const response = await getEvents()
    events.value = response.data || []
  } catch (error) {
    console.error('Failed to load events:', error)
  } finally {
    loading.value = false
  }
})
</script>
