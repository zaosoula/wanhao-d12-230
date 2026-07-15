// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-11',
  ssr: false,
  css: ['~/assets/css/tailwind.css'],
  alias: {
    '@/utils': resolve(process.cwd(), './app/lib/utils.ts'),
    '@/lib': resolve(process.cwd(), './app/lib'),
    '@/components': resolve(process.cwd(), './app/components')
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
  devtools: { enabled: true }
})
