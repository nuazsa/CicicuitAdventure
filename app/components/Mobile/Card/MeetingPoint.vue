<template>
	<div class="mb-6 mt-2">
		<h2 class="text-[15px] font-bold text-gray-800 mb-3">Lokasi Meeting Point</h2>

		<div class="h-44 w-full bg-gray-200 rounded-xl relative overflow-hidden border border-gray-300 shadow-sm">
			<iframe :src="mapUrl" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
				referrerpolicy="no-referrer-when-downgrade">
			</iframe>
		</div>
	</div>
</template>

<script setup>
defineProps({
	 mapUrl: {
		type: String,
		required: true
	}
})
</script>