<template>
  <MobileHeaderDefault title="Poin & Keuntungan" backTo="/profile" hideSearch />

  <div v-if="isInitialLoading" class="flex flex-col items-center justify-center py-20">
    <i class="fa-solid fa-circle-notch fa-spin text-3xl text-[#145C34] mb-3"></i>
    <p class="text-xs font-medium text-gray-500">Memuat data poin...</p>
  </div>

  <div v-else class="flex flex-col gap-5 pt-4">
    
    <div class="px-5">
      <div class="bg-gradient-to-br from-[#145C34] to-[#0D3B22] rounded-3xl p-5 shadow-lg relative overflow-hidden text-white">
        <i class="fa-solid fa-gem absolute -right-4 -bottom-4 text-[100px] text-white/5 rotate-12"></i>
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>

        <div class="relative z-10 flex justify-between items-start mb-6">
          <div>
            <p class="text-[11px] font-medium text-green-100 mb-1">Total Poin Aktif</p>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner">
                <i class="fa-solid fa-coins text-[#B45309] text-sm"></i>
              </div>
              <h2 class="text-3xl font-black tracking-tight">{{ formatNumber(gamificationData?.points || 0) }}</h2>
            </div>
          </div>
          <div class="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <i class="fa-solid fa-star text-yellow-300 text-[10px]"></i>
            <span class="text-[10px] font-bold uppercase tracking-wider">{{ gamificationData?.membership || 'MEMBER' }}</span>
          </div>
        </div>

        <div class="relative z-10 w-full mt-2">
          <div class="flex justify-between text-[10px] font-medium text-green-100 mb-2">
            <span>Progress Level Selanjutnya</span>
            <span>{{ formatNumber(gamificationData?.points || 0) }} / {{ formatNumber(gamificationData?.maxPoints || 0) }} Pts</span>
          </div>
          <div class="w-full h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              class="bg-gradient-to-r from-yellow-400 to-yellow-300 h-full rounded-full transition-all duration-700 ease-out relative"
              :style="{ width: (gamificationData?.progressPercentage || 0) + '%' }"
            >
              <div class="absolute inset-0 bg-white/30 w-full animate-[shimmer_2s_infinite] skew-x-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-5">
      <h3 class="text-[14px] font-bold text-gray-900 mb-3">Keuntungan {{ gamificationData?.membership || 'Member' }}</h3>
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
          <div class="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-[#F58220]">
            <i class="fa-solid fa-ticket"></i>
          </div>
          <span class="text-[9px] font-bold text-gray-700 leading-tight">Voucher Diskon Trip</span>
        </div>
        <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
          <div class="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#145C34]">
            <i class="fa-solid fa-fire"></i>
          </div>
          <span class="text-[9px] font-bold text-gray-700 leading-tight">Prioritas Kuota Booking</span>
        </div>
        <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
          <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <i class="fa-solid fa-headset"></i>
          </div>
          <span class="text-[9px] font-bold text-gray-700 leading-tight">Layanan CS Prioritas</span>
        </div>
      </div>
    </div>

    <div class="w-full h-2 bg-gray-100 my-1"></div>

    <div class="px-5 flex flex-col gap-3">
      <div class="flex justify-between items-center mb-1">
        <h3 class="text-[14px] font-bold text-gray-900">Riwayat Poin</h3>
        <span class="text-[11px] text-gray-500 font-medium">Terbaru</span>
      </div>

      <div v-if="pointsHistory.length === 0" class="bg-white border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center">
        <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
          <i class="fa-solid fa-receipt text-xl"></i>
        </div>
        <h4 class="text-xs font-bold text-gray-800">Belum Ada Riwayat Poin</h4>
        <p class="text-[10px] text-gray-500 mt-1">Selesaikan pesanan trip pertama Anda untuk mulai mengumpulkan poin.</p>
      </div>

      <div 
        v-else
        v-for="item in pointsHistory" 
        :key="item.id"
        class="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100"
      >
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
          :class="item.type === 'earn' ? 'bg-[#E8F5E9] border-green-100 text-[#145C34]' : 'bg-red-50 border-red-100 text-red-600'"
        >
          <i class="fa-solid" :class="item.type === 'earn' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'"></i>
        </div>

        <div class="flex-1">
          <h4 class="text-[12px] font-bold text-gray-800 leading-tight line-clamp-2 mb-1">
            {{ item.description }}
          </h4>
          <div class="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
            <span><i class="fa-regular fa-calendar mr-1"></i> {{ formatDate(item.created_at) }}</span>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{{ item.reference_id }}</span>
          </div>
        </div>

        <div class="shrink-0 text-right">
          <p 
            class="text-[14px] font-black"
            :class="item.type === 'earn' ? 'text-[#145C34]' : 'text-red-600'"
          >
            {{ item.type === 'earn' ? '+' : '-' }}{{ formatNumber(item.amount) }}
          </p>
          <p class="text-[9px] text-gray-400 font-medium mt-0.5">Poin</p>
        </div>
      </div>

      <div ref="scrollTrigger" class="h-10 flex items-center justify-center mt-2">
        <div v-if="isLoadingMore" class="flex items-center gap-2 text-gray-400 text-xs font-medium">
          <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat data lama...
        </div>
        <div v-else-if="pointsHistory.length > 0 && !hasMore" class="text-gray-400 text-[10px] font-medium">
          — Semua riwayat telah ditampilkan —
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import { useRuntimeConfig, useCookie, useFetch } from '#imports'
import authCustomer from '~/middleware/auth-customer'

