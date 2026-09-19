<template>
  <div class="flex flex-col items-center justify-center" :class="paddingClass">
    <i class="fa-solid fa-circle-notch fa-spin text-3xl text-[#145C34] mb-3"></i>
    <p v-if="text" class="text-xs font-medium text-gray-500">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Memuat data...' 
  },
  paddingClass: {
    type: String,
    default: 'py-20'
  }
})
</script>