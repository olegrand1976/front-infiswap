<template>
    <div class="mx-4 sm:mx-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <article
            v-for="action in actions"
            :key="action.to"
            class="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm"
        >
            <div class="flex items-center gap-2.5 p-4 pb-0">
                <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
                    :class="action.colorClass"
                >
                    <component
                        :is="action.icon"
                        class="size-4"
                    />
                </span>
                <h3 class="text-xs sm:text-sm font-bold text-foreground">
                    {{ action.title }}
                </h3>
            </div>
            <div class="flex flex-col grow px-4 pb-4 pt-2 gap-3">
                <p class="grow text-xs text-muted-foreground">
                    {{ action.description }}
                </p>
                <NuxtLink
                    v-if="action.secondaryTo"
                    :to="action.secondaryTo"
                    class="block text-center text-xs underline"
                    :class="action.secondaryTextClass"
                >
                    {{ action.secondaryLabel }}
                </NuxtLink>
                <div class="space-y-1.5">
                    <NuxtLink
                        :to="action.to"
                        class="block w-full rounded-lg py-2 text-center text-sm font-semibold text-white transition"
                        :class="action.colorClass"
                    >
                        {{ action.cta }}
                    </NuxtLink>
                </div>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
import { FileCheck2, Search, UserPlus, Users } from 'lucide-vue-next';
import type { Component } from 'vue';

type QuickAction = {
    title: string;
    description: string;
    cta: string;
    to: string;
    icon: Component;
    colorClass: string;
    secondaryTo?: string;
    secondaryLabel?: string;
    secondaryTextClass?: string;
};

const actions = computed((): QuickAction[] => {
    const base: QuickAction[] = [
        {
            title: 'Rechercher',
            description: 'Compléter votre tournée avec un remplacement.',
            cta: 'Rechercher',
            to: '/dashboard/replacements',
            icon: Search,
            colorClass: 'bg-primary hover:bg-primary/90',
        },
        {
            title: 'Me faire remplacer',
            description: 'Publier une offre sur votre tournée.',
            cta: 'Demander',
            to: '/dashboard/replacements/create',
            icon: UserPlus,
            colorClass: 'bg-success hover:bg-success/90',
        },
        {
            title: 'Candidats',
            description: 'Voir les réponses positives à vos offres.',
            cta: 'Consulter',
            to: '/dashboard/replacements/responses',
            icon: Users,
            colorClass: 'bg-indigo-600 hover:bg-indigo-600/90',
        },
        {
            title: 'Mes accords',
            description: 'Remplacements où vous avez postulé.',
            cta: 'Accéder',
            to: '/dashboard/replacements/applied',
            icon: FileCheck2,
            colorClass: 'bg-orange-700 hover:bg-orange-700/90',
            secondaryTo: '/dashboard/replacements/contracts',
            secondaryLabel: 'Mes contrats (3 €)',
            secondaryTextClass: 'text-orange-700',
        },
    ];

    return base;
});
</script>
