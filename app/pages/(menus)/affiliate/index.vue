<template>
  <div class="min-h-screen bg-[#F9FAFB] pb-10">
    <MobileHeaderDefault title="Program Afiliasi" backTo="/profile" hideSearch />

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-[#145C34] mb-3"></i>
      <p class="text-xs font-medium text-gray-500">Memeriksa status afiliasi...</p>
    </div>

    <AfterJoin v-else-if="isJoined" :progressQuantity="progressQuantity" />

    <BeforeJoin v-else @joined="isJoined = true" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCookie, useRuntimeConfig } from '#imports'
import BeforeJoin from '~/pages/(menus)/affiliate/_BeforeJoin.vue'
import AfterJoin from '~/pages/(menus)/affiliate/_AfterJoin.vue'

const config = useRuntimeConfig()
const authCookie = useCookie('access_token')

const isLoading = ref(true)
const isJoined = ref(false)
const progressQuantity = ref(0)

const checkAffiliateStatus = async () => {
  if (!authCookie.value) {
    isLoading.value = false
    return
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/profile/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authCookie.value}`,
        'Accept': 'application/json'
      }
    })

    const profileData = response?.data

    if (profileData?.is_affiliate === 1 || profileData?.is_affiliate === true) {
      isJoined.value = true
      progressQuantity.value = Number(profileData?.progress_quantity || 0)
    }
  } catch (error) {
    console.error('Gagal mengecek status afiliasi:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  checkAffiliateStatus()
})
</script>