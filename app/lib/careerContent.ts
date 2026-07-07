export type CareerLevelPublic = {
    level: number;
    name: string;
    slug: string;
    description: string;
    minDirectBc?: number | null;
    minTeamRevenue?: number | null;
};

export const publicCareerLevels: CareerLevelPublic[] = [
    {
        level: 1,
        slug: 'conseiller',
        name: 'Conseiller',
        description: 'Point d\'entrée du réseau commercial. Vous accompagnez les institutions dans leur découverte d\'InfiSwap.',
        minDirectBc: null,
        minTeamRevenue: null,
    },
    {
        level: 2,
        slug: 'manager',
        name: 'Manager',
        description: 'Vous structurez votre activité avec des contrats signés et commencez à développer une équipe.',
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
    body: 'Un BC est un contrat d\'abonnement institution (Bon de Commande) signé, payé ou accompli que vous avez conclu avec une institution cliente. Seuls ces contrats comptent pour la progression de carrière.',
};

export const careerProgressionRules = {
    title: 'Comment progresser ?',
    items: [
        'Les promotions sont évaluées automatiquement le 1er de chaque mois.',
        'Pour accéder au grade supérieur, vous devez atteindre les deux seuils : nombre de BC directs et chiffre d\'affaires équipe sur 12 mois.',
        'Le CA équipe correspond à la somme des abonnements institution conclus par vos commerciaux directs (downline niveau 1).',
        'Votre grade de démarrage est défini à votre intégration et sert de base au calcul de vos commissions.',
    ],
};

export const recruitmentHighlights = [
    {
        title: 'Réseau de soignants',
        text: 'Rejoignez une plateforme au service des infirmières libérales et des institutions de soins.',
    },
    {
        title: 'Progression structurée',
        text: 'Quatre niveaux de carrière avec des objectifs clairs basés sur vos résultats commerciaux.',
    },
    {
        title: 'Autonomie & accompagnement',
        text: 'Statut indépendant, contrat-cadre de collaboration et outils CRM dédiés.',
    },
    {
        title: 'Impact terrain',
        text: 'Développez le réseau InfiSwap auprès des institutions et contribuez à la continuité des soins.',
    },
];
