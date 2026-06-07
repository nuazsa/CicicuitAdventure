<template>
	
	<div class="flex-1 flex flex-col items-center justify-center px-8 pb-20 pt-10">
		<div class="relative w-64 h-64 mb-6">
			<div class="absolute inset-0 bg-[#145C34] blur-3xl opacity-10 rounded-full mix-blend-multiply"></div>

			<NuxtImg src="/error-404.png" alt="Error 404" width="500" height="500"
				class="relative z-10 w-full h-full object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500" />
		</div>

		<h2 class="text-[22px] font-extrabold text-gray-900 text-center mb-3">
			Ups, Belum Tersedia! 🚧
		</h2>

		<p class="text-[13px] text-gray-500 text-center leading-relaxed mb-8">
			Fitur ini sedang diracik oleh tim Cicicuit Adventure biar persiapan muncakmu makin gampang. Pantau terus ya!
		</p>

		<button @click="$router.push('/')"
			class="bg-[#145C34] text-white w-full py-3.5 rounded-xl font-bold text-[13px] hover:bg-green-800 transition shadow-md shadow-green-900/20 flex items-center justify-center gap-2">
			<i class="fa-solid fa-house"></i> Kembali ke Beranda
		</button>

		<button @click="$router.back()"
			class="mt-3 text-gray-500 hover:text-[#145C34] text-[13px] font-bold py-2 transition-colors">
			Kembali ke Halaman Sebelumnya
		</button>

	</div>
</template>

<script setup>
// Menggunakan fungsi $router bawaan Nuxt/Vue3 di template untuk navigasi (go back & push ke home).
// Tidak ada state khusus yang dibutuhkan untuk halaman statis ini.
</script>