import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
    modules: [
        '@nuxtjs/i18n',
        '@saslavik/nuxt-gtm',
        'nuxt-gtag',
        process.env.NODE_ENV !== 'production' ? '@nuxt/eslint' : null,
        'shadcn-nuxt',
        '@nuxt/image',
        // Meta Pixel: chargé uniquement après consentement marketing (useCookieConsent)
    ].filter(Boolean),
    plugins: [],
    components: ['~/components/ui', '~/components'],
    imports: {
        dirs: ['./utils', 'composables', 'components/ui', 'components'],
        autoImport: true,
    },
    devtools: { enabled: process.env.NODE_ENV === 'development' },

    app: {
        baseURL: '/',
        head: {
            titleTemplate: '%s | InfiSwap',
            meta: [
                // Page-level useHead + i18n overrides these defaults.
                {
                    name: 'description',
                    content: 'InfiSwap — remplacement infirmier BE/FR',
                },
                {
                    name: 'keywords',
                    content: 'infiswap, infirmier, verpleegkundige, remplacement, vervanging',
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
    css: ['./app/assets/css/tailwind.css'],
    runtimeConfig: {
        /** URL API joignable depuis Cloud Run (Run *.run.app) — SSR uniquement */
        apiUrlInternal: process.env.NUXT_API_URL_INTERNAL
            || process.env.API_URL_INTERNAL
            || process.env.API_URL_SSR
            || '',
        public: {
            API_URL: process.env.NUXT_PUBLIC_API_URL || process.env.API_URL,
            FRONT_END_URL: process.env.NUXT_PUBLIC_FRONT_END_URL || process.env.FRONT_END_URL,
            REVERB_APP_KEY: process.env.NUXT_PUBLIC_REVERB_APP_KEY || '',
            REVERB_HOST: process.env.NUXT_PUBLIC_REVERB_HOST || 'localhost',
            REVERB_PORT: process.env.NUXT_PUBLIC_REVERB_PORT || '8080',
            REVERB_SCHEME: process.env.NUXT_PUBLIC_REVERB_SCHEME || 'http',
            MAINTENANCE_MODE: process.env.MAINTENANCE_MODE === 'true' || false,
            metaPixelId: '1687858552113266',
            stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        },
    },

    build: {
        transpile: [],
    },

    i18n: {
        locales: [
            { code: 'fr', language: 'fr-BE', name: 'Français', file: 'fr.json' },
            { code: 'nl', language: 'nl-BE', name: 'Nederlands', file: 'nl.json' },
        ],
        defaultLocale: 'fr',
        strategy: 'prefix_except_default',
        lazy: true,
        langDir: 'locales',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'LANGUAGE',
            redirectOn: 'root',
            fallbackLocale: 'fr',
            alwaysRedirect: false,
        },
        baseUrl: process.env.NUXT_PUBLIC_FRONT_END_URL || 'https://infiswap.ll-it-sc.be',
    },

    routeRules: {
        '/': { prerender: true },
        '/nl': { prerender: true },
        '/about': { prerender: true },
        '/nl/about': { prerender: true },
        '/contact': { prerender: true },
        '/nl/contact': { prerender: true },
        '/pricing': { prerender: true },
        '/nl/pricing': { prerender: true },
        '/dashboard/**': { ssr: false },
        '/nl/dashboard/**': { ssr: false },
        '/acces-plan': { redirect: '/dashboard' },
        '/nl/acces-plan': { redirect: '/nl/dashboard' },
        '/dashboard/subscriptions/create': { redirect: '/dashboard' },
        '/nl/dashboard/subscriptions/create': { redirect: '/nl/dashboard' },
        '/**': {
            headers: {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'SAMEORIGIN',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
                // Report-only CSP: tighten after monitoring violations in staging.
                'Content-Security-Policy-Report-Only':
                    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; frame-src https://js.stripe.com https://hooks.stripe.com; object-src 'none'; base-uri 'self'",
            },
        },
    },

    devServer: {
        host: '0.0.0.0',
        port: 3000,
    },

    experimental: {
        spaLoadingTemplateLocation: 'body',
    },

    compatibilityDate: '2025-01-10',

    nitro: {
        sourceMap: false,
        prerender: {
            crawlLinks: false,
            concurrency: 1,
            interval: 100,
            failOnError: false,
            routes: ['/', '/nl', '/about', '/nl/about', '/contact', '/nl/contact'],
        },
    },
    vite: {
        plugins: [tailwindcss()],
        css: {
            devSourcemap: false,
        },
        build: {
            sourcemap: false,
            minify: 'esbuild',
        },
    },
    gtag: {
        id: 'G-CKSFK6XYTZ',
        enabled: process.env.NODE_ENV === 'production',
        initCommands: [
            ['consent', 'default', {
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                ad_storage: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500,
            }],
        ],
    },
    gtm: {
        id: 'GTM-KFBFVVR3',
        defer: true,
        compatibility: false,
        // Consent Mode default denied (plugin + gtag initCommands). Tags marketing/analytics
        // du container GTM doivent être conditionnés au consentement dans GTM Preview.
        enabled: process.env.NODE_ENV == 'production',
        debug: process.env.NODE_ENV !== 'production',
        loadScript: true,
        enableRouterSync: false,
        trackOnNextTick: true,
        devtools: process.env.NODE_ENV !== 'production',
    },
    image: {
        format: ['webp'],
        densities: [1, 2],
    },
    shadcn: {
    /**
     * Prefix for all the imported component
     */
        prefix: '',
        /**
     * Directory that the component lives in.
     * @default "./app/components/ui"
     */
        componentDir: './app/components/ui',
    },
});
