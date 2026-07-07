import { parseConfirmAccessOutcome, type ConfirmAccessOutcome } from '~/utils/accessReturn';

export type ConfirmContractResult = {
    outcome: ConfirmAccessOutcome;
};

export type ReplacementContractSignatureMode = 'electronic' | 'pdf_download';

export interface ReplacementContractItem {
    id: number;
    replacement_id: number;
    status: string;
    signature_mode: ReplacementContractSignatureMode;
    includes_patient_access: boolean;
    paid_at: string | null;
    pdf_url: string | null;
    remplacant_name: string | null;
    replacement_period: string | null;
}

export function useReplacementContract() {
    const { $apifetch } = useNuxtApp();
    const loading = ref(false);

    async function checkoutContract(
        replacementId: number,
        responseId: number,
        options: {
            signatureMode: ReplacementContractSignatureMode;
            includesPatientAccess: boolean;
        },
    ): Promise<string | null> {
        loading.value = true;
        try {
            const response = await $apifetch<{ url?: string }>(
                `api/replacement-contracts/replacements/${replacementId}/responses/${responseId}/checkout`,
                {
                    method: 'POST',
                    body: {
                        signature_mode: options.signatureMode,
                        includes_patient_access: options.includesPatientAccess,
                    },
                },
            );

            return response.url ?? null;
        }
        finally {
            loading.value = false;
        }
    }

    async function confirmContract(sessionId: string): Promise<ConfirmContractResult> {
        try {
            const response = await $apifetch<{ status: string }>('api/replacement-contracts/confirm', {
                method: 'POST',
                body: { session_id: sessionId },
            });

            return { outcome: parseConfirmAccessOutcome(response) };
        }
        catch (error: unknown) {
            return { outcome: parseConfirmAccessOutcome(null, error) };
        }
    }

    async function fetchContracts(): Promise<ReplacementContractItem[]> {
        const response = await $apifetch<{ data: ReplacementContractItem[] }>(
            'api/replacement-contracts',
        );

        return response.data ?? [];
    }

    return {
        loading,
        checkoutContract,
        confirmContract,
        fetchContracts,
    };
}
