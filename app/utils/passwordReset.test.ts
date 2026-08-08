import { describe, expect, it } from 'vitest';
import {
    buildResetPasswordPayload,
    evaluatePasswordRequirements,
    firstUnmetPasswordRequirement,
    parseResetPasswordQuery,
    shouldShowPasswordResetSuccess,
} from './passwordReset';

describe('passwordReset', () => {
    describe('shouldShowPasswordResetSuccess', () => {
        it('treats Laravel { message } body as success (ofetch JSON, no HTTP status)', () => {
            expect(shouldShowPasswordResetSuccess({ message: 'Nous vous avons envoyé le lien !' })).toBe(true);
            expect(shouldShowPasswordResetSuccess({ message: 'Votre mot de passe a été réinitialisé !' })).toBe(true);
        });

        it('does not require payload.status === 200 (regression: undefined !== 200)', () => {
            const ofetchBody = { message: 'passwords.sent' };
            // Legacy anti-pattern that broke forgot-password UI:
            const legacyBrokenCheck = (ofetchBody as { status?: number }).status !== 200;
            expect(legacyBrokenCheck).toBe(true);
            expect(shouldShowPasswordResetSuccess(ofetchBody)).toBe(true);
        });

        it('accepts void/undefined resolution after a settled ofetch call', () => {
            expect(shouldShowPasswordResetSuccess(undefined)).toBe(true);
            expect(shouldShowPasswordResetSuccess(null)).toBe(true);
        });

        it('honours numeric status when present (Response-like)', () => {
            expect(shouldShowPasswordResetSuccess({ status: 200, message: 'ok' })).toBe(true);
            expect(shouldShowPasswordResetSuccess({ status: 400, message: 'fail' })).toBe(false);
        });

        it('rejects non-object payloads', () => {
            expect(shouldShowPasswordResetSuccess('ok')).toBe(false);
            expect(shouldShowPasswordResetSuccess(200)).toBe(false);
        });
    });

    describe('parseResetPasswordQuery', () => {
        it('reads email and token from route query', () => {
            expect(parseResetPasswordQuery({
                email: 'user@infiswap.com',
                token: 'plain-token',
            })).toEqual({
                email: 'user@infiswap.com',
                token: 'plain-token',
            });
        });

        it('reads email and token from URLSearchParams', () => {
            const params = new URLSearchParams('email=a%40b.be&token=abc%2B123');
            expect(parseResetPasswordQuery(params)).toEqual({
                email: 'a@b.be',
                token: 'abc+123',
            });
        });

        it('returns null when email or token is missing', () => {
            expect(parseResetPasswordQuery({ email: 'user@infiswap.com' })).toBeNull();
            expect(parseResetPasswordQuery({ token: 'x' })).toBeNull();
            expect(parseResetPasswordQuery({})).toBeNull();
            expect(parseResetPasswordQuery(null)).toBeNull();
        });
    });

    describe('password requirements', () => {
        it('evaluates length, uppercase, digit and match', () => {
            expect(evaluatePasswordRequirements('Short1', 'Short1').map(r => r.key + ':' + r.met)).toEqual([
                'length:false',
                'uppercase:true',
                'digit:true',
                'match:true',
            ]);
            expect(firstUnmetPasswordRequirement('Short1', 'Short1')?.key).toBe('length');
        });

        it('accepts a valid password pair', () => {
            expect(firstUnmetPasswordRequirement('New Password 2025', 'New Password 2025')).toBeNull();
        });

        it('flags mismatch before API call', () => {
            expect(firstUnmetPasswordRequirement('New Password 2025', 'Other Password 2025')?.key).toBe('match');
        });
    });

    describe('buildResetPasswordPayload', () => {
        it('maps confirmation field for Laravel', () => {
            expect(buildResetPasswordPayload(
                'user@infiswap.com',
                'New Password 2025',
                'New Password 2025',
                'token-xyz',
            )).toEqual({
                email: 'user@infiswap.com',
                password: 'New Password 2025',
                password_confirmation: 'New Password 2025',
                token: 'token-xyz',
            });
        });
    });
});
