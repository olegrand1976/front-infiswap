type RuntimeConfigLike = {
    apiUrlInternal?: string;
    public: {
        API_URL?: string;
    };
};

export const PROD_API_URL = 'https://back.infiswap.be';
export const STAGING_API_URL = 'https://api-infiswap.ll-it-sc.be';

/**
 * Déduit l'URL API publique depuis le hostname front (prod/staging).
 * Évite les appels vers staging quand un build ou un cache client est obsolète.
 */
export function resolveApiBaseUrlFromHostname(hostname: string): string | null {
    if (hostname === 'infiswap.ll-it-sc.be') {
        return STAGING_API_URL;
    }

    if (/^([a-z0-9-]+\.)?infiswap\.(be|fr)$/i.test(hostname)) {
        return PROD_API_URL;
    }

    return null;
}

/**
 * URL de base pour $apifetch.
 * - SSR : API directe (réseau Docker / host interne).
 * - Client dev : aligne le hostname API sur celui de la page (localhost ≠ 127.0.0.1).
 * - Client prod : URL déduite du hostname front (prioritaire sur runtimeConfig).
 */
export function resolveApiBaseUrl(config: RuntimeConfigLike): string {
    if (import.meta.server) {
        return config.apiUrlInternal || config.public.API_URL || '';
    }

    const configured = config.public.API_URL || '';

    if (!import.meta.dev && typeof window !== 'undefined') {
        const fromHostname = resolveApiBaseUrlFromHostname(window.location.hostname);
        if (fromHostname) {
            return fromHostname;
        }
    }

    if (!import.meta.dev || typeof window === 'undefined' || !configured) {
        return configured;
    }

    try {
        const apiUrl = new URL(configured, window.location.origin);

        if (apiUrl.hostname !== window.location.hostname) {
            apiUrl.hostname = window.location.hostname;
            return apiUrl.origin;
        }
    }
    catch {
        return configured;
    }

    return configured;
}
