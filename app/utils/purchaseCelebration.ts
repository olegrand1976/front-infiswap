export const PURCHASE_CELEBRATION_SEEN_PREFIX = 'infiswap:celebration_seen:';
export const PURCHASE_ANALYTICS_SEEN_PREFIX = 'infiswap:analytics_seen:';
export const PROCESSED_ACCESS_SESSION_KEY = 'infiswap:processed_access_session';
export const LIFETIME_CELEBRATION_SEEN_KEY = 'infiswap:lifetime_celebration_seen';

export type PurchaseCelebrationVariant = 'platform_access' | 'boost' | 'contract';

export interface PurchaseCelebrationPayload {
    variant: PurchaseCelebrationVariant;
    replacementId?: number;
    redirectTo?: string;
    dedupeKey: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    planDays?: number | null;
}

export function buildCelebrationSeenKey(dedupeKey: string): string {
    return `${PURCHASE_CELEBRATION_SEEN_PREFIX}${dedupeKey}`;
}

export function isCelebrationSeen(dedupeKey: string, storageValue: string | null): boolean {
    return storageValue === dedupeKey;
}

export function buildAnalyticsSeenKey(variant: PurchaseCelebrationVariant, sessionId: string): string {
    return `${PURCHASE_ANALYTICS_SEEN_PREFIX}${variant}:${sessionId}`;
}

export function shouldTrackPurchaseAnalytics(sessionId: string, storageValue: string | null): boolean {
    return storageValue !== sessionId;
}

export function buildBoostCelebrationDedupeKey(replacementId: number, sessionId?: string | null): string {
    if (sessionId) {
        return `boost:${sessionId}`;
    }

    return `boost:${replacementId}`;
}

export function buildContractCelebrationDedupeKey(replacementId: number, sessionId?: string | null): string {
    if (sessionId) {
        return `contract:${sessionId}`;
    }

    return `contract:${replacementId}`;
}
