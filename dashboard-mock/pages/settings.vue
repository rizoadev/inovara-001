<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="mb-4">
      <h1 class="text-sm font-bold text-white tracking-[0.15em]">SETTINGS</h1>
      <p class="text-xs text-gray-500 mt-0.5">Configure dashboard and API settings</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- API Configuration Card -->
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-green-500 font-bold text-xs tracking-[0.15em] mb-3 border-b border-[#2a2a2a] pb-2">
          API CONFIGURATION
        </h3>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-gray-500 mb-1.5">API BASE URL</label>
            <UInput 
              v-model="apiBase" 
              placeholder="http://localhost:8000"
              class="rounded-none font-mono"
            />
          </div>

          <div>
            <label class="block text-gray-500 mb-1.5">REFRESH INTERVAL</label>
            <USelectMenu
              v-model="refreshInterval"
              :options="intervalOptions"
              class="rounded-none w-full"
            />
          </div>

          <UButton 
            color="blue" 
            block
            class="rounded-none font-bold text-xs tracking-wider"
            @click="testConnection"
            :loading="testing"
          >
            TEST CONNECTION
          </UButton>

          <div 
            v-if="connectionResult" 
            class="p-3 border"
            :class="connectionResult.success ? 'border-green-900 bg-green-900/10' : 'border-red-900 bg-red-900/10'"
          >
            <div 
              class="text-xs font-bold"
              :class="connectionResult.success ? 'text-green-500' : 'text-red-500'"
            >
              {{ connectionResult.success ? 'SUCCESS' : 'FAILED' }}
            </div>
            <div class="text-[10px] text-gray-400 mt-1">{{ connectionResult.message }}</div>
          </div>
        </div>
      </div>

      <!-- Display Settings Card -->
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-green-500 font-bold text-xs tracking-[0.15em] mb-3 border-b border-[#2a2a2a] pb-2">
          DISPLAY SETTINGS
        </h3>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block text-gray-500 mb-1.5">THEME</label>
            <USelectMenu
              v-model="theme"
              :options="themeOptions"
              class="rounded-none w-full"
            />
          </div>

          <div>
            <label class="block text-gray-500 mb-1.5">CURRENCY DISPLAY</label>
            <USelectMenu
              v-model="currency"
              :options="currencyOptions"
              class="rounded-none w-full"
            />
          </div>

          <div>
            <label class="block text-gray-500 mb-1.5">DATE FORMAT</label>
            <USelectMenu
              v-model="dateFormat"
              :options="dateFormatOptions"
              class="rounded-none w-full"
            />
          </div>
        </div>
      </div>

      <!-- Exchange Connections Card -->
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-green-500 font-bold text-xs tracking-[0.15em] mb-3 border-b border-[#2a2a2a] pb-2">
          EXCHANGE CONNECTIONS
        </h3>

        <div class="space-y-3">
          <!-- KuCoin -->
          <div class="flex items-center justify-between p-3 border border-[#2a2a2a]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-900/50 flex items-center justify-center">
                <UIcon name="i-simple-icons:kucoin" class="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div class="text-xs font-medium">KUCOIN</div>
                <div class="text-[10px] text-gray-500">Futures API</div>
              </div>
            </div>
            <span class="text-[10px] px-2 py-0.5 bg-green-900 text-green-500 font-mono">CONNECTED</span>
          </div>

          <!-- Bybit -->
          <div class="flex items-center justify-between p-3 border border-[#2a2a2a]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-orange-900/50 flex items-center justify-center">
                <UIcon name="i-simple-icons:bybit" class="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div class="text-xs font-medium">BYBIT</div>
                <div class="text-[10px] text-gray-500">Futures API</div>
              </div>
            </div>
            <span class="text-[10px] px-2 py-0.5 bg-green-900 text-green-500 font-mono">CONNECTED</span>
          </div>
        </div>
      </div>

      <!-- Database Status Card -->
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-green-500 font-bold text-xs tracking-[0.15em] mb-3 border-b border-[#2a2a2a] pb-2">
          DATABASE STATUS
        </h3>

        <div class="space-y-3 text-xs">
          <div class="flex items-center justify-between py-1">
            <span class="text-gray-500">CLICKHOUSE</span>
            <span class="text-[10px] px-2 py-0.5 bg-green-900 text-green-500 font-mono">CONNECTED</span>
          </div>
          <div class="flex items-center justify-between py-1 border-t border-[#2a2a2a]">
            <span class="text-gray-500">DATABASE</span>
            <span class="text-gray-400 font-mono">zdlt_web3data</span>
          </div>
          <div class="flex items-center justify-between py-1 border-t border-[#2a2a2a]">
            <span class="text-gray-500">TABLES</span>
            <span class="text-gray-400 font-mono">5</span>
          </div>
          <div class="flex items-center justify-between py-1 border-t border-[#2a2a2a]">
            <span class="text-gray-500">TOTAL RECORDS</span>
            <span class="text-gray-400 font-mono">{{ totalRecords }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end mt-4">
      <UButton 
        color="green" 
        size="lg"
        class="rounded-none font-bold text-xs tracking-wider px-6"
        @click="saveSettings"
      >
        SAVE SETTINGS
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// State
const apiBase = ref('http://localhost:8000')
const refreshInterval = ref(30)
const theme = ref('system')
const currency = ref('USD')
const dateFormat = ref('locale')
const testing = ref(false)
const connectionResult = ref<{ success: boolean; message: string } | null>(null)
const totalRecords = ref(4)

const intervalOptions = [
  { label: '10 SECONDS', value: 10 },
  { label: '30 SECONDS', value: 30 },
  { label: '1 MINUTE', value: 60 },
  { label: '5 MINUTES', value: 300 },
  { label: 'MANUAL', value: 0 }
]

const themeOptions = [
  { label: 'SYSTEM', value: 'system' },
  { label: 'LIGHT', value: 'light' },
  { label: 'DARK', value: 'dark' }
]

const currencyOptions = [
  { label: 'USD', value: 'USD' },
  { label: 'USDT', value: 'USDT' },
  { label: 'BTC', value: 'BTC' },
  { label: 'ETH', value: 'ETH' }
]

const dateFormatOptions = [
  { label: 'LOCALE', value: 'locale' },
  { label: 'ISO', value: 'iso' },
  { label: 'US', value: 'us' },
  { label: 'EU', value: 'eu' }
]

// Methods
const testConnection = async () => {
  testing.value = true
  connectionResult.value = null
  
  try {
    const response = await fetch(`${apiBase.value}/health`)
    if (response.ok) {
      connectionResult.value = {
        success: true,
        message: 'Successfully connected to the API'
      }
    } else {
      connectionResult.value = {
        success: false,
        message: `API returned status ${response.status}`
      }
    }
  } catch (e) {
    connectionResult.value = {
      success: false,
      message: `Connection failed: ${(e as Error).message}`
    }
  } finally {
    testing.value = false
  }
}

const saveSettings = () => {
  localStorage.setItem('dashboard_settings', JSON.stringify({
    apiBase: apiBase.value,
    refreshInterval: refreshInterval.value,
    theme: theme.value,
    currency: currency.value,
    dateFormat: dateFormat.value
  }))
  
  alert('Settings saved successfully!')
}
</script>
