<template>
	<div class="flex-1 flex flex-col items-center justify-center px-8 pb-20 pt-10">

		<div class="relative w-64 h-64 mb-6">
			<div class="absolute inset-0 bg-[#F58220] blur-3xl opacity-15 rounded-full mix-blend-multiply"></div>
			
			<NuxtImg 
				src="/error-500.png" 
				alt="Error 500" 
				width="500" 
				height="500"
				loading="eager"
				preload
				class="relative z-10 w-full h-full object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500" 
			/>
		</div>

		<h2 class="text-[22px] font-extrabold text-gray-900 text-center mb-3">
			Waduh, Server Kewalahan! 🤯
		</h2>

		<p class="text-[13px] text-gray-500 text-center leading-relaxed mb-8">
			Maaf ya, sistem Cicicuit Adventure sedang mengalami sedikit gangguan (Error 500). Tim teknisi kami sedang
			berusaha memperbaikinya secepat mungkin.
		</p>

		<button @click="reloadPage"
			class="bg-[#F58220] text-white w-full py-3.5 rounded-xl font-bold text-[13px] hover:bg-orange-600 transition shadow-md shadow-orange-900/20 flex items-center justify-center gap-2 mb-3">
			<i class="fa-solid fa-rotate-right"></i> Coba Muat Ulang
		</button>

		<button @click="$router.push('/')"
			class="bg-white border border-gray-200 text-gray-700 w-full py-3.5 rounded-xl font-bold text-[13px] hover:bg-gray-50 transition flex items-center justify-center gap-2">
			<i class="fa-solid fa-house"></i> Kembali ke Beranda
		</button>

	</div>
</template>

<script setup>
const reloadPage = () => {
	if (typeof window !== 'undefined') {
		window.location.reload()
	}
}
</script>