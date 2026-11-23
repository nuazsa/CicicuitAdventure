<template>
  <div class="px-5 pt-5 animate-fade-in">
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#145C34]">
            <i class="fa-solid fa-circle-check text-xl"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">Status Afiliasi Aktif</h3>
            <p class="text-[10px] text-gray-500">Bagikan link layanan & kumpulkan reward</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
        <div class="flex justify-between text-[11px] font-bold text-gray-700 mb-2">
          <span class="flex items-center gap-1.5">
            <i class="fa-solid fa-bullseye text-[#145C34]"></i> Progres Reward
          </span>
          <span class="text-[#145C34]">{{ totalOrders }} / {{ targetOrders }} Order</span>
        </div>
        <div class="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="bg-[#145C34] h-full rounded-full transition-all duration-500"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <p class="text-[10px] text-gray-500 mt-2 leading-relaxed">
          Kumpulkan {{ targetOrders - totalOrders > 0 ? targetOrders - totalOrders : 0 }} order lagi dari link layananmu untuk klaim reward berikutnya.
        </p>
      </div>
    </div>

    <div class="bg-gray-200/70 p-1 rounded-xl flex gap-1 mb-4">
      <button 
        @click="activeTab = 'links'" 
        class="flex-1 py-2 text-[11px] font-bold rounded-lg transition"
        :class="activeTab === 'links' ? 'bg-white text-[#145C34] shadow-sm' : 'text-gray-500 hover:text-gray-700'"
      >
        Riwayat Link ({{ totalLinks }})
      </button>
      <button 
        @click="activeTab = 'usage'" 
        class="flex-1 py-2 text-[11px] font-bold rounded-lg transition"
        :class="activeTab === 'usage' ? 'bg-white text-[#145C34] shadow-sm' : 'text-gray-500 hover:text-gray-700'"
      >
        Riwayat Penggunaan
      </button>
    </div>

    <!-- TAB 1: RIWAYAT LINK -->
    <div v-if="activeTab === 'links'" class="flex flex-col gap-3">
      <div v-if="isLoadingLinks" class="bg-white rounded-2xl p-10 text-center border border-gray-100">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-[#145C34] mb-2"></i>
        <p class="text-[11px] text-gray-500">Memuat riwayat link...</p>
      </div>

      <div v-else-if="linkHistory.length === 0" class="bg-white rounded-2xl p-8 text-center border border-gray-100">
        <i class="fa-solid fa-link-slash text-2xl text-gray-300 mb-2"></i>
        <p class="text-xs font-bold text-gray-700">Belum Ada Link Dibagikan</p>
        <p class="text-[10px] text-gray-400 mt-1">Buka halaman layanan (seperti Open Trip) lalu klik tombol bagikan untuk membuat link afiliasi.</p>
      </div>

      <template v-else>
        <div 
          v-for="item in linkHistory" 
          :key="item.id" 
          class="bg-white p-4 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100"
        >
          <div class="flex justify-between items-start gap-2 mb-2">
            <div>
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-green-50 text-[#145C34]">
                {{ formatServiceType(item.serviceType) }}
              </span>
              <h4 class="text-[13px] font-bold text-gray-800 mt-1.5 leading-snug">{{ item.serviceName }}</h4>
            </div>
            <span class="text-[10px] text-gray-400 shrink-0">{{ formatDate(item.createdAt) }}</span>
          </div>

          <div class="bg-gray-50 border border-gray-200/80 rounded-lg px-3 py-2 flex items-center justify-between gap-2 my-3">
            <span class="text-[11px] text-gray-600 truncate font-mono">{{ getShareUrl(item) }}</span>
            <button 
              @click="copyLink(item)" 
              class="text-[10px] font-bold px-2.5 py-1 rounded-md shrink-0 transition flex items-center gap-1"
              :class="copiedId === item.id ? 'bg-[#145C34] text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'"
            >
              <i :class="copiedId === item.id ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>
              {{ copiedId === item.id ? 'Tersalin' : 'Salin' }}
            </button>
          </div>

          <div class="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-50">
            <span class="flex items-center gap-1.5">
              <i class="fa-solid fa-arrow-pointer text-gray-400"></i> {{ item.clicks || 0 }}x Diklik
            </span>
            <span class="flex items-center gap-1.5 font-semibold text-[#145C34]">
              <i class="fa-solid fa-bag-shopping"></i> {{ item.ordersCount || 0 }} Order Terbuat
            </span>
          </div>
        </div>

        <button 
          v-if="hasMoreLinks"
          @click="loadMoreLinks"
          :disabled="isLoadingMore"
          class="w-full py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2 mt-1"
        >
          <i v-if="isLoadingMore" class="fa-solid fa-circle-notch fa-spin"></i>
          {{ isLoadingMore ? 'Memuat...' : 'Muat Lebih Banyak' }}
        </button>
      </template>
    </div>

    <!-- TAB 2: RIWAYAT PENGGUNAAN -->
    <div v-else class="flex flex-col gap-3">
      <div v-if="usageHistory.length === 0" class="bg-white rounded-2xl p-8 text-center border border-gray-100">
        <i class="fa-solid fa-clock-rotate-left text-2xl text-gray-300 mb-2"></i>
        <p class="text-xs font-bold text-gray-700">Belum Ada Riwayat Penggunaan</p>
        <p class="text-[10px] text-gray-400 mt-1">Riwayat order dari link afiliasimu dan penukaran reward akan muncul di sini.</p>
      </div>

      <div 
        v-for="log in usageHistory" 
        :key="log.id" 
        class="bg-white p-4 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex items-start gap-3.5"
      >
        <div 
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          :class="log.type === 'REDEEM' ? 'bg-orange-50 text-[#F58220]' : 'bg-green-50 text-[#145C34]'"
        >
          <i :class="log.type === 'REDEEM' ? 'fa-solid fa-gift text-base' : 'fa-solid fa-bag-shopping text-base'"></i>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start gap-2">
            <h4 class="text-[12px] font-bold text-gray-800 leading-tight">{{ log.title }}</h4>
            <span 
              class="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
              :class="getStatusBadge(log.status)"
            >
              {{ log.statusLabel }}
            </span>
          </div>

          <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">{{ log.description }}</p>

          <div class="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-50 text-[10px]">
            <span class="text-gray-400">{{ log.date }}</span>
            <span 
              class="font-bold"
              :class="log.type === 'REDEEM' ? 'text-[#F58220]' : 'text-[#145C34]'"
            >
              {{ log.type === 'REDEEM' ? `-${log.orderCount} Order` : `+${log.orderCount} Order` }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCookie, useRuntimeConfig } from '#imports'

const props = defineProps({
  progressQuantity: {
    type: Number,
    default: 0
  }
})

const config = useRuntimeConfig()
const authCookie = useCookie('access_token')

const activeTab = ref('links')
const copiedId = ref(null)

const isLoadingLinks = ref(true)
const isLoadingMore = ref(false)
const linkHistory = ref([])
const page = ref(1)
const limit = 10
const totalLinks = ref(0)

const targetOrders = ref(10)
const totalOrders = computed(() => Number(props.progressQuantity || 0))

const progressPercentage = computed(() => {
  const percentage = (totalOrders.value / targetOrders.value) * 100
  return percentage > 100 ? 100 : percentage
})

const hasMoreLinks = computed(() => {
  return linkHistory.value.length < totalLinks.value
})

const usageHistory = ref([
  {
    id: 'usg-1',
    type: 'ORDER',
    title: 'Order Layanan Open Trip Gede Pangrango',
    description: 'Pesanan oleh Budi Santoso (Kode: #ORD-9821) melalui link afiliasimu.',
    status: 'COMPLETED',
    statusLabel: 'Berhasil',
    orderCount: 1,
    date: '14 Nov 2026, 15:30'
  },
  {
    id: 'usg-2',
    type: 'REDEEM',
    title: 'Redeem Voucher Diskon Trip 100%',
    description: 'Penukaran reward dari pencapaian target 5 order afiliasi.',
    status: 'REDEEMED',
    statusLabel: 'Diklaim',
    orderCount: 5,
    date: '13 Nov 2026, 09:12'
  },
  {
    id: 'usg-3',
    type: 'ORDER',
    title: 'Order Layanan Open Trip Ciremai',
    description: 'Pesanan oleh Siti Aminah (Kode: #ORD-9754) melalui link afiliasimu.',
    status: 'PENDING',
    statusLabel: 'Menunggu Trip',
    orderCount: 1,
    date: '12 Nov 2026, 19:45'
  }
])

const getShareUrl = (item) => {
  if (item.url) return item.url
  if (typeof window !== 'undefined' && item.shortCode) {
    return `${window.location.origin}/af/${item.shortCode}`
  }
  return ''
}

const formatServiceType = (type) => {
  if (!type) return 'Layanan'
  return type.replace(/-/g, ' ')
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const fetchLinkHistory = async (isLoadMore = false) => {
  if (!authCookie.value) {
    isLoadingLinks.value = false
    return
  }

  if (isLoadMore) {
    isLoadingMore.value = true
  } else {
    isLoadingLinks.value = true
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/affiliate/link-history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authCookie.value}`,
        'Accept': 'application/json'
      },
      query: {
        page: page.value,
        limit
      }
    })

    const rows = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.items)
        ? response.data.items
        : Array.isArray(response)
          ? response
          : []

    if (isLoadMore) {
      linkHistory.value.push(...rows)
    } else {
      linkHistory.value = rows
    }

    if (rows.length > 0 && rows[0].total_data !== undefined) {
      totalLinks.value = Number(rows[0].total_data)
    } else if (response?.meta?.total !== undefined) {
      totalLinks.value = Number(response.meta.total)
    } else {
      totalLinks.value = linkHistory.value.length
    }
  } catch (error) {
    console.error('Gagal mengambil riwayat link:', error)
  } finally {
    isLoadingLinks.value = false
    isLoadingMore.value = false
  }
}

const loadMoreLinks = () => {
  page.value += 1
  fetchLinkHistory(true)
}

onMounted(() => {
  fetchLinkHistory()
})

const copyLink = async (item) => {
  const targetUrl = getShareUrl(item)
  if (!targetUrl) return

  try {
    await navigator.clipboard.writeText(targetUrl)
    copiedId.value = item.id
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (err) {
    console.error('Gagal menyalin link:', err)
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-50 text-[#145C34]'
    case 'REDEEMED':
      return 'bg-orange-50 text-[#F58220]'
    case 'PENDING':
      return 'bg-amber-50 text-amber-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
</script>