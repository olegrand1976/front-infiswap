import type { CountryCode } from '~/lib/types';

export function useLocation() {
    const { getCityFromZipCode } = useOpenai();
    const loading = useState('loading', () => false);
    async function findNearbyCodes(
        zipCode: string,
        radiusKm = 5,
        country: CountryCode = 'be',
    ): Promise<[string, string][]> {
        try {
            const result = await $fetch<[string, string][]>('/api/postal/nearby', {
                params: {
                    code: zipCode,
                    radius: radiusKm,
                    country,
                },
            });

            return result;
        }
        catch (error) {
            console.error('Erreur lors de la récupération des codes postaux limitrophes :', error);
            return [];
        }
    }

    async function getNearbyLocalities(
        zipCode: string,
        radiusKm = 5,
        country: CountryCode = 'be',
        excludeZipCodes: string[] = [],
        excludeCities: string[] = [],
    ) {
        try {
            loading.value = true;
            let nearbyCodes = await findNearbyCodes(zipCode, radiusKm, country);

            nearbyCodes = nearbyCodes.filter(
                ([code, city]) =>
                    !excludeZipCodes.includes(code) && !excludeCities.includes(city),
            );

            if (nearbyCodes.length > 0) {
                return nearbyCodes;
            }

            const localities = await getCityFromZipCode(zipCode);
            if (localities && localities.length > 0) {
                const filteredLocalities = localities.filter(city => !excludeCities.includes(city));

                return filteredLocalities.map(city => [zipCode, city] as [string, string]);
            }

            return [];
        }
        catch {
            console.error('Une erreur est survenu lors de la génération des villes');
        }
        finally {
            loading.value = false;
        }
    }

    async function getCitiesFomZipCode(zipCode: string, country: CountryCode = 'be') {
        try {
            const citiesFromApi = await $fetch<string[]>('/api/postal/cities', {
                params: { code: zipCode, country },
            });

            if (citiesFromApi && citiesFromApi.length > 0) {
                return citiesFromApi;
            }

            const citiesFromOpenAi = await getCityFromZipCode(zipCode);

            return citiesFromOpenAi ?? [];
        }
        catch (error) {
            console.error('Erreur lors de la récupération des villes :', error);
            return [];
        }
    }

    return {
        loading,
        getNearbyLocalities,
        getCitiesFomZipCode,
    };
}
