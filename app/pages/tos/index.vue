<template>
  <!-- Terms & Conditions -->
  <div class="relative w-full h-32 overflow-hidden bg-[#145C34] -mt-2">
    <NuxtImg 
      :src="tosData.headerImage" 
      alt="Terms Background" 
      class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
      format="webp"
      preload
    />
    <div class="absolute inset-0 p-5 flex flex-col justify-center items-center text-center z-10">
      <i class="fa-solid fa-file-contract text-white text-3xl mb-2 opacity-90"></i>
      <h2 class="text-white text-base font-bold drop-shadow-sm">{{ tosData.mainHeading }}</h2>
      <p class="text-white/80 text-[11px] mt-0.5">Terakhir diperbarui: {{ tosData.lastUpdated }}</p>
    </div>
  </div>

  <!-- Terms & Conditions Content -->
  <div class="px-5 mt-5 flex flex-col gap-4 pb-10">
    
    <!-- Introduction -->
    <div class="bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl p-3 flex gap-3 items-start shadow-sm">
      <i class="fa-solid fa-circle-info text-[#145C34] mt-0.5 text-sm shrink-0"></i>
      <p class="text-[11px] text-[#1B5E20] leading-relaxed">
        Mohon baca dengan saksama. Dengan melanjutkan pemesanan, Anda dianggap telah memahami dan menyetujui seluruh poin di bawah ini.
      </p>
    </div>

    <!-- Terms & Conditions Sections -->
    <div 
      v-for="section in tosData.sections" 
      :key="section.id" 
      class="bg-white rounded-2xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100"
    >
      <div class="flex items-center gap-2.5 mb-3 border-b border-gray-50 pb-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm" :class="section.colorClass">
          <i :class="section.icon" class="text-[13px]"></i>
        </div>
        <h3 class="text-[14px] font-bold text-gray-900">{{ section.title }}</h3>
      </div>
      
      <ul class="flex flex-col gap-3">
        <li 
          v-for="(item, index) in section.items" 
          :key="index" 
          class="flex items-start gap-2.5 text-[12px] text-gray-700 leading-relaxed"
        >
          <div class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" :class="section.bulletClass"></div>
          <span v-html="item"></span>
        </li>
      </ul>
    </div>
  </div>

  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 z-50">
    <button 
      @click="$router.back()" 
      class="w-full bg-[#145C34] text-white py-3.5 rounded-xl font-bold text-[13px] hover:bg-green-800 transition shadow-md shadow-green-900/20"
    >
      Saya Mengerti & Kembali
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// --- Data Object Configuration ---
const tosData = ref({
  pageTitle: 'Syarat & Ketentuan',
  mainHeading: 'Regulasi Pendakian',
  lastUpdated: '1 Juni 2026',
  headerImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', 
  
  sections: [
    {
      id: 'ketentuan',
      title: 'Ketentuan Umum',
      icon: 'fa-solid fa-scale-balanced',
      colorClass: 'bg-[#145C34]', // Hijau Utama
      bulletClass: 'bg-[#145C34]',
      items: [
        'Peserta wajib dalam kondisi <strong>sehat jasmani dan rohani</strong> saat hari keberangkatan.',
        'Pembayaran <em>Down Payment</em> (DP) minimal 50% diwajibkan untuk mengamankan kuota trip.',
        'Pembatalan sepihak oleh peserta setelah H-7 akan menyebabkan seluruh pembayaran (termasuk DP) <strong>hangus</strong>.',
        'Panitia berhak mengubah jadwal atau rencana perjalanan (itinerary) secara sepihak apabila terjadi <em>Force Majeure</em> (cuaca ekstrem, penutupan jalur oleh pihak berwenang, bencana alam).'
      ]
    },
    {
      id: 'kewajiban',
      title: 'Kewajiban Peserta',
      icon: 'fa-solid fa-list-check',
      colorClass: 'bg-[#F58220]', // Oranye
      bulletClass: 'bg-[#F58220]',
      items: [
        'Membawa <strong>Kartu Identitas Asli</strong> (KTP/SIM/Paspor) yang masih berlaku untuk keperluan proses SIMAKSI.',
        'Membawa perlengkapan pribadi yang memadai dan memenuhi standar keselamatan pendakian (jaket gunung, sepatu trekking, <em>sleeping bag</em>, jas hujan).',
        'Membawa obat-obatan pribadi bagi peserta yang memiliki riwayat penyakit khusus.',
        'Mengikuti seluruh instruksi dan arahan dari <em>Tour Leader</em> atau <em>Guide Lokal</em> demi keselamatan bersama selama pendakian.'
      ]
    },
    {
      id: 'larangan',
      title: 'Larangan Keras',
      icon: 'fa-solid fa-ban',
      colorClass: 'bg-[#D32F2F]', // Merah
      bulletClass: 'bg-[#D32F2F]',
      items: [
        '<strong>Dilarang keras</strong> membawa, mengonsumsi, maupun mengedarkan narkotika, obat-obatan terlarang, dan minuman keras.',
        '<strong>Dilarang membuang sampah sembarangan.</strong> Peserta wajib membawa turun kembali sampah pribadinya (Prinsip <em>Leave No Trace</em>).',
        'Dilarang melakukan tindakan vandalisme berupa coretan pada batu, pohon, atau fasilitas di area Taman Nasional.',
        'Dilarang memisahkan diri dari rombongan tanpa seizin dan sepengetahuan <em>Tour Leader</em> atau <em>Guide</em> yang bertugas.'
      ]
    }
  ]
})
</script>
