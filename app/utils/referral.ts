const REFERRAL_SESSION_KEY = 'infiswap_referral_code';

export function normalizeReferralCode(raw: unknown): string | null {
    if (typeof raw !== 'string') {
        return null;
    }

    const normalized = raw.trim().toUpperCase();

    return normalized.length === 6 ? normalized : null;
}

export function readReferralFromRoute(query: Record<string, unknown>): string | null {
    const raw = query.referral;

    if (typeof raw === 'string') {
        return normalizeReferralCode(raw);
    }

    if (Array.isArray(raw) && typeof raw[0] === 'string') {
        return normalizeReferralCode(raw[0]);
    }

    return null;
}

export function persistReferralCode(code: string): void {
    if (!import.meta.client) {
        return;
    }

    sessionStorage.setItem(REFERRAL_SESSION_KEY, code);
}

export function consumePersistedReferralCode(): string | null {
    if (!import.meta.client) {
        return null;
    }

    const stored = sessionStorage.getItem(REFERRAL_SESSION_KEY);

    return stored ? normalizeReferralCode(stored) : null;
}

export function clearReferralCode(): void {
    if (!import.meta.client) {
        return;
    }

    sessionStorage.removeItem(REFERRAL_SESSION_KEY);
}

export function formatReferrerDisplay(firstname: string, lastInitial: string): string {
    const initial = lastInitial.trim().charAt(0);

    return initial ? `${firstname.trim()} ${initial}.` : firstname.trim();
}

export type ReferralPreviewResponse = {
    valid: boolean;
    referrer: {
        firstname: string;
        lastInitial: string;
    };
};
