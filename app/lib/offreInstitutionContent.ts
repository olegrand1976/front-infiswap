import type { OffreInstitutionCountry } from '~/lib/offreInstitutionCountry';

export const OFFRE_INSTITUTION_NETWORK_COUNT = 2300;

const networkCountFormatter = new Intl.NumberFormat('fr-BE', { maximumFractionDigits: 0 });

export function formatOffreInstitutionNetworkCount(count = OFFRE_INSTITUTION_NETWORK_COUNT): string {
    return networkCountFormatter.format(count);
}

export function getOffreInstitutionNetworkMembersLabel(count = OFFRE_INSTITUTION_NETWORK_COUNT): string {
    return `plus de ${formatOffreInstitutionNetworkCount(count)} infirmières indépendantes inscrites`;
}

export function getOffreInstitutionNetworkMembersShortLabel(count = OFFRE_INSTITUTION_NETWORK_COUNT): string {
    return `${formatOffreInstitutionNetworkCount(count)}+ indépendantes`;
}

export function getOffreInstitutionNetworkProfilesLabel(count = OFFRE_INSTITUTION_NETWORK_COUNT): string {
    return `${formatOffreInstitutionNetworkCount(count)}+ profils`;
}

export const OFFRE_INSTITUTION_JAUMANA_BELGIUM_ONLY_LABEL =
    'Service Jaumana Soins — disponible en Belgique uniquement';

export type OffreInstitutionCountryContent = {
    headerBadge: string;
    trustBannerLead: string;
    trustBannerMembers: string;
    heroDescription: string;
    heroDescriptionJaumana?: string;
    institutionContextLead: string;
    insightTitle: string;
    insightTitleJaumana?: string;
    insightParagraph: string;
    insightParagraphJaumana?: string;
    networkHighlightTitle: string;
    networkHighlight: string;
    diyPillarBadge: string;
    diyCommunityLabel: string;
    diyNetworkAccessLabel: string;
    comparatifNetworkLabel: string;
    footerTagline: string;
    footerCopyright: string;
    footerCopyrightJaumana?: string;
};

