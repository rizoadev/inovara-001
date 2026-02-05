<template>
  <div>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold tracking-wider mb-2">USERS MANAGEMENT</h1>
        <p class="text-sm text-gray-400">View and manage all users</p>
      </div>

      <!-- Search & Filter -->
      <div class="flex gap-4">
        <div class="flex-1">
          <UInput 
            v-model="searchQuery" 
            placeholder="Search users..." 
            icon="i-heroicons-magnifying-glass"
            size="lg"
          />
        </div>
        <USelect 
          v-model="roleFilter" 
          :options="roleOptions"
          size="lg"
        />
      </div>

      <div v-if="loading" class="text-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-500" />
      </div>

      <div v-else-if="filteredUsers.length === 0" class="border border-[#2a2a2a] bg-[#0d0d0d] p-12 text-center">
        <p class="text-gray-400">No users found</p>
      </div>

      <div v-else class="border border-[#2a2a2a] bg-[#0d0d0d] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b border-[#2a2a2a] bg-[#0a0a0a]">
              <tr class="text-left text-gray-500">
                <th class="p-4 font-normal">Name</th>
                <th class="p-4 font-normal">Email</th>
                <th class="p-4 font-normal">Phone</th>
                <th class="p-4 font-normal">Role</th>
                <th class="p-4 font-normal">Registrations</th>
                <th class="p-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in filteredUsers" 
                :key="user.id"
                class="border-b border-[#1a1a1a] hover:bg-[#0d0d0d]"
              >
                <td class="p-4">
                  <div>
                    <p class="font-bold">{{ user.full_name }}</p>
                    <p class="text-xs text-gray-500 font-mono">{{ user.id.substring(0, 12) }}...</p>
                  </div>
                </td>
                <td class="p-4">{{ user.email }}</td>
                <td class="p-4">{{ user.phone || '-' }}</td>
                <td class="p-4">
                  <span 
                    class="px-2 py-1 text-xs uppercase font-bold"
                    :class="{
                      'bg-purple-900 text-purple-500': user.role === 'admin',
                      'bg-blue-900 text-blue-500': user.role === 'user'
                    }"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="p-4">
                  <span class="text-green-500 font-bold">{{ user.registrationCount || 0 }}</span>
                </td>
                <td class="p-4">
                  <UButton 
                    size="xs" 
                    color="gray"
                    @click="viewUser(user)"
                  >
                    VIEW
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <p class="text-xs text-gray-500 uppercase mb-2">Total Users</p>
          <p class="text-3xl font-bold">{{ users.length }}</p>
        </div>
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <p class="text-xs text-gray-500 uppercase mb-2">Admins</p>
          <p class="text-3xl font-bold text-purple-500">
            {{ users.filter(u => u.role === 'admin').length }}
          </p>
        </div>
        <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-6">
          <p class="text-xs text-gray-500 uppercase mb-2">Regular Users</p>
          <p class="text-3xl font-bold text-blue-500">
            {{ users.filter(u => u.role === 'user').length }}
          </p>
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

const { getUsers } = useApi()

const users = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const roleFilter = ref('all')

const roleOptions = [
  { label: 'All Roles', value: 'all' },
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' }
]

const filteredUsers = computed(() => {
  let filtered = users.value

  // Filter by role
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(u => u.role === roleFilter.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(u => 
      u.full_name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.includes(query)
    )
  }

  return filtered
})

const viewUser = (user: any) => {
  navigateTo(`/admin/users/${user.id}`)
}

onMounted(async () => {
  try {
    const response = await getUsers()
    users.value = response.data || []

    // Load registration count for each user
    for (const user of users.value) {
      const userDetail = await $fetch(`/api/users/${user.id}`)
      user.registrationCount = userDetail.registrations?.length || 0
    }
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
})
</script>
