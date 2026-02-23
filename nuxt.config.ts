import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    modules: [
        '@saslavik/nuxt-gtm',
        'nuxt-gtag',
        process.env.NODE_ENV !== 'production' ? '@nuxt/eslint' : null,
        'shadcn-nuxt',
        '@nuxt/image',
        process.env.NODE_ENV === 'production' ? 'nuxt-meta-pixel' : null,
    ].filter(Boolean),
    plugins: [
    ],
    components: [
        '~/components/ui',
        '~/components',
    ],
    imports: {
        dirs: [
            './utils',
            'composables',
            'components/ui',
            'components',
        ],
        autoImport: true,
    },
    devtools: { enabled: process.env.NODE_ENV === 'development' },

    app: {
        baseURL: '/',
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
                    href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap',
                },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap',
                },
            ],
        },
    },
    css: [
        './app/assets/css/tailwind.css',
    ],
    runtimeConfig: {
        public: {
            API_URL: process.env.API_URL,
            FRONT_END_URL: process.env.FRONT_END_URL,
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            MAINTENANCE_MODE: process.env.MAINTENANCE_MODE === 'true' || false,
            metapixel: {
                default: {
                    id: '1687858552113266',
                    pageView: '**',
                },
            },
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
            failOnError: false,
        },
    },

    vite: {
        plugins: [
            tailwindcss(),
        ],
        css: {
            devSourcemap: false,
        },
        build: {
            minify: 'esbuild',
        },
    },
    gtag: {
        id: 'G-CKSFK6XYTZ',
        enabled: process.env.NODE_ENV === 'production',
    },
    gtm: {
        id: 'GTM-KFBFVVR3',
        defer: false,
        compatibility: false,
        enabled: process.env.NODE_ENV == 'production',
        debug: process.env.NODE_ENV !== 'production',
        loadScript: true,
        enableRouterSync: true,
        ignoredViews: ['dashboard'],
        trackOnNextTick: true,
        devtools: process.env.NODE_ENV !== 'production',
    },

    server: {
        host: '0.0.0.0',
        port: 3000,
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
});
