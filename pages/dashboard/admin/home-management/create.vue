<template>
    <div>
        <DashboardAdminPageHeader title="Nouvel texte d’accueil" />
        <DashboardAdminPageContent class="bg-gray-100">
            <HomeAdminModalForm @submit="handleSubmit" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Nouvel texte d’accueil' });

const { createOrUpdate } = useHome();
const { $toast } = useNuxtApp();

const handleSubmit = async (formData: { home: HomeType, image?: File }) => {
    try {
        await createOrUpdate(formData.home, formData.image);
        $toast({
            title: 'Succès !',
            description: 'Contenu enregistré avec succés',
        });
    }
    catch (err) {
        if (err.data && err.data.errors) {
            const backendErrors = err.data.errors;
            const firstField = Object.keys(backendErrors)[0];
            const firstMessage = backendErrors[firstField][0];

            $toast({
                description: firstMessage,
                status: 'error',
                variant: 'destructive',
            });
        }
    }
};

definePageMeta({
    layout: 'dashboard',
});
</script>
