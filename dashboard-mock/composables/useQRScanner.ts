import jsQR from 'jsqr'

export const useQRScanner = () => {
  const isScanning = ref(false)
  const videoElement = ref<HTMLVideoElement | null>(null)
  const canvasElement = ref<HTMLCanvasElement | null>(null)
  const stream = ref<MediaStream | null>(null)

  const startScanning = async (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    onScan: (data: string) => void
  ) => {
    videoElement.value = video
    canvasElement.value = canvas

    try {
      // Request camera access
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      })

      video.srcObject = stream.value
      video.setAttribute('playsinline', 'true') // Required for iOS
      video.play()

      isScanning.value = true

      // Start scanning loop
      requestAnimationFrame(() => tick(onScan))
    } catch (error) {
      console.error('Error accessing camera:', error)
      throw new Error('Camera access denied')
    }
  }

  const tick = (onScan: (data: string) => void) => {
    if (!isScanning.value || !videoElement.value || !canvasElement.value) {
      return
    }

    const video = videoElement.value
    const canvas = canvasElement.value
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight
      canvas.width = video.videoWidth
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      })

      if (code) {
        // QR code detected
        onScan(code.data)
        return // Stop scanning after successful scan
      }
    }

    // Continue scanning
    requestAnimationFrame(() => tick(onScan))
  }

  const stopScanning = () => {
    isScanning.value = false

    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }

    if (videoElement.value) {
      videoElement.value.srcObject = null
    }
  }

  return {
    isScanning,
    startScanning,
    stopScanning
  }
}
