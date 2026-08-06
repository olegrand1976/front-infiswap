<template>
    <div class="bg-background py-14 sm:py-20">
        <div class="container">
            <h2 class="mx-auto mb-8 max-w-lg text-center font-secondary text-xl font-semibold text-foreground sm:mb-11 sm:text-[26px]">
                {{ $t('home.platform.title') }}
            </h2>

            <div class="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
                <article
                    v-for="card in cards"
                    :key="card.key"
                    class="overflow-hidden rounded-[18px] border border-input bg-card shadow-[0_2px_6px_rgba(0,0,0,.08),0_8px_20px_rgba(0,0,0,.06)] transition-transform hover:-translate-y-0.5"
                >
                    <div
                        class="relative flex h-52 items-end justify-center overflow-hidden sm:h-64"
                        :class="card.artClass"
                    >
                        <LayoutsAppImage
                            :src="card.image"
                            :alt="card.alt"
                            class="h-[94%] w-auto object-contain object-bottom"
                        />
                    </div>
                    <div class="p-4 sm:p-5">
                        <h3 class="mb-2 whitespace-pre-line text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
                            {{ card.title }}
                        </h3>
                        <Button
                            :href="localePath('/about')"
                            variant="link"
                            class="h-auto gap-1.5 p-0 text-xs font-bold text-primary sm:text-[12.5px]"
                        >
                            {{ $t('home.stats.learnMore') }}
                            <ArrowRight class="!size-3.5" />
                        </Button>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';

const { t } = useI18n();
const localePath = useLocalePath();

const cards = computed(() => [
    {
        key: 'field',
        image: '/home/nurse_with_phone3.png',
        alt: t('home.platform.altField'),
        title: t('home.platform.cardFieldDesktop'),
        artClass: 'bg-primary',
    },
    {
        key: 'replace',
        image: '/home/nurse_with_phone2.png',
        alt: t('home.platform.altReplace'),
        title: t('home.platform.cardReplace'),
        artClass: 'bg-success',
    },
    {
        key: 'find',
        image: '/home/three_nurses.png',
        alt: t('home.platform.altFind'),
        title: t('home.platform.cardFindDesktop'),
        artClass: 'bg-foreground',
    },
]);
</script>
