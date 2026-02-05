<template>
  <div class="min-h-screen bg-[#0a0a0a]">
    <!-- Mobile Header -->
    <header class="border-b border-[#2a2a2a] bg-[#0d0d0d] md:hidden">
      <div class="flex items-center justify-between px-4 h-14">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-ticket" class="w-5 h-5 text-green-500" />
          <span class="text-lg font-bold tracking-wider text-white">EVENTHUB ADMIN</span>
        </div>
        <UButton 
          size="sm" 
          color="gray" 
          variant="ghost"
          icon="i-heroicons-bars-3"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
    </header>

    <div class="flex">
      <!-- Desktop Sidebar -->
      <aside class="hidden md:block w-64 border-r border-[#2a2a2a] bg-[#0d0d0d] min-h-screen">
        <div class="p-4">
          <NuxtLink to="/" class="flex items-center gap-2 mb-8">
            <UIcon name="i-heroicons-ticket" class="w-6 h-6 text-green-500" />
            <span class="text-xl font-bold tracking-wider text-white">EVENTHUB</span>
          </NuxtLink>

          <nav class="space-y-1">
            <NuxtLink 
              to="/admin" 
              class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
              :class="$route.path === '/admin' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
            >
              <UIcon name="i-heroicons-home" class="w-4 h-4 inline mr-2" />
              Overview
            </NuxtLink>
            <NuxtLink 
              to="/admin/events" 
              class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
              :class="$route.path.startsWith('/admin/events') ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
            >
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 inline mr-2" />
              Events
            </NuxtLink>
            <NuxtLink 
              to="/admin/scan" 
              class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
              :class="$route.path === '/admin/scan' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
            >
              <UIcon name="i-heroicons-qr-code" class="w-4 h-4 inline mr-2" />
              QR Scanner
            </NuxtLink>
            <NuxtLink 
              to="/admin/users" 
              class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
              :class="$route.path === '/admin/users' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
            >
              <UIcon name="i-heroicons-users" class="w-4 h-4 inline mr-2" />
              Users
            </NuxtLink>
            <NuxtLink 
              to="/admin/files" 
              class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
              :class="$route.path === '/admin/files' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
            >
              <UIcon name="i-heroicons-document" class="w-4 h-4 inline mr-2" />
              Files
            </NuxtLink>
            <NuxtLink 
              to="/admin/reports" 
              class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
              :class="$route.path === '/admin/reports' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
            >
              <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 inline mr-2" />
              Reports
            </NuxtLink>
          </nav>

          <div class="mt-8 pt-8 border-t border-[#2a2a2a]">
            <div class="px-3 py-2 text-xs text-gray-500">
              {{ user?.full_name || user?.email }}
            </div>
            <UButton 
              size="sm" 
              color="gray" 
              variant="ghost"
              class="w-full justify-start"
              @click="logout"
            >
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
              Logout
            </UButton>
          </div>
        </div>
      </aside>

      <!-- Mobile Menu -->
      <div 
        v-if="mobileMenuOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        @click="mobileMenuOpen = false"
      >
        <div class="w-64 bg-[#0d0d0d] h-full border-r border-[#2a2a2a]" @click.stop>
          <div class="p-4">
            <nav class="space-y-1">
              <NuxtLink 
                to="/admin" 
                class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
                :class="$route.path === '/admin' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-home" class="w-4 h-4 inline mr-2" />
                Overview
              </NuxtLink>
              <NuxtLink 
                to="/admin/events" 
                class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
                :class="$route.path.startsWith('/admin/events') ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-calendar" class="w-4 h-4 inline mr-2" />
                Events
              </NuxtLink>
              <NuxtLink 
                to="/admin/scan" 
                class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
                :class="$route.path === '/admin/scan' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-qr-code" class="w-4 h-4 inline mr-2" />
                QR Scanner
              </NuxtLink>
              <NuxtLink 
                to="/admin/users" 
                class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
                :class="$route.path === '/admin/users' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-users" class="w-4 h-4 inline mr-2" />
                Users
              </NuxtLink>
              <NuxtLink 
                to="/admin/files" 
                class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
                :class="$route.path === '/admin/files' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-document" class="w-4 h-4 inline mr-2" />
                Files
              </NuxtLink>
              <NuxtLink 
                to="/admin/reports" 
                class="block px-3 py-2 text-sm hover:bg-[#151515] transition"
                :class="$route.path === '/admin/reports' ? 'bg-[#151515] text-green-500' : 'text-gray-400'"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-chart-bar" class="w-4 h-4 inline mr-2" />
                Reports
              </NuxtLink>
            </nav>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <main class="flex-1 p-4 md:p-8">
        <slot />
      </main>
    </div>

    <!-- Bottom Navigation (Mobile PWA) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-[#2a2a2a] md:hidden z-30">
      <div class="flex justify-around items-center h-16">
        <NuxtLink 
          to="/admin" 
          class="flex flex-col items-center gap-1 px-4 py-2"
          :class="$route.path === '/admin' ? 'text-green-500' : 'text-gray-400'"
        >
          <UIcon name="i-heroicons-home" class="w-5 h-5" />
          <span class="text-[10px]">Home</span>
        </NuxtLink>
        <NuxtLink 
          to="/admin/scan" 
          class="flex flex-col items-center gap-1 px-4 py-2"
          :class="$route.path === '/admin/scan' ? 'text-green-500' : 'text-gray-400'"
        >
          <UIcon name="i-heroicons-qr-code" class="w-5 h-5" />
          <span class="text-[10px]">Scan</span>
        </NuxtLink>
        <NuxtLink 
          to="/admin/events" 
          class="flex flex-col items-center gap-1 px-4 py-2"
          :class="$route.path.startsWith('/admin/events') ? 'text-green-500' : 'text-gray-400'"
        >
          <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
          <span class="text-[10px]">Events</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
const { user, logout } = useAuth()
const mobileMenuOpen = ref(false)
</script>
