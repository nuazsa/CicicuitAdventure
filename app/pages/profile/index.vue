<template>
  <div class="bg-[#145C34] pt-12 pb-20 px-5 rounded-b-[2rem] relative" />

  <div class="px-5 -mt-16 relative z-10">
    <div class="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center text-center relative">
      
      <!-- Tombol Pengaturan (Hanya Tampil Jika Login) -->
      <NuxtLink v-if="isLoggedIn" to="/profile/setting" class="absolute top-4 right-5 text-gray-400 hover:text-[#145C34] transition p-1">
        <i class="fa-solid fa-gear text-[20px]"></i>
      </NuxtLink>

      <!-- KONDISI 1: JIKA USER SUDAH LOGIN -->
      <template v-if="isLoggedIn">
        <div class="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden -mt-12 bg-gray-200 relative">
          <NuxtImg
            :src="profileData?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'" 
            :alt="jwtFullname || profileData?.fullname || 'Avatar Pengguna'" 
            class="w-full h-full object-cover"
            format="webp"
            loading="lazy" 
          />
        </div>

        <h2 class="text-xl font-extrabold text-[#114226] mt-3">{{ jwtFullname || profileData?.fullname || 'Memuat...' }}</h2>
        
        <div class="bg-gray-100 text-[#145C34] px-3 py-1.5 rounded-full text-[10px] font-bold mt-2 flex items-center gap-1.5 tracking-wide">
          <i class="fa-solid fa-star"></i> {{ profileData?.gamification?.membership || 'MEMBER' }}
        </div>

        <div class="w-full mt-5">
          <div class="flex justify-between text-[11px] font-bold text-gray-600 mb-2">
            <span>Level Progress</span>
            <span class="text-[#145C34]">{{ profileData?.gamification?.points || 0 }} / {{ profileData?.gamification?.maxPoints || 0 }} Poin</span>
          </div>
          <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              class="bg-gradient-to-r from-[#145C34] to-[#4CAF50] h-full rounded-full transition-all duration-500 ease-out"
              :style="{ width: (profileData?.gamification?.progressPercentage || 0) + '%' }"
            ></div>
          </div>
        </div>

        <button @click="router.push('/profile/points')" class="mt-4 text-[12px] font-bold text-[#145C34] hover:text-green-700 transition">
          Lihat Detail Poin & Keuntungan 
        </button>
      </template>

      <!-- KONDISI 2: JIKA USER BELUM LOGIN (GUEST) -->
      <template v-else>
        <div class="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden -mt-12 bg-gray-100 flex items-center justify-center relative">
          <i class="fa-solid fa-user text-3xl text-gray-300"></i>
        </div>

        <h2 class="text-xl font-extrabold text-[#114226] mt-3">Halo, Petualang!</h2>
        <p class="text-[11px] text-gray-500 mt-1 mb-5 leading-relaxed">
          Masuk atau daftar sekarang untuk menikmati semua fitur Cicicuit Adventure.
        </p>
        
        <div class="flex w-full gap-3 px-2">
          <button @click="router.push('/auth/signin')" class="flex-1 py-2.5 bg-white border-[1.5px] border-[#145C34] text-[#145C34] rounded-xl text-xs font-bold hover:bg-green-50 transition active:scale-[0.98]">
            Masuk
          </button>
          <button @click="router.push('/auth/signup')" class="flex-1 py-2.5 bg-[#145C34] text-white rounded-xl text-xs font-bold hover:bg-green-800 transition shadow-md shadow-green-900/20 active:scale-[0.98]">
            Daftar
          </button>
        </div>
      </template>

    </div>
  </div>

  <div class="px-5 mt-6">
    <div class="grid grid-cols-4 gap-3">
      <div v-for="menu in mainMenus" :key="menu.id" @click="handleMenuClick(menu.path)" 
        class="bg-white rounded-2xl p-3 flex flex-col items-center text-center shadow-sm hover:shadow-md transition cursor-pointer relative group">
        <div v-if="menu.badge"
          class="absolute -top-1 -right-1 bg-[#EF6C00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full z-10 border border-white">
          {{ menu.badge }}
        </div>

        <div
          class="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#145C34] mb-2 group-hover:bg-[#145C34] group-hover:text-white transition-colors duration-300">
          <i :class="menu.icon" class="text-lg"></i>
        </div>
        <span class="text-[10px] font-bold text-gray-700 leading-tight">{{ menu.label }}</span>
      </div>
    </div>
  </div>

  <div class="px-5 mt-8">
    <h3 class="text-lg font-extrabold text-[#114226] mb-4">Lainnya</h3>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="item in otherMenus" :key="item.id" @click="openModal(item)"
        class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col gap-3">
        <div class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">
          <i :class="item.icon" class="text-lg"></i>
        </div>
        <span class="text-xs font-bold text-gray-800 leading-tight">{{ item.label }}</span>
      </div>
    </div>
  </div>

  <div class="mt-10 mb-8 flex flex-col items-center text-center">
    <p class="text-[10px] font-semibold text-gray-500">{{ profileInfo.appInfo.appName }} - Version {{ profileInfo.appInfo.version }}</p>
    <p class="text-[10px] text-gray-400 mt-0.5">&copy; {{ profileInfo.appInfo.year }} {{ profileInfo.appInfo.company }}</p>
    <p class="text-[10px] text-gray-400 mt-0.5">Design & Development by {{ profileInfo.appInfo.developer }}</p>
  </div>

  <MobileNavigationBottom />

  <div class="fixed inset-0 z-[100] flex justify-center items-end" v-if="isModalOpen">
    <transition name="fade" appear>
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>
    </transition>

    <transition name="slide-up" appear>
      <div class="relative w-full max-w-md bg-white rounded-t-3xl pt-3 pb-8 px-6 shadow-2xl z-10" @click.stop>
        <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5"></div>

        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#145C34]">
              <i :class="selectedMenu?.icon" class="text-lg"></i>
            </div>
            <h3 class="font-bold text-lg text-gray-800">{{ selectedMenu?.label }}</h3>
          </div>
          <button @click="closeModal"
            class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="text-sm text-gray-600 mb-6">
          <div v-if="selectedMenu?.id === 1">
            <p class="mb-3">{{ profileInfo.contact.intro }}</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>
                {{ profileInfo.contact.general.label }}
                <a :href="profileInfo.contact.general.link" target="_blank"
                  class="text-[#145C34] font-bold hover:underline">{{ profileInfo.contact.general.phone }}</a>
              </li>
              <li>
                {{ profileInfo.contact.tech.label }}
                <a :href="profileInfo.contact.tech.link" target="_blank"
                  class="text-[#145C34] font-bold hover:underline">{{ profileInfo.contact.tech.phone }}</a>
              </li>
            </ul>
          </div>

          <div v-else-if="selectedMenu?.id === 2" class="flex flex-col items-center text-center space-y-4">
            <NuxtImg :src="profileInfo.about.logo" alt="Logo Cicicuit Adventure" class="w-60 h-auto object-contain" format="webp" />
            <p class="leading-relaxed" v-html="profileInfo.about.paragraph1"></p>
            <p class="leading-relaxed" v-html="profileInfo.about.paragraph2"></p>
            <p class="leading-relaxed italic text-[13px] text-gray-500 bg-[#E8F5E9]/50 p-3 rounded-lg border border-[#145C34]/10">
              {{ profileInfo.about.mission }}
            </p>
          </div>
        </div>

        <button @click="closeModal"
          class="w-full bg-[#145C34] text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition shadow-md shadow-green-900/20">
          Mengerti
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCookie } from '#imports'

