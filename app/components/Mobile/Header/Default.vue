<template>
  <div class="sticky top-0 z-40 bg-white px-5 py-4 flex justify-between items-center border-b border-gray-100 z-100">
    <!-- Back Button -->
    <button v-if="backTo" @click="router.push(backTo)" class="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition">
      <i class="fa-solid fa-arrow-left text-lg"></i>
    </button>
    <button v-else="backTo" class="w-8 h-8" />

    <!-- Title -->
    <h1 class="text-lg font-extrabold text-[#114226]">{{ title }}</h1>

    <!-- Search Button -->
    <button v-if="!hideSearch" class="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition">
      <i class="fa-solid fa-magnifying-glass text-lg"></i>
    </button>
    <button v-else="hideSearch" class="w-8 h-8" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Promo Menarik'
  },
  backTo: {
    type: String,
    default: ''
  },
  hideSearch: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
</script>