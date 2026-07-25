import { describe, expect, it } from 'vitest';
import {
    educationLevelLabel,
    hasRealIdentifier,
    isBelgiumCountryCode,
    isBelgiumProfile,
    needsEducationLevel,
} from './educationLevel';

describe('educationLevel utils', () => {
    it('labels and country helpers', () => {
        expect(educationLevelLabel('a1')).toBe('Gradué (A1)');
        expect(educationLevelLabel('a2')).toBe('Brevet (A2)');
        expect(isBelgiumCountryCode('be')).toBe(true);
        expect(isBelgiumCountryCode('Belgique')).toBe(true);
        expect(isBelgiumCountryCode('fr')).toBe(false);
    });

    it('detects belgium profile via working_at before country', () => {
        expect(isBelgiumProfile({
            country: 'fr',
            working_at: 'Belgique',
        })).toBe(true);

        expect(isBelgiumProfile({
            country: null,
            profile: { working_at: 'Belgique,France' },
        })).toBe(true);

        expect(isBelgiumProfile({
            country: 'be',
            working_at: 'France',
        })).toBe(false);

        expect(isBelgiumProfile({
            country: null,
            working_at: null,
        })).toBe(false);
    });

    it('detects missing education level for BE nurses only', () => {
        expect(needsEducationLevel({
            roles: ['nurse'],
            country: 'be',
            education_level: null,
        })).toBe(true);

        expect(needsEducationLevel({
            roles: ['nurse'],
            country: 'be',
            education_level: 'a1',
        })).toBe(false);

        expect(needsEducationLevel({
            roles: ['nurse'],
            country: 'fr',
            education_level: null,
        })).toBe(false);

        expect(needsEducationLevel({
            roles: ['caregiver'],
            country: 'be',
            education_level: null,
        })).toBe(false);

        expect(needsEducationLevel({
            type: 'institution',
            roles: ['nurse'],
            country: 'be',
            education_level: null,
        })).toBe(false);

        expect(needsEducationLevel({
            account_type: 'institution',
            roles: ['nurse'],
            country: 'be',
            education_level: null,
        })).toBe(false);

        expect(needsEducationLevel({
            institution: { id: 1 },
            roles: ['nurse'],
            country: 'be',
            education_level: null,
        })).toBe(false);
    });

    it('detects real INAMI vs temp or unavailable', () => {
        expect(hasRealIdentifier({ identifier_number: '11234567891' })).toBe(true);
        expect(hasRealIdentifier({ identifier_number: 'TEMP_x', has_real_identifier: false })).toBe(false);
        expect(hasRealIdentifier({ identifier_unavailable: true, identifier_number: '11234567891' })).toBe(false);
        expect(hasRealIdentifier({ has_real_identifier: true })).toBe(true);
    });
});
