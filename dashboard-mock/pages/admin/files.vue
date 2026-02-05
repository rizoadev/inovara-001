<template>
  <div>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-wider mb-2">FILES MANAGEMENT</h1>
        <p class="text-sm text-gray-400">View and manage uploaded files</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
      </div>

      <div v-else-if="files.length === 0" class="border border-[#2a2a2a] bg-[#0d0d0d] p-12 text-center">
        <UIcon name="i-heroicons-document" class="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <p class="text-gray-400">No files uploaded yet</p>
      </div>

      <div v-else class="border border-[#2a2a2a] bg-[#0d0d0d] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-[#2a2a2a] bg-[#0a0a0a]">
              <tr class="text-left text-gray-500">
                <th class="p-4 font-normal">File Name</th>
                <th class="p-4 font-normal">Event</th>
                <th class="p-4 font-normal">User</th>
                <th class="p-4 font-normal">Size</th>
                <th class="p-4 font-normal">Uploaded</th>
                <th class="p-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="file in files" 
                :key="file.id"
                class="border-b border-[#1a1a1a] hover:bg-[#0d0d0d]"
              >
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-document" class="w-5 h-5 text-blue-500" />
                    <span class="font-mono text-xs">{{ file.filename }}</span>
                  </div>
                </td>
                <td class="p-4">{{ file.event?.title || '-' }}</td>
                <td class="p-4">{{ file.user?.full_name || '-' }}</td>
                <td class="p-4">{{ formatFileSize(file.size) }}</td>
                <td class="p-4 text-gray-500">{{ formatDate(file.uploaded_at) }}</td>
                <td class="p-4">
                  <div class="flex gap-2">
                    <UButton size="xs" color="gray" @click="downloadFile(file)">
                      DOWNLOAD
                    </UButton>
                    <UButton size="xs" color="red" @click="deleteFile(file)">
                      DELETE
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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

const files = ref<any[]>([])
const loading = ref(true)

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

onMounted(async () => {
  try {
    const response = await $fetch('/api/files')
    files.value = response.data || []
  } catch (error) {
    console.error('Failed to load files:', error)
  } finally {
    loading.value = false
  }
})
</script>
