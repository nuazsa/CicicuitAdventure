<template>
  <MobileHeaderDefault
    title="Ulasan Perjalanan" 
    backTo="" 
    hideSearch
  />

  <!-- Rating Summary (KPI) -->
  <div class="bg-white p-5 mb-2 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-6">
    <div class="flex flex-col items-center">
      <span class="text-4xl font-extrabold text-gray-900">{{ averageRating }}</span>
      <div class="flex text-[#F59E0B] text-xs my-1 gap-0.5">
        <i v-for="n in 5" :key="n" class="fa-solid fa-star" :class="n <= Math.round(averageRating) ? 'text-[#F59E0B]' : 'text-gray-200'"></i>
      </div>
      <span class="text-[11px] text-gray-500">{{ totalReviews }} ulasan</span>
    </div>

    <!-- Rating Bars -->
    <div class="flex-1 flex flex-col gap-1.5">
      <div v-for="star in [5,4,3,2,1]" :key="star" class="flex items-center gap-2">
        <span class="text-[11px] font-medium text-gray-600 w-2">{{ star }}</span>
        <i class="fa-solid fa-star text-[#F59E0B] text-[10px]"></i>
        <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            class="h-full bg-[#F59E0B] rounded-full transition-all duration-500" 
            :style="{ width: `${getPercentage(star)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Filter Pills -->
  <div class="bg-white px-5 py-3 border-b border-gray-100 overflow-x-auto hide-scrollbar">
    <div class="flex gap-2 w-max">
      <button 
        v-for="filter in filters" 
        :key="filter.id"
        @click="changeFilter(filter.id)"
        class="px-4 py-1.5 rounded-full text-[12px] font-medium border transition-colors duration-200"
        :class="activeFilter === filter.id 
          ? 'bg-[#145C34] border-[#145C34] text-white' 
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
      >
        {{ filter.label }}
      </button>
    </div>
  </div>

  <!-- Reviews List -->
  <div class="px-5 py-2 relative min-h-[300px]">
    
    <!-- Loading State Halaman 1 -->
    <div v-if="pending && page === 1" class="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex justify-center pt-10">
      <i class="fa-solid fa-spinner fa-spin text-[#145C34] text-2xl"></i>
    </div>

    <!-- Empty State -->
    <div v-if="!pending && reviewsList.length === 0" class="py-10 text-center">
      <i class="fa-regular fa-comment-dots text-4xl text-gray-300 mb-3 block"></i>
      <p class="text-[13px] text-gray-500">Belum ada ulasan untuk filter ini.</p>
    </div>

    <!-- Review Items -->
    <div 
      v-for="(review, index) in reviewsList" 
      :key="index"
      class="py-5 border-b border-gray-100 last:border-0"
    >
      <div class="flex justify-between items-start mb-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#145C34] flex items-center justify-center font-bold text-[14px]">
            {{ review.fullname ? review.fullname.charAt(0).toUpperCase() : 'U' }}
          </div>
          
          <div>
            <div class="flex items-center gap-1.5">
              <p class="text-[13px] font-bold text-gray-800">{{ review.fullname || 'Anonim' }}</p>
              <i v-if="review.is_verified === '1'" class="fa-solid fa-circle-check text-blue-500 text-[11px]" title="Terverifikasi"></i>
            </div>
            <p class="text-[10px] text-gray-400 mt-0.5">{{ formatDate(review.created_at) }}</p>
          </div>
        </div>
        
        <div class="flex text-[#F59E0B] text-[10px] gap-0.5">
          <i v-for="n in review.rating" :key="n" class="fa-solid fa-star"></i>
        </div>
      </div>

      <div v-if="review.package_title" class="bg-gray-50 px-2 py-1 rounded w-max mb-2 border border-gray-100">
        <p class="text-[10px] text-gray-500 font-medium">
          <i class="fa-solid fa-box-open mr-1"></i> {{ review.package_title }}
        </p>
      </div>

      <p class="text-[13px] text-gray-600 leading-relaxed">
        {{ review.review_text }}
      </p>
    </div>
    
    <!-- Infinite Scroll Sentinel & Loading Indicator -->
    <div ref="observerTarget" class="py-6 text-center h-10">
      <div v-if="pending && page > 1" class="text-[12px] font-bold text-[#145C34]">
        <i class="fa-solid fa-spinner fa-spin mr-1"></i> Memuat...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch, useRuntimeConfig, useCookie } from '#imports'
import authCustomer from '~/middleware/auth-customer'

definePageMeta({ 
  middleware: authCustomer 
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const authCookie = useCookie('access_token')

const slug = route.params.slug

// States
const activeFilter = ref('')
const page = ref(1)
const reviewsList = ref([])
const observerTarget = ref(null) // Referensi elemen untuk trigger scroll bawah
let observer = null

// Filters Setup
const filters = ref([
  { id: '', label: 'Semua' },
  { id: '5', label: '5 Bintang' },
  { id: '4', label: '4 Bintang' },
  { id: '3', label: '3 Bintang' },
  { id: '2', label: '2 Bintang' },
  { id: '1', label: '1 Bintang' },
])

const changeFilter = (filterId) => {
  activeFilter.value = filterId
  page.value = 1
}

// Computed Query Parameters
const queryParams = computed(() => {
  const params = {
    page: page.value,
    limit: 20
  }
  if (activeFilter.value) {
    params.rating = activeFilter.value
  }
  return params
})

// Fetch Data
const { data: apiResponse, pending } = await useFetch(`${config.public.apiBaseUrl}/review/service/${slug}`, {
  headers: { 'Authorization': `Bearer ${authCookie.value}` },
  query: queryParams,
  watch: [queryParams]
})

// Watch response API untuk menangani append data
watch(apiResponse, (newVal) => {
  if (newVal?.reviews) {
    if (page.value === 1) {
      reviewsList.value = newVal.reviews 
    } else {
      reviewsList.value = [...reviewsList.value, ...newVal.reviews] 
    }
  }
}, { immediate: true })

// Data Mappings
const kpi = computed(() => apiResponse.value?.kpi || {})
const meta = computed(() => apiResponse.value?.meta || {})

const averageRating = computed(() => parseFloat(kpi.value.average_rating || 0).toFixed(1))
const totalReviews = computed(() => parseInt(kpi.value.total_review || 0))

const getPercentage = (star) => {
  if (totalReviews.value === 0) return 0
  const count = parseInt(kpi.value[`rating_${star}`] || 0)
  return (count / totalReviews.value) * 100
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('id-ID', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).format(date)
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>