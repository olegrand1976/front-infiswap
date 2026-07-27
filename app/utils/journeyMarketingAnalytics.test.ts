import { describe, expect, it } from 'vitest';
import {
    formatJourneyEngagementRate,
    journeyWorkflowLabel,
} from './journeyMarketingAnalytics';

describe('journeyMarketingAnalytics', () => {
    it('maps known workflow labels', () => {
        expect(journeyWorkflowLabel('warm_inactive')).toBe('Relance tiède');
        expect(journeyWorkflowLabel('onboarding')).toBe('Onboarding');
    });

    it('falls back to raw workflow key', () => {
        expect(journeyWorkflowLabel('custom_flow')).toBe('custom_flow');
    });

    it('formats engagement rates', () => {
        expect(formatJourneyEngagementRate(null)).toBe('n/a');
        expect(formatJourneyEngagementRate(12.5)).toBe('12.5 %');
        expect(formatJourneyEngagementRate(100)).toBe('100 %');
    });
});
