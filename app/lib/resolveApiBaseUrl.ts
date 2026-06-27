type RuntimeConfigLike = {
    apiUrlInternal?: string;
    public: {
        API_URL?: string;
    };
};

/**
 * URL de base pour $apifetch / CSRF.
 * - SSR : API directe (réseau Docker / host interne).
 * - Client dev : aligne le hostname API sur celui de la page (localhost ≠ 127.0.0.1).
 * - Client prod : URL publique API.
 */
export function resolveApiBaseUrl(config: RuntimeConfigLike): string {
    if (import.meta.server) {
        return config.apiUrlInternal || config.public.API_URL || '';
    }

    const configured = config.public.API_URL || '';

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
