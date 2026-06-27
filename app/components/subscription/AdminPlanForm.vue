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
                    {{ intervalLabel(plan.interval) }}
                </p>
            </div>
            <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                    Montant
                </p>
                <p class="font-medium mt-1">
                    {{ plan.amount }} € / {{ intervalLabel(plan.interval).toLowerCase() }}
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
                placeholder="Accès InfiSwap"
            />

            <template v-if="!isEditMode">
                <div class="flex flex-col gap-2">
                    <Label class="text-sm text-gray-500">Type</Label>
                    <Select v-model="form.type">
                        <SelectTrigger class="w-full rounded-md">
                            <SelectValue placeholder="Choisir un type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem
                                    v-for="option in typeOptions"
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.label }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div class="flex flex-col gap-2">
                    <Label class="text-sm text-gray-500">Intervalle</Label>
                    <Select v-model="form.interval">
                        <SelectTrigger class="w-full rounded-md">
                            <SelectValue placeholder="Choisir un intervalle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem
                                    v-for="option in intervalOptions"
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
                    placeholder="15"
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

            <InputIcon
                v-model="form.valid_from"
                rounded="md"
                label="Valide à partir du"
                type="datetime-local"
            />

            <InputIcon
                v-model="form.valid_until"
                rounded="md"
                label="Valide jusqu'au"
                type="datetime-local"
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
import type { StripePlan } from '~/composables/useSubscriptionPlansAdmin';

const props = defineProps({
    plan: {
        type: Object as PropType<StripePlan | null>,
        default: null,
    },
});

const { createPlan, updatePlan } = useSubscriptionPlansAdmin();
const isEditMode = computed(() => !!props.plan?.id);

const typeOptions = [
    { value: 'platform_access', label: 'Accès plateforme' },
    { value: 'replacement_boost', label: 'Mise en avant' },
] as const;

const intervalOptions = [
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'year', label: 'Année' },
] as const;

const typeLabel = (value: string) =>
    typeOptions.find(o => o.value === value)?.label ?? value;

const intervalLabel = (value: string) =>
    intervalOptions.find(o => o.value === value)?.label ?? value;

const toDatetimeLocal = (value: string | null | undefined): string => {
    if (!value) return '';
    const normalized = value.replace(' ', 'T');
    return normalized.slice(0, 16);
};

const form = reactive({
    name: '',
    type: 'platform_access' as StripePlan['type'],
    interval: 'month' as StripePlan['interval'],
    amount: 15,
    description: '',
    priority: 10,
    valid_from: '',
    valid_until: '',
    is_active: true,
    deactivate_previous: true,
});

const applyPlan = (plan: StripePlan) => {
    Object.assign(form, {
        name: plan.name,
        type: plan.type,
        interval: plan.interval,
        amount: plan.amount,
        description: plan.description ?? '',
        priority: plan.priority,
        valid_from: toDatetimeLocal(plan.valid_from),
        valid_until: toDatetimeLocal(plan.valid_until),
        is_active: plan.is_active,
    });
};

watch(() => props.plan, (plan) => {
    if (plan) {
        applyPlan(plan);
    }
}, { immediate: true });

const { submit, inProgress } = useSubmit(async () => {
    const payload = {
        ...form,
        amount: Number(form.amount),
        priority: Number(form.priority),
        valid_from: form.valid_from || null,
        valid_until: form.valid_until || null,
    };

    if (isEditMode.value && props.plan) {
        await updatePlan(props.plan.id, {
            name: payload.name,
            description: payload.description,
            is_active: payload.is_active,
            valid_from: payload.valid_from,
            valid_until: payload.valid_until,
            priority: payload.priority,
        });
        return;
    }

    await createPlan(payload);
    await navigateTo('/dashboard/admin/subscription-plans');
});
</script>
