<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <i class="fa-solid fa-circle-notch fa-spin text-4xl text-[#145C34] mb-4"></i>
    <h1 class="text-lg font-bold text-gray-800">Menyelesaikan Autentikasi...</h1>
    <p class="text-sm text-gray-500">Mohon tunggu sebentar, Anda akan segera dialihkan.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter, useCookie } from 'nuxt/app'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  // 1. Tangkap token dari URL (?token=xxxx)
  const token = route.query.token

  if (token) {
    // 2. Simpan token ke dalam Cookie (samakan dengan logika form login manual Anda)
    // Kita set default 7 hari untuk Google OAuth
    const accessToken = useCookie('access_token', { maxAge: 60 * 60 * 24 * 7 })
    accessToken.value = token

    // 3. Arahkan pengguna ke halaman utama
    router.replace('/') 
  } else {
    // Jika tidak ada token (misal user batal login), kembalikan ke halaman login
    console.error('Token tidak ditemukan dari URL Callback Google')
    router.replace('/auth/signin?error=google_failed')
  }
})
</script>