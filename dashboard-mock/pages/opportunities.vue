<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-sm font-bold text-white tracking-[0.15em]">ARBITRAGE OPPORTUNITIES</h1>
        <p class="text-xs text-gray-500 mt-0.5">Cross-exchange funding rate differentials</p>
      </div>
      <div class="flex gap-2">
        <UButton 
          icon="i-heroicons-funnel"
          color="gray"
          class="rounded-none font-bold text-xs tracking-wider px-4"
          @click="showFilters = !showFilters"
        >
          FILTER
        </UButton>
        <UButton 
          icon="i-heroicons-arrow-path" 
          color="green"
          class="rounded-none font-bold text-xs tracking-wider px-4"
          @click="fetchOpportunities"
          :loading="loading"
        >
          SCAN
        </UButton>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
      <div class="grid grid-cols-4 gap-4">
        <div>
          <label class="text-xs text-gray-500 font-bold tracking-wider mb-2 block">MIN SPREAD %</label>
          <UInput 
            v-model.number="filters.minSpread" 
            type="number"
            step="0.0001"
            class="rounded-none text-xs"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500 font-bold tracking-wider mb-2 block">SYMBOL</label>
          <UInput 
            v-model="filters.symbol" 
            placeholder="BTCUSDT..."
            class="rounded-none text-xs"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500 font-bold tracking-wider mb-2 block">EXCHANGE A</label>
          <USelectMenu
            v-model="filters.exchangeA"
            :options="exchangeOptions"
            value-key="value"
            placeholder="Select..."
            class="rounded-none text-xs"
          />
        </div>
        <div>
          <label class="text-xs text-gray-500 font-bold tracking-wider mb-2 block">EXCHANGE B</label>
          <USelectMenu
            v-model="filters.exchangeB"
            :options="exchangeOptions"
            value-key="value"
            placeholder="Select..."
            class="rounded-none text-xs"
          />
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-gray-500 font-bold text-[10px] tracking-[0.15em] mb-1">TOTAL OPPORTUNITIES</h3>
        <div class="text-2xl font-mono text-white">{{ stats.total }}</div>
      </div>
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-gray-500 font-bold text-[10px] tracking-[0.15em] mb-1">AVG SPREAD</h3>
        <div class="text-2xl font-mono" :class="stats.avgSpread > 0 ? 'text-green-500' : 'text-gray-500'">
          {{ (stats.avgSpread * 100).toFixed(4) }}%
        </div>
      </div>
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-gray-500 font-bold text-[10px] tracking-[0.15em] mb-1">BEST SPREAD</h3>
        <div class="text-2xl font-mono text-green-500">{{ (stats.bestSpread * 100).toFixed(4) }}%</div>
      </div>
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
        <h3 class="text-gray-500 font-bold text-[10px] tracking-[0.15em] mb-1">LAST SCAN</h3>
        <div class="text-xs font-mono text-gray-400 mt-1">{{ stats.lastScan }}</div>
      </div>
    </div>

    <!-- Opportunities Table -->
    <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
      <table class="w-full text-xs font-mono">
        <thead>
          <tr class="text-gray-500 border-b border-[#2a2a2a]">
            <th class="text-left py-2 px-3 font-normal">SYMBOL</th>
            <th class="text-left py-2 px-3 font-normal">INTERVAL</th>
            <th class="text-left py-2 px-3 font-normal">EXCHANGE A</th>
            <th class="text-left py-2 px-3 font-normal">EXCHANGE B</th>
            <th class="text-left py-2 px-3 font-normal">RATE A</th>
            <th class="text-left py-2 px-3 font-normal">RATE B</th>
            <th class="text-left py-2 px-3 font-normal">SPREAD</th>
            <th class="text-left py-2 px-3 font-normal">ANNUALIZED</th>
            <th class="text-left py-2 px-3 font-normal">ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="opp in opportunities" 
            :key="`${opp.symbol}-${opp.exchange_a}-${opp.exchange_b}`"
            class="border-b border-[#1a1a1a] hover:bg-[#151515]"
          >
            <td class="py-3 px-3 font-medium text-white">{{ opp.symbol }}</td>
            <td class="py-3 px-3">
              <span 
                class="text-[10px] px-2 py-0.5 font-mono uppercase"
                :class="{
                  'bg-orange-900 text-orange-400': opp.interval === '1h',
                  'bg-blue-900 text-blue-400': opp.interval === '4h',
                  'bg-green-900 text-green-400': opp.interval === '8h'
                }"
              >
                {{ opp.interval }}
              </span>
            </td>
            <td class="py-3 px-3">
              <span 
                class="text-[10px] px-2 py-0.5 font-mono uppercase"
                :class="getExchangeColor(opp.exchange_a)"
              >
                {{ opp.exchange_a }}
              </span>
            </td>
            <td class="py-3 px-3">
              <span 
                class="text-[10px] px-2 py-0.5 font-mono uppercase"
                :class="getExchangeColor(opp.exchange_b)"
              >
                {{ opp.exchange_b }}
              </span>
            </td>
            <td class="py-3 px-3 text-gray-300">{{ opp.rate_a.toFixed(6) }}</td>
            <td class="py-3 px-3 text-gray-300">{{ opp.rate_b.toFixed(6) }}</td>
            <td class="py-3 px-3">
              <span 
                class="px-2 py-0.5 font-mono"
                :class="opp.spread_pct > 0 ? 'text-green-500 bg-green-900/30' : 'text-red-500 bg-red-900/30'"
              >
                {{ (opp.spread_pct * 100).toFixed(4) }}%
              </span>
            </td>
            <td class="py-3 px-3">
              <span 
                class="font-mono"
                :class="opp.annualized > 0 ? 'text-green-400' : 'text-gray-500'"
              >
                {{ (opp.annualized * 100).toFixed(2) }}%
              </span>
            </td>
            <td class="py-3 px-3">
              <UButton 
                size="2xs"
                :color="opp.spread_pct > 0 ? 'green' : 'red'"
                variant="ghost"
                class="rounded-none font-bold text-[10px] tracking-wider px-3"
                @click="executeTrade(opp)"
              >
                {{ opp.spread_pct > 0 ? 'LONG A / SHORT B' : 'SHORT A / LONG B' }}
              </UButton>
            </td>
          </tr>
          <tr v-if="opportunities.length === 0 && !loading">
            <td colspan="9" class="py-12 text-center text-gray-600">
              <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p class="text-xs">No arbitrage opportunities found</p>
              <p class="text-[10px] mt-1">Try adjusting your filters or scan again</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Calculation Note -->
    <div class="text-[10px] text-gray-600 font-mono">
      * Annualized = Spread × (365 days / 8 hours) × Funding Frequency. 
      Green = Buy Exchange A, Sell Exchange B | Red = Sell Exchange A, Buy Exchange B
    </div>
  </div>
