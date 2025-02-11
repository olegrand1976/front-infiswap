export default defineNuxtConfig({
    modules: [
      '@nuxtjs/tailwindcss',
      // Charger @nuxt/eslint uniquement si NODE_ENV n'est pas "production"
      ...(
        process.env.NODE_ENV !== 'production'
          ? ['@nuxt/eslint']
          : []
      ),
      'shadcn-nuxt',
      '@nuxt/image',
      'nuxt-swiper'
    ],
    imports: {
      dirs: [
        './utils',
        'composables'
      ]
    },
    devtools: { enabled: process.env.NODE_ENV !== 'production' },
    app: {
      head: {
        titleTemplate: '%s | InfiSwap',
        meta: [
          {
            name: 'description',
            content:
              'Nos infirmiers sont aussi souvent sur les routes et se déplacent de patients à patients pendant leurs tournées qui sont planifiées de semaine en semaine.'
          },
          {
            name: 'keywords',
            content: 'infiswap, infirmier, remplacement, tournée'
          }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
          {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
          }
        ]
      }
    },
    runtimeConfig: {
      public: {
        API_URL: process.env.API_URL,
        FRONT_END_URL: process.env.FRONT_END_URL
      }
    },
    routeRules: {
      '/': { prerender: true }
    },
    compatibilityDate: '2025-01-10',
    nitro: {
      prerender: {
        routes: ['/', '/about', '/contact', '404']
      },
      compressPublicAssets: true
    },
    typescript: {
      strict: false
    },
    image: {
      dir: 'assets/images'
    },
    shadcn: {
      prefix: '',
      componentDir: './components/ui'
    },
    build: {
      optimization: {
        minimize: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      }
      // sourcemap: process.env.NODE_ENV !== 'production' // Optionnel
    },
    vite: {
      css: {
        devSourcemap: false
      },
      build: {
        minify: 'esbuild'
      }
    }
  });
  