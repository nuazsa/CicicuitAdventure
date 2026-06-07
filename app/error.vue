<script setup lang="ts">
defineProps({
  error: { type: Object, required: true }
})
const handleClearError = () => clearError({ redirect: '/' })
</script>

<template>
    <NuxtLayout name="mobile">
        <MobileError404 v-if="error.statusCode === 404" :onClear="handleClearError" />
        <MobileError500 v-else :error="error" :onClear="handleClearError" />
    </NuxtLayout>
</template>
