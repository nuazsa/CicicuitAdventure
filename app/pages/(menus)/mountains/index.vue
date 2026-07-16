<template>
  <!-- Header -->
  <MobileHeaderDefault title="Daftar Gunung" backTo="/profile" />

  <!-- State Loading Awal -->
  <div v-if="isInitialLoading" class="flex flex-col items-center justify-center py-32">
    <i class="fa-solid fa-circle-notch fa-spin text-3xl text-[#145C34] mb-3"></i>
    <p class="text-xs font-medium text-gray-500">Memuat daftar gunung...</p>
  </div>

  <div v-else class="px-5 pt-5 flex flex-col gap-4">
    
    <!-- Deskripsi Halaman -->
    <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3 items-center">
      <div class="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#145C34] shrink-0">
        <i class="fa-solid fa-map-location-dot text-lg"></i>
      </div>
      <div>
        <h2 class="text-[13px] font-bold text-gray-800">Eksplorasi Pegunungan</h2>
        <p class="text-[11px] text-gray-500 leading-relaxed mt-0.5">
          Temukan informasi lengkap elevasi, jalur, dan status gunung di seluruh Indonesia.
        </p>
      </div>
    </div>

    <!-- State Jika Data Kosong -->
    <div v-if="mountains.length === 0" class="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
        <i class="fa-solid fa-mountain-sun text-2xl text-gray-300"></i>
      </div>
      <h3 class="text-[14px] font-bold text-gray-800">Tidak Ada Data</h3>
      <p class="text-[11px] text-gray-500 mt-1 max-w-[200px] mx-auto">
        Daftar gunung saat ini belum tersedia atau gagal dimuat.
      </p>
    </div>

    <!-- List Data Gunung -->
    <div 
      v-else 
      v-for="mnt in mountains" 
      :key="mnt.slug"
      @click="router.push(`/mountains/${mnt.slug}`)"
      class="bg-white rounded-2xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-3 cursor-pointer hover:shadow-md transition active:scale-[0.98]"
    >
      <div class="flex gap-3 items-start">
        <div class="w-12 h-12 bg-gradient-to-br from-[#145C34] to-[#2E7D32] rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm">
          <i class="fa-solid fa-mountain text-xl"></i>
        </div>
        
        <div class="flex-1">
          <h3 class="font-extrabold text-gray-900 text-[15px] leading-tight">{{ mnt.name }}</h3>
          <p class="text-[11px] text-gray-500 mt-1 flex items-start gap-1">
            <i class="fa-solid fa-location-dot text-gray-400 mt-0.5"></i> 
            <span class="line-clamp-1">{{ mnt.location?.region || '-' }}, {{ mnt.location?.province || '-' }}</span>
          </p>
        </div>
        
        <div class="text-right shrink-0 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100">
          <span class="text-[14px] font-black text-[#145C34] block leading-none">{{ formatNumber(mnt.elevation) }}</span>
          <span class="text-[9px] text-gray-500 font-bold tracking-wider mt-0.5 block">MDPL</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 pt-3 border-t border-gray-50 border-dashed">
        <!-- Badge Kesulitan -->
        <span class="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
          <i class="fa-solid fa-person-hiking"></i>
          {{ mnt.climbing_info?.difficulty_level || 'Tidak diketahui' }}
        </span>
        
        <!-- Badge Status Vulkanik -->
        <span 
          class="px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1"
          :class="getVolcanicStyle(mnt.geology?.volcanic_status).class"
        >
          <i class="fa-solid" :class="getVolcanicStyle(mnt.geology?.volcanic_status).icon"></i>
          {{ mnt.geology?.volcanic_status || 'Tidak Diketahui' }}
        </span>

        <!-- Estimasi Waktu -->
        <span v-if="mnt.climbing_info?.estimated_time_hours" class="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
          <i class="fa-regular fa-clock"></i>
          ± {{ mnt.climbing_info.estimated_time_hours }} Jam
        </span>
      </div>
    </div>

    <!-- Indikator Infinite Scroll -->
    <div ref="scrollTrigger" class="h-10 flex items-center justify-center mt-2">
      <div v-if="isLoadingMore" class="flex items-center gap-2 text-gray-400 text-xs font-medium">
        <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat data lainnya...
      </div>
      <div v-else-if="mountains.length > 0 && !hasMore" class="text-gray-400 text-[10px] font-medium">
        — Semua gunung telah ditampilkan —
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig, useCookie } from '#imports'
// Jika halaman ini butuh login, buka comment di bawah:
// import authCustomer from '~/middleware/auth-customer'
// definePageMeta({ middleware: authCustomer })

const router = useRouter()
const config = useRuntimeConfig()
const authCookie = useCookie('access_token')

// --- State List Data ---
const mountains = ref([])
const page = ref(1)
const limit = 10
const totalPages = ref(1)
const hasMore = ref(true)

const isInitialLoading = ref(true)
const isLoadingMore = ref(false)

// --- Ref untuk Observer Infinite Scroll ---
const scrollTrigger = ref(null)
let observer = null

onMounted(async () => {
  // Fetch Data Awal
  await fetchMountains(false)
  isInitialLoading.value = false

  // Setup Intersection Observer
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isInitialLoading.value && !isLoadingMore.value && hasMore.value) {
      fetchMountains(true)
    }
  }, { threshold: 0.5 }) 
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

watchEffect(() => {
  if (scrollTrigger.value && observer) {
    observer.observe(scrollTrigger.value)
  }
})

// --- API Call ---
const fetchMountains = async (isLoadMore = false) => {
  if (isLoadMore) {
    isLoadingMore.value = true
    page.value += 1
  } else {
    page.value = 1
    mountains.value = []
    hasMore.value = true
  }

  try {
    const query = new URLSearchParams({
      page: page.value,
      limit: limit
    }).toString()

    const response = await $fetch(`${config.public.apiBaseUrl}/mountains?${query}`, {
      headers: {
        'Authorization': authCookie.value ? `Bearer ${authCookie.value}` : '',
        'Accept': 'application/json'
      }
    })

    const newItems = response.data || []
    totalPages.value = response.meta?.total_pages || 1

    if (page.value >= totalPages.value) {
      hasMore.value = false
    }

    if (isLoadMore) {
      mountains.value = [...mountains.value, ...newItems]
    } else {
      mountains.value = newItems
    }
  } catch (err) {
    console.error('Gagal mengambil daftar gunung:', err)
  } finally {
    isLoadingMore.value = false
  }
}

// --- Utilities & Formatters ---
const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num || 0)
}

const getVolcanicStyle = (status) => {
  const s = (status || '').toLowerCase()
  if (s.includes('normal') || s.includes('tidak aktif')) {
    return { class: 'bg-emerald-50 text-emerald-600', icon: 'fa-shield-halved' }
  } else if (s.includes('waspada') || s.includes('siaga')) {
    return { class: 'bg-orange-50 text-orange-600', icon: 'fa-triangle-exclamation' }
  } else if (s.includes('awas')) {
    return { class: 'bg-red-50 text-red-600', icon: 'fa-volcano' }
  }
  return { class: 'bg-gray-50 text-gray-500', icon: 'fa-circle-info' }
}
</script>