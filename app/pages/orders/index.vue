<template>
  <MobileHeaderDefault title="Pesanan Saya" hideSearch />

  <div class="sticky top-[64px] z-30 bg-white flex border-b border-gray-200 shadow-sm">
    <button 
      v-for="tab in tabs" 
      :key="tab"
      @click="activeTab = tab"
      class="flex-1 py-3.5 text-[13px] font-bold transition-all border-b-2"
      :class="activeTab === tab ? 'text-[#145C34] border-[#145C34]' : 'text-gray-400 border-transparent hover:text-gray-600'"
    >
      {{ tab }}
    </button>
  </div>

  <div class="p-5 flex flex-col gap-4">
    <!-- Jika tidak ada pesanan di tab aktif, tampilkan pesan kosong -->
    <div v-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <i class="fa-solid fa-box-open text-2xl text-gray-400"></i>
      </div>
      <h3 class="text-sm font-bold text-gray-800">Belum Ada Pesanan</h3>
      <p class="text-xs text-gray-500 mt-1 max-w-[200px]">
        Anda tidak memiliki pesanan di daftar "{{ activeTab }}" saat ini.
      </p>
      <button v-if="activeTab === 'Belum Bayar'" @click="router.push('/opentrip')" class="mt-4 text-[#145C34] text-xs font-bold hover:underline">
        Cari Petualangan
      </button>
    </div>

    <!-- Daftar Pesanan -->
    <div 
      v-for="order in filteredOrders" 
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
          <p class="text-[12px] font-bold text-[#D32F2F] leading-none mt-1 font-mono tracking-wide">
            {{ order.countdown || 'Segera' }}
          </p>
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
        <span v-else-if="['CONFIRMED', 'PAID', 'SUCCESS'].includes(order.rawStatus)">
          <i class="fa-solid fa-ticket"></i> Lihat E-Tiket
        </span>
        <span v-else>
          Lihat Detail
        </span>
      </button>
    </div>
  </div>

  <!-- Pesan Kosong -->
  <div v-if="activeTab !== 'Riwayat'" class="mx-5 mb-8 bg-[#E8F5E9] border border-dashed border-[#A5D6A7] rounded-2xl p-4 flex items-start gap-3 text-left">
    <i class="fa-solid fa-circle-info text-[#2E7D32] mt-0.5"></i>
    <p class="text-[11px] text-[#1B5E20] font-medium leading-relaxed">
      Ingin melihat petualangan yang sudah selesai atau dibatalkan? Cek tab <span class="font-bold">Riwayat</span>.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch, useRuntimeConfig, useCookie } from '#imports'
import authCustomer from '~/middleware/auth-customer'

definePageMeta({
  middleware: authCustomer
})

const router = useRouter()

// --- State Tabs ---
const tabs = ['Belum Bayar', 'Aktif', 'Riwayat']
const activeTab = ref('Belum Bayar')

// --- Fetch Data Pesanan dari API ---
// Endpoint asumsikan: GET /orders (Menampilkan list order milik user login)
// const { data: rawOrdersData, pending, error } = await useFetch(`${config.public.apiBase}/orders`, {
//   headers: {
//     'Authorization': `Bearer ${authCookie.value}`,
//     'Accept': 'application/json'
//   }
// })

const rawOrdersData = ref({
  "statusCode": 200,
  "message": "Berhasil mengambil daftar pesanan",
  "data": [
    {
      "invoiceNumber": "INV-20260704-0001",
      "tripTitle": "Open Trip Gunung Gede Pangrango (2H1M)",
      "startDate": "2026-08-14T00:00:00.000Z",
      "endDate": "2026-08-15T00:00:00.000Z",
      "status": "PENDING",
      "grossAmount": 455000,
      "heroImage": "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
      "expiredAt": "2026-07-05T12:00:00.000Z"
    },
    {
      "invoiceNumber": "INV-20260615-0042",
      "package": {
        "titleOfTrip": "Private Trip Gunung Rinjani (4H3M)"
      },
      "startDate": "2026-09-10T00:00:00.000Z",
      "endDate": "2026-09-13T00:00:00.000Z",
      "status": "PAID",
      "grossAmount": 2750000,
      "heroImage": "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
      "expiredAt": null
    },
    {
      "invoiceNumber": "INV-20251210-0921",
      "tripTitle": "Open Trip Gunung Prau (3H2M)",
      "startDate": "2025-12-24T00:00:00.000Z",
      "endDate": "2025-12-26T00:00:00.000Z",
      "status": "COMPLETED",
      "grossAmount": 850000,
      "heroImage": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "expiredAt": null
    },
    {
      "invoiceNumber": "INV-20260105-0112",
      "tripTitle": "Sewa Porter Semeru (Maks 20kg)",
      "startDate": "2026-02-10T00:00:00.000Z",
      "endDate": "2026-02-12T00:00:00.000Z",
      "status": "CANCELED",
      "grossAmount": 450000,
      "heroImage": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "expiredAt": null
    }
  ]
})

