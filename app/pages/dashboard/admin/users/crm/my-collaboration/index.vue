<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Ma collaboration" />

        <DashboardAdminPageContent>
            <CollaborationContractBanner
                class="mb-6 mx-4"
                :status="collaboration"
            />

            <div class="mx-4 space-y-6">
                <CommercialCareerStatusCard
                    v-if="careerStatus"
                    :status="careerStatus"
                    :loading="careerLoading"
                />

                <div
                    v-if="needsIndependentConfirm"
                    class="rounded-lg border p-4 space-y-3 max-w-lg"
                >
                    <p class="text-sm font-medium">
                        Confirmation statut indépendant
                    </p>
                    <Input
                        v-model="bceNiss"
                        placeholder="BCE ou NISS"
                        class="rounded-md"
                    />
                    <Button
                        class="rounded-md"
                        :disabled="!bceNiss || submitting"
                        @click="submitIndependent"
                    >
                        Confirmer et générer le contrat-cadre
                    </Button>
                </div>

                <div class="rounded-lg border p-4 space-y-4">
                    <h2 class="font-semibold">
                        Ma rémunération nette
                    </h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p class="text-muted-foreground">Acquise</p>
                            <p class="font-semibold">{{ formatEuro(kpis?.commission_earned ?? 0) }}</p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">Versée</p>
                            <p class="font-semibold">{{ formatEuro(kpis?.commission_paid ?? 0) }}</p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">Reprises</p>
                            <p class="font-semibold text-red-600">{{ formatEuro(kpis?.commission_reversed ?? 0) }}</p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">Impact net</p>
                            <p class="font-semibold">{{ formatEuro(kpis?.net_remuneration_impact ?? 0) }}</p>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg border p-4 space-y-3">
                    <h2 class="font-semibold">
                        Contrats
                    </h2>
                    <div
                        v-if="!collaboration?.contracts?.length"
                        class="text-sm text-muted-foreground"
                    >
                        Aucun contrat généré.
                    </div>
                    <div
                        v-for="contract in collaboration?.contracts ?? []"
                        :key="contract.id"
                        class="flex flex-wrap justify-between gap-2 border-t pt-3 text-sm"
                    >
                        <div>
                            <p class="font-medium">{{ contract.reference ?? `#${contract.id}` }}</p>
                            <p class="text-muted-foreground">{{ contractTypeLabel(contract.contract_type) }} — {{ contract.status }}</p>
                        </div>
                        <Button
                            v-if="contract.status !== 'signed'"
                            variant="outline"
                            size="sm"
                            class="rounded-md"
                            @click="resend(contract.id)"
                        >
                            Renvoyer signature
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import CollaborationContractBanner from '@/components/crm/CollaborationContractBanner.vue';
import CommercialCareerStatusCard from '@/components/crm/CommercialCareerStatusCard.vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

useHead({ title: 'Ma collaboration' });

const { getMyCareerStatus } = useInstitutionCrmSettings();
const { fetchMyCollaboration, confirmIndependent, resendSignature, status: collaboration } = useCommercialCollaboration();
const { getMyKpis, kpis } = useInstitutionCommissionTracking();

const careerStatus = ref<Awaited<ReturnType<typeof getMyCareerStatus>> | null>(null);
const careerLoading = ref(false);
const bceNiss = ref('');
const submitting = ref(false);

const needsIndependentConfirm = computed(() =>
    collaboration.value?.commercial_collaboration_status === 'pending_framework',
);

function formatEuro(value: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
}

function contractTypeLabel(type: string) {
    return type === 'commercial_career_amendment' ? 'Avenant grade' : 'Contrat-cadre';
}

async function submitIndependent() {
    submitting.value = true;
    try {
        await confirmIndependent(bceNiss.value);
    }
    finally {
        submitting.value = false;
    }
}

async function resend(contractId: number) {
    await resendSignature(contractId);
}

onMounted(async () => {
    careerLoading.value = true;
    try {
        await Promise.all([
            fetchMyCollaboration(),
            getMyKpis(),
            getMyCareerStatus().then((s) => { careerStatus.value = s; }),
        ]);
    }
    finally {
        careerLoading.value = false;
    }
});
</script>
