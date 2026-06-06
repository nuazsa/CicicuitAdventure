<template>
  <!-- Hero Header -->
  <MobileHeaderInBanner :title="porterDetail.title" backTo="/porter" />

  <!-- Hero Banner -->
  <div class="relative h-[320px] w-full">
    <img :src="porterDetail.heroImage" :alt="porterDetail.title" class="w-full h-full object-cover" />
    
    <div class="absolute bottom-10 right-5 z-10">
      <button class="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-sm hover:bg-white transition">
        <i class="fa-regular fa-images"></i> Lihat Semua Foto
      </button>
    </div>
  </div>

  <!-- Porter Details -->
  <div class="bg-[#F9FAFB] rounded-t-[2rem] -mt-6 relative z-20 px-5 pt-6 flex flex-col gap-6">
    
    <!-- Porter Info -->
    <div>
      <h1 class="text-[22px] font-bold text-gray-900 leading-tight mb-2" v-html="porterDetail.titleFormatted"></h1>
      <p class="text-[13px] text-gray-600 flex items-center gap-2">
        <i class="fa-solid fa-location-dot text-[#145C34]"></i> {{ porterDetail.location }}
      </p>
    </div>

    <!-- Rating -->
    <div class="bg-white rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
      <div class="flex items-center justify-between border-b border-gray-50 pb-3 mb-3 cursor-pointer group">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#145C34] text-white rounded-full flex items-center justify-center font-bold text-lg">
            {{ porterDetail.rating.score }}
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">{{ porterDetail.rating.category }}</h3>
            <p class="text-[11px] text-gray-500">{{ porterDetail.rating.reviewCount }} ulasan pendaki</p>
          </div>
        </div>
        <i class="fa-solid fa-chevron-right text-gray-400 group-hover:text-gray-600 transition text-sm"></i>
      </div>
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-[#F58220] text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-1">
          {{ porterDetail.rating.topReview.userInitial }}
        </div>
        <div>
          <div class="flex text-[#F58220] text-[10px] gap-0.5 mb-1">
            <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
          </div>
          <p class="text-[12px] text-gray-700 italic leading-snug">"{{ porterDetail.rating.topReview.comment }}"</p>
        </div>
      </div>
    </div>

    <!-- Facilities & Skills -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-[15px] font-bold text-gray-800">Fasilitas & Keahlian</h2>
        <button class="text-[#145C34] text-[11px] font-bold hover:underline">Lihat Semua</button>
      </div>
      <div class="flex justify-between px-2">
        <div v-for="facility in porterDetail.facilities" :key="facility.name" class="flex flex-col items-center gap-2">
          <div class="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-[#145C34]">
            <i :class="[facility.icon, 'text-lg']"></i>
          </div>
          <span class="text-[10px] font-medium text-gray-600">{{ facility.name }}</span>
        </div>
      </div>
    </div>

    <!-- Schedule -->
    <div class="rounded-2xl overflow-hidden shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-100">
      <div class="bg-[#145C34] px-4 py-3.5 flex justify-between items-center">
        <div class="flex items-center gap-3 text-white">
          <i class="fa-regular fa-calendar-days text-xl opacity-90"></i>
          <div>
            <p class="text-sm font-bold">{{ porterDetail.schedule.dateRange }}</p>
            <p class="text-[11px] opacity-80">{{ porterDetail.schedule.duration }}</p>
          </div>
        </div>
        <button class="bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-orange-600 transition shadow-sm">
          Ubah
        </button>
      </div>
      <div class="bg-white px-4 py-4 flex justify-between items-center">
        <div>
          <h3 class="text-[15px] font-bold text-gray-800">Jumlah Porter</h3>
          <p class="text-[10px] text-gray-500 mt-0.5">(Saran: 1 porter / 20kg logistik)</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="decrementPorter" class="w-7 h-7 bg-[#145C34] text-white rounded-full flex items-center justify-center hover:bg-green-800 transition">
            <i class="fa-solid fa-minus text-xs"></i>
          </button>
          <span class="text-lg font-bold text-gray-800 w-4 text-center">{{ porterCount }}</span>
          <button @click="incrementPorter" class="w-7 h-7 bg-[#145C34] text-white rounded-full flex items-center justify-center hover:bg-green-800 transition">
            <i class="fa-solid fa-plus text-xs"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Hiking Information -->
    <div class="bg-white rounded-xl p-4 border border-gray-200">
      <h3 class="text-[11px] font-bold text-gray-500 mb-3 tracking-wider uppercase">Informasi Pendakian</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-[10px] text-gray-500 mb-1">Meeting Point</p>
          <p class="text-[13px] font-medium text-gray-800 leading-snug" v-html="porterDetail.hikingInfo.meetingPoint"></p>
        </div>
        <div>
          <p class="text-[10px] text-gray-500 mb-1">Waktu Kumpul</p>
          <p class="text-[13px] font-medium text-gray-800 leading-snug">{{ porterDetail.hikingInfo.meetingTime }}</p>
        </div>
      </div>
    </div>

    <!-- Package Options -->
    <div class="flex flex-col gap-5">
      <h2 class="text-[15px] font-bold text-gray-800 -mb-1">Pilihan Paket</h2>
      
      <div v-for="pkg in porterDetail.packages" :key="pkg.id" class="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
        <div class="relative h-36 w-full">
          <img :src="pkg.image" :alt="pkg.title" class="w-full h-full object-cover">
          <div v-if="pkg.discountLabel" class="absolute top-2 left-2 bg-[#C62828] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {{ pkg.discountLabel }}
          </div>
        </div>
        
        <div class="p-4">
          <div v-if="pkg.warningText" class="bg-red-50 rounded-lg p-2.5 flex gap-2 items-start mb-4 border border-red-100">
            <i class="fa-solid fa-circle-exclamation text-[#C62828] text-xs mt-0.5"></i>
            <p class="text-[#C62828] text-[11px] font-medium leading-snug">{{ pkg.warningText }}</p>
          </div>

          <h3 class="text-[15px] font-bold text-gray-800 mb-2.5">{{ pkg.title }}</h3>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="(tag, index) in pkg.tags" :key="index" class="bg-gray-100 text-[#145C34] px-2.5 py-1 rounded-full text-[10px] font-semibold border border-gray-200">
              {{ tag }}
            </span>
          </div>

          <div class="flex justify-between items-end border-t border-gray-100 border-dashed pt-4 mt-2">
            <div>
              <p v-if="pkg.originalPrice" class="text-[10px] text-gray-400 line-through mb-0.5">{{ pkg.originalPrice }}</p>
              <p class="text-[17px] font-extrabold text-[#C62828] leading-none">
                {{ pkg.currentPrice }} <span class="text-[10px] font-medium text-gray-500 font-normal">/ {{ pkg.priceUnit }}</span>
              </p>
            </div>
            <button @click="router.push(`/porter/${porterDetail.id}/package`)" class="bg-[#145C34] text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-green-800 transition shadow-sm">
              Pilih
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Basecamp Location   -->
    <div class="mb-6 mt-2">
      <h2 class="text-[15px] font-bold text-gray-800 mb-3">Lokasi Basecamp</h2>
      
      <div class="h-44 w-full bg-gray-200 rounded-xl relative overflow-hidden border border-gray-300 shadow-sm">
        <iframe 
          :src="porterDetail.mapUrl" 
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// --- State Management ---
const porterCount = ref(1)

// --- Data Object Mockup ---
const porterDetail = ref({
  id: 1,
  title: 'Porter Team Rinjani Perkasa',
  titleFormatted: 'Porter Team Rinjani<br/>Perkasa',
  heroImage:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  location: 'Basecamp Sembalun, Gunung Rinjani',
  rating: {
    score: 5,
    category: 'Istimewa',
    reviewCount: 120,
    topReview: {
      userInitial: 'AB',
      comment: 'Sangat membantu angkut logistik dan masakannya enak!'
    }
  },
  facilities: [
    { name: 'Tenda', icon: 'fa-solid fa-campground' },
    { name: 'Alat Masak', icon: 'fa-solid fa-fire-burner' },
    { name: 'Logistik', icon: 'fa-solid fa-box-open' },
    { name: 'P3K', icon: 'fa-solid fa-briefcase-medical' }
  ],
  schedule: {
    dateRange: '25 May - 27 May',
    duration: '3 Hari, 2 Malam'
  },
  hikingInfo: {
    meetingPoint: 'Basecamp Pintu<br/>Senaru',
    meetingTime: '07:00 WIB'
  },
  packages: [
    {
      id: 1,
      title: 'Paket Full Service (3H2M)',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      discountLabel: 'Hemat 20%',
      warningText:
        'Wah, tinggal 1 slot tim porter nih. Cepet pilih ya!',
      tags: [
        'Masak 3x Sehari',
        'Bongkar Pasang Tenda'
      ],
      originalPrice: 'Rp 900.000',
      currentPrice: 'Rp 750.000',
      priceUnit: 'porter'
    },
    {
      id: 2,
      title: 'Paket Hemat / Basic (3H2M)',
      image:
        'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
      discountLabel: null,
      warningText: null,
      tags: [
        'Angkut Logistik',
        'Maks 20 Kg'
      ],
      originalPrice: null,
      currentPrice: 'Rp 500.000',
      priceUnit: 'porter'
    }
  ],

  mapUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947.452227974435!2d116.52213587464999!3d-8.357094691679832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcc2f796097cb0b%3A0xcb0bca9048d618f8!2sBasecamp%20Sembalun%20Trek%20Rinjani!5e0!3m2!1sen!2sid!4v1780714244868!5m2!1sen!2sid'
})

// --- Functions ---
const incrementPorter = () => {
  porterCount.value++
}

const decrementPorter = () => {
  if (porterCount.value > 1) {
    porterCount.value--
  }
}
</script>