definePageMeta({
  middleware: authCustomer
})

const config = useRuntimeConfig()
const authCookie = useCookie('access_token')

if (!authCookie.value) {
  throw new Error("Token otorisasi tidak ditemukan. Harap login kembali.")
}

// --- STATE MANAGER ---
const isInitialLoading = ref(true)

// State Gamifikasi (Diambil dari Profile Endpoint)
const gamificationData = ref(null)

// State Riwayat Poin (Infinite Scroll)
const pointsHistory = ref([])
const page = ref(1)
const limit = 10
const totalPages = ref(1)
const hasMore = ref(true)
const isLoadingMore = ref(false)

// Ref untuk Intersection Observer
const scrollTrigger = ref(null)
let observer = null

// --- INIT MOUNTED ---
onMounted(async () => {
  // 1. Fetch Profile Data (Untuk mengambil status poin & level saat ini)
  await fetchProfileData()
  
  // 2. Fetch Riwayat Poin Halaman 1
  await fetchPointsHistory(false)
  
  isInitialLoading.value = false

  // 3. Setup Intersection Observer untuk Infinite Scroll
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isInitialLoading.value && !isLoadingMore.value && hasMore.value) {
      fetchPointsHistory(true)
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

// --- API CALLS ---

// Fetch data Gamifikasi dari Endpoint Profile utama
const fetchProfileData = async () => {
  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/profile/me`, {
      headers: {
        'Authorization': `Bearer ${authCookie.value}`,
        'Accept': 'application/json'
      }
    })
    gamificationData.value = response.data?.gamification || null
  } catch (err) {
    console.error('Gagal mengambil data profil gamifikasi:', err)
  }
}

// Fetch Riwayat Poin dengan Pagination
const fetchPointsHistory = async (isLoadMore = false) => {
  if (isLoadMore) {
    isLoadingMore.value = true
    page.value += 1
  } else {
    page.value = 1
    pointsHistory.value = []
    hasMore.value = true
  }

  try {
    const query = new URLSearchParams({
      page: page.value,
      limit: limit
    }).toString()

    const response = await $fetch(`${config.public.apiBaseUrl}/profile/points?${query}`, {
      headers: {
        'Authorization': `Bearer ${authCookie.value}`,
        'Accept': 'application/json'
      }
    })

    const newItems = response.data || []
    totalPages.value = response.meta?.total_pages || 1

    if (page.value >= totalPages.value) {
      hasMore.value = false
    }

    if (isLoadMore) {
      pointsHistory.value = [...pointsHistory.value, ...newItems]
    } else {
      pointsHistory.value = newItems
    }
  } catch (err) {
    console.error('Gagal mengambil riwayat poin:', err)
  } finally {
    isLoadingMore.value = false
  }
}

// --- UTILITIES ---
const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}
</script>

<style scoped>
/* Keyframe untuk efek kilap/shimmer di progress bar */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
</style>