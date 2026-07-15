<template>
    <div class="mx-4 sm:mx-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <article
            v-for="action in actions"
            :key="action.to"
            class="flex flex-col overflow-hidden rounded-lg border-2 bg-white"
            :class="action.borderClass"
        >
            <div
                class="px-3 py-2 text-center text-xs sm:text-sm font-bold tracking-wide text-white uppercase"
                :class="action.headerClass"
            >
                {{ action.title }}
            </div>
            <div class="flex flex-col grow p-3 sm:p-4 gap-3">
                <p class="grow text-xs sm:text-sm text-gray-600 text-center">
                    {{ action.description }}
                </p>
                <div class="space-y-1.5">
                    <NuxtLink
                        :to="action.to"
                        class="block w-full py-2 text-center text-sm font-semibold text-white rounded transition"
                        :class="action.ctaClass"
                    >
                        {{ action.cta }}
                    </NuxtLink>
                    <NuxtLink
                        v-if="action.secondaryTo"
                        :to="action.secondaryTo"
                        class="block text-center text-xs underline"
                        :class="action.secondaryClass"
                    >
                        {{ action.secondaryLabel }}
                    </NuxtLink>
                </div>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
import { hasPaidPlatformAccess, isSubjectToPlatformAccessPayment } from '~/utils/platformAccess';
import type { User } from '~/lib/types';

const user = useState<User | null>('user');

const showNetworkAccessPromo = computed(() =>
    isSubjectToPlatformAccessPayment(user.value) && !hasPaidPlatformAccess(user.value),
);

type QuickAction = {
    title: string;
    description: string;
    cta: string;
    to: string;
    borderClass: string;
    headerClass: string;
    ctaClass: string;
    secondaryTo?: string;
    secondaryLabel?: string;
    secondaryClass?: string;
};

const actions = computed((): QuickAction[] => {
    const base: QuickAction[] = [
        {
            title: 'Rechercher',
            description: 'Compléter votre tournée avec un remplacement.',
            cta: 'Rechercher',
            to: '/dashboard/replacements',
            borderClass: 'border-primary',
            headerClass: 'bg-primary',
            ctaClass: 'bg-primary hover:bg-primary/90',
        },
        {
            title: 'Me faire remplacer',
            description: 'Publier une offre sur votre tournée.',
            cta: 'Demander',
            to: '/dashboard/replacements/create',
            borderClass: 'border-success',
            headerClass: 'bg-success',
            ctaClass: 'bg-success hover:bg-success/90',
        },
        {
            title: 'Candidats',
            description: 'Voir les réponses positives à vos offres.',
            cta: 'Consulter',
            to: '/dashboard/replacements/responses',
            borderClass: 'border-indigo-600',
            headerClass: 'bg-indigo-600',
            ctaClass: 'bg-indigo-600 hover:bg-indigo-600/90',
        },
        {
            title: 'Mes accords',
            description: 'Remplacements où vous avez postulé.',
            cta: 'Accéder',
            to: '/dashboard/replacements/applied',
            borderClass: 'border-orange-700',
            headerClass: 'bg-orange-700',
            ctaClass: 'bg-orange-700 hover:bg-orange-700/90',
            secondaryTo: '/dashboard/replacements/contracts',
            secondaryLabel: 'Mes contrats (3 €)',
            secondaryClass: 'text-orange-700',
        },
    ];

    if (showNetworkAccessPromo.value) {
        base.push({
            title: 'Membre réseau',
            description: 'Publiez et répondez — accès à vie 9,90 €.',
            cta: 'Devenir membre',
            to: '/acces-plan',
            borderClass: 'border-primary',
            headerClass: 'bg-primary',
            ctaClass: 'bg-primary hover:bg-primary/90',
        });
    }

    return base;
});
</script>
