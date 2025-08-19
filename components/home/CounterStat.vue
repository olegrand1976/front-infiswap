<template>
    <div class="my-12 sm:my-24 grid sm:grid-cols-2 gap-16 sm:gap-32 items-center">
        <div class="bg-gray-100 text-center rounded-b-lg">
            <h3 class="text-base font-bold text-white py-4 bg-primary rounded-t-lg px-3">
                Nombre d'inscrits cette semaine
            </h3>
            <p class="py-8 text-3xl text-primary font-bold">
                {{ counts.registration }}
            </p>
        </div>
        <div class="bg-gray-100 text-center rounded-b-lg">
            <h3 class="text-base font-bold text-white py-4 bg-primary rounded-t-lg px-3">
                Nombre d'annonces passées cette semaine
            </h3>
            <p class="py-8 text-3xl text-primary font-bold">
                {{ counts.announce }}
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useHome } from '@/composables/useHome';

const counts = await useHome().count();
</script>
