import { useState, useNuxtApp } from '#app';
import type { Pagination, UserPartner } from '~/lib/types';
import { PERPAGE } from '~/lib/constants';

export const usePartners = () => {
    const { $apifetch, $toast } = useNuxtApp();
    const loading = useState('partnerLoading', () => false);
    const count = useState<number>('userCount', () => 0);
    const demandPartners = useState<Pagination<UserPartner>>('demandPartners', () => ({
        data: [],
        current_page: 1,
        per_page: PERPAGE,
        total: 0,
        last_page: 1,
        first_page_url: '',
        last_page_url: '',
        next_page_url: null,
        prev_page_url: null,
        path: '',
        from: 0,
        to: 0,
        links: [],
    }));
    const demandPartner = useState<UserPartner>('demandPartner', () => null);
    const demandResponses = useState('demandResponses', () => null);

    const create = async (formData) => {
        return await $apifetch('/api/partners/create', {
            method: 'POST',
            body: formData,
        });
    };

    async function fetchDemandPartners(page = 1, perPage = 25, options = {}) {
        loading.value = true;
        try {
            return await $apifetch('api/partners', {
                params: {
                    page: page,
                    perPage: perPage,
                    ...options,
                },
            }).then((response) => {
                demandPartners.value = response.partnerships;
                count.value = response.count;
            });
        }
        finally {
            loading.value = false;
        }
    }

    const detailDemandPartner = async (userPartnerId: number, notified: boolean = false) => {
        const response = await $apifetch(
            `/api/partners/${userPartnerId}?notified=${notified ? 1 : 0}`,
            { method: 'GET' },
        );
        demandPartner.value = response.partnership;
    };

    const sendResponse = async (formData) => {
        return await $apifetch('/api/partners/responses/send', {
            method: 'POST',
            body: formData,
        });
    };

    const fetchResponses = async (userPartnerId?: number | null) => {
        const query = userPartnerId
            ? `?userPartnerId=${userPartnerId}`
            : '';

        const response = await $apifetch(
            `/api/partners/responses/receive${query}`,
            { method: 'GET' },
        );

        demandResponses.value = response.responses;
    };

    const updateStatusResponse = async (userPartnerResponse) => {
        return await $apifetch(`/api/partners/responses/${userPartnerResponse.id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: userPartnerResponse.status }),
        });
    };

    const updatePartnership = async (formData) => {
        return await $apifetch(`/api/partners/${formData.id}`, {
            method: 'PUT',
            body: formData,
        });
    };

    const updateAgainPartenership = async (formData) => {
        return await $apifetch(`/api/partners/update-again/${formData.id}`, {
            method: 'PUT',
            body: formData,
        });
    };

    async function forceDelete(partner: number) {
        return await $apifetch(`api/admin/partners/${partner}`, {
            method: 'DELETE',
        }).then(() => {
            $toast({
                description: 'Suppression réussie.',
            });
        })
            .catch(() => {
                $toast({
                    variant: 'destructive',
                    description: 'Une erreur est survenue lors de la suppression.',
                });
            });
    }

    return {
        demandPartner,
        demandPartners,
        demandResponses,
        loading,
        create,
        count,
        fetchDemandPartners,
        detailDemandPartner,
        sendResponse,
        fetchResponses,
        updateStatusResponse,
        updatePartnership,
        updateAgainPartenership,
        forceDelete,
    };
};
