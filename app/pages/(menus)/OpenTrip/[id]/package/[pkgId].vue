<template>
  <MobileHeaderDefault title="Konfigurasi Paket" :backTo="`/opentrip/${$route.params.id}`" />

  <!-- Package Details -->
  <div class="px-5 flex flex-col gap-4 mt-2 mb-28">
    <!-- Package Info -->
    <div class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <h2 class="text-lg font-bold text-gray-900 leading-tight">{{ configData.package?.titleOfPackage }}</h2>
      <p class="text-[12px] text-gray-500 mb-3">{{ configData.package?.titleOfTrip }}</p>
      
      <div class="flex flex-col gap-2 mb-4">
        <div class="flex items-start gap-2.5 text-[13px] text-gray-700">
          <i class="fa-regular fa-calendar text-[#145C34] mt-0.5"></i>
          <span>{{ formatDateRange(configData.package?.startDate, configData.package?.endDate) }}</span>
        </div>
        <div class="flex items-start gap-2.5 text-[13px] text-gray-700">
          <i class="fa-solid fa-location-dot text-[#145C34] mt-0.5"></i>
          <span>{{ configData.package?.location }}</span>
        </div>
        <div class="flex items-start gap-2.5 text-[13px] text-gray-700">
          <i class="fa-solid fa-door-open text-[#145C34] mt-0.5"></i>
          <span>Meeting Point: {{ configData.package?.meetingPoint }}</span>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-3">
        <p class="text-[12px] font-bold text-gray-800 mb-2">Fasilitas Termasuk:</p>
        <ul class="flex flex-col gap-2">
          <li v-for="(facility, index) in configData.package?.includedFacilities" :key="index" class="flex items-center gap-2 text-[12px] text-gray-600">
            <i class="fa-solid fa-circle-check text-[#145C34]"></i> {{ facility }}
          </li>
        </ul>
      </div>
    </div>

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

    <div 
      class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative transition-all duration-200"
      :class="isDropdownOpen ? 'z-50' : 'z-10'"
    >
      <h3 class="text-[13px] font-bold text-gray-900 mb-1">Titik Kumpul (Meeting Point)</h3>
      <p class="text-[10px] text-gray-500 leading-relaxed mb-3">Pilih lokasi keberangkatan bersama rombongan.</p>
      
      <div class="relative w-full">
        <div v-if="isDropdownOpen" @click="isDropdownOpen = false" class="fixed inset-0 z-40"></div>

        <div 
          v-if="!configData.meetingPoints || configData.meetingPoints.length === 0"
          class="relative z-50 w-full flex items-center justify-between bg-gray-50 border border-gray-200 text-gray-500 text-[12px] font-medium rounded-xl px-4 py-3.5 cursor-not-allowed"
        >
          <span class="truncate pr-4 flex items-center gap-1.5">
            Sesuai Paket ({{ configData.package?.meetingPoint }})
          </span>
        </div>

        <div 
          v-else
          @click="isDropdownOpen = !isDropdownOpen"
          class="relative z-50 w-full flex items-center justify-between bg-white border cursor-pointer text-gray-800 text-[12px] font-medium rounded-xl px-4 py-3.5 transition-all duration-200"
          :class="isDropdownOpen ? 'border-[#145C34] ring-1 ring-[#145C34]' : 'border-gray-200 hover:border-gray-300'"
        >
          <span class="truncate pr-4 flex items-center gap-1.5">
            {{ selectedMeetingPointData?.name || '-- Pilih Meeting Point --' }} 
            <span v-if="selectedMeetingPointData?.price > 0" class="text-gray-500 font-normal whitespace-nowrap">(+ {{ formatRupiah(selectedMeetingPointData.price) }})</span>
          </span>
          <i class="fa-solid fa-chevron-down text-gray-400 text-[10px] transition-transform duration-300" :class="{ 'rotate-180': isDropdownOpen }"></i>
        </div>

        <transition name="dropdown-fade">
          <div v-if="isDropdownOpen && configData.meetingPoints?.length > 0" class="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden">
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
                    (Gratis)
                  </span>
                </span>
                <i v-if="selectedMeetingPointId === mp.id" class="fa-solid fa-check text-[#145C34] pointer-events-none"></i>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>

    <div v-if="configData.addons?.length > 0" class="mt-2">
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
            <span class="text-[12px] font-bold text-gray-800">{{ addon.value || 0 }}</span>
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

    <div v-if="configData.noteText" class="bg-[#FFF8F0] border border-[#FFE8D1] rounded-xl p-3 flex gap-3 items-start mt-2">
      <i class="fa-solid fa-circle-info text-[#B45309] mt-0.5 text-sm shrink-0"></i>
      <p class="text-[11px] text-[#92400E] leading-relaxed" v-html="configData.noteText"></p>
    </div>

    <div class="bg-white rounded-xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-3 mt-2 border border-gray-50">
      
      <div class="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
         <span class="text-[11px] text-gray-500 font-medium">Biaya Layanan/Admin</span>
         <span class="text-[11px] text-gray-800 font-bold">+ {{ formatRupiah(adminFee) }}</span>
      </div>

      <div class="flex items-start gap-3 mt-1">
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
  </div>

  <div v-if="configData" class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 flex justify-between items-center z-40">
    <div>
      <p class="text-[10px] text-gray-500 font-medium mb-0.5">Total Harga</p>
      <p class="text-[18px] font-extrabold text-[#145C34]">{{ formatRupiah(totalPrice) }}</p>
    </div>
    <button 
      @click="handleCheckout"
      :disabled="!isReadyToPay || isProcessingPayment"
      class="px-6 py-2.5 rounded-lg text-[13px] font-bold transition shadow-sm flex items-center gap-2"
      :class="isReadyToPay && !isProcessingPayment ? 'bg-[#145C34] text-white hover:bg-green-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
    >
      <i v-if="isProcessingPayment" class="fa-solid fa-circle-notch fa-spin"></i>
      {{ isProcessingPayment ? 'Memproses...' : 'Lanjut Bayar' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch, useRuntimeConfig, useHead, useCookie } from '#imports'
import authCustomer from '~/middleware/auth-customer'

definePageMeta({
  middleware: authCustomer
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const authCookie = useCookie('access_token')

const uuid = route.params.pkgId
const initialQty = Number(route.query.qty) || 1

// --- State Variables ---
const participantCount = ref(initialQty > 0 ? initialQty : 1)
const isDropdownOpen = ref(false)
const selectedMeetingPointId = ref('') 
const isTosAgreed = ref(false)
const isProcessingPayment = ref(false)
const adminFee = 5000

const { data } = await useFetch(`${config.public.apiBaseUrl}/services/${uuid}/detail`)
const configData = ref(null)

watch(data, (newVal) => {
  if (newVal) {
    configData.value = JSON.parse(JSON.stringify(newVal))
  }
}, { immediate: true })


// --- Validasi Lanjut Bayar ---
const isReadyToPay = computed(() => {
  if (!isTosAgreed.value) return false
  
  if (configData.value?.meetingPoints?.length > 0 && !selectedMeetingPointId.value) {
    return false
  }
  
  return true
})

// --- Custom Dropdown Meeting Point ---
const selectedMeetingPointData = computed(() => {
  if (!configData.value?.meetingPoints) return null
  return configData.value.meetingPoints.find(mp => mp.id === selectedMeetingPointId.value)
})

const handleSelectMeetingPoint = (id) => {
  selectedMeetingPointId.value = id
  isDropdownOpen.value = false 
}

// --- Increment / Decrement Functions ---
const incrementParticipant = () => participantCount.value++
const decrementParticipant = () => {
  if (participantCount.value > 1) participantCount.value--
}

const incrementAddon = (addon) => {
  if (typeof addon.value !== 'number') addon.value = 0
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
  if (!configData.value?.package) return 0

  let total = 0
  const duration = parseInt(configData.value.package.durationDays) || 1
  
  // Harga Dasar Paket x Jumlah Peserta
  total += (configData.value.package.basePrice || 0) * participantCount.value
  
  // Biaya Meeting Point x Jumlah Peserta (Sesuai Permintaan)
  if (configData.value.meetingPoints?.length > 0) {
    const selectedMp = configData.value.meetingPoints.find(mp => mp.id === selectedMeetingPointId.value)
    if (selectedMp) {
      total += (selectedMp.price || 0) * participantCount.value
    }
  }

  // Addons
  if (configData.value.addons?.length > 0) {
    configData.value.addons.forEach(addon => {
      const multiplier = addon.priceUnit === 'hari' ? duration : 1
      if (addon.type === 'counter' && addon.value > 0) {
        total += (addon.price * addon.value) * multiplier
      } else if (addon.type === 'checkbox' && addon.value === true) {
        total += addon.price * multiplier
      }
    })
  }

  // Tambahkan Biaya Admin
  total += adminFee
  
  return total
})

// --- Eksekusi Pembayaran Checkout ---
const handleCheckout = async () => {
  if (!isReadyToPay.value) return
  isProcessingPayment.value = true

  try {
    const selectedAddons = []
    if (configData.value.addons) {
      configData.value.addons.forEach(addon => {
        if ((addon.type === 'counter' && addon.value > 0) || (addon.type === 'checkbox' && addon.value === true)) {
          selectedAddons.push({
            uuid: addon.id, 
            qty: addon.type === 'counter' ? addon.value : 1
          })
        }
      })
    }

    const payload = {
      packageUuid: uuid,
      qty: participantCount.value,
      meetingPointUuid: selectedMeetingPointId.value || null, 
      addons: selectedAddons
    }

    if (!authCookie.value) {
      throw new Error("Token otorisasi tidak ditemukan. Harap login kembali.")
    }

    const response = await $fetch(`${config.public.apiBaseUrl}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authCookie.value}`,
        'Content-Type': 'application/json'
      },
      body: payload
    })

    if (response?.data?.invoiceNumber && response?.data?.snapToken) {
      router.push(`/orders/${response.data.invoiceNumber}?token=${response.data.snapToken}&autoplay=true`)
    } else {
      throw new Error('Gagal mendapatkan detail pesanan dari server.')
    }
    
  } catch (err) {
    console.error('Checkout Error:', err)
    const errorMsg = err.data?.message || err.message || 'Terjadi kesalahan saat membuat pesanan.'
    alert(`Gagal: ${errorMsg}`)
  } finally {
    isProcessingPayment.value = false
  }
}

// --- Utilities ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number)
}

const formatDateRange = (start, end) => {
  if (!start || !end) return '-'
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const startMonth = months[startDate.getMonth()]
  const endMonth = months[endDate.getMonth()]
  const year = startDate.getFullYear()
  
  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth} ${year}`
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`
  }
}
</script>