<template>
    <div class="container py-10 lg:py-16 space-y-12">
        <section class="max-w-3xl space-y-4">
            <p class="text-sm font-semibold uppercase tracking-wide text-primary">
                Rejoignez InfiSwap
            </p>
            <h1 class="text-3xl lg:text-4xl font-semibold text-primary">
                Carrière commerciale
            </h1>
            <p class="text-muted-foreground text-lg">
                Développez le réseau InfiSwap auprès des institutions de soins et progressez
                dans une structure de carrière claire, basée sur vos résultats commerciaux.
            </p>
        </section>

        <section class="grid gap-6 md:grid-cols-2">
            <article
                v-for="item in recruitmentHighlights"
                :key="item.title"
                class="rounded-lg border p-5 space-y-2"
            >
                <h2 class="font-semibold text-primary">
                    {{ item.title }}
                </h2>
                <p class="text-sm text-muted-foreground">
                    {{ item.text }}
                </p>
            </article>
        </section>

        <section class="space-y-4">
            <h2 class="text-xl font-semibold text-primary">
                Les niveaux de carrière
            </h2>
            <p class="text-sm text-muted-foreground max-w-3xl">
                Quatre grades structurés. Chaque niveau requiert un volume de
                <strong>Bons de Commande (BC)</strong> institution signés et un développement
                de votre équipe commerciale directe.
            </p>
            <div
                v-if="loadingLevels"
                class="text-sm text-muted-foreground py-8 text-center"
            >
                Chargement des grades…
            </div>
            <div
                v-else
                class="overflow-x-auto rounded-lg border"
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Grade</TableHead>
                            <TableHead>Niveau</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Seuils</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="level in displayLevels"
                            :key="level.slug"
                        >
                            <TableCell class="font-medium">
                                {{ level.name }}
                            </TableCell>
                            <TableCell>{{ level.level }}</TableCell>
                            <TableCell class="text-sm text-muted-foreground max-w-md">
                                {{ level.description }}
                            </TableCell>
                            <TableCell class="text-sm">
                                <template v-if="level.promotion_min_direct_bc">
                                    {{ level.promotion_min_direct_bc }} BC directs
                                    <span v-if="level.promotion_min_team_revenue">
                                        <br>{{ formatEuro(level.promotion_min_team_revenue) }} CA équipe (12 mois)
                                    </span>
                                </template>
                                <span
                                    v-else
                                    class="text-muted-foreground"
                                >
                                    Grade de départ
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </section>

        <section class="rounded-lg border bg-muted/20 p-6 space-y-3 max-w-3xl">
            <h2 class="text-lg font-semibold text-primary">
                {{ bcDefinition.title }}
            </h2>
            <p class="text-sm">
                {{ bcDefinition.short }} — {{ bcDefinition.body }}
            </p>
        </section>

        <section class="rounded-lg border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h2 class="font-semibold text-primary">
                    Intéressé(e) ?
                </h2>
                <p class="text-sm text-muted-foreground mt-1">
                    Contactez-nous pour en savoir plus sur le recrutement commercial InfiSwap.
                </p>
            </div>
            <Button
                as-child
                class="rounded-md shrink-0"
            >
                <NuxtLink to="/contact">
                    Nous contacter
                </NuxtLink>
            </Button>
        </section>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    bcDefinition,
    careerDescriptionBySlug,
    publicCareerLevels,
    recruitmentHighlights,
} from '@/lib/careerContent';

type PublicCareerLevel = {
    level: number;
    slug: string;
    name: string;
    description: string;
    promotion_min_direct_bc?: number | null;
    promotion_min_team_revenue?: number | null;
    is_default?: boolean;
};

definePageMeta({ layout: 'guest' });

useSeoMeta({
    title: 'Carrière commerciale — InfiSwap',
    description: 'Rejoignez le réseau commercial InfiSwap : progression structurée, autonomie et impact auprès des institutions de soins.',
    ogTitle: 'Carrière commerciale — InfiSwap',
    ogDescription: 'Découvrez les niveaux de carrière et le recrutement commercial InfiSwap.',
});

const { $apifetch } = useNuxtApp();
const loadingLevels = ref(true);
const displayLevels = ref<PublicCareerLevel[]>([]);

function mapLevelsFromApi(rows: Array<Record<string, unknown>>): PublicCareerLevel[] {
    return rows.map(row => ({
        level: Number(row.level),
        slug: String(row.slug),
        name: String(row.name),
        description: careerDescriptionBySlug[String(row.slug)] ?? '',
        promotion_min_direct_bc: row.promotion_min_direct_bc as number | null | undefined,
        promotion_min_team_revenue: row.promotion_min_team_revenue as number | null | undefined,
        is_default: Boolean(row.is_default),
    }));
}

function fallbackLevels(): PublicCareerLevel[] {
    return publicCareerLevels.map(level => ({
        ...level,
        promotion_min_direct_bc: level.minDirectBc,
        promotion_min_team_revenue: level.minTeamRevenue,
    }));
}

async function loadLevels() {
    loadingLevels.value = true;
    try {
        const response = await $apifetch<{ data: Array<Record<string, unknown>> }>('/api/public/career-recruitment');
        displayLevels.value = mapLevelsFromApi(response.data ?? []);
    }
    catch {
        displayLevels.value = fallbackLevels();
    }
    finally {
        loadingLevels.value = false;
    }
}

function formatEuro(value: number) {
    return new Intl.NumberFormat('fr-BE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(value);
}

onMounted(loadLevels);
</script>
