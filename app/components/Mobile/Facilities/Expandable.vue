<template>
  <div v-if="facilities && facilities.length > 0">
    
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-[15px] font-bold text-gray-800">{{ title }}</h2>
      
      <!-- Tombol hanya muncul jika array facilities lebih dari 6 -->
      <button 
        v-if="facilities.length > 6"
        @click="isExpanded = !isExpanded"
        class="text-[#145C34] text-[11px] font-bold hover:underline"
      >
        {{ isExpanded ? 'Lebih Sedikit' : 'Lihat Semua' }}
      </button>
    </div>
    
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-4 gap-x-2 px-2">
      <div 
        v-for="facility in displayedFacilities" 
        :key="facility.name" 
        class="flex flex-col items-center gap-2"
      >
        <div class="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-[#145C34]">
          <i v-if="facility.icon.includes('fa-')" :class="facility.icon"></i>
          <span v-else>{{ facility.icon }}</span>
        </div>
        <span class="text-[10px] font-medium text-gray-600 text-center leading-tight">
          {{ facility.name }}
        </span>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Fasilitas Open Trip'
  },
  facilities: {
    type: Array,
    default: () => [] 
  }
})

const isExpanded = ref(false)

const displayedFacilities = computed(() => {
  return isExpanded.value ? props.facilities : props.facilities.slice(0, 6)
})
</script>