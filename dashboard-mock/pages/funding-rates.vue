<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-sm font-bold text-white tracking-[0.15em]">FUNDING RATES</h1>
        <p class="text-xs text-gray-500 mt-0.5">Real-time cryptocurrency funding rate data</p>
      </div>
      <UButton 
        icon="i-heroicons-arrow-path" 
        color="gray"
        class="rounded-none font-bold text-xs tracking-wider px-4"
        @click="fetchFundingRates"
        :loading="loading"
      >
        REFRESH
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4">
      <UInput 
        v-model="search" 
        icon="i-heroicons-magnifying-glass"
        placeholder="Search symbol..." 
        class="w-64 rounded-none text-xs"
        @keyup.enter="fetchFundingRates"
      />
      <USelectMenu
        v-model="exchangeFilter"
        :options="exchangeOptions"
        value-key="value"
        placeholder="ALL EXCHANGES"
        class="w-48 rounded-none text-xs"
        @change="fetchFundingRates"
      />
    </div>

    <!-- Funding Rates Table Card -->
    <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
      <table class="w-full text-xs font-mono">
        <thead>
          <tr class="text-gray-500 border-b border-[#2a2a2a]">
            <th class="text-left py-2 px-3 font-normal">SYMBOL</th>
            <th class="text-left py-2 px-3 font-normal">EXCHANGE</th>
            <th class="text-left py-2 px-3 font-normal">FUNDING RATE</th>
            <th class="text-left py-2 px-3 font-normal">INTERVAL (H)</th>
            <th class="text-left py-2 px-3 font-normal">NEXT RATE</th>
            <th class="text-left py-2 px-3 font-normal"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in rates" 
            :key="`${row.symbol}-${row.exchange}`"
            class="border-b border-[#1a1a1a] hover:bg-[#151515]"
          >
            <td class="py-2 px-3 font-medium">{{ row.symbol }}</td>
            <td class="py-2 px-3">
              <span 
                class="text-[10px] px-1.5 py-0.5 font-mono"
                :class="row.exchange === 'kucoin' ? 'bg-blue-900 text-blue-400' : 'bg-orange-900 text-orange-400'"
              >
                {{ row.exchange.toUpperCase() }}
              </span>
            </td>
            <td class="py-2 px-3">
              <span :class="getFundingRateColor(row.funding_rate)">
                {{ (row.funding_rate * 100).toFixed(4) }}%
              </span>
            </td>
            <td class="py-2 px-3 text-gray-400">{{ row.funding_rate_interval }}</td>
            <td class="py-2 px-3 text-gray-400">{{ (row.next_funding_rate * 100).toFixed(4) }}%</td>
            <td class="py-2 px-3">
              <UButton 
                size="2xs"
                color="gray"
                variant="ghost"
                icon="i-heroicons-chart-bar"
                class="rounded-none"
                @click="showChart(row)"
              />
            </td>
          </tr>
          <tr v-if="rates.length === 0 && !loading">
            <td colspan="6" class="py-12 text-center text-gray-600">
              <UIcon name="i-heroicons-currency-dollar" class="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p class="text-xs">No funding rate data available</p>
              <UButton 
                color="green" 
                size="xs" 
                class="mt-4 rounded-none font-bold text-xs tracking-wider px-4"
                @click="fetchFundingRates"
                :loading="loading"
              >
                FETCH DATA
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div v-if="rates.length > 0" class="flex items-center justify-between mt-4 pt-4 border-t border-[#2a2a2a]">
        <span class="text-xs text-gray-500">
          Showing {{ rates.length }} of {{ totalCount }} records
        </span>
        <div class="flex gap-2">
          <UButton 
            size="xs" 
            color="gray" 
            variant="ghost"
            class="rounded-none"
            :disabled="offset <= 0"
            @click="loadMore(-limit)"
          >
            PREV
          </UButton>
          <UButton 
            size="xs" 
            color="gray" 
            variant="ghost"
            class="rounded-none"
            :disabled="rates.length < limit"
            @click="loadMore(limit)"
          >
            NEXT
          </UButton>
        </div>
      </div>
    </div>

    <!-- Summary Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Highest Rate -->
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-gray-500 font-bold text-xs tracking-[0.15em] mb-3">HIGHEST RATE</h3>
        <div v-if="summary.highest_rate" class="space-y-2">
          <div class="text-sm font-medium">{{ summary.highest_rate.symbol }}</div>
          <span 
            class="text-xs px-2 py-0.5 font-mono"
            :class="getFundingRateColor(summary.highest_rate.funding_rate)"
          >
            {{ (summary.highest_rate.funding_rate * 100).toFixed(4) }}%
          </span>
          <div class="text-[10px] text-gray-500">{{ summary.highest_rate.exchange }}</div>
        </div>
        <div v-else class="text-gray-600 text-xs">No data</div>
      </div>

      <!-- Lowest Rate -->
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-gray-500 font-bold text-xs tracking-[0.15em] mb-3">LOWEST RATE</h3>
        <div v-if="summary.lowest_rate" class="space-y-2">
          <div class="text-sm font-medium">{{ summary.lowest_rate.symbol }}</div>
          <span 
            class="text-xs px-2 py-0.5 font-mono"
            :class="getFundingRateColor(summary.lowest_rate.funding_rate)"
          >
            {{ (summary.lowest_rate.funding_rate * 100).toFixed(4) }}%
          </span>
          <div class="text-[10px] text-gray-500">{{ summary.lowest_rate.exchange }}</div>
        </div>
        <div v-else class="text-gray-600 text-xs">No data</div>
      </div>

      <!-- Average Rate -->
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-gray-500 font-bold text-xs tracking-[0.15em] mb-3">AVERAGE RATE</h3>
        <div class="space-y-2">
          <div class="text-sm font-mono">{{ (summary.avg_rate * 100).toFixed(4) }}%</div>
          <div class="text-[10px] text-gray-500">{{ summary.total_records }} records</div>
        </div>
      </div>
    </div>

    <!-- Arbitrage Opportunities Card -->
    <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
      <h3 class="text-green-500 font-bold text-xs tracking-[0.15em] mb-3 border-b border-[#2a2a2a] pb-2">
        ARBITRAGE OPPORTUNITIES
      </h3>

      <div v-if="arbitrageOpportunities.length > 0" class="space-y-2">
        <div 
          v-for="opp in arbitrageOpportunities" 
          :key="opp.symbol"
          class="flex items-center justify-between p-3 border border-[#2a2a2a]"
        >
          <div>
            <div class="text-xs font-medium">{{ opp.symbol }}</div>
            <div class="text-[10px] text-gray-500 font-mono">
              {{ opp.kucoin_rate.toFixed(4) }}% (KUCOIN) vs {{ opp.bybit_rate.toFixed(4) }}% (BYBIT)
            </div>
          </div>
          <span 
            class="text-xs px-2 py-0.5 font-mono"
            :class="opp.direction === 'KUCOIN_HIGHER' ? 'bg-green-900 text-green-500' : 'bg-red-900 text-red-500'"
          >
            {{ Math.abs(opp.spread_pct).toFixed(4) }}% SPREAD
          </span>
        </div>
      </div>
      <div v-else class="py-8 text-center text-gray-600">
        <p class="text-xs">No significant arbitrage opportunities found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FundingRate {
  exchange: string
  symbol: string
  funding_rate: number
  funding_rate_interval: number
  next_funding_rate: number
  next_funding_timestamp?: number
  last_fetch: number
  created_at: number
}

