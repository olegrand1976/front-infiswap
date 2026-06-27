<template>
    <div class="w-full max-w-2xl mx-auto">
        <DashboardAdminPageHeader title="Commissions BC institution" />

        <DashboardAdminPageContent>
            <form
                v-if="form"
                class="space-y-6 p-4"
                @submit.prevent="save"
            >
                <div>
                    <Label for="first_year_rate">
                        Commission immédiate — 1ère année (%)
                    </Label>
                    <Input
                        id="first_year_rate"
                        v-model.number="form.first_year_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        class="max-w-xs mt-1"
                    />
                </div>

                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <Label>Commissions années suivantes</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            class="rounded-md"
                            @click="addRenewalRow"
                        >
                            Ajouter une ligne
                        </Button>
                    </div>
                    <div
                        v-for="(row, index) in form.renewal_rates"
                        :key="index"
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
                            v-if="form.renewal_rates.length > 1"
                            type="button"
                            variant="ghost"
                            size="sm"
                            @click="form.renewal_rates.splice(index, 1)"
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>

                <Button
                    type="submit"
                    class="rounded-md"
                    :disabled="saving"
                >
                    Enregistrer
                </Button>
            </form>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InstitutionCommissionSettings } from '@/composables/useInstitutionSubscription';

useHead({ title: 'Commissions BC institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { getCommissionSettings, updateCommissionSettings } = useInstitutionSubscription();
const { $toast } = useNuxtApp();

const form = ref<InstitutionCommissionSettings | null>(null);
const saving = ref(false);

onMounted(async () => {
    form.value = await getCommissionSettings();
});

function addRenewalRow() {
    if (!form.value) return;
    form.value.renewal_rates.push({ from_year: 2, rate: 7.5 });
}

async function save() {
    if (!form.value) return;
    saving.value = true;
    try {
        await updateCommissionSettings(form.value);
        $toast({ description: 'Paramètres enregistrés.' });
    }
    catch {
        $toast({ description: 'Erreur lors de l\'enregistrement.', variant: 'destructive' });
    }
    finally {
        saving.value = false;
    }
}
</script>
