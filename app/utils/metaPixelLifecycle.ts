export const META_PIXEL_SCRIPT_ATTR = 'data-infiswap-meta-pixel';

export type MetaPixelHost = {
    fbq?: ((...args: unknown[]) => void) | undefined;
    _fbq?: unknown;
};

/**
 * Decide whether ensureMetaPixel should only grant consent or fully re-inject the script.
 * After revoke the stub may remain without a script tag — that must reinject.
 */
export function resolveMetaPixelEnsureAction(
    hasFbqFunction: boolean,
    hasScript: boolean,
): 'grant_only' | 'reinject' {
    if (hasFbqFunction && hasScript) {
        return 'grant_only';
    }

    return 'reinject';
}

export function clearMetaPixelGlobals(target: MetaPixelHost): void {
    try {
        delete target.fbq;
        delete target._fbq;
    } catch {
        target.fbq = undefined;
        target._fbq = undefined;
    }
}

export function hasAnalyticsConsentFromPrefs(
    preferences: { analytics: boolean } | null,
): boolean {
    return preferences?.analytics === true;
}

export function hasMarketingConsentFromPrefs(
    preferences: { marketing: boolean } | null,
): boolean {
    return preferences?.marketing === true;
}
