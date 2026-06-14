<template>
  <div class="bg-[#145C34] pt-12 pb-20 px-5 rounded-b-[2rem] relative" />

  <div class="px-5 -mt-16 relative z-10">
    <div class="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center text-center relative">
      
      <NuxtLink to="/profile/setting" class="absolute top-4 right-5 text-gray-400 hover:text-[#145C34] transition p-1">
        <i class="fa-solid fa-gear text-[20px]"></i>
      </NuxtLink>

      <div class="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden -mt-12 bg-gray-200 relative">
        <NuxtImg
          :src="profileData.user.image"
          :alt="profileData.user.name" 
          class="w-full h-full object-cover"
          format="webp"
          loading="lazy" 
        />
      </div>

      <h2 class="text-xl font-extrabold text-[#114226] mt-3">{{ profileData.user.name }}</h2>
      <div class="bg-gray-100 text-[#145C34] px-3 py-1.5 rounded-full text-[10px] font-bold mt-2 flex items-center gap-1.5 tracking-wide">
        <i class="fa-solid fa-star"></i> {{ profileData.user.membership }}
      </div>

      <div class="w-full mt-5">
        <div class="flex justify-between text-[11px] font-bold text-gray-600 mb-2">
          <span>Level Progress</span>
          <span class="text-[#145C34]">{{ profileData.user.points }} / {{ profileData.user.maxPoints }} Poin</span>
        </div>
        <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            class="bg-gradient-to-r from-[#145C34] to-[#4CAF50] h-full rounded-full"
            :style="{ width: profileData.user.progressPercentage + '%' }"
          ></div>
        </div>
      </div>

      <button class="mt-4 text-[12px] font-bold text-[#145C34] hover:text-green-700 transition">
        Lihat Detail Poin & Keuntungan
      </button>
    </div>
  </div>

  <div class="px-5 mt-6">
    <div class="grid grid-cols-4 gap-3">
      <div v-for="menu in mainMenus" :key="menu.id" @click="$router.push(menu.path)" 
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
    <p class="text-[10px] font-semibold text-gray-500">{{ profileData.appInfo.appName }} - Version {{ profileData.appInfo.version }}</p>
    <p class="text-[10px] text-gray-400 mt-0.5">&copy; {{ profileData.appInfo.year }} {{ profileData.appInfo.company }}</p>
    <p class="text-[10px] text-gray-400 mt-0.5">Design & Development by {{ profileData.appInfo.developer }}</p>
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
            <p class="mb-3">{{ profileData.contact.intro }}</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>
                {{ profileData.contact.general.label }}
                <a :href="profileData.contact.general.link" target="_blank"
                  class="text-[#145C34] font-bold hover:underline">{{ profileData.contact.general.phone }}</a>
              </li>
              <li>
                {{ profileData.contact.tech.label }}
                <a :href="profileData.contact.tech.link" target="_blank"
                  class="text-[#145C34] font-bold hover:underline">{{ profileData.contact.tech.phone }}</a>
              </li>
            </ul>
          </div>

          <div v-else-if="selectedMenu?.id === 2" class="flex flex-col items-center text-center space-y-4">
            <NuxtImg :src="profileData.about.logo" alt="Logo Cicitcuit Adventure" class="w-60 h-auto object-contain" format="webp" />

            <p class="leading-relaxed" v-html="profileData.about.paragraph1"></p>
            <p class="leading-relaxed" v-html="profileData.about.paragraph2"></p>
            <p class="leading-relaxed italic text-[13px] text-gray-500 bg-[#E8F5E9]/50 p-3 rounded-lg border border-[#145C34]/10">
              {{ profileData.about.mission }}
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import authCustomer from '~/middleware/auth-customer'

definePageMeta({
  middleware: authCustomer
})

// --- Data Object Configuration ---
const profileData = ref({
  user: {
    name: 'Andi Pendaki',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    membership: 'ANGGOTA SILVER',
    points: 150,
    maxPoints: 500,
    progressPercentage: 30
  },
  appInfo: {
    appName: 'Cicitcuit Adventure App',
    version: '1.0.0',
    year: '2026',
    company: 'Outdoor Professional Services',
    developer: 'Nur Azis Saputra'
  },
  contact: {
    intro: 'Punya pertanyaan atau kendala? Jangan khawatir, tim Cicitcuit Adventure siap membantu kamu! Segera hubungi kami via WhatsApp di nomor berikut:',
    general: {
      label: 'Info & Bantuan Umum:',
      phone: '+6281574749156',
      link: 'https://wa.me/6281574749156'
    },
    tech: {
      label: 'Bantuan IT/Teknis:',
      phone: '+6282211551415',
      link: 'https://wa.me/6282211551415'
    }
  },
  about: {
    logo: '/logo.svg',
    paragraph1: '<strong class="text-[#145C34]">Cicitcuit Adventure</strong> adalah platform penyedia layanan pendakian gunung terintegrasi di Indonesia. Berdiri sejak tahun 2024, kami hadir untuk menjembatani para pendaki dengan tenaga profesional lokal secara mudah dan transparan.',
    paragraph2: 'Layanan utama kami mencakup penyewaan <strong>Porter</strong>, <strong>Guide</strong> bersertifikat, hingga pendaftaran <strong>Open Trip</strong> dan <strong>Private Trip</strong> ke berbagai gunung favorit seperti Rinjani, Semeru, Merbabu, dan banyak lagi.',
    mission: '"Misi kami adalah membuat setiap perjalanan pendakian Anda menjadi lebih aman, nyaman, dan tak terlupakan, sekaligus memberdayakan perekonomian masyarakat di sekitar basecamp." ⛰️✨'
  }
})

// --- Menu Data Configuration ---
const mainMenus = [
  { id: 1, label: 'Poin Saya', icon: 'fa-solid fa-wallet' },
  { id: 2, label: 'Refund Trip', icon: 'fa-solid fa-money-bill-transfer', badge: 2 },
  { id: 3, label: 'Voucher Saya', icon: 'fa-solid fa-ticket-simple' },
  { id: 4, label: 'Metode Bayar', icon: 'fa-solid fa-money-check-dollar' },
  { id: 5, label: 'Pesanan Saya', icon: 'fa-solid fa-file-invoice', path: '/orders' },
  { id: 6, label: 'Pengaturan Akun', icon: 'fa-solid fa-shield-halved', path: '/profile/setting' },
  { id: 7, label: 'Ulasan Trip Saya', icon: 'fa-solid fa-pen-to-square' },
  { id: 8, label: 'Referensi Teman', icon: 'fa-solid fa-user-group' }
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
  /* Menggunakan cubic-bezier agar akselerasi meluncur ke atasnya terlihat profesional seperti aplikasi iOS/Android */
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>