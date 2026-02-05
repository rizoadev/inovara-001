// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  nitro: {
    preset: 'cloudflare-pages'
  },
  
  modules: [
    '@nuxt/ui',
    '@nuxt/icon'
  ],
  
  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons']
  },
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || ''
    }
  },
  
  app: {
    head: {
      title: 'EventHub - Event Registration Platform',
      meta: [
        { name: 'description', content: 'Event registration with QR code tickets and online payment' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#22c55e' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  }
})
