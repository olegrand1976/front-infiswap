<template>
    <form
        class="space-y-6"
        @submit.prevent="submit"
    >
        <div
            v-if="isEditMode && plan"
            class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-md border border-gray-100"
        >
            <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                    Type
                </p>
                <p class="font-medium mt-1">
                    {{ typeLabel(plan.type) }}
                </p>
            </div>
            <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                    Intervalle
                </p>
                <p class="font-medium mt-1">
                    {{ intervalLabel(plan.interval, plan.duration_days) }}
                </p>
            </div>
            <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                    Montant
                </p>
                <p class="font-medium mt-1">
                    {{ plan.amount }} €
                </p>
            </div>
            <div class="md:col-span-3">
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                    Stripe Price ID
                </p>
                <p class="font-mono text-sm mt-1 break-all">
                    {{ plan.stripe_price_id }}
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <InputIcon
                v-model="form.name"
                rounded="md"
                label="Nom"
                :placeholder="isBoostMode ? 'Mise en avant remplacement' : 'Accès InfiSwap'"
            />

            <template v-if="!isEditMode">
                <div
                    v-if="isBoostMode"
                    class="flex flex-col gap-2"
                >
                    <Label class="text-sm text-gray-500">Intervalle</Label>
                    <Select v-model="form.interval">
                        <SelectTrigger class="w-full rounded-md">
                            <SelectValue placeholder="Choisir un intervalle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem
                                    v-for="option in boostIntervalOptions"
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.label }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <InputIcon
                    v-model="form.amount"
                    rounded="md"
                    label="Montant (€)"
                    :placeholder="isBoostMode ? '5' : '15'"
                />

                <InputIcon
                    v-if="isBoostMode && form.interval === 'one_time'"
                    v-model="form.duration_days"
                    rounded="md"
                    label="Durée (jours)"
                    placeholder="7"
                />
            </template>

            <InputIcon
                v-model="form.description"
                rounded="md"
                label="Description"
                placeholder="Description affichée aux utilisateurs"
            />

            <InputIcon
                v-model="form.priority"
                rounded="md"
                label="Priorité"
                placeholder="10"
            />

            <div
                v-if="isEditMode"
                class="flex items-center gap-2"
            >
                <Checkbox
                    :checked="form.is_active"
                    @update:checked="form.is_active = $event"
                />
                <span class="text-sm">Plan actif</span>
            </div>

            <div
                v-else
                class="flex items-center gap-2"
            >
                <Checkbox
                    :checked="form.deactivate_previous"
                    @update:checked="form.deactivate_previous = $event"
                />
                <span class="text-sm">Désactiver les autres plans du même type</span>
            </div>
        </div>

        <div class="flex justify-center">
            <Button
                type="submit"
                class="rounded-md w-52"
                :in-progress="inProgress"
            >
                {{ isEditMode ? 'Enregistrer' : 'Créer et synchroniser Stripe' }}
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { StripePlanAdmin } from '~/composables/useSubscriptionPlansAdmin';

const props = defineProps({
    plan: {
        type: Object as PropType<StripePlanAdmin | null>,
        default: null,
    },
    mode: {
        type: String as PropType<'access' | 'boost'>,
        default: 'access',
    },
    feature: {
        type: String,
        default: 'replacement',
    },
});

const route = useRoute();
const { createPlan, updatePlan } = useSubscriptionPlansAdmin();
const isEditMode = computed(() => !!props.plan?.id);
const isBoostMode = computed(() => props.mode === 'boost');

const boostIntervalOptions = [
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'quarter', label: 'Trimestre' },
    { value: 'one_time', label: 'Paiement unique' },
] as const;

const typeLabel = (value: string) =>
    value === 'boost' ? 'Mise en avant' : 'Accès plateforme';

const intervalLabel = (value: string, durationDays?: number | null) => {
    if (value === 'one_time') {
        return durationDays ? `Paiement unique · ${durationDays} jours` : 'Paiement unique';
    }

    return boostIntervalOptions.find(o => o.value === value)?.label ?? value;
};

const form = reactive({
    name: '',
    type: 'platform_access' as StripePlanAdmin['type'],
    feature: 'replacement' as string | undefined,
    interval: 'week' as string,
    duration_days: 7,
    amount: 15,
    currency: 'eur',
    description: '',
    priority: 10,
    is_active: true,
    deactivate_previous: true,
});

watch(isBoostMode, (boost) => {
    form.type = boost ? 'boost' : 'platform_access';
    form.feature = boost ? props.feature : undefined;
    form.interval = boost ? 'week' : 'one_time';
    form.amount = boost ? 5 : 15;
}, { immediate: true });

const applyPlan = (plan: StripePlanAdmin) => {
    Object.assign(form, {
        name: plan.name,
        type: plan.type,
        feature: plan.feature ?? undefined,
        interval: plan.interval,
        duration_days: plan.duration_days ?? 7,
        amount: plan.amount,
        description: plan.description ?? '',
        priority: plan.priority,
        is_active: plan.is_active,
    });
};

watch(() => props.plan, (plan) => {
    if (plan) {
        applyPlan(plan);
    }
}, { immediate: true });

const returnTab = computed(() => (route.query.tab as string) || (isBoostMode.value ? 'boost_replacement' : 'access'));

const { submit, inProgress } = useSubmit(async () => {
    const payload = {
        ...form,
        amount: Number(form.amount),
        priority: Number(form.priority),
        duration_days: form.interval === 'one_time' ? Number(form.duration_days) : undefined,
    };

    if (isEditMode.value && props.plan) {
        await updatePlan(props.plan.id, {
            name: payload.name,
            description: payload.description,
            is_active: payload.is_active,
            priority: payload.priority,
        });
        return;
    }

    await createPlan(payload);
    await navigateTo(`/dashboard/admin/subscription-plans?tab=${returnTab.value}`);
});
</script>
