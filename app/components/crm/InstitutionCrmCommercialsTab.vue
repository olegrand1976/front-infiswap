<template>
    <div class="space-y-6 p-4">
        <div class="flex items-center justify-between">
            <p class="text-sm text-muted-foreground">
                Commerciaux actifs et attribution de statut carrière initial ou manuel.
            </p>
            <Button
                type="button"
                variant="outline"
                size="sm"
                class="rounded-md"
                :disabled="loading"
                @click="refreshCommercials"
            >
                Actualiser
            </Button>
        </div>

        <div
            v-if="loading"
            class="py-12 text-center text-sm text-muted-foreground"
        >
            Chargement…
        </div>

        <div
            v-else-if="!commercials.length"
            class="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground"
        >
            Aucun commercial trouvé.
        </div>

        <div
            v-else
            class="overflow-x-auto rounded-lg border"
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Commercial</TableHead>
                        <TableHead>Grade actuel</TableHead>
                        <TableHead>Contrat</TableHead>
                        <TableHead>Upline</TableHead>
                        <TableHead>Attribué le</TableHead>
                        <TableHead class="w-40" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow
                        v-for="commercial in commercials"
                        :key="commercial.id"
                    >
                        <TableCell>
                            <div>
                                <p class="font-medium">{{ commercial.full_name }}</p>
                                <p class="text-xs text-muted-foreground">{{ commercial.email }}</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            {{ commercial.career_grade?.name ?? '—' }}
                        </TableCell>
                        <TableCell>
                            <span
                                class="text-xs rounded px-2 py-0.5"
                                :class="collaborationBadgeClass(commercial)"
                            >
                                {{ collaborationLabel(commercial) }}
                            </span>
                        </TableCell>
                        <TableCell>
                            {{ commercial.upline?.full_name ?? '—' }}
                        </TableCell>
                        <TableCell>
                            {{ formatDate(commercial.commercial_grade_assigned_at) }}
                        </TableCell>
                        <TableCell class="space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                class="rounded-md"
                                @click="openAssignDialog(commercial)"
                            >
                                Statut
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                class="rounded-md"
                                @click="openUplineDialog(commercial)"
                            >
                                Upline
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <Dialog v-model:open="assignDialogOpen">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assigner un statut carrière</DialogTitle>
                    <DialogDescription v-if="selectedCommercial">
                        {{ selectedCommercial.full_name }}
                    </DialogDescription>
                </DialogHeader>

                <form
                    class="space-y-4"
                    @submit.prevent="submitAssignment"
                >
                    <div>
                        <Label for="career_grade_id">Grade</Label>
                        <Select v-model="assignForm.career_grade_id">
                            <SelectTrigger
                                id="career_grade_id"
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
                        <Label for="assignment_type">Type d'assignation</Label>
                        <Select v-model="assignForm.assignment_type">
                            <SelectTrigger
                                id="assignment_type"
                                class="mt-1 rounded-md"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="initial">Statut initial</SelectItem>
                                <SelectItem value="manual">Manuel</SelectItem>
                                <SelectItem value="promotion">Promotion</SelectItem>
                                <SelectItem value="demotion">Rétrogradation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="notes">Notes (optionnel)</Label>
                        <Textarea
                            id="notes"
                            v-model="assignForm.notes"
                            rows="3"
                            class="mt-1"
                        />
                    </div>

                    <div class="flex items-center gap-3">
                        <Switch
                            id="notify"
                            v-model:checked="assignForm.notify"
                        />
                        <Label for="notify">Notifier le commercial</Label>
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

        <Dialog v-model:open="uplineDialogOpen">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assigner un upline</DialogTitle>
                    <DialogDescription v-if="selectedCommercial">
                        {{ selectedCommercial.full_name }}
                    </DialogDescription>
                </DialogHeader>

                <form
                    class="space-y-4"
                    @submit.prevent="submitUpline"
                >
                    <div>
                        <Label for="commercial_upline_id">Upline</Label>
                        <Select v-model="uplineForm.commercial_upline_id">
                            <SelectTrigger
                                id="commercial_upline_id"
                                class="mt-1 rounded-md"
                            >
                                <SelectValue placeholder="Aucun upline" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">
                                    Aucun upline
                                </SelectItem>
                                <SelectItem
                                    v-for="candidate in uplineCandidates"
                                    :key="candidate.id"
                                    :value="String(candidate.id)"
                                >
                                    {{ candidate.full_name }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            class="rounded-md"
                            @click="uplineDialogOpen = false"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            class="rounded-md"
                            :disabled="assigningUpline"
                        >
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </div>
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
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import type {
    AssignCareerGradePayload,
    CommercialCareerGrade,
    InstitutionCrmCommercial,
} from '@/composables/useInstitutionCrmSettings';

const props = defineProps<{
    grades: CommercialCareerGrade[];
}>();

const { getCommercials, assignCareerGrade, assignCommercialUpline } = useInstitutionCrmSettings();
const { $toast } = useNuxtApp();

const commercials = ref<InstitutionCrmCommercial[]>([]);
const loading = ref(true);
const assigning = ref(false);
const assigningUpline = ref(false);
const assignDialogOpen = ref(false);
const uplineDialogOpen = ref(false);
const selectedCommercial = ref<InstitutionCrmCommercial | null>(null);

const assignForm = reactive({
    career_grade_id: '',
    assignment_type: 'initial' as AssignCareerGradePayload['assignment_type'],
    notify: true,
    notes: '',
});

const uplineForm = reactive({
    commercial_upline_id: '' as string,
});

const uplineCandidates = computed(() =>
    commercials.value.filter(c => c.id !== selectedCommercial.value?.id),
);

function formatDate(value?: string | null) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('fr-FR');
}

