<template>
  <div class="max-w-md mx-auto min-h-screen bg-[#F9FAFB] relative font-sans pb-24">
    <MobileHeaderDefault :title="promoDetail.pageTitle" backTo="/promotions" />

    <div class="relative w-full h-[280px] overflow-hidden bg-gray-900 -mt-2">
      <NuxtImg 
        :src="promoDetail.heroImage" 
        :alt="promoDetail.title" 
        class="absolute inset-0 w-full h-full object-cover opacity-90" 
        format="webp"
        preload
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"></div>

      <div class="absolute inset-0 p-5 flex flex-col justify-end pb-8 z-10">
        <div class="flex items-center gap-2 mb-2">
          <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
            <div class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-white text-[10px] font-bold tracking-widest">{{ promoDetail.status }}</span>
          </div>
        </div>

        <h2 class="text-white text-lg font-bold leading-snug mb-1 drop-shadow-md">
          {{ promoDetail.title }}
        </h2>
        <p class="text-gray-300 text-xs font-medium drop-shadow-md">{{ promoDetail.expiryText }}</p>
      </div>
    </div>

    <div class="px-4 mt-4 relative z-20 space-y-4">   
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center">
        <div class="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#145C34] shrink-0">
          <i :class="[promoDetail.benefit.icon, 'text-xl']"></i>
        </div>
        <div>
          <h3 class="font-bold text-gray-800 text-sm">{{ promoDetail.benefit.title }}</h3>
          <p class="text-xs text-gray-500 mt-1 font-medium">{{ promoDetail.benefit.description }}</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div v-for="(metric, index) in promoDetail.metrics" :key="index" class="bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
          <p class="text-[10px] text-gray-400 font-bold mb-1">{{ metric.label }}</p>
          <p class="text-xs font-extrabold text-gray-800">{{ metric.value }}</p>
        </div>
      </div>

      <div class="bg-[#FFF8E1] border border-dashed border-[#FFC107] rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
        <i class="fa-solid fa-ticket absolute -right-2 -bottom-2 text-5xl text-[#FFC107] opacity-20 transform -rotate-12"></i>
        
        <div class="relative z-10">
          <p class="text-[10px] text-[#F57C00] font-extrabold uppercase tracking-wider mb-1">Kode Promo Kamu</p>
          <p class="font-mono text-lg font-black text-gray-800 tracking-widest">{{ promoDetail.code }}</p>
        </div>
        
        <button 
          @click="copyCode" 
          class="relative z-10 bg-white border border-[#FFD54F] text-[#F57C00] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#FFECB3] transition shadow-sm flex items-center gap-2"
        >
          <i :class="isCopied ? 'fa-solid fa-check text-green-500' : 'fa-regular fa-copy'"></i>
          {{ isCopied ? 'Tersalin!' : 'Salin' }}
        </button>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h4 class="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Deskripsi</h4>
        <div class="text-xs text-gray-800 font-semibold leading-relaxed space-y-4" v-html="promoDetail.descriptionHtml">
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h4 class="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Syarat & Ketentuan</h4>
        <ul class="list-disc pl-4 text-xs text-gray-800 font-semibold leading-relaxed space-y-3 marker:text-[#145C34]">
          <li v-for="(tnc, index) in promoDetail.termsAndConditions" :key="index">
            {{ tnc }}
          </li>
        </ul>
      </div>

    </div>

    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 z-50 flex items-center gap-3">
      <div class="flex-1">
        <p class="text-[10px] text-gray-500 font-bold">{{ promoDetail.actionBottom.label }}</p>
        <p class="text-sm font-extrabold text-[#D32F2F]">{{ promoDetail.actionBottom.valueText }}</p>
      </div>
      <button class="bg-[#145C34] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 hover:bg-[#0B4D26] transition active:scale-95">
        {{ promoDetail.actionBottom.buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// --- Data Object Configuration ---
const promoDetail = ref({
  pageTitle: 'Promo Menarik',
  heroImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=600&h=400',
  status: 'AKTIF',
  title: 'Hemat Akhir Pekan di Rinjani',
  expiryText: 'Berlaku hingga 30 Mei 2026',
  
  benefit: {
    icon: 'fa-solid fa-rocket',
    title: 'Potongan 20%',
    description: 'Hemat 20% dari total biaya pendaftaran trip kamu.'
  },
  
  metrics: [
    { label: 'Min. Transaksi', value: 'Tidak ada' },
    { label: 'Maks. Pakai', value: '1x/user' },
    { label: 'Sisa Kuota', value: '∞' }
  ],
  
  code: 'RINJANI20',
  
  // Menggunakan HTML String agar tag <a> tetap bisa di-render menggunakan v-html
  descriptionHtml: `
    <p>Yuk muncak santai akhir pekan di Gunung Rinjani! 🎉</p>
    <p>
      Nikmati diskon 20% untuk pendaftaran Open Trip Gunung Rinjani. Booking kuota trip kamu di 
      <a href="#" class="text-[#145C34] underline decoration-2 underline-offset-2 hover:text-green-800">cicitcuit.id</a> sekarang sebelum kehabisan!
    </p>
  `,
  
  termsAndConditions: [
    'Diskon 20% berlaku khusus untuk destinasi Gunung Rinjani',
    'Promo tidak berlaku untuk penyewaan alat tambahan dan jasa porter pribadi',
    'Promo tidak dapat digabungkan dengan voucher diskon lainnya dalam satu transaksi',
    'Panitia berhak membatalkan diskon apabila ditemukan indikasi kecurangan'
  ],

  actionBottom: {
    label: 'Total Potongan',
    valueText: 'Hingga 20%',
    buttonText: 'Gunakan Promo'
  }
})

// --- Logic State ---
const isCopied = ref(false)

// --- Functions ---
const copyCode = async () => {
  try {
    // Menggunakan variabel dari data object (promoDetail.value.code)
    await navigator.clipboard.writeText(promoDetail.value.code)
    isCopied.value = true
    
    // Kembalikan tombol ke state semula setelah 2 detik
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Gagal menyalin teks: ', err)
  }
}
</script>