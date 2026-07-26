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

export type HomeKpiKey = 'members_total';

/** Majoration affichée sur le total membres (+25 %). */
export const HOME_MEMBERS_DISPLAY_BOOST = 1.25;

export type HomeKpiDefinition = {
    key: HomeKpiKey;
    labelKey: string;
    descriptionKey: string;
    suffix?: string;
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

export const HOME_KPI_DEFINITIONS: HomeKpiDefinition[] = [
    {
        key: 'members_total',
        labelKey: 'home.kpi.membersLabel',
        descriptionKey: 'home.kpi.membersDescription',
    },
];
