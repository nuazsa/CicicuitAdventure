<template>
	<header
		class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md px-5 flex items-center z-50 transition-all duration-300"
		:class="isScrolled ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm' : 'py-5 bg-transparent'">
		<div class="w-10 flex justify-start">
			<button @click="router.push(backTo)" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 transition shrink-0"
				:class="isScrolled ? 'bg-transparent hover:bg-gray-100' : 'bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white'">
				<i class="fa-solid fa-arrow-left text-lg"></i>
			</button>
		</div>

		<h1 class="flex-1 text-[15px] font-bold text-gray-800 text-center transition-opacity duration-300 px-2 line-clamp-1"
			:class="isScrolled ? 'opacity-100' : 'opacity-0'">
			{{ title }}
		</h1>

		<div class="w-10 flex justify-end">
			<button class="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 transition shrink-0"
				:class="isScrolled ? 'bg-transparent hover:bg-gray-100' : 'bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white'">
				<i class="fa-solid fa-share-nodes text-lg"></i>
			</button>
		</div>
	</header>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    default: 'Promo Menarik'
  },
  backTo: {
    type: String,
    default: ''
  }
})

const router = useRouter()

// --- State Management ---
const isScrolled = ref(false)

const handleScroll = () => {
  // Sets isScrolled to true if scrolled past 50 pixels
  isScrolled.value = window.scrollY > 50
}

// --- Lifecycle Hooks ---
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>