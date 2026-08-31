<template>
    <div class="container py-10 max-w-3xl">
        <NuxtLink
            to="/replacements"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6"
        >
            <ArrowLeft class="w-4 h-4" />
            Retour aux résultats
        </NuxtLink>

        <div class="bg-surface rounded-2xl shadow-lg p-6 md:p-8">
            <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Remplacement #{{ id }}
            </p>
            <h1 class="font-secondary text-2xl font-semibold text-foreground mb-4">
                Détail du remplacement
            </h1>
            <p class="text-muted-foreground text-sm font-light">
                Cette page est un point d'entrée public — le détail réel (dates, lieu, soins, candidature) reste à brancher sur les données de l'API.
            </p>

            <div class="mt-8 pt-6 border-t border-border">
                <Button href="/register">
                    Créer un compte pour postuler
                    <ChevronRight class="w-4 h-4" />
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ChevronRight } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import { Button } from '@/components/ui/button';

definePageMeta({
    layout: 'replacements',
});

const route = useRoute();
const id = route.params.id;

useHead({
    title: `Remplacement #${id} — InfiSwap`,
});
</script>
