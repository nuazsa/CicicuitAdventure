export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authCookie = useCookie('access_token')
  const affCookie = useCookie('affiliate_code')

  const syncAttribution = async () => {
    if (!authCookie.value || !affCookie.value) return

    try {
      await $fetch(`${config.public.apiBaseUrl}/affiliate/attribution`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authCookie.value}`,
          'Accept': 'application/json'
        },
        body: {
          short_code: affCookie.value
        }
      })

      affCookie.value = null
    } catch (err) {
      if (err?.response?.status === 400) {
        affCookie.value = null
      }
    }
  }

  watch(
    () => authCookie.value,
    (newToken) => {
      if (newToken && affCookie.value) {
        syncAttribution()
      }
    },
    { immediate: true }
  )
})