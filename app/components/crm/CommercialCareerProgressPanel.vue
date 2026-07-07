<template>
    <section class="rounded-lg border bg-muted/20 p-4 space-y-6">
        <div class="flex items-center justify-between gap-3">
            <h3 class="text-sm font-semibold text-primary">
                Carrière — {{ commercialName }}
            </h3>
            <Button
                type="button"
                variant="outline"
                size="sm"
                class="rounded-md"
                :disabled="loading"
                @click="refresh"
            >
                Actualiser
            </Button>
        </div>

        <div
            v-if="loading"
            class="py-8 text-center text-sm text-muted-foreground"
        >
            Chargement de la carrière…
        </div>

        <div
            v-else-if="errorMessage"
            class="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
            {{ errorMessage }}
        </div>

        <template v-else-if="status">
            <!-- Statut actuel -->
            <dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                <div>
                    <dt class="text-muted-foreground">Grade actuel</dt>
                    <dd class="font-medium mt-1">{{ status.grade?.name ?? 'Non défini' }}</dd>
                </div>
                <div>
                    <dt class="text-muted-foreground">Multiplicateur direct</dt>
                    <dd class="font-medium mt-1">×{{ status.grade?.direct_commission_multiplier ?? 1 }}</dd>
                </div>
                <div>
                    <dt class="text-muted-foreground">Override L1 / L2</dt>
                    <dd class="font-medium mt-1">
                        {{ status.grade?.upline_override_level_1_rate ?? 0 }}% /
                        {{ status.grade?.upline_override_level_2_rate ?? 0 }}%
                    </dd>
                </div>
                <div>
                    <dt class="text-muted-foreground">Upline</dt>
                    <dd class="font-medium mt-1">{{ status.upline?.full_name ?? '—' }}</dd>
                </div>
            </dl>

            <!-- Grade initial -->
            <div class="flex flex-wrap items-center gap-3">
                <template v-if="needsInitialGrade">
                    <p class="text-sm text-muted-foreground">
                        Aucun grade de démarrage défini pour ce commercial.
                    </p>
                    <Button
                        type="button"
                        size="sm"
                        class="rounded-md"
                        @click="assignDialogOpen = true"
                    >
                        Définir le grade de démarrage
                    </Button>
                </template>
                <template v-else-if="initialHistoryEntry">
                    <span class="text-xs rounded px-2 py-1 bg-muted text-muted-foreground">
                        Grade initial : {{ initialHistoryEntry.grade?.name ?? '—' }}
                        le {{ formatDate(initialHistoryEntry.effective_at ?? initialHistoryEntry.created_at) }}
                    </span>
                </template>
            </div>

            <!-- Éligibilité promotion -->
            <div
                v-if="status.next_grade"
                class="rounded-md border px-4 py-3 space-y-3"
            >
                <div class="flex flex-wrap items-center gap-2">
                    <span class="text-sm font-medium">Progression vers {{ status.next_grade.name }}</span>
                    <span
                        v-if="status.eligible_for_promotion"
                        class="text-xs rounded px-2 py-0.5 bg-emerald-100 text-emerald-800"
                    >
                        Éligible à la promotion
                    </span>
                </div>

                <div
                    v-if="status.progression?.min_direct_bc != null"
                    class="space-y-1"
                >
                    <div class="flex justify-between text-xs text-muted-foreground">
                        <span>BC directs</span>
                        <span>{{ status.progression.direct_bc ?? 0 }} / {{ status.progression.min_direct_bc }}</span>
                    </div>
                    <div class="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            class="h-full bg-primary rounded-full transition-all"
                            :style="{ width: `${progressPercent(status.progression.direct_bc, status.progression.min_direct_bc)}%` }"
                        />
                    </div>
                </div>

                <div
                    v-if="status.progression?.min_team_revenue != null"
                    class="space-y-1"
                >
                    <div class="flex justify-between text-xs text-muted-foreground">
                        <span>CA équipe (12 mois)</span>
                        <span>
                            {{ formatEuro(status.progression.team_revenue ?? 0) }}
                            / {{ formatEuro(status.progression.min_team_revenue) }}
                        </span>
                    </div>
                    <div class="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            class="h-full bg-indigo-600 rounded-full transition-all"
                            :style="{ width: `${progressPercent(status.progression.team_revenue, status.progression.min_team_revenue)}%` }"
                        />
                    </div>
                </div>

                <p
                    v-if="!status.eligible_for_promotion"
                    class="text-xs text-muted-foreground"
                >
                    Les deux seuils doivent être atteints pour une promotion automatique.
                </p>
            </div>

            <!-- Graphique -->
            <div
                v-if="series?.months.length"
                class="space-y-4"
            >
                <h4 class="text-sm font-medium text-muted-foreground">
                    Évolution sur 12 mois
                </h4>
                <ClientOnly>
                    <div class="space-y-6">
                        <div>
                            <p class="text-xs text-muted-foreground mb-2">
                                BC directs signés par mois (total actuel : {{ series.totals.direct_bc }})
                            </p>
                            <LineChart
                                :data="bcChartData"
                                index="label"
                                :categories="['direct_bc']"
                                :colors="['var(--primary)']"
                                :legend-labels="{ direct_bc: 'BC / mois' }"
                                :y-formatter="yFormatter"
                                class="w-full"
                            />
                        </div>
                        <div>
                            <p class="text-xs text-muted-foreground mb-2">
                                CA équipe par mois (12 mois glissants : {{ formatEuro(series.totals.team_revenue) }})
                            </p>
                            <LineChart
                                :data="revenueChartData"
                                index="label"
                                :categories="['team_revenue']"
                                :colors="['var(--chart-3, #8b5cf6)']"
                                :legend-labels="{ team_revenue: 'CA équipe (€)' }"
                                :y-formatter="yFormatter"
                                class="w-full"
                            />
                        </div>
                    </div>
                </ClientOnly>
                <p
                    v-if="series.next_grade?.min_direct_bc"
                    class="text-xs text-muted-foreground"
                >
                    Seuils grade suivant ({{ series.next_grade.name }}) :
                    {{ series.next_grade.min_direct_bc }} BC directs cumulés
                    <span v-if="series.next_grade.min_team_revenue">
                        — {{ formatEuro(series.next_grade.min_team_revenue) }} CA équipe (12 mois)
                    </span>
                </p>
            </div>

            <!-- Historique -->
            <div class="space-y-3">
                <h4 class="text-sm font-medium text-muted-foreground">
                    Historique des changements
                </h4>
                <div
                    v-if="!history.length"
                    class="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg"
                >
                    Aucun historique de carrière.
                </div>
                <ol
                    v-else
                    class="relative border-l border-muted pl-4 space-y-4"
                >
                    <li
                        v-for="entry in history"
                        :key="entry.id"
                        class="relative"
                    >
                        <span class="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />
                        <div class="text-sm">
                            <span class="font-medium">{{ entry.grade?.name ?? '—' }}</span>
                            <span class="text-muted-foreground"> — {{ assignmentTypeLabel(entry.assignment_type) }}</span>
                        </div>
                        <div class="text-xs text-muted-foreground mt-0.5 space-x-2">
                            <span>{{ formatDate(entry.effective_at ?? entry.created_at) }}</span>
                            <span v-if="entry.status">· {{ statusLabel(entry.status) }}</span>
                            <span v-if="entry.assigned_by">· par {{ entry.assigned_by.full_name }}</span>
                        </div>
                        <p
                            v-if="entry.notes"
                            class="text-xs text-muted-foreground mt-1"
                        >
                            {{ entry.notes }}
                        </p>
                    </li>
                </ol>
            </div>
        </template>

        <Dialog v-model:open="assignDialogOpen">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Grade de démarrage</DialogTitle>
                    <DialogDescription>
                        {{ commercialName }}
                    </DialogDescription>
                </DialogHeader>

                <form
                    class="space-y-4"
                    @submit.prevent="submitInitialGrade"
                >
                    <div>
                        <Label for="initial_career_grade_id">Grade initial</Label>
                        <Select v-model="assignForm.career_grade_id">
                            <SelectTrigger
                                id="initial_career_grade_id"
                                class="mt-1 rounded-md"
                            >
                                <SelectValue placeholder="Choisir un grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="grade in grades"
                                    :key="grade.id ?? grade.slug"
                                    :value="String(grade.id ?? '')"
                                    :disabled="!grade.id"
                                >
                                    {{ grade.name }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="initial_notes">Notes (optionnel)</Label>
                        <Textarea
                            id="initial_notes"
                            v-model="assignForm.notes"
                            rows="2"
                            class="mt-1"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            class="rounded-md"
                            @click="assignDialogOpen = false"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            class="rounded-md"
                            :disabled="assigning || !assignForm.career_grade_id"
                        >
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LineChart } from '@/components/ui/chart-line';
import type {
    CareerHistoryEntry,
    CareerProgressionSeries,
    CommercialCareerGrade,
    MyCareerStatus,
} from '@/composables/useInstitutionCrmSettings';

