<template>
    <section class="institution-banner relative overflow-hidden">
        <div class="institution-banner__mesh absolute inset-0" />
        <div class="institution-banner__orb institution-banner__orb--a absolute rounded-full" />
        <div class="institution-banner__orb institution-banner__orb--b absolute rounded-full" />

        <div class="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-end gap-6 px-6 pt-14 sm:px-8 lg:grid-cols-2 lg:pt-[70px]">
            <div class="pb-6 text-center lg:pb-[70px] lg:text-left">
                <span class="mx-auto mb-6 flex size-14.5 items-center justify-center rounded-2xl border border-white/20 bg-white/14 backdrop-blur-md lg:mx-0">
                    <Building2 class="size-6.5 text-white" />
                </span>
                <h2 class="mx-auto max-w-[20ch] whitespace-pre-line font-secondary text-[32px] font-semibold leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,.25)] lg:mx-0">
                    {{ $t('home.institution.titleDesktop') }}
                </h2>

                <div class="flex flex-col items-center gap-3.5 lg:items-start">
                    <Button
                        :href="localePath('/offre-institution')"
                        class="h-auto max-w-75 gap-2.5 whitespace-pre-line rounded-[11px] bg-white px-6 py-[15px] text-left text-[13.5px] font-bold leading-[1.32] text-primary shadow-[0_14px_32px_rgba(0,0,0,.3)] hover:bg-white/90"
                    >
                        <UserPlus class="!size-4.5 shrink-0" />
                        {{ $t('home.institution.ctaStaff') }}
                    </Button>
                    <Button
                        :href="localePath('/offre-institution')"
                        class="h-auto max-w-75 gap-2.5 whitespace-pre-line rounded-[11px] border-[1.5px] border-white/55 bg-white/16 px-6 py-[15px] text-left text-[13.5px] font-bold leading-[1.32] text-white shadow-[0_10px_26px_rgba(0,0,0,.2)] backdrop-blur-md hover:bg-white/25"
                    >
                        <HeartHandshake class="!size-4.5 shrink-0" />
                        {{ $t('home.institution.ctaContinuity') }}
                    </Button>
                </div>
            </div>

            <div class="flex justify-center lg:justify-end">
                <LayoutsAppImage
                    src="/home/nurse_with_elder.png"
                    :alt="$t('home.institution.alt')"
                    class="institution-banner__photo w-full max-w-[560px] object-contain"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Building2, HeartHandshake, UserPlus } from 'lucide-vue-next';

const localePath = useLocalePath();
</script>

<style scoped>
.institution-banner {
    background: #0e1a14;
}

.institution-banner__mesh {
    background:
        radial-gradient(900px 600px at 90% -10%, oklch(0.5921 0.1935 15.63 / .8), transparent 55%),
        radial-gradient(800px 600px at 5% 100%, oklch(0.8125 0.1526 153.76 / .5), transparent 55%),
        linear-gradient(150deg, #0d2318 0%, #17331f 35%, #7a1f2d 82%, #a4243d 100%);
}

.institution-banner__orb {
    filter: blur(55px);
    opacity: .5;
}

.institution-banner__orb--a {
    top: -120px;
    right: 40%;
    width: 320px;
    height: 320px;
    background: var(--success);
}

.institution-banner__orb--b {
    bottom: -100px;
    left: -80px;
    width: 280px;
    height: 280px;
    background: var(--primary);
}

.institution-banner__photo {
    filter: drop-shadow(0 30px 40px rgba(0, 0, 0, .4));
}
</style>
