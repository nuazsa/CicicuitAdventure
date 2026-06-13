<template>
  <div class="sticky top-0 z-40 bg-white px-5 py-4 flex justify-between items-center border-b border-gray-100 z-100">
    <button @click="handleBack" class="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition">
      <i class="fa-solid fa-arrow-left text-lg"></i>
    </button>

    <h1 class="text-lg font-extrabold text-[#114226]">{{ title }}</h1>

    <button v-if="!hideSearch" class="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition">
      <i class="fa-solid fa-magnifying-glass text-lg"></i>
    </button>
    <button v-else class="w-8 h-8" /> 
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' // Pastikan di-import jika tidak menggunakan Nuxt auto-import

// 1. Tampung defineProps ke dalam variabel "props"
const props = defineProps({
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

const handleBack = () => {
  // 2. Gunakan props.backTo, bukan backTo.value
  // 3. Perbaiki logika: Jika ADA isinya (tidak string kosong), baru di-push
  if (props.backTo !== '') {
    router.push(props.backTo)
  } else {
    // Jika kosong (""), eksekusi go back
    router.back() 
  }
}
</script>