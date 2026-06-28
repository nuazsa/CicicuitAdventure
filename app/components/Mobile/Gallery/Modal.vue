<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex justify-center items-end" v-if="isOpen">
      
      <transition name="fade" appear>
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="handleClose"></div>
      </transition>

      <transition name="slide-up" appear>
        <div class="relative w-full max-w-md bg-white rounded-t-3xl pt-4 pb-6 px-0 shadow-2xl z-10 flex flex-col h-[85vh]" @click.stop>
          
          <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0"></div>

          <div class="flex justify-between items-center px-5 mb-4 shrink-0">
            <h3 class="font-bold text-lg text-gray-900">{{ title }}</h3>
            <button @click="handleClose" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="px-5 overflow-y-auto flex-1 pb-10">
            <div v-if="photos && photos.length > 0" class="grid grid-cols-2 gap-3">
              <div 
                v-for="(photo, index) in photos" 
                :key="index" 
                @click="openPreview(photo)"
                class="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-200"
              >
                <NuxtImg 
                  :src="photo" 
                  :alt="`Galeri foto ${index + 1}`"
                  class="w-full h-full object-cover"
                  format="webp"
                  loading="lazy"
                />
              </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center h-full text-center opacity-50 py-10">
              <i class="fa-regular fa-image text-4xl mb-2 text-gray-400"></i>
              <p class="text-sm font-medium text-gray-500">Belum ada foto tambahan</p>
            </div>
          </div>

        </div>
      </transition>
    </div>
  </Teleport>

  <Teleport to="body">
    <div class="fixed inset-0 z-[110] flex justify-center items-center" v-if="isPreviewOpen">
      
      <transition name="fade" appear>
        <div class="absolute inset-0 bg-black/95 backdrop-blur-md" @click="closePreview"></div>
      </transition>

      <button @click="closePreview" class="absolute top-5 right-5 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition z-20">
        <i class="fa-solid fa-xmark text-xl"></i>
      </button>

      <transition name="zoom" appear>
        <NuxtImg 
          :src="selectedPreviewImage" 
          alt="Preview Foto Layar Penuh"
          class="relative z-10 w-full h-full max-h-[85vh] object-contain px-4"
          format="webp"
          loading="lazy"
        />
      </transition>
      
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  photos: { type: Array, default: () => [] },
  title: { type: String, default: 'Galeri Foto' }
})

const emit = defineEmits(['close'])

// --- Logic Pengunci Scroll (Otomatis jalan saat isOpen berubah) ---
const scrollPosition = ref(0)

watch(() => props.isOpen, (newVal) => {
  if (typeof document !== 'undefined') {
    if (newVal) {
      // Modal Terbuka -> Kunci body
      scrollPosition.value = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPosition.value}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden' 
    } else {
      // Modal Tertutup -> Lepaskan body
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo({ top: scrollPosition.value, behavior: 'instant' })
    }
  }
})

// Pastikan body dilepas jika komponen hancur secara mendadak
onUnmounted(() => {
  if (typeof document !== 'undefined' && props.isOpen) {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
  }
})

const handleClose = () => {
  emit('close')
}

// --- Logic Modal Preview Fullscreen ---
const isPreviewOpen = ref(false)
const selectedPreviewImage = ref(null)

const openPreview = (photoUrl) => {
  selectedPreviewImage.value = photoUrl
  isPreviewOpen.value = true
}

const closePreview = () => {
  isPreviewOpen.value = false
  setTimeout(() => {
    selectedPreviewImage.value = null
  }, 300)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.zoom-enter-active, .zoom-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.zoom-enter-from, .zoom-leave-to { opacity: 0; transform: scale(0.95); }
</style>