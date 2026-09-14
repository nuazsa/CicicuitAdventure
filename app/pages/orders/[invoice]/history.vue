<template>
  <MobileHeaderDefault title="Riwayat Pesanan" backTo="/orders" hideSearch />

  <div v-if="error || sortedHistoryData.length === 0" class="flex flex-col items-center justify-center min-h-[70vh] px-5 text-center">
    <i class="fa-solid fa-clock-rotate-left text-4xl text-gray-400 mb-3"></i>
    <h2 class="text-sm font-bold text-gray-800 mb-1">Belum Ada Riwayat</h2>
    <p class="text-xs text-gray-500">Riwayat status pesanan tidak ditemukan atau terjadi kesalahan server.</p>
  </div>

  <div v-else class="mx-5 mt-5 bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative z-10">
    
    <div class="relative w-full h-32">
      <NuxtImg 
        :src="orderDetail.heroImage" 
        alt="Trip Image" 
        class="w-full h-full object-cover"
        format="webp"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
      
      <div class="absolute bottom-4 left-5 right-5">
        <div 
          class="inline-block text-white text-[10px] font-bold px-3 py-1 rounded-full mb-1.5 shadow-sm uppercase tracking-wider"
          :class="currentStatusStyle.bgClass"
        >
          {{ currentStatusStyle.label }}
        </div>
        <h2 class="text-lg font-extrabold text-[#145C34] drop-shadow-sm line-clamp-1">{{ orderDetail.tripTitle }}</h2>
      </div>
    </div>

    <div class="px-5 pt-4 pb-4 flex flex-col gap-3">
      <div>
        <p class="text-[10px] text-gray-500 font-medium mb-0.5">ID Pesanan</p>
        <p class="text-[14px] font-extrabold text-[#92400E]">{{ invoiceNumber }}</p>
      </div>
      
      <div>
        <p class="text-[10px] text-gray-500 font-medium mb-0.5">Pilihan Paket</p>
        <p class="text-[13px] font-bold text-[#145C34]">
          {{ orderDetail.titleOfPackage }}
        </p>
      </div>
    </div>

    <div class="relative flex items-center justify-center h-6 w-full">
      <div class="absolute -left-3 w-6 h-6 bg-[#F4F6F5] rounded-full shadow-inner z-10"></div>
      <div class="w-full border-t-[1.5px] border-dashed border-gray-200 mx-3"></div>
      <div class="absolute -right-3 w-6 h-6 bg-[#F4F6F5] rounded-full shadow-inner z-10"></div>
    </div>

    <div class="px-5 pt-5 pb-8">
      <h3 class="text-[12px] font-bold text-gray-400 mb-5 uppercase tracking-wider">Jejak Status</h3>
      
      <div class="relative ml-2">
        <div class="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gray-100 rounded-full"></div>

        <div class="flex flex-col gap-6">
          <div 
            v-for="(item, index) in sortedHistoryData" 
            :key="index"
            class="relative flex gap-4 items-start"
          >
            <div class="relative z-10 shrink-0 mt-0.5">
              <div v-if="index === 0" class="w-4 h-4 rounded-full flex items-center justify-center shadow-sm" :class="getTimelineIconStyle(item.status).bgPrimary">
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
              <div v-else class="w-4 h-4 rounded-full flex items-center justify-center bg-gray-200 border-2 border-white shadow-sm">
                <i class="fa-solid fa-check text-[8px] text-gray-400"></i>
              </div>
            </div>

            <div class="flex-1 pb-1">
              <div class="flex justify-between items-start mb-1">
                <h4 class="text-[13px] font-bold leading-tight" :class="index === 0 ? 'text-gray-900' : 'text-gray-600'">
                  {{ item.title }}
                </h4>
                <ClientOnly>
                  <span class="text-[10px] text-gray-400 font-medium shrink-0 ml-2 mt-0.5">
                    {{ formatTime(item.timestamp) }}
                  </span>
                  <template #fallback>
                    <span class="w-8 h-3 bg-gray-100 animate-pulse rounded mt-0.5"></span>
                  </template>
                </ClientOnly>
              </div>
              <p class="text-[11px] text-gray-500 leading-relaxed">
                {{ item.description }}
                
                <!-- Perbaikan link review: gunakan item.status dan invoiceNumber -->
                <NuxtLink 
                  v-if="item.status?.toUpperCase() === 'COMPLETED'" 
                  :to="`/orders/${invoiceNumber}/review`"
                  class="text-[#F58220] font-bold hover:underline ml-1 inline-block"
                >
                  (berikan review perjalanan anda)
                </NuxtLink>
              </p>

              <ClientOnly>
                <p class="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                  <i class="fa-regular fa-calendar"></i> {{ formatDate(item.timestamp) }}
                </p>
                <template #fallback>
                  <p class="w-20 h-3 bg-gray-100 animate-pulse rounded mt-1.5"></p>
                </template>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch, useRuntimeConfig, useCookie } from '#imports'