const CONTENT_BY_COUNTRY: Record<OffreInstitutionCountry, OffreInstitutionCountryContent> = {
    be: {
        headerBadge: 'Espace Institutionnel Belge',
        trustBannerLead: '1er réseau d\'entraide et de remplacement infirmier en Belgique',
        trustBannerMembers: `Plus de ${formatOffreInstitutionNetworkCount()} infirmières qualifiées inscrites`,
        heroDescription:
            'Marre de payer l\'intérim à <strong>100 € / heure</strong> ? Découvrez la puissance de frappe d\'InfiSwap, fort de <strong>{networkMembers}</strong>. Publiez vos besoins en autonomie avec <strong>InfiSwap Institut</strong>.',
        heroDescriptionJaumana:
            'Marre de payer l\'intérim à <strong>100 € / heure</strong> ? Découvrez la puissance de frappe d\'InfiSwap, fort de <strong>{networkMembers}</strong>. Publiez vos besoins sur la plateforme ou sécurisez vos remplacements grâce au <strong>partenariat InfiSwap × Jaumana Soins</strong>.',
        institutionContextLead:
            'Pour une Maison de Repos ou de Repos et de Soins (MR/MRS) en Belgique, faire face aux absences relève d\'une logistique épuisante et d\'un gouffre financier. Devoir se résoudre à solliciter une agence d\'intérim classique signifie souvent payer un tarif prohibitif avoisinant les <strong>100 € par heure</strong>.',
        insightTitle: 'InfiSwap Institut pour votre établissement',
        insightTitleJaumana: 'Le partenariat InfiSwap × Jaumana Soins',
        insightParagraph:
            'En nous appuyant sur un <strong>réseau d\'infirmières indépendantes</strong>, nous éliminons les intermédiaires gourmands. Publiez en autonomie avec <strong>InfiSwap Institut</strong> (abonnement à {diyMonthlyLabel}) et mobilisez rapidement des profils qualifiés pour assurer la continuité de vos soins.',
        insightParagraphJaumana:
            'En nous appuyant sur un <strong>réseau d\'infirmières indépendantes</strong>, nous éliminons les intermédiaires gourmands. Vous publiez en autonomie avec InfiSwap Institut (abonnement à {diyMonthlyLabel}) ou vous sécurisez vos remplacements via la <strong>convention Jaumana</strong> : publication sur InfiSwap, paiements garantis, engagements des titulaires et protection contre le détournement de patientèle.',
        networkHighlightTitle: 'Le premier réseau d\'entraide de Belgique',
        networkHighlight:
            'En rejoignant InfiSwap, vous n\'accédez pas à un simple outil d\'affichage, mais au <strong>plus grand réseau d\'infirmières indépendantes actives ({networkCountShort} membres)</strong>. Cette force de frappe communautaire garantit la continuité de vos soins même dans les zones rurales ou en période de pénurie critique.',
        diyPillarBadge: 'Réseau N°1 en Belgique',
        diyCommunityLabel: '{networkCountShort} indépendantes',
        diyNetworkAccessLabel: 'Accès direct au plus grand réseau d\'entraide de Belgique',
        comparatifNetworkLabel: 'Réseau d\'entraide InfiSwap ({networkCountShort} infirmières).',
        footerTagline: 'La première solution de remplacement d\'infirmières 100% automatisée de Belgique.',
        footerCopyright: 'InfiSwap Institut — vos soins sans interruption.',
        footerCopyrightJaumana: 'Partenariat officiel InfiSwap × Jaumana Soins — vos soins sans interruption.',
    },
    fr: {
        headerBadge: 'Espace Institutionnel France',
        trustBannerLead: '1er réseau d\'entraide et de remplacement infirmier en France',
        trustBannerMembers: `Plus de ${formatOffreInstitutionNetworkCount()} infirmières qualifiées inscrites`,
        heroDescription:
            'Marre de payer l\'intérim à <strong>100 € / heure</strong> ? Découvrez la puissance de frappe d\'InfiSwap, fort de <strong>{networkMembers}</strong>. Publiez vos besoins avec <strong>InfiSwap Institut</strong> et trouvez vos remplaçants en autonomie.',
        institutionContextLead:
            'Pour un EHPAD ou un établissement de santé en France, faire face aux absences relève d\'une logistique épuisante et d\'un gouffre financier. Devoir se résoudre à solliciter une agence d\'intérim classique signifie souvent payer un tarif prohibitif avoisinant les <strong>100 € par heure</strong>.',
        insightTitle: 'InfiSwap Institut pour votre établissement',
        insightParagraph:
            'En nous appuyant sur un <strong>réseau d\'infirmières indépendantes</strong>, nous éliminons les intermédiaires gourmands. Publiez en autonomie avec <strong>InfiSwap Institut</strong> (abonnement à {diyMonthlyLabel}) et mobilisez rapidement des profils qualifiés pour assurer la continuité de vos soins.',
        networkHighlightTitle: 'Un réseau d\'entraide infirmier en France',
        networkHighlight:
            'En rejoignant InfiSwap, vous n\'accédez pas à un simple outil d\'affichage, mais au <strong>plus grand réseau d\'infirmières indépendantes actives ({networkCountShort} membres)</strong>. Cette force de frappe communautaire garantit la continuité de vos soins même en période de pénurie critique.',
        diyPillarBadge: 'Réseau N°1 en France',
        diyCommunityLabel: '{networkCountShort} indépendantes',
        diyNetworkAccessLabel: 'Accès direct au plus grand réseau d\'entraide infirmier',
        comparatifNetworkLabel: 'Réseau d\'entraide InfiSwap ({networkCountShort} infirmières).',
        footerTagline: 'La première solution de remplacement d\'infirmières 100% automatisée.',
        footerCopyright: 'InfiSwap Institut — vos soins sans interruption.',
    },
};

export function getOffreInstitutionCountryContent(country: OffreInstitutionCountry): OffreInstitutionCountryContent {
    return CONTENT_BY_COUNTRY[country];
}

export function interpolateOffreInstitutionContent(
    template: string,
    values: Record<string, string>,
): string {
    return Object.entries(values).reduce(
        (result, [key, value]) => result.replaceAll(`{${key}}`, value),
        template,
    );
}
