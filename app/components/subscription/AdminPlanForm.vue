<template>
    <form
        class="space-y-6"
        @submit.prevent="submit"
    >
        <div
            v-if="isEditMode && plan"
            class="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 rounded-md border border-gray-100"
        >
            <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                    Montant actuel
                </p>
                <p class="font-medium mt-1">
                    {{ plan.amount }} {{ currencySymbol(plan.currency) }} — paiement unique
                </p>
                <p class="text-xs text-gray-400 mt-1">
                    Pour changer le prix, créez un nouveau plan.
                </p>
            </div>
            <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide">
                    Stripe Price ID
                </p>
                <p class="font-mono text-sm mt-1 break-all">
                    {{ plan.stripe_price_id }}
                </p>
            </div>
        </div>

        <div
            v-if="!isEditMode"
            class="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-800"
        >
            Créer un nouveau plan désactive automatiquement l'ancien prix actif.
            Les utilisateurs ayant déjà payé conservent leur accès.
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <InputIcon
                v-model="form.name"
                rounded="md"
                label="Nom"
                placeholder="Accès InfiSwap"
            />

            <template v-if="!isEditMode">
                <InputIcon
                    v-model="form.amount"
                    rounded="md"
                    :label="`Montant (${currencySymbol(form.currency)})`"
                    placeholder="15"
                />

                <div class="flex flex-col gap-2">
                    <Label class="text-sm text-gray-500">Devise</Label>
                    <Select
                        v-model="form.currency"
                        class="w-full"
                    >
                        <SelectTrigger class="w-full rounded-md w-full">
                            <SelectValue placeholder="Choisir une devise" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="eur">
                                    EUR (€)
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
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
                <span class="text-sm">Remplacer le prix actif</span>
            </div>
        </div>

        <div class="flex justify-center">
            <Button
                type="submit"
                class="rounded-md w-52"
                :in-progress="inProgress"
            >
                {{ isEditMode ? 'Enregistrer' : 'Créer le nouveau prix' }}
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
import type { AccessPlanAdmin } from '~/composables/useSubscriptionPlansAdmin';

const props = defineProps({
    plan: {
        type: Object as PropType<AccessPlanAdmin | null>,
        default: null,
    },
});

const { createPlan, updatePlan } = useSubscriptionPlansAdmin();
const isEditMode = computed(() => !!props.plan?.id);

const currencySymbol = (currency: string) => (currency === 'gbp' ? '£' : '€');

const form = reactive({
    name: '',
    amount: 15,
    currency: 'gbp',
    description: '',
    priority: 10,
    is_active: true,
    deactivate_previous: true,
});

const applyPlan = (plan: AccessPlanAdmin) => {
    Object.assign(form, {
        name: plan.name,
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

const { submit, inProgress } = useSubmit(async () => {
    const payload = {
        ...form,
        amount: Number(form.amount),
        priority: Number(form.priority),
    };

    if (isEditMode.value && props.plan) {
        await updatePlan(props.plan.id, {
            name: payload.name,
            description: payload.description,
            is_active: payload.is_active,
            priority: payload.priority,
        });
        await navigateTo('/dashboard/admin/subscription-plans', { replace: true });
        return;
    }

    await createPlan(payload);
    await navigateTo('/dashboard/admin/subscription-plans', { replace: true });
});
</script>
