import { describe, expect, it } from 'vitest';
import {
    isOffreInstitutionBelgium,
    isOffreInstitutionFrance,
    parseOffreInstitutionCountry,
} from './offreInstitutionCountry';
import {
    formatOffreInstitutionNetworkCount,
    getOffreInstitutionNetworkMembersLabel,
    OFFRE_INSTITUTION_NETWORK_COUNT,
} from './offreInstitutionContent';

describe('offreInstitutionCountry', () => {
    it('parse les codes pays institutionnels', () => {
        expect(parseOffreInstitutionCountry('be')).toBe('be');
        expect(parseOffreInstitutionCountry('belgique')).toBe('be');
        expect(parseOffreInstitutionCountry('fr')).toBe('fr');
        expect(parseOffreInstitutionCountry('france')).toBe('fr');
        expect(parseOffreInstitutionCountry('us')).toBeNull();
    });

    it('identifie la Belgique et la France', () => {
        expect(isOffreInstitutionBelgium('be')).toBe(true);
        expect(isOffreInstitutionFrance('fr')).toBe(true);
        expect(isOffreInstitutionBelgium('fr')).toBe(false);
    });
});

describe('offreInstitutionContent', () => {
    it('formate le réseau à 2 300 sans mention de pays', () => {
        expect(OFFRE_INSTITUTION_NETWORK_COUNT).toBe(2300);
        expect(formatOffreInstitutionNetworkCount()).toBe('2\u202f300');
        expect(getOffreInstitutionNetworkMembersLabel()).toBe(
            'plus de 2\u202f300 infirmières indépendantes inscrites',
        );
        expect(getOffreInstitutionNetworkMembersLabel(undefined, 'nl')).toBe(
            `meer dan ${formatOffreInstitutionNetworkCount(undefined, 'nl')} zelfstandige verpleegkundigen ingeschreven`,
        );
    });
});