// PERUBAHAN: Middleware authCustomer dihapus agar bisa diakses tanpa login
// definePageMeta({
//   middleware: authCustomer
// })

const authCookie = useCookie('access_token')
const router = useRouter()

// Cek status login
const isLoggedIn = computed(() => !!authCookie.value)

const jwtFullname = computed(() => {
  if (!isLoggedIn.value) return ''
  
  try {
    const base64Url = authCookie.value.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const decoded = JSON.parse(jsonPayload)

    return decoded.fullname || ''
  } catch (err) {
    return ''
  }
})

const { profileData, isProfileLoading, fetchProfile } = useProfile();

onMounted(async () => {
  // Hanya ambil data profile ke API jika user memang punya token (sudah login)
  if (isLoggedIn.value) {
    await fetchProfile()
  }
})

// --- Handler Klik Menu ---
const handleMenuClick = (path) => {
  if (!path) return
  
  // Jika menu mengarah ke halaman yang butuh login (selain Daftar Gunung), dan user belum login
  if (!isLoggedIn.value && path !== '/mountains') {
    router.push('/auth/signin')
  } else {
    router.push(path)
  }
}

// --- Data Object Configuration ---
const profileInfo = ref({
  appInfo: {
    appName: 'Cicicuit Adventure App',
    version: '1.0.0',
    year: '2026',
    company: 'Outdoor Professional Services',
    developer: 'Nur Azis Saputra'
  },
  contact: {
    intro: 'Punya pertanyaan atau kendala? Jangan khawatir, tim Cicicuit Adventure siap membantu kamu! Segera hubungi kami via WhatsApp di nomor berikut:',
    general: {
      label: 'Info & Bantuan Umum:',
      phone: '+6281574749156',
      link: 'https://wa.me/6281574749156'
    },
    tech: {
      label: 'Bantuan IT/Teknis:',
      phone: '+6289501475288',
      link: 'https://wa.me/6289501475288'
    }
  },
  about: {
    logo: '/logo.svg',
    paragraph1: '<strong class="text-[#145C34]">Cicicuit Adventure</strong> adalah platform penyedia layanan pendakian gunung terintegrasi di Indonesia. Berdiri sejak tahun 2024, kami hadir untuk menjembatani para pendaki dengan tenaga profesional lokal secara mudah dan transparan.',
    paragraph2: 'Layanan utama kami mencakup penyewaan <strong>Porter</strong>, <strong>Guide</strong> bersertifikat, hingga pendaftaran <strong>Open Trip</strong> dan <strong>Private Trip</strong> ke berbagai gunung favorit seperti Rinjani, Semeru, Merbabu, dan banyak lagi.',
    mission: '"Misi kami adalah membuat setiap perjalanan pendakian Anda menjadi lebih aman, nyaman, dan tak terlupakan, sekaligus memberdayakan perekonomian masyarakat di sekitar basecamp." ⛰️✨'
  }
})

