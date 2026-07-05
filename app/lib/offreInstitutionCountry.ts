export type OffreInstitutionCountry = 'be' | 'fr';

export const OFFRE_INSTITUTION_COUNTRY_STORAGE_KEY = 'offre-institution-country';

export function parseOffreInstitutionCountry(value: string | null | undefined): OffreInstitutionCountry | null {
    const normalized = value?.toLowerCase().trim();
    if (normalized === 'be' || normalized === 'belgique' || normalized === 'belgium') {
        return 'be';
    }
    if (normalized === 'fr' || normalized === 'france') {
        return 'fr';
    }
    return null;
}

export function isOffreInstitutionBelgium(country: OffreInstitutionCountry | null | undefined): boolean {
    return country === 'be';
}

export function isOffreInstitutionFrance(country: OffreInstitutionCountry | null | undefined): boolean {
    return country === 'fr';
}
