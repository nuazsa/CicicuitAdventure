<template>
  <MobileCardBase class="bg-white p-4">
    <!-- Header (Klik untuk pindah halaman) -->
    <div 
      @click="goToReviews"
      class="flex items-center justify-between border-b border-gray-50 pb-3 cursor-pointer group"
      :class="{ 'mb-3': topReview }"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-[#145C34] text-white rounded-full flex items-center justify-center font-bold text-lg">
          {{ score || 0 }}
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-800">
            {{ category || 'Belum ada ulasan' }}
          </h3>
          <p class="text-[11px] text-gray-500">
            {{ reviewCount || 0 }} ulasan pendaki
          </p>
        </div>
      </div>
      <i class="fa-solid fa-chevron-right text-gray-400 group-hover:text-gray-600 transition text-sm"></i>
    </div>
    
    <!-- Top Review Section (Hanya tampil jika ada review) -->
    <div v-if="topReview" class="flex items-start gap-3">
      <!-- Inisial Nama -->
      <div
        class="w-8 h-8 bg-[#F58220] text-white rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 mt-1">
        {{ topReview.initial || 'A' }}
      </div>
      
      <div>
        <h4 class="text-[12px] font-bold text-gray-800 mb-0.5">
          {{ topReview.name || 'Anonim' }}
        </h4>
        
        <!-- Bintang Rating -->
        <div class="flex text-[#F58220] text-[10px] gap-0.5 mb-1">
          <template v-for="i in 5" :key="i">
            <i v-if="topReview.rating >= i" class="fa-solid fa-star"></i>
            <i v-else-if="topReview.rating >= i - 0.5" class="fa-solid fa-star-half-stroke"></i>
            <i v-else class="fa-regular fa-star text-gray-300"></i>
          </template>
        </div>

        <!-- Teks Review -->
        <p class="text-[12px] text-gray-700 italic leading-snug">
          "{{ topReview.review_text || 'Belum ada ulasan' }}"
        </p>
      </div>
    </div>
  </MobileCardBase>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  slug: {
    type: String,
    required: true
  },
  score: {
    type: [Number, String], // Terima string juga karena API mengirim angka kadang dalam bentuk string
    default: 0
  },
  category: {
    type: String,
    default: 'Belum dinilai'
  },
  reviewCount: {
    type: [Number, String], // Di API mu, ini dikembalikan sebagai string ("2")
    default: 0
  },
  topReview: {
    type: Object,
    default: () => null // Set null sebagai default jika belum ada review
  }
})

const goToReviews = () => {
  console.log('Navigating to reviews for slug:', props.slug)
  if (props.slug) {
    router.push(`/open-trip/${props.slug}/reviews`)
  }
}
</script>