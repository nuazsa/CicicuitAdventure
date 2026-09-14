<template>
  <MobileHeaderDefault title="Beri Ulasan" :backTo="`/orders/${invoiceId}/history`" hideSearch />

  <div class="px-5 pt-6 flex flex-col gap-6">
    
    <!-- Info Pesanan -->
    <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1 text-center">
      <p class="text-[12px] text-gray-500 font-medium uppercase tracking-wider">No. Pesanan</p>
      <p class="text-[16px] font-bold text-gray-900">{{ invoiceId }}</p>
    </div>

    <!-- Form Review -->
    <form @submit.prevent="handleSubmit" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
      
      <!-- Bintang 1-5 -->
      <div class="flex flex-col items-center gap-3">
        <label class="text-[13px] font-bold text-gray-800">Bagaimana pengalaman Anda?</label>
        <div class="flex gap-2" @mouseleave="hoverRating = 0">
          <button 
            v-for="star in 5" 
            :key="star"
            type="button"
            @mouseover="hoverRating = star"
            @click="rating = star"
            class="focus:outline-none transition-transform hover:scale-110 active:scale-95"
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
        <label class="text-[12px] font-bold text-gray-700 block">Tuliskan ulasan Anda <span class="text-gray-400 font-normal">(Opsional)</span></label>
        <textarea 
          v-model="message"
          rows="4"
          placeholder="Ceritakan pengalaman Anda di sini..."
          class="w-full bg-gray-50 border border-gray-200 text-[14px] rounded-xl px-4 py-3 focus:outline-none focus:border-[#145C34] focus:ring-1 focus:ring-[#145C34] focus:bg-white transition-colors resize-none"
        ></textarea>
        <p class="text-[10px] text-gray-400 text-right">{{ message.length }}/500 karakter</p>
      </div>

      <!-- Submit Button -->
      <button 
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const token = useCookie('access_token')

// Mengambil ID / Nomor Invoice dari URL params (dari nama folder [id])
const invoiceId = route.params.invoice 

const rating = ref(0)
const hoverRating = ref(0)
const message = ref('')
const isSubmitting = ref(false)

// Label dinamis berdasarkan bintang yang dipilih/di-hover
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

// Warna text label mengikuti rating
const ratingTextClass = computed(() => {
  const currentRating = hoverRating.value || rating.value
  if (currentRating === 0) return 'text-gray-400'
  if (currentRating <= 2) return 'text-red-500'
  if (currentRating === 3) return 'text-yellow-600'
  return 'text-[#145C34]'
})

// Fungsi kirim data
const handleSubmit = async () => {
  if (rating.value === 0) return
  
  isSubmitting.value = true

  try {
    // Sesuaikan endpoint API Anda
    await $fetch(`${config.public.apiBaseUrl}/orders/${invoiceId}/review`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        rating: rating.value,
        message: message.value
      }
    })

    alert('Terima kasih! Ulasan Anda berhasil dikirim.')
    // Redirect kembali ke halaman detail order setelah sukses
    router.push(`/orders/${invoiceId}`)
    
  } catch (error) {
    alert(error.data?.message || 'Gagal mengirim ulasan, silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}
</script>