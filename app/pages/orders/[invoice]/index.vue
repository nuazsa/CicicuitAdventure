<template>
  <MobileHeaderDefault title="Detail Pembayaran" hideSearch />

  <!-- Detail Pembayaran -->
  <div class="flex flex-col p-5 gap-2 mt-2">
    
    <div class="bg-white px-5 py-8 flex flex-col items-center justify-center text-center shadow-sm rounded-xl">
      <div class="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3 border border-orange-100">
        <i class="fa-regular fa-clock text-3xl text-[#F58220]"></i>
      </div>
      <h2 class="text-lg font-extrabold text-gray-900">Menunggu Pembayaran</h2>
      <p class="text-[12px] text-gray-500 mt-1 max-w-[250px] mx-auto leading-relaxed">
        Selesaikan pembayaran Anda agar kursi perjalanan segera diamankan.
      </p>
      
      <div class="mt-5 text-[28px] font-black text-[#145C34] tracking-tight">
        {{ formatRupiah(orderDetail.data.grossAmount) }}
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
          <span class="text-[12px] text-gray-500">Nama Paket</span>
          <span class="text-[12px] font-semibold text-gray-800 text-right max-w-[180px] line-clamp-2">
            {{ orderDetail.data.tripTitle || orderDetail.data.package?.titleOfTrip || 'Gunung Gede Pangrango' }}
          </span>
        </div>
        
        <div class="flex justify-between items-start">
          <span class="text-[12px] text-gray-500">Jenis Layanan</span>
          <span class="text-[12px] font-semibold text-[#F58220] bg-orange-50 px-2 py-0.5 rounded text-right">
            {{ orderDetail.data.serviceType || orderDetail.data.type || 'Open Trip' }}
          </span>
        </div>

        <div class="flex justify-between items-start">
          <span class="text-[12px] text-gray-500">Jumlah Peserta</span>
          <span class="text-[12px] font-semibold text-gray-800">{{ orderDetail.data.qty || 1 }} Orang</span>
        </div>
        
        <div class="flex justify-between items-start">
          <span class="text-[12px] text-gray-500">Tanggal Order</span>
          <ClientOnly>
            <span class="text-[12px] font-semibold text-gray-800 text-right">
              {{ formatDate(orderDetail.data.createdAt || new Date()) }}
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

  <!-- Tombol Aksi -->
  <div v-if="orderDetail?.data" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 flex gap-3 z-40">
    <button 
      @click="router.push('/opentrip')" 
      class="px-5 py-3 rounded-xl text-[13px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
    >
      Nanti Saja
    </button>
    <button 
      @click="payWithSnap"
      :disabled="orderDetail.data.status !== 'PENDING' || isProcessingSnap"
      class="flex-1 py-3 rounded-xl text-[13px] font-bold transition shadow-sm flex items-center justify-center gap-2"
      :class="(orderDetail.data.status === 'PENDING' && !isProcessingSnap) ? 'bg-[#145C34] text-white hover:bg-green-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
    >
        <i v-if="isProcessingSnap" class="fa-solid fa-circle-notch fa-spin"></i>
        {{ orderDetail.data.status === 'PENDING' ? 'Lanjutkan Pembayaran' : 'Sudah Dibayar' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

// 1. Inject Script Midtrans Snap
useHead({
  script: [
    {
      src: 'https://app.sandbox.midtrans.com/snap/snap.js',
      'data-client-key': config.public.midtransClientKey || 'YOUR_CLIENT_KEY'
    }
  ]
})

// Ambil token otorisasi
const authCookie = useCookie('access_token')
const isProcessingSnap = ref(false)


// 2. Tembak API untuk mengambil detail spesifik invoice ini
// Pastikan endpoint disesuaikan dengan struktur backend Anda, misal: /orders/${invoiceNumber}
// const { data: orderDetail, pending, error } = await useFetch(`${config.public.apiBase}/orders/${invoiceNumber}`, {
//   headers: {
//     'Authorization': `Bearer ${authCookie.value}`,
//     'Accept': 'application/json'
//   }
// })

const orderDetail = ref({
  data: {
  status: 'PAID',
  tripTitle: 'Open Trip Cicitcuit',
  grossAmount: 1500000,
  qty: 2,
  createdAt: new Date().toISOString(),
  snapToken: 'dummy-snap-token'
}})

// 3. Fungsi Logika Snap Midtrans
const payWithSnap = () => {
  if (orderDetail.value?.data?.status !== 'PENDING') return

  const token = orderDetail.value?.data?.snapToken 

  if (!token) {
    alert('Gagal mendapatkan token pembayaran dari server.')
    return
  }

  isProcessingSnap.value = true

  if (window.snap) {
    window.snap.pay(token, {
      onSuccess: function (result) {
        console.log('Sukses:', result)
        isProcessingSnap.value = false
        router.replace(`/orders/${invoiceNumber}/ticket`) 
      },
      onPending: function (result) {
        console.log('Pending:', result)
        isProcessingSnap.value = false
      },
      onError: function (result) {
        console.log('Gagal:', result)
        isProcessingSnap.value = false
        alert('Pembayaran gagal, silakan coba metode pembayaran lain.')
      },
      onClose: function () {
        console.log('Snap ditutup')
        isProcessingSnap.value = false
        router.replace({ query: {} }) // Bersihkan autoplay query jika ditutup
      }
    })
  } else {
    isProcessingSnap.value = false
    alert('Sistem pembayaran belum selesai dimuat, silakan tunggu sebentar dan coba lagi.')
  }
}

// 4. Utilitas Format
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

// 5. Auto-play Snap
onMounted(() => {
  if (route.query.autoplay === 'true' && orderDetail.value?.data?.snapToken && orderDetail.value?.data?.status === 'PENDING') {
    setTimeout(() => {
      payWithSnap()
    }, 700) 
  }
})
</script>