const props = defineProps<{
    userId: number;
    commercialName: string;
    grades: CommercialCareerGrade[];
    allowInitialAssignment?: boolean;
}>();

const emit = defineEmits<{
    updated: [];
}>();

const {
    getCommercialCareerStatus,
    getCommercialCareerHistory,
    getCommercialCareerProgressionSeries,
    assignCareerGrade,
} = useInstitutionCrmSettings();
const { $toast } = useNuxtApp();

const loading = ref(true);
const assigning = ref(false);
const errorMessage = ref('');
const status = ref<MyCareerStatus | null>(null);
const history = ref<CareerHistoryEntry[]>([]);
const series = ref<CareerProgressionSeries | null>(null);
const assignDialogOpen = ref(false);

const assignForm = reactive({
    career_grade_id: '',
    notes: '',
});

const needsInitialGrade = computed(() =>
    props.allowInitialAssignment
    && (!status.value?.grade || !status.value?.has_initial_assignment),
);

const initialHistoryEntry = computed(() =>
    history.value.find(entry => entry.assignment_type === 'initial') ?? null,
);

const bcChartData = computed(() =>
    (series.value?.months ?? []).map(row => ({
        label: formatMonthLabel(row.month),
        direct_bc: row.direct_bc,
    })),
);

const revenueChartData = computed(() =>
    (series.value?.months ?? []).map(row => ({
        label: formatMonthLabel(row.month),
        team_revenue: Math.round(row.team_revenue),
    })),
);

