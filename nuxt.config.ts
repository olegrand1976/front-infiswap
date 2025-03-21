export default defineNuxtConfig({
    modules: [
      '@nuxtjs/tailwindcss',
      '@zadigetvoltaire/nuxt-gtm',
      process.env.NODE_ENV !== 'production' ? '@nuxt/eslint' : null,
      process.env.NODE_ENV !== 'production' ? 'shadcn-nuxt' : null,
      '@nuxt/image'
    ].filter(Boolean),
  
    plugins: [],
  
    imports: {
      dirs: [
        './utils',
        'composables'
      ]
    },
  
    // Active les devtools uniquement en développement
    devtools: { enabled: process.env.NODE_ENV === 'development' },
  
    app: {
      baseURL: '/',
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
            href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap'
          },
          {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap'
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
      // sourcemap: process.env.NODE_ENV !== 'production', // Optionnel
    },
  
    routeRules: {
      '/': { prerender: true }
    },
  
    compatibilityDate: '2025-01-10',
  
    nitro: {
      prerender: {
        routes: [
          '/',
          '/about',
          '/contact'
        ]
      }
    },
  
    vite: {
      css: {
        // Désactiver les sourcemaps CSS en production
        devSourcemap: false
      },
      build: {
        // Utiliser esbuild pour minifier (rapide)
        minify: 'esbuild'
      }
    },
  
    gtm: {
      id: 'GTM-KFBFVVR3',
      queryParams: {
        gtm_auth: 'AB7cDEf3GHIjkl-MnOP8qr',
        gtm_preview: 'env-4',
        gtm_cookies_win: 'x'
      },
      defer: false,
      compatibility: false,
      nonce: '2726c7f26c',
      enabled: true,
      debug: process.env.NODE_ENV !== 'production',
      loadScript: true,
      enableRouterSync: true,
      ignoredViews: ['dashboard'],
      trackOnNextTick: true,
      // Conditionner les devtools à l'environnement de développement
      devtools: process.env.NODE_ENV !== 'production'
    },
  
    image: {
      provider: 'ipx',
      dir: 'public/images',
      domains: ['localhost'],
      format: ['webp', 'jpg', 'png']
    },
    
    shadcn: {
      prefix: '',
      componentDir: './components/ui'
    }
  });
  