// --- Mapping & Filter Data ---
const mappedOrders = computed(() => {
  // Jika struktur dari backend menggunakan `data.value.data`
  const ordersList = rawOrdersData.value?.data || rawOrdersData.value || []
  
  if (!Array.isArray(ordersList)) return []

  return ordersList.map(order => {
    // 1. Tentukan Pesanan masuk ke tab mana berdasarkan Status
    let targetTab = 'Riwayat' 
    const status = order.status?.toUpperCase() || ''

    if (status === 'PENDING') {
      targetTab = 'Belum Bayar'
    } else if (['PAID', 'SUCCESS', 'CONFIRMED'].includes(status)) {
      // Jika tanggal sudah lewat, Anda bisa menambahkan logika di backend untuk mengubahnya jadi COMPLETED
      // Sementara kita asumsikan semua tiket lunas yang belum expired masuk ke Aktif
      targetTab = 'Aktif'
    } else if (['CANCELED', 'FAILED', 'EXPIRED', 'COMPLETED'].includes(status)) {
      targetTab = 'Riwayat'
    }

    return {
      invoiceNumber: order.invoiceNumber || order.id,
      title: order.tripTitle || order.package?.titleOfTrip || 'Gunung Gede Pangrango',
      date: formatDateRange(order.startDate, order.endDate),
      rawStatus: status,
      total: order.grossAmount || order.totalPrice || 0,
      image: order.heroImage || 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
      tab: targetTab,
      // Jika backend mengirim batas waktu (expiredAt), kita bisa memformatnya. 
      // Untuk sementara kita biarkan 'Segera' jika tidak dikirim.
      countdown: order.expiredAt ? calculateTimeLeft(order.expiredAt) : 'Segera' 
    }
  })
})

const filteredOrders = computed(() => {
  return mappedOrders.value.filter(order => order.tab === activeTab.value)
})

// --- Navigasi Aksi Tombol ---
const handleAction = (order) => {
  if (order.rawStatus === 'PENDING') {
    // Mengarah ke halaman detail invoice untuk bayar ulang
    router.push(`/orders/${order.invoiceNumber}`)
  } else if (['CONFIRMED', 'PAID', 'SUCCESS'].includes(order.rawStatus)) {
    // Mengarah langsung ke e-tiket
    router.push(`/orders/${order.invoiceNumber}/ticket`)
  } else {
    // Riwayat, mungkin arahkan ke detail riwayat biasa
    router.push(`/orders/${order.invoiceNumber}/history`)
  }
}

// --- Utilities Desain Status ---
const getStatusStyle = (status) => {
  switch (status) {
    case 'PENDING':
      return { 
        text: 'MENUNGGU PEMBAYARAN', 
        bgClass: 'bg-[#FFF3E0] text-[#E65100]', 
        icon: 'fa-solid fa-circle-exclamation' 
      }
    case 'PAID':
    case 'SUCCESS':
    case 'CONFIRMED':
      return { 
        text: 'SUDAH LUNAS', 
        bgClass: 'bg-[#E8F5E9] text-[#2E7D32]', 
        icon: 'fa-solid fa-circle-check' 
      }
    case 'EXPIRED':
    case 'CANCELED':
    case 'FAILED':
      return { 
        text: 'DIBATALKAN', 
        bgClass: 'bg-red-50 text-red-600', 
        icon: 'fa-solid fa-circle-xmark' 
      }
    case 'COMPLETED':
      return { 
        text: 'SELESAI', 
        bgClass: 'bg-gray-100 text-gray-600', 
        icon: 'fa-solid fa-flag-checkered' 
      }
    default:
      return { 
        text: status, 
        bgClass: 'bg-gray-100 text-gray-500', 
        icon: 'fa-solid fa-info-circle' 
      }
  }
}

// --- Utilities Format ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number || 0)
}

const formatDateRange = (start, end) => {
  if (!start || !end) return '-'
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const startMonth = months[startDate.getMonth()]
  const endMonth = months[endDate.getMonth()]
  const year = startDate.getFullYear()
  
  if (startMonth === endMonth) {
    return `${startDay}-${endDay} ${startMonth} ${year}`
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`
  }
}

// Placeholder fungsi hitung mundur (Jika backend mereturn expiredAt)
const calculateTimeLeft = (expiredDateStr) => {
  // Anda bisa menggunakan moment.js / date-fns atau membiarkan string statis
  // Implementasi sesungguhnya membutuhkan setInterval agar real-time di UI
  return '23:59:59' 
}
</script>

<style scoped>
/* Transisi mulus antar klik tab */
.flex-1 {
  -webkit-tap-highlight-color: transparent;
}
</style>