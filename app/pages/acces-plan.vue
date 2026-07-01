<template>
    <div class="min-h-screen flex flex-col bg-white font-light overflow-x-hidden">
        <main class="flex-1 relative">
            <div class="absolute inset-0 bg-tertiary/25 pointer-events-none" />
            <div class="absolute top-24 -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div class="absolute bottom-40 -right-20 w-80 h-80 rounded-full bg-success/10 blur-3xl pointer-events-none" />
            <div class="absolute top-40 right-8 hidden lg:block pointer-events-none opacity-60">
                <LayoutsAppImage
                    src="/icons/plus.png"
                    class="w-10 animate-pulse"
                />
            </div>
            <div class="absolute bottom-56 left-12 hidden lg:block pointer-events-none opacity-50">
                <LayoutsAppImage
                    src="/icons/Unin.png"
                    class="w-8"
                />
            </div>

            <div class="relative container px-4 sm:px-6 py-10 lg:py-16">
                <div class="flex justify-center mb-8 lg:mb-12">
                    <LayoutsLogo class="h-14 lg:h-16" />
                </div>

                <div
                    v-if="pageView === 'confirming'"
                    class="flex justify-center py-20"
                >
                    <div class="text-center space-y-4">
                        <Skeleton class="h-64 w-full max-w-md rounded-2xl mx-auto" />
                        <p class="text-primary font-medium animate-pulse">
                            Validation de votre paiement en cours…
                        </p>
                    </div>
                </div>

                <div
                    v-else-if="pageView === 'loading'"
                    class="flex justify-center py-20"
                >
                    <Skeleton class="h-96 w-full max-w-4xl rounded-2xl" />
                </div>

                <div
                    v-else-if="pageView === 'plan'"
                    class="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto"
                >
                    <div class="space-y-8 text-center lg:text-left order-2 lg:order-1">
                        <div class="space-y-4">
                            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary leading-tight">
                                Un accès.<br>
                                <span class="text-foreground/80">Pour toujours.</span>
                            </h1>
                            <p class="text-gray-600 text-base lg:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Rejoignez des centaines d'infirmier(ère)s qui simplifient leurs remplacements.
                                Un seul paiement, un accès permanent à tous les outils essentiels.
                            </p>
                        </div>

                        <ul class="grid sm:grid-cols-2 gap-4 text-left">
                            <li
                                v-for="feature in features"
                                :key="feature.title"
                                class="flex gap-3 p-4 rounded-2xl bg-white/80 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
                            >
                                <div class="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <component
                                        :is="feature.icon"
                                        class="w-5 h-5 text-primary"
                                    />
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800 text-sm">
                                        {{ feature.title }}
                                    </p>
                                    <p class="text-xs text-gray-500 mt-0.5 leading-snug">
                                        {{ feature.description }}
                                    </p>
                                </div>
                            </li>
                        </ul>

                        <p class="hidden lg:flex items-center gap-2 text-sm text-gray-500">
                            <ShieldCheck class="w-4 h-4 text-success shrink-0" />
                            Paiement sécurisé par Stripe · Accès activé immédiatement
                        </p>
                    </div>

                    <div class="order-1 lg:order-2">
                        <div class="relative max-w-md mx-auto">
                            <div class="absolute -inset-1 bg-gradient-to-br from-primary/30 via-success/20 to-primary/10 rounded-3xl blur-sm" />
                            <div class="relative bg-white rounded-3xl shadow-2xl border border-white overflow-hidden">
                                <div class="bg-gradient-to-br from-primary to-primary/85 px-6 py-8 text-white text-center">
                                    <span class="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-4">
                                        Paiement unique
                                    </span>
                                    <h2 class="text-xl font-semibold">
                                        {{ accessPlan.name }}
                                    </h2>
                                    <p
                                        v-if="accessPlan.description"
                                        class="mt-2 text-white/85 text-sm leading-relaxed"
                                    >
                                        {{ accessPlan.description }}
                                    </p>
                                    <div class="mt-6 flex items-end justify-center gap-1">
                                        <span class="text-5xl lg:text-6xl font-bold tracking-tight">
                                            {{ accessPlan.amount }}
                                        </span>
                                        <span class="text-2xl font-semibold mb-2">
                                            {{ currencySymbol(accessPlan.currency) }}
                                        </span>
                                    </div>
                                    <p class="mt-2 text-white/75 text-sm">
                                        Accès permanent — sans abonnement mensuel
                                    </p>
                                </div>

                                <div class="p-6 lg:p-8 space-y-5">
                                    <ul class="space-y-3">
                                        <li
                                            v-for="item in includedItems"
                                            :key="item"
                                            class="flex items-center gap-3 text-sm text-gray-700"
                                        >
                                            <CircleCheck class="size-5 text-success" />
                                            {{ item }}
                                        </li>
                                    </ul>

                                    <Button
                                        class="w-full font-bold bg-success hover:bg-success/90"
                                        :in-progress="purchasing"
                                        @click="handleCta"
                                    >
                                        {{ hasAccess ? 'Accéder à mon espace' : 'Obtenir mon accès maintenant' }}
                                    </Button>

                                    <p
                                        v-if="!hasAccess"
                                        class="text-center text-xs text-gray-400 leading-relaxed"
                                    >
                                        En cliquant, vous serez redirigé vers un paiement sécurisé.
                                        Votre accès sera activé dès la confirmation.
                                    </p>
                                </div>
                            </div>

                            <div class="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                                <span class="flex items-center gap-1.5">
                                    <Zap class="w-3.5 h-3.5 text-primary" />
                                    Activation immédiate
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <CircleCheck class="w-3.5 h-3.5 text-success" />
                                    Sans expiration
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <HeartHandshake class="w-3.5 h-3.5 text-primary" />
                                    Conçu par des infirmiers
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-else
                    class="max-w-lg mx-auto text-center py-20 space-y-6"
                >
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tertiary/50">
                        <Bell class="w-8 h-8 text-primary" />
                    </div>
                    <h2 class="text-2xl font-semibold text-primary">
                        Bientôt disponible
                    </h2>
                    <p class="text-gray-600">
                        Le plan d'accès n'est pas encore configuré. Revenez très prochainement ou contactez-nous pour plus d'informations.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            class="rounded-full"
                            variant="outline"
                            href="/contact"
                        >
                            Nous contacter
                        </Button>
                        <Button
                            class="rounded-full"
                            href="/dashboard"
                        >
                            Retour au tableau de bord
                        </Button>
                    </div>
                </div>

                <div
                    v-if="user && pageView === 'plan'"
                    class="text-center mt-12"
                >
                    <NuxtLink
                        to="/dashboard"
                        class="text-sm text-gray-500 hover:text-primary transition-colors underline-offset-4 hover:underline"
                    >
                        ← Retourner au tableau de bord
                    </NuxtLink>
                </div>
            </div>

            <div
                v-if="pageView === 'plan'"
                class="hidden xl:block absolute bottom-0 right-0 pointer-events-none opacity-30"
            >
                <LayoutsAppImage
                    src="Vector_2.png"
                    class="w-48"
                />
            </div>
        </main>

        <LayoutsFooter />
    </div>
