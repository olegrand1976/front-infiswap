<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Ma carrière commerciale" />

        <DashboardAdminPageContent>
            <div
                v-if="canAccess"
                class="mx-4 space-y-6 pb-8"
            >
                <CommercialCareerStatusCard
                    :status="careerStatus"
                    :loading="loading"
                />

                <CommercialCareerInfoPanel
                    :grades="grades"
                    :grades-loading="gradesLoading"
                    :current-grade-id="careerStatus?.grade?.id ?? null"
                    :progression="careerStatus?.progression ?? null"
                    show-grades-grid
                    show-remuneration
                />

                <div class="flex flex-wrap gap-3">
                    <Button
                        as-child
                        variant="outline"
                        class="rounded-md"
                    >
                        <NuxtLink to="/dashboard/admin/users/crm/my-collaboration">
                            Mon contrat de collaboration
                        </NuxtLink>
                    </Button>
                    <Button
                        as-child
                        variant="outline"
                        class="rounded-md"
                    >
                        <NuxtLink to="/dashboard/admin/users/crm/team-simulator">
                            Simulateur d'équipe
                        </NuxtLink>
                    </Button>
                </div>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import CommercialCareerInfoPanel from '@/components/crm/CommercialCareerInfoPanel.vue';
import CommercialCareerStatusCard from '@/components/crm/CommercialCareerStatusCard.vue';
import { Button } from '@/components/ui/button';
import type { CommercialCareerGrade, MyCareerStatus } from '@/composables/useInstitutionCrmSettings';

useHead({ title: 'Ma carrière commerciale' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { isSuperAdmin, isAdmin, isSaleRepresentative, isCommunityManager } = useAuth();
const { getMyCareerStatus, getCareerGrades } = useInstitutionCrmSettings();

const canAccess = computed(() =>
    isSuperAdmin.value || isAdmin.value || isSaleRepresentative.value || isCommunityManager.value,
);

const loading = ref(true);
const gradesLoading = ref(true);
const careerStatus = ref<MyCareerStatus | null>(null);
const grades = ref<CommercialCareerGrade[]>([]);

async function load() {
    loading.value = true;
    gradesLoading.value = true;
    try {
        const [status, gradeList] = await Promise.all([
            getMyCareerStatus(),
            getCareerGrades(),
        ]);
        careerStatus.value = status;
        grades.value = gradeList;
    }
    catch {
        careerStatus.value = null;
        grades.value = [];
    }
    finally {
        loading.value = false;
        gradesLoading.value = false;
    }
}

onMounted(() => {
    if (!canAccess.value) {
        navigateTo('/dashboard/admin/users/crm', { replace: true });
        return;
    }
    load();
});
</script>
