<template>
	<MobileCardBase class="overflow-hidden">
		<div class="bg-[#145C34] px-4 py-3.5 flex justify-between items-center">
			<div class="flex items-center gap-3 text-white">
				<i class="fa-regular fa-calendar-days text-xl opacity-90"></i>
				<div>
					<p class="text-sm font-bold">{{ dateRange }}</p>
					<p class="text-[11px] opacity-80">{{ duration }}</p>
				</div>
			</div>
			<button
				class="bg-[#F58220] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-orange-600 transition shadow-sm">
				Ubah
			</button>
		</div>
		<div class="bg-white px-4 py-4 flex justify-between items-center">
			<div>
				<h3 class="text-[15px] font-bold text-gray-800">Jumlah Porter</h3>
				<p class="text-[10px] text-gray-500 mt-0.5">(Saran: 1 porter / 20kg logistik)</p>
			</div>
			<div class="flex items-center gap-3">
				<button @click="decrementPorter"
					class="w-7 h-7 bg-[#145C34] text-white rounded-full flex items-center justify-center hover:bg-green-800 transition">
					<i class="fa-solid fa-minus text-xs"></i>
				</button>
				<span class="text-lg font-bold text-gray-800 w-4 text-center">{{ porterCount }}</span>
				<button @click="incrementPorter"
					class="w-7 h-7 bg-[#145C34] text-white rounded-full flex items-center justify-center hover:bg-green-800 transition">
					<i class="fa-solid fa-plus text-xs"></i>
				</button>
			</div>
		</div>
	</MobileCardBase>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
	dateRange: {
		type: String,
		required: true
	},
	duration: {
		type: String,
		required: true
	}
})

const porterCount = ref(1)

// --- Functions ---
const incrementPorter = () => {
	porterCount.value++
}

const decrementPorter = () => {
	if (porterCount.value > 1) {
		porterCount.value--
	}
}
</script>