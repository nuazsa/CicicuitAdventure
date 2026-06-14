<template>
  <!-- Header -->
  <MobileHeaderDefault title="Pengaturan Profil" backTo="/profile" hideSearch />

  <div class="px-5 pt-6 pb-10 flex flex-col gap-6">
    
    <div class="flex flex-col items-center">
      <div class="relative">
        <div class="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
          <NuxtImg 
            :src="formSetting.avatar_url" 
            alt="Avatar Pengguna" 
            class="w-full h-full object-cover"
            format="webp"
          />
        </div>
        <button class="absolute bottom-0 right-0 w-8 h-8 bg-[#145C34] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-green-800 transition">
          <i class="fa-solid fa-camera text-[11px]"></i>
        </button>
      </div>
      <p class="text-[10px] text-gray-400 mt-2">Terakhir diperbarui: {{ formattedUpdatedAt }}</p>
    </div>

    <form @submit.prevent="handleSaveProfile" class="flex flex-col gap-4">
      
      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Nama Lengkap</label>
        <input 
          v-model="formSetting.fullname"
          type="text" 
          placeholder="Masukkan nama lengkap"
          class="w-full bg-white border border-gray-200 text-[14px] rounded-xl px-4 py-3 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
          <span>Nomor WhatsApp</span>
          
          <button 
            type="button"
            @click="toggleEditWhatsapp" 
            class="text-[#F58220] hover:underline"
          >
            {{ isEditingWhatsapp ? 'Batal' : 'Ubah Nomor' }}
          </button>
        </label>
        
        <div class="relative flex gap-2">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[14px] font-medium">+62</span>
            <input 
              v-model="formSetting.whatsapp"
              type="tel" 
              :disabled="!isEditingWhatsapp"
              class="w-full border text-[14px] rounded-xl pl-12 pr-10 py-3 transition-colors focus:outline-none"
              :class="!isEditingWhatsapp ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-white border-[#145C34] ring-1 ring-[#145C34] text-gray-900'"
            />
            
            <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <i v-if="!isEditingWhatsapp && isWhatsappVerified" class="fa-solid fa-circle-check text-[#145C34] text-lg"></i>
              <i v-else-if="!isEditingWhatsapp" class="fa-solid fa-lock text-gray-300 text-sm"></i>
            </div>
          </div>

          <button 
            v-if="isEditingWhatsapp"
            type="button"
            @click="handleVerifyWhatsapp"
            class="bg-[#145C34] text-white px-4 rounded-xl text-[12px] font-bold hover:bg-green-800 transition shrink-0"
          >
            Verifikasi
          </button>
        </div>
        <p v-if="!isEditingWhatsapp && isWhatsappVerified" class="text-[10px] text-[#145C34] font-medium mt-1">
          <i class="fa-solid fa-shield-check mr-1"></i> Nomor telah terverifikasi
        </p>
        <p v-if="isEditingWhatsapp" class="text-[10px] text-[#F58220] font-medium mt-1">
          <i class="fa-solid fa-circle-exclamation mr-1"></i> Anda harus memverifikasi nomor baru sebelum menyimpannya.
        </p>
      </div>

      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Tanggal Lahir</label>
        <input 
          v-model="formSetting.birthdate"
          type="date" 
          class="w-full bg-white border border-gray-200 text-[14px] text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Jenis Kelamin</label>
        <div class="grid grid-cols-2 gap-3">
          <label 
            class="border rounded-xl py-3 px-4 flex items-center gap-3 cursor-pointer transition-colors"
            :class="formSetting.gender === 'M' ? 'bg-[#E8F5E9] border-[#145C34]' : 'bg-white border-gray-200'"
          >
            <input type="radio" v-model="formSetting.gender" value="M" class="hidden" />
            <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="formSetting.gender === 'M' ? 'border-[#145C34]' : 'border-gray-300'">
              <div v-if="formSetting.gender === 'M'" class="w-2 h-2 rounded-full bg-[#145C34]"></div>
            </div>
            <span class="text-[13px] font-semibold" :class="formSetting.gender === 'M' ? 'text-[#145C34]' : 'text-gray-600'">Laki-laki</span>
          </label>

          <label 
            class="border rounded-xl py-3 px-4 flex items-center gap-3 cursor-pointer transition-colors"
            :class="formSetting.gender === 'F' ? 'bg-[#E8F5E9] border-[#145C34]' : 'bg-white border-gray-200'"
          >
            <input type="radio" v-model="formSetting.gender" value="F" class="hidden" />
            <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center" :class="formSetting.gender === 'F' ? 'border-[#145C34]' : 'border-gray-300'">
              <div v-if="formSetting.gender === 'F'" class="w-2 h-2 rounded-full bg-[#145C34]"></div>
            </div>
            <span class="text-[13px] font-semibold" :class="formSetting.gender === 'F' ? 'text-[#145C34]' : 'text-gray-600'">Perempuan</span>
          </label>
        </div>
      </div>

      <button 
        type="submit"
        :disabled="isEditingWhatsapp"
        class="w-full mt-4 py-3.5 rounded-xl font-bold text-[14px] transition shadow-md flex justify-center items-center gap-2"
        :class="isEditingWhatsapp ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#145C34] text-white hover:bg-green-800 shadow-green-900/20'"
      >
        <i class="fa-regular fa-floppy-disk"></i> Simpan Perubahan
      </button>
    </form>

    <div class="pt-6">
      <div class="flex items-center mb-6">
        <div class="flex-1 h-px bg-gray-200"></div>
        <span class="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Zona Berbahaya</span>
        <div class="flex-1 h-px bg-gray-200"></div>
      </div>

      <button 
        @click="handleLogout" 
        type="button" 
        class="w-full mt-4 py-3.5 rounded-xl font-bold text-[14px] transition shadow-sm flex justify-center items-center gap-2 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 active:scale-[0.98]"
      >
        <i class="fa-solid fa-arrow-right-from-bracket"></i> Keluar Akun
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router' 
import authCustomer from '~/middleware/auth-customer'

