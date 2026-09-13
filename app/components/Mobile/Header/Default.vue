<template>
  <div class="sticky top-0 z-40 bg-white border-b border-gray-100 flex flex-col">
    <div class="px-5 py-4 flex justify-between items-center">
      <button @click="handleBack" class="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition">
        <i class="fa-solid fa-arrow-left text-lg"></i>
      </button>

      <h1 class="text-lg font-extrabold text-[#114226]">{{ title }}</h1>

      <button v-if="!hideSearch" @click="toggleSearch" class="text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition">
        <i class="fa-solid fa-magnifying-glass text-lg"></i>
      </button>
      <button v-else class="w-8 h-8" /> 
    </div>

    <div v-show="isSearchActive" class="px-5 pb-4 animate-fade-in-down">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        <input 
          type="text" 
          v-model="searchQuery"
          @input="handleInput"
          placeholder="Cari..." 
          class="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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
const route = useRoute()

const isSearchActive = ref(false)
const searchQuery = ref(route.query.cari || '')
let debounceTimeout = null

const handleBack = () => {
  if (props.backTo !== '') {
    router.push(props.backTo)
  } else {
    router.back() 
  }
}

const toggleSearch = () => {
  isSearchActive.value = !isSearchActive.value
}

const handleInput = () => {
  clearTimeout(debounceTimeout)
  
  debounceTimeout = setTimeout(() => {
    const query = { ...route.query }
    
    if (searchQuery.value.trim()) {
      query.cari = searchQuery.value.trim()
    } else {
      delete query.cari
    }
    
    router.push({ query })
  }, 500)
}

watch(() => route.query.cari, (newVal) => {
  searchQuery.value = newVal || ''
})
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.2s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>