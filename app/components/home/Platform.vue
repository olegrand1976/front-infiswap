<template>
    <div class="bg-background py-14">
        <div class="container">
            <h2 class="mx-auto mb-8 max-w-lg text-center font-secondary text-xl font-semibold text-foreground sm:mb-11 sm:text-[26px]">
                {{ $t('home.platform.title') }}
            </h2>

            <div class="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
                <article class="overflow-hidden rounded-lg border border-input bg-card shadow-lg transition-transform hover:-translate-y-0.5">
                    <div class="relative flex h-52 items-end justify-center overflow-hidden bg-success sm:h-64">
                        <LayoutsAppImage
                            src="/home/nurse_with_phone3.webp"
                            :alt="$t('home.platform.altField')"
                            class="h-full -mb-11 w-auto object-contain object-bottom"
                        />
                    </div>
                    <div class="h-32 flex flex-col items-start justify-between p-4 sm:p-5">
                        <h3 class="mb-2 whitespace-pre-line text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
                            {{ $t('home.platform.cardFieldDesktop') }}
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

                <article class="overflow-hidden rounded-lg border border-input bg-card shadow-lg transition-transform hover:-translate-y-0.5">
                    <div class="relative flex h-52 items-end justify-center overflow-hidden bg-secondary sm:h-64">
                        <LayoutsAppImage
                            src="/home/nurse_with_phone2.webp"
                            :alt="$t('home.platform.altReplace')"
                            class="h-full -mb-10 w-auto object-contain object-bottom"
                        />
                    </div>
                    <div class="h-32 flex flex-col items-start justify-between p-4 sm:p-5">
                        <h3 class="mb-2 whitespace-pre-line text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
                            {{ $t('home.platform.cardReplace') }}
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

                <article class="overflow-hidden rounded-lg border border-input bg-card shadow-lg transition-transform hover:-translate-y-0.5">
                    <div class="relative flex h-52 items-end justify-center overflow-hidden bg-tertiary sm:h-64">
                        <LayoutsAppImage
                            src="/home/three_nurses.webp"
                            :alt="$t('home.platform.altFind')"
                            class="w-full -mb-5 object-contain object-bottom"
                        />
                    </div>
                    <div class="h-32 flex flex-col items-start justify-between p-4 sm:p-5">
                        <h3 class="mb-2 whitespace-pre-line text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
                            {{ $t('home.platform.cardFindDesktop') }}
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

const localePath = useLocalePath();
</script>
