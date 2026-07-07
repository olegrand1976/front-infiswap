import { useState, useNuxtApp } from '#app';

export type CollaborationContract = {
    id: number;
    reference?: string | null;
    contract_type: string;
    status: string;
    signed_at?: string | null;
    created_at?: string | null;
    legal_template_version?: string | null;
    collaboration_effective_at?: string | null;
};

export type CollaborationStatus = {
    commercial_collaboration_status: string;
    has_pending_signature: boolean;
    can_earn_commissions: boolean;
    contracts: CollaborationContract[];
};

export const useCommercialCollaboration = () => {
    const { $apifetch } = useNuxtApp();
    const status = useState<CollaborationStatus | null>('commercialCollaborationStatus', () => null);

    async function fetchMyCollaboration() {
        const response = await $apifetch('api/crm/my-collaboration');
        status.value = response.data as CollaborationStatus;
        return status.value;
    }

    async function confirmIndependent(bceNiss: string) {
        const response = await $apifetch('api/crm/my-collaboration/confirm-independent', {
            method: 'POST',
            body: { bce_niss: bceNiss, confirmed: true },
        });
        status.value = response.data as CollaborationStatus;
        return response;
    }

    async function resendSignature(contractId: number) {
        return $apifetch(`api/crm/my-collaboration/contracts/${contractId}/resend-signature`, {
            method: 'POST',
        });
    }

    return {
        status,
        fetchMyCollaboration,
        confirmIndependent,
        resendSignature,
    };
};
