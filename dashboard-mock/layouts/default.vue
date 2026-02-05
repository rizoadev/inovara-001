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

          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/events" class="text-sm text-gray-400 hover:text-white transition">
              EVENTS
            </NuxtLink>
            <NuxtLink 
              v-if="isAuthenticated" 
              to="/dashboard" 
              class="text-sm text-gray-400 hover:text-white transition"
            >
              MY TICKETS
            </NuxtLink>
            <NuxtLink 
              v-if="isAdmin" 
              to="/admin" 
              class="text-sm text-gray-400 hover:text-white transition"
            >
              ADMIN
            </NuxtLink>
          </nav>

          <div class="flex items-center gap-3">
            <template v-if="isAuthenticated">
              <span class="text-sm text-gray-400">{{ user?.full_name || user?.email }}</span>
              <UButton 
                size="sm" 
                color="gray" 
                variant="ghost"
                @click="logout"
              >
                LOGOUT
              </UButton>
            </template>
            <template v-else>
              <UButton 
                size="sm" 
                color="green"
                @click="navigateTo('/auth/login')"
              >
                LOGIN
              </UButton>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-[#2a2a2a] bg-[#0d0d0d] mt-20">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-sm text-gray-500">
          <p>&copy; 2024 EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { user, isAuthenticated, isAdmin, logout } = useAuth()
</script>
