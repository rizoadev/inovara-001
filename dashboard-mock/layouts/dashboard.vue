<template>
  <div class="min-h-screen bg-[#0a0a0a]">
    <!-- Header -->
    <header class="border-b border-[#2a2a2a] bg-[#0d0d0d]">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/" class="flex items-center gap-2">
            <UIcon name="i-heroicons-ticket" class="w-6 h-6 text-green-500" />
            <span class="text-xl font-bold tracking-wider text-white">EVENTHUB</span>
          </NuxtLink>

          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-400">{{ user?.full_name || user?.email }}</span>
            <UButton 
              size="sm" 
              color="gray" 
              variant="ghost"
              @click="logout"
            >
              LOGOUT
            </UButton>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-12 gap-6">
        <!-- Sidebar -->
        <aside class="col-span-12 md:col-span-3">
          <div class="border border-[#2a2a2a] bg-[#0d0d0d] p-4">
            <h3 class="text-green-500 font-bold text-xs tracking-[0.15em] mb-4">
              USER DASHBOARD
            </h3>
            <nav class="space-y-1">
              <NuxtLink 
                to="/dashboard" 
                class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
                :class="$route.path === '/dashboard' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
              >
                <UIcon name="i-heroicons-ticket" class="w-4 h-4 inline mr-2" />
                My Registrations
              </NuxtLink>
              <NuxtLink 
                to="/dashboard/files" 
                class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
                :class="$route.path === '/dashboard/files' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
              >
                <UIcon name="i-heroicons-document" class="w-4 h-4 inline mr-2" />
                My Files
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="col-span-12 md:col-span-9">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, logout } = useAuth()
</script>
