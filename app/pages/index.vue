<template>
  <!-- Header -->
  <div class="bg-[#145C34] pt-5 pb-2 px-5 rounded-none">
    <div class="flex justify-between items-center">
      <!-- Logo -->
      <h1 class="text-white text-xl font-bold tracking-wide">Cicitcuit Adventure</h1>

      <!-- Notification Button -->
      <button
        class="bg-white/20 w-9 h-9 rounded-full text-white backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition">
        <i class="fa-regular fa-bell"></i>
      </button>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="sticky top-0 z-40 bg-[#FAFAFA]">

    <!-- Search Input -->
    <div class="bg-[#145C34] pt-4 pb-12 px-5 rounded-b-[2rem] relative">
      <div class="relative shadow-sm  rounded-full">
        <i
          class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm z-10"></i>
        <input type="text" placeholder="Mau muncak kemana?"
          class="w-full bg-white pl-11 pr-4 py-3.5 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 relative z-0" />
      </div>
    </div>

    <!-- Promo Banner -->
    <div class="px-5 -mt-8 relative z-10 pb-0 border-b border-gray-100/50 shadow-[0_5px_10px_-5px_rgba(0,0,0,0.02)]">

      <!-- Kondisi 1: Banner Pendaftaran (Tampil jika BELUM daftar) -->
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
        <!-- Tambahkan event @click di sini -->
        <button @click="handleRegister"
          class="bg-[#145C34] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-800 transition">
          Daftar
        </button>
      </div>

      <!-- Kondisi 2: Banner Poin (Tampil jika SUDAH daftar) -->
      <div v-else
        class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-between items-center transition-all">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#145C34]">
            <i class="fa-solid fa-coins text-lg"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">Cicitcuit Points</h3>
            <p class="text-[11px] text-gray-500">12.500 <span
                class="text-[10px] font-normal text-gray-400">Poin</span></p>
          </div>
        </div>
        <button
          class="bg-[#145C34] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-800 transition">
          Tukar Poin
        </button>
      </div>
    </div>
  </div>

  <!-- Navigation Menu -->
  <div class="grid grid-cols-4 gap-4 px-5 mt-4">
    <div v-for="menu in menus" :key="menu.title" @click="() => $router.push(menu.path)" class="flex flex-col items-center gap-2 cursor-pointer group">
      <div
        class="w-14 h-14 bg-gray-200/80 rounded-full flex items-center justify-center text-[#145C34] group-hover:bg-gray-200 transition">
        <i :class="menu.icon" class="text-lg"></i>
      </div>
      <span class="text-[11px] font-medium text-gray-700 text-center leading-tight">{{ menu.title }}</span>
    </div>
  </div>

  <!-- Promo Section -->
  <div class="mt-8">
    <h2 class="text-base font-bold text-gray-800 mb-4 px-5 flex items-center gap-2">
      <span><i class="fa-solid fa-fire text-[#C62828]"></i></span> Promo yang wajib dicek!
    </h2>
    <div ref="promoContainer" @mousedown="onMouseDown($event, $refs.promoContainer)" @mouseleave="onMouseLeave"
      @mouseup="onMouseUp" @mousemove="onMouseMove($event, $refs.promoContainer)"
      class="flex overflow-x-auto gap-4 px-5 pb-4 snap-x scrollbar-hide cursor-grab active:cursor-grabbing">
      <div
        class="min-w-[260px] bg-gradient-to-br from-[#388E3C] to-[#81C784] rounded-2xl p-5 text-white snap-center relative overflow-hidden">
        <h3 class="text-xl font-bold mb-2 leading-tight">Diskon 50%<br />Open Trip<br />Merbabu</h3>
        <button
          class="bg-white text-[#388E3C] px-3 py-1.5 rounded-md text-xs font-bold mt-2 hover:bg-gray-50 transition">
          Klaim Sekarang
        </button>
      </div>
      <div
        class="min-w-[260px] bg-gradient-to-br from-orange-400 to-orange-300 rounded-2xl p-5 text-white snap-center">
        <h3 class="text-xl font-bold mb-2 leading-tight">Cashback<br />Porter 20%</h3>
        <button class="bg-[#5c310c] text-white px-3 py-1.5 rounded-md text-xs font-bold mt-2">
          Berakhir besok
        </button>
      </div>
    </div>
  </div>

  <!-- Rekomendasi Trip & Layanan -->
  <div class="mt-4 pb-8">
    <h2 class="text-base font-bold text-gray-800 mb-4 px-5 flex items-center gap-2">
      <span>
        <i class="fa-solid fa-mountain text-[#145C34]"></i>
      </span>
      Rekomendasi Trip & Layanan
    </h2>

    <div ref="layananContainer" @mousedown="onMouseDown($event, $refs.layananContainer)" @mouseleave="onMouseLeave"
      @mouseup="onMouseUp" @mousemove="onMouseMove($event, $refs.layananContainer)"
      class="flex overflow-x-auto overflow-y-hidden gap-4 px-5 scrollbar-hide pb-2 cursor-grab active:cursor-grabbing">

      <!-- Recommendation Cards -->
      <div v-for="rec in Recomendations" :key="rec.title"
        class="min-w-[180px] bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group hover:shadow-md transition">
        <div class="relative">
          <NuxtImg 
            :src="rec.image" 
            :alt="rec.title"
            sizes="sm:100vw md:50vw lg:300px"
            loading="lazy"
            class="w-full h-32 object-cover group-hover:scale-105 transition duration-300" 
          />
          <div class="absolute top-2 right-2 bg-[#C62828] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {{ rec.discount ? `${rec.discount}% OFF` : '' }}
          </div>
        </div>

        <div class="p-3">
          <h3 class="font-bold text-sm text-gray-800">
            {{ rec.title }}
          </h3>

          <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <i class="fa-solid fa-star text-gray-600 text-[10px]"></i>
            {{ rec.rating }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Navigation -->
  <MobileNavigationBottom  />
</template>

<script setup>
// --- Data & State ---
const isRegistered = ref(false)

// Data Menu Kategori 
const menus = [
  { title: 'Porter', icon: 'fa-solid fa-person-hiking', path: '/porter' },
  { title: 'Guide', icon: 'fa-regular fa-compass', path: '/guide' },
  { title: 'Open Trip', icon: 'fa-solid fa-users', path: '/open-trip' },
  { title: 'Private Trip', icon: 'fa-solid fa-van-shuttle', path: '/private-trip' }
]

// Data Rekomendasi Trip & Layanan
const Recomendations = [
  {
    title: 'Paket Rinjani',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=400&h=300',
    discount: 20
  },
  {
    title: 'Semeru Trek',
    rating: 4.9,
    image: 'https://plus.unsplash.com/premium_photo-1663013560294-9862ed4d1554?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    discount: 15
  },
  {
    title: 'Open Trip Merbabu',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400&h=300',
    discount: null
  }
]

// --- Fungsi Drag to Scroll ---
const isDown = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const onMouseDown = (e, containerRef) => {
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
  if (!isDown.value) return
  e.preventDefault()
  const x = e.pageX - containerRef.offsetLeft
  const walk = (x - startX.value)
  containerRef.scrollLeft = scrollLeft.value - walk
}
</script>