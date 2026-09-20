<template>
  <MobileHeaderDefault title="Beri Ulasan" :backTo="`/orders/${invoiceId}/history`" hideSearch />

  <div class="px-5 pt-6 flex flex-col gap-6">
    
    <!-- Info Pesanan -->
    <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1 text-center">
      <p class="text-[12px] text-gray-500 font-medium uppercase tracking-wider">No. Pesanan</p>
      <p class="text-[16px] font-bold text-gray-900">{{ invoiceId }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
      <i class="fa-solid fa-circle-notch fa-spin text-2xl text-[#145C34]"></i>
    </div>

    <!-- Error State (Jika ditolak oleh backend sebelum merender form) -->
    <div v-else-if="errorMessage" class="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center text-center gap-3">
      <div class="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xl mb-1">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 class="text-sm font-bold text-gray-900">Tidak Dapat Memuat Form</h3>
      <p class="text-xs text-gray-600">{{ errorMessage }}</p>
      <button @click="router.push(`/orders/${invoiceId}/history`)" class="mt-2 text-xs font-bold text-[#145C34] bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
        Kembali
      </button>
    </div>

    <!-- Form Review -->
    <form v-else @submit.prevent="handleSubmit" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
      
      <!-- Badge Terima Kasih (Tampil jika sudah review) -->
      <div v-if="hasReviewed" class="absolute top-0 left-0 w-full bg-[#E8F5E9] py-2 text-center border-b border-green-100">
        <p class="text-[10px] font-bold text-[#145C34]"><i class="fa-solid fa-check-circle mr-1"></i> Ulasan sudah dikirim</p>
      </div>

      <!-- Bintang 1-5 -->
      <div class="flex flex-col items-center gap-3" :class="hasReviewed ? 'mt-6' : ''">
        <label class="text-[13px] font-bold text-gray-800">
          {{ hasReviewed ? 'Penilaian Anda' : 'Bagaimana pengalaman Anda?' }}
        </label>
        <div class="flex gap-2" @mouseleave="!hasReviewed && (hoverRating = 0)">
          <button 
            v-for="star in 5" 
            :key="star"
            type="button"
            :aria-label="`Beri rating ${star} bintang`"
            @mouseover="!hasReviewed && (hoverRating = star)"
            @click="!hasReviewed && (rating = star)"
            class="focus:outline-none transition-transform"
            :class="!hasReviewed ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'"
          >
            <i 
              class="text-4xl transition-colors duration-200"
              :class="[
                star <= (hoverRating || rating) 
                  ? 'fa-solid fa-star text-[#F58220]' 
                  : 'fa-regular fa-star text-gray-300' 
              ]"
            ></i>
          </button>
        </div>
        <p class="text-[11px] font-medium mt-1 min-h-[16px]" :class="ratingTextClass">
          {{ ratingLabel }}
        </p>
      </div>

      <div class="h-px w-full bg-gray-100"></div>

      <!-- Textarea Pesan -->
      <div class="space-y-2">
        <label class="text-[12px] font-bold text-gray-700 block">
          {{ hasReviewed ? 'Komentar Anda' : 'Tuliskan ulasan Anda' }} 
          <span v-if="!hasReviewed" class="text-gray-400 font-normal">(Opsional)</span>
        </label>
        <textarea 
          v-model="message"
          rows="4"
          maxlength="500"
          :readonly="hasReviewed"
          placeholder="Ceritakan pengalaman Anda di sini..."
          class="w-full border border-gray-200 text-[14px] rounded-xl px-4 py-3 transition-colors resize-none"
          :class="hasReviewed 
            ? 'bg-gray-50 text-gray-600 focus:outline-none cursor-not-allowed' 
            : 'bg-white focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34]'"
        ></textarea>
        <!-- Hanya tampilkan perhitungan karakter jika belum di-review -->
        <p v-if="!hasReviewed" class="text-[10px] text-right transition-colors" 
           :class="message.length >= 500 ? 'text-red-500' : 'text-gray-400'">
          {{ message.length }}/500 karakter
        </p>
      </div>

      <!-- Submit Button -->
      <button 
        v-if="!hasReviewed"
        type="submit"
        :disabled="rating === 0 || isSubmitting"
        class="w-full mt-2 py-3.5 rounded-xl font-bold text-[14px] transition shadow-md flex justify-center items-center gap-2"
        :class="rating === 0 || isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#145C34] text-white hover:bg-green-800 shadow-green-900/20'"
      >
        <i v-if="isSubmitting" class="fa-solid fa-circle-notch fa-spin"></i>
        <span v-else>Kirim Ulasan</span>
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig, useCookie } from '#imports'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const token = useCookie('access_token')

const invoiceId = route.params.invoice 

const rating = ref(0)
const hoverRating = ref(0)
const message = ref('')

const isSubmitting = ref(false)
const isLoading = ref(true)
const hasReviewed = ref(false)
const errorMessage = ref('') // State baru untuk menangkap pesan penolakan backend

onMounted(async () => {
  try {
    // [PENTING] Endpoint diubah menjadi /review/invoice/...
    const response = await $fetch(`${config.public.apiBaseUrl}/review/invoice/${invoiceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    if (response.data) {
      hasReviewed.value = true
      rating.value = response.data.rating
      message.value = response.data.review_text
    }
  } catch (error) {
    // Tangkap error jika backend menolak (misal: Not Found atau Invalid Status)
    if (error.data && error.data.message) {
      errorMessage.value = error.data.message;
    } else {
      errorMessage.value = 'Gagal memuat data. Periksa koneksi internet Anda.';
    }
    console.error('Gagal memuat data ulasan:', error)
  } finally {
    isLoading.value = false
  }
})

// Label dinamis
const ratingLabel = computed(() => {
  const currentRating = hoverRating.value || rating.value
  switch (currentRating) {
    case 1: return 'Sangat Buruk 😞'
    case 2: return 'Buruk 😕'
    case 3: return 'Cukup 😐'
    case 4: return 'Baik 🙂'
    case 5: return 'Sangat Baik! 😍'
    default: return 'Pilih bintang'
  }
})

// Warna text label
const ratingTextClass = computed(() => {
  const currentRating = hoverRating.value || rating.value
  if (currentRating === 0) return 'text-gray-400'
  if (currentRating <= 2) return 'text-red-500'
  if (currentRating === 3) return 'text-yellow-600'
  return 'text-[#145C34]'
})

const handleSubmit = async () => {
  if (rating.value === 0 || hasReviewed.value) return 
  
  isSubmitting.value = true

  try {
    // [PENTING] Endpoint diubah menjadi /review/invoice/...
    await $fetch(`${config.public.apiBaseUrl}/review/invoice/${invoiceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        rating: rating.value,
        review_text: message.value
      }
    })

    alert('Terima kasih! Ulasan Anda berhasil dikirim dan poin Anda bertambah.')
    router.push(`/orders/${invoiceId}/history`)
    
  } catch (error) {
    alert(error.data?.message || 'Gagal menyimpan ulasan, silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}
</script>