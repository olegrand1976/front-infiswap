export type PlatformStatsGrowth = {
    new_members_30d: number;
    percent_vs_previous_30d: number;
};

export type PlatformStats = {
    members_total: number;
    matched_replacements_total: number;
    active_users: number;
    growth: PlatformStatsGrowth;
    /** Date ISO (YYYY-MM-DD) de calcul côté serveur */
    as_of?: string;
};

export type HomeKpiKey = keyof Omit<PlatformStats, 'growth' | 'as_of'> | 'growth_percent';

export type HomeKpiDefinition = {
    key: HomeKpiKey;
    label: string;
    suffix?: string;
    description: string;
};

/** Chiffres de secours si l'API est indisponible (maquette / dev sans back). */
export const HOME_STATS_FALLBACK: PlatformStats = {
    members_total: 2487,
    matched_replacements_total: 1834,
    active_users: 1196,
    growth: {
        new_members_30d: 142,
        percent_vs_previous_30d: 23,
    },
};

/** Accroche hero (NewBanner) — Belgique & France. */
export const HOME_HERO_TAGLINE =
    'InfiSwap est la plateforme 100 % automatisée dédiée à la mise en relation des infirmiers en Belgique et en France.';

/** Copy marketing éditable — point unique pour ajuster le storytelling. */
export const HOME_STATS_COPY = {
    sectionTitle: 'InfiSwap en chiffres',
    sectionSubtitle: 'Des indicateurs qui évoluent chaque jour avec notre communauté de soignants.',
    badge: 'Plateforme de référence',
    badgeHint: 'Belgique & France',
    communityTitle: 'La plateforme de référence du remplacement infirmier',
    communityLead:
        'InfiSwap compte parmi les plateformes les plus actives pour le nombre de remplacements matchés et d\'utilisateurs engagés, en Belgique comme en France.',
    communityBody:
        'Chaque jour, de nouveaux infirmiers, sages-femmes et aides-soignants rejoignent une communauté qui simplifie la continuité des soins, la planification des absences et la mise en relation entre professionnels de terrain.',
    communityCta: 'Rejoindre la communauté',
    growthLabel: 'Croissance sur 30 jours',
    updatedLabel: 'Indicateurs actualisés le',
} as const;

export const HOME_KPI_DEFINITIONS: HomeKpiDefinition[] = [
    {
        key: 'members_total',
        label: 'Membres inscrits',
        description: 'Professionnels de santé inscrits sur la plateforme',
    },
    {
        key: 'matched_replacements_total',
        label: 'Remplacements matchés',
        description: 'Missions confirmées entre soignants',
    },
    {
        key: 'active_users',
        label: 'Utilisateurs actifs',
        description: 'Membres connectés ces 30 derniers jours',
    },
    {
        key: 'growth_percent',
        label: 'Croissance',
        suffix: '%',
        description: 'Nouvelles inscriptions vs les 30 jours précédents',
    },
];
