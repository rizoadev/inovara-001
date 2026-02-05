<template>
  <div>
      <!-- Hero Section -->
      <section class="border-b border-[#2a2a2a] bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a]">
        <div class="container mx-auto px-4 py-20 text-center">
          <h1 class="text-5xl md:text-6xl font-bold tracking-wider mb-6">
            <span class="text-white">EVENT</span>
            <span class="text-green-500">HUB</span>
          </h1>
          <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Register for events online, get QR code tickets, and check-in seamlessly
          </p>
          <UButton 
            size="xl" 
            color="green"
            @click="navigateTo('/events')"
          >
            BROWSE EVENTS
          </UButton>
        </div>
      </section>

      <!-- Features Section -->
      <section class="container mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold tracking-wider text-center mb-12">
          HOW IT WORKS
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-900/30">
              <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 text-green-500" />
            </div>
            <h3 class="text-xl font-bold mb-2">1. BROWSE EVENTS</h3>
            <p class="text-gray-400 text-sm">
              Find events that interest you and select your ticket type
            </p>
          </div>

          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-900/30">
              <UIcon name="i-heroicons-credit-card" class="w-8 h-8 text-green-500" />
            </div>
            <h3 class="text-xl font-bold mb-2">2. PAY ONLINE</h3>
            <p class="text-gray-400 text-sm">
              Secure payment via Midtrans or Xendit payment gateway
            </p>
          </div>

          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-900/30">
              <UIcon name="i-heroicons-qr-code" class="w-8 h-8 text-green-500" />
            </div>
            <h3 class="text-xl font-bold mb-2">3. GET QR TICKET</h3>
            <p class="text-gray-400 text-sm">
              Receive your QR code ticket via email and check-in at the venue
            </p>
          </div>
        </div>
      </section>

      <!-- Upcoming Events Preview -->
      <section class="container mx-auto px-4 py-16">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold tracking-wider">
            UPCOMING EVENTS
          </h2>
          <UButton 
            color="gray" 
            variant="ghost"
            @click="navigateTo('/events')"
          >
            VIEW ALL
          </UButton>
        </div>

        <div v-if="loading" class="text-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="event in events.slice(0, 3)" 
            :key="event.id"
            class="border border-[#2a2a2a] bg-[#0d0d0d] hover:border-green-500 transition cursor-pointer"
            @click="navigateTo(`/events/${event.slug}`)"
          >
            <div class="h-48 bg-[#151515] flex items-center justify-center">
              <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-700" />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
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
              <div class="flex items-center justify-between">
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
      </section>
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
    year: 'numeric'
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
