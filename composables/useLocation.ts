export function useLocation() {
    async function findNearbyCodes(
        zipCode: string,
        radiusKm = 5,
        country: 'be' | 'fr' | 'us' = 'be',
    ): Promise<[string, string][]> {
        try {
            const result = await $fetch<[string, string][]>(`/api/postal/nearby`, {
                params: {
                    code: zipCode,
                    radius: radiusKm,
                    country: country,
                },
            });
            return result;
        }
        catch (error) {
            console.error('Erreur lors de la récupération des codes postaux limitrophes :', error);
            return [];
        }
    }

    return {
        findNearbyCodes,
    };
}
