<template>
    <section class="rounded-lg border p-4 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h3 class="text-sm font-semibold text-primary">
                    Veille IA
                </h3>
                <p class="text-xs text-muted-foreground mt-0.5">
                    Sources web automatiques — à vérifier avant usage commercial.
                </p>
                <p
                    v-if="insight?.generated_at"
                    class="text-xs text-muted-foreground mt-1"
                >
                    Dernière mise à jour : {{ formatToDMY(insight.generated_at) }}
                </p>
            </div>
            <Button
                variant="outline"
                size="sm"
                class="rounded-md"
                :in-progress="refreshing"
                @click="emit('refresh')"
            >
                Mettre à jour via IA
            </Button>
        </div>

        <div
            v-if="loading"
            class="flex justify-center py-8"
        >
            <RollingLoader :loading="true" />
        </div>

        <template v-else-if="insight?.status === 'completed'">
            <div
                v-if="insight.company_summary"
                class="space-y-1"
            >
                <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Informations société
                </h4>
                <p class="text-sm leading-relaxed whitespace-pre-wrap">
                    {{ insight.company_summary }}
                </p>
            </div>

            <div
                v-if="(insight.news_items ?? []).length"
                class="space-y-2"
            >
                <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Actualités & veille
                </h4>
                <ul class="space-y-2">
                    <li
                        v-for="item in insight.news_items"
                        :key="item.url"
                        class="rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        <div class="flex flex-wrap items-start justify-between gap-2">
                            <a
                                :href="item.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="font-medium text-primary underline"
                            >
                                {{ item.title }}
                            </a>
                            <span
                                v-if="item.source_name"
                                class="text-[10px] uppercase tracking-wide text-muted-foreground"
                            >
                                {{ item.source_name }}
                            </span>
                        </div>
                        <p
                            v-if="item.summary"
                            class="mt-1 text-xs text-muted-foreground leading-relaxed"
                        >
                            {{ item.summary }}
                        </p>
                    </li>
                </ul>
            </div>
            <p
                v-else
                class="text-sm text-muted-foreground"
            >
                Aucune actualité trouvée.
            </p>

            <div
                v-if="(insight.job_items ?? []).length"
                class="space-y-2"
            >
                <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Offres d'emploi
                </h4>
                <ul class="space-y-2">
                    <li
                        v-for="item in insight.job_items"
                        :key="item.url"
                        class="rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        <div class="flex flex-wrap items-start justify-between gap-2">
                            <a
                                :href="item.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="font-medium text-primary underline"
                            >
                                {{ item.title }}
                            </a>
                            <span
                                v-if="item.source_name"
                                class="text-[10px] uppercase tracking-wide text-muted-foreground"
                            >
                                {{ item.source_name }}
                            </span>
                        </div>
                        <p
                            v-if="item.summary"
                            class="mt-1 text-xs text-muted-foreground leading-relaxed"
                        >
                            {{ item.summary }}
                        </p>
                    </li>
                </ul>
            </div>
            <p
                v-else
                class="text-sm text-muted-foreground"
            >
                Aucune offre d'emploi trouvée.
            </p>
        </template>

        <p
            v-else-if="insight?.status === 'failed'"
            class="text-sm text-destructive"
        >
            {{ insight.error_message ?? 'La veille IA a échoué.' }}
        </p>

        <p
            v-else
            class="text-sm text-muted-foreground"
        >
            Aucune veille enregistrée. Cliquez sur « Mettre à jour via IA ».
        </p>
    </section>
</template>

<script setup lang="ts">
import type { InstitutionAiInsight } from '~/lib/types';
import { formatToDMY } from '@/composables/useDate';
import RollingLoader from '@/components/RollingLoader.vue';
import { Button } from '@/components/ui/button';

defineProps<{
    insight: InstitutionAiInsight | null;
    loading?: boolean;
    refreshing?: boolean;
}>();

const emit = defineEmits<{
    refresh: [];
}>();
</script>
