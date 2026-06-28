<template>
  <MobileHeaderInBanner :title="tripDetail?.title" backTo="/opentrip" />

  <div class="relative h-[320px] w-full">
    <NuxtImg 
      :src="tripDetail?.photos?.[0] || 'https://placehold.co/600x400/e2e8f0/64748b?text=Foto+Utama'" 
      :alt="tripDetail?.title" 
      class="w-full h-full object-cover" 
      format="webp"
      preload
    />
    
    <div class="absolute bottom-10 right-5 z-10">
      <button @click="isGalleryOpen = true" class="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-sm hover:bg-white transition active:scale-95">
        <i class="fa-regular fa-images"></i> Lihat Semua Foto
      </button>
    </div>
  </div>

  <div class="bg-[#F9FAFB] rounded-t-[2rem] -mt-6 relative z-20 px-5 pt-6 flex flex-col gap-6">
    <div>
      <h1 class="text-[22px] font-bold text-gray-900 leading-tight mb-2">{{ tripDetail?.title }}</h1>
      <p class="text-[13px] text-gray-600 flex items-center gap-2">
        <i class="fa-solid fa-location-dot text-[#145C34]"></i> {{ tripDetail?.location }}
      </p>
    </div>

    <MobileCardRanting
      :score="tripDetail?.rating?.score" 
      :category="tripDetail?.rating?.category" 
      :reviewCount="tripDetail?.rating?.reviewCount" 
      :topReview="tripDetail?.rating?.topReview"
    />

    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-[15px] font-bold text-gray-800">Fasilitas Open Trip</h2>
        <button class="text-[#145C34] text-[11px] font-bold hover:underline">Lihat Semua</button>
      </div>
      <div class="flex justify-between px-2">
        <div v-for="facility in tripDetail?.facilities" :key="facility.name" class="flex flex-col items-center gap-2">
          <div class="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center text-[#145C34]">
            {{ facility.icon }}
          </div>
          <span class="text-[10px] font-medium text-gray-600">{{ facility.name }}</span>
        </div>
      </div>
    </div>

    <MobileCardSchedule
      v-model="participantCount"
      :isStatic="isOpenTrip"
      :staticDateRange="tripDetail?.schedule?.dateRange"
      :staticDuration="tripDetail?.schedule?.duration"
      :counterLabel="isOpenTrip ? 'Jumlah Pax' : 'Jumlah Porter'"
      :counterSubLabel="isOpenTrip ? '(Tentukan jumlah peserta yang ikut)' : '(Saran: 1 porter / 20kg logistik)'"
      @dateSelected="handleDynamicDateSelection"
    />

    <MobileCardInformation 
      :meetingPoint="tripDetail?.hikingInfo?.meetingPoint" 
      :meetingTime="tripDetail?.hikingInfo?.meetingTime"
    />

    <div class="flex flex-col gap-5">
      <h2 class="text-[15px] font-bold text-gray-800 -mb-1">Pilihan Paket Rute</h2>
      
      <div v-for="pkg in tripDetail?.packages" :key="pkg.id" class="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
        <div class="relative h-36 w-full">
          <NuxtImg 
            :src="pkg.image" 
            :alt="pkg.title" 
            class="w-full h-full object-cover"
            format="webp"
            loading="lazy"
          />
          <div v-if="pkg.discountLabel" class="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm" :style="{ backgroundColor: pkg.badgeColor }">
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

    <MobileCardMeetingPoint :mapUrl="tripDetail?.mapUrl" />
  </div>

  <MobileGalleryModal 
      :isOpen="isGalleryOpen" 
      :photos="tripDetail?.photos" 
      title="Galeri Open Trip"
      @close="isGalleryOpen = false" 
    />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const uuid = route.params.uuid || route.params.id

const isOpenTrip = ref(true) 
const participantCount = ref(1)
const isGalleryOpen = ref(false)

const { data, pending, error } = await useFetch(`/services/explore/${uuid}`, {
  baseURL: config.public.apiBase,
})
const tripDetail = computed(() => data.value?.data || null)


const handleDynamicDateSelection = (selectedDates) => {
  console.log('User memilih tanggal:', selectedDates)
  // Anda bisa simpan ini di state Pinia atau diteruskan ke halaman checkout nanti
}
</script>