<template>
  <!-- Header -->
  <MobileHeaderDefault title="Lupa Kata Sandi?" backTo="/auth/signin" hideSearch />

  <div class="px-5 pt-10 pb-10 flex-1 flex flex-col">
    <transition name="fade" mode="out-in">
      <div v-if="!isSuccess" key="form-state" class="flex-1 flex flex-col">

        <div class="w-20 h-20 bg-[#E8F5E9] rounded-3xl flex items-center justify-center text-[#145C34] mb-6 shadow-sm border border-[#C8E6C9] rotate-3">
          <i class="fa-solid fa-unlock-keyhole text-3xl -rotate-3"></i>
        </div>

        <h1 class="text-2xl font-extrabold text-gray-900 leading-tight"></h1>
        <p class="text-[13px] text-gray-500 mt-2 mb-8 leading-relaxed">
          Jangan khawatir! Masukkan email yang terhubung dengan akun Anda, dan kami akan mengirimkan instruksi untuk mereset kata sandi.
        </p>

        <form @submit.prevent="handleResetPassword" class="flex flex-col gap-6 flex-1">
          <div class="space-y-1.5">
            <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Email</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i class="fa-regular fa-envelope"></i>
              </span>
              <input 
                v-model="contactInput"
                type="email" 
                placeholder="example@gmail.com"
                required
                class="w-full bg-white border border-gray-200 text-[14px] rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
              />
            </div>
          </div>

          <div class="mt-auto pt-6">
            <button 
              type="submit"
              :disabled="!isFormValid || isLoading"
              class="w-full py-3.5 rounded-xl font-bold text-[14px] transition shadow-md flex justify-center items-center gap-2"
              :class="(!isFormValid || isLoading) ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#145C34] text-white hover:bg-green-800 shadow-green-900/20'"
            >
              <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else class="fa-regular fa-paper-plane"></i> 
              {{ isLoading ? 'Mengirim...' : 'Kirim Instruksi Reset' }}
            </button>
          </div>
          
        </form>
      </div>

      <div v-else key="success-state" class="flex-1 flex flex-col items-center justify-center text-center mt-10">
        
        <div class="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#145C34] mb-6 shadow-md border-4 border-white relative">
          <div class="absolute -inset-2 border border-[#145C34]/20 rounded-full animate-ping opacity-20"></div>
          <i class="fa-solid fa-envelope-circle-check text-4xl"></i>
        </div>

        <h2 class="text-2xl font-extrabold text-gray-900 mb-3">Cek Kotak Masuk Anda!</h2>
        <p class="text-[13px] text-gray-500 leading-relaxed max-w-[280px]">
          Kami telah mengirimkan instruksi pemulihan kata sandi ke <strong class="text-gray-800">{{ contactInput }}</strong>. 
          Silakan ikuti tautan di dalamnya.
        </p>

        <div class="w-full mt-12 space-y-4">
          <button 
            @click="$router.push('/auth/signin')"
            class="w-full py-3.5 bg-[#145C34] text-white rounded-xl font-bold text-[14px] hover:bg-green-800 transition shadow-md shadow-green-900/20"
          >
            Kembali ke Halaman Masuk
          </button>
          
          <p class="text-[11px] text-gray-500 font-medium">
            Belum menerima pesan? 
            <button @click="handleResetPassword" class="text-[#F58220] font-bold hover:underline" :disabled="isLoading">
              Kirim Ulang
            </button>
          </p>
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import authGuest from '~/middleware/auth-guest'

definePageMeta({
  middleware: authGuest
})

const router = useRouter()
const config = useRuntimeConfig()

// --- State ---
const contactInput = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

// --- Validasi ---
const isFormValid = computed(() => {
  const isContactValid = contactInput.value && contactInput.value.trim().length >= 5;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(contactInput.value);

  return isContactValid && isEmailValid;
})

// --- Aksi Kirim ---
const handleResetPassword = async () => {
  isLoading.value = true

  try {
    await $fetch(`${config.public.apiBaseUrl}/auth/forgot-password`, {
      method: 'POST',
      body: { email: contactInput.value }
    })

    isSuccess.value = true
  } catch (error) {
    alert('Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Transisi halus saat berganti dari Form ke State Sukses */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>