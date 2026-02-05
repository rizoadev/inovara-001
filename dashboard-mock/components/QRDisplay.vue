<template>
  <div class="text-center">
    <div v-if="loading" class="w-64 h-64 mx-auto bg-[#151515] flex items-center justify-center border border-[#2a2a2a]">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
    </div>

    <div v-else-if="error" class="w-64 h-64 mx-auto bg-[#151515] flex items-center justify-center border border-[#2a2a2a]">
      <p class="text-red-500 text-sm">Failed to generate QR</p>
    </div>

    <img 
      v-else
      :src="qrUrl" 
      alt="QR Code" 
      class="mx-auto border border-[#2a2a2a] p-4 bg-white"
    />

    <div v-if="showCode" class="mt-4">
      <p class="font-mono text-xs text-gray-500">{{ code }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  code: string
  showCode?: boolean
}>()

const { generateQR } = useQRCode()

const qrUrl = ref('')
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    qrUrl.value = await generateQR(props.code)
  } catch (err) {
    console.error('Failed to generate QR:', err)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
