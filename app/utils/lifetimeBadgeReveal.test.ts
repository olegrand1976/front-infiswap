import { describe, expect, it } from 'vitest';
import {
    buildRevealPayload,
    isRevealExpired,
    parseRevealTimestamp,
    shouldPlayRevealFromStorage,
    LIFETIME_BADGE_REVEAL_TTL_MS,
} from './lifetimeBadgeReveal';

describe('lifetimeBadgeReveal', () => {
    it('builds and parses reveal timestamp', () => {
        const payload = buildRevealPayload(1_700_000_000_000);
        expect(parseRevealTimestamp(payload)).toBe(1_700_000_000_000);
    });

    it('rejects invalid reveal timestamps', () => {
        expect(parseRevealTimestamp(null)).toBeNull();
        expect(parseRevealTimestamp('invalid')).toBeNull();
        expect(parseRevealTimestamp('-1')).toBeNull();
    });

    it('detects expired reveal within TTL', () => {
        const now = 1_700_000_000_000;
        const fresh = buildRevealPayload(now - 30_000);
        expect(shouldPlayRevealFromStorage(fresh, now)).toBe(true);

        const stale = buildRevealPayload(now - LIFETIME_BADGE_REVEAL_TTL_MS);
        expect(shouldPlayRevealFromStorage(stale, now)).toBe(false);
    });

    it('flags negative age as expired', () => {
        expect(isRevealExpired(-1)).toBe(true);
        expect(isRevealExpired(LIFETIME_BADGE_REVEAL_TTL_MS)).toBe(true);
        expect(isRevealExpired(30_000)).toBe(false);
    });
});