definePageMeta({
  middleware: authCustomer
})

const router = useRouter() 

// --- Data Profil Simulasi (Sesuai Struktur Database) ---
const formSetting = ref({
  fullname: 'Andi Pendaki',
  avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  whatsapp: '81574749156', 
  birthdate: '1998-05-15',
  gender: 'M', 
  updated_at: '2026-06-10T14:30:00Z'
})

const formattedUpdatedAt = computed(() => {
  const date = new Date(formSetting.value.updated_at)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
})

// --- State Keamanan WhatsApp ---
const isWhatsappVerified = ref(true) 
const isEditingWhatsapp = ref(false)
const originalWhatsapp = ref(formSetting.value.whatsapp) 

const toggleEditWhatsapp = () => {
  if (isEditingWhatsapp.value) {
    formSetting.value.whatsapp = originalWhatsapp.value
    isEditingWhatsapp.value = false
  } else {
    isEditingWhatsapp.value = true
    isWhatsappVerified.value = false
  }
}

const handleVerifyWhatsapp = () => {
  alert(`Kode OTP telah dikirim ke +62${formSetting.value.whatsapp}`)
  isWhatsappVerified.value = true
  isEditingWhatsapp.value = false
  originalWhatsapp.value = formSetting.value.whatsapp 
}

// --- Fungsi Simpan ---
const handleSaveProfile = () => {
  if (isEditingWhatsapp.value) {
    alert('Harap selesaikan verifikasi WhatsApp terlebih dahulu!')
    return
  }
  console.log('Menyimpan Data Profil:', formSetting.value)
  alert('Profil berhasil diperbarui!')
}

// --- Fungsi Logout ---
const handleLogout = () => {
  const confirmLogout = confirm('Apakah Anda yakin ingin keluar dari akun?')
  
  if (confirmLogout) {
    // Menghapus cookie
    const token = useCookie('access_token')
    token.value = null
    
    // Melempar kembali ke halaman login
    router.push('/auth/signin')
  }
}
</script>