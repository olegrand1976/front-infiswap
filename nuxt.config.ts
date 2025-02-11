export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss',     process.env.NODE_ENV !== 'production' ? '@nuxt/eslint' : null, process.env.NODE_ENV !== 'production' ? 'shadcn-nuxt' : null, '@nuxt/image', 'nuxt-swiper', '@pinia/nuxt'],
    imports: {
        dirs: [
            './utils',
            'composables',
        ],
    },
    devtools: { enabled: process.env.NODE_ENV !== 'production' },
    app: {
        head: {
            titleTemplate: '%s | InfiSwap',
            meta: [
                {
                    name: 'description',
                    content:
                        'Nos infirmiers sont aussi souvent sur les routes et se déplacent de patients à patients pendant leurs tournées qui sont planifiées de semaine en semaine.',
                },
                {
                    name: 'keywords',
                    content: 'infiswap, infirmier, remplacement, tournée',
                },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
                },
            ],
        },
    },

    runtimeConfig: {
        public: {
            API_URL: process.env.API_URL,
            FRONT_END_URL: process.env.FRONT_END_URL,
        },
    },
    routeRules: {
        '/': { prerender: true },
    },
    compatibilityDate: '2025-01-10',
    nitro: {
        prerender: {
            routes: [
                '/',
                '/about',
                '/contact',
                '404',
            ],
        },
    },
    typescript: {
        strict: false,
    },
    image: {
        dir: 'assets/images',
    },
    shadcn: {
        /**
       * Prefix for all the imported component
       */
        prefix: '',
        /**
       * Directory that the component lives in.
       * @default "./components/ui"
       */
        componentDir: './components/ui',
    },
    build: {
        // Active la minification pour JS et CSS
        optimization: {
            minimize: true,
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            }
        }
        // Vous pouvez activer ou désactiver les sourcemaps selon vos besoins :
        // sourcemap: process.env.NODE_ENV !== 'production'
    },
    vite: {
        // Vous pouvez configurer ici d'autres options relatives au CSS si nécessaire
        css: {
            // Exemple : désactiver les sourcemaps CSS en production
            devSourcemap: false
        },
        build: {
            // Optionnel : utiliser esbuild pour minifier le CSS
            minify: 'esbuild'
        }
    }
});
