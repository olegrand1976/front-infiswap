<template>
    <div class="min-h-screen bg-primary">
        <div class="max-w-4xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
            <div class="mb-8 flex items-center justify-between">
                <NuxtLink
                    to="/register"
                    class="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                >
                    <ArrowLeft class="size-5 group-hover:-translate-x-1 transition-transform" />
                    <span class="font-medium">Retour à l'inscription</span>
                </NuxtLink>
                <LayoutsAppImage
                    src="logo.png"
                    class="h-10 sm:h-12 brightness-0 invert"
                />
            </div>

            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <InstitutionPricing />
            </div>

            <div class="mt-12 text-center text-white/60 text-sm">
                <p>&copy; {{ new Date().getFullYear() }} InfiSwap. Tous droits réservés.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import InstitutionPricing from '~/components/register/InstitutionPricing.vue';

definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Tarification Institutionnelle - InfiSwap',
    meta: [
        { name: 'description', content: 'Compte Institution InfiSwap : accédez au réseau n°1 du remplacement infirmier en Belgique. Missions, binômes, favoris et pilotage centralisé pour MR/MRS, hôpitaux et centres d\'intérim.' },
    ],
});
</script>

<style scoped>
/* Ensure the component looks good on white/5 background */
:deep(.InstitutionPricing) {
    background: transparent !important;
}
</style>
