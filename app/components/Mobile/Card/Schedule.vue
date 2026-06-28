<template>
  <div>
    <MobileCardBase class="overflow-hidden">
      <div class="bg-[#145C34] px-4 py-3.5 flex justify-between items-center">
        <div class="flex items-center gap-3 text-white">
          <i class="fa-regular fa-calendar-days text-xl opacity-90"></i>
          <div>
            <p class="text-sm font-bold">
              {{ isStatic ? staticDateRange : displayDateRange }}
            </p>
            <p class="text-[11px] opacity-80">
              {{ isStatic ? staticDuration : displayDuration }}
            </p>
          </div>
        </div>
        
        <button v-if="!isStatic" @click="openCalendarModal"
          class="bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-orange-600 transition shadow-sm">
          Ubah
        </button>
        <span v-else class="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold border border-white/30">
          Jadwal Tetap
        </span>
      </div>

      <div class="px-4 py-4 bg-white flex justify-between items-center">
        <div>
          <h3 class="text-[15px] font-bold text-gray-800">{{ counterLabel }}</h3>
          <p class="text-[10px] text-gray-500 mt-0.5">{{ counterSubLabel }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="decrementCounter"
            class="w-7 h-7 bg-[#145C34] text-white rounded-full flex items-center justify-center hover:bg-green-800 transition">
            <i class="fa-solid fa-minus text-xs"></i>
          </button>
          <span class="text-lg font-bold text-gray-800 w-4 text-center">{{ modelValue }}</span>
          <button @click="incrementCounter"
            class="w-7 h-7 bg-[#145C34] text-white rounded-full flex items-center justify-center hover:bg-green-800 transition">
            <i class="fa-solid fa-plus text-xs"></i>
          </button>
        </div>
      </div>
    </MobileCardBase>

    <Teleport to="body" v-if="!isStatic">
      <div class="fixed inset-0 z-[100] flex justify-center items-end" v-if="isModalOpen">
        <transition name="fade" appear>
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeCalendarModal"></div>
        </transition>

        <transition name="slide-up" appear>
          <div class="relative w-full max-w-md bg-white rounded-t-3xl pt-4 pb-6 px-0 shadow-2xl z-10 flex flex-col h-[85vh]" @click.stop>
            
            <div class="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 shrink-0"></div>

            <div class="flex justify-between items-center px-6 mb-4 shrink-0">
              <div class="w-12"></div>
              <h3 class="font-bold text-[17px] text-gray-900">Pilih Tanggal</h3>
              <button @click="closeCalendarModal" class="w-12 text-right text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                Batal
              </button>
            </div>

            <div class="grid grid-cols-7 text-center border-y border-gray-100 py-2 mb-4 shrink-0">
              <div v-for="(day, index) in daysOfWeek" :key="day" class="text-xs font-bold" :class="index === 0 ? 'text-red-500' : 'text-gray-800'">
                {{ day }}
              </div>
            </div>

            <div class="px-6 overflow-y-auto flex-1 scrollbar-hide">
              <div class="flex justify-between items-center mb-6 mt-2">
                <h4 class="font-bold text-[19px] text-gray-900">{{ currentMonthName }} {{ currentYear }}</h4>
                <div class="flex gap-2">
                  <button @click="prevMonth" class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
                    <i class="fa-solid fa-chevron-left text-[10px]"></i>
                  </button>
                  <button @click="nextMonth" class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-7 gap-y-3">
                <div v-for="day in calendarDays" :key="day.date.toISOString()" class="relative flex justify-center items-center h-10">
                  <div v-if="isInRange(day.date)" class="absolute inset-0 bg-[#E8F5E9] w-full h-full" :class="{ 'rounded-l-full': isStartDate(day.date), 'rounded-r-full': isEndDate(day.date) }"></div>
                  
                  <button @click="selectDate(day.date)"
                    class="relative z-10 w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all"
                    :class="[
                      !day.isCurrentMonth ? 'text-gray-300' : 'text-gray-800',
                      (isStartDate(day.date) || isEndDate(day.date)) ? 'bg-[#145C34] text-white shadow-md' : 'hover:bg-gray-100',
                      (day.date.getDay() === 0 && day.isCurrentMonth && !isStartDate(day.date) && !isEndDate(day.date)) ? 'text-red-500' : ''
                    ]">
                    {{ day.date.getDate() }}
                    <span v-if="isToday(day.date)" class="absolute -top-4 text-[9px] font-bold text-blue-600">Today</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="px-6 pt-4 pb-2 mt-auto shrink-0 bg-white border-t border-gray-50">
              <div class="flex justify-between items-center mb-6">
                <div class="w-[40%]">
                  <p class="text-[12px] text-gray-500 mb-1">Check-in</p>
                  <p class="font-bold text-[15px] text-gray-900">{{ formattedStartDate }}</p>
                </div>
                <div class="w-[20%] flex items-center justify-center">
                  <div class="w-full border-t border-dashed border-gray-300"></div>
                </div>
                <div class="w-[40%] text-right">
                  <p class="text-[12px] text-gray-500 mb-1">Check-out</p>
                  <p class="font-bold text-[15px] text-gray-900">{{ formattedEndDate }}</p>
                </div>
              </div>

              <button @click="saveDateSelection" :disabled="!startDate || !endDate"
                class="w-full py-3.5 rounded-full font-bold text-sm transition shadow-md"
                :class="startDate && endDate ? 'bg-[#145C34] text-white hover:bg-green-800 shadow-green-900/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'">
                Simpan <span v-if="nightCount > 0">( {{ nightCount }} Malam )</span>
              </button>
            </div>

          </div>
        </transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// --- Definisi Props & Emits ---