</template>

<script setup lang="ts">
interface Opportunity {
  symbol: string
  interval: string
  exchange_a: string
  exchange_b: string
  rate_a: number
  rate_b: number
  spread_pct: number
  annualized: number
}

interface Stats {
  total: number
  avgSpread: number
  bestSpread: number
  lastScan: string
}

const showFilters = ref(false)
const loading = ref(false)
const opportunities = ref<Opportunity[]>([])

const stats = ref<Stats>({
  total: 0,
  avgSpread: 0,
  bestSpread: 0,
  lastScan: 'Never'
})

const filters = ref({
  minSpread: 0.0001,
  symbol: '',
  exchangeA: null as string | null,
  exchangeB: null as string | null
})

const exchangeOptions = [
  { label: 'KUCOIN', value: 'kucoin' },
  { label: 'BYBIT', value: 'bybit' }
]

const getExchangeColor = (exchange: string) => {
  const colors: Record<string, string> = {
    kucoin: 'bg-blue-900 text-blue-400',
    bybit: 'bg-orange-900 text-orange-400',
    binance: 'bg-yellow-900 text-yellow-400'
  }
  return colors[exchange.toLowerCase()] || 'bg-gray-800 text-gray-400'
}

const fetchOpportunities = async () => {
  loading.value = true
  try {
    const config = useRuntimeConfig()
    const baseUrl = config.public.apiBase || 'http://localhost:8000'
    
    const params = new URLSearchParams()
    params.append('min_spread', filters.value.minSpread.toString())
    if (filters.value.symbol) params.append('symbol', filters.value.symbol)
    
    const res = await fetch(`${baseUrl}/api/funding/arbitrage?${params}`)
    const data = await res.json()
    
    const opps = data.opportunities || []
    opportunities.value = opps.map((o: any) => ({
      symbol: o.symbol,
      interval: '8h',
      exchange_a: 'kucoin',
      exchange_b: 'bybit',
      rate_a: o.kucoin_rate,
      rate_b: o.bybit_rate,
      spread_pct: o.spread_pct,
      annualized: o.spread_pct * (365 * 3)
    }))
    
    if (opportunities.value.length > 0) {
      const spreads = opportunities.value.map(o => Math.abs(o.spread_pct))
      stats.value = {
        total: opportunities.value.length,
        avgSpread: spreads.reduce((a, b) => a + b, 0) / spreads.length,
        bestSpread: Math.max(...spreads),
        lastScan: new Date().toLocaleTimeString()
      }
    }
    
  } catch (e) {
    console.error('Failed to fetch opportunities:', e)
    // Demo data
    opportunities.value = [
      {
        symbol: 'BTC/USDT',
        interval: '8h',
        exchange_a: 'kucoin',
        exchange_b: 'bybit',
        rate_a: 0.000100,
        rate_b: 0.000095,
        spread_pct: 0.000005,
        annualized: 0.045
      },
      {
        symbol: 'ETH/USDT',
        interval: '4h',
        exchange_a: 'kucoin',
        exchange_b: 'bybit',
        rate_a: 0.000200,
        rate_b: 0.000210,
        spread_pct: -0.000010,
        annualized: -0.090
      },
      {
        symbol: 'SOL/USDT',
        interval: '1h',
        exchange_a: 'kucoin',
        exchange_b: 'bybit',
        rate_a: 0.000350,
        rate_b: 0.000320,
        spread_pct: 0.000030,
        annualized: 0.270
      }
    ]
    stats.value = {
      total: opportunities.value.length,
      avgSpread: 0.0015,
      bestSpread: 0.0030,
      lastScan: new Date().toLocaleTimeString()
    }
  } finally {
    loading.value = false
  }
}

const executeTrade = (opp: Opportunity) => {
  console.log('Execute trade:', opp)
  alert(`Trade execution not implemented yet.\n\n${opp.symbol}: ${opp.spread_pct > 0 ? 'Long ' + opp.exchange_a + ' / Short ' + opp.exchange_b : 'Short ' + opp.exchange_a + ' / Long ' + opp.exchange_b}\n\nRate A: ${opp.rate_a}\nRate B: ${opp.rate_b}\nSpread: ${(opp.spread_pct * 100).toFixed(4)}%`)
}

onMounted(() => {
  fetchOpportunities()
})
</script>
