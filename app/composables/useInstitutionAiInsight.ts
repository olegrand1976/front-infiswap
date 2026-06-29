import type { InstitutionAiInsight } from '~/lib/types';

export function useInstitutionAiInsight() {
    const { $apifetch } = useNuxtApp();

    async function getInsight(institutionId: number): Promise<InstitutionAiInsight | null> {
        try {
            const response = await $apifetch<{ data: InstitutionAiInsight | null }>(
                `/api/crm/institutions/${institutionId}/ai-insights`,
            );
            return response.data ?? null;
        }
        catch {
            return null;
        }
    }

    async function refreshInsight(institutionId: number): Promise<InstitutionAiInsight> {
        const response = await $apifetch<{ data: InstitutionAiInsight; message?: string }>(
            `/api/crm/institutions/${institutionId}/ai-insights/refresh`,
            { method: 'POST' },
        );
        return response.data;
    }

    return {
        getInsight,
        refreshInsight,
    };
}
