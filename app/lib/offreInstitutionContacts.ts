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
    1: {
        phoneTel: '0493855038',
        phoneDisplay: '0493.85.50.38',
        email: 'vincent@infiswap.be',
        contactName: 'Vincent Schmit',
        repId: '1',
    },
    2: {
        phoneTel: '0475721632',
        phoneDisplay: '0475.72.16.32',
        email: 'cholet.odile@gmail.com',
        contactName: 'Odile Cholet / Valérie Vaneck',
        repId: '2',
    },
    3: {
        phoneTel: '0471522660',
        phoneDisplay: '0471.52.26.60',
        email: 'Tolleneerstephanie@gmail.com',
        contactName: 'Stéphanie Tolleneer',
        repId: '3',
    },
};

export function getOffreInstitutionContact(id: string): OffreInstitutionContact | undefined {
    return OFFRE_INSTITUTION_CONTACTS[id];
}
