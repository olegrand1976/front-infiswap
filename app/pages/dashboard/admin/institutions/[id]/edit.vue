<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Modifier l'institution">
            <template #action>
                <Button
                    variant="outline"
                    @click="navigateTo(`/dashboard/admin/institutions/${id}/show`)"
                >
                    Annuler
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div
                v-if="loading"
                class="flex justify-center items-center py-12"
            >
                <RollingLoader :loading="loading" />
            </div>

            <form
                v-else
                class="bg-white rounded-lg shadow p-6 max-w-2xl"
                @submit.prevent="handleSubmit"
            >
                <h2 class="text-xl font-bold mb-6">
                    Modifier le nom de l'institution
                </h2>

                <div class="space-y-4">
                    <div>
                        <label
                            for="name"
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Nom de l'institution <span class="text-red-500">*</span>
                        </label>
                        <InputIcon
                            id="name"
                            v-model="formData.name"
                            :icon="BuildingOffice2Icon"
                            placeholder="Nom de l'institution"
                            required
                        />
                    </div>

                    <div class="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            :in-progress="saving"
                            :disabled="!formData.name || formData.name.trim() === ''"
                        >
                            Enregistrer
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            @click="navigateTo(`/dashboard/admin/institutions/${id}/show`)"
                        >
                            Annuler
                        </Button>
                    </div>
                </div>
            </form>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { BuildingOffice2Icon } from '@heroicons/vue/24/solid';
import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';
import RollingLoader from '~/components/RollingLoader.vue';

useHead({ title: 'Modifier l\'institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const id = computed(() => route.params.id);
const institution = ref<any>(null);
const loading = ref(true);
const saving = ref(false);
const { get, createOrUpdate } = useInstitutions();
const { $toast } = useNuxtApp();

const formData = reactive({
    name: '',
});

await get(Number(id.value)).then((response) => {
    institution.value = response.data;
    formData.name = response.data.name || '';
    loading.value = false;
});

const handleSubmit = async () => {
    if (!formData.name || formData.name.trim() === '') {
        $toast({ description: 'Le nom de l\'institution est requis', status: 'error', variant: 'destructive' });
        return;
    }

    saving.value = true;
    try {
        await createOrUpdate({
            id: Number(id.value),
            name: formData.name.trim(),
        });
        $toast({ description: 'Institution modifiée avec succès', status: 'success' });
        navigateTo(`/dashboard/admin/institutions/${id.value}/show`);
    }
    catch (error: any) {
        console.error('Erreur lors de la modification:', error);
        $toast({
            description: error?.data?.message || 'Erreur lors de la modification',
            status: 'error',
            variant: 'destructive',
        });
    }
    finally {
        saving.value = false;
    }
};
</script>
