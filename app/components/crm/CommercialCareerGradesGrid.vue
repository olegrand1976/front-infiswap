<template>
    <section class="space-y-3">
        <div class="flex items-center justify-between gap-3">
            <div>
                <h3 class="text-sm font-semibold text-primary">
                    Grille de progression des grades
                </h3>
                <p class="text-xs text-muted-foreground mt-0.5">
                    Promotions évaluées automatiquement le 1<sup>er</sup> de chaque mois.
                    <span class="block mt-1">
                        <strong>BC</strong> = Bon de Commande institution (contrat d'abonnement signé).
                    </span>
                </p>
            </div>
        </div>

        <div
            v-if="loading"
            class="py-6 text-center text-sm text-muted-foreground"
        >
            Chargement des grades…
        </div>

        <div
            v-else-if="!sortedGrades.length"
            class="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground"
        >
            Aucun grade configuré.
        </div>

        <div
            v-else
            class="overflow-x-auto rounded-lg border"
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead v-if="showRemuneration">
                            Multiplicateur
                        </TableHead>
                        <TableHead v-if="showRemuneration">
                            Override L1
                        </TableHead>
                        <TableHead v-if="showRemuneration">
                            Override L2
                        </TableHead>
                        <TableHead>Seuils promotion</TableHead>
                        <TableHead>Défaut</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow
                        v-for="grade in sortedGrades"
                        :key="grade.id ?? grade.slug"
                        :class="grade.id === currentGradeId ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : ''"
                    >
                        <TableCell class="font-medium">
                            {{ grade.name }}
                            <span
                                v-if="grade.id === currentGradeId"
                                class="ml-2 text-xs rounded px-1.5 py-0.5 bg-primary/10 text-primary"
                            >
                                Actuel
                            </span>
                        </TableCell>
                        <TableCell>{{ grade.level }}</TableCell>
                        <TableCell v-if="showRemuneration">
                            ×{{ grade.direct_commission_multiplier }}
                        </TableCell>
                        <TableCell v-if="showRemuneration">
                            {{ grade.upline_override_level_1_rate }}%
                        </TableCell>
                        <TableCell v-if="showRemuneration">
                            {{ grade.upline_override_level_2_rate }}%
                        </TableCell>
                        <TableCell>
                            <div class="space-y-1 text-xs">
                                <div class="flex items-center gap-2">
                                    <span
                                        v-if="grade.promotion_min_direct_bc != null && progression"
                                        class="shrink-0"
                                    >
                                        {{ thresholdIcon(progression.direct_bc, grade.promotion_min_direct_bc) }}
                                    </span>
                                    <span>
                                        {{ grade.promotion_min_direct_bc ?? '—' }} BC directs
                                    </span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span
                                        v-if="grade.promotion_min_team_revenue != null && progression"
                                        class="shrink-0"
                                    >
                                        {{ thresholdIcon(progression.team_revenue ?? 0, grade.promotion_min_team_revenue) }}
                                    </span>
                                    <span>
                                        {{ grade.promotion_min_team_revenue != null ? formatEuro(grade.promotion_min_team_revenue) : '—' }} CA équipe (12 mois)
                                    </span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span
                                v-if="grade.is_default"
                                class="text-xs text-muted-foreground"
                            >
                                Oui
                            </span>
                            <span
                                v-else
                                class="text-xs text-muted-foreground"
                            >
                                —
                            </span>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { CommercialCareerGrade } from '@/composables/useInstitutionCrmSettings';

const props = withDefaults(defineProps<{
    grades: CommercialCareerGrade[];
    loading?: boolean;
    currentGradeId?: number | null;
    progression?: {
        direct_bc: number;
        team_revenue?: number | null;
    } | null;
    showRemuneration?: boolean;
}>(), {
    showRemuneration: true,
});

const sortedGrades = computed(() =>
    [...props.grades].sort((a, b) => a.level - b.level),
);

function thresholdIcon(current: number, min: number) {
    return current >= min ? '✓' : '✗';
}

function formatEuro(value: number) {
    return new Intl.NumberFormat('fr-BE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}
</script>
