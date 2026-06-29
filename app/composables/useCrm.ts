import { useState, useNuxtApp } from '#app';
import type { CrmInstitution, Pagination, User } from '~/lib/types';

function clonePagination<T>(pagination: Pagination<T>): Pagination<T> {
    return structuredClone(pagination);
}
import {
    buildCrmCacheKey,
    clearCrmCache,
    clearCrmCacheKey,
    getCrmCacheEntry,
    setCrmCacheEntry,
} from '@/composables/useCrmCache';

type GetCrmPlusOptions = Record<string, unknown> & {
    force?: boolean;
};

type GetCrmPlusResult = {
    fromCache: boolean;
};

export type CrmActivityKpis = {
    total: number;
    registered_this_month: number;
    registered_previous_month: number;
    with_insurance?: number;
    total_sales?: number;
    with_active_subscription?: number;
    with_signed_bc?: number;
    without_contact_30_days: number;
};

export type CrmCommercialActivityRow = {
    user_id: number;
    full_name: string;
    email: string;
    status: string | null;
    status_label: string;
    roles: string[];
    roles_label: string;
    can_revoke: boolean;
    nb_call: number;
    nb_sale: number;
    nb_recommandation: number;
    nb_meeting: number;
    nb_pending: number;
    total_actions: number;
};

export type CrmCommercialActivityResponse = {
    period: {
        preset?: string;
        start_date?: string;
        end_date?: string;
    };
    rows: CrmCommercialActivityRow[];
};

export type CrmHistoryEntry = {
    id: number;
    field_name?: string | null;
    action_type?: string | null;
    method?: string | null;
    status?: string | null;
    comment?: string | null;
    number_of_times?: number | null;
    start_date?: string | null;
    end_date?: string | null;
    old_value?: string | null;
    new_value?: string | null;
    product?: { id: number; name: string } | null;
    creator?: { id: number; full_name: string } | null;
    created_at?: string | null;
};

