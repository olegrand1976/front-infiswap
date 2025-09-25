
import { useState, useNuxtApp } from '#app';
import type { Pagination, UserPartner } from '~/lib/types';
import { PERPAGE } from '~/lib/constants';

export const usePartners = () => {
    const { $apifetch } = useNuxtApp();
    const loading = useState('loading', () => false);
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

    const fetchDemandPartners = async ({
        postalCode = [],
        cities = [],
        duration = '',
        type = '',
        page = 1,
        perPage = PERPAGE,
    } = {}) => {
        loading.value = true;

        const data = {
            zip_code: postalCode.length ? postalCode : undefined,
            city: cities.length ? cities : undefined,
            duration: duration || undefined,
            type: type || undefined,
            page: Number(page),
            perPage: Number(perPage),
        };

        const response = await $apifetch('/api/partners', {
            method: 'POST',
            body: data,
        });

        demandPartners.value = {
            data: response.partnerships.data || [],
            current_page: response.partnerships.current_page || 1,
            per_page: Number(response.partnerships.per_page) || PERPAGE,
            total: response.partnerships.total || 0,
            last_page: response.partnerships.last_page || 1,
            first_page_url: response.partnerships.first_page_url || '',
            last_page_url: response.partnerships.last_page_url || '',
            next_page_url: response.partnerships.next_page_url || null,
            prev_page_url: response.partnerships.prev_page_url || null,
            path: response.partnerships.path || '',
            from: response.partnerships.from || 0,
            to: response.partnerships.to || 0,
            links: response.partnerships.links || [],
        };

        loading.value = false;
    };

    const detailDemandPartner = async (userPartnerId: number) => {
        const response = await $apifetch(`/api/partners/${userPartnerId}`, { method: 'GET' });
        demandPartner.value = response.partnership;
    };

    const sendResponse = async (formData) => {
        return await $apifetch('/api/partners/responses/send', {
            method: 'POST',
            body: formData,
        });
    };

    const fetchResponses = async () => {
        const response = await $apifetch(`/api/partners/responses/receive`, { method: 'GET' });
        demandResponses.value = response;
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

    return {
        demandPartner,
        demandPartners,
        demandResponses,
        loading,
        create,
        fetchDemandPartners,
        detailDemandPartner,
        sendResponse,
        fetchResponses,
        updateStatusResponse,
        updatePartnership,
        updateAgainPartenership,
    };
};
