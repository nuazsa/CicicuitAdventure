<template>
  <MobileHeaderDefault title="Pengaturan Profil" backTo="/profile" hideSearch />

  <div class="px-5 pt-6 pb-10 flex flex-col gap-6">
    
    <div class="flex flex-col items-center">
      <div class="relative">
        <div class="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
          <NuxtImg 
            :src="formSetting.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'" 
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
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Nama Lengkap <span class="text-red-500">*</span></label>
        <input 
          v-model="formSetting.fullname"
          type="text" 
          placeholder="Masukkan nama lengkap"
          required
          class="w-full bg-white border border-gray-200 text-[14px] rounded-xl px-4 py-3 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
          Nomor WhatsApp
        </label>
        
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[14px] font-medium">+62</span>
          <input 
            v-model="formSetting.whatsapp"
            type="text" 
            inputmode="numeric"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            placeholder="81234567890"
            class="w-full bg-white border border-gray-200 text-[14px] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] transition-colors"
          />
        </div>
        <p v-if="formErrors.whatsapp" class="text-[10px] text-red-500 mt-1">
          {{ formErrors.whatsapp[0] }}
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
        :disabled="!isFormValidToSave || isSaving"
        class="w-full mt-4 py-3.5 rounded-xl font-bold text-[14px] transition shadow-md flex justify-center items-center gap-2"
        :class="(!isFormValidToSave || isSaving) ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#145C34] text-white hover:bg-green-800 shadow-green-900/20'"
      >
        <i v-if="isSaving" class="fa-solid fa-circle-notch fa-spin"></i>
        <i v-else class="fa-regular fa-floppy-disk"></i> 
        {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router' 
import authCustomer from '~/middleware/auth-customer'

definePageMeta({
  middleware: authCustomer
})

const { profileData, fetchProfile } = useProfile()
const config = useRuntimeConfig()
const token = useCookie('access_token')
const router = useRouter() 

const formSetting = ref({
  fullname: '',
  avatar_url: null,
  whatsapp: null,
  birthdate: null,
  gender: null
})

const isSaving = ref(false)
const formErrors = ref({})

const syncDataToForm = () => {
  if (profileData.value) {
    formSetting.value = {
      fullname: profileData.value.fullname || '',
      avatar_url: profileData.value.avatar_url || null,
      whatsapp: profileData.value.whatsapp || null,
      birthdate: profileData.value.birthdate 
        ? String(profileData.value.birthdate).split('T')[0] 
        : null,
      gender: profileData.value.gender || null
    }
  }
}

onMounted(async () => {
  await fetchProfile()
  syncDataToForm()
})

const formattedUpdatedAt = computed(() => {
  if (!profileData.value?.updated_at) return '-'
  const date = new Date(profileData.value.updated_at)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
})

const hasChanges = computed(() => {
  if (!profileData.value) return false 

  const originalBirthdate = profileData.value.birthdate 
        ? String(profileData.value.birthdate).split('T')[0] 
        : null;

  return formSetting.value.fullname !== (profileData.value.fullname || '') ||
         formSetting.value.avatar_url !== profileData.value.avatar_url ||
         formSetting.value.whatsapp !== profileData.value.whatsapp ||
         formSetting.value.birthdate !== originalBirthdate ||
         formSetting.value.gender !== profileData.value.gender
})

// --- LOGIKA TOMBOL SIMPAN AKTIF ---
const isFormValidToSave = computed(() => {
  if (!formSetting.value.fullname || formSetting.value.fullname.trim() === '') return false
  return hasChanges.value
})

// --- FUNGSI SIMPAN ---
const handleSaveProfile = async () => {
  isSaving.value = true;
  formErrors.value = {};
  try {
    const payload = { ...formSetting.value }

    if (payload.birthdate && payload.birthdate.includes('T')) {
      payload.birthdate = payload.birthdate.split('T')[0];
    }

    await $fetch(`${config.public.apiBaseUrl}/profile/me`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token.value}` },
      body: payload
    })

    alert('Profil berhasil diperbarui!')

    await fetchProfile(true)
    syncDataToForm()
  }catch (error) {
    // Tangkap struktur error validasi 400 dari backend
    if (error.data && error.data.statusCode === 400 && typeof error.data.message === 'object') {
      formErrors.value = error.data.message;
    } else {
      // Fallback jika error lain (misal: 500 server error)
      alert(error.data?.message || 'Terjadi kesalahan saat menyimpan perubahan.');
    }
  } finally {
    isSaving.value = false;
  }
}

// --- FUNGSI LOGOUT ---
const handleLogout = () => {
  const confirmLogout = confirm('Apakah Anda yakin ingin keluar dari akun?')
  if (confirmLogout) {
    const token = useCookie('access_token')
    token.value = null
    router.push('/auth/signin')
  }
}
</script>