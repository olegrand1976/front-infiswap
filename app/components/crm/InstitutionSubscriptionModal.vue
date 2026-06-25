<template>
    <Dialog
        v-model:open="open"
        class="fixed inset-0 flex justify-center items-center bg-black/50"
    >
        <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full mx-2">
            <DialogHeader>
                <DialogTitle class="text-lg font-semibold text-primary">
                    Abonnement institution
                </DialogTitle>
            </DialogHeader>

            <p class="text-sm text-muted-foreground mb-4">
                {{ institutionName }}
            </p>

            <div class="grid gap-4 sm:grid-cols-2">
                <button
                    type="button"
                    class="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
                    :class="selectedFormula === 'institution_monthly_150' ? 'border-primary bg-primary/5 ring-2 ring-primary' : ''"
                    :disabled="loading"
                    @click="selectedFormula = 'institution_monthly_150'"
                >
                    <p class="font-semibold text-lg">
                        150 €
                    </p>
                    <p class="text-sm text-muted-foreground">
                        par mois
                    </p>
                </button>

                <button
                    type="button"
                    class="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
                    :class="selectedFormula === 'institution_yearly_1500' ? 'border-primary bg-primary/5 ring-2 ring-primary' : ''"
                    :disabled="loading"
                    @click="selectedFormula = 'institution_yearly_1500'"
                >
                    <p class="font-semibold text-lg">
                        1 500 €
                    </p>
                    <p class="text-sm text-muted-foreground">
                        par an
                    </p>
                </button>
            </div>

            <div class="flex justify-end gap-2 mt-6">
                <Button
                    variant="secondary"
                    type="button"
                    :disabled="loading"
                    @click="open = false"
                >
                    Annuler
                </Button>
                <Button
                    type="button"
                    :disabled="!selectedFormula || loading"
                    :in-progress="loading"
                    @click="confirmSubscription"
                >
                    Envoyer pour signature
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCrm } from '@/composables/useCrm';

const open = defineModel<boolean>('open', { default: false });

const props = defineProps<{
    institutionId: number | null;
    institutionName: string;
}>();

const emit = defineEmits<{
    subscribed: [];
}>();

const { createInstitutionSubscription } = useCrm();
const { $toast } = useNuxtApp();

const selectedFormula = ref<'institution_monthly_150' | 'institution_yearly_1500' | null>(null);
const loading = ref(false);

watch(open, (isOpen) => {
    if (!isOpen) {
        selectedFormula.value = null;
    }
});

async function confirmSubscription() {
    if (!props.institutionId || !selectedFormula.value) {
        return;
    }

    loading.value = true;

    try {
        const response = await createInstitutionSubscription(props.institutionId, selectedFormula.value);

        $toast({
            description: response.message ?? 'Bon de commande envoyé pour signature.',
            variant: 'success',
        });

        open.value = false;
        emit('subscribed');
    }
    catch {
        $toast({
            description: 'Impossible de créer l\'abonnement. Réessayez.',
            variant: 'destructive',
        });
    }
    finally {
        loading.value = false;
    }
}
</script>
