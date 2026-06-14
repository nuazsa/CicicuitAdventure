<template>
  <div class="p-6">
      <!-- Header -->
      <div class="flex flex-col items-center text-center mb-8">
        <div class="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-5 shadow-sm border border-[#C8E6C9]">
          <i class="fa-regular fa-envelope-open text-3xl text-[#145C34]"></i>
        </div>
        
        <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
          Cek Inbox Kamu 📩
        </h2>
        <p class="text-[13px] text-gray-500 leading-relaxed max-w-[280px]">
          Kami telah mengirimkan 6 digit kode verifikasi ke email:
          <br/>
          <strong class="text-gray-800 mt-1 inline-block">{{ userEmail }}</strong>
        </p>
      </div>

      <!-- Form OTP -->
      <form @submit.prevent="handleVerify" class="flex flex-col items-center w-full">
        
        <div class="flex justify-center gap-2 mb-8 w-full" @paste="handlePaste">
          <input
            v-for="(digit, index) in 6"
            :key="index"
            :ref="el => { if (el) otpInputs[index] = el }"
            v-model="otpValues[index]"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="1"
            class="w-12 h-14 bg-white border border-gray-200 rounded-xl text-center text-xl font-extrabold text-gray-900 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-all shadow-sm"
            :class="{ 'border-[#145C34] bg-[#F4F6F5]': otpValues[index] !== '' }"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
          />
        </div>

        <button 
          type="submit" 
          :disabled="!isOtpComplete || isLoading"
          class="w-full py-3.5 rounded-xl font-bold text-[13px] transition-all duration-300 shadow-sm flex justify-center items-center gap-2"
          :class="(isOtpComplete && !isLoading) ? 'bg-[#145C34] text-white hover:bg-green-800 shadow-md shadow-green-900/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        >
          <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
          {{ isLoading ? 'Memverifikasi...' : 'Verifikasi Sekarang' }}
          <i v-if="isOtpComplete && !isLoading" class="fa-solid fa-arrow-right text-[11px]"></i>
        </button>
      </form>

      <div class="mt-8 text-center text-[12px]">
        <p class="text-gray-500 mb-1">Belum menerima kode?</p>
        <button 
          @click="resendCode" 
          :disabled="countdown > 0"
          class="font-bold transition-colors"
          :class="countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#F58220] hover:text-orange-700'"
        >
          Kirim Ulang Kode
          <span v-if="countdown > 0" class="font-mono ml-1">({{ formattedCountdown }})</span>
        </button>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authGuest from '~/middleware/auth-guest'

definePageMeta({
  middleware: authGuest
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

// --- Ambil Data dari URL Query ---
const userEmail = ref(route.query.email || '')
const userFullname = ref(route.query.fullname || '')

// --- State OTP & Loading ---
const otpValues = ref(['', '', '', '', '', ''])
const otpInputs = ref([]) 
const isLoading = ref(false)

// Mengecek apakah seluruh 6 kotak sudah terisi
const isOtpComplete = computed(() => {
  return otpValues.value.every(val => val !== '')
})

// --- Logika Input OTP (Auto Advance) ---
const handleInput = (index, event) => {
  let val = event.target.value.replace(/\D/g, '')
  
  otpValues.value[index] = val.substring(0, 1)

  if (val && index < 5) {
    otpInputs.value[index + 1].focus()
  }
}

// --- Logika Keydown (Auto Backspace) ---
const handleKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0) {
    otpInputs.value[index - 1].focus()
    otpValues.value[index - 1] = '' 
  }
}

// --- Logika Paste ---
const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6)
  
  if (pastedData) {
    const chars = pastedData.split('')
    for (let i = 0; i < chars.length; i++) {
      otpValues.value[i] = chars[i]
    }

    const focusIndex = chars.length < 6 ? chars.length : 5
    otpInputs.value[focusIndex].focus()
  }
}

// --- Fungsi Submit Verifikasi ke API ---
const handleVerify = async () => {
  const finalCode = otpValues.value.join('')
  isLoading.value = true

  try {
    const payload = {
      fullname: userFullname.value,
      email: userEmail.value,
      verificationCode: finalCode
    }

    const response = await $fetch(`${config.public.apiBaseUrl}/auth/email-verify`, {
      method: 'POST',
      body: payload
    })
    
    // Arahkan ke halaman login jika berhasil
    router.push({
      path: '/auth/signin',
      query: {
        email: payload.email
      }
    })

  } catch (error) {
    console.error('Verifikasi gagal:', error)
    const errorMessage = error.data?.message || 'Kode verifikasi tidak valid atau telah kedaluwarsa.'
    alert(`Gagal: ${errorMessage}`)
  } finally {
    isLoading.value = false
  }
}

// --- Logika Hitung Mundur (Kirim Ulang) ---
const countdown = ref(60)
let timerInterval = null

const formattedCountdown = computed(() => {
  const m = Math.floor(countdown.value / 60).toString().padStart(2, '0')
  const s = (countdown.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const startTimer = () => {
  countdown.value = 60
  timerInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

const resendCode = async () => {
  if (countdown.value === 0) {
    console.log('Meminta ulang kode verifikasi API...')
    
    try {
      // TODO: Panggil API resend OTP di sini. Contoh:
      // await $fetch(`${config.public.apiBaseUrl}/api/auth/resend-code`, {
      //   method: 'POST',
      //   body: { email: userEmail.value }
      // })
      
      alert('Kode verifikasi baru telah dikirim ke email Anda.')
      startTimer()
      otpValues.value = ['', '', '', '', '', '']
      otpInputs.value[0].focus()

    } catch (error) {
      alert('Gagal mengirim ulang kode. Coba lagi nanti.')
    }
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  // Jika tidak ada email dari URL, berarti user memaksa masuk ke page ini tanpa mendaftar
  if (!userEmail.value && !userFullname.value) {
    alert('Sesi pendaftaran tidak ditemukan. Silakan daftar kembali.')
    router.push('/auth/signup')
    return
  }

  startTimer()
  if (otpInputs.value[0]) {
    otpInputs.value[0].focus()
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>