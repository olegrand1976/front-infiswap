export type NursesMapCountry = 'be' | 'fr';

export type NursesMapPoint = {
    zip: string;
    city: string;
    latitude: number;
    longitude: number;
    count: number;
};

export type NursesMapResponse = {
    points: NursesMapPoint[];
    unresolved_count: number;
    institution_points: NursesMapPoint[];
    institution_unresolved_count: number;
};

export type NursesMapGeocodeResult = {
    latitude: number;
    longitude: number;
    label: string;
};

export const useNursesMap = () => {
    const { $apifetch } = useNuxtApp();

    const fetchMap = async (country: NursesMapCountry): Promise<NursesMapResponse> => {
        return await $apifetch(`api/admin/nurses/map?country=${country}`);
    };

    const geocode = async (
        query: string,
        country: NursesMapCountry,
    ): Promise<NursesMapGeocodeResult> => {
        const params = new URLSearchParams({
            q: query,
            country,
        });

        return await $apifetch(`api/admin/nurses/map/geocode?${params.toString()}`);
    };

    return { fetchMap, geocode };
};
