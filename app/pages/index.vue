<template>
  <div class="bg-[#145C34] pt-5 pb-2 px-5 rounded-none">
    <div class="flex justify-between items-center">
      <div class="flex items-baseline gap-1.5">
        <h1 class="text-white text-xl font-bold tracking-wide">Cicicuit Adventure</h1>
        <span class="text-[8px] text-red-800 font-bold tracking-widest bg-white/20 px-1.5 py-0.5 rounded-full">
          BETA Version
        </span>
      </div>

      <button
        class="bg-white/20 w-9 h-9 rounded-full text-white backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition">
        <i class="fa-regular fa-bell"></i>
      </button>
    </div>
  </div>

  <div class="sticky top-0 z-40 bg-[#FAFAFA]">

    <div class="bg-[#145C34] pt-4 pb-12 px-5 rounded-b-[2rem] relative">
      <div class="relative shadow-sm rounded-full">
        <i
          class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm z-10"></i>
        <input type="text" placeholder="Mau muncak kemana?"
          class="w-full bg-white pl-11 pr-4 py-3.5 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 relative z-0" />
      </div>
    </div>

    <div class="px-5 -mt-8 relative z-10 pb-0 border-b border-gray-100/50 shadow-[0_5px_10px_-5px_rgba(0,0,0,0.02)]">

      <div v-if="!isRegistered"
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center transition-all">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#145C34]">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">Bonus Daftar!</h3>
            <p class="text-[11px] text-gray-500">Dapatkan diskon trip perdana</p>
          </div>
        </div>
        <button @click="$router.push('/auth/signup')"
          class="bg-[#145C34] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-800 transition">
          Daftar
        </button>
      </div>

      <div v-else
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center transition-all">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#145C34]">
            <i class="fa-solid fa-coins text-lg"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">Cicicuit Points</h3>
            <p class="text-[11px] text-gray-500">
              {{ formatNumber(dashboardData?.points?.balance || 0) }} 
              <span class="text-[10px] font-normal text-gray-400">Poin</span>
            </p>
          </div>
        </div>
        <button @click="$router.push('/profile/points')"
          class="bg-[#145C34] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-800 transition">
          Detail Poin
        </button>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-4 gap-4 px-5 mt-4">
    <div 
      v-for="menu in menus" 
      :key="menu.title" 
      @click="menu.isLocked ? null : $router.push(menu.path)" 
      class="flex flex-col items-center gap-2 group"
      :class="menu.isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'"
    >
      <div
        class="w-14 h-14 rounded-full flex items-center justify-center transition"
        :class="menu.isLocked ? 'bg-gray-100 text-gray-400' : 'bg-gray-200/80 text-[#145C34] group-hover:bg-gray-200'"
      >
        <!-- Ubah icon jika isLocked true -->
        <i :class="menu.isLocked ? 'fa-solid fa-lock' : menu.icon" class="text-lg"></i>
      </div>
      
      <!-- Sesuaikan warna teks -->
      <span 
        class="text-[11px] font-medium text-center leading-tight"
        :class="menu.isLocked ? 'text-gray-400' : 'text-gray-700'"
      >
        {{ menu.title }}
      </span>
    </div>
  </div>

  <div class="mt-8" v-if="dashboardData?.promos?.length > 0">
    <h2 class="text-base font-bold text-gray-800 mb-4 px-5 flex items-center gap-2">
      <span><i class="fa-solid fa-fire text-[#C62828]"></i></span> Promo yang wajib dicek!
    </h2>
    <div ref="promoContainer" @mousedown="onMouseDown($event, $refs.promoContainer)" @mouseleave="onMouseLeave"
      @mouseup="onMouseUp" @mousemove="onMouseMove($event, $refs.promoContainer)"
      class="flex overflow-x-auto gap-4 px-5 pb-4 snap-x scrollbar-hide cursor-grab active:cursor-grabbing">
      
      <div v-for="promo in dashboardData.promos" :key="promo.uuid" @click="$router.push(promo.link_url)"
        class="min-w-[260px] h-[150px] rounded-2xl text-white snap-center relative overflow-hidden group">
        
        <NuxtImg 
          :src="promo.image_url" 
          :alt="promo.title || 'Promo Banner'" 
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
          format="webp"
          loading="lazy"
        />
        
        <div v-if="promo.title" class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
        
        <div v-if="promo.title" class="relative z-10 flex flex-col justify-end h-full p-5">
          <h3 class="text-base font-bold leading-tight line-clamp-2">
            {{ promo.title }}
          </h3>
        </div>
      </div>

    </div>
  </div>

  <div class="mt-4 pb-8" v-if="dashboardData?.recommendations?.length > 0">
    <h2 class="text-base font-bold text-gray-800 mb-4 px-5 flex items-center gap-2">
      <span>
        <i class="fa-solid fa-mountain text-[#145C34]"></i>
      </span>
      Rekomendasi Trip & Layanan
    </h2>

    <div ref="layananContainer" @mousedown="onMouseDown($event, $refs.layananContainer)" @mouseleave="onMouseLeave"
      @mouseup="onMouseUp" @mousemove="onMouseMove($event, $refs.layananContainer)"
      class="flex overflow-x-auto overflow-y-hidden gap-4 px-5 scrollbar-hide pb-2 cursor-grab active:cursor-grabbing">

      <div v-for="rec in dashboardData.recommendations" :key="rec.service_id" @click="$router.push(rec.service_url)"
        class="min-w-[180px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group hover:shadow-md transition">
        <div class="relative">
          <NuxtImg 
            :src="rec.image_url" 
            :alt="rec.service_name"
            sizes="sm:100vw md:50vw lg:300px"
            loading="lazy"
            class="w-full h-32 object-cover group-hover:scale-105 transition duration-300" 
          />
          
          <div v-if="rec.discount_badge" class="absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm" :style="{ backgroundColor: rec.badge_color || '#C62828' }">
            {{ rec.discount_badge }}
          </div>
        </div>

        <div class="p-3">
          <h3 class="font-bold text-sm text-gray-800 line-clamp-2 leading-snug">
            {{ rec.service_name }}
          </h3>

          <div class="flex justify-between items-end mt-2">
            <p class="text-[10px] text-gray-500 line-clamp-1 flex-1 pr-2">
              <i class="fa-solid fa-location-dot text-gray-400"></i> {{ rec.location }}
            </p>
            <p class="text-xs font-bold text-gray-700 flex items-center gap-1 shrink-0">
              <i class="fa-solid fa-star text-yellow-400 text-[10px]"></i>
              {{ rec.rating }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </div>

  <MobileNavigationBottom />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig, useCookie, useFetch } from '#imports'