import authCustomer from '~/middleware/auth-customer' 

definePageMeta({ 
  middleware: authCustomer 
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const invoiceNumber = route.params.invoice

const authCookie = useCookie('access_token')

// --- API Fetch ---
const { data: rawHistory, pending, error } = await useFetch(`${config.public.apiBaseUrl}/orders/client/${invoiceNumber}/history`, {
  headers: {
    'Authorization': `Bearer ${authCookie.value}`,
    'Accept': 'application/json'
  }
})

// --- Computed Properties ---
const historyData = computed(() => rawHistory.value?.data || [])

// Ambil Hero Image & Title secara dinamis dari item pertama yang dikirim API
const orderDetail = computed(() => {
  if (historyData.value.length === 0) {
    return { tripTitle: 'Pesanan Saya', heroImage: '' }
  }
  // Ambil dari riwayat pertama (karena datanya konsisten)
  const item = historyData.value[0]
  return {
    tripTitle: item.titleOfService || 'Pesanan Saya',
    titleOfPackage: item.titleOfPackage || 'Paket Saya',
    heroImage: item.heroImage || 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
  }
})

const sortedHistoryData = computed(() => {
  return [...historyData.value].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

// Ambil status terbaru untuk warna badge di atas gambar
const currentStatusStyle = computed(() => {
  if (sortedHistoryData.value.length === 0) return { label: '-', bgClass: 'bg-gray-500' }
  
  const latestStatus = sortedHistoryData.value[0].status.toUpperCase()
  switch (latestStatus) {
    case 'PENDING':
    case 'CREATED':
      return { label: 'Menunggu Pembayaran', bgClass: 'bg-[#F58220]' }
    case 'PAID':
    case 'CONFIRMED':
    case 'SUCCESS':
      return { label: 'Terkonfirmasi', bgClass: 'bg-[#145C34]' }
    case 'COMPLETED':
      return { label: 'Selesai', bgClass: 'bg-blue-600' }
    case 'CANCELED':
    case 'EXPIRED':
    case 'FAILED':
      return { label: 'Dibatalkan', bgClass: 'bg-red-500' }
    default:
      return { label: latestStatus, bgClass: 'bg-gray-500' }
  }
})

// --- Utilities ---
const getTimelineIconStyle = (status) => {
  const normalizedStatus = (status || '').toUpperCase()
  switch (normalizedStatus) {
    case 'COMPLETED': 
      return { bgPrimary: 'bg-blue-600' } // Biru
    case 'PAID':
    case 'CONFIRMED':
    case 'SUCCESS':
      return { bgPrimary: 'bg-[#145C34]' } // Hijau
    case 'PENDING':
    case 'CREATED':
      return { bgPrimary: 'bg-[#F58220]' } // Orange
    case 'CANCELED':
    case 'EXPIRED':
      return { bgPrimary: 'bg-red-500' } // Merah
    default:
      return { bgPrimary: 'bg-gray-400' }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>