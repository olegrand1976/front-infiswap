<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="CONTRATS / NURSTECH"
        >
            <!-- <template #action>
                <Button
                    class="rounded"
                    href="/dashboard/admin/care-types/create"
                >
                    <PlusCircleIcon />
                    <span class="hidden md:inline-block">
                        Nouveau
                    </span>
                </Button>
            </template> -->
        </DashboardAdminPageHeader>
        <DashboardAdminPageContent>
            <InputIcon
                v-model.number="userId"
                type="number"
                placeholder="Entrez l'ID utilisateur"
                class="border p-2 rounded"
            />
            <button
                class="btn btn-primary mt-4"
                :disabled="loading || !userId"
                @click="generatePdf(userId)"
            >
                {{ loading ? 'Génération...' : 'Générez PDF' }}
            </button>
            <p
                v-if="error"
                class="text-red-500 mt-2"
            >
                {{ error }}
            </p>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useContract } from '~/composables/useContract';

useHead({ title: 'Contrats / NursTech' });
definePageMeta({ layout: 'dashboard', middleware: ['auth', 'verified'] });

const userId = ref<number | null>(null);
const { generatePdf, loading, error } = useContract();
</script>