const props = defineProps({
  isStatic: { type: Boolean, default: false },
  staticDateRange: { type: String, default: '' },
  staticDuration: { type: String, default: '' },
  counterLabel: { type: String, default: 'Jumlah Pax' },
  counterSubLabel: { type: String, default: '' },
  modelValue: { type: Number, default: 1 }
})

const emit = defineEmits(['update:modelValue', 'dateSelected'])

// --- Counter Logic ---
const incrementCounter = () => emit('update:modelValue', props.modelValue + 1)
const decrementCounter = () => {
  if (props.modelValue > 1) emit('update:modelValue', props.modelValue - 1)
}

// --- General State ---
const scrollPosition = ref(0)
const displayDateRange = ref('Pilih Tanggal')
const displayDuration = ref('- Hari, - Malam')

// --- Calendar Modal State ---
const isModalOpen = ref(false)
const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const today = new Date()
today.setHours(0, 0, 0, 0)

const currentViewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const startDate = ref(null)
const endDate = ref(null)

// --- Calendar Computed Properties ---
const currentMonthName = computed(() => monthNames[currentViewDate.value.getMonth()])
const currentYear = computed(() => currentViewDate.value.getFullYear())

const calendarDays = computed(() => {
  const year = currentViewDate.value.getFullYear()
  const month = currentViewDate.value.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const days = []

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }
  const remainingCells = 42 - days.length
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
  }
  return days
})

const nightCount = computed(() => {
  if (startDate.value && endDate.value) {
    const diffTime = Math.abs(endDate.value - startDate.value)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
  return 0
})

const formattedStartDate = computed(() => startDate.value ? formatDateString(startDate.value) : '-')
const formattedEndDate = computed(() => endDate.value ? formatDateString(endDate.value) : '-')

// --- Calendar Functions ---
const openCalendarModal = () => {
  if(props.isStatic) return 

  isModalOpen.value = true
  if (typeof document !== 'undefined') {
    scrollPosition.value = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollPosition.value}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden' 
  }
}

const closeCalendarModal = () => {
  isModalOpen.value = false
  if (typeof document !== 'undefined') {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    window.scrollTo({ top: scrollPosition.value, behavior: 'instant' })
  }
}

const prevMonth = () => currentViewDate.value = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth() - 1, 1)
const nextMonth = () => currentViewDate.value = new Date(currentViewDate.value.getFullYear(), currentViewDate.value.getMonth() + 1, 1)

const selectDate = (date) => {
  if (!startDate.value || (startDate.value && endDate.value)) {
    startDate.value = date
    endDate.value = null
  } else if (date < startDate.value) {
    startDate.value = date
  } else {
    endDate.value = date
  }
}

const isToday = (date) => date.getTime() === today.getTime()
const isStartDate = (date) => startDate.value && date.getTime() === startDate.value.getTime()
const isEndDate = (date) => endDate.value && date.getTime() === endDate.value.getTime()
const isInRange = (date) => {
  if (startDate.value && endDate.value) {
    return date.getTime() >= startDate.value.getTime() && date.getTime() <= endDate.value.getTime()
  }
  return false
}

const saveDateSelection = () => {
  if (startDate.value && endDate.value) {
    const startStr = formatShortDate(startDate.value)
    const endStr = formatShortDate(endDate.value)
    
    displayDateRange.value = `${startStr} - ${endStr} ${endDate.value.getFullYear()}`
    
    const nights = nightCount.value
    const days = nights + 1
    displayDuration.value = `${days} Hari, ${nights} Malam`
    
    // Kirim data tanggal ke parent (halaman detail) jika dibutuhkan nanti
    emit('dateSelected', {
      startDate: startDate.value,
      endDate: endDate.value,
      dateRangeStr: displayDateRange.value,
      durationStr: displayDuration.value
    })
    
    closeCalendarModal()
  }
}

// --- Utilities ---
const formatDateString = (date) => {
  const d = date.getDate().toString().padStart(2, '0')
  const m = monthNames[date.getMonth()].substring(0, 3)
  const y = date.getFullYear()
  return `${d} ${m} ${y}`
}

const formatShortDate = (date) => {
  const d = date.getDate()
  const m = monthNames[date.getMonth()].substring(0, 3)
  return `${d} ${m}`
}
</script>

<style scoped>
/* Animations for the Modal */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

/* Hide scrollbar for clean UI */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>