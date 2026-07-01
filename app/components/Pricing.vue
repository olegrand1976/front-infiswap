<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="relative overflow-hidden flex-1 flex flex-col">
        <div class="absolute hidden lg:block inset-0 bg-gradient-to-b from-tertiary/30 via-white to-white pointer-events-none" />
        <div class="absolute hidden lg:block -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div class="absolute hidden lg:block top-1/2 -left-32 w-72 h-72 rounded-full bg-success/10 blur-3xl pointer-events-none" />

        <div class="relative container px-4 sm:px-6 py-14 lg:py-20 max-w-6xl mx-auto flex-1 flex flex-col">
            <div class="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Des tarifs clairs,<br>
                    <span class="text-primary">pensés pour votre pratique</span>
                </h1>
                <p class="mt-5 text-gray-600 text-base lg:text-lg leading-relaxed">
                    Explorez les opportunités gratuitement. Débloquez la publication et les candidatures avec l'accès
                    plateforme. Boostez une annonce ponctuellement pour gagner en visibilité.
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
                <article class="relative flex flex-col rounded-xl border border-success/20 bg-white shadow-lg shadow-success/5 overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                    <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-success/80 via-success to-emerald-400" />
                    <div class="p-7 lg:p-8 flex flex-col flex-1">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-11 h-11 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
                                <Gift class="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wide text-success">
                                    Découverte
                                </p>
                                <h2 class="text-xl font-bold text-gray-900">
                                    Gratuit
                                </h2>
                            </div>
                        </div>

                        <div class="lg:min-h-[5.25rem] mb-4">
                            <div class="flex items-end gap-1">
                                <span class="text-5xl font-bold text-gray-900 tracking-tight leading-none">0</span>
                                <span class="text-2xl font-semibold text-gray-700 mb-1">€</span>
                            </div>
                            <p class="mt-2 text-sm text-gray-500">
                                Compte gratuit · sans carte bancaire
                            </p>
                        </div>

                        <p class="text-gray-600 text-sm leading-relaxed mb-6 lg:min-h-[4.5rem]">
                            Idéal pour explorer InfiSwap et rester informé des remplacements près de chez vous,
                            sans engagement.
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
                            href="/register"
                        >
                            Créer un compte gratuit
                        </Button>
                        <p class="text-center text-xs text-gray-400 mt-3">
                            Déjà inscrit ? <NuxtLink
                                to="/login"
                                class="text-primary hover:underline"
                            >Se connecter</NuxtLink>
                        </p>
                    </div>
                </article>

                <article class="relative flex flex-col rounded-xl border border-primary/15 bg-white shadow-xl shadow-primary/5 overflow-hidden transition-transform duration-300 hover:-translate-y-1 lg:scale-[1.02] lg:z-10">
                    <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-success" />
                    <span class="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wide">
                        Populaire
                    </span>
                    <div class="p-7 lg:p-8 flex flex-col flex-1">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                <KeyRound class="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wide text-primary">
                                    Essentiel
                                </p>
                                <h2 class="text-xl font-bold text-gray-900">
                                    Accès InfiSwap
                                </h2>
                            </div>
                        </div>

                        <div class="lg:min-h-[5.25rem] mb-4">
                            <div class="flex items-end gap-1">
                                <span class="text-5xl font-bold text-gray-900 tracking-tight leading-none">
                                    {{ formatAmount(accessPlan?.amount, '9,90') }}
                                </span>
                                <span class="text-2xl font-semibold text-gray-700 mb-1">€</span>
                            </div>
                            <p class="mt-2 text-sm text-gray-500">
                                Paiement unique · accès permanent
                            </p>
                        </div>

                        <p class="text-gray-600 text-sm leading-relaxed mb-6 lg:min-h-[4.5rem]">
                            {{ accessDescription }}
                        </p>

                        <ul class="space-y-3 mb-8 flex-1">
                            <li
                                v-for="item in accessFeatures"
                                :key="item"
                                class="flex items-start gap-2.5 text-sm text-gray-700"
                            >
                                <CircleCheck class="w-4 h-4 text-success shrink-0 mt-0.5" />
                                <span>{{ item }}</span>
                            </li>
                        </ul>

                        <Button
                            class="w-full font-semibold bg-primary rounded hover:bg-primary/90 h-11"
                            :in-progress="purchasing"
                            @click="handleAccessCta"
                        >
                            {{ user ? 'Obtenir mon accès' : 'Créer un compte et accéder' }}
                        </Button>
                        <p class="text-center text-xs text-gray-400 mt-3">
                            Paiement sécurisé · Activation immédiate
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
                                    Optionnel
                                </p>
                                <h2 class="text-xl font-bold text-gray-900">
                                    Boost remplacement
                                </h2>
                            </div>
                        </div>

                        <div class="lg:min-h-[5.25rem] mb-4">
                            <div class="flex items-end gap-1">
                                <span class="text-5xl font-bold text-gray-900 tracking-tight leading-none">
                                    {{ formatAmount(boostPlan?.amount, '5,00') }}
                                </span>
                                <span class="text-2xl font-semibold text-gray-700 mb-1">€</span>
                            </div>
                            <p class="mt-2 text-sm text-gray-500">
                                Par semaine · sans engagement
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
                        Créez un compte gratuit pour explorer les remplacements, activez l'accès à 9,90 €
                        pour publier ou postuler, puis boostez une annonce à 5 €/semaine si besoin.
                    </p>
                </div>
            </div>

            <div class="mt-16 lg:mt-20 max-w-4xl mx-auto hidden lg:block">
                <h3 class="text-center text-lg font-semibold text-gray-800 mb-8">
                    Comment ça marche ?
                </h3>
                <div class="grid grid-cols-4 gap-4 text-center">
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
                    Boost annulable à tout moment
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
    KeyRound,
    Rocket,
    Search,
    ShieldCheck,
    Star,
    Zap,
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useSubscription } from '~/composables/useSubscription';

