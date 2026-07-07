import {
    buildCelebrationSeenKey,
    isCelebrationSeen,
    type PurchaseCelebrationPayload,
} from '~/utils/purchaseCelebration';

export function usePurchaseCelebration() {
    const activeCelebration = useState<PurchaseCelebrationPayload | null>('purchaseCelebrationActive', () => null);

    function shouldShowCelebration(dedupeKey: string): boolean {
        if (!import.meta.client) {
            return true;
        }

        const seen = sessionStorage.getItem(buildCelebrationSeenKey(dedupeKey));

        return !isCelebrationSeen(dedupeKey, seen);
    }

    function triggerCelebration(payload: PurchaseCelebrationPayload): boolean {
        if (!shouldShowCelebration(payload.dedupeKey)) {
            return false;
        }

        activeCelebration.value = payload;
        return true;
    }

    function markCelebrationSeen(dedupeKey: string): void {
        if (import.meta.client) {
            sessionStorage.setItem(buildCelebrationSeenKey(dedupeKey), dedupeKey);
        }
    }

    function dismissCelebration(): void {
        activeCelebration.value = null;
    }

    return {
        activeCelebration,
        shouldShowCelebration,
        triggerCelebration,
        markCelebrationSeen,
        dismissCelebration,
    };
}
