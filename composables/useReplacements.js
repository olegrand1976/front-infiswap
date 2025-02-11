import { useState, useNuxtApp } from '#app';

export const currentUser=()=>{
  const { $apifetch } = useNuxtApp();
  const user = useState('user');
 console.log('user',user);
  return {
    user,
};
}

export const useReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const error = useState('replacementError', () => null);
    const loading = useState('replacementLoading', () => false);
    const success = useState('replacementSuccess', () => false);

    const user = useState('user');
    console.log(user.value);

    const submitReplacement = async (formData) => {
        loading.value = true;
        error.value = null;
        success.value = false;

        try {
            const cleanFormData = JSON.parse(JSON.stringify(formData));
            console.log('Données envoyées :', JSON.stringify(cleanFormData, null, 2));
            const response = await $apifetch('/api/replacements', {
                method: 'POST',
                body: JSON.stringify(cleanFormData, null, 2),
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
        user,
        submitReplacement,
    };
};

export const useGetReplacements = () => {
    const { $apifetch } = useNuxtApp();

    const replacements = useState('replacements', () => []);
    const error = useState('replacementError', () => null);
    const loading = useState('replacementLoading', () => false);

    async function fetchReplacements() {
        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch(`/api/replacements`, { method: 'GET' });
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
            console.log("Données récupérées:", response);
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

export const useListResponse = (replacementId) => {
    const { $apifetch } = useNuxtApp();

    const listResponse = useState('listResponse', () => []);
    const error = useState('listError', () => null);
    const loading = useState('listLoading', () => false);

    async function fetchListResponse() {
        loading.value = true;
        error.value = null;

        try {
            const response = await $apifetch(`api/replacement-responses/${replacementId}`, { method: 'GET' });
            console.log('Données récupérées de la liste des réponses :', response.responses);
            listResponse.value = response.responses;
        }
        catch (err) {
            error.value = err;
        }
        finally {
            loading.value = false;
        }
    }

    return { listResponse, error, loading, fetchListResponse };
};
