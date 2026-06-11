<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col items-center text-center mt-4 mb-6">
      <NuxtImg src="/logo.svg" alt="Logo Cicitcuit Adventure" class="w-35 h-auto object-contain mb-3" format="webp" />
      <h1 class="text-2xl font-extrabold text-gray-950 tracking-tight">Selamat Datang Kembali!</h1>
      <p class="text-xs text-gray-500 mt-1">Masuk untuk mengatur jadwal pendakianmu</p>
    </div>

    <!-- Formulir Masuk -->
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Alamat Email</label>
        <div class="relative">
          <i class="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input 
            v-model="formLogin.email"
            type="email" 
            placeholder="Masukkan email Anda"
            required
            class="w-full bg-white border border-gray-200 text-[13px] rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors shadow-sm"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Kata Sandi</label>
        <div class="relative">
          <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input 
            v-model="formLogin.password"
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Masukkan kata sandi"
            required
            class="w-full bg-white border border-gray-200 text-[13px] rounded-xl pl-11 pr-11 py-3.5 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors shadow-sm"
          />
          <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
            <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" class="text-sm"></i>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1 pb-2">
        <label class="flex items-center gap-2 cursor-pointer group">
          <div 
            class="w-4 h-4 rounded border flex items-center justify-center transition-colors duration-200"
            :class="formLogin.rememberMe ? 'bg-[#145C34] border-[#145C34]' : 'bg-white border-gray-300 group-hover:border-gray-400'"
          >
            <i v-if="formLogin.rememberMe" class="fa-solid fa-check text-white text-[9px]"></i>
          </div>
          <span class="text-[11px] text-gray-600 font-medium select-none group-hover:text-gray-800 transition">Ingat Saya</span>
          <input type="checkbox" v-model="formLogin.rememberMe" class="hidden" />
        </label>

        <NuxtLink to="/forgot-password" class="text-[11px] font-bold text-[#145C34] hover:text-green-800 hover:underline transition">
          Lupa Kata Sandi?
        </NuxtLink>
      </div>

      <button 
        type="submit" 
        class="w-full bg-[#145C34] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-green-900/20 hover:bg-green-800 transition active:scale-[0.99] block"
      >
        Masuk
      </button>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="flex-1 h-px bg-gray-200"></div>
        <span class="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Atau masuk dengan</span>
        <div class="flex-1 h-px bg-gray-200"></div>
      </div>

      <!-- Opsi Login Lainnya -->
      <div class="grid grid-cols-2 gap-3">
        <button 
          type="button"
          @click="handleOAuth('Google')"
          class="bg-white border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <i class="fa-brands fa-google text-red-500 text-sm"></i> Google
        </button>
        
        <button 
          type="button"
          @click="handleOAuth('Facebook')"
          class="bg-white border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <i class="fa-brands fa-facebook text-blue-600 text-base"></i> Facebook
        </button>
      </div>

      <!-- Link Pendaftaran -->
      <p class="text-center text-xs text-gray-500 pt-6">
        Belum punya akun? 
        <NuxtLink to="/auth/signup" class="text-[#F58220] font-bold hover:underline">Daftar sekarang</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// --- State Keamanan & Form ---
const showPassword = ref(false)

const formLogin = ref({
  email: '',
  password: '',
  rememberMe: false
})

// --- Fungsi Submit Login ---
const handleLogin = () => {
  console.log('Mencoba masuk dengan data:', formLogin.value)
  // TODO: Integrasikan dengan fungsi signInWithPassword (Supabase) atau endpoint API backend Anda
}

// --- Fungsi Login Pihak Ketiga (OAuth) ---
const handleOAuth = (platform) => {
  console.log(`Melakukan login via OAuth: ${platform}`)
  // TODO: Integrasikan dengan fungsi signInWithOAuth
}
</script>

<style scoped>
/* Menghilangkan efek biru bawaan browser smartphone saat elemen interaktif diklik */
button, input, a, label {
  -webkit-tap-highlight-color: transparent;
}
</style>