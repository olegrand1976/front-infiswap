import type { Referrer } from '~/lib/types';

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

    async function updateReferrer(id: number, newValue: {
        referred_by: number;
    }): Promise<Referrer> {
        const response = await $apifetch(`api/crm/${id}/referred-by`, {
            method: 'PUT',
            params: newValue,
        });

        return response;
    }

    return {
        loading,
        updateReferrer,
        userReferrer,
        getUserReferrer,
    };
};