function collaborationLabel(commercial: InstitutionCrmCommercial) {
    if (commercial.has_pending_signature) return 'Avenant pending';
    if (commercial.commercial_collaboration_status === 'active') return 'Actif';
    if (commercial.commercial_collaboration_status === 'pending_framework') return 'Cadre pending';
    return commercial.commercial_collaboration_status ?? '—';
}

function collaborationBadgeClass(commercial: InstitutionCrmCommercial) {
    if (commercial.commercial_collaboration_status === 'active' && !commercial.has_pending_signature) {
        return 'bg-emerald-100 text-emerald-800';
    }
    return 'bg-amber-100 text-amber-800';
}

async function refreshCommercials() {
    loading.value = true;
    try {
        commercials.value = await getCommercials();
    }
    catch {
        $toast({ description: 'Impossible de charger les commerciaux.', variant: 'destructive' });
    }
    finally {
        loading.value = false;
    }
}

function openAssignDialog(commercial: InstitutionCrmCommercial) {
    selectedCommercial.value = commercial;
    assignForm.career_grade_id = commercial.career_grade?.id ? String(commercial.career_grade.id) : '';
    assignForm.assignment_type = commercial.career_grade ? 'manual' : 'initial';
    assignForm.notify = true;
    assignForm.notes = '';
    assignDialogOpen.value = true;
}

async function submitAssignment() {
    if (!selectedCommercial.value || !assignForm.career_grade_id) return;

    assigning.value = true;
    try {
        await assignCareerGrade(selectedCommercial.value.id, {
            career_grade_id: Number(assignForm.career_grade_id),
            notify: assignForm.notify,
            notes: assignForm.notes || null,
            assignment_type: assignForm.assignment_type,
        });
        $toast({ description: 'Statut carrière assigné.' });
        assignDialogOpen.value = false;
        await refreshCommercials();
    }
    catch {
        $toast({ description: 'Erreur lors de l\'assignation.', variant: 'destructive' });
    }
    finally {
        assigning.value = false;
    }
}

function openUplineDialog(commercial: InstitutionCrmCommercial) {
    selectedCommercial.value = commercial;
    uplineForm.commercial_upline_id = commercial.upline?.id ? String(commercial.upline.id) : '';
    uplineDialogOpen.value = true;
}

async function submitUpline() {
    if (!selectedCommercial.value) return;

    assigningUpline.value = true;
    try {
        await assignCommercialUpline(
            selectedCommercial.value.id,
            uplineForm.commercial_upline_id ? Number(uplineForm.commercial_upline_id) : null,
        );
        $toast({ description: 'Upline mis à jour.' });
        uplineDialogOpen.value = false;
        await refreshCommercials();
    }
    catch {
        $toast({ description: 'Erreur lors de l\'assignation upline.', variant: 'destructive' });
    }
    finally {
        assigningUpline.value = false;
    }
}

onMounted(refreshCommercials);
</script>
