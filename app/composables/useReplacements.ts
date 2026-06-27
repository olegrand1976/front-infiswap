/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from 'vue-sonner';
import { useState, useNuxtApp } from '#app';
import type { Pagination, Replacement } from '~/lib/types';
import { PERPAGE } from '~/lib/constants';

export const useReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const myReplacements = useState('myReplacements', () => []);
    const replacements = useState<Pagination<Replacement> | null>('replacements', () => null);
    const error = useState('replacementError', () => null);
    const loading = useState('replacementLoading', () => false);
    const success = useState('replacementSuccess', () => false);

    const user = useState('user');

    const submitReplacement = async (formData) => {
        const { requirePlatformAccess, isPlatformAccessError } = useSubscription();

        if (!(await requirePlatformAccess())) {
            return null;
        }

        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            const response = await $apifetch('/api/replacements', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            success.value = true;
            return response;
        }
        catch (err) {
            if (isPlatformAccessError(err)) {
                const { redirectToAccesPlan } = useSubscription();
                await redirectToAccesPlan();
                return null;
            }

            error.value = err;
            throw err;
        }
        finally {
            loading.value = false;
        }
    };

    const getReplacements = async () => {
        try {
            loading.value = true;
            const response = await $apifetch('/api/replacements', { method: 'GET' });
            replacements.value = response.replacements;

            return replacements.value;
        }
        catch (err) {
            error.value = err;
            console.error(err);
        }
        finally {
            loading.value = false;
        }
    };

    const getAccordingReplacements = async () => {
        try {
            loading.value = true;
            const response = await $apifetch('/api/replacements/according-figure', { method: 'GET' });
            replacements.value = response.replacements;

            return replacements.value;
        }
        catch (err) {
            error.value = err;
            console.error(err);
        }
        finally {
            loading.value = false;
        }
    };

    const getMyReplacements = async () => {
        try {
            const response = await $apifetch('/api/replacements/me', { method: 'GET' });
            myReplacements.value = response.replacements || [];

            return myReplacements.value;
        }
        catch (err) {
            error.value = err;
            console.error(err);
        }
        finally {
            loading.value = false;
        }
    };

    async function getReplacementsForAdmin(page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/admin/replacements', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            replacements.value = response.replacements;
        });
    }

    const getFRStatus = (status: 'open' | 'closed'): string => {
        return status === 'open' ? 'ouvert' : 'fermé';
    };

    interface PostalData {
        zip_codes?: string[] | null;
        cities?: string[] | null;
        patients?: number[] | null;
    };
    const extractPostalDataFromReplacement = (replacement: Replacement): PostalData => {
        const initialValue = {
            zip_codes: [],
            cities: [],
            patients: [],
        };

        if (!replacement.details || !Array.isArray(replacement.details)) return initialValue;

        const seen = new Set<string>();
        const result: PostalData = initialValue;

        replacement.details.forEach((detail) => {
            const patient = detail.patient;
            const key = `${patient.id}-${patient.zip_code}-${patient.city}`;

            if (!seen.has(key)) {
                seen.add(key);
                result.patients.push(patient.id);
                result.zip_codes.push(patient.zip_code);
                result.cities.push(patient.city);
            }
        });

        return result;
    };

    const sendUrgentReplacement = async (formData) => {
        const { requirePlatformAccess, isPlatformAccessError } = useSubscription();

        if (!(await requirePlatformAccess())) {
            return false;
        }

        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            await $apifetch('/api/replacements/immediate', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            success.value = true;
            return true;
        }
        catch (err) {
            if (isPlatformAccessError(err)) {
                const { redirectToAccesPlan } = useSubscription();
                await redirectToAccesPlan();
                return false;
            }

            if (err.data && err.data.errors) {
                const backendErrors = err.data.errors;
                const firstField = Object.keys(backendErrors)[0];
                const firstMessage = backendErrors[firstField][0];

                toast.error(firstMessage);
            }

            error.value = err;
            throw err;
        }
        finally {
            loading.value = false;
        }
    };

    const updateReplacement = async (formData) => {
        return await $apifetch(`/api/replacements/${formData.id}`, {
            method: 'PUT',
            body: formData,
        });
    };

    const updateAgainReplacement = async (formData) => {
        return await $apifetch(`/api/replacements/update-again/${formData.id}`, {
            method: 'PUT',
            body: formData,
        });
    };

    async function showReplacement(id: number) {
        return await $apifetch(`/api/replacements/${id}`);
    }

    async function activityUser(id: number) {
        return await $apifetch(`/api/replacements/${id}/activity`);
    }

    async function forceDelete(replacement: number) {
        await $apifetch(`/api/replacements/${replacement}`, {
            method: 'DELETE',
        }).then(() => {
            toast.success('Suppression réussie.');
        })
            .catch(() => {
                toast.error('Une erreur est survenue lors de la suppression.');
            });
    }

    async function release(replacement: number) {
        await $apifetch(`/api/replacements/${replacement}/release`, {
            method: 'PUT',
        }).then(() => {
            toast.success('Remplacement libéré avec succès.');
        })
            .catch(() => {
                toast.error('Une erreur est survenue lors de la libération.');
            });
    }

    function isClosed(replacement: Replacement) {
        return replacement.status == 'closed'
            || replacement.has_confirmed_substitute === true;
    }

    const data = useState('data', () => []);
    const count = useState<number>('count', () => 0);

    const nursesAccepted = async (page = 1, perPage = 15, options = {}) => {
        try {
            const response = await $apifetch('api/replacements/interest/accepted', {
                params: {
                    page,
                    perPage,
                    ...options,
                },
            });

            data.value = response.data ?? [];
            count.value = response.count ?? 0;
        }
        catch (error) {
            console.error('Erreur lors du chargement des données :', error);
        }
    };

    const nursesPosted = async (page = 1, perPage = 15, options = {}) => {
        try {
            const response = await $apifetch('/api/replacements/interest/posted', {
                params: { page, perPage, ...options },
            });

            data.value = response.data ?? [];
            count.value = response.count ?? 0;
        }
        catch (error) {
            console.error('Erreur chargement infirmières postées :', error);
        }
    };

    return {
        error,
        loading,
        success,
        user,
        replacements,
        data,
        count,
        submitReplacement,
        getMyReplacements,
        getReplacements,
        getAccordingReplacements,
        getReplacementsForAdmin,
        getFRStatus,
        updateReplacement,
        updateAgainReplacement,
        extractPostalDataFromReplacement,
        sendUrgentReplacement,
        showReplacement,
        forceDelete,
        activityUser,
        release,
        isClosed,
        nursesAccepted,
        nursesPosted,
    };
};

