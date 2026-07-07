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
                    v-if="showStaffCareerHint"
                    class="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 max-w-lg"
                >
                    En tant qu'administrateur ou développeur, vous n'avez pas de contrat de collaboration.
                    Initialisez votre grade depuis le
                    <NuxtLink
                        to="/dashboard/admin/users/crm/commercial-activity"
                        class="underline font-medium"
                    >
                        récap activité commercial
                    </NuxtLink>.
                </div>

                <div
                    v-else-if="needsIndependentConfirm"
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

const { $toast } = useNuxtApp();
const { isAdmin, isSuperAdmin, isDeveloper, isSaleRepresentative, isCommunityManager } = useAuth();
const { getMyCareerStatus } = useInstitutionCrmSettings();
const { fetchMyCollaboration, confirmIndependent, resendSignature, status: collaboration } = useCommercialCollaboration();
const { getMyKpis, kpis } = useInstitutionCommissionTracking();

const careerStatus = ref<Awaited<ReturnType<typeof getMyCareerStatus>> | null>(null);
const careerLoading = ref(false);
const bceNiss = ref('');
const submitting = ref(false);

const isCollaborationEligible = computed(() =>
    isSaleRepresentative.value || isCommunityManager.value,
);

const hasFrameworkContract = computed(() =>
    (collaboration.value?.contracts ?? []).some(
        (contract) => contract.contract_type === 'commercial_collaboration_framework',
    ),
);

const showStaffCareerHint = computed(() =>
    !isCollaborationEligible.value
    && (isAdmin.value || isSuperAdmin.value || isDeveloper.value)
    && collaboration.value?.commercial_collaboration_status === 'pending_framework',
);

const needsIndependentConfirm = computed(() =>
    isCollaborationEligible.value
    && collaboration.value?.commercial_collaboration_status === 'pending_framework'
    && !hasFrameworkContract.value,
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
        const response = await confirmIndependent(bceNiss.value);
        $toast({ description: response.message ?? 'Contrat-cadre généré.' });
    }
    catch {
        $toast({
            description: 'Impossible de générer le contrat-cadre. Vérifiez votre BCE/NISS ou contactez l\'administrateur.',
            variant: 'destructive',
        });
    }
    finally {
        submitting.value = false;
    }
}

async function resend(contractId: number) {
    try {
        const response = await resendSignature(contractId);
        $toast({ description: response.message ?? 'Lien de signature renvoyé.' });
    }
    catch {
        $toast({ description: 'Impossible de renvoyer le lien de signature.', variant: 'destructive' });
    }
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
