import { describe, expect, it } from 'vitest';
import { needsInstitutionCrmEnsure } from './institutionCrmContact';

describe('needsInstitutionCrmEnsure', () => {
    it('returns false when representative and crm.id are present', () => {
        expect(needsInstitutionCrmEnsure({
            representative_user_id: 10,
            crm: { id: 42 },
        })).toBe(false);
    });

    it('returns true when representative exists without crm.id', () => {
        expect(needsInstitutionCrmEnsure({
            representative_user_id: 10,
            crm: { id: null },
        })).toBe(true);

        expect(needsInstitutionCrmEnsure({
            representative_user_id: 10,
            crm: {},
        })).toBe(true);

        expect(needsInstitutionCrmEnsure({
            representative_user_id: 10,
            crm: null,
        })).toBe(true);
    });

    it('returns true when crm.id exists without representative', () => {
        expect(needsInstitutionCrmEnsure({
            representative_user_id: null,
            crm: { id: 42 },
        })).toBe(true);
    });

    it('returns true when neither representative nor crm is set', () => {
        expect(needsInstitutionCrmEnsure({})).toBe(true);
        expect(needsInstitutionCrmEnsure({
            representative_user_id: null,
            crm: null,
        })).toBe(true);
    });
});
