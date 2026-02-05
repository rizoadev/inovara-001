<template>
  <div class="min-h-screen bg-[#0a0a0a] py-12">
    <div class="max-w-4xl mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-wider mb-2">CHECKOUT</h1>
        <p class="text-sm text-gray-400">Complete your registration</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
      </div>

      <div v-else-if="!event || !selectedTicket" class="border border-[#2a2a2a] bg-[#0d0d0d] p-12 text-center">
        <p class="text-gray-400">Invalid checkout session</p>
        <UButton color="green" class="mt-4" @click="navigateTo('/events')">
          BACK TO EVENTS
        </UButton>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form -->
        <div class="lg:col-span-2 space-y-6">
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <h2 class="text-xl font-bold mb-4">PARTICIPANT INFORMATION</h2>
            <form @submit.prevent="submitRegistration" class="space-y-4">
              <div>
                <label class="text-sm text-gray-400 mb-2 block">Full Name</label>
                <UInput v-model="form.full_name" size="lg" required />
              </div>
              <div>
                <label class="text-sm text-gray-400 mb-2 block">Email</label>
                <UInput v-model="form.email" type="email" size="lg" required />
              </div>
              <div>
                <label class="text-sm text-gray-400 mb-2 block">Phone</label>
                <UInput v-model="form.phone" size="lg" required />
              </div>
            </form>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6 sticky top-4">
            <h2 class="text-xl font-bold mb-4">ORDER SUMMARY</h2>
            
            <div class="space-y-4 mb-6">
              <div>
                <p class="text-sm text-gray-400">Event</p>
                <p class="font-bold">{{ event.title }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-400">Ticket</p>
                <p class="font-bold">{{ selectedTicket.name }}</p>
              </div>
              <div class="border-t border-[#2a2a2a] pt-4">
                <div class="flex justify-between items-center">
                  <p class="text-sm text-gray-400">Price</p>
                  <p class="text-xl font-bold">Rp {{ formatPrice(selectedTicket.price) }}</p>
                </div>
              </div>
            </div>

            <UButton 
              color="green" 
              size="lg" 
              block
              :loading="submitting"
              @click="submitRegistration"
            >
              PROCEED TO PAYMENT
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user } = useAuth()

const event = ref<any>(null)
const selectedTicket = ref<any>(null)
const loading = ref(true)
const submitting = ref(false)

const form = ref({
  full_name: user.value?.full_name || '',
  email: user.value?.email || '',
  phone: user.value?.phone || ''
})

const formatPrice = (price: number) => {
  return price.toLocaleString('id-ID')
}

const submitRegistration = async () => {
  submitting.value = true
  try {
    const response = await $fetch('/api/registrations', {
      method: 'POST',
      body: {
        event_id: event.value.id,
        ticket_id: selectedTicket.value.id,
        ...form.value
      }
    })
    
    navigateTo(`/payment/pending?registration_id=${response.data.id}`)
  } catch (error) {
    console.error('Failed to create registration:', error)
    alert('Failed to create registration')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    const eventSlug = route.query.event as string
    const ticketId = route.query.ticket as string
    
    if (!eventSlug || !ticketId) {
      navigateTo('/events')
      return
    }
    
    const response = await $fetch(`/api/events/${eventSlug}`)
    event.value = response.data
    selectedTicket.value = event.value.tickets.find((t: any) => t.id === ticketId)
  } catch (error) {
    console.error('Failed to load checkout:', error)
  } finally {
    loading.value = false
  }
})
</script>
