<template>
    <div class="space-y-6 p-4">
        <div class="flex items-center justify-between">
            <p class="text-sm text-muted-foreground">
                Grades de carrière MLM : multiplicateur commission directe et taux d'override upline.
            </p>
            <Button
                type="button"
                variant="outline"
                size="sm"
                class="rounded-md"
                @click="addGrade"
            >
                Ajouter un grade
            </Button>
        </div>

        <div class="overflow-x-auto rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Multiplicateur</TableHead>
                        <TableHead>Override L1 (%)</TableHead>
                        <TableHead>Override L2 (%)</TableHead>
                        <TableHead>Seuils promo</TableHead>
                        <TableHead>Défaut</TableHead>
                        <TableHead class="w-24" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow
                        v-for="(grade, index) in grades"
                        :key="grade.id ?? `new-${index}`"
                    >
                        <TableCell>
                            <Input
                                v-model="grade.name"
                                class="min-w-32"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                v-model.number="grade.level"
                                type="number"
                                min="1"
                                class="w-20"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                v-model.number="grade.direct_commission_multiplier"
                                type="number"
                                step="0.01"
                                min="0"
                                class="w-24"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                v-model.number="grade.upline_override_level_1_rate"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                class="w-24"
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                v-model.number="grade.upline_override_level_2_rate"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                class="w-24"
                            />
                        </TableCell>
                        <TableCell>
                            <div class="flex flex-col gap-1 min-w-36">
                                <Input
                                    v-model.number="grade.promotion_min_direct_bc"
                                    type="number"
                                    min="0"
                                    placeholder="BC directs"
                                    class="h-8 text-xs"
                                />
                                <Input
                                    v-model.number="grade.promotion_min_team_revenue"
                                    type="number"
                                    min="0"
                                    placeholder="CA équipe"
                                    class="h-8 text-xs"
                                />
                            </div>
                        </TableCell>
                        <TableCell>
                            <Checkbox
                                :checked="grade.is_default"
                                @update:checked="setDefault(index)"
                            />
                        </TableCell>
                        <TableCell>
                            <Button
                                v-if="grades.length > 1"
                                type="button"
                                variant="ghost"
                                size="sm"
                                @click="removeGrade(index)"
                            >
                                Supprimer
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <div class="flex items-center gap-4">
            <Button
                type="button"
                class="rounded-md"
                :disabled="saving"
                @click="emit('save')"
            >
                Enregistrer
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { CommercialCareerGrade } from '@/composables/useInstitutionCrmSettings';

const props = defineProps<{
    modelValue: CommercialCareerGrade[];
    saving?: boolean;
}>();

const emit = defineEmits<{
    save: [];
    'update:modelValue': [value: CommercialCareerGrade[]];
}>();

const grades = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
});

function slugify(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'grade';
}

function addGrade() {
    const nextLevel = (grades.value.at(-1)?.level ?? 0) + 1;
    grades.value = [
        ...grades.value,
        {
            slug: `grade-${nextLevel}`,
            name: `Grade ${nextLevel}`,
            level: nextLevel,
            direct_commission_multiplier: 1,
            upline_override_level_1_rate: 0,
            upline_override_level_2_rate: 0,
            promotion_min_direct_bc: null,
            promotion_min_team_revenue: null,
            is_default: grades.value.length === 0,
        },
    ];
}

function removeGrade(index: number) {
    const next = [...grades.value];
    next.splice(index, 1);
    grades.value = next;
}

function setDefault(index: number) {
    grades.value = grades.value.map((grade, i) => ({
        ...grade,
        is_default: i === index,
    }));
}

watch(
    () => grades.value.map(g => g.name),
    () => {
        grades.value.forEach((grade) => {
            if (!grade.id) {
                grade.slug = slugify(grade.name);
            }
        });
    },
    { deep: true },
);
</script>
