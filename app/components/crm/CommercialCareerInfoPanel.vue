<template>
    <div class="space-y-6">
        <section class="rounded-lg border bg-muted/20 p-4 space-y-2">
            <h3 class="text-sm font-semibold text-primary">
                {{ bcDefinition.title }}
            </h3>
            <p class="text-sm font-medium">
                {{ bcDefinition.short }}
            </p>
            <p class="text-sm text-muted-foreground">
                {{ bcDefinition.body }}
            </p>
        </section>

        <section class="rounded-lg border p-4 space-y-3">
            <h3 class="text-sm font-semibold text-primary">
                {{ careerProgressionRules.title }}
            </h3>
            <ul class="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                <li
                    v-for="(item, index) in careerProgressionRules.items"
                    :key="index"
                >
                    {{ item }}
                </li>
            </ul>
        </section>

        <CommercialCareerGradesGrid
            v-if="showGradesGrid && grades.length"
            :grades="grades"
            :loading="gradesLoading"
            :current-grade-id="currentGradeId"
            :progression="progression"
            :show-remuneration="showRemuneration"
        />
    </div>
</template>

<script setup lang="ts">
import CommercialCareerGradesGrid from '@/components/crm/CommercialCareerGradesGrid.vue';
import { bcDefinition, careerProgressionRules } from '@/lib/careerContent';
import type { CommercialCareerGrade } from '@/composables/useInstitutionCrmSettings';

defineProps<{
    grades?: CommercialCareerGrade[];
    gradesLoading?: boolean;
    currentGradeId?: number | null;
    progression?: {
        direct_bc: number;
        team_revenue?: number | null;
    } | null;
    showGradesGrid?: boolean;
    showRemuneration?: boolean;
}>();
</script>
