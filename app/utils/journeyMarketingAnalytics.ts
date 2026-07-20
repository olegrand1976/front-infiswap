const WORKFLOW_LABELS: Record<string, string> = {
    onboarding: 'Onboarding',
    platform_access_upsell: 'Upsell accès réseau (archivé)',
    inactive_promo: 'Promo inactive',
    warm_inactive: 'Relance tiède',
    partner_services: 'Partenaires',
    partner_services_seasonal: 'Partenaires saisonniers',
    weekly_digest: 'Digest hebdo',
    poster_inactive: 'Afficheurs inactifs',
    institution_inactive: 'Institutions inactives',
    pending_response: 'Candidature en attente',
};

export function journeyWorkflowLabel(workflow: string): string {
    return WORKFLOW_LABELS[workflow] ?? workflow;
}

export function formatJourneyEngagementRate(rate: number | null): string {
    if (rate === null) {
        return 'n/a';
    }

    return `${rate} %`;
}
