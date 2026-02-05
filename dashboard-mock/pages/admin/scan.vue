<template>
  <div>
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold tracking-wider mb-2">QR SCANNER</h1>
          <p class="text-sm text-gray-400">Scan participant QR codes for check-in</p>
        </div>

        <!-- Scanner Card -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <div v-if="!scanning" class="text-center py-12">
            <UIcon name="i-heroicons-qr-code" class="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <p class="text-gray-400 mb-6">Click below to start scanning</p>
            <UButton 
              color="green" 
              size="xl"
              @click="startScanner"
            >
              <UIcon name="i-heroicons-camera" class="w-5 h-5 mr-2" />
              START CAMERA
            </UButton>
          </div>

          <div v-else class="space-y-4">
            <div class="relative bg-black aspect-video max-w-2xl mx-auto">
              <video 
                ref="videoRef" 
                class="w-full h-full"
                autoplay 
                playsinline
              ></video>
              <canvas ref="canvasRef" class="hidden"></canvas>
              
              <!-- Scanning overlay -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="w-64 h-64 border-4 border-green-500 border-dashed animate-pulse"></div>
              </div>
            </div>

            <div class="text-center">
              <p class="text-sm text-gray-400 mb-4">Point camera at QR code</p>
              <UButton 
                color="red" 
                variant="outline"
                @click="stopScanner"
              >
                <UIcon name="i-heroicons-stop" class="w-4 h-4 mr-2" />
                STOP SCANNING
              </UButton>
            </div>
          </div>
        </div>

        <!-- Manual Input -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">MANUAL QR CODE INPUT</h2>
          <form @submit.prevent="handleManualScan" class="flex gap-3">
            <input 
              v-model="manualQR" 
              type="text"
              placeholder="Enter QR code (e.g., EVTHUB-evt001-reg001)"
              class="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-2 text-white"
            />
            <UButton 
              type="submit" 
              color="green"
              :loading="processing"
            >
              CHECK IN
            </UButton>
          </form>
        </div>

        <!-- Last Scan Result -->
        <div v-if="lastScan" class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">LAST SCAN RESULT</h2>
          
          <!-- Success -->
          <div v-if="lastScan.valid" class="bg-green-900/30 border border-green-500 p-6 text-center">
            <UIcon name="i-heroicons-check-circle" class="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 class="text-2xl font-bold text-green-500 mb-4">CHECK-IN SUCCESSFUL</h3>
            <div class="space-y-2 text-left max-w-md mx-auto">
              <div class="flex justify-between">
                <span class="text-gray-400">Participant:</span>
                <span class="font-bold">{{ lastScan.registration.participant_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Event:</span>
                <span>{{ lastScan.registration.event_title }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Ticket:</span>
                <span>{{ lastScan.registration.ticket_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Time:</span>
                <span class="font-mono text-sm">{{ formatTime(lastScan.checked_in_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-else class="bg-red-900/30 border border-red-500 p-6 text-center">
            <UIcon name="i-heroicons-x-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 class="text-2xl font-bold text-red-500 mb-2">CHECK-IN FAILED</h3>
            <p class="text-gray-400">{{ lastScan.message }}</p>
            
            <div v-if="lastScan.reason === 'already_checked_in'" class="mt-4 text-sm">
              <p class="text-gray-500">Already checked in at:</p>
              <p class="font-mono">{{ formatTime(lastScan.checked_in_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Check-ins -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">RECENT CHECK-INS</h2>
          
          <div v-if="recentCheckins.length === 0" class="text-center py-8 text-gray-500">
            No check-ins yet
          </div>

          <div v-else class="space-y-2">
            <div 
              v-for="(checkin, index) in recentCheckins.slice(0, 10)" 
              :key="index"
              class="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#2a2a2a]"
            >
              <div>
                <p class="font-bold">{{ checkin.participant_name }}</p>
                <p class="text-sm text-gray-400">{{ checkin.ticket_name }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500 font-mono">{{ formatTime(checkin.checked_in_at) }}</p>
                <span class="text-xs text-green-500">✓ Checked In</span>
              </div>
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

const { scanQR } = useApi()
const { startScanning, stopScanning, isScanning } = useQRScanner()

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const scanning = ref(false)
const processing = ref(false)
const manualQR = ref('')
const lastScan = ref<any>(null)
const recentCheckins = ref<any[]>([])

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const startScanner = async () => {
  if (!videoRef.value || !canvasRef.value) return

  try {
    scanning.value = true
    await startScanning(videoRef.value, canvasRef.value, handleQRDetected)
  } catch (error: any) {
    alert('Camera access denied: ' + error.message)
    scanning.value = false
  }
}

const stopScanner = () => {
  stopScanning()
  scanning.value = false
}

const handleQRDetected = async (qrCode: string) => {
  // Stop scanning temporarily
  stopScanner()
  
  // Process the QR code
  await processQR(qrCode)
  
  // Wait 2 seconds before resuming
  setTimeout(() => {
    if (videoRef.value && canvasRef.value) {
      startScanner()
    }
  }, 2000)
}

const handleManualScan = async () => {
  if (!manualQR.value.trim()) return
  await processQR(manualQR.value.trim())
  manualQR.value = ''
}

const processQR = async (qrCode: string) => {
  processing.value = true
  try {
    const result = await scanQR(qrCode)
    lastScan.value = result

    if (result.valid) {
      // Add to recent check-ins
      recentCheckins.value.unshift({
        participant_name: result.registration.participant_name,
        ticket_name: result.registration.ticket_name,
        checked_in_at: result.checked_in_at
      })

      // Play success sound (optional)
      playSound('success')
    } else {
      // Play error sound (optional)
      playSound('error')
    }
  } catch (error: any) {
    lastScan.value = {
      valid: false,
      message: error.message || 'Scan failed',
      reason: 'error'
    }
    playSound('error')
  } finally {
    processing.value = false
  }
}

const playSound = (type: 'success' | 'error') => {
  // Optional: Add sound feedback
  // const audio = new Audio(type === 'success' ? '/sounds/success.mp3' : '/sounds/error.mp3')
  // audio.play()
}

onUnmounted(() => {
  if (scanning.value) {
    stopScanner()
  }
})
</script>
