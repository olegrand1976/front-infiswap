import { useRouter } from 'vue-router';
import { useState, useNuxtApp } from '#app';
import type { Pagination, Replacement } from '~/lib/types';

export const useReplacements = () => {
    const { $apifetch } = useNuxtApp();
    const router = useRouter();
    const { $toast } = useNuxtApp();

    const myReplacements = useState('myReplacements', () => []);
    const replacements = useState<Pagination<Replacement> | null>('replacements', () => null);
    const error = useState('replacementError', () => null);
    const loading = useState('replacementLoading', () => false);
    const success = useState('replacementSuccess', () => false);

    const user = useState('user');

    const submitReplacement = async (formData) => {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            let response;

            await $apifetch('/api/replacements', {
                method: 'POST',
                body: JSON.stringify(formData),
            }).then(() => {
                $toast({
                    description: 'Création effectuée',
                });

                setTimeout(() => {
                    router.push('me');
                }, 3000);
            }).catch((error) => {
                if (error.data && error.data.errors) {
                    const backendErrors = error.data.errors;
                    const errorMessages: string[] = [];

                    Object.keys(backendErrors).forEach((field) => {
                        backendErrors[field].forEach((message: string) => {
                            errorMessages.push(message);
                        });
                    });

                    if (errorMessages.length > 0) {
                        $toast({
                            description: errorMessages.join('/'),
                            status: 'error',
                            variant: 'destructive',
                        });
                    }
                }
                else {
                    $toast({
                        description: 'Une erreur est survenue. Veuillez réessayer.',
                        status: 'error',
                        variant: 'destructive',
                    });
                }
            });

            if (response?.success) {
                success.value = true;
            }
        }
        catch (err) {
            error.value = err;
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

    const getReplacementsForAdmin = async () => {
        return await $apifetch('api/admin/replacements').then((response) => {
            replacements.value = response.replacements;
        });
    };

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
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            let response;

            await $apifetch('/api/replacements/immediate', {
                method: 'POST',
                body: JSON.stringify(formData),
            }).then((res) => {
                response = res;
                $toast({
                    description: 'Création d\'un remplacement rapide effectuée',
                });
            }).catch((error) => {
                if (error.data && error.data.errors) {
                    const backendErrors = error.data.errors;
                    const errorMessages: string[] = [];

                    Object.keys(backendErrors).forEach((field) => {
                        backendErrors[field].forEach((message: string) => {
                            errorMessages.push(message);
                        });
                    });

                    if (errorMessages.length > 0) {
                        $toast({
                            description: errorMessages.join('/'),
                            status: 'error',
                            variant: 'destructive',
                        });
                    }
                }
                else {
                    $toast({
                        description: 'Une erreur est survenue. Veuillez réessayer.',
                        status: 'error',
                        variant: 'destructive',
                    });
                }
            });

            if (response?.success) {
                success.value = true;
            }
        }
        catch (err) {
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    };

    const updateReplacement = async (formData) => {
        await $apifetch('/api/replacements/immediate', {
            method: 'POST',
            body: formData,
        });
    };

    return {
        error,
        loading,
        success,
        user,
        replacements,
        submitReplacement,
        getMyReplacements,
        getReplacements,
        getReplacementsForAdmin,
        getFRStatus,
        updateReplacement,
        extractPostalDataFromReplacement,
        sendUrgentReplacement,
    };
};

export const useSearchReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const replacements = useState('replacements', () => []);
    const error = useState('replacementError', () => null);
    const loadingSearch = useState('replacementLoading', () => false);

    async function fetchReplacements({
        postalCode = [],
        cities = [],
        selectedDays = [],
        type = '',
    } = {}) {
        loadingSearch.value = true;
        error.value = null;

        const data = {
            zipCodes: postalCode,
            cities: cities,
            days: selectedDays,
            type: type,
        };

        try {
            const response = await $apifetch('api/replacements/search', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            return response;
        }
        catch (err) {
            console.error('Erreur lors de la requête :', err);
            error.value = err.message || 'Une erreur est survenue';
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

    const isDisabled = useState('isDisabled', () => false);

    const submitResponse = async (formData) => {
        return await $apifetch('/api/replacement-responses/send', {
            method: 'POST',
            body: formData,
        }).then(() => {
            isDisabled.value = true;
            $toast({
                description: 'Réponse envoyée avec succès',
            });
        }).catch((e) => {
            isDisabled.value = false;
            $toast({
                variant: 'destructive',
                description: e.data.message,
            });
        });
    };

    return {
        isDisabled,
        submitResponse,
    };
};

export const useListResponse = (replacementId) => {
    const { $apifetch } = useNuxtApp();

    const listResponse = useState('listResponse', () => []);
    const loading = useState('loading', () => false);
    async function fetchListResponse() {
        const response = await $apifetch(`api/replacement-responses/${replacementId}`, { method: 'GET' });
        listResponse.value = response.responses;
    }

    return { loading, listResponse, fetchListResponse };
};

export const changeStatusReplacement = () => {
    const { $apifetch } = useNuxtApp();
    const changeStatus = async (responseId: number, status: string) => {
        return await $apifetch(`/api/replacement-responses/${responseId}/update-status?status=${status}`, {
            method: 'PUT',
        });
    };

    return { changeStatus };
};

export const useNearbyReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const replacements = useState('replacements', () => []);
    const error = useState('replacementsError', () => null);

    async function fetchNearbyreplacements() {
        try {
            const response = await $apifetch('/api/replacements/open', {
                method: 'GET',
            });

            replacements.value = response;
        }
        catch (err) {
            error.value = err?.data?.message || 'Erreur lors de la récupération des patients';
        }
    }

    return {
        replacements,
        fetchNearbyreplacements,
    };
};
