export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('access_token').value

  if (!token) { return navigateTo('/auth/signin') };

  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    const decoded = JSON.parse(jsonPayload)
    const currentTime = Math.floor(Date.now() / 1000)

    if (decoded.exp && decoded.exp < currentTime) {
      useCookie('access_token').value = null
      return navigateTo('/auth/signin')
    }

    if (decoded.roles !== 'customer') {
      return navigateTo('/auth/signin')
    }

  } catch (error) {
    console.error('Invalid JWT Token:', error)
    useCookie('access_token').value = null
    return navigateTo('/auth/signin')
  }
})