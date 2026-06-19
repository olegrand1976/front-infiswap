<template>
    <div class="lg:ml-20 xl:ml-0">
        <ArrowLeft
            class="size-6 cursor-pointer hover:text-primary mt-4"
            title="Retour"
            @click="goBack"
        />

        <div class="mt-6 bg-gray-100 flex flex-col space-y-4 sm:space-y-0 sm:flex-row py-4 sm:py-0 px-4 rounded-lg items-center sm:h-12">
            <h1 class="text-primary">
                Mon compte
            </h1>
        </div>

        <div class="mt-6 mb-12 max-w-xl">
            <p class="text-gray-600 mb-4">
                Vous pouvez supprimer définitivement votre compte utilisateur. Cette action est irréversible pour votre accès à la plateforme.
            </p>
            <DeleteAccountSection />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeft } from 'lucide-vue-next';
import { goBack } from '~/lib/utils';
import DeleteAccountSection from '@/components/account/DeleteAccountSection.vue';

useHead({
    title: 'Mon compte',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