export const useCrm = () => {
    const users = useState<Pagination<User> | null>('users', () => null);
    const institutions = useState<Pagination<CrmInstitution> | null>('crmInstitutions', () => null);
    const count = useState<number>('userCount', () => 0);
    const institutionsCount = useState<number>('crmInstitutionsCount', () => 0);
    const trashCount = useState<number>('userTrashCount', () => 0);
    const { $apifetch } = useNuxtApp();

    async function getCrmPlus(
        page = 1,
        perPage = 15,
        options: GetCrmPlusOptions = {},
    ): Promise<GetCrmPlusResult> {
        const { force = false, deleted = false, ...filters } = options;
        const requestParams = { deleted, ...filters };
        const cacheKey = buildCrmCacheKey(page, perPage, requestParams, 'users');

        if (!force) {
            const cached = getCrmCacheEntry(cacheKey);
            if (cached?.users) {
                users.value = clonePagination(cached.users);
                count.value = cached.count;
                trashCount.value = cached.trashCount ?? 0;

                return { fromCache: true };
            }
        }

        const response = await $apifetch('api/crm', {
            params: {
                page,
                perPage,
                deleted,
                ...filters,
            },
        });

        users.value = clonePagination(response.users);
        count.value = response.count;
        trashCount.value = response.trashed_count;

        setCrmCacheEntry(cacheKey, {
            users: clonePagination(response.users),
            count: response.count,
            trashCount: response.trashed_count,
            cachedAt: Date.now(),
        });

        return { fromCache: false };
    }

    async function getCrmInstitutions(
        page = 1,
        perPage = 15,
        options: GetCrmPlusOptions = {},
    ): Promise<GetCrmPlusResult> {
        const { force = false, ...filters } = options;
        const requestParams = { ...filters };
        const cacheKey = buildCrmCacheKey(page, perPage, requestParams, 'institutions');

        if (!force) {
            const cached = getCrmCacheEntry(cacheKey);
            if (cached?.institutions) {
                institutions.value = clonePagination(cached.institutions);
                institutionsCount.value = cached.count;

                return { fromCache: true };
            }
        }

        const response = await $apifetch('api/crm/institutions', {
            params: {
                page,
                perPage,
                ...filters,
            },
        });

        institutions.value = clonePagination(response.institutions);
        institutionsCount.value = response.count;

        setCrmCacheEntry(cacheKey, {
            institutions: clonePagination(response.institutions),
            count: response.count,
            cachedAt: Date.now(),
        });

        return { fromCache: false };
    }

    async function getCrmKpis(
        scope: 'users' | 'institutions',
        options: Record<string, unknown> = {},
    ): Promise<CrmActivityKpis> {
        const response = await $apifetch('api/crm/kpis', {
            params: {
                scope,
                ...options,
            },
        });

        return response.data as CrmActivityKpis;
    }

    async function createInstitutionSubscription(
        institutionId: number,
        formula: 'institution_monthly_150' | 'institution_yearly_1500',
    ) {
        return await $apifetch(`/api/crm/institutions/${institutionId}/subscription`, {
            method: 'POST',
            body: { formula },
        });
    }

    async function openPdfInNewWindow(apiPath: string, loadingTitle: string) {
        const newWindow = window.open();
        if (!newWindow) {
            throw new Error('Impossible d\'ouvrir le PDF. Vérifiez le bloqueur de popups.');
        }

        newWindow.document.write(`
            <html>
                <head><title>${loadingTitle}</title></head>
                <body style="display:flex;align-items:center;justify-content:center;height:100vh;">
                    <h3>${loadingTitle}</h3>
                </body>
            </html>
        `);

        try {
            const response = await $apifetch(apiPath, { responseType: 'blob' });
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            newWindow.document.body.innerHTML = `
                <iframe src="${url}" frameborder="0" style="width:100%;height:100vh"></iframe>
            `;
        }
        catch {
            newWindow.document.body.innerHTML = '<h3>Erreur lors du chargement du PDF</h3>';
            throw new Error('Erreur lors du chargement du PDF');
        }
    }

    async function viewInstitutionSubscriptionPdf(institutionId: number, contractId: number) {
        await openPdfInNewWindow(
            `/api/crm/institutions/${institutionId}/subscription/${contractId}/pdf`,
            'Chargement du bon de commande...',
        );
    }

    async function openCrmDocumentationPdf(type: 'blank-purchase-order' | 'general-terms') {
        const paths = {
            'blank-purchase-order': '/api/crm/documentation/blank-purchase-order/pdf',
            'general-terms': '/api/crm/documentation/general-terms/pdf',
        };
        const titles = {
            'blank-purchase-order': 'Chargement du bon de commande vierge...',
            'general-terms': 'Chargement des conditions générales...',
        };

        await openPdfInNewWindow(paths[type], titles[type]);
    }

    async function sendInstitutionSubscriptionForSignature(institutionId: number, contractId: number) {
        return await $apifetch(
            `/api/crm/institutions/${institutionId}/subscription/${contractId}/send-for-signature`,
            { method: 'POST' },
        );
    }

    async function deleteInstitutionSubscriptionDraft(institutionId: number, contractId: number) {
        return await $apifetch(
            `/api/crm/institutions/${institutionId}/subscription/${contractId}`,
            { method: 'DELETE' },
        );
    }

    async function updateCrmInstitutionContact(
        institutionId: number,
        payload: { email?: string; phone_number?: string },
    ) {
        return await $apifetch(`/api/crm/institutions/${institutionId}/contact`, {
            method: 'PUT',
            body: payload,
        });
    }

    async function ensureCrmInstitutionContact(institutionId: number) {
        return await $apifetch(`/api/crm/institutions/${institutionId}/ensure-contact`, {
            method: 'POST',
        });
    }

    function invalidateCrmCacheKey(
        page: number,
        perPage: number,
        params: Record<string, unknown>,
        entity: 'users' | 'institutions' = 'users',
    ) {
        clearCrmCacheKey(buildCrmCacheKey(page, perPage, params, entity));
    }

    const crmUser = async (formData) => {
        return await $apifetch('/api/crm/plus', {
            method: 'POST',
            body: formData,
        });
    };

    const updateCrmUser = async (id, formData) => {
        return await $apifetch(`/api/crm/${id}/update`, {
            method: 'PUT',
            body: formData,
        });
    };

    async function getCrmHistories(crmUserId: number) {
        const response = await $apifetch<{ histories: CrmHistoryEntry[] }>(`api/crm/${crmUserId}/histories`);
        return response.histories ?? [];
    }

    async function getCommercialActivity(params: Record<string, unknown> = {}) {
        const response = await $apifetch<{ data: CrmCommercialActivityResponse }>('/api/crm/commercial-activity', {
            query: params,
        });
        return response.data ?? { period: {}, rows: [] };
    }

    async function revokeCommercialAccess(userId: number) {
        return $apifetch<{ message: string }>(`/api/crm/commercial-access/${userId}`, {
            method: 'DELETE',
        });
    }

    return {
        trashCount,
        users,
        institutions,
        count,
        institutionsCount,
        getCrmPlus,
        getCrmInstitutions,
        getCrmKpis,
        createInstitutionSubscription,
        viewInstitutionSubscriptionPdf,
        openCrmDocumentationPdf,
        sendInstitutionSubscriptionForSignature,
        deleteInstitutionSubscriptionDraft,
        updateCrmInstitutionContact,
        ensureCrmInstitutionContact,
        invalidateCrmCacheKey,
        clearCrmCache,
        crmUser,
        updateCrmUser,
        getCrmHistories,
        getCommercialActivity,
        revokeCommercialAccess,
        buildCrmCacheKey,
    };
};
