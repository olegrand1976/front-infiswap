<template>
    <section class="home-hero relative overflow-hidden">
        <div class="home-hero__mesh absolute inset-0" />
        <div class="home-hero__orb home-hero__orb--a absolute rounded-full" />
        <div class="home-hero__orb home-hero__orb--b absolute rounded-full" />

        <div class="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-16">
            <div>
                <LayoutsAppImage
                    src="/logo_white.png"
                    alt="Logo InfiSwap"
                    class="mb-7 h-8 w-auto object-contain"
                />

                <h1 class="font-secondary text-[32px] font-semibold leading-[1.1] text-white lg:text-[42px]">
                    {{ $t('home.hero.titlePrefix') }} <em class="not-italic text-success">{{ $t('home.hero.titleHighlight') }}</em>
                </h1>
                <p class="mt-4 max-w-md text-[15px] text-white/78">
                    {{ $t('home.hero.lead') }}
                </p>

                <div class="mt-7 flex flex-wrap gap-3">
                    <Button
                        :href="localePath('/replacements')"
                        class="h-auto gap-2 rounded-[9px] bg-white px-5.5 py-3.5 text-[13.5px] font-bold text-primary shadow-[0_10px_26px_rgba(0,0,0,.25)] hover:bg-white/90"
                    >
                        <Search class="!size-4" />
                        {{ $t('home.hero.ctaSearch') }}
                    </Button>
                    <Button
                        :href="localePath('/register')"
                        class="h-auto gap-2 rounded-[9px] border border-white/30 bg-white/8 px-5.5 py-3.5 text-[13.5px] font-semibold text-white backdrop-blur-md hover:bg-white/15"
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
                <div class="home-hero__phone relative w-48 sm:w-60 lg:w-72">
                    <HomePhoneMockup />

                    <a
                        href="tel:+32478023377"
                        class="absolute -bottom-3 -left-3 flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-[0_16px_36px_rgba(0,0,0,.35)] sm:-bottom-4 sm:-left-4 sm:gap-2.5 sm:rounded-xl sm:px-4 sm:py-2.5"
                    >
                        <span class="flex size-6 shrink-0 items-center justify-center rounded-lg bg-success text-white sm:size-8.5 sm:rounded-[9px]">
                            <Phone class="size-3 sm:size-4" />
                        </span>
                        <span>
                            <span class="block text-[8px] font-semibold text-gray-400 sm:text-[10px]">{{ $t('home.hero.callLabel') }}</span>
                            <span class="block text-[10px] font-bold text-foreground sm:text-[13px]">(+32) 478 02 33 77</span>
                        </span>
                    </a>

                    <div class="absolute right-[-4%] top-[6%] flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 shadow-[0_16px_36px_rgba(0,0,0,.35)] sm:gap-2.5 sm:rounded-xl sm:px-4 sm:py-2.5">
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
.home-hero {
    min-height: 560px;
    background: #0e1a14;
    display: flex;
    align-items: center;
}

.home-hero__mesh {
    background:
        radial-gradient(1100px 620px at 8% -10%, oklch(0.8125 0.1526 153.76 / .55), transparent 60%),
        radial-gradient(900px 700px at 100% 15%, oklch(0.5921 0.1935 15.63 / .8), transparent 55%),
        radial-gradient(700px 500px at 60% 110%, oklch(0.5921 0.1935 15.63 / .55), transparent 60%),
        linear-gradient(135deg, #0d2318 0%, #17331f 30%, #7a1f2d 78%, #a4243d 100%);
}

.home-hero__orb {
    filter: blur(50px);
    opacity: .5;
}

.home-hero__orb--a {
    top: -140px;
    left: -120px;
    width: 380px;
    height: 380px;
    background: var(--success);
}

.home-hero__orb--b {
    bottom: -160px;
    right: -80px;
    width: 340px;
    height: 340px;
    background: var(--primary);
}

.home-hero__phone {
    transform: rotate(3deg);
}
</style>
