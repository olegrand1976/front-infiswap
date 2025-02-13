export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@zadigetvoltaire/nuxt-gtm',
        process.env.NODE_ENV !== 'production' ? '@nuxt/eslint' : null,
        process.env.NODE_ENV !== 'production' ? 'shadcn-nuxt' : null,
        '@nuxt/image',
        'nuxt-swiper',
    ].filter(Boolean),
    plugins: [
        '~/plugins/vee-validate.js', // Ajouter le plugin ici
    ],

    imports: {
        dirs: [
            './utils',
            'composables',
        ],
    },

    // Active les devtools uniquement en développement
    devtools: { enabled: false },

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

    // Autres optimisations de build (minification, etc.)
    build: {
        optimization: {
            minimize: true,
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
        // sourcemap: process.env.NODE_ENV !== 'production', // Optionnel
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
            ],
        },
    },

    vite: {
        css: {
        // Désactiver les sourcemaps CSS en production
            devSourcemap: false,
        },
        build: {
        // Utiliser esbuild pour minifier (rapide)
            minify: 'esbuild',
        },
    },

    typescript: {
        strict: false,
    },
    gtm: {
        id: 'GTM-KFBFVVR3',
        queryParams: {
            gtm_auth: 'AB7cDEf3GHIjkl-MnOP8qr',
            gtm_preview: 'env-4',
            gtm_cookies_win: 'x',
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
        devtools: true,
    },
    image: {
        dir: 'assets/images',
    },

    shadcn: {
        prefix: '',
        componentDir: './components/ui',
    },
});
