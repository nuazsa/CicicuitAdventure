<template>
  <!-- Header -->
  <MobileHeaderDefault title="Metode Pembayaran" backTo="/profile" hideSearch />

  <div class="px-5 pt-5 flex flex-col gap-6">
    
    <!-- Banner Info -->
    <div class="bg-[#E8F5E9] p-4 rounded-2xl flex gap-3 items-start border border-green-100 shadow-sm">
      <div>
        <h3 class="text-xs font-bold text-[#145C34] mb-1">Pembayaran Aman & Otomatis</h3>
        <p class="text-[11px] text-green-800/80 leading-relaxed">
          Semua transaksi dilindungi oleh enkripsi tingkat tinggi. Verifikasi pembayaran akan dilakukan secara otomatis 24/7.
        </p>
      </div>
    </div>

    <!-- Looping Kategori Pembayaran -->
    <div v-for="group in paymentGroups" :key="group.category">
      <div class="flex items-center gap-2 mb-3 pl-1">
        <i :class="group.icon" class="text-gray-400 text-sm"></i>
        <h3 class="text-xs font-extrabold text-gray-500 uppercase tracking-wider">{{ group.category }}</h3>
      </div>
      
      <div class="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div 
          v-for="(item, index) in group.items" 
          :key="item.id" 
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition active:bg-gray-100 group/item"
          :class="{'border-b border-gray-50': index !== group.items.length - 1}"
        >
          <div class="flex items-center gap-3.5">
            <!-- Box Logo Bank/Pembayaran -->
            <div class="w-14 h-9 bg-white rounded-md flex items-center justify-center border border-gray-100 shadow-sm px-1.5 py-1 shrink-0">
              <NuxtImg 
                :src="item.logo" 
                :alt="'Logo ' + item.name" 
                class="w-full h-full object-contain"
                loading="lazy"
                format="webp"
              />
            </div>
            
            <!-- Nama Metode Pembayaran -->
            <span class="text-[13px] font-bold text-gray-800 group-hover/item:text-[#145C34] transition">
              {{ item.name }}
            </span>
          </div>
          
          <i class="fa-solid fa-chevron-right text-gray-300 text-xs group-hover/item:text-[#145C34] transition transform group-hover/item:translate-x-1"></i>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const wikimedia = (file) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`

const paymentGroups = [
  {
    category: 'Virtual Account',
    icon: 'fa-solid fa-building-columns',
    items: [
      {
        id: 'mandiri',
        name: 'Bank Mandiri',
        logo: wikimedia('Bank Mandiri logo 2016.svg')
      },
      {
        id: 'bni',
        name: 'BNI',
        logo: wikimedia('Bank Negara Indonesia logo (2004).svg')
      },
      {
        id: 'bri',
        name: 'Bank BRI',
        logo: wikimedia('BRI 2025.svg')
      },
      {
        id: 'permata',
        name: 'Permata Bank',
        logo: wikimedia('Permata Bank (2024).svg')
      },
      {
        id: 'cimb',
        name: 'CIMB Niaga',
        logo: wikimedia('CIMB Niaga logo.svg')
      },
      {
        id: 'bsi',
        name: 'BSI (Bank Syariah Indonesia)',
        logo: wikimedia('Bank Syariah Indonesia.svg')
      }
    ]
  },
  {
    category: 'Lainnya',
    icon: 'fa-solid fa-mobile-screen',
    items: [
      {
        id: 'qris',
        name: 'QRIS',
        logo: wikimedia('Logo QRIS.svg')
      }
    ]
  }
]
</script>

<style scoped>
</style>