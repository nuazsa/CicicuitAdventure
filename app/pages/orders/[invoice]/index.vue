<template>
  <MobileHeaderDefault title="Detail Pembayaran" backTo="/orders" hideSearch />

  <div v-if="error || !orderData" class="flex flex-col items-center justify-center min-h-[70vh] px-5 text-center">
    <i class="fa-solid fa-file-circle-xmark text-4xl text-gray-400 mb-3"></i>
    <h2 class="text-sm font-bold text-gray-800 mb-1">Pesanan Tidak Ditemukan</h2>
    <p class="text-xs text-gray-500">Pastikan nomor invoice yang Anda tuju sudah benar.</p>
    <button @click="router.back()" class="mt-4 px-5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
      Kembali ke Beranda
    </button>
  </div>

  <div v-else class="flex flex-col p-5 gap-2 mt-2">
    
    <div class="bg-white px-5 py-8 flex flex-col items-center justify-center text-center shadow-sm rounded-xl">
      <div 
        class="w-16 h-16 rounded-full flex items-center justify-center mb-3 border transition-colors duration-300"
        :class="orderData.status === 'PENDING' 
          ? 'bg-orange-50 border-orange-100' 
          : 'bg-green-50 border-green-100'"
      >
        <i 
          class="fa-solid text-3xl transition-colors duration-300"
          :class="orderData.status === 'PENDING' 
            ? 'fa-clock text-[#F58220]' 
            : 'fa-circle-check text-[#145C34]'"
        ></i>
      </div>
      <h2 class="text-lg font-extrabold" :class="orderData.status === 'PENDING' ? 'text-gray-900' : 'text-[#145C34]'">
        {{ orderData.status === 'PENDING' ? 'Menunggu Pembayaran' : 'Pembayaran Berhasil' }}
      </h2>
      <p v-if="orderData.status === 'PENDING'" class="text-[12px] text-gray-500 mt-1 max-w-[250px] mx-auto leading-relaxed">
        Selesaikan pembayaran Anda agar kursi perjalanan segera diamankan.
      </p>
      <p v-else class="text-[12px] text-gray-500 mt-1">
        Terima kasih telah bergabung dengan Cicicuit Adventure!
      </p>
      <div 
        class="mt-5 text-[28px] font-black tracking-tight transition-colors duration-300"
        :class="orderData.status === 'PENDING' ? 'text-[#F58220]' : 'text-[#145C34]'"
      >
        {{ formatRupiah(orderData.grossAmount) }}
      </div>
      <div class="mt-1 flex items-center gap-1.5 justify-center bg-gray-50 px-3 py-1 rounded-full border border-gray-100 ">
        <span class="text-[10px] text-gray-400">ID Pesanan:</span>
        <span class="text-[11px] font-bold text-gray-700">{{ invoiceNumber }}</span>
        <button @click="copyToClipboard(invoiceNumber)" class="text-gray-400 hover:text-[#145C34] transition">
          <i class="fa-regular fa-copy text-[10px]"></i>
        </button>
      </div>
    </div>

    <div class="bg-white px-5 py-5 shadow-sm rounded-xl">
      <h3 class="text-[13px] font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Rincian Pesanan</h3>
      
      <div class="flex flex-col gap-3.5">
        <div class="flex justify-between items-start">
          <span class="flex-1 text-[12px] text-gray-500">Nama Layanan</span>
          <span class="flex-2 text-[12px] font-semibold text-gray-800 text-right max-w-[180px] line-clamp-2">
            {{ orderData.titleOfTrip }}
          </span>
        </div>
        
        <div class="flex justify-between items-start">
          <span class="flex-1 text-[12px] text-gray-500">Pilihan Paket</span>
          <span class="flex-2 text-[12px] font-semibold text-gray-800 text-right max-w-[180px] line-clamp-2">
            {{ orderData.titleOfPackage }}
          </span>
        </div>

        <div class="flex justify-between items-start">
          <span class="text-[12px] text-gray-500">Jenis Layanan</span>
          <span class="text-[12px] font-semibold text-[#F58220] bg-orange-50 px-2 py-0.5 rounded text-right">
            {{ orderData.serviceType }}
          </span>
        </div>
        
        <div v-if="orderData.dateRange" class="flex justify-between items-start">
          <span class="text-[12px] text-gray-500">Jadwal Trip</span>
          <span class="text-[12px] font-semibold text-gray-800 text-right">
            {{ orderData.dateRange }}
          </span>
        </div>

        <div class="flex justify-between items-start">
          <span class="text-[12px] text-gray-500">Jumlah</span>
          <span class="text-[12px] font-semibold text-gray-800">{{ orderData.qty }} {{ orderData.unit }}</span>
        </div>
        
        <div class="flex justify-between items-start">
          <span class="text-[12px] text-gray-500">Tanggal Order</span>
          <ClientOnly>
            <span class="text-[12px] font-semibold text-gray-800 text-right">
              {{ formatDate(orderData.createdAt) }}
            </span>
            <template #fallback>
              <div class="w-20 h-4 bg-gray-100 animate-pulse rounded"></div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="bg-white px-5 py-4 shadow-sm rounded-xl mb-4">
      <div class="flex items-center gap-3 bg-[#F4F6F5] p-3 rounded-xl border border-gray-100">
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
          <i class="fa-solid fa-shield-halved text-[#145C34] text-lg"></i>
        </div>
        <div>
          <h3 class="text-[12px] font-bold text-gray-900 mb-0.5">Pembayaran 100% Aman</h3>
          <p class="text-[10px] text-gray-500 leading-snug">Diproses oleh payment gateway resmi dan dienkripsi secara otomatis.</p>
        </div>
      </div>
    </div>

  </div>

  <div v-if="orderData" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 flex gap-3 z-40">
    <button 
      @click="router.push('/orders')" 
      class="px-5 py-3 rounded-xl text-[13px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
    >
      Nanti Saja
    </button>
    <button 
      @click="handleButtonClick"
      :disabled="isProcessingSnap"
      class="flex-1 py-3 rounded-xl text-[13px] font-bold transition shadow-sm flex items-center justify-center gap-2"
      :class="[
        isProcessingSnap ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 
        orderData.status === 'PENDING' ? 'bg-[#F58220] text-white hover:bg-orange-600' : 'bg-[#145C34] text-white hover:bg-green-800'
      ]">

      <i v-if="isProcessingSnap" class="fa-solid fa-circle-notch fa-spin"></i>
      <span v-else-if="orderData.status === 'PENDING'">Lanjutkan Pembayaran</span>
      <span v-else>Lihat Tiket</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead, useRuntimeConfig, useCookie, useFetch } from '#imports'
