// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: { 
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css',
        },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
        } 
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL
    }
  },
  // @ts-expect-error Added by the @nuxt/scripts module, whose config type may not be auto-included.
  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-Y488HS8048',
        trigger: 'onNuxtReady',
      }
    }
  },
  
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image', 
    '@nuxt/scripts'
  ]
})