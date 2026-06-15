<template>
  <div>
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
        <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
          <span>Nomor WhatsApp</span>
          <button 
            type="button"
            @click="toggleEditWhatsapp" 
            class="text-[#F58220] hover:underline"
          >
            {{ isEditingWhatsapp ? 'Batal' : (formSetting.whatsapp ? 'Ubah Nomor' : 'Tambah Nomor') }}
          </button>
        </label>
        
        <div class="relative flex gap-2">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[14px] font-medium">+62</span>
            <input 
              v-model="formSetting.whatsapp"
              type="text" 
              inputmode="numeric"
              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              :disabled="!isEditingWhatsapp"
              placeholder="81234567890"
              class="w-full border text-[14px] rounded-xl pl-12 pr-10 py-3 transition-colors focus:outline-none"
              :class="!isEditingWhatsapp ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-white border-[#145C34] ring-1 ring-[#145C34] text-gray-900'"
            />
            
            <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <i v-if="!isEditingWhatsapp && formSetting.whatsapp" class="fa-solid fa-circle-check text-[#145C34] text-lg"></i>
              <i v-else-if="!isEditingWhatsapp" class="fa-solid fa-lock text-gray-300 text-sm"></i>
            </div>
          </div>

          <button 
            v-if="isEditingWhatsapp"
            type="button"
            @click="requestOtp"
            :disabled="!formSetting.whatsapp || formSetting.whatsapp.length < 11"
            class="px-4 rounded-xl text-[12px] font-bold transition shrink-0"
            :class="!formSetting.whatsapp || formSetting.whatsapp.length < 11 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#145C34] text-white hover:bg-green-800'"
          >
            Verifikasi
          </button>
        </div>
        
        <p v-if="!isEditingWhatsapp && formSetting.whatsapp" class="text-[10px] text-[#145C34] font-medium mt-1">
          <i class="fa-solid fa-shield-check mr-1"></i> Nomor telah terverifikasi
        </p>
        <p v-else-if="!isEditingWhatsapp && !formSetting.whatsapp" class="text-[10px] text-gray-400 font-medium mt-1">
          Tambahkan nomor WhatsApp untuk memudahkan komunikasi dengan pihak basecamp.
        </p>
        <p v-if="isEditingWhatsapp" class="text-[10px] text-[#F58220] font-medium mt-1">
          <i class="fa-solid fa-circle-exclamation mr-1"></i> Selesaikan verifikasi sebelum menyimpan profil.
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

  <div class="fixed inset-0 z-[100] flex justify-center items-center px-4" v-if="showOtpModal">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeOtpModal"></div>
    
    <div class="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 flex flex-col items-center text-center">
      <div class="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#C8E6C9]">
        <i class="fa-brands fa-whatsapp text-3xl text-[#25D366]"></i>
      </div>
      
      <h3 class="text-xl font-bold text-gray-900 mb-1">Verifikasi Nomor</h3>
      <p class="text-[13px] text-gray-500 mb-6">
        Masukkan 6 digit kode yang dikirim ke <br/>
        <strong class="text-gray-800">+62{{ formSetting.whatsapp }}</strong>
      </p>

      <div class="flex justify-center gap-2 w-full mb-6" @paste="handlePaste">
        <input
          v-for="(digit, index) in 6"
          :key="index"
          :ref="el => { if (el) otpInputs[index] = el }"
          v-model="otpValues[index]"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          class="w-10 h-12 bg-gray-50 border border-gray-200 rounded-lg text-center text-lg font-bold text-gray-900 focus:outline-none focus:border-[#145C34] focus:bg-white focus:ring-1 focus:ring-[#145C34] transition-colors"
          @input="handleOtpInput(index, $event)"
          @keydown="handleOtpKeydown(index, $event)"
        />
      </div>

      <div class="w-full flex gap-3">
        <button 
          @click="closeOtpModal"
          class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-[13px] hover:bg-gray-200 transition"
        >
          Batal
        </button>
        <button 
          @click="submitOtp"
          :disabled="!isOtpComplete"
          class="flex-1 py-3 rounded-xl font-bold text-[13px] transition"
          :class="isOtpComplete ? 'bg-[#145C34] text-white hover:bg-green-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
        >
          Verifikasi
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
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
const isEditingWhatsapp = ref(false)
const originalWhatsapp = ref(null)

const isSaving = ref(false)

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
    originalWhatsapp.value = profileData.value.whatsapp || null
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
  if (isEditingWhatsapp.value) return false
  return hasChanges.value
})

// --- TOGGLE WHATSAPP ---
const toggleEditWhatsapp = () => {
  if (isEditingWhatsapp.value) {
    formSetting.value.whatsapp = originalWhatsapp.value
    isEditingWhatsapp.value = false
  } else {
    isEditingWhatsapp.value = true
  }
}

// --- LOGIKA MODAL OTP ---
const showOtpModal = ref(false)
const otpValues = ref(['', '', '', '', '', ''])
const otpInputs = ref([])

const isOtpComplete = computed(() => {
  return otpValues.value.every(val => val !== '')
})

const requestOtp = () => {
  if (!formSetting.value.whatsapp) return
  showOtpModal.value = true
  otpValues.value = ['', '', '', '', '', '']
  nextTick(() => {
    if (otpInputs.value[0]) otpInputs.value[0].focus()
  })
}

const closeOtpModal = () => {
  showOtpModal.value = false
}

const submitOtp = () => {
  const finalCode = otpValues.value.join('')
  console.log(`Verifikasi OTP: ${finalCode}`)
  
  isEditingWhatsapp.value = false
  originalWhatsapp.value = formSetting.value.whatsapp 
  showOtpModal.value = false
}

// --- INPUT OTP HANDLERS ---
const handleOtpInput = (index, event) => {
  let val = event.target.value.replace(/\D/g, '')
  otpValues.value[index] = val.substring(0, 1)
  if (val && index < 5) otpInputs.value[index + 1].focus()
}

const handleOtpKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpValues.value[index] && index > 0) {
    otpInputs.value[index - 1].focus()
    otpValues.value[index - 1] = '' 
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6)
  if (pastedData) {
    const chars = pastedData.split('')
    for (let i = 0; i < chars.length; i++) otpValues.value[i] = chars[i]
    const focusIndex = chars.length < 6 ? chars.length : 5
    otpInputs.value[focusIndex].focus()
  }
}

// --- FUNGSI SIMPAN ---
const handleSaveProfile = async () => {
  isSaving.value = true;
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
  } catch (error) {
    alert('Gagal menyimpan perubahan.')
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