function formatDate(value?: string | null) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('fr-FR');
}

function formatMonthLabel(month: string) {
    const [year, m] = month.split('-');
    const date = new Date(Number(year), Number(m) - 1, 1);
    return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
}

function formatEuro(value: number) {
    return new Intl.NumberFormat('fr-BE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function progressPercent(current?: number | null, min?: number | null) {
    if (!min || min <= 0) return 0;
    return Math.min(100, Math.round(((current ?? 0) / min) * 100));
}

function assignmentTypeLabel(type: CareerHistoryEntry['assignment_type']) {
    switch (type) {
        case 'initial':
            return 'Statut initial';
        case 'promotion':
            return 'Promotion';
        case 'demotion':
            return 'Rétrogradation';
        case 'manual':
            return 'Manuel';
        default: {
            const _exhaustive: never = type;
            return _exhaustive;
        }
    }
}

function statusLabel(statusValue: string) {
    switch (statusValue) {
        case 'active':
            return 'Actif';
        case 'pending_signature':
            return 'En attente de signature';
        case 'superseded':
            return 'Remplacé';
        default:
            return statusValue;
    }
}

function yFormatter(tick: number | Date) {
    if (typeof tick === 'number') {
        return `${Math.round(tick)}`;
    }
    return String(tick);
}

async function refresh() {
    loading.value = true;
    errorMessage.value = '';
    try {
        const [statusData, historyData, seriesData] = await Promise.all([
            getCommercialCareerStatus(props.userId),
            getCommercialCareerHistory(props.userId),
            getCommercialCareerProgressionSeries(props.userId, 12),
        ]);
        status.value = statusData;
        history.value = historyData.entries;
        series.value = seriesData;
    }
    catch {
        status.value = null;
        history.value = [];
        series.value = null;
        errorMessage.value = 'Impossible de charger la carrière de ce commercial.';
    }
    finally {
        loading.value = false;
    }
}

async function submitInitialGrade() {
    if (!assignForm.career_grade_id) return;

    assigning.value = true;
    try {
        await assignCareerGrade(props.userId, {
            career_grade_id: Number(assignForm.career_grade_id),
            assignment_type: 'initial',
            notify: true,
            notes: assignForm.notes || null,
        });
        $toast({ description: 'Grade de démarrage enregistré.' });
        assignDialogOpen.value = false;
        assignForm.career_grade_id = '';
        assignForm.notes = '';
        await refresh();
        emit('updated');
    }
    catch {
        $toast({ description: 'Erreur lors de l\'assignation.', variant: 'destructive' });
    }
    finally {
        assigning.value = false;
    }
}

watch(() => props.userId, () => {
    refresh();
}, { immediate: true });
</script>
