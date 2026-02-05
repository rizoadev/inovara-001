<template>
  <nav class="border-b border-[#2a2a2a] bg-[#0d0d0d]">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="text-xl font-bold tracking-wider text-green-500">
            EVENTHUB
          </NuxtLink>
          
          <div class="hidden md:flex gap-4">
            <NuxtLink 
              to="/dashboard"
              class="px-3 py-2 text-sm hover:text-green-500 transition-colors"
              :class="{ 'text-green-500': $route.path === '/dashboard' }"
            >
              MY TICKETS
            </NuxtLink>
            <NuxtLink 
              to="/dashboard/files"
              class="px-3 py-2 text-sm hover:text-green-500 transition-colors"
              :class="{ 'text-green-500': $route.path === '/dashboard/files' }"
            >
              MY FILES
            </NuxtLink>
            <NuxtLink 
              to="/events"
              class="px-3 py-2 text-sm hover:text-green-500 transition-colors"
            >
              BROWSE EVENTS
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-400">{{ user?.full_name }}</span>
          <UButton color="gray" size="sm" @click="logout">
            LOGOUT
          </UButton>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
</script>
