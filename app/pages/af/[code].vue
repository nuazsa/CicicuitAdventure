<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-5 text-center">
    <div v-if="pending" class="flex flex-col items-center">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-[#145C34] mb-3"></i>
      <p class="text-xs font-bold text-gray-800">Mengarahkan ke halaman layanan...</p>
      <p class="text-[11px] text-gray-400 mt-1">Mohon tunggu sebentar</p>
    </div>

    <div v-else-if="error" class="flex flex-col items-center max-w-[260px]">
      <div class="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-3">
        <i class="fa-solid fa-link-slash text-xl"></i>
      </div>
      <h3 class="text-sm font-bold text-gray-800">Tautan Tidak Valid</h3>
      <p class="text-[11px] text-gray-500 mt-1 leading-relaxed">
        Link afiliasi tidak ditemukan atau layanan sudah tidak tersedia.
      </p>
      <button 
        @click="navigateTo('/')" 
        class="mt-5 bg-[#145C34] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-green-800 transition"
      >
        Kembali ke Beranda
      </button>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const code = route.params.code
const authCookie = useCookie('access_token')
const affCookie = useCookie('affiliate_code', { maxAge: 60 * 60 * 24 * 7 })

const { data, pending, error } = await useFetch(`${config.public.apiBaseUrl}/affiliate/s/${code}`, {
  method: 'GET',
  server: false,
  headers: {
    'Accept': 'application/json'
  }
})

const recordAttribution = async (shortCode) => {
  if (!authCookie.value || !shortCode) return

  try {
    await $fetch(`${config.public.apiBaseUrl}/affiliate/attribution`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authCookie.value}`,
        'Accept': 'application/json'
      },
      body: {
        short_code: shortCode
      }
    })
    affCookie.value = null
  } catch (err) {
    console.warn('Atribusi afiliasi dilewati:', err?.data?.message || err.message)
  }
}

watchEffect(async () => {
  if (data.value) {
    const result = data.value?.data || data.value
    affCookie.value = code

    if (authCookie.value) {
      await recordAttribution(code)
    }

    const serviceType = result.service_type || result.type || 'open-trip'
    const serviceSlug = result.service_slug || result.slug

    if (serviceSlug) {
      await navigateTo(`/${serviceType}/${serviceSlug}`, { replace: true })
    }
  }
})
</script>