<template>
  <MobileHeaderDefault title="Tiket Saya" hideSearch />

  <!-- Detail Tiket -->
  <div class="mx-5 mt-5 bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative z-10">
    <div class="relative w-full h-48">
      <NuxtImg 
        :src="orderDetail.heroImage" 
        alt="Trip Image" 
        class="w-full h-full object-cover"
        format="webp"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
      
      <div class="absolute bottom-4 left-5 right-5">
        <div class="inline-block bg-[#F58220] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-1.5 shadow-sm uppercase tracking-wider">
          {{ orderDetail.status }}
        </div>
        <h2 class="text-xl font-extrabold text-[#145C34] drop-shadow-sm">{{ orderDetail.tripTitle }}</h2>
      </div>
    </div>

    <div class="px-5 pt-4 pb-4 flex justify-between items-end">
      <div>
        <p class="text-[10px] text-gray-500 font-medium mb-0.5">ID Pesanan</p>
        <p class="text-[15px] font-extrabold text-[#92400E]">{{ orderDetail.orderId }}</p>
      </div>
      <div class="text-right">
        <p class="text-[10px] text-gray-500 font-medium mb-0.5">Diterbitkan Pada</p>
        <ClientOnly>
          <p class="text-[13px] font-bold text-[#1F2937]">{{ orderDetail.issuedOn }}</p>
          <template #fallback>
            <div class="w-16 h-4 bg-gray-100 animate-pulse rounded mt-0.5"></div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <div class="border-t border-gray-100 mx-5"></div>

    <div class="px-5 pt-5 pb-6 grid grid-cols-2 gap-y-5 gap-x-4">
      
      <div class="flex items-start gap-2.5">
        <i class="fa-regular fa-calendar text-[#6B7280] text-sm mt-0.5"></i>
        <div>
          <p class="text-[10px] text-gray-500 font-medium">Tanggal</p>
          <ClientOnly>
            <p class="text-[12px] font-bold text-[#1F2937] mt-0.5">{{ orderDetail.date }}</p>
            <template #fallback>
              <div class="w-24 h-4 bg-gray-100 animate-pulse rounded mt-0.5"></div>
            </template>
          </ClientOnly>
        </div>
      </div>
      
      <div class="flex items-start gap-2.5">
        <i class="fa-solid fa-tag text-[#6B7280] text-[12px] mt-0.5"></i>
        <div>
          <p class="text-[10px] text-gray-500 font-medium">Jenis Layanan</p>
          <p class="text-[12px] font-bold text-[#1F2937] mt-0.5">{{ orderDetail.serviceType }}</p>
        </div>
      </div>

      <div class="flex items-start gap-2.5">
        <i class="fa-regular fa-user text-[#6B7280] text-sm mt-0.5"></i>
        <div>
          <p class="text-[10px] text-gray-500 font-medium">Pemesan</p>
          <p class="text-[12px] font-bold text-[#1F2937] mt-0.5 line-clamp-1">{{ orderDetail.mainParticipant }}</p>
        </div>
      </div>
      
      <div class="flex items-start gap-2.5">
        <i class="fa-solid fa-user-group text-[#6B7280] text-[11px] mt-1"></i>
        <div>
          <p class="text-[10px] text-gray-500 font-medium">Jumlah</p>
          <p class="text-[12px] font-bold text-[#1F2937] mt-0.5">{{ orderDetail.participants }}</p>
        </div>
      </div>
      
      <div class="col-span-2 flex items-start gap-2.5">
        <i class="fa-solid fa-location-dot text-[#6B7280] text-sm mt-0.5"></i>
        <div>
          <p class="text-[10px] text-gray-500 font-medium">Titik Kumpul (Meeting Point)</p>
          <p class="text-[12px] font-bold text-[#1F2937] mt-0.5">{{ orderDetail.meetingPoint }}</p>
        </div>
      </div>
      
    </div>

    <div class="relative flex items-center justify-center h-6 w-full">
      <div class="absolute -left-3 w-6 h-6 bg-[#F4F6F5] rounded-full shadow-inner z-10"></div>
      <div class="w-full border-t-[1.5px] border-dashed border-gray-200 mx-3"></div>
      <div class="absolute -right-3 w-6 h-6 bg-[#F4F6F5] rounded-full shadow-inner z-10"></div>
    </div>

    <div class="px-5 pt-6 pb-8 flex flex-col items-center">
      <div class="bg-[#145C34] p-5 rounded-2xl shadow-md w-40 h-40 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:10px_10px]"></div>
          
          <div class="bg-white p-2 rounded-xl relative z-10 shadow-sm w-full h-full flex items-center justify-center">
            <img 
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderDetail.orderId}`" 
            alt="QR Code Ticket" 
            class="w-full h-full object-contain" 
            />
          </div>
      </div>
      <p class="text-[11px] text-gray-500 text-center mt-5 px-4 leading-relaxed">
        Pindai kode ini di pintu masuk basecamp untuk check-in petugas
      </p>
    </div>
  </div>

  <!-- Tombol Aksi -->
  <div class="px-5 flex flex-col gap-3 mt-6 relative z-20">
    <button 
      @click="downloadTicket" 
      :disabled="isDownloading"
      class="w-full py-3.5 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-sm"
      :class="isDownloading ? 'bg-green-800 text-white opacity-80 cursor-wait' : 'bg-[#145C34] text-white hover:bg-green-800'"
    >
      <i v-if="isDownloading" class="fa-solid fa-circle-notch fa-spin"></i>
      <i v-else class="fa-solid fa-download"></i>
      {{ isDownloading ? 'Mengunduh...' : 'Unduh Tiket' }}
    </button>
    
    <button @click="sendToEmail" class="w-full bg-white border-[1.5px] border-[#145C34] text-[#145C34] py-3.5 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition active:scale-[0.98]">
      <i class="fa-regular fa-envelope"></i> Kirim ke Email
    </button>
  </div>

  <!-- Informasi Penting -->
  <div class="mx-5 mt-6 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative z-20">
    <div class="flex items-center gap-2 mb-3">
      <i class="fa-solid fa-circle-info text-[#B45309] text-sm"></i>
      <h3 class="text-[13px] font-bold text-gray-900">Informasi Penting</h3>
    </div>
    <ul class="text-[11px] text-gray-600 space-y-2 pl-6 list-disc marker:text-gray-400">
      <li>Tiba di titik kumpul paling lambat 30 menit sebelum waktu keberangkatan.</li>
      <li>Bawa kartu identitas (KTP/SIM/Paspor) asli yang valid untuk proses verifikasi data.</li>
      <li>Persiapkan kondisi fisik dan kesehatan Anda dengan baik untuk kelancaran pendakian.</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFetch, useRuntimeConfig, useCookie } from '#imports'

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const invoiceNumber = route.params.invoice

const authCookie = useCookie('access_token')
const isDownloading = ref(false)

// 1. Fetch data detail pesanan
// const { data: rawOrderData, pending, error } = await useFetch(`${config.public.apiBaseUrl}/orders/${invoiceNumber}`, {
//   headers: {
//     'Authorization': `Bearer ${authCookie.value}`,
//     'Accept': 'application/json'
//   }
// })


const rawOrderData = ref({
  data: {
  status: 'PAID',
  tripTitle: 'Open Trip Cicitcuit',
  grossAmount: 1500000,
  qty: 2,
  createdAt: new Date().toISOString(),
  snapToken: 'dummy-snap-token'
}})

const orderDetail = computed(() => {
  if (!rawOrderData.value?.data) return null

  const data = rawOrderData.value.data
  
  if (data.status === 'PENDING') {
    router.replace(`/orders/${invoiceNumber}`)
    return null
  }

  const statusMapping = {
    'CONFIRMED': 'Terkonfirmasi',
    'SUCCESS': 'Berhasil',
    'PAID': 'Lunas'
  }

  return {
    status: statusMapping[data.status] || 'Terkonfirmasi',
    tripTitle: data.tripTitle || data.package?.titleOfTrip || 'Gunung Gede Pangrango',
    // Ambil jenis layanan dari API, jika tidak ada asumsikan 'Open Trip'
    serviceType: data.serviceType || data.type || 'Open Trip', 
    heroImage: data.heroImage || 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80', 
    orderId: data.invoiceNumber || invoiceNumber,
    issuedOn: formatDate(data.updatedAt || data.createdAt), 
    date: formatDateRange(data.startDate, data.endDate), 
    participants: `${data.qty || 1} Pax`, 
    meetingPoint: data.meetingPoint?.name || 'Basecamp Cibodas', 
    mainParticipant: data.customerName || 'Peserta Cicitcuit'
  }
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
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

const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: `E-Tiket: ${orderDetail.value.tripTitle}`,
        text: `Ini E-Tiket untuk perjalanan kita! Kode Booking: ${orderDetail.value.orderId}`,
        url: window.location.href,
      })
    } else {
      alert('Fitur bagikan tidak didukung di browser ini.')
    }
  } catch (error) {
    console.error('Batal membagikan', error)
  }
}

const downloadTicket = async () => {
  isDownloading.value = true

  try {
    const response = await $fetch(`${config.public.apiBase}/orders/${invoiceNumber}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authCookie.value}`
      },
      responseType: 'blob' 
    })

    const fileUrl = window.URL.createObjectURL(response)
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = `E-Tiket_${orderDetail.value.orderId}.pdf` 
    
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    window.URL.revokeObjectURL(fileUrl)

  } catch (err) {
    console.error('Gagal mengunduh tiket:', err)
    alert('Terjadi kesalahan saat mengunduh tiket dari server. Silakan coba lagi nanti.')
  } finally {
    isDownloading.value = false
  }
}

const sendToEmail = () => {
  alert('E-Tiket telah dikirim ulang ke alamat email terdaftar Anda.')
}
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>