const router = useRouter()
const config = useRuntimeConfig()

// --- Otentikasi State ---
const authCookie = useCookie('access_token')
const isRegistered = computed(() => !!authCookie.value)

// --- Fetch Data API Dashboard ---
const { data: rawDashboardData, pending } = await useFetch(`${config.public.apiBaseUrl}/dashboard`, {
  headers: {
    ...(authCookie.value && { 'Authorization': `Bearer ${authCookie.value}` }),
    'Accept': 'application/json'
  }
})

const dashboardData = computed(() => rawDashboardData.value?.data || {
  points: { balance: 0 },
  promos: [],
  recommendations: []
})

// --- Data Menu Kategori ---
const menus = [
  { title: 'Porter', icon: 'fa-solid fa-person-hiking', path: '/porter', isLocked: true },
  { title: 'Guide', icon: 'fa-regular fa-compass', path: '/guide', isLocked: true },
  { title: 'Open Trip', icon: 'fa-solid fa-users', path: '/open-trip', isLocked: false },
  { title: 'Private Trip', icon: 'fa-solid fa-van-shuttle', path: '/private-trip', isLocked: true }
]

// --- Utilitas Format Angka ---
const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num || 0)
}

// --- Fungsi Drag to Scroll Horizontal ---
const isDown = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const onMouseDown = (e, containerRef) => {
  if (!containerRef) return
  isDown.value = true
  startX.value = e.pageX - containerRef.offsetLeft
  scrollLeft.value = containerRef.scrollLeft
}

const onMouseLeave = () => {
  isDown.value = false
}

const onMouseUp = () => {
  isDown.value = false
}

const onMouseMove = (e, containerRef) => {
  if (!isDown.value || !containerRef) return
  e.preventDefault()
  const x = e.pageX - containerRef.offsetLeft
  const walk = (x - startX.value)
  containerRef.scrollLeft = scrollLeft.value - walk
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>