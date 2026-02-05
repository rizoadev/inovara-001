<template>
  <div>
      <div class="container mx-auto px-4 py-20">
        <div class="max-w-2xl mx-auto">
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-8 text-center">
            <UIcon name="i-heroicons-clock" class="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 class="text-3xl font-bold mb-4">PAYMENT PENDING</h1>
            <p class="text-gray-400 mb-8">
              Complete your payment to receive your ticket
            </p>

            <div v-if="registration" class="border border-[#2a2a2a] bg-[#0a0a0a] p-6 mb-8 text-left">
              <h2 class="text-xl font-bold mb-4">Order Summary</h2>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-400">Registration ID</span>
                  <span class="font-mono">{{ registrationId }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Amount</span>
                  <span class="font-bold text-green-500">Rp {{ formatPrice(registration.amount) }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <p class="text-sm text-gray-400">
                This is a demo. Click below to simulate payment:
              </p>
              
              <div class="flex gap-3 justify-center">
                <UButton 
                  color="green" 
                  size="lg"
                  :loading="processing"
                  @click="simulatePayment('settlement')"
                >
                  SIMULATE SUCCESS
                </UButton>
                <UButton 
                  color="red" 
                  size="lg"
                  variant="outline"
                  :loading="processing"
                  @click="simulatePayment('cancel')"
                >
                  SIMULATE CANCEL
                </UButton>
              </div>

              <p class="text-xs text-gray-500 mt-4">
                In production, you would be redirected to Midtrans/Xendit payment page
              </p>
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
const { simulatePayment: apiSimulatePayment, getRegistration } = useApi()

const registrationId = route.query.registration_id as string
const registration = ref<any>(null)
const processing = ref(false)

const formatPrice = (price: number) => {
  return price.toLocaleString('id-ID')
}

const simulatePayment = async (status: 'settlement' | 'cancel') => {
  if (!registrationId) return

  processing.value = true
  try {
    await apiSimulatePayment(registrationId, status)
    
    if (status === 'settlement') {
      navigateTo(`/payment/success?registration_id=${registrationId}`)
    } else {
      alert('Payment cancelled')
      navigateTo('/events')
    }
  } catch (error) {
    console.error('Payment simulation failed:', error)
    alert('Payment simulation failed')
  } finally {
    processing.value = false
  }
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
