<template>
  <MobileCardBase class="bg-white p-4">
    <h3 class="text-[11px] font-bold text-gray-500 mb-3 tracking-wider uppercase">Guest Star</h3>
    
    <div class="flex flex-col gap-5">
      <!-- Looping setiap guest star -->
      <div v-for="(guest, index) in guestStars" :key="index" class="flex flex-col gap-3">
        
        <!-- Profile Section -->
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-gray-100">
            <img 
              :src="guest.photo || '/images/default-guest.jpg'" 
              :alt="guest.name" 
              class="w-full h-full object-cover"
            />
          </div>
          
          <div class="flex flex-col">
            <p class="text-[14px] font-bold text-gray-800 leading-tight">
              {{ guest.name }}
            </p>
            <a 
              v-if="guest.instagram"
              :href="`https://instagram.com/${guest.instagram}`" 
              target="_blank" 
              class="text-[12px] text-blue-500 hover:text-blue-600 font-medium mt-0.5"
            >
              @{{ guest.instagram }}
            </a>
          </div>
        </div>

        <!-- Pesan / Quotes Section -->
        <div v-if="guest.message" class="bg-gray-50 border border-gray-100 rounded-lg p-3 relative mt-1">
          <span class="absolute top-2 left-2 text-2xl text-gray-200 leading-none font-serif">"</span>
          <p class="text-[12px] text-gray-600 italic leading-relaxed relative z-10 pl-4">
            {{ guest.message }}
          </p>
        </div>

        <!-- Garis pemisah, sembunyikan di item terakhir -->
        <hr v-if="index !== guestStars.length - 1" class="border-gray-100 mt-2" />
      </div>
    </div>
  </MobileCardBase>
</template>

<script setup>
defineProps({
  guestStars: {
    type: Array,
    default: () => []
  }
})
</script>