<template>
    <div>
        <DashboardAdminPageHeader title="Mis à jour d'un remplacement" />
        <DashboardAdminPageContent class="bg-gray-100">
            <ReplacementsAdminForm :replacement="replacement" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { Replacement } from '~/lib/types';

useHead({ title: 'Mise à jour remplacement' });

definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();
const replacement = ref<Replacement>(null);
const { showReplacement } = useReplacements();
const id = computed(() => route.params.id);

await showReplacement(Number(id.value)).then((response) => {
    replacement.value = response.replacement;
});
</script>
