<template>
  <MobileHeaderDefault title="Buat Kata Sandi Baru" backTo="/auth/signin" hideSearch />

  <div class="px-5 pt-10 pb-10 flex-1 flex flex-col">

    <div v-if="isCheckingToken" class="flex-1 flex flex-col items-center justify-center text-center">
      <i class="fa-solid fa-circle-notch fa-spin text-4xl text-[#145C34] mb-4"></i>
      <p class="text-gray-500 font-medium">Memverifikasi tautan keamanan...</p>
    </div>

    <div v-else-if="tokenError" class="flex-1 flex flex-col items-center justify-center text-center">
      <div class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-sm border-4 border-white">
        <i class="fa-solid fa-link-slash text-4xl"></i>
      </div>
      <h2 class="text-2xl font-extrabold text-gray-900 mb-2">Tautan Tidak Valid</h2>
      <p class="text-[13px] text-gray-500 mb-10 leading-relaxed">{{ tokenError }}</p>
      
      <button @click="$router.push('/auth/forgot-password')" class="w-full py-3.5 bg-[#145C34] text-white rounded-xl font-bold hover:bg-green-800 transition shadow-md shadow-green-900/20">
        Minta Tautan Baru
      </button>
    </div>

    <div v-else>
      <div class="w-16 h-16 bg-[#E8F5E9] rounded-2xl flex items-center justify-center text-[#145C34] mb-6 shadow-sm border border-[#C8E6C9]">
        <i class="fa-solid fa-shield-halved text-2xl"></i>
      </div>
      
      <h1 class="text-2xl font-extrabold text-gray-900 mb-2">Buat Kata Sandi</h1>
      <p class="text-[13px] text-gray-500 mb-8 leading-relaxed">
        Silakan buat kata sandi baru untuk mengamankan akun Anda. Pastikan kata sandi mudah diingat namun sulit ditebak.
      </p>

      <form @submit.prevent="handleSaveNewPassword" class="flex flex-col gap-5">
        
        <div class="space-y-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Kata Sandi</label>
          <div class="relative">
            <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input 
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'" 
              minlength="8" 
              placeholder="Minimal 8 karakter"
              required
              class="w-full bg-white border border-gray-200 text-[13px] rounded-xl pl-11 pr-11 py-3.5 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
            />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
              <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" class="text-sm"></i>
            </button>
          </div>
        </div>

        
        <div class="space-y-1.5">
          <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Verifikasi Kata Sandi</label>
          <div class="relative">
            <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input 
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'" 
              minlength="8" 
              placeholder="Minimal 8 karakter"
              required
              class="w-full bg-white border border-gray-200 text-[13px] rounded-xl pl-11 pr-11 py-3.5 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
            />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
              <i :class="showConfirmPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" class="text-sm"></i>
            </button>
          </div>
        </div>
        
        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="!isFormValid || isSaving"
            class="w-full py-3.5 rounded-xl font-bold text-[14px] transition shadow-md flex justify-center items-center gap-2"
            :class="(!isFormValid || isSaving) ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#145C34] text-white hover:bg-green-800 shadow-green-900/20'"
          >
            <i v-if="isSaving" class="fa-solid fa-circle-notch fa-spin"></i>
            {{ isSaving ? 'Menyimpan...' : 'Simpan Kata Sandi' }}
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

// Ambil data dari URL
const token = route.query.token
const email = route.query.email

// State UI
const isCheckingToken = ref(false)
const tokenError = ref(null) 
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const isSaving = ref(false)

// --- VALIDASI FORM ---
const isFormValid = computed(() => {
  return newPassword.value.length >= 8 && 
         confirmPassword.value.length >= 8 && 
         newPassword.value === confirmPassword.value
})

onMounted(async () => {
  if (!token || !email) {
    tokenError.value = "Tautan pemulihan tidak lengkap atau rusak."
    isCheckingToken.value = true
    return
  }
})

const handleSaveNewPassword = async () => {
  debugger
  if (!isFormValid.value) return

  isSaving.value = true

  try {
    
    await $fetch(`${config.public.apiBaseUrl}/auth/reset-password`, {
      method: 'POST',
      body: { token, email, password: newPassword.value }
    })

    alert("Kata sandi berhasil diubah! Silakan masuk kembali.")
    router.push('/auth/signin')
  } catch (error) {
    alert("Terjadi kesalahan saat menyimpan kata sandi.")
  } finally {
    isSaving.value = false
  }
}
</script>