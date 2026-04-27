import type { CountryCode } from '~/lib/types';

export function useLocation() {
    const { $apifetch } = useNuxtApp();
    const loading = useState('loading', () => false);
    async function findNearbyCodes(
        zipCode: string,
        radiusKm = 5,
        country: CountryCode = 'be',
        excludeZipCodes: string[] = [],
        excludeCities: string[] = [],
    ): Promise<[string, string][]> {
        try {
            const result = await $apifetch<[string, string][]>('/api/location/nearby', {
                params: {
                    code: zipCode,
                    radius: radiusKm,
                    country,
                    exclude_zip_codes: excludeZipCodes,
                    exclude_cities: excludeCities,
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
            const nearbyCodes = await findNearbyCodes(
                zipCode,
                radiusKm,
                country,
                excludeZipCodes,
                excludeCities,
            );

            return nearbyCodes;
        }
        catch {
            console.error('Une erreur est survenu lors de la génération des villes');
            return [];
        }
        finally {
            loading.value = false;
        }
    }

    async function getCitiesFomZipCode(zipCode: string, country: CountryCode = 'be') {
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

    async function getZipCodesFromCity(city: string, country: CountryCode = 'be') {
        try {
            const zipCodesFromApi = await $apifetch<string[]>('/api/location/postal-codes', {
                params: { city, country },
            });

            return zipCodesFromApi ?? [];
        }
        catch (error) {
            console.error('Erreur lors de la récupération des codes postaux :', error);
            return [];
        }
    }

    return {
        loading,
        getNearbyLocalities,
        getCitiesFomZipCode,
        getZipCodesFromCity,
    };
}
