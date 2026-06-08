<template>
  <!-- Header -->
  <MobileHeaderDefault title="Konfigurasi Paket" :backTo="`/opentrip/${$route.params.id}`" />

  <!-- Package Details -->
  <div class="px-5 flex flex-col gap-4 mt-2 mb-28">
    <!-- Package Info -->
    <div class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <h2 class="text-lg font-bold text-gray-900 leading-tight" v-html="configData.package.titleOfPackage"></h2>
      <p class="text-[12px] text-gray-500 mb-3" v-html="configData.package.titleOfTrip"></p>
      
      <div class="flex flex-col gap-2 mb-4">
        <div class="flex items-start gap-2.5 text-[13px] text-gray-700">
          <i class="fa-regular fa-calendar text-[#145C34] mt-0.5"></i>
          <span>{{ configData.package.dateRange }}</span>
        </div>
        <div class="flex items-start gap-2.5 text-[13px] text-gray-700">
          <i class="fa-solid fa-location-dot text-[#145C34] mt-0.5"></i>
          <span>{{ configData.package.location }}</span>
        </div>
        <!-- Ticket Info -->
         <div class="flex items-start gap-2.5 text-[13px] text-gray-700">
          <i class="fa-solid fa-door-open text-[#145C34] mt-0.5"></i>
          <span>Meeting Point: {{ configData.package.meetingPoint }}</span>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-3">
        <p class="text-[12px] font-bold text-gray-800 mb-2">Fasilitas Termasuk:</p>
        <ul class="flex flex-col gap-2">
          <li v-for="(facility, index) in configData.package.includedFacilities" :key="index" class="flex items-center gap-2 text-[12px] text-gray-600">
            <i class="fa-solid fa-circle-check text-[#145C34]"></i> {{ facility }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Participant Count -->
    <div class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center">
      <div class="pr-4">
        <h3 class="text-[13px] font-bold text-gray-900 mb-1">Jumlah Peserta</h3>
        <p class="text-[10px] text-gray-500 leading-relaxed">Tentukan berapa orang yang<br/>akan ikut dalam pemesanan ini.</p>
      </div>
      
      <div class="flex items-center justify-between bg-[#F4F6F5] border border-gray-200 rounded-full px-1 py-1 w-[88px] shrink-0">
        <button @click="decrementParticipant" class="w-7 h-7 flex items-center justify-center text-[#145C34] hover:bg-gray-200 rounded-full transition">
          <i class="fa-solid fa-minus text-xs"></i>
        </button>
        <span class="text-[13px] font-bold text-gray-800 w-4 text-center">{{ participantCount }}</span>
        <button @click="incrementParticipant" class="w-7 h-7 flex items-center justify-center text-[#145C34] hover:bg-gray-200 rounded-full transition">
          <i class="fa-solid fa-plus text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Meeting Point -->
    <div class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <h3 class="text-[13px] font-bold text-gray-900 mb-1">Titik Kumpul (Meeting Point)</h3>
      <p class="text-[10px] text-gray-500 leading-relaxed mb-3">Pilih lokasi keberangkatan bersama rombongan.</p>
      
      <div class="relative">
        <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-40"></div>

        <div 
          @click="isDropdownOpen = !isDropdownOpen"
          class="relative w-full flex items-center justify-between bg-white border cursor-pointer text-gray-800 text-[12px] font-medium rounded-xl px-4 py-3.5 transition-all duration-200"
          :class="isDropdownOpen ? 'border-[#145C34] ring-1 ring-[#145C34]' : 'border-gray-200 hover:border-gray-300'"
        >
          <span class="truncate pr-4 flex items-center gap-1.5">
            {{ selectedMeetingPointData?.name }} 
            <span v-if="selectedMeetingPointData?.price > 0" class="text-gray-500 font-normal whitespace-nowrap">(+ {{ formatRupiah(selectedMeetingPointData.price) }})</span>
            <span v-else class="text-[#145C34] font-normal whitespace-nowrap">(Sesuai Paket)</span>
          </span>
          <i class="fa-solid fa-chevron-down text-gray-400 text-[10px] transition-transform duration-300" :class="{ 'rotate-180': isDropdownOpen }"></i>
        </div>

        <transition name="dropdown-fade">
          <div v-if="isDropdownOpen" class="absolute w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden">
            <ul class="py-1.5 max-h-56 overflow-auto scrollbar-hide">
              <li 
                v-for="mp in configData.meetingPoints" 
                :key="mp.id"
                @click="handleSelectMeetingPoint(mp.id)"
                class="px-4 py-3 text-[12px] cursor-pointer transition-colors flex justify-between items-center group"
                :class="selectedMeetingPointId === mp.id ? 'bg-[#E8F5E9] text-[#145C34] font-bold' : 'text-gray-700 hover:bg-gray-50'"
              >
                <span class="flex items-center gap-1.5">
                  {{ mp.name }} 
                  <span v-if="mp.price > 0" class="font-normal" :class="selectedMeetingPointId === mp.id ? 'text-[#145C34]/70' : 'text-gray-500'">
                    (+ {{ formatRupiah(mp.price) }})
                  </span>
                  <span v-else class="font-normal text-[#145C34]">
                    (Sesuai Paket)
                  </span>
                </span>
                <i v-if="selectedMeetingPointId === mp.id" class="fa-solid fa-check text-[#145C34]"></i>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>

    <!-- Additional Services -->
    <div class="mt-2">
      <h3 class="text-[15px] font-bold text-gray-900 mb-0.5">Layanan Tambahan (Opsional)</h3>
      <p class="text-[12px] text-gray-500 mb-3">Sewa perlengkapan pribadi agar tidak ribet.</p>

      <div class="flex flex-col gap-3">
        
        <div 
          v-for="addon in configData.addons" 
          :key="addon.id"
          class="bg-white rounded-xl p-3.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center border border-gray-50 transition-colors"
          :class="{ 'cursor-pointer hover:bg-gray-50': addon.type === 'checkbox' }"
          @click="addon.type === 'checkbox' ? toggleAddon(addon) : null"
        >
          <div>
            <h4 class="text-[12px] font-bold text-gray-900">{{ addon.title }}</h4>
            <p class="text-[10px] text-[#F58220] mt-0.5">+ {{ formatRupiah(addon.price) }} / {{ addon.priceUnit }}</p>
          </div>
          
          <div v-if="addon.type === 'counter'" class="flex items-center justify-between bg-[#F4F6F5] border border-gray-200 rounded-full px-1 py-0.5 w-20 shrink-0">
            <button @click.stop="decrementAddon(addon)" class="w-6 h-6 flex items-center justify-center text-[#145C34] rounded-full hover:bg-gray-200 transition">
              <i class="fa-solid fa-minus text-[10px]"></i>
            </button>
            <span class="text-[12px] font-bold text-gray-800">{{ addon.value }}</span>
            <button @click.stop="incrementAddon(addon)" class="w-6 h-6 flex items-center justify-center text-[#145C34] rounded-full hover:bg-gray-200 transition">
              <i class="fa-solid fa-plus text-[10px]"></i>
            </button>
          </div>

          <div v-else-if="addon.type === 'checkbox'" class="pr-1 shrink-0">
            <div class="w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200"
                  :class="addon.value ? 'bg-[#145C34] border-[#145C34]' : 'bg-white border-gray-300'">
              <i v-if="addon.value" class="fa-solid fa-check text-white text-[10px]"></i>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Note -->
    <div class="bg-[#FFF8F0] border border-[#FFE8D1] rounded-xl p-3 flex gap-3 items-start mt-2">
      <i class="fa-solid fa-circle-info text-[#B45309] mt-0.5 text-sm shrink-0"></i>
      <p class="text-[11px] text-[#92400E] leading-relaxed" v-html="configData.noteText"></p>
    </div>

    <!-- Terms of Service -->
    <div class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-start gap-3 mt-2 border border-gray-50">
      <div class="pt-0.5 shrink-0">
        <div 
          @click="isTosAgreed = !isTosAgreed"
          class="w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors duration-200"
          :class="isTosAgreed ? 'bg-[#145C34] border-[#145C34]' : 'bg-white border-gray-300'"
        >
          <i v-if="isTosAgreed" class="fa-solid fa-check text-white text-[10px]"></i>
        </div>
      </div>
      <div>
        <p class="text-[12px] text-gray-700 leading-relaxed select-none" @click="isTosAgreed = !isTosAgreed">
          Saya telah membaca dan menyetujui 
          <NuxtLink :to="`/tos/${$route.params.id}`" @click.stop class="text-[#145C34] font-bold hover:underline">
            Syarat dan Ketentuan
          </NuxtLink> 
          serta kebijakan privasi yang berlaku untuk perjalanan ini.
        </p>
      </div>
    </div>
  </div>

  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 flex justify-between items-center">
    <div>
      <p class="text-[10px] text-gray-500 font-medium mb-0.5">Total Harga</p>
      <p class="text-[18px] font-extrabold text-[#145C34]">{{ formatRupiah(totalPrice) }}</p>
    </div>
    <button 
      :disabled="!isTosAgreed"
      class="px-6 py-2.5 rounded-lg text-[13px] font-bold transition shadow-sm"
      :class="isTosAgreed ? 'bg-[#145C34] text-white hover:bg-green-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
    >
      Lanjut Bayar
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// --- Data Object Configuration untuk Open Trip Gede Pangrango ---
const configData = ref({
  package: {
    titleOfTrip: 'Open Trip Gunung Gede Pangrango 2H1M',
    titleOfPackage: 'Paket Jalur Cibodas (2H1M)',
    basePrice: 395000,
    durationDays: 2,
    dateRange: '20 - 21 Desember 2026',
    location: 'Bogor, Jawa Barat',
    meetingPoint: 'Basecamp Cibodas',
    includedFacilities: [
      'Transport PP (Meeting Point - Basecamp)',
      'Tiket Masuk & Asuransi (SIMAKSI)',
      'Tenda Dome (1 Tenda untuk 4 Orang)',
      'Makan 3x selama di gunung'
    ]
  },
  meetingPoints: [
    { id: 'cibodas', name: 'Basecamp Cibodas', price: 0 },
    { id: 'bogor', name: 'Stasiun Bogor', price: 100000 },
    { id: 'door2door', name: 'Penjemputan Door-to-Door (Khusus Jakarta)', price: 150000 }
  ],
  addons: [
    {
      id: 'sleepingBag',
      title: 'Sewa Sleeping Bag (SB)',
      price: 25000,
      priceUnit: 'pax',
      type: 'counter',
      value: 0 
    },
    {
      id: 'matras',
      title: 'Sewa Matras Alumunium',
      price: 15000,
      priceUnit: 'pax',
      type: 'counter',
      value: 0
    },
    {
      id: 'privateTent',
      title: 'Upgrade Tenda Private (Hanya isi 2 org)',
      price: 100000,
      priceUnit: 'tenda',
      type: 'counter',
      value: 0
    },
    {
      id: 'personalPorter',
      title: 'Sewa Porter Pribadi (Maks 20kg)',
      price: 350000,
      priceUnit: 'hari',
      type: 'counter',
      value: 0
    }
  ],
  noteText: 'Catatan: Pastikan membawa Kartu Identitas (KTP) asli pada hari-H untuk proses Simaksi. Jika tidak, pihak Taman Nasional berhak menolak.'
})

// --- State Variables ---
const participantCount = ref(1)
const isDropdownOpen = ref(false)
const selectedMeetingPointId = ref('cibodas') 
const isTosAgreed = ref(false)

// --- Functions for Custom Dropdown ---
const selectedMeetingPointData = computed(() => {
  return configData.value.meetingPoints.find(mp => mp.id === selectedMeetingPointId.value)
})

const handleSelectMeetingPoint = (id) => {
  selectedMeetingPointId.value = id
  isDropdownOpen.value = false 
}

// --- Increment / Decrement Functions for Participants ---
const incrementParticipant = () => participantCount.value++
const decrementParticipant = () => {
  if (participantCount.value > 1) participantCount.value--
}

// --- Dynamic Functions for Looped Addons ---
const incrementAddon = (addon) => {
  addon.value++
}

const decrementAddon = (addon) => {
  if (addon.value > 0) addon.value--
}

const toggleAddon = (addon) => {
  addon.value = !addon.value
}

// --- Computed Total Price ---
const totalPrice = computed(() => {
  let total = 0
  const duration = configData.value.package.durationDays
  
  // 1. Harga Dasar: Harga Paket * Jumlah Peserta
  total += configData.value.package.basePrice * participantCount.value
  
  // 2. Biaya Titik Kumpul (Meeting Point)
  const selectedMp = configData.value.meetingPoints.find(mp => mp.id === selectedMeetingPointId.value)
  if (selectedMp) {
    // Jika biaya penjemputan bersifat per rombongan/pemesanan, tambahkan langsung.
    // (Jika ingin dihitung per orang, kalikan dengan participantCount.value)
    total += selectedMp.price 
  }

  // 3. Kalkulasi Layanan Tambahan (Addons)
  configData.value.addons.forEach(addon => {
    // Jika addon dihitung "per hari", kalikan durasi trip (contoh: porter pribadi)
    const multiplier = addon.priceUnit === 'hari' ? duration : 1
    
    if (addon.type === 'counter' && addon.value > 0) {
      total += (addon.price * addon.value) * multiplier
    } else if (addon.type === 'checkbox' && addon.value === true) {
      total += addon.price * multiplier
    }
  })
  
  return total
})

// --- Formatter Utility ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number)
}
</script>