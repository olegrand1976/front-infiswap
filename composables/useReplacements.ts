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
            const cleanFormData = JSON.parse(JSON.stringify(formData));
            console.log('Données envoyées :', JSON.stringify(cleanFormData, null, 2));

            let response;

            await $apifetch('/api/replacements', {
                method: 'POST',
                body: JSON.stringify(cleanFormData, null, 2),
            }).then((res) => {
                response = res;
                $toast({
                    description: 'Création effectuée',
                });

                setTimeout(() => {
                    router.replace('detail/' + response.replacement.id);
                }, 3000);
            }).catch((err) => {
                console.error('Erreur API :', err);
                throw err;
            });

            if (response?.success) {
                success.value = true;
            }
        }
        catch (err) {
            error.value = err;
            console.error('Erreur lors de la soumission :', err);
        }
        finally {
            loading.value = false;
        }
    };

    const getReplacements = async () => {
        try {
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
        submitReplacement,
        getMyReplacements,
        getReplacements,
    };
};

export const useSearchReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const replacements = useState('replacements', () => []);
    const error = useState('replacementError', () => null);
    const loading = useState('replacementLoading', () => false);

    async function fetchReplacements({ postalCode = [], cities = [], selectedDays = [] } = {}) {
        loading.value = true;
        error.value = null;

        try {
            const params = {
                zipCodes: postalCode.length ? postalCode : undefined,
                cities: cities.length ? cities : undefined,
                days: selectedDays.length ? selectedDays : undefined,
            };

            console.log('Paramètres envoyés :', params);

            const response = await $apifetch(`/api/replacements/search`, {
                method: 'GET',
                params: { params: JSON.stringify(params) },
            });

            console.log('Données récupérées :', response.replacements);
            replacements.value = response.replacements;
        }
        catch (err) {
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    }

    return { replacements, error, loading, fetchReplacements };
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

    async function fetchListResponse() {
        try {
            const response = await $apifetch(`api/replacement-responses/${replacementId}`, { method: 'GET' });
            console.log('Données récupérées de la liste des réponses :', response.responses);
            listResponse.value = response.responses;
        }
        catch (err) {
            console.log(err);
        }
    }

    return { listResponse, fetchListResponse };
};

export const changeStatusReplacement = () => {
    const { $apifetch } = useNuxtApp();

    const success = useState('statusSuccess', () => false);

    const changeStatus = async (responseId) => {
        try {
            const response = await $apifetch(`/api/replacement-responses/${responseId}/update-status?status=confirmed`, {
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
