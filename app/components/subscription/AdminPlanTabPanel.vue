<template>
    <div class="space-y-6">
        <div
            v-if="plan"
            class="max-w-lg mx-auto bg-white border border-gray-100 rounded-lg p-6 space-y-4"
        >
            <div class="text-center">
                <h2 class="text-xl font-semibold text-success">
                    {{ plan.name }}
                </h2>
                <p
                    v-if="plan.description"
                    class="mt-2 text-gray-500 text-sm"
                >
                    {{ plan.description }}
                </p>
                <p class="mt-4 text-3xl font-bold text-gray-800">
                    {{ plan.amount }} {{ currencySymbol(plan.currency) }}
                </p>
                <p class="text-sm text-gray-400 mt-1">
                    {{ intervalDescription(plan) }}
                </p>
            </div>

            <div class="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-500">Statut</span>
                    <span class="font-medium text-success">Actif</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-500">Priorité</span>
                    <span>{{ plan.priority }}</span>
                </div>
                <div>
                    <span class="text-gray-500">Stripe Price ID</span>
                    <p class="font-mono text-xs mt-1 break-all text-gray-700">
                        {{ plan.stripe_price_id }}
                    </p>
                </div>
            </div>

            <div
                v-if="isSuperAdmin"
                class="flex flex-wrap gap-3 justify-center pt-2"
            >
                <Button
                    class="rounded"
                    :href="`/dashboard/admin/subscription-plans/${plan.id}`"
                >
                    Modifier
                </Button>
                <Button
                    class="rounded"
                    variant="outline"
                    :href="createHref"
                >
                    Mettre à jour le prix
                </Button>
                <Button
                    class="rounded"
                    variant="outline"
                    :in-progress="deactivating"
                    @click="handleDeactivate"
                >
                    Désactiver
                </Button>
            </div>
        </div>

        <div
            v-else
            class="text-center py-8 space-y-4"
        >
            <p class="text-gray-500">
                Aucun plan actif pour le moment.
            </p>
            <Button
                v-if="isSuperAdmin"
                class="rounded"
                :href="createHref"
            >
                Créer un plan
            </Button>
        </div>

        <div
            v-if="inactivePlans.length"
            class="max-w-lg mx-auto space-y-3"
        >
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Plans inactifs
            </h3>
            <div
                v-for="inactive in inactivePlans"
                :key="inactive.id"
                class="bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between gap-4"
            >
                <div>
                    <p class="font-medium">
                        {{ inactive.name }}
                    </p>
                    <p class="text-sm text-gray-500">
                        {{ inactive.amount }} {{ currencySymbol(inactive.currency) }}
                        · {{ intervalDescription(inactive) }}
                    </p>
                </div>
                <Button
                    v-if="isSuperAdmin"
                    class="rounded shrink-0"
                    variant="outline"
                    size="sm"
                    :in-progress="activatingId === inactive.id"
                    @click="handleActivate(inactive.id)"
                >
                    Réactiver
                </Button>
            </div>
        </div>

        <p class="text-center text-xs text-gray-400 max-w-md mx-auto">
            {{ helpText }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { StripePlanAdmin } from '~/composables/useSubscriptionPlansAdmin';

const props = defineProps<{
    plan: StripePlanAdmin | null;
    inactivePlans: StripePlanAdmin[];
    tabKey: string;
    group: 'access' | 'boost';
    feature?: string;
}>();

const emit = defineEmits<{
    refresh: [];
}>();

const { activatePlan, deactivatePlan } = useSubscriptionPlansAdmin();
const { isSuperAdmin } = useAuth();

const activatingId = ref<number | null>(null);
const deactivating = ref(false);

const createHref = computed(() => {
    const params = new URLSearchParams({ tab: props.tabKey });
    return `/dashboard/admin/subscription-plans/create?${params.toString()}`;
});

const helpText = computed(() =>
    props.group === 'access'
        ? 'Ce plan est proposé aux infirmières pour l\'accès permanent. Pour changer le tarif, créez un nouveau prix ou réactivez un ancien plan.'
        : 'Ce plan est proposé pour la mise en avant des remplacements. Pour changer le tarif, créez un nouveau prix ou réactivez un ancien plan.',
);

const currencySymbol = (currency: string) => (currency?.toLowerCase() === 'gbp' ? '£' : '€');

const intervalDescription = (plan: StripePlanAdmin) => {
    if (plan.type === 'platform_access' || plan.interval === 'one_time') {
        if (plan.duration_days) {
            return `Paiement unique · ${plan.duration_days} jours`;
        }
        return 'Paiement unique — accès permanent';
    }

    const labels: Record<string, string> = {
        week: 'Abonnement hebdomadaire',
        month: 'Abonnement mensuel',
        quarter: 'Abonnement trimestriel',
    };

    return labels[plan.interval] ?? plan.interval;
};

const handleActivate = async (id: number) => {
    activatingId.value = id;
    try {
        await activatePlan(id);
        emit('refresh');
    }
    finally {
        activatingId.value = null;
    }
};

const handleDeactivate = async () => {
    if (!props.plan) return;
    deactivating.value = true;
    try {
        await deactivatePlan(props.plan.id);
        emit('refresh');
    }
    finally {
        deactivating.value = false;
    }
};
</script>
