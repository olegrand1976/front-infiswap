<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="relative overflow-hidden flex-1 flex flex-col">
        <div class="absolute hidden lg:block inset-0 bg-gradient-to-b from-tertiary/30 via-white to-white pointer-events-none" />
        <div class="absolute hidden lg:block -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div class="absolute hidden lg:block top-1/2 -left-32 w-72 h-72 rounded-full bg-success/10 blur-3xl pointer-events-none" />

        <div class="relative container px-4 sm:px-6 pt-8 lg:py-20 max-w-6xl mx-auto flex-1 flex flex-col">
            <div class="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {{ $t('pricing.title') }}<br>
                    <span class="text-primary">{{ $t('pricing.titleHighlight') }}</span>
                </h1>
                <p class="mt-5 text-gray-600 text-base lg:text-lg leading-relaxed">
                    {{ $t('pricing.subtitle') }}
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
                                    <span class="text-sm text-gray-600">{{ $t('pricing.days', { n: plan.duration_days }) }}</span>
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
                                {{ $t('pricing.oneTimeVisibility') }}
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
                            {{ user ? $t('pricing.manageReplacements') : $t('pricing.startFree') }}
                        </Button>
                        <p class="text-center text-xs text-gray-400 mt-3">
                            {{ $t('pricing.activableFrom') }}
                        </p>
                    </div>
                </article>

                <article class="relative flex flex-col rounded-xl border border-primary/30 bg-white shadow-xl shadow-primary/10 overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                    <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />
                    <div class="p-7 lg:p-8 flex flex-col flex-1">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Crown class="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wide text-primary">
                                    {{ $t('pricing.pro.eyebrow') }}
                                </p>
                                <h2 class="text-xl font-bold text-gray-900">
                                    {{ $t('pricing.pro.name') }}
                                </h2>
                            </div>
                        </div>

                        <div class="lg:min-h-[5.25rem] mb-4">
                            <div class="flex items-end gap-1">
                                <span class="text-5xl font-bold text-gray-900 tracking-tight leading-none">
                                    {{ $t('pricing.pro.monthlyPrice') }}
                                </span>
                                <span class="text-2xl font-semibold text-gray-700 mb-1">€</span>
                                <span class="text-sm text-gray-500 mb-2 ml-1">{{ $t('pricing.pro.period') }}</span>
                            </div>
                            <p class="mt-2 text-sm text-gray-500">
                                {{ $t('pricing.pro.yearly') }}
                            </p>
                        </div>

                        <p class="text-gray-600 text-sm leading-relaxed mb-6 lg:min-h-[4.5rem]">
                            {{ $t('pricing.pro.desc') }}
                        </p>

                        <ul class="space-y-3 mb-8 flex-1">
                            <li
                                v-for="item in proFeatures"
                                :key="item"
                                class="flex items-start gap-2.5 text-sm text-gray-700"
                            >
                                <CircleCheck class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>{{ item }}</span>
                            </li>
                        </ul>

                        <Button
                            class="w-full font-semibold h-11"
                            @click="handleProCta"
                        >
                            {{ $t('pricing.pro.cta') }}
                        </Button>
                        <p class="text-center text-xs text-gray-400 mt-3">
                            {{ $t('pricing.pro.note') }}
                        </p>
                    </div>
                </article>
            </div>

            <div class="mt-12 lg:hidden max-w-xl mx-auto">
                <h3 class="text-center text-lg font-semibold text-gray-800 mb-4">
                    {{ $t('pricing.howItWorks') }}
                </h3>
                <div class="rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm text-center">
                    <Search class="w-6 h-6 text-primary mx-auto mb-3" />
                    <p class="font-semibold text-sm text-gray-800">
                        {{ $t('pricing.progressiveTitle') }}
                    </p>
                    <p class="text-xs text-gray-500 mt-2 leading-relaxed">
                        {{ $t('pricing.progressiveBody') }}
                    </p>
                </div>
            </div>

            <div class="mt-16 lg:mt-20 max-w-4xl mx-auto hidden lg:block">
                <h3 class="text-center text-lg font-semibold text-gray-800 mb-8">
                    {{ $t('pricing.howItWorks') }}
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
                    {{ $t('pricing.secureStripe') }}
                </span>
                <span class="flex items-center gap-2">
                    <HeartHandshake class="w-4 h-4 text-primary" />
                    {{ $t('pricing.madeByPros') }}
                </span>
                <span class="flex items-center gap-2">
                    <Zap class="w-4 h-4 text-amber-500" />
                    {{ $t('pricing.fixedDuration') }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    CircleCheck,
    CircleX,
    Crown,
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
const { t, locale } = useI18n();
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

const isUsableDescription = (value?: string | null) => {
    if (!value) return false;
    const trimmed = value.trim();
    if (trimmed.length < 12) return false;
    return !/(.)\1{5,}/.test(trimmed);
};

const boostDescription = computed(() => (
    isUsableDescription(boostPlan.value?.description)
        ? boostPlan.value!.description!
        : t('pricing.boostDefaultDesc')
));

const freeFeatures = computed(() => [
    { label: t('pricing.freeFeatures.f1'), available: true },
    { label: t('pricing.freeFeatures.f2'), available: true },
    { label: t('pricing.freeFeatures.f3'), available: true },
    { label: t('pricing.freeFeatures.f4'), available: true },
    { label: t('pricing.freeFeatures.f5'), available: true },
    { label: t('pricing.freeFeatures.f6'), available: true },
    { label: t('pricing.freeFeatures.f7'), available: true },
    { label: t('pricing.freeFeatures.f8'), available: true },
    { label: t('pricing.freeFeatures.f9'), available: true },
    { label: t('pricing.freeFeatures.f10'), available: false },
]);

const boostFeatures = computed(() => [
    t('pricing.boostFeatures.b1'),
    t('pricing.boostFeatures.b2'),
    t('pricing.boostFeatures.b3'),
    t('pricing.boostFeatures.b4'),
    t('pricing.boostFeatures.b5'),
]);

const proFeatures = computed(() => [
    t('pricing.pro.features.p1'),
    t('pricing.pro.features.p2'),
    t('pricing.pro.features.p3'),
    t('pricing.pro.features.p4'),
    t('pricing.pro.features.p5'),
]);

const tips = computed(() => [
    {
        icon: Gift,
        title: t('pricing.tips.freeTitle'),
        text: t('pricing.tips.freeText'),
    },
    {
        icon: Rocket,
        title: t('pricing.tips.boostTitle'),
        text: t('pricing.tips.boostText'),
    },
    {
        icon: Search,
        title: t('pricing.tips.progressiveTitle'),
        text: t('pricing.tips.progressiveText'),
    },
]);

const formatAmount = (amount?: string | number | null, fallback = '—') => {
    if (amount === undefined || amount === null || amount === '') return fallback;
    const num = Number(amount);
    if (Number.isNaN(num)) return String(amount);
    const numberLocale = locale.value === 'nl' ? 'nl-BE' : 'fr-BE';
    return num.toLocaleString(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const handleProCta = () => {
    if (!user.value) {
        return navigateTo(localePath('/register'));
    }

    return navigateTo(localePath('/dashboard/subscriptions'));
};

const handleBoostCta = () => {
    if (!user.value) {
        return navigateTo(localePath('/register'));
    }
    return navigateTo({
        path: localePath('/dashboard/replacements'),
        query: { type: 'me' },
    });
};
</script>
