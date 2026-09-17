<template>
    <NuxtLayout name="guest">
        <div class="relative font-light">
            <div class="my-5">
                <LayoutsLogo class="w-48 mx-auto" />
            </div>
            <div class="absolute inset-0 bg-tertiary/20 h-full w-full" />

            <div class="container">
                <div
                    class="relative md:my-8 lg:my-16 md:z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center lg:py-20 md:mt-20"
                >
                    <div class="lg:space-y-6 space-y-6 py-6 lg:py-0 order-2 lg:order-1 relative z-30">
                        <div class="space-y-2">
                            <h3
                                class="text-4xl lg:text-5xl xl:text-7xl font-secondary font-semibold"
                            >
                                {{ t('services.title') }} <span class="font-bold text-primary">{{ t('services.titleStrong') }}</span>
                            </h3>
                        </div>

                        <p
                            class="text-muted-foreground"
                        >
                            {{ t('services.intro') }}
                        </p>

                        <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <Button
                                :href="localePath('/register')"
                            >
                                {{ t('services.ctaRegister') }}
                            </Button>
                            <Button
                                href="#nos-services"
                                variant="outline"
                                >
                                {{ t('services.learnMore') }}
                            </Button>
                        </div>
                    </div>

                    <div
                        class="hidden order-1 lg:order-2 lg:flex justify-center lg:justify-end"
                    >
                        <div class="relative aspect-[6/5] w-full max-w-sm overflow-hidden rounded-2xl">
                            <LayoutsAppImage
                                src="services/bandage-img.webp"
                                alt="Pose d'un pansement à un patient"
                                class="block h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute bottom-0 right-0 hidden lg:block z-0">
                <LayoutsAppImage
                    src="Vector_2.png"
                    alt="Vector_2"
                    class="w-64 lg:w-lg relative"
                />
            </div>
            <div class="absolute bottom-[20%] left-2 hidden lg:block z-0">
                <LayoutsAppImage
                    src="/icons/Unin.png"
                    alt="Unin"
                    class="w-8 lg:w-12 relative"
                />
            </div>
        </div>

        <div
            id="nos-services"
            class="container my-8 lg:my-16"
        >
            <div class="flex flex-col gap-16 lg:gap-24">
                <div class="rounded-3xl border border-border bg-surface p-6 lg:p-10 shadow-lg">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <div class="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface-subtle">
                            <LayoutsAppImage
                                src="services/search-and-manage-replacement-img.webp"
                                alt="Équipe d'infirmiers souriants"
                                class="block h-full w-full object-contain"
                            />
                            <span class="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 shadow-md">
                                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Search class="h-3.5 w-3.5" />
                                </span>
                                <span class="text-[10px] font-bold uppercase tracking-wide">{{ t('services.tagSearch') }}</span>
                            </span>
                        </div>
                        <div>
                            <h3 class="font-secondary text-2xl font-semibold mt-3 whitespace-pre-line">
                                {{ t('services.replacementTitle') }}
                            </h3>
                            <p class="mt-3 text-muted-foreground whitespace-pre-line">
                                {{ t('services.replacementBody') }}
                            </p>
                            <Button
                                :href="localePath('/replacements')"
                                class="mt-6"
                            >
                                {{ t('services.learnMore') }}
                            </Button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div class="relative order-1 lg:order-2 aspect-[3/2] overflow-hidden rounded-2xl bg-surface-subtle">
                        <LayoutsAppImage
                            src="services/notification-map-img.webp"
                            alt="Itinéraire pour rejoindre un remplacement"
                            class="block h-full w-full object-contain"
                        />
                        <span class="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 shadow-md">
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Bell class="h-3.5 w-3.5" />
                            </span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">{{ t('services.tagAlerts') }}</span>
                        </span>
                    </div>
                    <div class="order-2 lg:order-1">
                        <h3 class="font-secondary text-2xl font-semibold mt-3">
                            {{ t('services.notifTitle') }}
                        </h3>
                        <p class="mt-3 text-muted-foreground">
                            {{ t('services.notifBody') }}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div class="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface-subtle">
                        <LayoutsAppImage
                            src="services/comunicate-and-network-img.webp"
                            alt="Infirmier consultant son ordinateur"
                            class="block h-full w-full object-contain"
                        />
                        <span class="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 shadow-md">
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primaryassur/10 text-primaryassur">
                                <MessageCircle class="h-3.5 w-3.5" />
                            </span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">{{ t('services.tagNetwork') }}</span>
                        </span>
                    </div>
                    <div>
                        <h3 class="font-secondary text-2xl font-semibold mt-3 whitespace-pre-line">
                            {{ t('services.networkTitle') }}
                        </h3>
                        <p class="mt-3 text-muted-foreground whitespace-pre-line">
                            {{ t('services.networkBody') }}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div class="relative order-1 lg:order-2 aspect-[3/2] overflow-hidden rounded-2xl bg-surface-subtle">
                        <LayoutsAppImage
                            src="services/history-img.webp"
                            alt="Groupe de jeunes professionnels échangeant"
                            class="block h-full w-full object-contain"
                        />
                        <span class="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 shadow-md">
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primarytech/10 text-primarytech">
                                <History class="h-3.5 w-3.5" />
                            </span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">{{ t('services.tagTracking') }}</span>
                        </span>
                    </div>
                    <div class="order-2 lg:order-1">
                        <h3 class="font-secondary text-2xl font-semibold mt-3">
                            {{ t('services.historyTitle') }}
                        </h3>
                        <p class="mt-3 text-muted-foreground">
                            {{ t('services.historyBody') }}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div class="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface-subtle">
                        <LayoutsAppImage
                            src="services/development-img.webp"
                            alt="Ordinateur portable ouvert sur un tableau de suivi"
                            class="block h-full w-full object-contain"
                        />
                        <span class="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 shadow-md">
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Share2 class="h-3.5 w-3.5" />
                            </span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">{{ t('services.tagVisibility') }}</span>
                        </span>
                    </div>
                    <div>
                        <h3 class="font-secondary text-2xl font-semibold mt-3">
                            {{ t('services.devNetworkTitle') }}
                        </h3>
                        <p class="mt-3 text-muted-foreground">
                            {{ t('services.devNetworkBody') }}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div class="relative order-1 lg:order-2 aspect-[3/2] overflow-hidden rounded-2xl bg-surface-subtle">
                        <LayoutsAppImage
                            src="services/formation-img.webp"
                            alt="Infirmière consultant une armoire à pharmacie"
                            class="block h-full w-full object-contain"
                        />
                        <span class="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 shadow-md">
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primaryassur/10 text-primaryassur">
                                <GraduationCap class="h-3.5 w-3.5" />
                            </span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">{{ t('services.tagTraining') }}</span>
                        </span>
                    </div>
                    <div class="order-2 lg:order-1">
                        <h3 class="font-secondary text-2xl font-semibold mt-3">
                            {{ t('services.trainingTitle') }}
                        </h3>
                        <p class="mt-3 text-muted-foreground whitespace-pre-line">
                            {{ t('services.trainingBody') }}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div class="relative aspect-[3/2] overflow-hidden rounded-2xl bg-surface-subtle">
                        <LayoutsAppImage
                            src="services/admni-management-img.webp"
                            alt="Infirmière souriante tenant un presse-papier"
                            class="block h-full w-full object-contain"
                        />
                        <span class="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 shadow-md">
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primarytech/10 text-primarytech">
                                <ClipboardCheck class="h-3.5 w-3.5" />
                            </span>
                            <span class="text-[10px] font-bold uppercase tracking-wide">{{ t('services.tagAdmin') }}</span>
                        </span>
                    </div>
                    <div>
                        <h3 class="font-secondary text-2xl font-semibold mt-3 whitespace-pre-line">
                            {{ t('services.adminTitle') }}
                            <span class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                 ({{ t('services.comingSoon') }})
                            </span>
                        </h3>
                        <p class="mt-3 text-muted-foreground">
                            {{ t('services.adminBody') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <section
            id="partenaires"
            class="bg-surface-subtle py-16 lg:py-24"
        >
            <div class="container">
                <div class="max-w-2xl mb-10 lg:mb-14">
                    <h2 class="font-secondary text-3xl lg:text-4xl font-semibold mt-3">
                        {{ t('services.partnersHeading') }}
                    </h2>
                    <p class="mt-4 text-base text-muted-foreground">
                        {{ t('services.partnersIntro') }}
                    </p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div class="rounded-2xl bg-primarytech p-6 lg:p-8 text-primarytech-foreground shadow-lg transition-transform duration-300 hover:-translate-y-1">
                        <div class="relative mb-5 aspect-[3/2] overflow-hidden rounded-xl bg-white/10">
                            <LayoutsAppImage
                                src="services/monitor_with_laptop.webp"
                                alt="Page web professionnelle NursTech"
                                class="block h-full w-full object-cover"
                            />
                            <div class="mb-5 inline-flex p-2 absolute bottom-0 left-4">
                                <LayoutsNursTech custom-class="h-20 w-auto" />
                            </div>
                        </div>
                        <p class="font-secondary text-lg font-semibold leading-snug">
                            {{ t('services.nurstechLead') }}
                        </p>
                        <p class="mt-3 lg:min-h-20 text-sm text-primarytech-foreground/80">
                            {{ t('services.nurstechBody') }}
                        </p>
                        <Button
                            :href="`${localePath('/nurstech-by-infiswap')}#information-form`"
                            class="mt-6 bg-white text-primarytech hover:bg-white/90"
                            @click="onServicesLearnMore('nurstech')"
                        >
                            {{ t('services.ctaNurstech') }}
                        </Button>
                    </div>

                    <div class="rounded-2xl bg-primaryassur p-6 lg:p-8 text-primaryassur-foreground shadow-lg transition-transform duration-300 hover:-translate-y-1">
                        <div class="relative mb-5 aspect-[3/2] overflow-hidden rounded-xl bg-white/10">
                            <LayoutsAppImage
                                src="services/two_women_discussing.webp"
                                alt="Consultation NursAssur"
                                class="block h-full w-full object-cover"
                            />
                            <div class="mb-5 inline-flex p-2 absolute -bottom-2 left-4">
                                <LayoutsNursAssur custom-class="h-16 w-auto" />
                            </div>
                        </div>
                        <p class="font-secondary text-lg font-semibold leading-snug">
                            {{ t('services.nursassurLead') }}
                        </p>
                        <p class="mt-3 text-sm text-primaryassur-foreground/80">
                            {{ t('services.nursassurBody') }}
                        </p>
                        <Button
                            :href="`${localePath('/nursassur-by-infiswap')}#quote`"
                            class="mt-6 bg-white text-primaryassur hover:bg-white/90"
                            @click="onServicesLearnMore('nursassur')"
                        >
                            {{ t('services.ctaNursassur') }}
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        <div class="bg-primary py-16 lg:py-24">
            <div class="container text-center space-y-6">
                <LayoutsAppImage
                    src="logo_white.png"
                    alt="InfiSwap"
                    class="w-40 mx-auto"
                />
                <h2 class="font-secondary text-3xl lg:text-5xl italic font-semibold text-primary-foreground max-w-3xl mx-auto leading-snug">
                    {{ t('services.slogan') }}
                </h2>
            </div>
        </div>

        <div class="relative font-light">
            <div class="absolute inset-0 bg-tertiary/30 h-full w-full" />

            <div class="container relative z-10 px-4 lg:px-8">
                <div
                    class="relative my-8 lg:my-16 z-20 flex flex-col lg:flex-row gap-8 lg:gap-24 items-center py-8 lg:py-20"
                >
                    <div class="lg:space-y-6 space-y-6 order-1 relative z-30 flex-1">
                        <p class="block text-base lg:text-3xl font-bold text-primary text-center lg:text-left">
                            {{ t('services.withTitle') }}
                        </p>
                        <h3
                            class="font-secondary lg:text-4xl text-3xl text-foreground font-semibold text-center lg:text-left"
                        >
                            {{ t('services.withHeading') }}
                        </h3>
                        <p class="text-center lg:text-start text-base text-muted-foreground">
                            {{ t('services.withBody') }}
                        </p>
                    </div>
                    <div class="order-2 flex justify-center lg:justify-end flex-1">
                        <div class="relative w-full max-w-md pb-10">
                            <LayoutsAppImage
                                src="/home/A nurse with a woman.png"
                                alt="Une infirmière et une patiente consultant une tablette"
                                class="w-full z-10"
                            />
                            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 w-[82%] rounded-2xl border border-border bg-surface p-5 shadow-xl">
                                <Quote class="h-6 w-6 text-primary" />
                                <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    {{ t('services.quoteText') }}
                                </p>
                                <div class="mt-3 flex items-center gap-2">
                                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">IL</span>
                                    <span class="text-xs font-bold">{{ t('services.quoteAuthor') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container py-8 lg:py-16">
            <div
                class="relative overflow-hidden rounded-3xl bg-foreground text-background grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 lg:gap-8 items-center p-8 lg:p-14"
            >
                <div class="order-2 lg:order-1 flex justify-center lg:justify-start">
                    <LayoutsAppImage
                        src="home/nurse_with_stetho.png"
                        alt="Infirmière avec un stéthoscope"
                        class="max-h-72 w-auto"
                    />
                </div>
                <div
                    class="order-1 lg:order-2 text-center lg:text-left space-y-4"
                >
                    <h3
                        class="font-secondary text-3xl lg:text-4xl font-semibold max-w-lg mx-auto lg:mx-0 whitespace-pre-line"
                    >
                        {{ t('services.signupTitle') }}
                    </h3>
                    <p class="text-sm text-background/70">
                        {{ t('services.signupSub') }}
                    </p>

                    <div class="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
                        <Button
                            :href="localePath('/register')"
                            class="bg-background text-foreground hover:bg-background/90 font-bold"
                        >
                            {{ t('services.ctaRegister') }}
                        </Button>
                        <NuxtLink
                            :to="localePath('/login')"
                            class="text-sm font-semibold text-background hover:text-primary transition-colors"
                        >
                            {{ t('services.alreadyMember') }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
    <!-- <ErrorUnderConstruction /> -->
</template>

<script lang="ts" setup>
import {
    Bell,
    ClipboardCheck,
    GraduationCap,
    History,
    MessageCircle,
    Quote,
    Search,
    Share2,
} from 'lucide-vue-next';
import type { PartnerProduct } from '~/utils/partnerServices';

const { t } = useI18n();
const localePath = useLocalePath();
const { trackPartnerImpression, trackPartnerCtaClick, registerPartnerClickFromProduct } = usePartnerServices();

useHead({
    title: () => t('services.seoTitle'),
    meta: [
        {
            name: 'description',
            content: () => t('services.metaDescription'),
        },
    ],
});

definePageMeta({
    layout: 'auth',
});

onMounted(() => {
    trackPartnerImpression('nurstech', 'services_section', 'services');
    trackPartnerImpression('nursassur', 'services_section', 'services');
});

function onServicesLearnMore(product: PartnerProduct) {
    const cta = product === 'nursassur' ? 'see_offer' : 'request_callback';
    trackPartnerCtaClick(product, 'services_section', cta, 'services');
    registerPartnerClickFromProduct(product, 'services', 'services_section');
}
</script>
