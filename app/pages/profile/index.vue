<template>
  <!-- Header -->
  <div class="bg-[#145C34] pt-12 pb-20 px-5 rounded-b-[2rem] relative" />

  <!-- Profile Info -->
  <div class="px-5 -mt-16 relative z-10">
    <div class="bg-white rounded-3xl p-5 shadow-sm flex flex-col items-center text-center">
      <!-- Profile Image -->
      <div class="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden -mt-12 bg-gray-200 relative">
        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Andi Pendaki" class="w-full h-full object-cover" />
      </div>

      <!-- Profile Name and Status -->
      <h2 class="text-xl font-extrabold text-[#114226] mt-3">Andi Pendaki</h2>
      <div class="bg-gray-100 text-[#145C34] px-3 py-1.5 rounded-full text-[10px] font-bold mt-2 flex items-center gap-1.5 tracking-wide">
        <i class="fa-solid fa-star"></i> ANGGOTA SILVER
      </div>

      <!-- Level Progress -->
      <div class="w-full mt-5">
        <div class="flex justify-between text-[11px] font-bold text-gray-600 mb-2">
          <span>Level Progress</span>
          <span class="text-[#145C34]">150 / 500 Poin</span>
        </div>
        <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-[#145C34] to-[#4CAF50] w-[30%] h-full rounded-full"></div>
        </div>
      </div>

      <button class="mt-4 text-[12px] font-bold text-[#145C34] hover:text-green-700 transition">
        Lihat Detail Poin & Keuntungan
      </button>
    </div>
  </div>

  <!-- Main Menus -->
  <div class="px-5 mt-6">
    <div class="grid grid-cols-4 gap-3">
      <div v-for="menu in mainMenus" :key="menu.id" class="bg-white rounded-2xl p-3 flex flex-col items-center text-center shadow-sm hover:shadow-md transition cursor-pointer relative group">
        <div v-if="menu.badge" class="absolute -top-1 -right-1 bg-[#EF6C00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full z-10 border border-white">
          {{ menu.badge }}
        </div>
        
        <div class="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#145C34] mb-2 group-hover:bg-[#145C34] group-hover:text-white transition-colors duration-300">
          <i :class="menu.icon" class="text-lg"></i>
        </div>
        <span class="text-[10px] font-bold text-gray-700 leading-tight">{{ menu.label }}</span>
      </div>
    </div>
  </div>

  <!-- Other Options -->
  <div class="px-5 mt-8">
    <h3 class="text-lg font-extrabold text-[#114226] mb-4">Lainnya</h3>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="item in otherMenus" :key="item.id" @click="openModal(item)" class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col gap-3">
        <div class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">
          <i :class="item.icon" class="text-lg"></i>
        </div>
        <span class="text-xs font-bold text-gray-800 leading-tight">{{ item.label }}</span>
      </div>
    </div>
  </div>

  <!-- Footer Info -->
  <div class="mt-10 mb-8 flex flex-col items-center text-center">
    <p class="text-[10px] font-semibold text-gray-500">Cicitcuit Adventure App - Version 1.0.0</p>
    <p class="text-[10px] text-gray-400 mt-0.5">&copy; 2026 Outdoor Professional Services</p>
    <p class="text-[10px] text-gray-400 mt-0.5">Design & Development by Nur Azis Saputra</p>
  </div>

  <!-- Bottom Navigation -->
  <MobileNavigationBottom />

  <!------------ Modal ------------>
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
          <button @click="closeModal" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="text-sm text-gray-600 mb-6">
          <p v-if="selectedMenu?.id === 1">
            Butuh bantuan? Tim support Cicitcuit Adventure siap membantu kamu 24/7. Silakan hubungi kami via WhatsApp atau Email di bawah ini.
          </p>
          <p v-if="selectedMenu?.id === 2">
            Cicitcuit Adventure adalah platform penyedia layanan open trip, private trip, guide, dan porter profesional sejak tahun 2024.
          </p>
        </div>

        <button @click="closeModal" class="w-full bg-[#145C34] text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition shadow-md shadow-green-900/20">
          Mengerti
        </button>

      </div>
    </transition>

  </div>  
  <!------------ End of Modal ------------>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// State untuk Bottom Modal
const isModalOpen = ref(false)
const selectedMenu = ref(null)

// Fungsi untuk membuka modal dan menyimpan data menu yang diklik
const openModal = (item) => {
  selectedMenu.value = item
  isModalOpen.value = true
}

// Fungsi untuk menutup modal
const closeModal = () => {
  isModalOpen.value = false
}

// Data Menu Utama Profil
const mainMenus = [
  { id: 1, label: 'Poin Saya', icon: 'fa-solid fa-wallet' },
  { id: 2, label: 'Refund Trip', icon: 'fa-solid fa-money-bill-transfer', badge: 2 },
  { id: 3, label: 'Voucher Saya', icon: 'fa-solid fa-ticket-simple' },
  { id: 4, label: 'Metode Bayar', icon: 'fa-solid fa-money-check-dollar' },
  { id: 5, label: 'Pesanan Saya', icon: 'fa-solid fa-file-invoice' },
  { id: 6, label: 'Keamanan Akun', icon: 'fa-solid fa-shield-halved' },
  { id: 7, label: 'Ulasan Trip Saya', icon: 'fa-solid fa-pen-to-square' },
  { id: 8, label: 'Referensi Teman', icon: 'fa-solid fa-user-group' }
]

// Data Menu Lainnya
const otherMenus = [
  { id: 1, label: 'Bantuan & Hubungi Kami', icon: 'fa-regular fa-circle-question' },
  { id: 2, label: 'Tentang Kami', icon: 'fa-solid fa-circle-info' }
]
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