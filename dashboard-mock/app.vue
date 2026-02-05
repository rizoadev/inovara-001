<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Load auth from storage on app mount
const { loadFromStorage } = useAuth()

onMounted(() => {
  loadFromStorage()
})
</script>

<style>
/* Global styles for EventHub */
:root {
  --color-bg: #0a0a0a;
  --color-card: #0d0d0d;
  --color-border: #2a2a2a;
  --color-accent: #22c55e;
}

body {
  background-color: var(--color-bg);
  color: white;
}

/* Remove all rounded corners */
.rounded,
.rounded-sm,
.rounded-md,
.rounded-lg,
.rounded-xl,
.rounded-2xl,
.rounded-3xl,
.rounded-full {
  border-radius: 0 !important;
}

/* Force sharp corners on all UI components */
button,
input,
select,
textarea,
.UButton,
.UCard,
.UTable,
.UInput,
.USelect,
.UBadge,
.UModal,
.UDropdown,
.UAvatar {
  border-radius: 0 !important;
}

/* Card base styling */
.UCard {
  border: 1px solid var(--color-border) !important;
  background-color: var(--color-card) !important;
}

/* Button base styling */
.UButton {
  border: 1px solid transparent !important;
}

/* Table styling */
.UTable {
  border: 1px solid var(--color-border) !important;
}

.UTable th,
.UTable td {
  border-bottom: 1px solid var(--color-border) !important;
}

/* Input styling */
.UInput {
  border: 1px solid var(--color-border) !important;
  border-radius: 0 !important;
}
</style>
