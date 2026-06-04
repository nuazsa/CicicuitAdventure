<template>
  <div class="sticky top-0 z-40 bg-white px-5 py-4 flex justify-between items-center border-b border-gray-100">
    <!-- Back Button -->
    <button v-if="back" @click="router.back()" class="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition">
      <i class="fa-solid fa-arrow-left text-lg"></i>
    </button>
    <button v-else="back" class="w-8 h-8" />

    <!-- Title -->
    <h1 class="text-lg font-extrabold text-[#114226]">{{ title }}</h1>

    <!-- Search Button -->
    <button class="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition">
      <i class="fa-solid fa-magnifying-glass text-lg"></i>
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Promo Menarik'
  },
  back: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
</script>