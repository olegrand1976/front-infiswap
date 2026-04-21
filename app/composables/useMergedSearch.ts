import type { Institution } from '~/lib/types';

export interface MergedItem {
    id: number;
    record_type: 'replacement' | 'mission';
    province?: string | null;
    created_at?: string;
    // Replacement
    user_id?: number;
    institution_id?: number | null;
    replacement_type?: string | null;
    type?: string;
    status?: string;
    periods?: Array<{ start_date: string; end_date: string }>;
    zip_codes?: string[];
    cities?: string[];
    care_types?: Array<{ id: number; name: string }>;
    comment?: string;
    patient_count?: number;
    time_slot?: Record<string, unknown>;
    details?: Record<string, unknown>[];
    has_confirmed_substitute?: boolean;
    confirmed_substitute?: Record<string, unknown> | null;
    user?: { id: number; full_name?: string; name?: string; phone_number?: string; institution?: Institution };
    institution?: { id: number; name: string; logo?: string | null } | null;
    // Mission
    institution_id_mission?: number;
    service_id?: number | null;
    candidate_id?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    time_start_at?: string;
    time_end_at?: string;
    description?: string | null;
    required_diploma?: string | null;
    service?: { id: number; name: string } | null;
    has_answered?: boolean;
}

export interface MergedPagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from?: number;
    to?: number;
}

export interface SearchParams {
    postalCode?: string[];
    cities?: string[];
    selectedDays?: string[];
    type?: string;
    country?: string;
    filters?: { type: string; role: string };
    provinces?: string[];
    page?: number;
    perPage?: number;
    groupByProvince?: boolean;
}

export const useMergedSearch = () => {
    const loading = ref(false);
    const { $apifetch } = useNuxtApp();

    const fetchMerged = async (params: SearchParams): Promise<{
        items: MergedItem[];
        pagination: MergedPagination;
    }> => {
        loading.value = true;
        try {
            const body = {
                days: params.selectedDays ?? [],
                cities: params.cities ?? [],
                zipCodes: params.postalCode ?? [],
                type: params.type ?? '',
                country: params.country ?? 'be',
                filters: params.filters ?? { type: 'all', role: 'all' },
                provinces: params.provinces ?? [],
                page: params.page ?? 1,
                perPage: params.perPage ?? 25,
                groupByProvince: params.groupByProvince ?? false,
            };

            const response = await $apifetch<{
                replacements: {
                    data: MergedItem[];
                    total: number;
                    per_page: number;
                    current_page: number;
                    last_page: number;
                    from?: number;
                    to?: number;
                };
                message: string;
            }>('/api/replacements/search/merged', {
                method: 'POST',
                body,
            });

            return {
                items: response.replacements.data ?? [],
                pagination: {
                    current_page: response.replacements.current_page,
                    per_page: response.replacements.per_page,
                    total: response.replacements.total,
                    last_page: response.replacements.last_page,
                    from: response.replacements.from,
                    to: response.replacements.to,
                },
            };
        }
        finally {
            loading.value = false;
        }
    };

    return { loading, fetchMerged };
};