interface ArbitrageOpportunity {
  symbol: string
  kucoin_rate: number
  bybit_rate: number
  spread_pct: number
  direction: string
}

// State
const rates = ref<FundingRate[]>([])
const search = ref('')
const exchangeFilter = ref<string | null>(null)
const loading = ref(false)
const offset = ref(0)
const limit = 50
const totalCount = ref(0)

// Summary stats
const summary = ref({
  highest_rate: null as FundingRate | null,
  lowest_rate: null as FundingRate | null,
  avg_rate: 0,
  total_records: 0
})

// Arbitrage opportunities
const arbitrageOpportunities = ref<ArbitrageOpportunity[]>([])

const exchangeOptions = [
  { label: 'ALL', value: null },
  { label: 'KUCOIN', value: 'kucoin' },
  { label: 'BYBIT', value: 'bybit' }
]

// Methods
const getFundingRateColor = (rate: number) => {
  if (rate > 0.001) return 'text-red-500'
  if (rate > 0.0001) return 'text-yellow-500'
  return 'text-green-500'
}

const showChart = (row: FundingRate) => {
  console.log('Show chart for:', row.symbol)
}

const fetchFundingRates = async () => {
  loading.value = true
  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBase || 'http://localhost:8000'
    
    // Handle exchange filter - may be object or string
    let exchangeValue = null
    if (exchangeFilter.value) {
      exchangeValue = typeof exchangeFilter.value === 'object' 
        ? exchangeFilter.value.value 
        : exchangeFilter.value
    }
    
    // Fetch rates
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    params.append('offset', offset.value.toString())
    if (search.value) params.append('symbol', search.value)
    if (exchangeValue) params.append('exchange', exchangeValue)
    
    const ratesRes = await fetch(`${baseUrl}/api/funding?${params}`)
    const ratesData = await ratesRes.json()
    
    rates.value = ratesData.rates || []
    totalCount.value = (ratesData.total_bybit || 0) + (ratesData.total_kucoin || 0)
    
    // Fetch summary
    const summaryRes = await fetch(`${baseUrl}/api/funding/summary`)
    const summaryData = await summaryRes.json()
    
    summary.value = {
      highest_rate: summaryData.highest_rate,
      lowest_rate: summaryData.lowest_rate,
      avg_rate: summaryData.avg_rate,
      total_records: summaryData.total_records
    }
    
    // Fetch arbitrage opportunities
    const arbRes = await fetch(`${baseUrl}/api/funding/arbitrage?min_spread=0.0001`)
    const arbData = await arbRes.json()
    
    arbitrageOpportunities.value = arbData.opportunities || []
    
  } catch (e) {
    console.error('Failed to fetch funding rates:', e)
    rates.value = []
  } finally {
    loading.value = false
  }
}

const loadMore = (delta: number) => {
  offset.value = Math.max(0, offset.value + delta)
  fetchFundingRates()
}

onMounted(() => {
  fetchFundingRates()
})
</script>
