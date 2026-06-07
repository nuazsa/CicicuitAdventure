<template>
	<MobileCardBase class="bg-white p-4">
		<h3 class="text-[11px] font-bold text-gray-500 mb-3 tracking-wider uppercase">Informasi Pendakian</h3>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<p class="text-[10px] text-gray-500 mb-1">Meeting Point</p>
				<p class="text-[13px] font-medium text-gray-800 leading-snug" v-html="meetingPoint"></p>
			</div>
			<div>
				<p class="text-[10px] text-gray-500 mb-1">Waktu Kumpul</p>
				<p class="text-[13px] font-medium text-gray-800 leading-snug">{{ meetingTime }}
				</p>
			</div>
		</div>
	</MobileCardBase>
</template>

<script setup>
defineProps({
	meetingPoint: {
		type: String,
		required: true
	},
	meetingTime: {
		type: String,
		required: true
	}
})
</script>