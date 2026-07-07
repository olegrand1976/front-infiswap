import { describe, expect, it } from 'vitest';
import {
    buildAnalyticsSeenKey,
    buildBoostCelebrationDedupeKey,
    buildCelebrationSeenKey,
    buildContractCelebrationDedupeKey,
    isCelebrationSeen,
    shouldTrackPurchaseAnalytics,
} from './purchaseCelebration';

describe('purchaseCelebration', () => {
    it('builds celebration seen storage keys', () => {
        expect(buildCelebrationSeenKey('boost:42')).toBe('infiswap:celebration_seen:boost:42');
    });

    it('detects seen celebrations', () => {
        expect(isCelebrationSeen('boost:42', 'boost:42')).toBe(true);
        expect(isCelebrationSeen('boost:42', null)).toBe(false);
        expect(isCelebrationSeen('boost:42', 'boost:99')).toBe(false);
    });

    it('builds dedupe keys for boost and contract with session id', () => {
        expect(buildBoostCelebrationDedupeKey(12)).toBe('boost:12');
        expect(buildBoostCelebrationDedupeKey(12, 'cs_test_abc')).toBe('boost:cs_test_abc');
        expect(buildContractCelebrationDedupeKey(12, 'cs_test_abc')).toBe('contract:cs_test_abc');
        expect(buildContractCelebrationDedupeKey(12)).toBe('contract:12');
    });

    it('deduplicates purchase analytics by session id', () => {
        expect(buildAnalyticsSeenKey('boost', 'cs_live_abc')).toBe('infiswap:analytics_seen:boost:cs_live_abc');
        expect(shouldTrackPurchaseAnalytics('cs_live_abc', null)).toBe(true);
        expect(shouldTrackPurchaseAnalytics('cs_live_abc', 'cs_live_abc')).toBe(false);
    });
});
