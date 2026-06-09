<template>
    <div>
        <DashboardAdminPageHeader title="Nouvelle mission" />
        <DashboardAdminPageContent class="bg-gray-50">
            <template v-if="loadingDuplicate">
                <div class="flex justify-center py-20">
                    <Loader2Icon class="w-10 h-10 animate-spin text-primary" />
                </div>
            </template>
            <MissionsAdminForm
                v-else
                :mission="duplicateMission"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { Loader2Icon } from 'lucide-vue-next';
import type { Mission } from '~/lib/types';

useHead({ title: 'Créer une mission' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'institution'],
});

const route = useRoute();
const { getById } = useMissions();
const duplicateMission = ref<Partial<Mission> | undefined>(undefined);
const loadingDuplicate = ref(false);

onMounted(async () => {
    const duplicateId = route.query.duplicate_id;
    if (duplicateId) {
        loadingDuplicate.value = true;
        try {
            const response = await getById(Number(duplicateId));
            const missionData = response?.data || response;

            if (missionData) {
                const { id, created_at, updated_at, status, responses_count, ...clonedData } = missionData;
                duplicateMission.value = {
                    ...clonedData,
                    id: undefined,
                    status: 'open',
                };
            }
        }
        catch (err) {
            console.error('Erreur lors de la duplication:', err);
        }
        finally {
            loadingDuplicate.value = false;
        }
    }
});
</script>
