<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col items-center text-center mt-4 mb-6">
      <NuxtImg src="/logo.svg" alt="Logo Cicitcuit Adventure" class="w-35 h-auto object-contain mb-3" format="webp" />
      <h1 class="text-2xl font-extrabold text-gray-950 tracking-tight">Mulai Petualanganmu</h1>
      <p class="text-xs text-gray-500 mt-1">Buat akun Cicitcuit Adventure untuk kemudahan akses trip</p>
    </div>

    <!-- Formulir Pendaftaran -->
    <form @submit.prevent="handleRegister" class="space-y-4 flex-1">
      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Nama Lengkap</label>
        <div class="relative">
          <i class="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input 
            v-model="formRegister.fullName"
            type="text" 
            placeholder="Masukkan nama lengkap Anda"
            required
            class="w-full bg-white border border-gray-200 text-[13px] rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Alamat Email</label>
        <div class="relative">
          <i class="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input 
            v-model="formRegister.email"
            type="email" 
            placeholder="contoh@email.com"
            required
            class="w-full bg-white border border-gray-200 text-[13px] rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Kata Sandi</label>
        <div class="relative">
          <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input 
            v-model="formRegister.password"
            :type="showPassword ? 'text' : 'password'" 
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
          <i class="fa-solid fa-shield-halved absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input 
            v-model="formRegister.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'" 
            placeholder="Ulangi kata sandi Anda"
            required
            class="w-full bg-white border border-gray-200 text-[13px] rounded-xl pl-11 pr-11 py-3.5 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
          />
          <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
            <i :class="showConfirmPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'" class="text-sm"></i>
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        class="w-full bg-[#145C34] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-green-900/10 hover:bg-green-800 transition active:scale-[0.99] mt-2 block"
      >
        Daftar Akun
      </button>

      <!-- Divider -->
      <div class="flex items-center my-5">
        <div class="flex-1 h-px bg-gray-200"></div>
        <span class="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Atau daftar dengan</span>
        <div class="flex-1 h-px bg-gray-200"></div>
      </div>

      <!-- Opsi Login Pihak Ketiga -->
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

      <!-- Link Masuk -->
      <p class="text-center text-xs text-gray-500 pt-3">
        Sudah punya akun? 
        <NuxtLink to="/auth/signin" class="text-[#145C34] font-bold hover:underline">Masuk di sini</NuxtLink>
      </p>
    </form>

    <!-- Banner Komunitas -->
    <div class="mt-8 bg-gradient-to-br from-[#FFF9F2] to-[#FFF3E0] border border-[#FFE0B2] rounded-2xl p-4 flex justify-between items-center shadow-sm relative overflow-hidden">
      <i class="fa-solid fa-campground absolute -right-4 -bottom-4 text-6xl text-[#F58220] opacity-10 transform -rotate-12 pointer-events-none"></i>
      
      <div class="relative z-10 pr-2">
        <h4 class="text-xs font-extrabold text-[#E65100] uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <i class="fa-solid fa-people-group"></i> Basecamp Komunitas
        </h4>
        <h3 class="text-[13px] font-bold text-gray-800 leading-tight">Gabung Rombongan Pendaki!</h3>
        <p class="text-[10px] text-gray-500 leading-normal mt-0.5">Dapatkan info kuota trip, teman muncak, & tips logistik.</p>
      </div>

      <a 
        href="https://wa.me/6281574749156" 
        target="_blank"
        class="relative z-10 bg-[#F58220] text-white px-4 py-2.5 rounded-xl text-[11px] font-bold hover:bg-orange-600 transition shadow-sm shrink-0 flex items-center gap-1"
      >
        Join <i class="fa-solid fa-arrow-right text-[9px]"></i>
      </a>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// --- State Keamanan Form (Sembunyi/Lihat Password) ---
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// --- Data Object Form ---
const formRegister = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// --- Fungsi Submit Registrasi ---
const handleRegister = () => {
  // Validasi kecocokan sandi
  if (formRegister.value.password !== formRegister.value.confirmPassword) {
    alert('Kata sandi dan verifikasi kata sandi tidak cocok!')
    return
  }

  console.log('Data pendaftaran dikirim:', formRegister.value)
  // Tempatkan logika integrasi API pendaftaran Anda di sini
}

// --- Fungsi Login Pihak Ketiga (OAuth) ---
const handleOAuth = (platform) => {
  console.log(`Melakukan pendaftaran/login via OAuth: ${platform}`)
  // Hubungkan dengan provider OAuth (Supabase, Firebase, Auth0, dll.)
}
</script>

<style scoped>
/* Menghilangkan efek biru bawaan browser smartphone saat elemen interaktif diklik */
button, input, a {
  -webkit-tap-highlight-color: transparent;
}
</style>