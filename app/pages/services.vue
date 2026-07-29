<template>
    <NuxtLayout name="guest">
        <div class="relative font-light">
            <div
                class="hidden lg:block absolute inset-x-0 bg-tertiary/30 md:h-[300px] lg:h-full w-full z-10"
            />
            <div class="lg:container">
                <div
                    class="relative md:my-8 lg:my-16 md:z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center py-8 lg:py-20 md:mt-20"
                >
                    <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                        <h3
                            class="text-primary text-4xl lg:text-5xl xl:text-7xl font-semibold text-center lg:text-left"
                        >
                            {{ $t('services.title') }} <span class="font-bold">{{ $t('services.titleStrong') }}</span>
                        </h3>

                        <p
                            class="text-center lg:text-left text-base px-8"
                        >{{ $t('services.intro') }}</p>
                    </div>

                    <div
                        class="hidden order-1 lg:order-2 lg:flex justify-center lg:justify-end"
                    >
                        <div class="flex justify-between items-center gap-4">
                            <div class="order-2 flex flex-col justify-center items-center">
                                <LayoutsAppImage
                                    src="/home/Dressing.png"
                                    alt="pansement"
                                    class="w-full z-10"
                                />
                            </div>
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

        <div class="container">
            <div
                class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6"
            >
                <div class="relative">
                    <LayoutsAppImage
                        src="/home/equipe_infirmier.png"
                        alt="equipe infirmier"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold whitespace-pre-line">
                            {{ $t('services.replacementTitle') }}
                        </h3>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3
                        class="hidden lg:block xl:text-4xl md:text-3xl lg:text-xl text-primary font-bold whitespace-pre-line"
                    >
                        {{ $t('services.replacementTitle') }}
                    </h3>
                    <h4 class="hidden lg:flex text-lg lg:text-xl text-primary">
                        {{ $t('services.replacementSubtitle') }}
                    </h4>
                    <p class="hidden lg:flex text-base whitespace-pre-line">
                        {{ $t('services.replacementBody') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3
                        class="lg:flex hidden xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        {{ $t('services.notifTitle') }}
                    </h3>
                    <p class="hidden lg:flex text-base">
                        {{ $t('services.notifBody') }}
                    </p>
                </div>
                <div
                    class="relative z-10 order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    <LayoutsAppImage
                        src="/home/cart.png"
                        alt="cart"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            {{ $t('services.notifTitle') }}
                        </h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- <div class="container">
            <div
                class="-mt-10 relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6"
            >
                <div class="relative">
                    <LayoutsAppImage
                        src="/home/nurse_with_elderly_man.png"
                        alt="un infirmier with vielle homme"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            Planification et <br>
                            organisation
                        </h3>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3
                        class="hidden lg:block xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        Planification et <br>
                        organisation
                    </h3>
                    <h4 class="hidden lg:flex text-lg lg:text-xl text-primary">
                        Gestion automatisé de tourné
                    </h4>
                    <p class="hidden lg:flex text-base">
                        Planifiez vos remplacements en fonction de vos disponibilités grâce
                        à une interface claire et intuitive.
                        <br>
                        Ajoutez directement les missions acceptées à votre agenda pour une
                        organisation sans faille.
                    </p>
                </div>
            </div>
        </div> -->

        <div class="container">
            <div
                class="-mt-10 relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6"
            >
                <div class="relative">
                    <LayoutsAppImage
                        src="home/monitor_with_laptop.png"
                        alt="Infirmier avec patient"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <LayoutsNursTech custom-class="h-8 mx-auto" />
                    </div>
                </div>

                <div class="space-y-4 px-2 lg:px-0">
                    <div class="hidden lg:grid place-content-center mb-3">
                        <LayoutsNursTech />
                    </div>
                    <p class="text-sm lg:text-base text-center lg:text-left">
                        {{ $t('services.nurstechLead') }}
                    </p>
                    <p class="hidden lg:block text-base">
                        {{ $t('services.nurstechBody') }}
                    </p>
                    <div class="flex justify-center lg:justify-start">
                        <Button
                            :href="`${localePath('/nurstech-by-infiswap')}#information-form`"
                            @click="onServicesLearnMore('nurstech')"
                        >
                            {{ $t('services.ctaNurstech') }}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div class="lg:space-y-6 space-y-4 order-2 lg:order-1 relative z-30 px-2 lg:px-0">
                    <div class="hidden lg:grid place-content-center">
                        <LayoutsNursAssur />
                    </div>
                    <p class="text-sm lg:text-base text-center lg:text-left">
                        {{ $t('services.nursassurLead') }}
                    </p>
                    <p class="hidden lg:block text-base">
                        {{ $t('services.nursassurBody') }}
                    </p>
                    <div class="flex justify-center lg:justify-start">
                        <Button
                            :href="`${localePath('/nursassur-by-infiswap')}#quote`"
                            @click="onServicesLearnMore('nursassur')"
                        >
                            {{ $t('services.ctaNursassur') }}
                        </Button>
                    </div>
                </div>
                <div
                    class="relative order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    <LayoutsAppImage
                        src="home/two_women_discussing.png"
                        alt="ensemble des jeunes"
                        class="w-full z-10 rounded-3xl"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <LayoutsNursAssur custom-class="h-8 mx-auto" />
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div
                class="-mt-10 relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6"
            >
                <div class="relative">
                    <LayoutsAppImage
                        src="/home/male nurse.png"
                        alt="un infirmier"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold whitespace-pre-line">
                            {{ $t('services.networkTitle') }}
                        </h3>
                    </div>
                </div>

                <div class="space-y-6">
                    <h3
                        class="hidden lg:flex xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold whitespace-pre-line"
                    >
                        {{ $t('services.networkTitle') }}
                    </h3>
                    <h4 class="hidden lg:flex text-lg lg:text-xl text-primary">
                        {{ $t('services.networkSubtitle') }}
                    </h4>
                    <p class="hidden lg:flex text-base whitespace-pre-line">
                        {{ $t('services.networkBody') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3
                        class="hidden lg:flex xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        {{ $t('services.historyTitle') }}
                    </h3>
                    <p class="hidden lg:block text-base">
                        {{ $t('services.historyBody') }}
                    </p>
                </div>
                <div
                    class="relative order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    <LayoutsAppImage
                        src="/home/A group of young people.png"
                        alt="ensemble des jeunes"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            {{ $t('services.historyTitle') }}
                        </h3>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div
                    class="relative"
                >
                    <LayoutsAppImage
                        src="/home/computer.png"
                        alt="un ordinateur"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold">
                            {{ $t('services.devNetworkTitle') }}
                        </h3>
                    </div>
                </div>
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3
                        class="hidden lg:flex xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        {{ $t('services.devNetworkTitle') }}
                    </h3>
                    <p class="hidden lg:flex text-base">
                        {{ $t('services.devNetworkBody') }}
                    </p>
                </div>
            </div>
        </div>
        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div class="space-y-6">
                    <h3
                        class="hidden lg:flex xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold whitespace-pre-line"
                    >
                        {{ $t('services.adminTitle') }}
                    </h3>
                    <h4 class="hidden lg:flex text-lg lg:text-xl text-primary">
                        {{ $t('services.adminSubtitle') }}
                    </h4>
                    <p class="hidden lg:flex text-base">
                        {{ $t('services.adminBody') }}
                    </p>
                </div>
                <div class="relative order-1 lg:order-2 flex justify-center lg:justify-end">
                    <LayoutsAppImage
                        src="/home/nurse_woman.png"
                        alt="une infirmier"
                        class="w-full z-10"
                    />
                    <div
                        class="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold whitespace-pre-line">
                            {{ $t('services.adminTitle') }}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div
                class="relative my-8 lg:my-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-2 lg:py-6 -mt-10"
            >
                <div
                    class="relative"
                >
                    <LayoutsAppImage
                        src="/home/A nurse looking for medicine.png"
                        alt="une infirmier cherche medicament"
                        class="w-full"
                    />
                    <div
                        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white shadow-lg rounded-lg p-4 w-4/5 text-center lg:hidden"
                    >
                        <h3 class="text-primary text-lg font-bold whitespace-pre-line">
                            {{ $t('services.trainingTitleMobile') }}
                        </h3>
                    </div>
                </div>
                <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                    <h3
                        class="lg:block hidden xl:text-4xl lg:text-3xl md:text-xl text-primary font-bold"
                    >
                        {{ $t('services.trainingTitle') }}
                    </h3>
                    <p class="hidden lg:flex text-base whitespace-pre-line">
                        {{ $t('services.trainingBody') }}
                    </p>
                </div>
            </div>
        </div>

        <div class="container lg:my-8 py-8">
            <LayoutsLogo class="w-72 flex justify-center items-center mx-auto" />
            <h2 class="text-3xl text-center text-primary font-bold lg:my-10">
                {{ $t('services.slogan') }}
            </h2>
        </div>
        <div class="relative font-light">
            <div class="absolute inset-0 bg-tertiary/30 h-full w-full" />

            <div class="container relative z-10 px-4 lg:px-8">
                <div
                    class="relative my-8 lg:my-16 z-20 flex flex-col lg:flex-row gap-8 lg:gap-44 items-center py-8 lg:py-20 mt-20"
                >
                    <div class="lg:space-y-6 space-y-8 order-1 relative z-30 flex-1">
                        <h3
                            class="lg:text-4xl text-3xl text-primary font-bold text-center lg:text-left"
                        >
                            {{ $t('services.withTitle') }}
                        </h3>
                        <p class="text-center lg:text-start text-base">
                            {{ $t('services.withBody') }}
                        </p>
                    </div>
                    <div class="order-2 flex justify-center lg:justify-end flex-1">
                        <LayoutsAppImage
                            src="/home/A nurse with a woman.png"
                            alt="A nurse with a woman"
                            class="w-full h-auto lg:h-full lg:w-full object-cover z-20"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div
            class="container grid grid-cols-1 lg:grid-cols-[60%_40%] gap-16 md:gap-8 items-center py-8 lg:py-24"
        >
            <div
                class="order-1 lg:order-2 text-center lg:text-right space-y-8 lg:space-y-32"
            >
                <h3
                    class="text-primary text-3xl font-semibold text-center lg:text-left max-w-xs sm:max-w-lg mx-auto lg:mx-0 whitespace-pre-line"
                >
                    {{ $t('services.signupTitle') }}
                </h3>

                <div
                    class="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0"
                >
                    <Button
                        :href="localePath('/register')"
                        class="w-44 mx-auto lg:mx-0 flex justify-center items-center font-bold"
                    >
                        {{ $t('services.ctaRegister') }}
                    </Button>
                    <Button
                        variant="outline"
                        class="w-44 mx-auto inline-flex rounded-3xl"
                        :href="localePath('/login')"
                    >
                        {{ $t('services.ctaLogin') }}
                    </Button>
                </div>
            </div>
            <div class="order-2 lg:order-1 flex justify-center lg:justify-start">
                <LayoutsAppImage
                    src="/home/nurse_with_stetho.png"
                    alt="Infirmière avec un stéthoscope"
                    class="h-full max-h-80 w-full object-cover rounded-3xl"
                />
            </div>
        </div>
    </NuxtLayout>
    <!-- <ErrorUnderConstruction /> -->
</template>

<script lang="ts" setup>
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
