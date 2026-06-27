import type { Referrer } from '~/lib/types';

export function referrerDisplayLabel(referrer?: Referrer | null): string {
    return referrer?.text || referrer?.full_name || '';
}

export const useReferrer = () => {
    const loading = useState('referrerLoading', () => false);
    const { $apifetch } = useNuxtApp();
    const userReferrer = useState<Referrer[]>('userReferrers', () => undefined);

    async function getUserReferrer() {
        loading.value = true;
        try {
            const response = await $apifetch(`api/users/business-referrers`);
            userReferrer.value = response.data;
        }
        finally {
            loading.value = false;
        }
    }

    async function updateReferrer(
        id: number,
        payload: {
            referred_by?: number | null;
            referred_by_text?: string | null;
        },
    ): Promise<Referrer> {
        return await $apifetch(`api/crm/${id}/referred-by`, {
            method: 'PUT',
            body: payload,
        });
    }

    async function updateInstitutionReferrer(
        institutionId: number,
        payload: {
            referred_by?: number | null;
            referred_by_text?: string | null;
        },
    ): Promise<Referrer> {
        return await $apifetch(`api/crm/institutions/${institutionId}/referred-by`, {
            method: 'PUT',
            body: payload,
        });
    }

    return {
        loading,
        updateReferrer,
        updateInstitutionReferrer,
        userReferrer,
        getUserReferrer,
        referrerDisplayLabel,
    };
};