// --- Menu Data Configuration ---
const mainMenus = [
  { id: 1, label: 'Poin Saya', icon: 'fa-solid fa-wallet', path: '/profile/points' },
  { id: 2, label: 'Refund Trip', icon: 'fa-solid fa-money-bill-transfer', badge: 2, path: '/refund' }, // (misal punya path)
  { id: 3, label: 'Voucher Saya', icon: 'fa-solid fa-ticket-simple', path: '/voucher' },
  { id: 4, label: 'Metode Bayar', icon: 'fa-solid fa-money-check-dollar', path: '/payment-methods' },
  { id: 5, label: 'Pesanan Saya', icon: 'fa-solid fa-file-invoice', path: '/orders' },
  { id: 6, label: 'Pengaturan Akun', icon: 'fa-solid fa-shield-halved', path: '/profile/setting' },
  { id: 7, label: 'Ulasan Trip Saya', icon: 'fa-solid fa-pen-to-square', path: '/reviews' },
  { id: 8, label: 'Daftar Gunung', icon: 'fa-solid fa-mountain', path: '/mountains' }
]

const otherMenus = [
  { id: 1, label: 'Bantuan & Hubungi Kami', icon: 'fa-regular fa-circle-question' },
  { id: 2, label: 'Tentang Kami', icon: 'fa-solid fa-circle-info' }
]

// --- State and Functions for Bottom Modal ---
const isModalOpen = ref(false)
const selectedMenu = ref(null)

const openModal = (item) => {
  selectedMenu.value = item
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<style scoped>
/* --- Transisi Overlay (Fade) --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- Transisi Modal (Slide Up dari Bawah) --- */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>