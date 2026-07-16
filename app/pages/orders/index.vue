<template>
  <MobileHeaderDefault title="Pesanan Saya" hideSearch />

  <div class="sticky top-[64px] z-30 bg-white flex border-b border-gray-200 shadow-sm">
    <button 
      v-for="tab in tabs" 
      :key="tab.id"
      @click="changeTab(tab)"
      class="flex-1 py-3.5 text-[13px] font-bold transition-all border-b-2"
      :class="activeTab.id === tab.id ? 'text-[#145C34] border-[#145C34]' : 'text-gray-400 border-transparent hover:text-gray-600'"
    >
      {{ tab.label }}
    </button>
  </div>

  <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
    <i class="fa-solid fa-circle-notch fa-spin text-3xl text-[#145C34] mb-3"></i>
    <p class="text-xs font-medium text-gray-500">Memuat pesanan...</p>
  </div>

  <div v-else class="p-5 flex flex-col gap-4">
    
    <div v-if="mappedOrders.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <i class="fa-solid fa-box-open text-2xl text-gray-400"></i>
      </div>
      <h3 class="text-sm font-bold text-gray-800">Belum Ada Pesanan</h3>
      <p class="text-xs text-gray-500 mt-1 max-w-[200px]">
        Anda tidak memiliki pesanan di daftar "{{ activeTab.label }}" saat ini.
      </p>
      <button v-if="activeTab.id === 'pending'" @click="router.push('/open-trip')" class="mt-4 text-[#145C34] text-xs font-bold hover:underline">
        Cari Petualangan
      </button>
    </div>

    <div 
      v-for="order in mappedOrders" 
      :key="order.invoiceNumber" 
      class="bg-white rounded-2xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100"
    >
      <div class="flex gap-4 cursor-pointer" @click="handleAction(order)">
        <NuxtImg 
          :src="order.image" 
          :alt="order.title" 
          class="w-20 h-20 rounded-xl object-cover border border-gray-50" 
          format="webp"
          loading="lazy"
        />
        
        <div class="flex flex-col justify-center flex-1">
          <h3 class="font-bold text-gray-800 text-[13px] leading-tight line-clamp-2">{{ order.title }}</h3>
          <p class="text-[11px] text-gray-500 flex items-center gap-1.5 mt-1 font-medium">
            <i class="fa-regular fa-calendar"></i> {{ order.date }}
          </p>
          
          <div 
            class="text-[9px] font-bold px-2 py-1 rounded w-max mt-2 flex items-center gap-1"
            :class="getStatusStyle(order.rawStatus).bgClass"
          >
            <i :class="getStatusStyle(order.rawStatus).icon"></i> 
            {{ getStatusStyle(order.rawStatus).text }}
          </div>
        </div>
      </div>

      <div class="border-t border-gray-100 border-dashed my-3.5"></div>

      <div class="flex justify-between items-end mb-4">
        <div>
          <p class="text-[10px] text-gray-500 font-medium">Total Bayar</p>
          <p class="text-[15px] font-extrabold text-[#145C34] leading-none mt-1">{{ formatRupiah(order.total) }}</p>
        </div>
        
        <div v-if="order.rawStatus === 'PENDING'" class="text-right">
          <p class="text-[10px] text-[#D32F2F] font-medium">Bayar Sebelum</p>
          <ClientOnly>
            <p class="text-[12px] font-bold text-[#D32F2F] leading-none mt-1 font-mono tracking-wide">
              {{ formatCountdown(order.expiredAt) }}
            </p>
            <template #fallback>
              <p class="text-[12px] font-bold text-[#D32F2F] leading-none mt-1 font-mono tracking-wide">--:--:--</p>
            </template>
          </ClientOnly>
        </div>
        <div v-else class="text-right">
          <p class="text-[10px] text-gray-400 font-medium">No. Pesanan</p>
          <p class="text-[11px] font-bold text-gray-600 leading-none mt-1">{{ order.invoiceNumber }}</p>
        </div>
      </div>

      <button 
        @click="handleAction(order)"
        class="w-full py-2.5 rounded-xl text-[13px] font-bold transition shadow-sm flex items-center justify-center gap-2"
        :class="order.rawStatus === 'PENDING' ? 'bg-[#F58220] hover:bg-[#E65100] text-white' : 'bg-[#145C34] hover:bg-green-800 text-white'"
      >
        <span v-if="order.rawStatus === 'PENDING'">
          <i class="fa-solid fa-wallet"></i> Bayar Sekarang
        </span>
        
        <span v-else-if="['CONFIRMED', 'PAID', 'SUCCESS'].includes(order.rawStatus) && activeTab.id === 'paid'">
          <i class="fa-solid fa-ticket"></i> Lihat E-Tiket
        </span>
        
        <span v-else>
          <i class="fa-solid fa-clock-rotate-left"></i> Lihat Riwayat
        </span>
      </button>
    </div>
    
    <div ref="scrollTrigger" class="h-10 flex items-center justify-center mt-2">
      <div v-if="isLoadingMore" class="flex items-center gap-2 text-gray-400 text-xs font-medium">
        <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat data lama...
      </div>
      <div v-else-if="mappedOrders.length > 0 && !activeTabData.hasMore" class="text-gray-400 text-xs font-medium">
        — Semua pesanan telah ditampilkan —
      </div>
    </div>

  </div>

  <div v-if="activeTab.id !== 'all'" class="mx-5 mb-8 bg-[#E8F5E9] border border-dashed border-[#A5D6A7] rounded-2xl p-4 flex items-start gap-3 text-left">
    <i class="fa-solid fa-circle-info text-[#2E7D32] mt-0.5"></i>
    <p class="text-[11px] text-[#1B5E20] font-medium leading-relaxed">
      Ingin melihat petualangan yang sudah selesai atau dibatalkan? Cek tab <span class="font-bold">Riwayat</span>.
    </p>
  </div>
  
  <MobileNavigationBottom />  
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig, useCookie } from '#imports'
import authCustomer from '~/middleware/auth-customer'

