<template>
    <section class="relative flex min-h-[560px] items-center overflow-hidden bg-[#0e1a14]">
        <div class="home-hero__mesh absolute inset-0" />
        <div class="absolute top-[-140px] left-[-120px] h-[380px] w-[380px] rounded-full bg-success opacity-50 blur-[50px]" />
        <div class="absolute right-[-80px] bottom-[-160px] h-[340px] w-[340px] rounded-full bg-primary opacity-50 blur-[50px]" />

        <div class="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-11 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-16">
            <div>
                <h1 class="font-secondary text-[32px] font-semibold leading-[1.1] text-white lg:text-[42px]">
                    {{ $t('home.hero.titlePrefix') }} <em class="not-italic text-success">{{ $t('home.hero.titleHighlight') }}</em>
                </h1>
                <p class="mt-4 max-w-md text-[15px] text-white/78">
                    {{ $t('home.hero.lead') }}
                </p>

                <div class="mt-7 flex flex-wrap gap-3">
                    <Button
                        :href="localePath('/replacements')"
                        class="h-auto w-64 gap-2 rounded-lg bg-white px-5.5 py-3.5 text-[13.5px] font-bold text-primary shadow-[0_10px_26px_rgba(0,0,0,.25)] hover:bg-white/90"
                    >
                        <Search class="!size-4" />
                        {{ $t('home.hero.ctaSearch') }}
                    </Button>
                    <Button
                        :href="localePath('/register')"
                        class="h-auto  w-64 gap-2 rounded-lg border border-white/30 bg-white/8 px-5.5 py-3.5 text-[13.5px] font-semibold text-white backdrop-blur-md hover:bg-white/15"
                    >
                        <UserPlus class="!size-4" />
                        {{ $t('home.hero.ctaPublish') }}
                    </Button>
                </div>

                <div class="mt-8 flex items-center gap-3.5">
                    <div class="flex">
                        <span
                            v-for="n in 4"
                            :key="n"
                            class="-ml-2 size-7.5 rounded-full border-2 border-[#16261c] bg-gradient-to-br from-success to-primary first:ml-0"
                        />
                    </div>
                    <p class="text-xs text-white/75">
                        <b class="font-bold text-white">{{ formattedMembers }}+</b> {{ $t('home.hero.trustText') }}
                    </p>
                </div>
            </div>

            <div class="relative flex justify-center">
                <div class="relative w-48 rotate-[6deg] xs:w-52 sm:w-60">
                    <HomePhoneMockup />

                    <a
                        href="tel:+32478023377"
                        class="absolute -right-20 md:-right-28 top-[6%] flex items-center gap-1.5 rounded-lg bg-white p-2 shadow-[0_16px_36px_rgba(0,0,0,.35)] gap-2"
                    >
                        <span class="flex size-6 shrink-0 items-center justify-center rounded-lg bg-success text-white sm:size-8.5 sm:rounded-[9px]">
                            <Phone class="size-4" />
                        </span>
                        <span>
                            <span class="block text-[8px] font-semibold text-gray-400 sm:text-[10px]">{{ $t('home.hero.callLabel') }}</span>
                            <span class="block text-[10px] font-bold text-foreground sm:text-[13px]">(+32) 478 02 33 77</span>
                        </span>
                    </a>

                    <div class="absolute top-32 md:top-39 -left-24 md:-left-28 w-32 md:w-40 flex items-center gap-2 rounded-lg bg-white shadow-[0_16px_36px_rgba(0,0,0,.35)] gap-2 p-2">
                        <span class="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary text-white sm:size-8.5 sm:rounded-[9px]">
                            <UserPlus class="size-3 sm:size-4" />
                        </span>
                        <span>
                            <span class="block text-[8px] font-semibold text-gray-400 sm:text-[10px]">{{ $t('home.hero.activeMembersLabel') }}</span>
                            <span class="block text-[10px] font-bold text-success sm:text-[13px]">{{ formattedMembers }}+</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Phone, Search, UserPlus } from 'lucide-vue-next';

const localePath = useLocalePath();
const { getKpiValue, fetchStats } = usePlatformStats();

await fetchStats();

const formattedMembers = computed(() => new Intl.NumberFormat('fr-BE').format(getKpiValue('members_total')));
</script>

<style scoped>
/* Mesh gradient à 4 couches (3 radiales + 1 linéaire, fonctions oklch) : non exprimable proprement en utilitaire Tailwind. */
.home-hero__mesh {
    background:
        radial-gradient(1100px 620px at 8% -10%, oklch(0.8125 0.1526 153.76 / .55), transparent 60%),
        radial-gradient(900px 700px at 100% 15%, oklch(0.5921 0.1935 15.63 / .8), transparent 55%),
        radial-gradient(700px 500px at 60% 110%, oklch(0.5921 0.1935 15.63 / .55), transparent 60%),
        linear-gradient(135deg, #0d2318 0%, #17331f 30%, #7a1f2d 78%, #a4243d 100%);
}
</style>