</template>

<script setup lang="ts">
import {
    Bell,
    BellRing,
    CircleCheck,
    HeartHandshake,
    MapPin,
    ShieldCheck,
    Users,
    Zap,
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

useHead({
    title: 'Plan d\'accès — InfiSwap',
    meta: [
        {
            name: 'description',
            content: 'Obtenez un accès permanent à InfiSwap : créez vos remplacements, postulez aux missions et gérez votre activité en toute sérénité.',
        },
    ],
});

definePageMeta({
    layout: false,
});

const route = useRoute();
const user = useUser();
const { $toast } = useNuxtApp();
const {
    accessPlan,
    getAccessPlan,
    purchaseAccess,
    confirmAccess,
    hasPlatformAccess,
} = useSubscription();

const hasAccess = ref(false);
const purchasing = ref(false);
const confirmingPayment = ref(false);
const planLoaded = ref(false);

const pageView = computed(() => {
    if (confirmingPayment.value) {
        return 'confirming';
    }

    if (!planLoaded.value) {
        return 'loading';
    }

    if (accessPlan.value) {
        return 'plan';
    }

    return 'empty';
});

const currencySymbol = (currency: string) => (currency === 'gbp' ? '£' : '€');

const features = [
    {
        icon: Zap,
        title: 'Publiez en quelques clics',
        description: 'Créez une annonce de remplacement claire et visible par votre réseau.',
    },
    {
        icon: MapPin,
        title: 'Trouvez près de chez vous',
        description: 'Recherchez des missions selon votre zone et vos disponibilités.',
    },
    {
        icon: BellRing,
        title: 'Alertes personnalisées',
        description: 'Recevez les notifications qui comptent vraiment pour vous.',
    },
    {
        icon: Users,
        title: 'Développez votre réseau',
        description: 'Connectez-vous avec d\'autres professionnels de votre région.',
    },
];

const includedItems = [
    'Créer et gérer vos remplacements',
    'Postuler aux annonces disponibles',
    'Notifications selon vos préférences',
    'Accès aux informations de tournées',
    'Accès permanent, sans renouvellement',
];

const redirectTo = computed(() => safeReturnPath(route.query.redirectTo));

await getAccessPlan();
planLoaded.value = true;

onMounted(async () => {
    const sessionId = route.query.session_id;

    if (sessionId) {
        if (!user.value) {
            return navigateTo('/login');
        }

        confirmingPayment.value = true;

        try {
            const confirmed = await confirmAccess(String(sessionId));

            if (confirmed) {
                hasAccess.value = true;
                $toast({ description: 'Accès activé avec succès !' });
                await navigateTo(redirectTo.value, { replace: true });
            }
            else {
                $toast({
                    variant: 'destructive',
                    description: 'Paiement en cours de validation. Réessayez dans quelques instants.',
                });
            }
        }
        finally {
            confirmingPayment.value = false;
        }

        return;
    }

    if (user.value) {
        hasAccess.value = await hasPlatformAccess();
    }
});

const handleCta = async () => {
    if (hasAccess.value) {
        return navigateTo(redirectTo.value);
    }

    await handlePurchase();
};

const handlePurchase = async () => {
    if (!user.value) {
        return navigateTo('/login');
    }

    if (!accessPlan.value?.stripe_price_id) {
        return;
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
</script>