export const useSearchReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const replacements = useState<Pagination<Replacement>>('replacements', () => ({
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
    const error = useState('replacementError', () => null);
    const loadingSearch = useState('replacementLoading', () => false);

    async function fetchReplacements({
        postalCode = [],
        cities = [],
        selectedDays = [],
        type = '',
        country = '',
        filters = { type: 'all', role: 'all' },
        provinces = [],
        page = 1,
        perPage = PERPAGE,
    } = {}) {
        loadingSearch.value = true;
        error.value = null;

        const data = {
            zipCodes: postalCode,
            cities: cities,
            days: selectedDays,
            type: type,
            country: country,
            filters: filters,
            provinces: provinces,
            page,
            perPage,
        };

        try {
            const response = await $apifetch('api/replacements/search', {
                method: 'POST',
                body: JSON.stringify(data),
                query: { page, perPage },
            });

            replacements.value = response.replacements;
            return response;
        }
        catch (err) {
            console.error('Erreur lors de la requête :', err);
            error.value = err.message;
            throw err;
        }
        finally {
            loadingSearch.value = false;
        }
    }

    return { replacements, error, loadingSearch, fetchReplacements };
};

export const useDetailReplacement = (replacementId) => {
    const { $apifetch } = useNuxtApp();

    const replacement = useState('replacement', () => []);
    const error = useState('replacementError', () => null);
    const loading = useState('replacementLoading', () => false);

    async function fetchReplacement() {
        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch(`/api/replacements/${replacementId}`, { method: 'GET' });
            replacement.value = response.replacement;
        }
        catch (err) {
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    }

    return { replacement, error, loading, fetchReplacement };
};

export const sendResponse = () => {
    const { $apifetch, $toast } = useNuxtApp();
    const { requirePlatformAccess, isPlatformAccessError } = useSubscription();

    const isDisabled = useState('replacementResponseIsDisabled', () => false);

    const submitResponse = async (formData) => {
        if (!(await requirePlatformAccess())) {
            return false;
        }

        isDisabled.value = true;
        try {
            await $apifetch('/api/replacement-responses/send', {
                method: 'POST',
                body: formData,
            });
            toast.success('Réponse envoyée avec succès');
            return true;
        }
        catch (e) {
            if (isPlatformAccessError(e)) {
                const { redirectToAccesPlan } = useSubscription();
                await redirectToAccesPlan();
                return false;
            }

            const errorMessage = e?.data?.message || e?.message || 'Une erreur est survenue lors de l\'envoi de la réponse';
            toast.error(errorMessage);
            throw e;
        }
        finally {
            isDisabled.value = false;
        }
    };

    return {
        isDisabled,
        submitResponse,
    };
};

export const useListResponse = (id) => {
    const { $apifetch } = useNuxtApp();

    const listResponse = useState('listResponse', () => []);
    const listApply = useState('listApply', () => []);
    const loading = useState('replacementListResponseLoading', () => false);

    async function fetchListResponse(older = false) {
        loading.value = true;
        try {
            const response = await $apifetch(`api/replacement-responses/${id}`, { method: 'GET', query: { older } });
            console.log('response', response);
            listResponse.value = response.responses;
        }
        finally {
            loading.value = false;
        }
    }

    async function getReplacementResponses() {
        const response = await $apifetch(`api/replacement-responses/nurse/${id}`, { method: 'GET' });
        listResponse.value = response.data;
    }

    async function getReplacementApply() {
        const response = await $apifetch(`api/replacement-responses/applied/${id}`, { method: 'GET' });
        listApply.value = response.data;
    }

    return { loading, listResponse, listApply, fetchListResponse, getReplacementResponses, getReplacementApply };
};

export const changeStatusReplacement = () => {
    const { $apifetch } = useNuxtApp();
    const changeStatus = async (responseId: number, status: string) => {
        try {
            await $apifetch(`/api/replacement-responses/${responseId}/update-status?status=${status}`, {
                method: 'PUT',
            });
            toast.success('Mise à jour effectuée');
        }
        catch (e) {
            toast.error('Une erreur est survenue lors de la mise à jour.');
            throw e;
        }
    };

    return { changeStatus };
};

export const useNearbyReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const replacements = useState('replacements', () => []);
    const perPage = ref(PERPAGE);
    const pagination = useState('replacementsPagination', () => ({
        current_page: 1,
        per_page: perPage.value,
        total: 0,
        last_page: 1,
    }));
    const error = useState('replacementsError', () => null);

    async function fetchNearbyreplacements(page = 1, customPerPage) {
        const pageSize = customPerPage ?? perPage.value;
        try {
            const response = await $apifetch('/api/replacements/open', {
                method: 'GET',
                query: {
                    page,
                    perPage: pageSize,
                },
            });

            replacements.value = response.data;
            pagination.value = {
                current_page: response.current_page,
                per_page: response.per_page,
                total: response.total,
                last_page: response.last_page,
            };
        }
        catch (err) {
            error.value = err?.data?.message || 'Erreur lors de la récupération des remplacements';
        }
    }

    return {
        replacements,
        pagination,
        fetchNearbyreplacements,
        error,
    };
};
