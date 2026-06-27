export type OffreInstitutionContact = {
    phoneTel: string;
    phoneDisplay: string;
    email: string;
    contactName?: string;
    repId?: string;
};

export const DEFAULT_OFFRE_INSTITUTION_CONTACT: OffreInstitutionContact = {
    phoneTel: '0478023377',
    phoneDisplay: '0478.02.33.77',
    email: 'info@infiswap.be',
};

export const OFFRE_INSTITUTION_CONTACTS: Record<string, OffreInstitutionContact> = {
    '1': {
        phoneTel: '0493855038',
        phoneDisplay: '0493.85.50.38',
        email: 'vincent@infiswap.be',
        contactName: 'Vincent Schmit',
        repId: '1',
    },
};

export function getOffreInstitutionContact(id: string): OffreInstitutionContact | undefined {
    return OFFRE_INSTITUTION_CONTACTS[id];
}
