export const useRelaunch = () => {
    const { $apifetch } = useNuxtApp();

    const relaunchMailToCreator = async (formData) => {
        return await $apifetch(`/api/replacements/${formData.id}/relaunch-creator`, {
            method: 'POST',
            body: formData,
        });
    };

    const relaunchMailToRegion = async (formData) => {
        return await $apifetch(`/api/replacements/${formData.id}/relaunch-interested`, {
            method: 'POST',
            body: formData,
        });
    };

    const fetchRelaunchHistory = async (replacementId) => {
        return await $apifetch(`/api/relaunch-managers/${replacementId}`);
    };

    return {
        relaunchMailToCreator,
        relaunchMailToRegion,
        fetchRelaunchHistory,
    };
};
