<template>
  <div>
      <div class="container mx-auto px-4 py-20">
        <div class="max-w-2xl mx-auto">
          <div class="border border-green-500 bg-[#0d0d0d] p-8 text-center">
            <UIcon name="i-heroicons-check-circle" class="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 class="text-3xl font-bold mb-4 text-green-500">PAYMENT SUCCESS!</h1>
            <p class="text-gray-400 mb-8">
              Your registration is confirmed. Check your email for your QR code ticket.
            </p>

            <div v-if="registration" class="border border-[#2a2a2a] bg-[#0a0a0a] p-6 mb-8 text-left">
              <h2 class="text-xl font-bold mb-4">Registration Details</h2>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">Registration ID</span>
                  <span class="font-mono">{{ registrationId }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Event</span>
                  <span>{{ registration.event?.title }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Ticket</span>
                  <span>{{ registration.ticket?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Amount Paid</span>
                  <span class="font-bold text-green-500">Rp {{ formatPrice(registration.amount) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Status</span>
                  <span class="text-green-500 uppercase">{{ registration.status }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="bg-green-900/20 border border-green-500 p-4 text-sm text-left">
                <p class="font-bold mb-2">📧 Check Your Email</p>
                <p class="text-gray-400">
                  We've sent your QR code ticket and login credentials to your email.
                  Use the credentials to access your dashboard.
                </p>
              </div>

              <div class="flex gap-3 justify-center">
                <UButton 
                  color="green" 
                  size="lg"
                  @click="navigateTo('/auth/login')"
                >
                  LOGIN TO DASHBOARD
                </UButton>
                <UButton 
                  color="gray" 
                  size="lg"
                  variant="outline"
                  @click="navigateTo('/events')"
                >
                  BROWSE MORE EVENTS
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

const route = useRoute()
const { getRegistration } = useApi()

const registrationId = route.query.registration_id as string
const registration = ref<any>(null)

const formatPrice = (price: number) => {
  return price.toLocaleString('id-ID')
}

onMounted(async () => {
  if (registrationId) {
    try {
      registration.value = await getRegistration(registrationId)
    } catch (error) {
      console.error('Failed to load registration:', error)
    }
  }
})
</script>
