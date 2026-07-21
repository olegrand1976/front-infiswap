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
};

export const useNursesMap = () => {
    const { $apifetch } = useNuxtApp();

    const fetchMap = async (country: NursesMapCountry): Promise<NursesMapResponse> => {
        return await $apifetch(`api/admin/nurses/map?country=${country}`);
    };

    return { fetchMap };
};
