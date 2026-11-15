<template>
  <div class="px-5 pt-8 pb-4 text-center">
    <div class="w-14 h-14 bg-[#F7F8FA] rounded-full flex items-center justify-center mx-auto mb-4 text-[#145C34]">
      <i class="fa-solid fa-handshake-angle text-2xl"></i>
    </div>
    <h2 class="text-xl font-extrabold text-gray-800 mb-2">Program Afiliasi</h2>
    <p class="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto">
      Bagikan link layanan Cicicuit Adventure dan kumpulkan berbagai reward menarik dari setiap pesanan yang berhasil terbuat.
    </p>
  </div>

  <div v-if="errorMessage" class="px-5 mt-2 animate-fade-in-down">
    <div class="bg-red-50 border border-red-100 p-3.5 rounded-xl flex gap-3 items-start">
      <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
      <div>
        <h4 class="text-[11px] font-bold text-red-700">Gagal Memproses</h4>
        <p class="text-[11px] text-red-600/80">{{ errorMessage }}</p>
      </div>
    </div>
  </div>

  <div class="px-5 mt-6">
    <div class="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-5">
      <div class="flex gap-4 items-start">
        <div class="w-8 h-8 rounded-full bg-gray-50 text-[#145C34] text-[12px] font-bold flex items-center justify-center shrink-0 border border-gray-100">
          <i class="fa-solid fa-link"></i>
        </div>
        <div>
          <h4 class="text-[13px] font-bold text-gray-800">1. Bagikan Link Layanan</h4>
          <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Pilih layanan yang tersedia seperti Open Trip, Porter, atau Guide, lalu bagikan link uniknya ke teman atau komunitasmu.
          </p>
        </div>
      </div>
      
      <div class="flex gap-4 items-start">
        <div class="w-8 h-8 rounded-full bg-gray-50 text-[#145C34] text-[12px] font-bold flex items-center justify-center shrink-0 border border-gray-100">
          <i class="fa-solid fa-clipboard-check"></i>
        </div>
        <div>
          <h4 class="text-[13px] font-bold text-gray-800">2. Pesanan Terbuat</h4>
          <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Setiap kali seseorang memesan layanan melalui link yang kamu bagikan, pesanan tersebut akan otomatis masuk ke progresmu.
          </p>
        </div>
      </div>

      <div class="flex gap-4 items-start">
        <div class="w-8 h-8 rounded-full bg-gray-50 text-[#145C34] text-[12px] font-bold flex items-center justify-center shrink-0 border border-gray-100">
          <i class="fa-solid fa-gift"></i>
        </div>
        <div>
          <h4 class="text-[13px] font-bold text-gray-800">3. Dapatkan Reward</h4>
          <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Capai target jumlah pesanan tertentu dan klaim berbagai reward spesial yang telah kami siapkan untukmu.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="px-5 mt-8">
    <button 
      @click="joinAffiliate" 
      :disabled="isSubmitting"
      class="w-full py-3.5 rounded-xl text-[13px] font-bold transition flex items-center justify-center gap-2"
      :class="isSubmitting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#145C34] text-white hover:bg-green-800 active:scale-[0.98]'"
    >
      <i v-if="isSubmitting" class="fa-solid fa-circle-notch fa-spin"></i>
      {{ isSubmitting ? 'Memproses...' : 'Daftar Afiliasi Sekarang' }}
    </button>
    <p class="text-[10px] text-center text-gray-400 mt-4 px-4 leading-relaxed">
      Dengan mendaftar, kamu menyetujui syarat & ketentuan afiliasi yang berlaku di platform kami.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie, useRuntimeConfig } from '#imports'

const emit = defineEmits(['joined'])

const router = useRouter()
const config = useRuntimeConfig()
const authCookie = useCookie('access_token')

const isSubmitting = ref(false)
const errorMessage = ref('')

const joinAffiliate = async () => {
  if (!authCookie.value) {
    errorMessage.value = 'Silakan login terlebih dahulu untuk bergabung.'
    setTimeout(() => router.push('/auth/login'), 2000)
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  
  try {
    await $fetch(`${config.public.apiBaseUrl}/affiliate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authCookie.value}`,
        'Accept': 'application/json'
      },
      body: {
        status: 'ACTIVE' 
      }
    })

    emit('joined')
  } catch (error) {
    errorMessage.value = error.response?._data?.message || error.data?.message || 'Gagal mendaftar afiliasi. Silakan coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}
</script>