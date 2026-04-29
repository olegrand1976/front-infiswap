import type { CountryCode } from '~/lib/types';

export function useLocation() {
    const { $apifetch } = useNuxtApp();
    const loading = useState('loading', () => false);
    async function findNearbyCodes(
        zipCode: string,
        radiusKm = 5,
        country: CountryCode = 'be',
    ): Promise<[string, string][]> {
        try {
            const result = await $apifetch<[string, string][]>(
                '/api/location/nearby',
                {
                    params: {
                        code: zipCode,
                        radius: radiusKm,
                        country,
                    },
                },
            );

            return result;
        }
        catch (error) {
            console.error(
                'Erreur lors de la récupération des codes postaux limitrophes :',
                error,
            );
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

            return [];
        }
        catch {
            console.error('Une erreur est survenu lors de la génération des villes');
        }
        finally {
            loading.value = false;
        }
    }

    async function getCitiesFomZipCode(
        zipCode: string,
        country: CountryCode = 'be',
    ) {
        try {
            const citiesFromApi = await $apifetch<string[]>('/api/location/cities', {
                params: { code: zipCode, country },
            });

            return citiesFromApi ?? [];
        }
        catch (error) {
            console.error('Erreur lors de la récupération des villes :', error);
            return [];
        }
    }

    async function getZipCodeFromCity(
        city: string,
        country: CountryCode = 'be',
    ): Promise<string | null> {
        try {
            const postalCodes = await $apifetch<string[]>(
                '/api/location/postal-codes',
                {
                    params: { city, country },
                },
            );

            if (Array.isArray(postalCodes) && postalCodes.length > 0) {
                return postalCodes[0] ?? null;
            }

            return null;
        }
        catch (error) {
            console.error('Erreur lors de la récupération du code postal :', error);
            return null;
        }
    }

    return {
        loading,
        getNearbyLocalities,
        getCitiesFomZipCode,
        getZipCodeFromCity,
    };
}
