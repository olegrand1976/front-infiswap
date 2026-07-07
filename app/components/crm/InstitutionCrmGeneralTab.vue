<template>
    <form
        v-if="form"
        class="space-y-8 p-4"
        @submit.prevent="emit('save')"
    >
        <section class="space-y-4">
            <h3 class="text-sm font-semibold text-primary">
                Engagement
            </h3>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                    <Label for="monthly_commitment_months">Engagement mensuel (mois)</Label>
                    <Input
                        id="monthly_commitment_months"
                        v-model.number="form.monthly_commitment_months"
                        type="number"
                        min="1"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label for="yearly_commitment_months">Engagement annuel (mois)</Label>
                    <Input
                        id="yearly_commitment_months"
                        v-model.number="form.yearly_commitment_months"
                        type="number"
                        min="1"
                        class="mt-1"
                    />
                </div>
                <div class="flex items-end gap-3 pb-2">
                    <Switch
                        id="price_lock_enabled"
                        v-model:checked="form.price_lock_enabled"
                    />
                    <Label for="price_lock_enabled">Verrouillage tarif à la signature</Label>
                </div>
            </div>
        </section>

        <section class="space-y-4">
            <h3 class="text-sm font-semibold text-primary">
                Indexation & relances paiement
            </h3>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                    <Label for="indexation_notice_days">Préavis indexation (jours)</Label>
                    <Input
                        id="indexation_notice_days"
                        v-model.number="form.indexation_notice_days"
                        type="number"
                        min="0"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label for="payment_reminder_interval_days">Intervalle relance (jours)</Label>
                    <Input
                        id="payment_reminder_interval_days"
                        v-model.number="form.payment_reminder_interval_days"
                        type="number"
                        min="1"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label for="payment_reminder_max_count">Nombre max de relances</Label>
                    <Input
                        id="payment_reminder_max_count"
                        v-model.number="form.payment_reminder_max_count"
                        type="number"
                        min="0"
                        class="mt-1"
                    />
                </div>
            </div>
        </section>

        <section class="space-y-4">
            <h3 class="text-sm font-semibold text-primary">
                Fourchettes tarifaires (€ HTVA)
            </h3>
            <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-lg border p-4 space-y-3">
                    <p class="text-sm font-medium">Mensuel</p>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Min</Label>
                            <Input
                                v-model.number="form.amount_ranges.monthly.min"
                                type="number"
                                min="0"
                                class="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Max</Label>
                            <Input
                                v-model.number="form.amount_ranges.monthly.max"
                                type="number"
                                min="0"
                                class="mt-1"
                            />
                        </div>
                    </div>
                </div>
                <div class="rounded-lg border p-4 space-y-3">
                    <p class="text-sm font-medium">Annuel</p>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Min</Label>
                            <Input
                                v-model.number="form.amount_ranges.yearly.min"
                                type="number"
                                min="0"
                                class="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Max</Label>
                            <Input
                                v-model.number="form.amount_ranges.yearly.max"
                                type="number"
                                min="0"
                                class="mt-1"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="space-y-4">
            <h3 class="text-sm font-semibold text-primary">
                Seuils churn
            </h3>
            <div class="grid gap-4 sm:grid-cols-3">
                <div>
                    <Label for="inactive_mission_days">Inactivité mission (jours)</Label>
                    <Input
                        id="inactive_mission_days"
                        v-model.number="form.churn.inactive_mission_days"
                        type="number"
                        min="0"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label for="tenure_months">Ancienneté (mois)</Label>
                    <Input
                        id="tenure_months"
                        v-model.number="form.churn.tenure_months"
                        type="number"
                        min="0"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label for="usage_drop_percent">Baisse usage (%)</Label>
                    <Input
                        id="usage_drop_percent"
                        v-model.number="form.churn.usage_drop_percent"
                        type="number"
                        min="0"
                        max="100"
                        class="mt-1"
                    />
                </div>
            </div>
        </section>

        <div class="flex items-center gap-4">
            <Button
                type="submit"
                class="rounded-md"
                :disabled="saving"
            >
                Enregistrer
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { InstitutionCrmGeneralSettings } from '@/composables/useInstitutionCrmSettings';

const props = defineProps<{
    modelValue: InstitutionCrmGeneralSettings | null;
    saving?: boolean;
}>();

const emit = defineEmits<{
    save: [];
    'update:modelValue': [value: InstitutionCrmGeneralSettings];
}>();

const form = computed({
    get: () => props.modelValue,
    set: value => value && emit('update:modelValue', value),
});
</script>
