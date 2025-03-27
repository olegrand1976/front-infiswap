import { useRouter } from 'vue-router';
import { useState, useNuxtApp } from '#app';

export const useReplacements = () => {
    const { $apifetch } = useNuxtApp();
    const router = useRouter();
    const { $toast } = useNuxtApp();

    const myReplacements = useState('myReplacements', () => []);
    const replacements = useState('replacements', () => []);
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
            }).then((res) => {
                response = res;
                $toast({
                    description: 'Création effectuée',
                });

                setTimeout(() => {
                    router.replace('detail/' + response.replacement.id);
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

    return {
        error,
        loading,
        success,
        user,
        replacements,
        submitReplacement,
        getMyReplacements,
        getReplacements,
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
            console.log('Données récupérées:', response);
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
    const { $apifetch } = useNuxtApp();

    const error = useState('sendResponseError', () => null);
    const loading = useState('sendResponseLoading', () => false);
    const success = useState('sendResponseSuccess', () => false);

    const submitResponse = async (formData) => {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            const response = await $apifetch('/api/replacement-responses/send', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.success) {
                success.value = true;
            }
        }
        catch (err) {
            error.value = err;
            console.error('Erreur API :', err);
        }
        finally {
            loading.value = false;
        }
    };

    return {
        error,
        loading,
        success,
        submitResponse,
    };
};

export const useListResponse = (replacementId) => {
    const { $apifetch } = useNuxtApp();

    const listResponse = useState('listResponse', () => []);
    const loading = useState('loading', () => false);
    async function fetchListResponse() {
        try {
            loading.value = true;
            const response = await $apifetch(`api/replacement-responses/${replacementId}`, { method: 'GET' });
            console.log('Données récupérées de la liste des réponses :', response.responses);
            listResponse.value = response.responses;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            loading.value = false;
        }
    }

    return { loading, listResponse, fetchListResponse };
};

export const changeStatusReplacement = () => {
    const { $apifetch } = useNuxtApp();

    const success = useState('statusSuccess', () => false);
    const changeStatus = async (responseId: number, status: string) => {
        try {
            const response = await $apifetch(`/api/replacement-responses/${responseId}/update-status?status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.success) {
                success.value = true;
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    return { changeStatus };
};
