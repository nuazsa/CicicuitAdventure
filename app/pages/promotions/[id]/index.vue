<template>
  <!-- Header -->
  <MobileHeaderDefault title="Promo Menarik" backTo="/promotions" />

  <!-- Image Section -->
  <div class="relative w-full h-[280px] overflow-hidden bg-gray-900">
    <img src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=600&h=400" alt="Rinjani" class="absolute inset-0 w-full h-full object-cover opacity-90" />
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"></div>

    <div class="absolute inset-0 p-5 flex flex-col justify-end pb-8 z-10">
      <div class="flex items-center gap-2 mb-2">
        <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
          <div class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-white text-[10px] font-bold tracking-widest">AKTIF</span>
        </div>
      </div>

      <h2 class="text-white text-lg font-bold leading-snug mb-1 drop-shadow-md">
        Hemat Akhir Pekan di Rinjani
      </h2>
      <p class="text-gray-300 text-xs font-medium drop-shadow-md">Berlaku hingga 30 Mei 2026</p>
    </div>
  </div>

  <!-- Promo Details -->
  <div class="px-4 mt-4 relative z-20 space-y-4">   
    <!-- Promo Benefits -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center">
      <div class="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#145C34] shrink-0">
        <i class="fa-solid fa-rocket text-xl"></i>
      </div>
      <div>
        <h3 class="font-bold text-gray-800 text-sm">Potongan 20%</h3>
        <p class="text-xs text-gray-500 mt-1 font-medium">Hemat 20% dari total biaya pendaftaran trip kamu.</p>
      </div>
    </div>

    <!-- Promo Information -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
        <p class="text-[10px] text-gray-400 font-bold mb-1">Min. Transaksi</p>
        <p class="text-xs font-extrabold text-gray-800">Tidak ada</p>
      </div>
      <div class="bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
        <p class="text-[10px] text-gray-400 font-bold mb-1">Maks. Pakai</p>
        <p class="text-xs font-extrabold text-gray-800">1x/user</p>
      </div>
      <div class="bg-white rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
        <p class="text-[10px] text-gray-400 font-bold mb-1">Sisa Kuota</p>
        <p class="text-sm font-extrabold text-gray-800">∞</p>
      </div>
    </div>

    <!-- Promo Code -->
    <div class="bg-[#FFF8E1] border border-dashed border-[#FFC107] rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
      <i class="fa-solid fa-ticket absolute -right-2 -bottom-2 text-5xl text-[#FFC107] opacity-20 transform -rotate-12"></i>
      
      <div class="relative z-10">
        <p class="text-[10px] text-[#F57C00] font-extrabold uppercase tracking-wider mb-1">Kode Promo Kamu</p>
        <p class="font-mono text-lg font-black text-gray-800 tracking-widest">{{ promoCode }}</p>
      </div>
      
      <button 
        @click="copyCode" 
        class="relative z-10 bg-white border border-[#FFD54F] text-[#F57C00] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#FFECB3] transition shadow-sm flex items-center gap-2"
      >
        <i :class="isCopied ? 'fa-solid fa-check text-green-500' : 'fa-regular fa-copy'"></i>
        {{ isCopied ? 'Tersalin!' : 'Salin' }}
      </button>
    </div>

    <!-- Promo Description -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h4 class="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Deskripsi</h4>
      <div class="text-xs text-gray-800 font-semibold leading-relaxed space-y-4">
        <p>Yuk muncak santai akhir pekan di Gunung Rinjani! 🎉</p>
        <p>
          Nikmati diskon 20% untuk pendaftaran Open Trip Gunung Rinjani. Booking kuota trip kamu di 
          <a href="#" class="text-[#145C34] underline decoration-2 underline-offset-2 hover:text-green-800">cicitcuit.id</a> sekarang sebelum kehabisan!
        </p>
      </div>
    </div>

    <!-- Terms and Conditions -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h4 class="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Syarat & Ketentuan</h4>
      <ul class="list-disc pl-4 text-xs text-gray-800 font-semibold leading-relaxed space-y-3 marker:text-[#145C34]">
        <li>Diskon 20% berlaku khusus untuk destinasi Gunung Rinjani</li>
        <li>Promo tidak berlaku untuk penyewaan alat tambahan dan jasa porter pribadi</li>
        <li>Promo tidak dapat digabungkan dengan voucher diskon lainnya dalam satu transaksi</li>
        <li>Panitia berhak membatalkan diskon apabila ditemukan indikasi kecurangan</li>
      </ul>
    </div>

  </div>

  <!-- Action Button -->
  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 z-50 flex items-center gap-3">
    <div class="flex-1">
      <p class="text-[10px] text-gray-500 font-bold">Total Potongan</p>
      <p class="text-sm font-extrabold text-[#D32F2F]">Hingga 20%</p>
    </div>
    <button class="bg-[#145C34] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 hover:bg-[#0B4D26] transition active:scale-95">
      Gunakan Promo
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Data Promo Code
const promoCode = ref('RINJANI20')
const isCopied = ref(false)

// Fungsi untuk menyalin kode ke clipboard
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(promoCode.value)
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