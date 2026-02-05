<template>
  <div>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-wider mb-2">REPORTS</h1>
        <p class="text-sm text-gray-400">Analytics and insights</p>
      </div>

      <!-- Event Selector -->
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
        <label class="text-sm text-gray-400 mb-2 block">SELECT EVENT</label>
        <USelect 
          v-model="selectedEventId" 
          :options="eventOptions"
          size="lg"
        />
      </div>

      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
      </div>

      <div v-else-if="!selectedEventId" class="border border-[#2a2a2a] bg-[#0d0d0d] p-12 text-center">
        <p class="text-gray-400">Select an event to view report</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <p class="text-xs text-gray-500 uppercase mb-2">Total Registrations</p>
            <p class="text-3xl font-bold">{{ report.totalRegistrations }}</p>
          </div>
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <p class="text-xs text-gray-500 uppercase mb-2">Checked In</p>
            <p class="text-3xl font-bold text-green-500">{{ report.checkedIn }}</p>
            <p class="text-xs text-gray-500 mt-1">
              {{ report.checkinRate }}% rate
            </p>
          </div>
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <p class="text-xs text-gray-500 uppercase mb-2">Revenue</p>
            <p class="text-2xl font-bold">Rp {{ formatPrice(report.revenue) }}</p>
          </div>
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
            <p class="text-xs text-gray-500 uppercase mb-2">Files Uploaded</p>
            <p class="text-3xl font-bold">{{ report.filesUploaded }}</p>
          </div>
        </div>

        <!-- Ticket Breakdown -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">TICKET SALES</h2>
          <div class="space-y-3">
            <div 
              v-for="ticket in report.ticketBreakdown" 
              :key="ticket.name"
              class="flex items-center justify-between p-4 border border-[#1a1a1a] bg-[#0a0a0a]"
            >
              <div>
                <p class="font-bold">{{ ticket.name }}</p>
                <p class="text-sm text-gray-400">Rp {{ formatPrice(ticket.price) }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-green-500">{{ ticket.sold }}</p>
                <p class="text-xs text-gray-500">/ {{ ticket.quota }} quota</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Export -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">EXPORT DATA</h2>
          <div class="flex gap-4">
            <UButton color="green" @click="exportCSV">
              <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4 mr-2" />
              EXPORT CSV
            </UButton>
            <UButton color="blue" @click="exportPDF">
              <UIcon name="i-heroicons-document" class="w-4 h-4 mr-2" />
              EXPORT PDF
            </UButton>
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

const selectedEventId = ref('')
const events = ref<any[]>([])
const report = ref<any>({})
const loading = ref(false)

const eventOptions = computed(() => {
  return events.value.map(e => ({
    label: e.title,
    value: e.id
  }))
})

const formatPrice = (price: number) => {
  return price.toLocaleString('id-ID')
}

const exportCSV = () => {
  alert('Export CSV feature coming soon')
}

const exportPDF = () => {
  alert('Export PDF feature coming soon')
}

const loadReport = async () => {
  if (!selectedEventId.value) return
  
  loading.value = true
  try {
    const response = await $fetch(`/api/reports/event/${selectedEventId.value}`)
    report.value = response.data
  } catch (error) {
    console.error('Failed to load report:', error)
  } finally {
    loading.value = false
  }
}

watch(selectedEventId, loadReport)

onMounted(async () => {
  try {
    const response = await $fetch('/api/events')
    events.value = response.data || []
  } catch (error) {
    console.error('Failed to load events:', error)
  }
})
</script>
