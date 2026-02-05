<template>
  <div>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-wider mb-2">MY FILES</h1>
        <p class="text-sm text-gray-400">Upload presentation files for your events</p>
      </div>

      <!-- Registration Selector -->
      <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
        <label class="text-sm text-gray-400 mb-2 block">SELECT REGISTRATION</label>
        <USelect 
          v-model="selectedRegId" 
          :options="regOptions"
          size="lg"
          placeholder="Choose an event..."
        />
      </div>

      <div v-if="!selectedRegId" class="border border-[#2a2a2a] bg-[#0d0d0d] p-12 text-center">
        <p class="text-gray-400">Select a registration to manage files</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Upload Section -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">UPLOAD FILE</h2>
          <div class="space-y-4">
            <div>
              <input 
                ref="fileInput"
                type="file" 
                accept=".pdf,.ppt,.pptx"
                class="hidden"
                @change="handleFileSelect"
              />
              <UButton 
                color="green" 
                size="lg"
                block
                @click="fileInput?.click()"
              >
                <UIcon name="i-heroicons-arrow-up-tray" class="w-5 h-5 mr-2" />
                SELECT FILE
              </UButton>
            </div>
            
            <div v-if="selectedFile" class="p-4 border border-[#2a2a2a] bg-[#0a0a0a]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-document" class="w-6 h-6 text-blue-500" />
                  <div>
                    <p class="font-mono text-sm">{{ selectedFile.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                </div>
                <UButton 
                  color="green"
                  :loading="uploading"
                  @click="uploadFile"
                >
                  UPLOAD
                </UButton>
              </div>
            </div>

            <p class="text-xs text-gray-500">
              Accepted formats: PDF, PPT, PPTX • Max size: 10MB
            </p>
          </div>
        </div>

        <!-- Files List -->
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <h2 class="text-xl font-bold mb-4">UPLOADED FILES</h2>
          
          <div v-if="loadingFiles" class="text-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-green-500" />
          </div>

          <div v-else-if="files.length === 0" class="text-center py-8 text-gray-500">
            No files uploaded yet
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="file in files" 
              :key="file.id"
              class="p-4 border border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-document" class="w-6 h-6 text-blue-500" />
                <div>
                  <p class="font-mono text-sm">{{ file.filename }}</p>
                  <p class="text-xs text-gray-500">
                    {{ formatFileSize(file.size) }} • {{ formatDate(file.uploaded_at) }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <UButton size="xs" color="gray" @click="downloadFile(file)">
                  DOWNLOAD
                </UButton>
                <UButton size="xs" color="red" @click="deleteFile(file)">
                  DELETE
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

const { getMyRegistrations } = useApi()

const registrations = ref<any[]>([])
const selectedRegId = ref('')
const files = ref<any[]>([])
const loadingFiles = ref(false)
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const uploading = ref(false)

const regOptions = computed(() => {
  return registrations.value
    .filter(r => r.status === 'paid')
    .map(r => ({
      label: r.event?.title || 'Unknown Event',
      value: r.id
    }))
})

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const uploadFile = async () => {
  if (!selectedFile.value || !selectedRegId.value) return
  
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('registration_id', selectedRegId.value)
    
    await $fetch('/api/files/upload', {
      method: 'POST',
      body: formData
    })
    
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
    
    await loadFiles()
  } catch (error) {
    console.error('Failed to upload file:', error)
    alert('Failed to upload file')
  } finally {
    uploading.value = false
  }
}

const downloadFile = (file: any) => {
  alert(`Download: ${file.filename}`)
}

const deleteFile = async (file: any) => {
  if (!confirm(`Delete ${file.filename}?`)) return
  
  try {
    await $fetch(`/api/files/${file.id}`, { method: 'DELETE' })
    files.value = files.value.filter(f => f.id !== file.id)
  } catch (error) {
    console.error('Failed to delete file:', error)
  }
}

const loadFiles = async () => {
  if (!selectedRegId.value) return
  
  loadingFiles.value = true
  try {
    const response = await $fetch('/api/files', {
      params: { registration_id: selectedRegId.value }
    })
    files.value = response.data || []
  } catch (error) {
    console.error('Failed to load files:', error)
  } finally {
    loadingFiles.value = false
  }
}

watch(selectedRegId, loadFiles)

onMounted(async () => {
  try {
    const response = await getMyRegistrations()
    registrations.value = response.data || []
    
    // Auto-select from query param
    const route = useRoute()
    if (route.query.registration_id) {
      selectedRegId.value = route.query.registration_id as string
    }
  } catch (error) {
    console.error('Failed to load registrations:', error)
  }
})
</script>
