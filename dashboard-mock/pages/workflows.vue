<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-sm font-bold text-white tracking-[0.15em]">WORKFLOW MANAGEMENT</h1>
        <p class="text-xs text-gray-500 mt-0.5">Manage funding rate data collection workflows</p>
      </div>
      <UButton 
        color="green" 
        icon="i-heroicons-plus"
        class="rounded-none font-bold text-xs tracking-wider px-4"
        @click="showStartModal = true"
      >
        NEW WORKFLOW
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4">
      <UInput 
        v-model="search" 
        icon="i-heroicons-magnifying-glass"
        placeholder="Search workflows..." 
        class="w-64 rounded-none text-xs"
        :ui="{ 
          color: { gray: { outline: { background: '#0d0d0d', border: '#2a2a2a' } } }
        }"
      />
      <USelectMenu
        v-model="statusFilter"
        :options="statusOptions"
        placeholder="ALL STATUS"
        class="w-48 rounded-none text-xs"
      />
    </div>

    <!-- Workflows Table Card -->
    <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
      <table class="w-full text-xs font-mono">
        <thead>
          <tr class="text-gray-500 border-b border-[#2a2a2a]">
            <th class="text-left py-2 px-3 font-normal">ID</th>
            <th class="text-left py-2 px-3 font-normal">STATUS</th>
            <th class="text-left py-2 px-3 font-normal">EXCHANGES</th>
            <th class="text-left py-2 px-3 font-normal">STARTED</th>
            <th class="text-left py-2 px-3 font-normal">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="wf in filteredWorkflows" 
            :key="wf.id"
            class="border-b border-[#1a1a1a] hover:bg-[#151515]"
          >
            <td class="py-2 px-3 truncate max-w-[200px]">{{ wf.id }}</td>
            <td class="py-2 px-3">
              <span 
                class="text-[10px] px-1.5 py-0.5 font-mono"
                :class="{
                  'bg-green-900 text-green-500': wf.status === 'running',
                  'bg-yellow-900 text-yellow-500': wf.status === 'paused',
                  'bg-red-900 text-red-500': wf.status === 'stopped' || wf.status === 'failed'
                }"
              >
                {{ wf.status.toUpperCase() }}
              </span>
            </td>
            <td class="py-2 px-3 text-gray-400">
              {{ (wf.exchanges || []).join(', ') }}
            </td>
            <td class="py-2 px-3 text-gray-500">{{ formatDate(wf.started_at) }}</td>
            <td class="py-2 px-3">
              <div class="flex gap-1">
                <UButton 
                  v-if="wf.status === 'running'"
                  size="2xs"
                  color="yellow"
                  variant="ghost"
                  icon="i-heroicons-pause"
                  class="rounded-none"
                  @click="pauseWorkflow(wf.id)"
                />
                <UButton 
                  v-if="wf.status === 'paused'"
                  size="2xs"
                  color="green"
                  variant="ghost"
                  icon="i-heroicons-play"
                  class="rounded-none"
                  @click="resumeWorkflow(wf.id)"
                />
                <UButton 
                  size="2xs"
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-stop"
                  class="rounded-none"
                  @click="stopWorkflow(wf.id)"
                />
              </div>
            </td>
          </tr>
          <tr v-if="filteredWorkflows.length === 0">
            <td colspan="5" class="py-12 text-center text-gray-600">
              <UIcon name="i-heroicons-cpu-chip" class="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p class="text-xs">No workflows found</p>
              <UButton 
                color="green" 
                size="xs" 
                class="mt-4 rounded-none font-bold text-xs tracking-wider px-4"
                @click="showStartModal = true"
              >
                CREATE FIRST WORKFLOW
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Start Workflow Modal -->
    <UModal v-model="showStartModal">
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <div class="flex items-center justify-between mb-4 border-b border-[#2a2a2a] pb-3">
          <h3 class="text-green-500 font-bold text-xs tracking-[0.15em]">START NEW WORKFLOW</h3>
          <UButton color="gray" icon="i-heroicons-x-mark" size="xs" class="rounded-none" @click="showStartModal = false" />
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-gray-500 mb-2">EXCHANGES</label>
            <div class="flex gap-4">
              <UCheckbox v-model="selectedExchanges" label="KUCOIN" value="kucoin" />
              <UCheckbox v-model="selectedExchanges" label="BYBIT" value="bybit" />
            </div>
          </div>

          <div>
            <label class="block text-gray-500 mb-2">SYMBOLS (OPTIONAL)</label>
            <UTextarea 
              v-model="symbolsInput" 
              placeholder="BTC/USDT:USDT, ETH/USDT:USDT (comma separated)"
              rows="2"
              class="rounded-none font-mono text-xs"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-[#2a2a2a]">
          <UButton color="gray" size="sm" class="rounded-none text-xs" @click="showStartModal = false">
            CANCEL
          </UButton>
          <UButton 
            color="green" 
            size="sm" 
            class="rounded-none font-bold text-xs tracking-wider px-4"
            :loading="starting"
            :disabled="selectedExchanges.length === 0"
            @click="startWorkflow"
          >
            START WORKFLOW
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Workflow {
  id: string
  status: string
  exchanges: string[]
  started_at: string
}

// State
const workflows = ref<Workflow[]>([])
const search = ref('')
const statusFilter = ref<string | null>(null)
const showStartModal = ref(false)
const starting = ref(false)
const selectedExchanges = ref<string[]>(['kucoin', 'bybit'])
const symbolsInput = ref('')

const statusOptions = [
  { label: 'ALL', value: null },
  { label: 'RUNNING', value: 'running' },
  { label: 'PAUSED', value: 'paused' },
  { label: 'COMPLETED', value: 'completed' },
  { label: 'FAILED', value: 'failed' }
]

// Computed
const filteredWorkflows = computed(() => {
  let result = workflows.value

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(w => w.id.toLowerCase().includes(searchLower))
  }

  if (statusFilter.value) {
    result = result.filter(w => w.status === statusFilter.value)
  }

  return result
})

// Methods
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}

const fetchWorkflows = async () => {
  try {
    const res = await $fetch('/workflows')
    workflows.value = (res as any).workflows || []
  } catch (e) {
    workflows.value = []
  }
}

const startWorkflow = async () => {
  starting.value = true
  try {
    const symbols = symbolsInput.value 
      ? symbolsInput.value.split(',').map(s => s.trim()).filter(Boolean)
      : null

    await $fetch('/workflows/start', {
      method: 'POST',
      body: { 
        exchanges: selectedExchanges.value,
        symbols 
      }
    })
    
    showStartModal.value = false
    selectedExchanges.value = ['kucoin', 'bybit']
    symbolsInput.value = ''
    await fetchWorkflows()
  } catch (e) {
    console.error('Failed to start workflow:', e)
  } finally {
    starting.value = false
  }
}

const pauseWorkflow = async (id: string) => {
  try {
    await $fetch(`/workflows/${id}/pause`, { method: 'POST' })
    await fetchWorkflows()
  } catch (e) {
    console.error('Failed to pause workflow:', e)
  }
}

const resumeWorkflow = async (id: string) => {
  try {
    await $fetch(`/workflows/${id}/resume`, { method: 'POST' })
    await fetchWorkflows()
  } catch (e) {
    console.error('Failed to resume workflow:', e)
  }
}

const stopWorkflow = async (id: string) => {
  try {
    await $fetch(`/workflows/${id}/stop`, { method: 'POST' })
    await fetchWorkflows()
  } catch (e) {
    console.error('Failed to stop workflow:', e)
  }
}

onMounted(() => {
  fetchWorkflows()
})
</script>