const { $apifetch } = useNuxtApp();
const user = useUser();
const { purchaseAccess } = useSubscription();

const purchasing = ref(false);

type PricingPlansResponse = {
    access: {
        name?: string;
        amount?: string | number;
        currency?: string;
        description?: string | null;
        stripe_price_id?: string;
    } | null;
    boosts: {
        replacement: {
            label?: string;
            amount?: string | number;
            description?: string | null;
        } | null;
    };
};

const { data: plansData } = await useAsyncData('pricing-plans', async () => {
    try {
        return await $apifetch<PricingPlansResponse>('api/subscription/plans');
    }
    catch {
        return { access: null, boosts: { replacement: null } } satisfies PricingPlansResponse;
    }
});

const accessPlan = computed(() => plansData.value?.access ?? null);
const boostPlan = computed(() => plansData.value?.boosts?.replacement ?? null);

const DEFAULT_ACCESS_DESCRIPTION = 'Passez à l\'action : publiez vos besoins et candidatez aux remplacements qui vous correspondent.';
const DEFAULT_BOOST_DESCRIPTION = 'Mettez votre annonce en tête des recherches et augmentez votre visibilité auprès des remplaçants disponibles.';

const isUsableDescription = (value?: string | null) => {
    if (!value) return false;
    const trimmed = value.trim();
    if (trimmed.length < 12) return false;
    return !/(.)\1{5,}/.test(trimmed);
};

const accessDescription = computed(() => (
    isUsableDescription(accessPlan.value?.description)
        ? accessPlan.value!.description!
        : DEFAULT_ACCESS_DESCRIPTION
));

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
    { label: 'Publier et gérer vos remplacements', available: false },
    { label: 'Postuler aux annonces qui vous intéressent', available: false },
    { label: 'Modifier ou fermer vos publications', available: false },
    { label: 'Publier un remplacement urgent', available: false },
    { label: 'Mise en avant en tête de liste', available: false },
];

const accessFeatures = [
    'Rechercher les remplacements disponibles',
    'Consulter les annonces et missions institution',
    'Alertes et notifications personnalisées',
    'Filtres par zone, dates et type de soins',
    'Aperçu des détails avant de postuler',
    'Publier et gérer vos remplacements',
    'Postuler aux annonces qui vous intéressent',
    'Modifier ou fermer vos publications',
    'Publier un remplacement urgent',
    'Accès permanent — paiement unique',
];

const boostFeatures = [
    'Annonce en tête des résultats de recherche',
    'Visibilité maximale pendant 7 jours',
    'Idéal pour combler une période rapidement',
    'Activation en un clic sur vos annonces',
    'Annulable à tout moment',
];

const tips = [
    {
        icon: Gift,
        title: 'Gratuit',
        text: 'Parfait pour surveiller le marché et recevoir les bonnes opportunités, sans payer.',
    },
    {
        icon: KeyRound,
        title: 'Accès 9,90 €',
        text: 'Indispensable dès que vous souhaitez publier une annonce ou postuler à une offre.',
    },
    {
        icon: Rocket,
        title: 'Boost 5 €/sem.',
        text: 'Option ponctuelle pour accélérer le remplissage d\'une annonce déjà publiée.',
    },
    {
        icon: Search,
        title: 'Progressif',
        text: 'Commencez gratuitement, activez l\'accès quand vous êtes prêt à passer à l\'action.',
    },
];

const formatAmount = (amount?: string | number | null, fallback = '—') => {
    if (amount === undefined || amount === null || amount === '') return fallback;
    const num = Number(amount);
    if (Number.isNaN(num)) return String(amount);
    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const handleAccessCta = async () => {
    if (!user.value) {
        return navigateTo('/register');
    }

    if (!accessPlan.value?.stripe_price_id) {
        return navigateTo('/acces-plan');
    }

    purchasing.value = true;
    try {
        const response = await purchaseAccess(accessPlan.value.stripe_price_id);
        if (response?.url) {
            window.location.href = response.url;
        }
    }
    finally {
        purchasing.value = false;
    }
};

const handleBoostCta = () => {
    if (!user.value) {
        return navigateTo('/register');
    }
    navigateTo('/dashboard/replacements?type=me');
};
</script>
