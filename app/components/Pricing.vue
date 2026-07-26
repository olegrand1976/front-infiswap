<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="relative overflow-hidden flex-1 flex flex-col">
        <div class="absolute hidden lg:block inset-0 bg-gradient-to-b from-tertiary/30 via-white to-white pointer-events-none" />
        <div class="absolute hidden lg:block -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div class="absolute hidden lg:block top-1/2 -left-32 w-72 h-72 rounded-full bg-success/10 blur-3xl pointer-events-none" />

        <div class="relative container px-4 sm:px-6 py-14 lg:py-20 max-w-6xl mx-auto flex-1 flex flex-col">
            <div class="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {{ $t('pricing.title') }}<br>
                    <span class="text-primary">{{ $t('pricing.titleHighlight') }}</span>
                </h1>
                <p class="mt-5 text-gray-600 text-base lg:text-lg leading-relaxed">
                    {{ $t('pricing.subtitle') }}
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto items-stretch">
                <article class="relative flex flex-col rounded-xl border border-success/20 bg-white shadow-lg shadow-success/5 overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                    <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-success/80 via-success to-emerald-400" />
                    <div class="p-7 lg:p-8 flex flex-col flex-1">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-11 h-11 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
                                <Gift class="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wide text-success">
                                    {{ $t('pricing.discovery') }}
                                </p>
                                <h2 class="text-xl font-bold text-gray-900">
                                    {{ $t('pricing.free') }}
                                </h2>
                            </div>
                        </div>

                        <div class="lg:min-h-[5.25rem] mb-4">
                            <div class="flex items-end gap-1">
                                <span class="text-5xl font-bold text-gray-900 tracking-tight leading-none">0</span>
                                <span class="text-2xl font-semibold text-gray-700 mb-1">€</span>
                            </div>
                            <p class="mt-2 text-sm text-gray-500">
                                {{ $t('pricing.freeAccount') }}
                            </p>
                        </div>

                        <p class="text-gray-600 text-sm leading-relaxed mb-6 lg:min-h-[4.5rem]">
                            {{ $t('pricing.freeDesc') }}
                        </p>

                        <ul class="space-y-3 mb-8 flex-1">
                            <li
                                v-for="item in freeFeatures"
                                :key="item.label"
                                class="flex items-start gap-2.5 text-sm"
                                :class="item.available ? 'text-gray-700' : 'text-gray-400'"
                            >
                                <CircleCheck
                                    v-if="item.available"
                                    class="w-4 h-4 text-success shrink-0 mt-0.5"
                                />
                                <CircleX
                                    v-else
                                    class="w-4 h-4 text-red-500 shrink-0 mt-0.5"
                                />
                                <span>{{ item.label }}</span>
                            </li>
                        </ul>

                        <Button
                            variant="outline"
                            class="w-full font-semibold border-success/40 text-success hover:text-success/80 hover:bg-success/5 h-11"
                            :href="localePath('/register')"
                        >
                            {{ $t('pricing.createFree') }}
                        </Button>
                        <p class="text-center text-xs text-gray-400 mt-3">
                            {{ $t('pricing.alreadyRegistered') }} <NuxtLink
                                :to="localePath('/login')"
                                class="text-primary hover:underline"
                            >{{ $t('auth.signIn') }}</NuxtLink>
                        </p>
                    </div>
                </article>

                <article class="relative flex flex-col rounded-xl border border-amber-200/60 bg-white shadow-xl shadow-amber-500/10 overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                    <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500" />
                    <div class="p-7 lg:p-8 flex flex-col flex-1">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                                <Rocket class="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wide text-amber-600">
                                    {{ $t('pricing.optional') }}
                                </p>
                                <h2 class="text-xl font-bold text-gray-900">
                                    {{ $t('pricing.boost') }}
                                </h2>
                            </div>
                        </div>

                        <div class="lg:min-h-[5.25rem] mb-4">
                            <div
                                v-if="boostPlans.length > 1"
                                class="space-y-2"
                            >
                                <div
                                    v-for="plan in boostPlans"
                                    :key="plan.id"
                                    class="flex items-baseline justify-between gap-3"
                                >
                                    <span class="text-sm text-gray-600">{{ plan.duration_days }} jours</span>
                                    <span class="text-2xl font-bold text-gray-900">{{ formatAmount(plan.amount) }} €</span>
                                </div>
                            </div>
                            <template v-else>
                                <div class="flex items-end gap-1">
                                    <span class="text-5xl font-bold text-gray-900 tracking-tight leading-none">
                                        {{ formatAmount(boostPlans[0]?.amount ?? boostPlan?.amount, '2,00') }}
                                    </span>
                                    <span class="text-2xl font-semibold text-gray-700 mb-1">€</span>
                                </div>
                            </template>
                            <p class="mt-2 text-sm text-gray-500">
                                Paiement unique · 3 ou 7 jours de visibilité
                            </p>
                        </div>

                        <p class="text-gray-600 text-sm leading-relaxed mb-6 lg:min-h-[4.5rem]">
                            {{ boostDescription }}
                        </p>

                        <ul class="space-y-3 mb-8 flex-1">
                            <li
                                v-for="item in boostFeatures"
                                :key="item"
                                class="flex items-start gap-2.5 text-sm text-gray-700"
                            >
                                <Star class="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
                                <span>{{ item }}</span>
                            </li>
                        </ul>

                        <Button
                            variant="outline"
                            class="w-full font-semibold border-amber-300 text-amber-800 rounded hover:text-amber-800/60 hover:bg-amber-50 h-11"
                            @click="handleBoostCta"
                        >
                            {{ user ? 'Gérer mes remplacements' : 'Commencer gratuitement' }}
                        </Button>
                        <p class="text-center text-xs text-gray-400 mt-3">
                            Activable depuis « Mes remplacements » sur chaque annonce
                        </p>
                    </div>
                </article>
            </div>

            <div class="mt-12 lg:hidden max-w-xl mx-auto">
                <h3 class="text-center text-lg font-semibold text-gray-800 mb-4">
                    Comment ça marche ?
                </h3>
                <div class="rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm text-center">
                    <Search class="w-6 h-6 text-primary mx-auto mb-3" />
                    <p class="font-semibold text-sm text-gray-800">
                        Un parcours progressif
                    </p>
                    <p class="text-xs text-gray-500 mt-2 leading-relaxed">
                        Créez un compte gratuit pour explorer, publier et postuler.
                        Boostez une annonce dès 2 € (3 jours) si vous voulez plus de visibilité.
                    </p>
                </div>
            </div>

            <div class="mt-16 lg:mt-20 max-w-4xl mx-auto hidden lg:block">
                <h3 class="text-center text-lg font-semibold text-gray-800 mb-8">
                    Comment ça marche ?
                </h3>
                <div class="grid grid-cols-3 gap-4 text-center">
                    <div
                        v-for="tip in tips"
                        :key="tip.title"
                        class="rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm"
                    >
                        <component
                            :is="tip.icon"
                            class="w-6 h-6 text-primary mx-auto mb-3"
                        />
                        <p class="font-semibold text-sm text-gray-800">
                            {{ tip.title }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">
                            {{ tip.text }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-10 lg:mt-14 flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500 px-2">
                <span class="flex items-center gap-2">
                    <ShieldCheck class="w-4 h-4 text-success" />
                    Paiement sécurisé Stripe
                </span>
                <span class="flex items-center gap-2">
                    <HeartHandshake class="w-4 h-4 text-primary" />
                    Conçu par des professionnels de santé
                </span>
                <span class="flex items-center gap-2">
                    <Zap class="w-4 h-4 text-amber-500" />
                    Durée fixe, sans abonnement
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    CircleCheck,
    CircleX,
    Gift,
    HeartHandshake,
    Rocket,
    Search,
    ShieldCheck,
    Star,
    Zap,
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const { $apifetch } = useNuxtApp();
const user = useUser();
const localePath = useLocalePath();

type PricingPlansResponse = {
    boosts: {
        replacement: {
            label?: string;
            amount?: string | number;
            description?: string | null;
        } | null;
        replacement_plans?: Array<{
            id: number;
            label?: string;
            amount?: string | number;
            duration_days?: number;
            description?: string | null;
        }>;
    };
};

const { data: plansData } = await useAsyncData('pricing-plans', async () => {
    try {
        return await $apifetch<PricingPlansResponse>('api/subscription/plans');
    }
    catch {
        return { boosts: { replacement: null, replacement_plans: [] } } satisfies PricingPlansResponse;
    }
});

const boostPlan = computed(() => plansData.value?.boosts?.replacement ?? null);
const boostPlans = computed(() => plansData.value?.boosts?.replacement_plans ?? []);

const DEFAULT_BOOST_DESCRIPTION = 'Mettez votre annonce en tête des recherches et augmentez votre visibilité auprès des remplaçants disponibles.';

const isUsableDescription = (value?: string | null) => {
    if (!value) return false;
    const trimmed = value.trim();
    if (trimmed.length < 12) return false;
    return !/(.)\1{5,}/.test(trimmed);
};

const boostDescription = computed(() => (
    isUsableDescription(boostPlan.value?.description)
        ? boostPlan.value!.description!
        : DEFAULT_BOOST_DESCRIPTION
));

const freeFeatures = [
    { label: 'Rechercher les remplacements disponibles', available: true },
    { label: 'Consulter les annonces et missions institution', available: true },
    { label: 'Alertes et notifications personnalisées', available: true },
    { label: 'Filtres par zone, dates et type de soins', available: true },
    { label: 'Aperçu des détails avant de postuler', available: true },
    { label: 'Publier et gérer vos remplacements', available: true },
    { label: 'Postuler aux annonces qui vous intéressent', available: true },
    { label: 'Modifier ou fermer vos publications', available: true },
    { label: 'Publier un remplacement urgent', available: true },
    { label: 'Mise en avant en tête de liste', available: false },
];

const boostFeatures = [
    'Boost 2 : 7 jours à 4,40 € — recommandé',
    'Boost 1 : 3 jours à 2,00 € — option rapide',
    'Annonce en tête des résultats de recherche',
    'Activation en un clic sur vos annonces',
    'Contrat de remplacement optionnel — 3 €',
];

const tips = [
    {
        icon: Gift,
        title: 'Gratuit',
        text: 'Parfait pour surveiller le marché, publier et postuler, sans abonnement.',
    },
    {
        icon: Rocket,
        title: 'Boost dès 2 €',
        text: 'Option ponctuelle (3 ou 7 jours) pour accélérer le remplissage d\'une annonce déjà publiée.',
    },
    {
        icon: Search,
        title: 'Progressif',
        text: 'Commencez gratuitement, boostez une annonce quand vous voulez plus de visibilité.',
    },
];

const formatAmount = (amount?: string | number | null, fallback = '—') => {
    if (amount === undefined || amount === null || amount === '') return fallback;
    const num = Number(amount);
    if (Number.isNaN(num)) return String(amount);
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const handleBoostCta = () => {
    if (!user.value) {
        return navigateTo('/register');
    }
    navigateTo('/dashboard/replacements?type=me');
};
</script>
