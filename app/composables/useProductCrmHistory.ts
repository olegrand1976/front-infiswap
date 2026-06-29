import type { CrmProductKey, ProductCrmHistoryEntry, Referrer } from '~/lib/types';

export type ProductActivationPayload = {
    effective_date: string;
    referred_by?: number | null;
    referred_by_text?: string | null;
};

export const useProductCrmHistory = () => {
    const { $apifetch } = useNuxtApp();
    const loadingHistories = ref(false);
    const submitting = ref(false);

    async function getProductCrmHistories(
        userId: number,
        product: CrmProductKey,
    ): Promise<ProductCrmHistoryEntry[]> {
        loadingHistories.value = true;
        try {
            const response = await $apifetch<{ histories: ProductCrmHistoryEntry[] }>(
                `/api/users/${userId}/product-crm-histories`,
                { query: { product } },
            );
            return response.histories ?? [];
        }
        finally {
            loadingHistories.value = false;
        }
    }

    async function activateProduct(
        userId: number,
        product: CrmProductKey,
        payload: ProductActivationPayload,
    ): Promise<{ user: Record<string, unknown> }> {
        submitting.value = true;
        try {
            return await $apifetch(`/api/users/${userId}/activate`, {
                method: 'PUT',
                body: {
                    [product]: true,
                    effective_date: payload.effective_date,
                    referred_by: payload.referred_by ?? null,
                    referred_by_text: payload.referred_by_text ?? null,
                },
            });
        }
        finally {
            submitting.value = false;
        }
    }

    async function deactivateProduct(
        userId: number,
        product: CrmProductKey,
    ): Promise<void> {
        await $apifetch(`/api/users/${userId}/activate`, {
            method: 'PUT',
            body: { [product]: false },
        });
    }

    async function getInstitutionProductCrmHistories(
        institutionId: number,
        product: CrmProductKey,
    ): Promise<ProductCrmHistoryEntry[]> {
        loadingHistories.value = true;
        try {
            const response = await $apifetch<{ histories: ProductCrmHistoryEntry[] }>(
                `/api/crm/institutions/${institutionId}/product-crm-histories`,
                { query: { product } },
            );
            return response.histories ?? [];
        }
        finally {
            loadingHistories.value = false;
        }
    }

    async function activateInstitutionProduct(
        institutionId: number,
        product: CrmProductKey,
        payload: ProductActivationPayload,
    ): Promise<{ user: Record<string, unknown>; representative_user_id?: number }> {
        submitting.value = true;
        try {
            const body: Record<string, unknown> = {
                [product]: true,
                effective_date: payload.effective_date,
            };

            if (payload.referred_by != null) {
                body.referred_by = payload.referred_by;
            }

            if (payload.referred_by_text != null) {
                body.referred_by_text = payload.referred_by_text;
            }

            return await $apifetch(`/api/crm/institutions/${institutionId}/activate`, {
                method: 'PUT',
                body,
            });
        }
        finally {
            submitting.value = false;
        }
    }

    async function deactivateInstitutionProduct(
        institutionId: number,
        product: CrmProductKey,
    ): Promise<void> {
        await $apifetch(`/api/crm/institutions/${institutionId}/activate`, {
            method: 'PUT',
            body: { [product]: false },
        });
    }

    function formatReferrerPayload(
        referrerMode: 'account' | 'text',
        selectedReferrer: Referrer | null,
        referrerText: string,
    ): Pick<ProductActivationPayload, 'referred_by' | 'referred_by_text'> {
        if (referrerMode === 'text') {
            return {
                referred_by: null,
                referred_by_text: referrerText.trim() || null,
            };
        }

        return {
            referred_by: selectedReferrer?.id ?? null,
            referred_by_text: null,
        };
    }

    return {
        loadingHistories,
        submitting,
        getProductCrmHistories,
        getInstitutionProductCrmHistories,
        activateProduct,
        activateInstitutionProduct,
        deactivateProduct,
        deactivateInstitutionProduct,
        formatReferrerPayload,
    };
};
