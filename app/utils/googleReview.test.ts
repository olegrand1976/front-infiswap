import { describe, expect, it } from 'vitest';
import {
    getGoogleReviewCopy,
    hasLeftGoogleReview,
    mapCelebrationVariantToReviewSource,
    mergeGoogleReviewIntoSettings,
    parseGoogleReviewSetting,
} from './googleReview';

describe('googleReview', () => {
    it('detects when user has left a google review', () => {
        const user = {
            settings: JSON.stringify({
                google_review: {
                    left_at: '2026-07-07T15:00:00Z',
                    source: 'boost',
                },
            }),
        };

        expect(hasLeftGoogleReview(user)).toBe(true);
        expect(parseGoogleReviewSetting(user)).toEqual({
            left_at: '2026-07-07T15:00:00Z',
            source: 'boost',
        });
    });

    it('returns false when review setting is missing or invalid', () => {
        expect(hasLeftGoogleReview(null)).toBe(false);
        expect(hasLeftGoogleReview({ settings: '{}' })).toBe(false);
        expect(hasLeftGoogleReview({ settings: { google_review: { source: 'boost' } } })).toBe(false);
    });

    it('maps celebration variants to review sources', () => {
        expect(mapCelebrationVariantToReviewSource('boost')).toBe('boost');
        expect(mapCelebrationVariantToReviewSource('contract')).toBe('contract');
    });

    it('returns contextual copy per source', () => {
        expect(getGoogleReviewCopy('onboarding_complete').title).toBe('Parcours terminé');
    });

    it('merges google review into settings', () => {
        const merged = mergeGoogleReviewIntoSettings(
            { notification: { digest_weekly: true } },
            { left_at: '2026-07-07T15:00:00Z', source: 'contract' },
        );

        expect(merged.google_review).toEqual({
            left_at: '2026-07-07T15:00:00Z',
            source: 'contract',
        });
        expect(merged.notification).toEqual({ digest_weekly: true });
    });
});
