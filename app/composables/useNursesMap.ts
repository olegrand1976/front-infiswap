export type NursesMapCountry = 'be' | 'fr';

export type NursesMapPointType = 'nurses' | 'institutions';

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

export type NursesMapZipNurseItem = {
    id: number;
    firstname: string;
    lastname: string;
    email?: string | null;
};

export type NursesMapZipInstitutionItem = {
    id: number;
    name: string;
};

export type NursesMapZipListResponse = {
    zip: string;
    city: string;
    type: NursesMapPointType;
    items: NursesMapZipNurseItem[] | NursesMapZipInstitutionItem[];
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

    const fetchZipList = async (
        country: NursesMapCountry,
        zip: string,
        type: NursesMapPointType,
    ): Promise<NursesMapZipListResponse> => {
        const params = new URLSearchParams({
            country,
            zip,
            type,
        });

        return await $apifetch(`api/admin/nurses/map/zip?${params.toString()}`);
    };

    return { fetchMap, geocode, fetchZipList };
};
