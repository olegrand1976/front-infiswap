<template>
    <div>
        <div class="relative font-light">
            <div class="absolute inset-0 bg-tertiary/30 h-[350px] lg:h-full w-full" />
            <div class="container">
                <div class="md:hidden">
                    <LayoutsLogo class="w-46 mx-auto pt-6" />
                </div>
                <div
                    class="relative mb-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-8 lg:py-20 sm:mt-20"
                >
                    <div class="lg:hidden text-center mb-8">
                        <h2 class="text-primary text-4xl font-semibold">
                            {{ $t('about.title') }}
                        </h2>
                    </div>
                    <div class="lg:space-y-6 space-y-8 order-2 lg:order-1 relative z-30">
                        <h3
                            class="text-primary md:text-3xl text-2xl text-center md:text-left"
                        >
                            {{ $t('about.lead') }}
                        </h3>
                        <p>
                            {{ $t('about.p1') }}
                        </p>
                        <p>{{ $t('about.p2') }}</p>
                        <p>{{ $t('about.p3') }}</p>
                        <Button
                            :href="localePath('/register')"
                            class="w-44 mx-auto lg:mx-0 mt-8 flex justify-center items-center font-bold"
                        >
                            {{ $t('about.ctaRegister') }}
                        </Button>
                    </div>
                    <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <LayoutsAppImage
                            src="/home/woman_infirmier.png"
                            :alt="$t('about.altNurseElder')"
                            class="w-full max-w-2xs lg:max-w-none z-20"
                        />
                    </div>
                </div>
            </div>
            <div class="absolute bottom-0 right-0 hidden lg:block z-0">
                <LayoutsAppImage
                    src="Vector_2.png"
                    class="w-64 lg:w-lg relative"
                />
            </div>
            <div class="absolute bottom-[20%] left-2 hidden lg:block z-0">
                <LayoutsAppImage
                    src="/icons/Unin.png"
                    class="w-8 lg:w-12 relative"
                />
            </div>
        </div>

        <!-- <div> -->
        <!-- <HomeServiceContainer /> -->
        <!-- </div> -->

        <div class="container">
            <div
                class="relative my-8 lg:my-16 z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-44 items-center py-8 lg:py-20"
            >
                <div>
                    <LayoutsAppImage
                        src="/home/black_infirmier.png"
                        :alt="$t('about.altNurseYoung')"
                        class="w-full"
                    />
                </div>

                <div class="space-y-6">
                    <h3 class="text-xl md:text-3xl text-primary text-center md:text-left">
                        {{ $t('about.platformTitleLead') }} <strong>{{ $t('about.platformTitleStrong') }}</strong>
                    </h3>
                    <p>
                        {{ $t('about.platformBody') }}
                    </p>
                    <div>
                        <h5 class="font-semibold">
                            {{ $t('about.taglineLabel') }}
                            <span class="text-primary">
                                {{ $t('about.tagline') }}
                            </span>
                        </h5>
                        <p>
                            {{ $t('about.taglineBody') }}
                        </p>
                    </div>
                    <Button
                        :href="localePath('/register')"
                        class="w-44 mx-auto lg:mx-0 mt-8 flex justify-center items-center font-bold"
                    >
                        {{ $t('about.ctaRegister') }}
                    </Button>
                </div>
            </div>
        </div>

        <div class="container">
            <div
                v-for="(card, index) in cards"
                :key="index"
            >
                <Card
                    class="border border-gray-300 hover:bg-transparent hover:scale-100 cursor-default mb-6 -ml-4 -mr-4"
                >
                    <CardHeader class="p-4 rounded-lg bg-primary text-white">
                        <CardTitle class="text-xs sm:text-lg">
                            {{ card.title }}
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="p-4 text-xl text-black space-y-0">
                        <div class="hidden sm:block sm:space-y-6">
                            <p
                                v-for="(item, key) in card.content"
                                :key="key"
                                class="m-0 p-0 leading-5 text-xs sm:text-sm"
                            >
                                {{ item }}
                            </p>
                        </div>
                        <div class="sm:hidden pl-1">
                            <ul class="list-disc pl-1 space-y-2">
                                <li
                                    v-for="(item, key) in card.content"
                                    :key="key"
                                    class="text-black text-xs sm:text-sm leading-5 list-item marker:text-[#d83b58]"
                                >
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Card from '~/components/ui/card/Card.vue';
import CardContent from '~/components/ui/card/CardContent.vue';
import CardHeader from '~/components/ui/card/CardHeader.vue';
import CardTitle from '~/components/ui/card/CardTitle.vue';

const { t } = useI18n();
const localePath = useLocalePath();

const cards = computed(() => [
    {
        title: t('about.cards.searchTitle'),
        content: [
            t('about.cards.search1'),
            t('about.cards.search2'),
            t('about.cards.search3'),
        ],
    },
    {
        title: t('about.cards.connectTitle'),
        content: [
            t('about.cards.connect1'),
            t('about.cards.connect2'),
            t('about.cards.connect3'),
        ],
    },
    {
        title: t('about.cards.manageTitle'),
        content: [
            t('about.cards.manage1'),
            t('about.cards.manage2'),
            t('about.cards.manage3'),
        ],
    },
    {
        title: t('about.cards.networkTitle'),
        content: [
            t('about.cards.network1'),
            t('about.cards.network2'),
            t('about.cards.network3'),
        ],
    },
]);

useHead({
    title: () => t('about.title'),
    meta: [
        {
            name: 'description',
            content: () => t('about.metaDescription'),
        },
    ],
});

definePageMeta({
    layout: 'guest',
});
</script>
