<template>
  <div>
      <div class="container mx-auto px-4 py-12">
        <div v-if="loading" class="text-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
        </div>

        <div v-else-if="!event" class="text-center py-12">
          <UIcon name="i-heroicons-exclamation-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p class="text-gray-400 mb-4">Event not found</p>
          <UButton color="green" @click="navigateTo('/events')">
            BACK TO EVENTS
          </UButton>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Event Details -->
          <div class="lg:col-span-2">
            <div class="h-64 bg-[#151515] flex items-center justify-center mb-6 border border-[#2a2a2a]">
              <UIcon name="i-heroicons-photo" class="w-24 h-24 text-gray-700" />
            </div>

            <h1 class="text-4xl font-bold mb-4">{{ event.title }}</h1>

            <div class="flex flex-wrap gap-4 mb-6 text-sm">
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
                {{ formatDate(event.event_date) }}
              </div>
              <div class="flex items-center gap-2 text-gray-400">
                <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
                {{ event.location }}
              </div>
            </div>

            <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6 mb-6">
              <h2 class="text-xl font-bold mb-4">ABOUT THIS EVENT</h2>
              <p class="text-gray-400 leading-relaxed">
                {{ event.description }}
              </p>
            </div>
          </div>

          <!-- Registration Form -->
          <div class="lg:col-span-1">
            <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6 sticky top-4">
              <h2 class="text-xl font-bold mb-6">REGISTER NOW</h2>

              <form @submit.prevent="handleRegister" class="space-y-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Select Ticket</label>
                  <select 
                    v-model="selectedTicket" 
                    class="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-white"
                    required
                  >
                    <option value="">Choose ticket type...</option>
                    <option 
                      v-for="ticket in event.tickets" 
                      :key="ticket.id" 
                      :value="ticket.id"
                      :disabled="ticket.available <= 0"
                    >
                      {{ ticket.name }} - Rp {{ formatPrice(ticket.price) }}
                      ({{ ticket.available }} left)
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm text-gray-400 mb-2">Full Name</label>
                  <input 
                    v-model="form.full_name" 
                    type="text"
                    class="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm text-gray-400 mb-2">Email</label>
                  <input 
                    v-model="form.email" 
                    type="email"
                    class="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm text-gray-400 mb-2">Phone</label>
                  <input 
                    v-model="form.phone" 
                    type="tel"
                    class="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-white"
                    required
                  />
                </div>

                <div v-if="selectedTicket" class="pt-4 border-t border-[#2a2a2a]">
                  <div class="flex justify-between mb-2">
                    <span class="text-gray-400">Ticket Price</span>
                    <span class="font-bold">Rp {{ formatPrice(selectedTicketPrice) }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold text-green-500">
                    <span>Total</span>
                    <span>Rp {{ formatPrice(selectedTicketPrice) }}</span>
                  </div>
                </div>

                <UButton 
                  type="submit" 
                  color="green" 
                  size="lg" 
                  block
                  :loading="registering"
                  :disabled="!selectedTicket"
                >
                  PROCEED TO PAYMENT
                </UButton>
              </form>
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

const route = useRoute()
const { getEvent, createRegistration } = useApi()

const event = ref<any>(null)
const loading = ref(true)
const registering = ref(false)

const selectedTicket = ref('')
const form = ref({
  full_name: '',
  email: '',
  phone: ''
})

const selectedTicketPrice = computed(() => {
  if (!selectedTicket.value || !event.value) return 0
  const ticket = event.value.tickets.find((t: any) => t.id === selectedTicket.value)
  return ticket?.price || 0
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  return price.toLocaleString('id-ID')
}

const handleRegister = async () => {
  if (!selectedTicket.value) return

  registering.value = true
  try {
    const response = await createRegistration({
      event_id: event.value.id,
      ticket_id: selectedTicket.value,
      participant: form.value
    })

    // Redirect to payment page
    navigateTo(response.payment.redirect_url)
  } catch (error: any) {
    alert('Registration failed: ' + (error.message || 'Unknown error'))
  } finally {
    registering.value = false
  }
}

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    event.value = await getEvent(slug)
  } catch (error) {
    console.error('Failed to load event:', error)
  } finally {
    loading.value = false
  }
})
</script>
