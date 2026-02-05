<template>
  <nav class="border-b border-[#2a2a2a] bg-[#0d0d0d]">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-8">
          <NuxtLink to="/admin" class="text-xl font-bold tracking-wider text-green-500">
            EVENTHUB ADMIN
          </NuxtLink>
          
          <div class="hidden md:flex gap-4">
            <NuxtLink 
              to="/admin"
              class="px-3 py-2 text-sm hover:text-green-500 transition-colors"
              :class="{ 'text-green-500': $route.path === '/admin' }"
            >
              OVERVIEW
            </NuxtLink>
            <NuxtLink 
              to="/admin/events"
              class="px-3 py-2 text-sm hover:text-green-500 transition-colors"
              :class="{ 'text-green-500': $route.path.startsWith('/admin/events') }"
            >
              EVENTS
            </NuxtLink>
            <NuxtLink 
              to="/admin/users"
              class="px-3 py-2 text-sm hover:text-green-500 transition-colors"
              :class="{ 'text-green-500': $route.path.startsWith('/admin/users') }"
            >
              USERS
            </NuxtLink>
            <NuxtLink 
              to="/admin/files"
              class="px-3 py-2 text-sm hover:text-green-500 transition-colors"
              :class="{ 'text-green-500': $route.path === '/admin/files' }"
            >
              FILES
            </NuxtLink>
            <NuxtLink 
              to="/admin/reports"
              class="px-3 py-2 text-sm hover:text-green-500 transition-colors"
              :class="{ 'text-green-500': $route.path === '/admin/reports' }"
            >
              REPORTS
            </NuxtLink>
            <NuxtLink 
              to="/admin/scan"
              class="px-3 py-2 text-sm hover:text-green-500 transition-colors"
              :class="{ 'text-green-500': $route.path === '/admin/scan' }"
            >
              SCAN
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <UButton color="gray" size="sm" @click="logout">
            LOGOUT
          </UButton>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { logout } = useAuth()
</script>
