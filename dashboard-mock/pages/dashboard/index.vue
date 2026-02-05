<template>
  <div>
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold tracking-wider mb-2">MY REGISTRATIONS</h1>
          <p class="text-sm text-gray-400">View your tickets and QR codes</p>
        </div>

        <div v-if="loading" class="text-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
        </div>

        <div v-else-if="registrations.length === 0" class="border border-[#2a2a2a] bg-[#0d0d0d] p-12 text-center">
          <UIcon name="i-heroicons-ticket" class="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p class="text-gray-400 mb-4">No registrations yet</p>
          <UButton color="green" @click="navigateTo('/events')">
            BROWSE EVENTS
          </UButton>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="reg in registrations" 
            :key="reg.id"
            class="border border-[#2a2a2a] bg-[#0d0d0d] p-6"
          >
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-2">{{ reg.event?.title }}</h3>
                <div class="space-y-1 text-sm text-gray-400">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                    {{ formatDate(reg.event?.event_date) }}
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                    {{ reg.event?.location }}
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-ticket" class="w-4 h-4" />
                    {{ reg.ticket?.name }} - Rp {{ formatPrice(reg.amount) }}
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-end gap-3">
                <span 
                  class="px-3 py-1 text-xs font-bold uppercase"
                  :class="{
                    'bg-green-900 text-green-500': reg.status === 'paid',
                    'bg-yellow-900 text-yellow-500': reg.status === 'pending',
                    'bg-red-900 text-red-500': reg.status === 'cancelled' || reg.status === 'expired'
                  }"
                >
                  {{ reg.status }}
                </span>

                <div class="flex gap-2">
                  <UButton 
                    v-if="reg.status === 'paid'"
                    size="sm" 
                    color="green"
                    @click="showQR(reg)"
                  >
                    <UIcon name="i-heroicons-qr-code" class="w-4 h-4 mr-1" />
                    VIEW QR
                  </UButton>

                  <UButton 
                    v-if="reg.status === 'paid'"
                    size="sm" 
                    color="gray"
                    variant="outline"
                    @click="navigateTo(`/dashboard/files?registration_id=${reg.id}`)"
                  >
                    <UIcon name="i-heroicons-document" class="w-4 h-4 mr-1" />
                    FILES ({{ reg.files?.length || 0 }})
                  </UButton>

                  <UButton 
                    v-if="reg.status === 'pending'"
                    size="sm" 
                    color="yellow"
                    @click="navigateTo(`/payment/pending?registration_id=${reg.id}`)"
                  >
                    PAY NOW
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- QR Modal -->
      <UModal v-model="qrModalOpen">
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <div class="flex items-center justify-between mb-6 border-b border-[#2a2a2a] pb-4">
            <h3 class="text-xl font-bold">YOUR TICKET</h3>
            <UButton 
              color="gray" 
              icon="i-heroicons-x-mark" 
              size="sm" 
              @click="qrModalOpen = false" 
            />
          </div>

          <div v-if="selectedReg" class="text-center">
            <div class="mb-4">
              <img 
                v-if="qrCodeUrl" 
                :src="qrCodeUrl" 
                alt="QR Code" 
                class="mx-auto border border-[#2a2a2a] p-4 bg-white"
              />
              <div v-else class="w-64 h-64 mx-auto bg-[#151515] flex items-center justify-center">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
              </div>
            </div>

            <div class="space-y-2 text-sm mb-6">
              <p class="font-bold text-lg">{{ selectedReg.event?.title }}</p>
              <p class="text-gray-400">{{ selectedReg.ticket?.name }}</p>
              <p class="font-mono text-xs text-gray-500">{{ selectedReg.qr_code }}</p>
            </div>

            <UButton 
              color="green" 
              block
              @click="downloadQR"
            >
              <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
              DOWNLOAD QR CODE
            </UButton>
          </div>
        </div>
      </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

const { getMyRegistrations } = useApi()
const { generateQR, downloadQR: downloadQRFile } = useQRCode()

const registrations = ref<any[]>([])
const loading = ref(true)
const qrModalOpen = ref(false)
const selectedReg = ref<any>(null)
const qrCodeUrl = ref('')

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
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

const showQR = async (reg: any) => {
  selectedReg.value = reg
  qrModalOpen.value = true
  qrCodeUrl.value = ''
  
  try {
    qrCodeUrl.value = await generateQR(reg.qr_code)
  } catch (error) {
    console.error('Failed to generate QR:', error)
  }
}

const downloadQR = async () => {
  if (!selectedReg.value) return
  
  try {
    await downloadQRFile(
      selectedReg.value.qr_code,
      `ticket-${selectedReg.value.id}.png`
    )
  } catch (error) {
    console.error('Failed to download QR:', error)
  }
}

onMounted(async () => {
  try {
    const response = await getMyRegistrations()
    registrations.value = response.data || []
  } catch (error) {
    console.error('Failed to load registrations:', error)
  } finally {
    loading.value = false
  }
})
</script>
