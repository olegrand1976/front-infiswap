import { describe, expect, it } from 'vitest';
import {
    buildLoginRedirectWithStripeReturn,
    extractStripeSessionId,
    isStripeCheckoutSessionId,
    parseStripeProductReturn,
    stripStripeReturnQuery,
} from './accessReturn';

describe('stripeReturn', () => {
    it('detects platform return from session_id', () => {
        expect(parseStripeProductReturn({ session_id: 'cs_test_platform' })).toEqual({
            zone: 'platform',
            sessionId: 'cs_test_platform',
            outcome: 'success',
        });
    });

    it('detects boost success and cancel returns', () => {
        expect(parseStripeProductReturn({
            boost: 'success',
            session_id: 'cs_test_boost',
        })).toEqual({
            zone: 'boost',
            sessionId: 'cs_test_boost',
            outcome: 'success',
        });

        expect(parseStripeProductReturn({
            boost: 'cancel',
            session_id: 'cs_test_boost_cancel',
        })).toEqual({
            zone: 'boost',
            sessionId: 'cs_test_boost_cancel',
            outcome: 'cancel',
        });
    });

    it('detects contract and sponsorship returns', () => {
        expect(parseStripeProductReturn({
            contract: 'success',
            session_id: 'cs_test_contract',
        })).toEqual({
            zone: 'contract',
            sessionId: 'cs_test_contract',
            outcome: 'success',
        });

        expect(parseStripeProductReturn({
            sponsorship: 'success',
            session_id: 'cs_test_sponsor',
        })).toEqual({
            zone: 'sponsorship',
            sessionId: 'cs_test_sponsor',
            outcome: 'success',
        });
    });

    it('ignores invalid session ids', () => {
        expect(parseStripeProductReturn({ session_id: 'invalid' })).toBeNull();
        expect(parseStripeProductReturn({ boost: 'success' })).toBeNull();
    });

    it('strips stripe return query keys', () => {
        expect(stripStripeReturnQuery({
            tab: 'home',
            session_id: 'cs_test',
            boost: 'success',
            contract: 'cancel',
            sponsorship: 'success',
        })).toEqual({ tab: 'home' });
    });

    it('builds login redirect preserving platform session', () => {
        expect(buildLoginRedirectWithStripeReturn('/dashboard/replacements', {
            session_id: 'cs_test_login',
        })).toBe('/dashboard/replacements?session_id=cs_test_login');
    });

    it('builds login redirect preserving boost return', () => {
        expect(buildLoginRedirectWithStripeReturn('/dashboard/replacements/detail/12', {
            boost: 'success',
            session_id: 'cs_test_boost',
        })).toBe('/dashboard/replacements/detail/12?session_id=cs_test_boost&boost=success');
    });

    it('validates stripe session id helper', () => {
        expect(isStripeCheckoutSessionId('cs_test_valid')).toBe(true);
        expect(isStripeCheckoutSessionId('invalid')).toBe(false);
        expect(extractStripeSessionId({ session_id: 'cs_from_query' })).toBe('cs_from_query');
    });
});
