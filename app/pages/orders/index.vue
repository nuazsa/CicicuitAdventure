<template>
  <!-- Header -->
  <MobileHeaderDefault title="Pesanan Saya" />

  <div class="sticky top-[64px] z-30 bg-white flex border-b border-gray-200 shadow-sm">
    <button 
      v-for="tab in tabs" 
      :key="tab"
      @click="activeTab = tab"
      class="flex-1 py-3.5 text-sm font-bold transition-all border-b-2"
      :class="activeTab === tab ? 'text-[#145C34] border-[#145C34]' : 'text-gray-500 border-transparent hover:text-gray-700'"
    >
      {{ tab }}
    </button>
  </div>

  <div class="p-5 flex flex-col gap-4">
    
    <div v-for="order in filteredOrders" :key="order.id" class="bg-white rounded-2xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-50">
      
      <div class="flex gap-4">
        <NuxtImg 
          :src="order.image" 
          :alt="order.title" 
          class="w-20 h-20 rounded-xl object-cover border border-gray-100" 
          format="webp"
          loading="lazy"
        />
        
        <div class="flex flex-col justify-center">
          <h3 class="font-bold text-gray-800 text-[14px] leading-tight">{{ order.title }}</h3>
          <p class="text-[11px] text-gray-500 flex items-center gap-1.5 mt-1.5 font-medium">
            <i class="fa-regular fa-calendar"></i> {{ order.date }}
          </p>
          <div class="bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold px-2 py-1 rounded w-max mt-2 flex items-center gap-1">
            <i class="fa-solid fa-circle-exclamation text-[10px]"></i> {{ order.status }}
          </div>
        </div>
      </div>

      <div class="border-t border-gray-100 my-4"></div>

      <div class="flex justify-between items-end mb-4">
        <div>
          <p class="text-[11px] text-gray-500 font-medium">Total Bayar</p>
          <p class="text-lg font-extrabold text-[#114226] leading-none mt-1">{{ order.total }}</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] text-[#D32F2F] font-medium">Bayar Sebelum</p>
          <p class="text-sm font-bold text-[#D32F2F] leading-none mt-1 font-mono tracking-wide">{{ order.countdown }}</p>
        </div>
      </div>

      <button class="w-full bg-[#145C34] hover:bg-[#0B4D26] text-white py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
        Bayar Sekarang
      </button>
    </div>

  </div>

  <div class="mx-5 mb-8 bg-gray-100 border border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center text-center">
    <div class="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-500 mb-3 bg-white">
      <i class="fa-solid fa-info text-lg"></i>
    </div>
    <p class="text-xs text-gray-600 font-medium leading-relaxed max-w-[250px]">
      Ingin melihat petualangan yang sudah selesai? Cek tab <span class="font-bold text-gray-800">Riwayat</span>.
    </p>
  </div>

  <!-- Bottom Navigation -->
  <MobileNavigationBottom  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// State untuk Tabs
const tabs = ['Belum Bayar', 'Aktif', 'Riwayat']
const activeTab = ref('Belum Bayar')

// Data Dummy Pesanan
const orders = [
  {
    id: 1,
    title: 'Open Trip Rinjani (3H2M)',
    date: '25 May 2026',
    status: 'MENUNGGU PEMBAYARAN',
    total: 'Rp 1.500.000',
    countdown: '23:53:11',
    tab: 'Belum Bayar',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 2,
    title: 'Private Trip Semeru',
    date: '12 June 2026',
    status: 'MENUNGGU PEMBAYARAN',
    total: 'Rp 4.750.000',
    countdown: '12:09:04',
    tab: 'Belum Bayar',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=200&h=200'
  }
]

// Computed property untuk memfilter daftar pesanan berdasarkan tab yang aktif
const filteredOrders = computed(() => {
  return orders.filter(order => order.tab === activeTab.value)
})
</script>