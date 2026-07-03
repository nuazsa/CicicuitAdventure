<template>
  <NuxtPage />
</template>

<script setup>
import { watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch, useRuntimeConfig, useCookie } from '#imports'
import authCustomer from '~/middleware/auth-customer'

// Terapkan middleware otorisasi global di tingkat induk
definePageMeta({
  middleware: authCustomer
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const invoiceNumber = route.params.invoice

// Ambil token untuk Authorization
const authCookie = useCookie('access_token')

// Tembak API untuk mendapatkan detail pesanan (termasuk statusnya)
const { data, pending, error } = await useFetch(`${config.public.apiBaseUrl}/orders/checkout/{{packageuuid}}`, {
  headers: {
    'Authorization': `Bearer ${authCookie.value}`,
    'Accept': 'application/json'
  }
})

// Logika Pengalihan Berdasarkan Status
watchEffect(() => {
  // Tunggu hingga data siap
  if (!pending.value && data.value?.data) {
    const orderStatus = data.value.data.status // Misal: 'PENDING' atau 'CONFIRMED'

    // Logika Pengalihan
    if (orderStatus === 'CONFIRMED') {
      // Jika status sudah confirmed, paksa alihkan ke rute /ticket
      router.replace(`/orders/${invoiceNumber}/ticket`)
    } else if (orderStatus === 'PENDING') {
      // Jika status tertunda, pengguna sudah berada di halaman Invoice yang benar (induk/index)
      // router.replace(`/orders/${invoiceNumber}`) // Tidak perlu karena kita sudah di rute /orders/invoice
    } else {
      // Handle status lain (contoh: 'CANCELED' atau 'EXPIRED')
      console.error('Status pesanan tidak dikenal:', orderStatus)
      // router.replace('/order/error')
    }
  }
})

// Jika terjadi error dari API
if (error.value) {
  console.error('Error memuat pesanan:', error.value)
  // router.replace('/orders/not-found')
}
</script>