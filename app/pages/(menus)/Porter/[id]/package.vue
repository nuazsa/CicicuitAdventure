<template>
  <!-- Header -->
  <MobileHeaderDefault title="Konfigurasi Paket" :backTo="`/porter/${$route.params.id}`" />

  <!-- Package Details -->
  <div class="px-5 flex flex-col gap-4 mt-2 mb-28">
    <!-- Package Info -->
    <div class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <h2 class="text-lg font-bold text-gray-900 leading-tight mb-3" v-html="configData.package.titleFormatted"></h2>
      
      <div class="flex flex-col gap-2 mb-4">
        <div class="flex items-start gap-2.5 text-[13px] text-gray-700">
          <i class="fa-regular fa-calendar text-[#145C34] mt-0.5"></i>
          <span>{{ configData.package.dateRange }}</span>
        </div>
        <div class="flex items-start gap-2.5 text-[13px] text-gray-700">
          <i class="fa-solid fa-location-dot text-[#145C34] mt-0.5"></i>
          <span>{{ configData.package.location }}</span>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-3">
        <p class="text-[12px] font-bold text-gray-800 mb-2">Fasilitas Termasuk per Porter:</p>
        <ul class="flex flex-col gap-2">
          <li v-for="(facility, index) in configData.package.includedFacilities" :key="index" class="flex items-center gap-2 text-[12px] text-gray-600">
            <i class="fa-solid fa-circle-check text-[#145C34]"></i> {{ facility }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Porter Count -->
    <div class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex justify-between items-center">
      <div class="pr-4">
        <h3 class="text-[13px] font-bold text-gray-900 mb-1">Jumlah Porter yang<br/>Dibutuhkan</h3>
        <p class="text-[10px] text-gray-500 leading-relaxed">Sesuaikan dengan total berat<br/>logistik kelompokmu (Saran: 1<br/>porter untuk 20kg).</p>
      </div>
      
      <div class="flex items-center justify-between bg-[#F4F6F5] border border-gray-200 rounded-full px-1 py-1 w-[88px] shrink-0">
        <button @click="decrementPorter" class="w-7 h-7 flex items-center justify-center text-[#145C34] hover:bg-gray-200 rounded-full transition">
          <i class="fa-solid fa-minus text-xs"></i>
        </button>
        <span class="text-[13px] font-bold text-gray-800 w-4 text-center">{{ porterCount }}</span>
        <button @click="incrementPorter" class="w-7 h-7 flex items-center justify-center text-[#145C34] hover:bg-gray-200 rounded-full transition">
          <i class="fa-solid fa-plus text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Meeting Point -->
    <div 
      class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative transition-all duration-200"
      :class="isDropdownOpen ? 'z-50' : 'z-10'"
    >
      <h3 class="text-[13px] font-bold text-gray-900 mb-1">Titik Kumpul (Meeting Point)</h3>
      <p class="text-[10px] text-gray-500 leading-relaxed mb-3">Pilih lokasi keberangkatan bersama rombongan.</p>
      
      <div class="relative w-full">
        <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-40"></div>

        <div 
          @click="isDropdownOpen = !isDropdownOpen"
          class="relative z-50 w-full flex items-center justify-between bg-white border cursor-pointer text-gray-800 text-[12px] font-medium rounded-xl px-4 py-3.5 transition-all duration-200"
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
          <div v-if="isDropdownOpen" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden">
            <ul class="py-1.5 max-h-56 overflow-auto scrollbar-hide">
              <li 
                v-for="mp in configData.meetingPoints" 
                :key="mp.id"
                @click.stop="handleSelectMeetingPoint(mp.id)" 
                class="px-4 py-3 text-[12px] cursor-pointer transition-colors flex justify-between items-center group relative z-50"
                :class="selectedMeetingPointId === mp.id ? 'bg-[#E8F5E9] text-[#145C34] font-bold' : 'text-gray-700 hover:bg-gray-50'"
              >
                <span class="flex items-center gap-1.5 pointer-events-none">
                  {{ mp.name }} 
                  <span v-if="mp.price > 0" class="font-normal" :class="selectedMeetingPointId === mp.id ? 'text-[#145C34]/70' : 'text-gray-500'">
                    (+ {{ formatRupiah(mp.price) }})
                  </span>
                  <span v-else class="font-normal text-[#145C34]">
                    (Sesuai Paket)
                  </span>
                </span>
                <i v-if="selectedMeetingPointId === mp.id" class="fa-solid fa-check text-[#145C34] pointer-events-none"></i>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>

    <!-- Additional Services -->
    <div class="mt-2">
      <h3 class="text-[15px] font-bold text-gray-900 mb-0.5">Layanan Tambahan (Opsional)</h3>
      <p class="text-[12px] text-gray-500 mb-3">Sesuaikan kebutuhan pendakianmu.</p>

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

  </div>

  <!-- Fixed Bottom Action Bar -->
  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 flex justify-between items-center z-50">
    <div>
      <p class="text-[10px] text-gray-500 font-medium mb-0.5">Total Harga</p>
      <p class="text-[18px] font-extrabold text-[#145C34]">{{ formatRupiah(totalPrice) }}</p>
    </div>
    <button class="bg-[#145C34] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-green-800 transition shadow-sm">
      Lanjut Bayar
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// --- Data Object Configuration ---
const configData = ref({
  package: {
    titleFormatted: 'Paket Full Service<br/>(3H2M)',
    basePrice: 750000,
    durationDays: 3,
    dateRange: '25 May - 27 May 2026',
    location: 'Basecamp Sembalun, Gunung Rinjani',
    includedFacilities: [
      'Angkut logistik maks 20kg',
      'Bongkar pasang tenda',
      'Memasak 3x sehari'
    ]
  },
  meetingPoints: [
    { id: 'basecamp', name: 'Basecamp Sembalun', price: 0 },
    { id: 'bandara', name: 'Bandara Internasional Lombok', price: 250000 },
    { id: 'mataram', name: 'Pusat Kota Mataram', price: 150000 },
    { id: 'pelabuhan', name: 'Pelabuhan Bangsal', price: 200000 }
  ],
  addons: [
    {
      id: 'localGuide',
      title: 'Tambah 1 Guide Lokal',
      price: 300000,
      priceUnit: 'hari',
      type: 'counter',
      value: 0 
    },
    {
      id: 'sleepingBag',
      title: 'Sewa Sleeping Bag',
      price: 50000,
      priceUnit: 'trip',
      type: 'checkbox',
      value: false
    },
    {
      id: 'waterPorter',
      title: 'Ekstra Porter Air',
      price: 200000,
      priceUnit: 'hari',
      type: 'counter',
      value: 0
    }
  ],
  noteText: 'Catatan: Harga sudah termasuk tiket masuk Taman Nasional (Simaksi).'
})

// --- State Variables ---
const porterCount = ref(1)
const isDropdownOpen = ref(false)
const selectedMeetingPointId = ref('basecamp') 

// --- Functions for Custom Dropdown ---
const selectedMeetingPointData = computed(() => {
  return configData.value.meetingPoints.find(mp => mp.id === selectedMeetingPointId.value)
})

const handleSelectMeetingPoint = (id) => {
  selectedMeetingPointId.value = id
  isDropdownOpen.value = false 
}

// --- Increment / Decrement Functions for Main Porter ---
const incrementPorter = () => porterCount.value++
const decrementPorter = () => {
  if (porterCount.value > 1) porterCount.value--
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
  
  // 1. Base Price: Package Price * Porter Count
  total += configData.value.package.basePrice * porterCount.value
  
  // 2. Add Meeting Point cost
  const selectedMp = configData.value.meetingPoints.find(mp => mp.id === selectedMeetingPointId.value)
  if (selectedMp) {
    total += selectedMp.price
  }

  // 3. Calculate Addons dynamically
  configData.value.addons.forEach(addon => {
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