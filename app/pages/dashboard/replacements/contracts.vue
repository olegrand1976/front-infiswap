<template>
    <div class="lg:ml-20 xl:ml-0 space-y-6">
        <div class="mt-6 flex items-center gap-2">
            <ArrowLeft
                class="size-5 cursor-pointer hover:text-primary"
                :title="$t('common.back')"
                @click="goBack"
            />
            <h1 class="text-primary font-bold">
                {{ $t('replacements.contractsHeading') }}
            </h1>
        </div>

        <p class="text-sm text-muted-foreground">
            {{ $t('replacements.contractsHint') }}
        </p>

        <div
            v-if="loading"
            class="text-sm text-muted-foreground"
        >
            Chargement…
        </div>

        <div
            v-else-if="contracts.length === 0"
            class="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm"
        >
            Aucun contrat pour le moment.
        </div>

        <div
            v-else
            class="space-y-3"
        >
            <article
                v-for="contract in contracts"
                :key="contract.id"
                class="rounded-lg border bg-card p-4 shadow-sm"
            >
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p class="font-semibold text-foreground">
                            {{ contract.remplacant_name ?? 'Remplaçant' }}
                        </p>
                        <p class="text-sm text-muted-foreground">
                            {{ contract.replacement_period || 'Période non renseignée' }}
                        </p>
                        <p class="text-xs text-muted-foreground mt-1">
                            {{ contract.signature_mode === 'electronic' ? 'Signature électronique' : 'PDF à imprimer' }}
                            ·
                            {{ contract.includes_patient_access ? 'Accès patientèle inclus' : 'Sans délégation patientèle' }}
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <Button
                            v-if="contract.pdf_url"
                            variant="outline"
                            size="sm"
                            as="a"
                            :href="contract.pdf_url"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Télécharger PDF
                        </Button>
                        <NuxtLink :to="`/dashboard/replacements/detail/${contract.replacement_id}`">
                            <Button
                                variant="secondary"
                                size="sm"
                            >
                                Voir remplacement
                            </Button>
                        </NuxtLink>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { goBack } from '~/lib/utils';
import type { ReplacementContractItem } from '~/composables/useReplacementContract';

const { t } = useI18n();

const { fetchContracts } = useReplacementContract();

const loading = ref(true);
const contracts = ref<ReplacementContractItem[]>([]);

onMounted(async () => {
    try {
        contracts.value = await fetchContracts();
    }
    finally {
        loading.value = false;
    }
});

useHead({ title: () => t('replacements.contractsTitle') });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
