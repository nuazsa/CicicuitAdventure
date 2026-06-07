<template>
  <MobileCardBase class="bg-white p-4">
    <div class="flex items-center justify-between border-b border-gray-50 pb-3 mb-3 cursor-pointer group">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-[#145C34] text-white rounded-full flex items-center justify-center font-bold text-lg">
          {{ score }}
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-800">
            {{ category }}
          </h3>
          <p class="text-[11px] text-gray-500">
            {{ reviewCount }} ulasan pendaki
          </p>
        </div>
      </div>
      <i class="fa-solid fa-chevron-right text-gray-400 group-hover:text-gray-600 transition text-sm"></i>
    </div>
    <div class="flex items-start gap-3">
      <div
        class="w-8 h-8 bg-[#F58220] text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-1">
        {{ topReview.userInitial }}
      </div>
      <div>
        <div class="flex text-[#F58220] text-[10px] gap-0.5 mb-1">
          <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
        </div>
        <p class="text-[12px] text-gray-700 italic leading-snug">
          "{{ topReview.comment }}"
        </p>
      </div>
    </div>
  </MobileCardBase>
</template>

<script setup>
defineProps({
  score: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  reviewCount: {
    type: Number,
    required: true
  },
  topReview: {
    type: Object,
    required: true
  }
})
</script>