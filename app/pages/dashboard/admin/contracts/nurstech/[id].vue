<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Modifier le bon de commande"
        />

        <DashboardAdminPageContent class="bg-gray-100">
            <NurstechContractAdminForm
                :initial-contract="contract"
                mode="edit"
            />
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useContract } from '@/composables/useContract';

useHead({ title: 'Modifier un bon de commande' });
definePageMeta({ layout: 'dashboard', middleware: ['auth', 'verified'] });

const route = useRoute();
const { getById } = useContract();
const contract = ref(null);

onMounted(async () => {
    contract.value = await getById(Number(route.params.id));
});
</script>