definePageMeta({
  middleware: authCustomer
})

const router = useRouter()
const config = useRuntimeConfig()
const authCookie = useCookie('access_token')

if (!authCookie.value) {
  throw new Error("Token otorisasi tidak ditemukan. Harap login kembali.")
}

// --- Konfigurasi Tab ---
const tabs = [
  { id: 'pending', label: 'Belum Bayar' },
  { id: 'paid', label: 'Aktif' },
  { id: 'all', label: 'Riwayat' }
]
const activeTab = ref(tabs[0])

// --- CACHE STATE (Data Independen Tiap Tab) ---
const tabState = ref({
  pending: { items: [], page: 1, totalPages: 1, hasMore: true, isLoaded: false },
  paid:    { items: [], page: 1, totalPages: 1, hasMore: true, isLoaded: false },
  all:     { items: [], page: 1, totalPages: 1, hasMore: true, isLoaded: false }
})

const limit = 10
const isLoading = ref(true) 
const isLoadingMore = ref(false)

// Alias state aktif untuk dipanggil di template
const activeTabData = computed(() => tabState.value[activeTab.value.id])

// --- Ref untuk Observer Infinite Scroll ---
const scrollTrigger = ref(null)
let observer = null

// --- Logika Countdown ---
const currentTime = ref(new Date().getTime())
let timerInterval = null

onMounted(() => {
  timerInterval = setInterval(() => {
    currentTime.value = new Date().getTime()
  }, 1000)
  fetchOrders()

  // Setup Intersection Observer untuk Infinite Scroll
  observer = new IntersectionObserver((entries) => {
    // Jika scroll mentok, sedang tidak loading, dan tab ini masih punya sisa halaman
    if (entries[0].isIntersecting && !isLoading.value && !isLoadingMore.value && activeTabData.value.hasMore) {
      fetchOrders(true)
    }
  }, { threshold: 0.5 }) 
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (observer) observer.disconnect()
})

watchEffect(() => {
  if (scrollTrigger.value && observer) {
    observer.observe(scrollTrigger.value)
  }
})

