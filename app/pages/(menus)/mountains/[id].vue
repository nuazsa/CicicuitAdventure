<template>
  <!-- Header -->
  <MobileHeaderDefault title="Detail Gunung" backTo="/mountains" hideSearch />

  <!-- Loading State -->
  <div v-if="pending" class="flex flex-col items-center justify-center min-h-[60vh]">
    <i class="fa-solid fa-circle-notch fa-spin text-3xl text-[#145C34] mb-3"></i>
    <p class="text-xs font-medium text-gray-500">Mencari informasi gunung...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error || !mountain" class="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
    <i class="fa-solid fa-mountain-sun text-4xl text-gray-300 mb-3"></i>
    <h2 class="text-sm font-bold text-gray-800 mb-1">Gunung Tidak Ditemukan</h2>
    <p class="text-xs text-gray-500">Data gunung yang Anda cari tidak tersedia atau mungkin sudah dihapus.</p>
    <button @click="router.push('/mountains')" class="mt-4 px-5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
      Kembali ke Daftar Gunung
    </button>
  </div>

  <!-- Content State -->
  <div v-else>
    <!-- Hero Image Container -->
    <div class="relative w-full h-[280px]">
      <NuxtImg 
        :src="mountain.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800&h=600'" 
        :alt="mountain.name" 
        class="w-full h-full object-cover"
        format="webp"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      
      <div class="absolute bottom-10 left-5 right-5">
        <div class="bg-[#F58220] text-white text-[10px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 shadow-sm">
          <i class="fa-solid fa-location-dot"></i> {{ mountain.location?.province || 'Indonesia' }}
        </div>
        <h1 class="text-3xl font-black text-white drop-shadow-md leading-tight">{{ mountain.name }}</h1>
      </div>
    </div>

    <!-- Main Content Card (Overlap Hero) -->
    <div class="px-5 relative z-10 -mt-6">
      <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        
        <!-- Info Utama (Elevasi & Kesulitan) -->
        <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div>
            <p class="text-[10px] text-gray-500 font-medium mb-0.5">Ketinggian</p>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black text-[#145C34]">{{ formatNumber(mountain.elevation) }}</span>
              <span class="text-[10px] font-bold text-gray-400 tracking-wider">MDPL</span>
            </div>
          </div>
          
          <div class="w-[1px] h-10 bg-gray-200"></div>
          
          <div class="text-right">
            <p class="text-[10px] text-gray-500 font-medium mb-0.5">Level Kesulitan</p>
            <span 
              class="text-[13px] font-bold"
              :class="getDifficultyColor(mountain.climbing_info?.difficulty_level)"
            >
              {{ mountain.climbing_info?.difficulty_level || 'Tidak diketahui' }}
            </span>
          </div>
        </div>

        <!-- Deskripsi Singkat -->
        <div v-if="mountain.information?.description">
          <h3 class="text-[14px] font-bold text-gray-900 mb-2">Tentang {{ mountain.name }}</h3>
          <p class="text-[12px] text-gray-600 leading-relaxed text-justify">
            {{ mountain.information.description }}
          </p>
        </div>

        <!-- Fakta Unik -->
        <div v-if="mountain.information?.unique_fact" class="bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4 flex gap-3 items-start">
          <i class="fa-solid fa-lightbulb text-[#FF8F00] text-lg mt-0.5 shrink-0"></i>
          <div>
            <h4 class="text-[12px] font-bold text-[#FF8F00] mb-1">Fakta Unik</h4>
            <p class="text-[11px] text-[#5D4037] leading-relaxed">
              {{ mountain.information.unique_fact }}
            </p>
          </div>
        </div>

        <!-- Grid Info Detail -->
        <div>
          <h3 class="text-[14px] font-bold text-gray-900 mb-3">Informasi Pendakian</h3>
          <div class="grid grid-cols-2 gap-3">
            
            <div class="bg-white border border-gray-100 rounded-xl p-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
              <i class="fa-regular fa-clock text-[#145C34] mb-2 text-lg"></i>
              <p class="text-[10px] text-gray-500 mb-0.5">Estimasi Waktu</p>
              <p class="text-[12px] font-bold text-gray-800">{{ mountain.climbing_info?.estimated_time_hours ? `± ${mountain.climbing_info.estimated_time_hours} Jam` : '-' }}</p>
            </div>
            
            <div class="bg-white border border-gray-100 rounded-xl p-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
              <i class="fa-solid fa-building-shield text-[#145C34] mb-2 text-lg"></i>
              <p class="text-[10px] text-gray-500 mb-0.5">Pengelola</p>
              <p class="text-[12px] font-bold text-gray-800 line-clamp-1">{{ mountain.climbing_info?.management || '-' }}</p>
            </div>

          </div>
        </div>

        <!-- Jalur Pendakian -->
        <div v-if="mountain.climbing_info?.main_trails?.length > 0">
          <h3 class="text-[14px] font-bold text-gray-900 mb-3">Jalur Resmi</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(trail, idx) in mountain.climbing_info.main_trails.join(',').split(',')" 
              :key="idx"
              class="bg-green-50 text-[#145C34] px-3 py-1.5 rounded-lg text-[11px] font-bold border border-green-100"
            >
              Via {{ trail.trim() }}
            </span>
          </div>
        </div>

        <!-- Info Geologi -->
        <div>
          <h3 class="text-[14px] font-bold text-gray-900 mb-3">Geologi & Status</h3>
          <div class="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
            <div class="flex justify-between items-center">
              <span class="text-[11px] text-gray-500">Tipe Gunung</span>
              <span class="text-[11px] font-bold text-gray-800">{{ mountain.geology?.type || '-' }}</span>
            </div>
            <div class="border-t border-gray-200 border-dashed"></div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] text-gray-500">Letusan Terakhir</span>
              <span class="text-[11px] font-bold text-gray-800">{{ mountain.geology?.last_eruption_year || '-' }}</span>
            </div>
            <div class="border-t border-gray-200 border-dashed"></div>
            <div class="flex justify-between items-center">
              <span class="text-[11px] text-gray-500">Status Vulkanik</span>
              <span 
                class="text-[10px] font-bold px-2 py-1 rounded"
                :class="getVolcanicStyle(mountain.geology?.volcanic_status).class"
              >
                {{ mountain.geology?.volcanic_status || 'Normal' }}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFetch, useRuntimeConfig, useCookie } from '#imports'

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const authCookie = useCookie('access_token')

