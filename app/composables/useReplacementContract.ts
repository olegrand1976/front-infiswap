import { parseConfirmAccessOutcome, type ConfirmAccessOutcome } from '~/utils/accessReturn';

export type ConfirmContractResult = {
    outcome: ConfirmAccessOutcome;
};

export type ReplacementContractSignatureMode = 'electronic' | 'pdf_download';

export type CheckoutContractResult =
    | { kind: 'checkout'; url: string | null }
    | { kind: 'granted'; contractId: number | null };

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

    /**
     * Renvoie une URL Stripe, ou `granted` quand le contrat est inclus dans
     * l'abonnement Infiswap Pro : dans ce cas aucun paiement n'a lieu.
     */
    async function checkoutContract(
        replacementId: number,
        responseId: number,
        options: {
            signatureMode: ReplacementContractSignatureMode;
            includesPatientAccess: boolean;
        },
    ): Promise<CheckoutContractResult> {
        loading.value = true;
        try {
            const response = await $apifetch<{ url?: string; status?: string; contract_id?: number }>(
                `api/replacement-contracts/replacements/${replacementId}/responses/${responseId}/checkout`,
                {
                    method: 'POST',
                    body: {
                        signature_mode: options.signatureMode,
                        includes_patient_access: options.includesPatientAccess,
                    },
                },
            );

            if (response.status === 'granted') {
                return { kind: 'granted', contractId: response.contract_id ?? null };
            }

            return { kind: 'checkout', url: response.url ?? null };
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
