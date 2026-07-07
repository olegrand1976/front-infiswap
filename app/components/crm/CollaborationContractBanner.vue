<template>
    <div
        v-if="visible"
        class="mx-4 mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
        <p class="font-semibold">
            Contrat de collaboration requis
        </p>
        <p class="mt-1">
            {{ message }}
        </p>
        <NuxtLink
            to="/dashboard/admin/users/crm/my-collaboration"
            class="mt-2 inline-block text-amber-900 underline font-medium"
        >
            Gérer ma collaboration →
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { CollaborationStatus } from '@/composables/useCommercialCollaboration';

const props = defineProps<{
    status: CollaborationStatus | null;
}>();

const visible = computed(() => {
    if (!props.status) return false;
    return !props.status.can_earn_commissions;
});

const message = computed(() => {
    if (!props.status) return '';
    if (props.status.commercial_collaboration_status === 'pending_framework') {
        return 'Signez votre contrat-cadre pour activer les commissions et envoyer des bons de commande institution.';
    }
    if (props.status.has_pending_signature) {
        return 'Un avenant de grade est en attente de signature — le nouveau barème ne s\'appliquera qu\'après signature.';
    }
    return 'Votre dossier collaboration est incomplet.';
});
</script>
