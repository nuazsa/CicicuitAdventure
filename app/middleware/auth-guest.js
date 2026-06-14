export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('access_token').value

  if (token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      const decoded = JSON.parse(jsonPayload)
      const currentTime = Math.floor(Date.now() / 1000)

      if (decoded.exp && decoded.exp > currentTime) {
        return navigateTo('/')
      }
    } catch (error) {
      console.error('Token tidak valid:', error)
    }
  }
})