import authCustomer from '~/middleware/auth-customer'

definePageMeta({ 
  middleware: authCustomer 
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const invoiceNumber = route.params.invoice
const authCookie = useCookie('access_token')
const isProcessingSnap = ref(false)

// 1. Inject Script Midtrans Snap
useHead({
  script: [
    {
      src: 'https://app.sandbox.midtrans.com/snap/snap.js',
      'data-client-key': config.public.midtransClientKey
    }
  ]
})

// 2. Fetch Real API
const { data: rawResponse, pending, error } = await useFetch(`${config.public.apiBaseUrl}/orders/client/${invoiceNumber}`, {
  headers: {
    'Authorization': `Bearer ${authCookie.value}`,
    'Accept': 'application/json'
  }
})

// 3. Computed Property untuk Normalisasi Data
const orderData = computed(() => {
  if (!rawResponse.value?.data) return null;
  
  const d = rawResponse.value.data;
  
  // Format string 'open-trip' menjadi 'Open Trip'
  const formattedServiceType = d.serviceType 
    ? d.serviceType.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) 
    : '-';

  return {
    ...d,
    status: (d.status || '').toUpperCase(), // Pastikan selalu UPPERCASE
    serviceType: formattedServiceType
  }
})
const handleButtonClick = () => {
  if (orderData.value?.status === 'PENDING') {
    payWithSnap()
  } else {
    router.push(`/orders/${invoiceNumber}/ticket`)
  }
}

// 4. Logika Midtrans Snap
const payWithSnap = () => {
  if (orderData.value?.status !== 'PENDING') return

  const token = orderData.value?.snapToken

  if (!token) {
    alert('Gagal mendapatkan token pembayaran dari server.')
    return
  }

  isProcessingSnap.value = true

  if (window.snap) {
    window.snap.pay(token, {
      onSuccess: function (result) {
        isProcessingSnap.value = false
        router.replace(`/orders/${invoiceNumber}/ticket`) 
      },
      onPending: function (result) {
        isProcessingSnap.value = false
      },
      onError: function (result) {
        isProcessingSnap.value = false
        alert('Pembayaran gagal, silakan coba metode pembayaran lain.')
      },
      onClose: function () {
        isProcessingSnap.value = false
      }
    })
  } else {
    isProcessingSnap.value = false
    alert('Sistem pembayaran belum selesai dimuat, silakan tunggu sebentar dan coba lagi.')
  }
}

// 5. Utilities
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('ID Pesanan berhasil disalin!')
  } catch (err) {
    console.error('Gagal menyalin:', err)
  }
}

// 6. Auto-play
onMounted(() => {
  if (route.query.autoplay === 'true' && orderData.value?.snapToken && orderData.value?.status === 'PENDING') {
    setTimeout(() => {
      payWithSnap()
    }, 700) 
  }
})
</script>