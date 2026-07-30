export type CareerLevelPublic = {
    level: number;
    name: string;
    slug: string;
    description: string;
    minDirectBc?: number | null;
    minTeamRevenue?: number | null;
};

export type CommercialOffering = {
    id: string;
    title: string;
    subtitle: string;
    bullets: string[];
    badge: string;
};

export const careerPageHeroIntro
    = 'Développez le réseau InfiSwap auprès des maisons de repos et de soins (MR/MRS), hôpitaux, EHPAD et établissements de santé, et proposez aux infirmières libérales une présence digitale sur mesure. Progressez dans une structure de carrière claire, basée sur vos résultats commerciaux.';

export const careerLevelsIntro
    = 'Quatre grades structurés. Chaque niveau requiert un volume de Bons de Commande (BC) signés avec des institutions (MR/MRS, hôpitaux, EHPAD, cliniques…) et un développement de votre équipe commerciale directe.';

export const commercialOfferingsIntro
    = 'Deux axes commerciaux complémentaires : les abonnements institution et la présence digitale des infirmières libérales.';

export const careerBcProgressionNote
    = 'Seuls les BC institution signés comptent pour votre progression de grade. L\'offre digitale infirmière est un complément commercial, sans objectif ni seuil de carrière.';

export const careerPageSeoDescription
    = 'Rejoignez le réseau commercial InfiSwap : développez les institutions (MR/MRS, hôpitaux, EHPAD) et la présence digitale des infirmières libérales. Progression structurée par BC institution.';

export const publicCareerLevels: CareerLevelPublic[] = [
    {
        level: 1,
        slug: 'conseiller',
        name: 'Conseiller',
        description: 'Point d\'entrée du réseau commercial. Vous accompagnez les MR/MRS, hôpitaux et EHPAD dans leur découverte d\'InfiSwap.',
        minDirectBc: null,
        minTeamRevenue: null,
    },
    {
        level: 2,
        slug: 'manager',
        name: 'Manager',
        description: 'Vous structurez votre activité avec des BC institution signés et commencez à développer une équipe.',
        minDirectBc: 5,
        minTeamRevenue: 5000,
    },
    {
        level: 3,
        slug: 'directeur_regional',
        name: 'Directeur régional',
        description: 'Vous coordonnez un réseau actif et accompagnez la croissance de votre équipe directe.',
        minDirectBc: 10,
        minTeamRevenue: 15000,
    },
    {
        level: 4,
        slug: 'directeur_national',
        name: 'Directeur national',
        description: 'Vous pilotez un réseau commercial mature à l\'échelle nationale.',
        minDirectBc: 20,
        minTeamRevenue: 50000,
    },
];

/** Descriptions marketing par slug — complétées côté API publique (seuils dynamiques). */
export const careerDescriptionBySlug: Record<string, string> = Object.fromEntries(
    publicCareerLevels.map(level => [level.slug, level.description]),
);

export const bcDefinition = {
    title: 'Qu\'est-ce qu\'un BC ?',
    short: 'BC = Bon de Commande institution',
    body: 'Un BC est un contrat d\'abonnement institution (Bon de Commande) signé, payé ou accompli avec une maison de repos, un hôpital, un EHPAD ou un établissement de santé. Seuls ces contrats comptent pour la progression de carrière — pas l\'offre digitale infirmière.',
};

export const careerProgressionRules = {
    title: 'Comment progresser ?',
    items: [
        'Les promotions sont évaluées automatiquement le 1er de chaque mois.',
        'Pour accéder au grade supérieur, vous devez atteindre les deux seuils : nombre de BC directs (institutions uniquement) et chiffre d\'affaires équipe sur 12 mois.',
        'Le CA équipe correspond à la somme des abonnements institution conclus par vos commerciaux directs (downline niveau 1).',
        'L\'offre digitale infirmière (site dédié, mise en avant patients) ne génère pas de BC et n\'entre pas dans les critères de grade.',
        'Votre grade de démarrage est défini à votre intégration et sert de base au calcul de vos commissions.',
    ],
};

export const recruitmentHighlights = [
    {
        title: 'Réseau de soignants',
        text: 'Rejoignez une plateforme au service des infirmières libérales et des établissements de soins : MR/MRS, hôpitaux, EHPAD et cliniques.',
    },
    {
        title: 'Progression structurée',
        text: 'Quatre niveaux de carrière avec des objectifs clairs basés sur vos BC institution et votre développement d\'équipe.',
    },
    {
        title: 'Autonomie & accompagnement',
        text: 'Statut indépendant, contrat-cadre de collaboration et outils CRM dédiés.',
    },
    {
        title: 'Impact terrain',
        text: 'Développez InfiSwap auprès des institutions de soins et contribuez à la continuité des soins dans votre région.',
    },
];

export const commercialOfferings: CommercialOffering[] = [
    {
        id: 'institutions',
        title: 'Institutions de soins',
        subtitle: 'MR/MRS, hôpitaux, EHPAD, cliniques…',
        bullets: [
            'Présentation de l\'offre institution InfiSwap : remplacements, réseau d\'indépendantes, continuité des soins.',
            'Signature de Bons de Commande (BC) avec les établissements — base de la progression carrière.',
            'Accompagnement des équipes soignantes et direction dans l\'adoption de la plateforme.',
        ],
        badge: 'Compte pour la progression (BC)',
    },
    {
        id: 'nurse_digital',
        title: 'Présence digitale infirmière',
        subtitle: 'Site internet dédié + visibilité patients',
        bullets: [
            'Site vitrine personnel pour l\'infirmière libérale : présentation, zone d\'intervention, prise de contact.',
            'Mise en avant auprès des patients inscrits sur InfiSwap.',
            'Complément à l\'offre institution — ne génère pas de BC ni de critère de grade.',
        ],
        badge: 'Offre complémentaire',
    },
];
