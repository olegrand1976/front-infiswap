import { describe, expect, it } from 'vitest';
import {
    canRegisterSubmit,
    getRegisterBlockers,
    type RegisterValidationInput,
} from './registerValidation';

function nurseBelgiumComplete(
    overrides: Partial<RegisterValidationInput> = {},
): RegisterValidationInput {
    const baseAddress = {
        street: 'Rue Test',
        city: 'Mons',
        zipCode: '7000',
        country: 'be',
        workingAt: ['Belgique'] as string[],
    };

    return {
        accountType: 'standard',
        role: 'nurse',
        lastname: 'Test',
        firstname: 'Testeur',
        email: 'test@test.be',
        phoneNumber: '0478596312',
        password: 'Test1234',
        passwordConfirmation: 'Test1234',
        professionalCategory: 'independent',
        educationLevel: 'a2',
        identifierNumber: '',
        institutionName: '',
        charteAccepted: true,
        termsAccepted: true,
        privacyAccepted: true,
        ...overrides,
        address: {
            ...baseAddress,
            ...overrides.address,
        },
    };
}

describe('registerValidation', () => {
    it('autorise un formulaire infirmier BE complet (régression capture août 2026)', () => {
        expect(canRegisterSubmit(nurseBelgiumComplete())).toBe(true);
        expect(getRegisterBlockers(nurseBelgiumComplete())).toEqual([]);
    });

    it('bloque un mot de passe < 8 caractères sans feedback silencieux', () => {
        const input = nurseBelgiumComplete({
            password: 'Test123',
            passwordConfirmation: 'Test123',
        });
        expect(canRegisterSubmit(input)).toBe(false);
        expect(getRegisterBlockers(input)).toContain('password_length');
    });

    it('bloque une confirmation de mot de passe différente', () => {
        const input = nurseBelgiumComplete({
            password: 'Test1234',
            passwordConfirmation: 'Test9999',
        });
        expect(getRegisterBlockers(input)).toContain('password_mismatch');
    });

    it('bloque le niveau d’études manquant pour infirmier BE', () => {
        const input = nurseBelgiumComplete({ educationLevel: '' });
        expect(getRegisterBlockers(input)).toContain('education_level');
    });

    it('bloque les consentements manquants', () => {
        const input = nurseBelgiumComplete({ termsAccepted: false });
        expect(getRegisterBlockers(input)).toContain('consents');
    });

    it('n’exige pas le niveau d’études hors Belgique', () => {
        const input = nurseBelgiumComplete({
            educationLevel: '',
            address: { country: 'fr', workingAt: ['France'] },
        });
        expect(getRegisterBlockers(input)).not.toContain('education_level');
        expect(canRegisterSubmit(input)).toBe(true);
    });
});
