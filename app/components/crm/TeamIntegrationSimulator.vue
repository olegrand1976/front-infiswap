<template>
    <div class="space-y-8 p-4">
        <CommercialCareerStatusCard
            :status="careerStatus"
            :loading="careerLoading"
        />

        <section class="rounded-lg border p-4 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <h3 class="text-sm font-semibold text-primary">
                    Mes BC directs simulés
                </h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    class="rounded-md"
                    @click="addScenario"
                >
                    Ajouter un scénario
                </Button>
            </div>

            <div
                v-for="(scenario, index) in payload.scenarios"
                :key="`scenario-${index}`"
                class="grid gap-3 rounded-md border p-3 sm:grid-cols-2 lg:grid-cols-5"
            >
                <div>
                    <Label>Libellé</Label>
                    <Input
                        v-model="scenario.label"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label>Montant HTVA (€)</Label>
                    <Input
                        v-model.number="scenario.amount_htva"
                        type="number"
                        min="0"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label>Mode</Label>
                    <Select v-model="scenario.payment_mode">
                        <SelectTrigger class="mt-1 rounded-md">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Mensuel</SelectItem>
                            <SelectItem value="yearly">Annuel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Année abo.</Label>
                    <Input
                        v-model.number="scenario.subscription_year"
                        type="number"
                        min="1"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label>BC / mois</Label>
                    <Input
                        v-model.number="scenario.count_per_month"
                        type="number"
                        min="0"
                        step="0.5"
                        class="mt-1"
                    />
                </div>
            </div>
        </section>

        <section class="rounded-lg border p-4 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <h3 class="text-sm font-semibold text-primary">
                    Équipe simulée (downlines)
                </h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    class="rounded-md"
                    @click="addTeamMember"
                >
                    Ajouter un groupe
                </Button>
            </div>

            <div
                v-for="(member, index) in payload.team"
                :key="`team-${index}`"
                class="grid gap-3 rounded-md border p-3 sm:grid-cols-2 lg:grid-cols-4"
            >
                <div>
                    <Label>Profondeur</Label>
                    <Select
                        :model-value="String(member.depth)"
                        @update:model-value="member.depth = Number($event) as 1 | 2"
                    >
                        <SelectTrigger class="mt-1 rounded-md">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem :value="1">L1</SelectItem>
                            <SelectItem :value="2">L2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Membres</Label>
                    <Input
                        v-model.number="member.count"
                        type="number"
                        min="0"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label>BC / mois (moy.)</Label>
                    <Input
                        v-model.number="member.avg_bc_per_month"
                        type="number"
                        min="0"
                        step="0.5"
                        class="mt-1"
                    />
                </div>
                <div>
                    <Label>Montant moyen (€)</Label>
                    <Input
                        v-model.number="member.avg_amount"
                        type="number"
                        min="0"
                        class="mt-1"
                    />
                </div>
            </div>
        </section>

        <section
            v-if="example?.description"
            class="rounded-lg border border-dashed bg-muted/10 p-4 space-y-3"
        >
            <h3 class="text-sm font-semibold text-primary">
                Exemple pédagogique
            </h3>
            <p class="text-sm text-muted-foreground">
                {{ example.description }}
            </p>
            <Button
                type="button"
                variant="outline"
                size="sm"
                class="rounded-md"
                @click="loadExample"
            >
                Charger l'exemple
            </Button>
        </section>

        <div class="flex flex-wrap items-center gap-4">
            <Button
                type="button"
                class="rounded-md"
                :disabled="calculating"
                @click="runCalculation(false)"
            >
                Calculer la projection
            </Button>
            <div class="flex items-center gap-3">
                <Switch
                    id="compare_next_grade"
                    v-model:checked="compareNextGrade"
                />
                <Label for="compare_next_grade">Et si j'étais au grade supérieur ?</Label>
            </div>
        </div>

        <section
            v-if="result"
            class="space-y-4"
        >
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-lg border p-4">
                    <p class="text-xs text-muted-foreground">Direct mensuel</p>
                    <p class="text-xl font-semibold">{{ formatEuro(result.direct_monthly) }}</p>
                </div>
                <div class="rounded-lg border p-4">
                    <p class="text-xs text-muted-foreground">Override L1</p>
                    <p class="text-xl font-semibold">{{ formatEuro(result.override_l1_monthly) }}</p>
                </div>
                <div class="rounded-lg border p-4">
                    <p class="text-xs text-muted-foreground">Override L2</p>
                    <p class="text-xl font-semibold">{{ formatEuro(result.override_l2_monthly) }}</p>
                </div>
                <div class="rounded-lg border bg-primary/5 p-4">
                    <p class="text-xs text-muted-foreground">Total mensuel / annuel</p>
                    <p class="text-xl font-semibold">
                        {{ formatEuro(result.total_monthly) }} / {{ formatEuro(result.total_yearly) }}
                    </p>
                </div>
            </div>

            <div
                v-if="result.next_grade"
                class="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm"
            >
                <p class="font-medium">
                    Grade supérieur ({{ result.next_grade.grade.name }}) :
                    {{ formatEuro(result.next_grade.total_monthly) }}/mois
                    (+{{ formatEuro(result.next_grade.delta_monthly) }})
                </p>
            </div>

            <div
                v-if="result.breakdown?.length"
                class="overflow-x-auto rounded-lg border"
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Source</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Mensuel</TableHead>
                            <TableHead>Annuel</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="(row, index) in result.breakdown"
                            :key="`${row.source}-${index}`"
                        >
                            <TableCell>{{ row.source }}</TableCell>
                            <TableCell>{{ breakdownTypeLabel(row.type) }}</TableCell>
                            <TableCell>{{ formatEuro(row.amount_monthly) }}</TableCell>
                            <TableCell>{{ formatEuro(row.amount_yearly) }}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import CommercialCareerStatusCard from '@/components/crm/CommercialCareerStatusCard.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type {
    MyCareerStatus,
    TeamSimulatorExample,
    TeamSimulatorPayload,
    TeamSimulatorResult,
} from '@/composables/useInstitutionCrmSettings';