const mountainId = route.params.id // Atau route.params.uuid tergantung nama file dynamic route Anda

// Fetch Data Detail Gunung
const { data, pending, error } = await useFetch(`${config.public.apiBaseUrl}/mountains/${mountainId}`, {
  headers: {
    'Authorization': authCookie.value ? `Bearer ${authCookie.value}` : '',
    'Accept': 'application/json'
  }
})

// Ekstraksi data dari respons API
const mountain = computed(() => data.value?.data || null)

// --- Utility Formatters ---
const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num || 0)
}

const getDifficultyColor = (level) => {
  const lvl = (level || '').toLowerCase()
  if (lvl.includes('pemula')) return 'text-emerald-600'
  if (lvl.includes('menengah')) return 'text-orange-500'
  if (lvl.includes('sulit') || lvl.includes('ekstrem')) return 'text-red-600'
  return 'text-gray-600'
}

const getVolcanicStyle = (status) => {
  const s = (status || '').toLowerCase()
  if (s.includes('normal') || s.includes('tidak aktif')) {
    return { class: 'bg-emerald-100 text-emerald-700' }
  } else if (s.includes('waspada') || s.includes('siaga')) {
    return { class: 'bg-orange-100 text-orange-700' }
  } else if (s.includes('awas')) {
    return { class: 'bg-red-100 text-red-700' }
  }
  return { class: 'bg-gray-100 text-gray-600' }
}
</script>