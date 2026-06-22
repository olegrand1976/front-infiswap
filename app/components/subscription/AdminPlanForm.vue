<template>
    <form
        class="space-y-6"
        @submit.prevent="submit"
    >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-white p-4 rounded-md">
            <InputIcon
                v-model="form.name"
                rounded="md"
                label="Nom"
                placeholder="Accès InfiSwap"
            />

            <div>
                <label class="text-sm font-medium text-gray-700">Type</label>
                <select
                    v-model="form.type"
                    class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                    :disabled="isEditMode"
                >
                    <option value="platform_access">
                        Accès plateforme
                    </option>
                    <option value="replacement_boost">
                        Mise en avant
                    </option>
                </select>
            </div>

            <div>
                <label class="text-sm font-medium text-gray-700">Intervalle</label>
                <select
                    v-model="form.interval"
                    class="mt-1 w-full rounded-md border border-gray-200 px-3 py-2"
                    :disabled="isEditMode"
                >
                    <option value="week">
                        Semaine
                    </option>
                    <option value="month">
                        Mois
                    </option>
                    <option value="year">
                        Année
                    </option>
                </select>
            </div>

            <InputIcon
                v-model="form.amount"
                rounded="md"
                label="Montant (€)"
                placeholder="15"
                :disabled="isEditMode"
            />

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
import type { StripePlan } from '~/composables/useSubscriptionPlansAdmin';

const props = defineProps({
    plan: {
        type: Object as PropType<StripePlan | null>,
        default: null,
    },
});

const { createPlan, updatePlan } = useSubscriptionPlansAdmin();
const isEditMode = computed(() => !!props.plan?.id);

const form = reactive({
    name: props.plan?.name ?? '',
    type: props.plan?.type ?? 'platform_access',
    interval: props.plan?.interval ?? 'month',
    amount: props.plan?.amount ?? 15,
    description: props.plan?.description ?? '',
    priority: props.plan?.priority ?? 10,
    valid_from: props.plan?.valid_from ? props.plan.valid_from.slice(0, 16) : '',
    valid_until: props.plan?.valid_until ? props.plan.valid_until.slice(0, 16) : '',
    is_active: props.plan?.is_active ?? true,
    deactivate_previous: true,
});

watch(() => props.plan, (plan) => {
    if (!plan) return;
    Object.assign(form, {
        name: plan.name,
        type: plan.type,
        interval: plan.interval,
        amount: plan.amount,
        description: plan.description ?? '',
        priority: plan.priority,
        valid_from: plan.valid_from ? plan.valid_from.slice(0, 16) : '',
        valid_until: plan.valid_until ? plan.valid_until.slice(0, 16) : '',
        is_active: plan.is_active,
    });
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
