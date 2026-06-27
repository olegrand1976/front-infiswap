<template>
    <form
        v-if="form"
        class="space-y-8 p-4"
        @submit.prevent="emit('save')"
    >
        <div class="flex items-center justify-between">
            <p class="text-sm text-muted-foreground">
                Définissez les grilles de commission par date de début. La période applicable est celle dont la date est la plus récente antérieure à la création du BC.
            </p>
            <Button
                type="button"
                variant="outline"
                size="sm"
                class="rounded-md shrink-0"
                @click="addPeriod"
            >
                Ajouter une période
            </Button>
        </div>

        <div
            v-for="(period, periodIndex) in form.periods"
            :key="periodIndex"
            class="border rounded-lg p-4 space-y-4"
        >
            <div class="flex flex-wrap gap-4 items-end justify-between">
                <div>
                    <Label :for="`effective_from_${periodIndex}`">
                        Date de début
                    </Label>
                    <Input
                        :id="`effective_from_${periodIndex}`"
                        v-model="period.effective_from"
                        type="date"
                        class="w-44 mt-1"
                    />
                </div>
                <div>
                    <Label :for="`first_year_rate_${periodIndex}`">
                        Commission 1ère année (%)
                    </Label>
                    <Input
                        :id="`first_year_rate_${periodIndex}`"
                        v-model.number="period.first_year_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        class="w-36 mt-1"
                    />
                </div>
                <Button
                    v-if="form.periods.length > 1"
                    type="button"
                    variant="ghost"
                    size="sm"
                    @click="form.periods.splice(periodIndex, 1)"
                >
                    Supprimer la période
                </Button>
            </div>

            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <Label>Commissions années suivantes</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        class="rounded-md"
                        @click="addRenewalRow(period)"
                    >
                        Ajouter une ligne
                    </Button>
                </div>
                <div
                    v-for="(row, rowIndex) in period.renewal_rates"
                    :key="rowIndex"
                    class="flex gap-3 items-end"
                >
                    <div>
                        <Label>À partir de l'année</Label>
                        <Input
                            v-model.number="row.from_year"
                            type="number"
                            min="2"
                            class="w-32 mt-1"
                        />
                    </div>
                    <div>
                        <Label>Taux (%)</Label>
                        <Input
                            v-model.number="row.rate"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            class="w-32 mt-1"
                        />
                    </div>
                    <Button
                        v-if="period.renewal_rates.length > 1"
                        type="button"
                        variant="ghost"
                        size="sm"
                        @click="period.renewal_rates.splice(rowIndex, 1)"
                    >
                        Supprimer
                    </Button>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-4">
            <Button
                type="submit"
                class="rounded-md"
                :disabled="saving"
            >
                Enregistrer
            </Button>
            <p
                v-if="lastUpdated"
                class="text-xs text-muted-foreground"
            >
                Dernière modification : {{ lastUpdated }}
            </p>
        </div>
    </form>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CommissionRatePeriod, InstitutionCommissionSettingsPayload } from '@/composables/useInstitutionCommissionTracking';

const props = defineProps<{
    modelValue: InstitutionCommissionSettingsPayload | null;
    saving?: boolean;
}>();

const emit = defineEmits<{
    save: [];
    'update:modelValue': [value: InstitutionCommissionSettingsPayload];
}>();

const form = computed({
    get: () => props.modelValue,
    set: value => value && emit('update:modelValue', value),
});

const lastUpdated = computed(() => {
    const periods = props.modelValue?.periods ?? [];
    const latest = [...periods].sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))[0];
    if (!latest?.updated_at) return null;
    const editor = latest.updated_by?.full_name ? ` par ${latest.updated_by.full_name}` : '';
    return `${new Date(latest.updated_at).toLocaleString('fr-FR')}${editor}`;
});

function addPeriod() {
    if (!form.value) return;
    const last = form.value.periods[form.value.periods.length - 1];
    const today = new Date().toISOString().slice(0, 10);
    form.value.periods.push({
        effective_from: today,
        first_year_rate: last?.first_year_rate ?? 60,
        renewal_rates: last?.renewal_rates?.map(row => ({ ...row })) ?? [{ from_year: 2, rate: 7.5 }],
    });
}

function addRenewalRow(period: CommissionRatePeriod) {
    period.renewal_rates.push({ from_year: 2, rate: 7.5 });
}
</script>
