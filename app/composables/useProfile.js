export const useProfile = () => {
  const config = useRuntimeConfig()
  const token = useCookie('access_token')

  const profileData = useState('global-profile-data', () => null)
  const isProfileLoading = useState('global-profile-loading', () => false)

  const fetchProfile = async (forceRefetch = false) => {
    if (profileData.value && !forceRefetch) return

    isProfileLoading.value = true
    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/profile/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}` 
        }
      })

      if (response.statusCode === 200) {
        profileData.value = response.data
      }
    } catch (error) {
      console.error('Gagal mengambil data profil:', error)
    } finally {
      isProfileLoading.value = false
    }
  }

  const clearProfileState = () => {
    profileData.value = null
  }

  return {
    profileData,
    isProfileLoading,
    fetchProfile,
    clearProfileState
  }
}