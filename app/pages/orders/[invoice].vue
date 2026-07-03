<template>
  <MobileHeaderDefault title="Detail Pembayaran" backTo="/user/orders" />
  
  <div class="px-5 pt-6 pb-28">
    <div class="bg-white rounded-xl p-5 shadow-sm text-center">
      <i class="fa-solid fa-file-invoice-dollar text-4xl text-[#145C34] mb-3"></i>
      <h2 class="text-lg font-bold text-gray-900 mb-1">Menunggu Pembayaran</h2>
      <p class="text-xs text-gray-500 mb-4">Selesaikan pembayaran untuk pesanan <b>{{ $route.params.invoice }}</b></p>
      
      <button 
        @click="payWithSnap"
        class="w-full bg-[#145C34] text-white py-3 rounded-lg font-bold text-sm hover:bg-green-800 transition"
      >
        Lanjutkan Pembayaran
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead, useRuntimeConfig } from '#imports'
// Import middleware autentikasi Anda jika perlu

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

// 1. Pindahkan suntikan script Midtrans ke halaman ini
useHead({
  script: [
    {
      src: 'https://app.sandbox.midtrans.com/snap/snap.js',
      'data-client-key': config.public.midtransClientKey
    }
  ]
})

// 2. Fungsi untuk memanggil Snap
const payWithSnap = () => {
  // Ambil token dari query URL (atau Anda bisa fetch ulang dari API jika tidak ada di URL)
  const token = route.query.token 

  if (!token) {
    alert('Token pembayaran tidak ditemukan. Silakan muat ulang (refresh) halaman.')
    return
  }

  if (window.snap) {
    window.snap.pay(token, {
      onSuccess: function (result) {
        console.log('Sukses:', result)
        // Redirect ke halaman sukses dan bersihkan query URL
        router.replace(`/orders/success?invoice=${route.params.invoice}`)
      },
      onPending: function (result) {
        console.log('Pending:', result)
        // User menutup snap tapi statusnya pending (misal pilih VA tapi belum bayar)
      },
      onError: function (result) {
        console.log('Gagal:', result)
        alert('Pembayaran gagal.')
      },
      onClose: function () {
        console.log('Snap ditutup tanpa menyelesaikan pembayaran')
        // Karena user sudah berada di halaman invoice, biarkan saja mereka di sini.
        // Jika mereka berubah pikiran, tinggal klik tombol "Lanjutkan Pembayaran" lagi.
        
        // Opsional: Bersihkan parameter 'autoplay' dari URL agar jika di-refresh tidak langsung muncul lagi
        router.replace({ query: { token: route.query.token } }) 
      }
    })
  } else {
    alert('Sistem pembayaran sedang dimuat, silakan tunggu sebentar lalu coba lagi.')
  }
}

// 3. Auto-play Snap saat halaman baru terbuka
onMounted(() => {
  if (route.query.autoplay === 'true' && route.query.token) {
    // Beri sedikit jeda agar script Midtrans selesai dimuat oleh browser
    setTimeout(() => {
      payWithSnap()
    }, 500)
  }
})
</script>