// --- Fungsi Fetching & Caching (API Call) ---
const fetchOrders = async (isLoadMore = false) => {
  const currentTabId = activeTab.value.id
  const state = tabState.value[currentTabId]

  if (isLoadMore) {
    isLoadingMore.value = true
    state.page += 1
  } else {
    // CEK CACHE
    if (state.isLoaded) {
      isLoading.value = false
      return
    }
    
    isLoading.value = true
    state.page = 1
  }

  try {
    const query = new URLSearchParams({
      status: currentTabId,
      page: state.page,
      limit: limit
    }).toString()

    const response = await $fetch(`${config.public.apiBaseUrl}/orders/client?${query}`, {
      headers: {
        'Authorization': `Bearer ${authCookie.value}`,
        'Accept': 'application/json'
      }
    })

    const newOrders = response.data || []
    state.totalPages = response.meta?.total_pages || 1

    if (state.page >= state.totalPages) {
      state.hasMore = false 
    }

    if (isLoadMore) {
      // Gabungkan data lama dengan data baru (Push)
      state.items = [...state.items, ...newOrders]
    } else {
      // Timpa data awal dan tandai tab sebagai SUDAH TERMUAT
      state.items = newOrders
      state.isLoaded = true 
    }

  } catch (err) {
    console.error(`Gagal mengambil pesanan tab ${currentTabId}:`, err)
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

// --- Handler Pindah Tab ---
const changeTab = (tab) => {
  if (activeTab.value.id === tab.id) return
  activeTab.value = tab
  // Begitu pindah tab, jalankan fungsi fetch
  // (Fungsi fetch akan otomatis stop jika state.isLoaded bernilai true)
  fetchOrders(false) 
}

// --- Mapping Data Khusus untuk Tab Aktif (Hanya keperluan UI) ---
const mappedOrders = computed(() => {
  let items = activeTabData.value.items

  if (activeTab.value.id === 'all') {
    items = items.filter(item => {
      const status = (item.status || '').toUpperCase()
      return status !== 'PENDING'
    })
  }

  return items.map(item => {
    const rawStatus = (item.status || 'UNKNOWN').toUpperCase()
    
    return {
      invoiceNumber: item.invoiceNumber,
      title: item.titleOfTrip || 'Trip Tanpa Nama',
      date: item.dateRange || '-',
      rawStatus: rawStatus,
      total: item.grossAmount,
      image: item.heroImage,
      expiredAt: item.expiredAt
    }
  })
})

// --- Fitur Format & UI ---
const formatCountdown = (expiredAt) => {
  if (!expiredAt) return 'Segera'
  const expTime = new Date(expiredAt).getTime()
  const diff = expTime - currentTime.value

  if (diff <= 0) return '00:00:00'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  const pad = (num) => String(num).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

const handleAction = (order) => {
  if (order.rawStatus === 'PENDING') {
    router.push(`/orders/${order.invoiceNumber}`)
  } else if (['CONFIRMED', 'PAID', 'SUCCESS'].includes(order.rawStatus) && activeTab.value.id === 'paid') {
    router.push(`/orders/${order.invoiceNumber}/ticket`)
  } else {
    router.push(`/orders/${order.invoiceNumber}/history`)
  }
}

const getStatusStyle = (status) => {
  // Memastikan status selalu dibaca dalam huruf kapital
  const safeStatus = (status || '').toUpperCase();

  switch (safeStatus) {
    case 'PENDING':
      return { 
        text: 'MENUNGGU PEMBAYARAN', 
        bgClass: 'bg-[#FFF3E0] text-[#E65100]', // Oranye - Perhatian
        icon: 'fa-regular fa-clock' 
      }
    case 'PAID':
      return { 
        text: 'SUDAH LUNAS', 
        bgClass: 'bg-[#E8F5E9] text-[#2E7D32]', // Hijau - Sukses/Aman
        icon: 'fa-solid fa-check-to-slot' 
      }
    case 'CONFIRMED':
      return { 
        text: 'SUDAH CHECK-IN', 
        bgClass: 'bg-blue-50 text-blue-600', // Biru - Status operasional/Sedang berlangsung
        icon: 'fa-solid fa-user-check' 
      }
    case 'COMPLETED':
      return { 
        text: 'SELESAI', 
        bgClass: 'bg-gray-100 text-gray-600', // Abu-abu gelap - Menandakan siklus telah selesai sepenuhnya
        icon: 'fa-solid fa-flag-checkered' 
      }
    case 'EXPIRED':
    case 'CANCELED':
    case 'FAILED': // Opsional, jaga-jaga jika ada payment failed
      return { 
        text: 'DIBATALKAN', 
        bgClass: 'bg-red-50 text-red-600', // Merah - Berhenti/Gagal
        icon: 'fa-solid fa-circle-xmark' 
      }
    default:
      return { 
        text: safeStatus || 'TIDAK DIKETAHUI', 
        bgClass: 'bg-gray-50 text-gray-400', 
        icon: 'fa-solid fa-circle-info' 
      }
  }
}

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0)
}
</script>