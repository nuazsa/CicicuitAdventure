<template>
  <div class="px-5 py-4 flex gap-3 overflow-x-auto scrollbar-hide snap-x">
    <button 
      v-for="category in listCategory" 
      :key="category"
      @click="activeCategory = category"
      class="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors snap-center"
      :class="activeCategory === category ? 'bg-[#0B4D26] text-white' : 'bg-[#EAE6E1] text-gray-700 hover:bg-gray-200'"
    >
      {{ category }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  listCategory: {
    type: Array,
    required: true
  },
  activeCategory: {
    type: String,
    required: true
  }
});
</script>