const {
    getMyCareerStatus,
    calculateTeamSimulator,
    getTeamSimulatorExample,
} = useInstitutionCrmSettings();
const { $toast } = useNuxtApp();

const careerStatus = ref<MyCareerStatus | null>(null);
const careerLoading = ref(true);
const calculating = ref(false);
const compareNextGrade = ref(false);
const result = ref<TeamSimulatorResult | null>(null);
const example = ref<TeamSimulatorExample | null>(null);

const payload = reactive<TeamSimulatorPayload>({
    viewer_grade_id: null,
    scenarios: [
        {
            label: 'BC direct mensuel',
            amount_htva: 150,
            payment_mode: 'monthly',
            subscription_year: 1,
            count_per_month: 2,
        },
    ],
    team: [],
});

const STORAGE_KEY = 'infiswap-team-simulator-payload';

function formatEuro(value: number) {
    return new Intl.NumberFormat('fr-BE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2,
    }).format(value ?? 0);
}

function breakdownTypeLabel(type: string) {
    switch (type) {
        case 'direct': return 'Direct';
        case 'override_l1': return 'Override L1';
        case 'override_l2': return 'Override L2';
        default: return type;
    }
}

function addScenario() {
    payload.scenarios.push({
        label: 'Nouveau scénario',
        amount_htva: 150,
        payment_mode: 'monthly',
        subscription_year: 1,
        count_per_month: 1,
    });
}

function addTeamMember() {
    payload.team.push({
        depth: 1,
        count: 1,
        avg_bc_per_month: 1,
        avg_amount: 150,
    });
}

function persistPayload() {
    if (!import.meta.client) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function restorePayload() {
    if (!import.meta.client) return;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
        const saved = JSON.parse(raw) as TeamSimulatorPayload;
        payload.scenarios = saved.scenarios ?? payload.scenarios;
        payload.team = saved.team ?? payload.team;
        payload.viewer_grade_id = saved.viewer_grade_id ?? null;
    }
    catch {
        // ignore invalid storage
    }
}

function loadExample() {
    if (!example.value?.payload) return;
    payload.scenarios = example.value.payload.scenarios.map(s => ({ ...s }));
    payload.team = example.value.payload.team.map(t => ({ ...t }));
    payload.viewer_grade_id = example.value.payload.viewer_grade_id ?? careerStatus.value?.grade?.id ?? null;
    $toast({ description: 'Exemple chargé.' });
}

async function runCalculation(fromToggle = false) {
    if (!fromToggle) {
        persistPayload();
    }

    calculating.value = true;
    try {
        result.value = await calculateTeamSimulator({
            ...payload,
            viewer_grade_id: payload.viewer_grade_id ?? careerStatus.value?.grade?.id ?? null,
            compare_next_grade: compareNextGrade.value,
        });
    }
    catch {
        $toast({ description: 'Erreur lors du calcul.', variant: 'destructive' });
    }
    finally {
        calculating.value = false;
    }
}

watch(compareNextGrade, () => {
    if (result.value) {
        runCalculation(true);
    }
});

onMounted(async () => {
    restorePayload();

    try {
        careerStatus.value = await getMyCareerStatus();
        payload.viewer_grade_id = careerStatus.value?.grade?.id ?? null;
    }
    catch {
        $toast({ description: 'Impossible de charger votre statut carrière.', variant: 'destructive' });
    }
    finally {
        careerLoading.value = false;
    }

    try {
        example.value = await getTeamSimulatorExample();
    }
    catch {
        // example optional
    }
});
</script>
