<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-sm font-bold text-white tracking-[0.15em]">FUNDING WORKFLOWS</h1>
        <p class="text-xs text-gray-500 mt-0.5">On-demand funding rate fetching per exchange</p>
      </div>
      <UButton 
        color="green"
        icon="i-heroicons-plus"
        class="rounded-none font-bold text-xs tracking-wider px-4"
        @click="showCreateModal = true"
      >
        NEW WORKFLOW
      </UButton>
    </div>

    <!-- Search & Filter -->
    <div class="flex gap-3 mb-4">
      <UInput 
        v-model="search" 
        icon="i-heroicons-magnifying-glass"
        placeholder="Search workflows..." 
        class="w-64 rounded-none text-xs"
      />
      <USelectMenu
        v-model="statusFilter"
        :options="statusOptions"
        placeholder="ALL STATUS"
        class="w-48 rounded-none text-xs"
      />
    </div>

    <!-- Workflows Table -->
    <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
      <table class="w-full text-xs font-mono">
        <thead>
          <tr class="text-gray-500 border-b border-[#2a2a2a]">
            <th class="text-left py-2 px-3 font-normal">WORKFLOW ID</th>
            <th class="text-left py-2 px-3 font-normal">EXCHANGE</th>
            <th class="text-left py-2 px-3 font-normal">STATUS</th>
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
            <td class="py-2 px-3 truncate max-w-[200px] text-gray-300">{{ wf.id }}</td>
            <td class="py-2 px-3">
              <span 
                class="text-[10px] px-1.5 py-0.5 font-mono"
                :class="wf.exchange === 'kucoin' ? 'bg-blue-900 text-blue-400' : 'bg-orange-900 text-orange-400'"
              >
                {{ wf.exchange.toUpperCase() }}
              </span>
            </td>
            <td class="py-2 px-3">
              <span 
                class="text-[10px] px-1.5 py-0.5 font-mono"
                :class="getStatusClass(wf.status)"
              >
                {{ wf.status.toUpperCase() }}
              </span>
            </td>
            <td class="py-2 px-3 text-gray-500">{{ formatTime(wf.started_at) }}</td>
            <td class="py-2 px-3">
              <div class="flex gap-1">
                <UButton 
                  size="2xs"
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-arrow-path"
                  class="rounded-none"
                  @click="refreshStatus(wf)"
                  :loading="refreshing === wf.id"
                >
                  REFRESH
                </UButton>
                <UButton 
                  v-if="wf.status === 'running'"
                  size="2xs"
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  class="rounded-none"
                  @click="cancelWorkflow(wf.id)"
                >
                  CANCEL
                </UButton>
                <UButton 
                  size="2xs"
                  color="green"
                  variant="ghost"
                  icon="i-heroicons-play"
                  class="rounded-none"
                  @click="rerunWorkflow(wf)"
                >
                  RERUN
                </UButton>
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
                @click="showCreateModal = true"
              >
                CREATE FIRST WORKFLOW
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Workflow Modal -->
    <UModal v-model="showCreateModal">
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <div class="flex items-center justify-between mb-4 border-b border-[#2a2a2a] pb-3">
          <h3 class="text-green-500 font-bold text-xs tracking-[0.15em]">TRIGGER NEW WORKFLOW</h3>
          <UButton color="gray" icon="i-heroicons-x-mark" size="xs" class="rounded-none" @click="showCreateModal = false" />
        </div>

        <div class="space-y-4 text-xs">
          <!-- Exchange Selection -->
          <div>
            <label class="block text-gray-500 mb-2">EXCHANGE</label>
            <div class="flex gap-3">
              <UButton 
                :color="selectedExchange === 'kucoin' ? 'blue' : 'gray'"
                variant="solid"
                class="rounded-none font-bold px-4"
                @click="selectedExchange = 'kucoin'"
              >
                KUCOIN
              </UButton>
              <UButton 
                :color="selectedExchange === 'bybit' ? 'orange' : 'gray'"
                variant="solid"
                class="rounded-none font-bold px-4"
                @click="selectedExchange = 'bybit'"
              >
                BYBIT
              </UButton>
            </div>
          </div>

          <!-- Symbols (Optional) -->
          <div>
            <label class="block text-gray-500 mb-2">SYMBOLS (OPTIONAL - LEAVE EMPTY FOR ALL)</label>
            <UTextarea 
              v-model="symbolsInput" 
              placeholder="BTC/USDT, ETH/USDT, SOL/USDT (comma separated)"
              rows="2"
              class="rounded-none font-mono text-xs"
            />
          </div>

          <!-- Quick Select -->
          <div>
            <label class="block text-gray-500 mb-2">QUICK SELECT</label>
            <div class="flex flex-wrap gap-2">
              <UButton 
                size="xs"
                color="gray"
                variant="ghost"
                class="rounded-none"
                @click="symbolsInput = 'BTC/USDT,ETH/USDT,SOL/USDT'"
              >
                TOP 3
              </UButton>
              <UButton 
                size="xs"
                color="gray"
                variant="ghost"
                class="rounded-none"
                @click="symbolsInput = 'BTC/USDT,ETH/USDT,SOL/USDT,XRP/USDT,ADA/USDT'"
              >
                TOP 5
              </UButton>
              <UButton 
                size="xs"
                color="gray"
                variant="ghost"
                class="rounded-none"
                @click="symbolsInput = ''"
              >
                ALL
              </UButton>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-[#2a2a2a]">
          <UButton color="gray" size="sm" class="rounded-none text-xs" @click="showCreateModal = false">
            CANCEL
          </UButton>
          <UButton 
            color="green" 
            size="sm" 
            class="rounded-none font-bold text-xs tracking-wider px-4"
            :loading="creating"
            @click="createWorkflow"
          >
            EXECUTE
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Execution Result Modal -->
    <UModal v-model="showResultModal">
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <div class="flex items-center justify-between mb-4 border-b border-[#2a2a2a] pb-3">
          <h3 class="text-green-500 font-bold text-xs tracking-[0.15em]">WORKFLOW EXECUTED</h3>
          <UButton color="gray" icon="i-heroicons-x-mark" size="xs" class="rounded-none" @click="showResultModal = false" />
        </div>

        <div class="space-y-3 text-xs font-mono">
          <div class="flex justify-between py-2 border-b border-[#2a2a2a]">
            <span class="text-gray-500">WORKFLOW ID</span>
            <span class="text-gray-300">{{ lastCreatedWorkflow?.id || '-' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-[#2a2a2a]">
            <span class="text-gray-500">EXCHANGE</span>
            <span 
              class="font-bold"
              :class="lastCreatedWorkflow?.exchange === 'kucoin' ? 'text-blue-400' : 'text-orange-400'"
            >
              {{ lastCreatedWorkflow?.exchange?.toUpperCase() || '-' }}
            </span>
          </div>
          <div class="flex justify-between py-2 border-b border-[#2a2a2a]">
            <span class="text-gray-500">STATUS</span>
            <span class="text-green-500">STARTED</span>
          </div>
          <div class="flex justify-between py-2 border-b border-[#2a2a2a]">
            <span class="text-gray-500">TIMESTAMP</span>
            <span class="text-gray-300">{{ lastCreatedWorkflow?.started_at || '-' }}</span>
          </div>
        </div>

        <div class="flex justify-end mt-6 pt-4 border-t border-[#2a2a2a]">
          <UButton color="gray" size="sm" class="rounded-none text-xs" @click="showResultModal = false">
            CLOSE
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Workflow {
  id: string
  exchange: string
  status: string
  started_at: string
  run_id?: string
}

const search = ref('')
const statusFilter = ref<string | null>(null)
const showCreateModal = ref(false)
const showResultModal = ref(false)
const creating = ref(false)
const refreshing = ref<string | null>(null)
const selectedExchange = ref('kucoin')
const symbolsInput = ref('')
const lastCreatedWorkflow = ref<Workflow | null>(null)

const workflows = ref<Workflow[]>([
  { id: 'manual-kucoin-20260204220001', exchange: 'kucoin', status: 'completed', started_at: '2026-02-04T22:00:01Z' },
  { id: 'manual-bybit-20260204220515', exchange: 'bybit', status: 'running', started_at: '2026-02-04T22:05:15Z' },
  { id: 'manual-kucoin-20260204221030', exchange: 'kucoin', status: 'failed', started_at: '2026-02-04T22:10:30Z' },
  { id: 'manual-bybit-20260204221500', exchange: 'bybit', status: 'completed', started_at: '2026-02-04T22:15:00Z' },
])

const statusOptions = [
  { label: 'ALL', value: null },
  { label: 'RUNNING', value: 'running' },
  { label: 'COMPLETED', value: 'completed' },
  { label: 'FAILED', value: 'failed' },
]

const filteredWorkflows = computed(() => {
  let result = workflows.value

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    result = result.filter(w => 
      w.id.toLowerCase().includes(searchLower) ||
      w.exchange.toLowerCase().includes(searchLower)
    )
  }

  if (statusFilter.value) {
    result = result.filter(w => w.status === statusFilter.value)
  }

  return result.sort((a, b) => 
    new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
  )
})

const getStatusClass = (status: string) => {
  switch (status) {
    case 'running': return 'bg-green-900 text-green-400'
    case 'completed': return 'bg-blue-900 text-blue-400'
    case 'failed': return 'bg-red-900 text-red-400'
    default: return 'bg-gray-700 text-gray-400'
  }
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const createWorkflow = async () => {
  creating.value = true
  
  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBase || 'http://localhost:8000'
    
    const symbols = symbolsInput.value 
      ? symbolsInput.value.split(',').map(s => s.trim()).filter(Boolean)
      : null

    const res = await fetch(`${baseUrl}/api/manual-fetch/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exchange: selectedExchange.value,
        symbols: symbols
      })
    })

    if (!res.ok) {
      throw new Error('Failed to create workflow')
    }

    const data = await res.json()

    // Add to list
    const newWorkflow: Workflow = {
      id: data.workflow_id,
      exchange: data.exchange,
      status: data.status,
      started_at: data.timestamp
    }

    workflows.value.unshift(newWorkflow)
    lastCreatedWorkflow.value = newWorkflow
    
    showCreateModal.value = false
    showResultModal.value = true
    symbolsInput.value = ''
    
  } catch (e) {
    console.error('Failed to create workflow:', e)
    alert('Failed to create workflow: ' + (e as Error).message)
  } finally {
    creating.value = false
  }
}

const refreshStatus = async (wf: Workflow) => {
  refreshing.value = wf.id
  
  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBase || 'http://localhost:8000'
    
    const res = await fetch(`${baseUrl}/api/manual-fetch/status/${wf.id}`)
    
    if (res.ok) {
      const data = await res.json()
      wf.status = data.status
    }
  } catch (e) {
    console.error('Failed to refresh status:', e)
  } finally {
    refreshing.value = null
  }
}

const cancelWorkflow = async (workflowId: string) => {
  if (!confirm('Cancel this workflow?')) return
  
  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBase || 'http://localhost:8000'
    
    const res = await fetch(`${baseUrl}/api/manual-fetch/cancel/${workflowId}`, {
      method: 'POST'
    })
    
    if (res.ok) {
      const wf = workflows.value.find(w => w.id === workflowId)
      if (wf) wf.status = 'cancelled'
    }
  } catch (e) {
    console.error('Failed to cancel workflow:', e)
  }
}

const rerunWorkflow = (wf: Workflow) => {
  selectedExchange.value = wf.exchange
  showCreateModal.value = true
}
</script>
