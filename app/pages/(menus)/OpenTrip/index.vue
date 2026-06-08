<template>
  <!-- Header -->
  <MobileHeaderDefault title="Open Trip" backTo="/" />

  <!-- Category Filters -->
  <MobileFilterCategory :listCategory="mountainList" :activeCategory="activeCategory" />

  <!-- Trip List -->
  <div class="px-5 flex flex-col gap-4 mt-2">
    <!-- Filter by Category -->
    <div v-for="trip in tripList" :key="trip.id" class="bg-white rounded-2xl p-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
      <!-- Image Gallery -->
      <div class="flex gap-1 h-36 mb-3 rounded-xl overflow-hidden relative">
        <div v-if="trip.discount" class="absolute top-2 left-2 bg-[#C62828] text-white text-[10px] font-bold px-2 py-0.5 rounded z-10 shadow-sm">
          {{ trip.discount }}
        </div>
        
        <div class="w-2/3 h-full bg-gray-200 relative group cursor-pointer">
          <NuxtImg :src="trip.photos[0]" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Foto Utama trip" format="webp" loading="lazy" />
        </div>
        
        <div class="w-1/3 h-full flex flex-col gap-1 cursor-pointer">
          <div class="h-1/2 bg-gray-200 relative group overflow-hidden">
            <NuxtImg :src="trip.photos[1]" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Foto Tambahan 1" format="webp" loading="lazy" />
          </div>
          <div class="h-1/2 bg-gray-200 relative group overflow-hidden">
            <NuxtImg :src="trip.photos[2]" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Foto Tambahan 2" format="webp" loading="lazy" />
            <div v-if="trip.remainingPhotos > 0" class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-bold backdrop-blur-[1px]">
              +{{ trip.remainingPhotos }}
            </div>
          </div>
        </div>
      </div>
      <!-- Info trip -->
      <div class="flex justify-between items-start mb-2.5 mt-1">
        <div>
          <h2 class="font-bold text-gray-800 text-[15px] leading-tight">{{ trip.title }}</h2>
          <!-- dateRange -->
          <p class="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
            <i class="fa-solid fa-calendar-days text-gray-400"></i> {{ trip.dateRange }}
          </p>
          <p class="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
            <i class="fa-solid fa-location-dot text-gray-400"></i> {{ trip.location }}
          </p>
          <p class="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
            <i class="fa-solid fa-door-open text-gray-400"></i> Meeting Point: {{ trip.meetingPoint }}
          </p>
        </div>
        <div class="bg-orange-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-800 flex items-center gap-1 border border-orange-100/50">
          <i class="fa-solid fa-star text-[#F58220]"></i> {{ trip.rating.toFixed(1) }}
        </div>
      </div>
      <!-- Layanan -->
      <div class="flex flex-wrap gap-1.5 mb-4">
        <div v-for="service in trip.services" :key="service.name" 
              class="bg-[#F7F8FA] border border-gray-100 px-2.5 py-1.5 rounded-[6px] text-[10px] font-medium text-gray-600 flex items-center gap-1.5">
          <i :class="[service.icon, 'text-[#145C34] text-[11px]']"></i> {{ service.name }}
        </div>
      </div>
      <!-- Harga dan Tombol Pilih -->
      <div class="flex justify-between items-end border-t border-gray-100 border-dashed pt-3.5">
        <div>
          <p v-if="trip.strikethroughPrice" class="text-[10px] text-gray-400 line-through mb-0.5">{{ trip.strikethroughPrice }}</p>
          <p class="text-[15px] font-extrabold text-[#145C34] leading-none">
            {{ trip.currentPrice }} <span class="text-[10px] font-medium text-gray-500">/ hari</span>
          </p>
        </div>
        <button @click="() => $router.push(`/opentrip/${trip.id}`)" class="bg-[#F58220] text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition shadow-[0_2px_8px_-2px_rgba(245,130,32,0.5)]">
          Pilih
        </button>
      </div>
    </div>
  </div>
  
  <!-- Filter and Sort -->
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
    <div class="bg-white rounded-full shadow-[0_8px_20px_-4px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center px-5 py-3 gap-5">
      <button class="flex items-center gap-2.5 text-xs font-bold text-gray-700 hover:text-[#145C34] transition relative pr-1">
        <i class="fa-solid fa-bars-staggered"></i> Urutkan
        <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
      <div class="w-px h-5 bg-gray-200"></div>
      <button class="flex items-center gap-2.5 text-xs font-bold text-gray-700 hover:text-[#145C34] transition relative pr-1">
        <i class="fa-solid fa-sliders"></i> Filter
        <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </div>
  </div>
</template>

<script setup>

const mountainList = ['Semua Gunung', 'Gunung Rinjani', 'Gunung Semeru',   'Gunung Prau']
const activeCategory = ref('Semua Gunung')


// Data List trip Mockup
const tripList = [
  {
    id: 1,
    title: 'Open Trip Gunung Gede Pangrango 2H1M',
    location: 'Bogor, Jawa Barat',
    meetingPoint: 'Basecamp Cibodas',
    dateRange: '20 - 25 Des 2024',
    rating: 5.0,
    discount: '15% OFF',
    photos: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
    ],
    remainingPhotos: 5,
    services: [
      { name: 'Transportasi PP', icon: 'fa-solid fa-van-shuttle' },
      { name: 'Tiket & Simaksi', icon: 'fa-solid fa-ticket' },
      { name: 'Tenda Kapasitas 4', icon: 'fa-solid fa-campground' },
      { name: 'Makan 3x', icon: 'fa-solid fa-utensils' },
      { name: 'Guide & trip Tim', icon: 'fa-solid fa-person-hiking' },
      { name: 'Dokumentasi', icon: 'fa-solid fa-camera' }
    ],
    strikethroughPrice: 'Rp 300.000',
    currentPrice: 'Rp 250.000'
  },
  {
    id: 2,
    title: 'Open Trip Gunung Semeru 2H1M',
    location: 'Lumajang, Jawa Timur',
    meetingPoint: 'Basecamp Sembalun',
    dateRange: '22 - 28 Des 2024',
    rating: 4.8,
    discount: null,
    photos: [
      'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=800&q=80'
    ],
    remainingPhotos: 0,
    services: [
      { name: 'Jeep PP', icon: 'fa-solid fa-truck-monster' }, // Semeru khas dengan Jeep
      { name: 'Tiket & Simaksi', icon: 'fa-solid fa-ticket' },
      { name: 'Tenda Group', icon: 'fa-solid fa-campground' },
      { name: 'Tour Leader', icon: 'fa-solid fa-flag' },
      { name: 'P3K Standard', icon: 'fa-solid fa-briefcase-medical' }
    ],
    strikethroughPrice: null,
    currentPrice: 'Rp 280.000'
  }
]
</script>