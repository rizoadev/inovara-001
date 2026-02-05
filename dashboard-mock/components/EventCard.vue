<template>
  <div 
    class="border border-[#2a2a2a] bg-[#0d0d0d] p-6 hover:border-green-500 transition-colors cursor-pointer"
    @click="$emit('click')"
  >
    <div v-if="event.image" class="w-full h-48 bg-[#151515] border border-[#2a2a2a] mb-4">
      <img :src="event.image" :alt="event.title" class="w-full h-full object-cover" />
    </div>

    <div class="space-y-3">
      <div>
        <h3 class="text-xl font-bold mb-2">{{ event.title }}</h3>
        <p class="text-sm text-gray-400 line-clamp-2">{{ event.description }}</p>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex items-center gap-2 text-gray-400">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
          {{ formatDate(event.event_date) }}
        </div>
        <div class="flex items-center gap-2 text-gray-400">
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
          {{ event.location }}
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-ticket" class="w-4 h-4 text-green-500" />
          <span class="font-bold">From Rp {{ formatPrice(minPrice) }}</span>
        </div>
      </div>

      <div class="pt-3 border-t border-[#2a2a2a]">
        <UButton color="green" block>
          VIEW DETAILS
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  event: any
}>()

defineEmits(['click'])

const minPrice = computed(() => {
  if (!props.event.tickets || props.event.tickets.length === 0) return 0
  return Math.min(...props.event.tickets.map((t: any) => t.price))
})

const formatPrice = (price: number) => {
  return price.toLocaleString('id-ID')
}

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
</script>
