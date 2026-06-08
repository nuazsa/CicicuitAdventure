<template>
  <!-- Header -->
  <MobileHeaderDefault title="Promo Menarik" />
  
  <!-- Category Filters -->
  <MobileFilterCategory :listCategory="categories" :activeCategory="activeCategory" />

  <!-- Display Promos -->
  <div class="px-5 flex flex-col gap-5 mt-2">
    <!-- Promo Cards -->
    <div v-for="promo in promos" :key="promo.id" @click="handlePromoClick(promo)" class="relative w-full h-[220px] rounded-3xl overflow-hidden shadow-md group cursor-pointer">
      <NuxtImg 
        :src="promo.image" 
        :alt="promo.title" 
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
        format="webp"
        loading="lazy"
      />
      
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"></div>
      
      <div class="absolute inset-0 p-5 flex flex-col justify-between">
        <div class="self-start bg-[#F57C00] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
          {{ promo.badge }}
        </div>
        
        <div class="mt-auto">
          <h2 class="text-white text-lg font-extrabold leading-tight tracking-wide">{{ promo.title }}</h2>
          <p class="text-gray-300 text-[11px] mt-1 font-medium">{{ promo.expiry }}</p>
          
          <div class="flex justify-between items-end mt-4">
            <div class="bg-black/40 backdrop-blur-sm border border-white/20 text-white font-mono text-xs font-bold px-4 py-2 rounded-lg tracking-widest uppercase">
              {{ promo.code }}
            </div>
            
            <button class="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-2 rounded-xl text-sm font-bold transition shadow-lg">
              Gunakan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Navigation -->
  <MobileNavigationBottom />
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

// State untuk Kategori Aktif
const categories = ['Semua', 'Porter', 'Guide',   'Open Trip', 'Private Trip']
const activeCategory = ref('Semua')

const handlePromoClick = (promo) => {
  // Navigasi ke halaman detail promo dengan SID
  router.push(`/promotions/${promo.id}`)
}

// Data Dummy Promo (Gambar menggunakan Unsplash)
const promos = [
  {
    id: 1,
    badge: 'Diskon 20%',
    title: 'Hemat Akhir Pekan di Rinjani',
    expiry: 'Berlaku hingga 30 Mei 2026',
    code: 'RINJANI20',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 2,
    badge: 'Cashback Rp 50rb',
    title: 'Bonus Porter Gunung Gede',
    expiry: 'Berlaku hingga 15 Juni 2026',
    code: 'PORTER50K',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: 3,
    badge: 'Diskon 15%',
    title: 'Trip Kelompok Semeru',
    expiry: 'Berlaku hingga 10 Juli 2026',
    code: 'MAHAMERU15',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600&h=400'
  }
]
</script>