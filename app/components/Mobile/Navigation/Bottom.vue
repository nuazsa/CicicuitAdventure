<template>
    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex justify-around py-3 z-50">
      <router-link 
        v-for="item in bottomNav" 
        :key="item.label"
        :to="item.path"
        class="flex flex-col items-center gap-1 cursor-pointer transition-colors px-4 py-1.5 rounded-2xl"
        :class="route.path === item.path ? 'bg-[#E8F5E9] text-[#145C34]' : 'text-gray-400 hover:text-gray-700'"
      >
        <i :class="[item.icon, 'text-lg', route.path === item.path ? 'text-[#145C34]' : '']"></i>
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </router-link>
    </nav>
</template>

<script setup>
const route = useRoute()
// Data Navigasi Bawah
const bottomNav = [
  { label: 'Beranda', icon: 'fa-solid fa-house', path: '/' },
  { label: 'Pesanan', icon: 'fa-solid fa-ticket', path: '/orders' },
  { label: 'Promo', icon: 'fa-solid fa-tag', path: '/promotions' },
  { label: 'Profil', icon: 'fa-regular fa-user', path: '/profile' }
]
</script>