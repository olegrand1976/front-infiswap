<template>
    <div class="space-y-5">
        <div
            v-if="plan"
            class="mx-auto max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
            <div class="bg-gradient-to-br from-primary/5 via-white to-emerald-50/40 px-6 py-8 text-center">
                <span class="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">
                    Plan actif
                </span>
                <h2 class="mt-4 text-xl font-semibold text-gray-900">
                    {{ plan.name }}
                </h2>
                <p
                    v-if="plan.description"
                    class="mt-2 text-sm text-gray-500"
                >
                    {{ plan.description }}
                </p>
                <p class="mt-5 text-4xl font-bold tracking-tight text-gray-900">
                    {{ plan.amount }}<span class="text-2xl font-semibold text-gray-500">{{ currencySymbol(plan.currency) }}</span>
                </p>
                <p class="mt-1 text-sm text-gray-400">
                    {{ intervalDescription(plan) }}
                </p>
            </div>

            <div class="space-y-3 border-t border-gray-100 px-6 py-5 text-sm">
                <div class="flex justify-between gap-4">
                    <span class="text-gray-500">Priorité</span>
                    <span class="font-medium text-gray-800">{{ plan.priority }}</span>
                </div>
                <div>
                    <span class="text-gray-500">Stripe Price ID</span>
                    <p class="mt-1 break-all font-mono text-xs text-gray-700">
                        {{ plan.stripe_price_id }}
                    </p>
                </div>
            </div>

            <div
                v-if="isSuperAdmin"
                class="flex flex-wrap justify-center gap-2 border-t border-gray-100 bg-gray-50/50 px-6 py-4"
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
            class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-10 text-center"
        >
            <p class="text-gray-500">
                Aucun plan actif pour le moment.
            </p>
            <Button
                v-if="isSuperAdmin"
                class="mt-4 rounded-lg"
                :href="createHref"
            >
                Créer un plan
            </Button>
        </div>

        <div
            v-if="inactivePlans.length"
            class="mx-auto max-w-lg space-y-3"
        >
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Plans inactifs
            </h3>
            <div
                v-for="inactive in inactivePlans"
                :key="inactive.id"
                class="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
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
