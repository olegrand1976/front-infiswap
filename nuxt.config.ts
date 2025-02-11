export default defineNuxtConfig({
    // Le tableau des modules conditionnels est filtré pour ne conserver que les valeurs truthy.
    modules: [
      '@nuxtjs/tailwindcss',
      process.env.NODE_ENV !== 'production' && '@nuxt/eslint',
      process.env.NODE_ENV !== 'production' && 'shadcn-nuxt',
      '@nuxt/image',
      'nuxt-swiper',
      '@pinia/nuxt'
    ].filter(Boolean),
  
    // Importation automatique depuis les dossiers spécifiés
    imports: {
      dirs: [
        './utils',
        'composables'
      ]
    },
  
    // Active les devtools uniquement en développement
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
      }
    },
  
    typescript: {
      strict: false
    },
  
    image: {
      dir: 'assets/images'
    },
  
    shadcn: {
      // Préfixe pour tous les composants importés
      prefix: '',
      // Répertoire des composants (par défaut "./components/ui")
      componentDir: './components/ui'
    },
  
    build: {
      // Optimisation du JavaScript et CSS en production
      optimization: {
        minimize: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      }
      // Optionnel : vous pouvez activer ou désactiver les sourcemaps selon vos besoins
      // sourcemap: process.env.NODE_ENV !== 'production'
    },
  
    vite: {
      css: {
        // Désactive les sourcemaps CSS en production
        devSourcemap: false
      },
      build: {
        // Utilise esbuild pour la minification (optionnel, mais généralement très rapide)
        minify: 'esbuild'
      }
    }
  });
  