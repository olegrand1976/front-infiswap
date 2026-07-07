import {
    buildRevealPayload,
    LIFETIME_BADGE_REVEAL_STORAGE_KEY,
    shouldPlayRevealFromStorage,
} from '~/utils/lifetimeBadgeReveal';

export function useLifetimeBadgeReveal() {
    const isRevealPending = useState('lifetimeBadgeRevealPending', () => false);

    function triggerLifetimeBadgeReveal(): void {
        if (import.meta.client) {
            sessionStorage.setItem(LIFETIME_BADGE_REVEAL_STORAGE_KEY, buildRevealPayload(Date.now()));
        }
        isRevealPending.value = true;
    }

    function shouldPlayRevealAnimation(): boolean {
        if (!import.meta.client) {
            return isRevealPending.value;
        }

        const raw = sessionStorage.getItem(LIFETIME_BADGE_REVEAL_STORAGE_KEY);

        if (raw && shouldPlayRevealFromStorage(raw, Date.now())) {
            return true;
        }

        return isRevealPending.value;
    }

    function consumeRevealAnimation(): void {
        if (import.meta.client) {
            sessionStorage.removeItem(LIFETIME_BADGE_REVEAL_STORAGE_KEY);
        }
        isRevealPending.value = false;
    }

    return {
        isRevealPending,
        triggerLifetimeBadgeReveal,
        shouldPlayRevealAnimation,
        consumeRevealAnimation,
    };
}
