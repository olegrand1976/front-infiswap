<template>
    <div class="lg:ml-20 xl:ml-0">
        <DashboardAdminPageHeader title="Mon compte" />

        <DashboardAdminPageContent>
            <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:gap-8 sm:p-6">
                <div>
                    <h2 class="font-secondary text-base font-semibold text-foreground">
                        Compte
                    </h2>
                    <p class="mt-2 text-sm text-muted-foreground">
                        Vous pouvez supprimer votre compte. Cette action désactive l’accès et anonymise vos données personnelles
                        (sous réserve des obligations légales de conservation, ex. facturation).
                    </p>
                </div>

                <div class="sm:col-span-2">
                    <DeleteAccountSection />
                </div>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import DeleteAccountSection from '@/components/account/DeleteAccountSection.vue';

useHead({
    title: 'Mon compte',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
