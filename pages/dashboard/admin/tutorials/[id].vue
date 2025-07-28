<template>
    <div>
        <DashboardAdminPageHeader :title="`Modifier`" />

        <DashboardAdminPageContent class="bg-gray-100">
            <TutorialsAdminForm :tutorial="tutorial" />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { useTutorials } from '@/composables/useTutorials';
import type { Tutorial } from '~/lib/types';

useHead({ title: 'Modifier le tutoriel' });

const route = useRoute();
const tutorial = ref<Tutorial>(null);
const { getSpecificTutorial } = useTutorials();
const id = computed(() => route.params.id);

await getSpecificTutorial(Number(id.value)).then((response) => {
    tutorial.value = response.data;
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});
</script>
