<template>
  <MobileHeaderInBanner :title="tripDetail.title" backTo="/opentrip" />

  <div class="relative h-[320px] w-full">
    <NuxtImg 
      :src="tripDetail.heroImage" 
      :alt="tripDetail.title" 
      class="w-full h-full object-cover" 
      format="webp"
      preload
    />
    
    <div class="absolute bottom-10 right-5 z-10">
      <button class="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-sm hover:bg-white transition">
        <i class="fa-regular fa-images"></i> Lihat Semua Foto
      </button>
    </div>
  </div>

  <!-- Trip Details -->
  <div class="bg-[#F9FAFB] rounded-t-[2rem] -mt-6 relative z-20 px-5 pt-6 flex flex-col gap-6">
    <div>
      <h1 class="text-[22px] font-bold text-gray-900 leading-tight mb-2">{{ tripDetail.title }}</h1>
      <p class="text-[13px] text-gray-600 flex items-center gap-2">
        <i class="fa-solid fa-location-dot text-[#145C34]"></i> {{ tripDetail.location }}
      </p>
    </div>

    <!-- Rating -->
    <MobileCardRanting
      :score="tripDetail.rating.score" 
      :category="tripDetail.rating.category" 
      :reviewCount="tripDetail.rating.reviewCount" 
      :topReview="tripDetail.rating.topReview"
    />

    <!-- Facilities & Skills -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-[15px] font-bold text-gray-800">Fasilitas Open Trip</h2>
        <button class="text-[#145C34] text-[11px] font-bold hover:underline">Lihat Semua</button>
      </div>
      <div class="flex justify-between px-2">
        <div v-for="facility in tripDetail.facilities" :key="facility.name" class="flex flex-col items-center gap-2">
          <div class="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-[#145C34]">
            <i :class="[facility.icon, 'text-lg']"></i>
          </div>
          <span class="text-[10px] font-medium text-gray-600">{{ facility.name }}</span>
        </div>
      </div>
    </div>

    <!-- Schedule -->
    <MobileCardSchedule 
      :dateRange="tripDetail.schedule.dateRange"
      :duration="tripDetail.schedule.duration"
    />

    <!-- Hiking Information -->
    <MobileCardInformation 
      :meetingPoint="tripDetail.hikingInfo.meetingPoint" 
      :meetingTime="tripDetail.hikingInfo.meetingTime"
    />

    <!-- Package Options -->
    <div class="flex flex-col gap-5">
      <h2 class="text-[15px] font-bold text-gray-800 -mb-1">Pilihan Paket Rute</h2>
      
      <div v-for="pkg in tripDetail.packages" :key="pkg.id" class="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
        <div class="relative h-36 w-full">
          <NuxtImg 
            :src="pkg.image" 
            :alt="pkg.title" 
            class="w-full h-full object-cover"
            format="webp"
            loading="lazy"
          />
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
            <button @click="router.push(`/opentrip/${tripDetail.id}/package`)" class="bg-[#145C34] text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-green-800 transition shadow-sm">
              Pilih
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Basecamp Location   -->
    <MobileCardMeetingPoint :mapUrl="tripDetail.mapUrl" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- Data Object Mockup Khusus Gunung Gede Pangrango ---
const tripDetail = ref({
  id: 1,
  title: 'Open Trip Gunung Gede Pangrango 2H1M',
  heroImage:
    'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80',
  location: 'Bogor, Jawa Barat',
  rating: {
    score: 4.9,
    category: 'Sangat Bagus',
    reviewCount: 84,
    topReview: {
      userInitial: 'RN',
      comment: 'Seru banget, dapet temen baru. Tenda bersih dan guidenya ramah mengarahkan rute.'
    }
  },
  facilities: [
    { name: 'Travel PP', icon: 'fa-solid fa-van-shuttle' },
    { name: 'Simaksi Resmi', icon: 'fa-solid fa-ticket' },
    { name: 'Tenda Dome', icon: 'fa-solid fa-campground' },
    { name: 'Makan Up', icon: 'fa-solid fa-utensils' }
  ],
  schedule: {
    dateRange: '20 - 21 Desember 2024',
    duration: '2 Hari, 1 Malam'
  },
  hikingInfo: {
    meetingPoint: 'Basecamp Cibodas',
    meetingTime: '21:00 WIB'
  },
  packages: [
    {
      id: 1,
      title: 'Paket Jalur Cibodas (Santai & Air Terjun)',
      image:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      discountLabel: 'Promo Akhir Tahun',
      warningText: 'Sisa 3 slot kursi lagi untuk keberangkatan minggu ini!',
      tags: [
        'Lewat Telaga Biru',
        'Bonus Air Terjun',
        'Makan 3x di Gunung'
      ],
      originalPrice: 'Rp 450.000',
      currentPrice: 'Rp 395.000',
      priceUnit: 'pax'
    },
    {
      id: 2,
      title: 'Paket Jalur Gunung Putri (Jalur Cepat)',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      discountLabel: null,
      warningText: null,
      tags: [
        'Estimasi 4-5 Jam',
        'Lurus Terjal',
        'Makan 3x di Gunung'
      ],
      originalPrice: null,
      currentPrice: 'Rp 380.000',
      priceUnit: 'pax'
    }
  ],

  mapUrl:
    ' https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15849.079490132217!2d106.98832095541994!3d-6.736896000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69b5ff50dc29bd%3A0x49332042ef4241!2sbase%20camp%20explore%20cibodas%20.base%20camp%20pendakian%20Gunung%20Gede%20Pangrango%20via%20cibodas!5e0!3m2!1sid!2sid!4v1780932021707!5m2!1sid!2sid'
})
</script>