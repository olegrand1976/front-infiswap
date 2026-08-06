<template>
    <div
        class="relative mx-auto w-full max-w-80 select-none"
        role="img"
        :aria-label="$t('home.mockup.alt')"
    >
        <div class="relative rounded-[1.75rem] bg-gray-900 p-[0.45rem] shadow-[0_18px_40px_rgb(0_0_0/0.28),inset_0_0_0_1px_rgb(255_255_255/0.12)]">
            <div
                class="absolute top-[0.7rem] left-1/2 z-[2] h-[0.55rem] w-[38%] -translate-x-1/2 rounded-full bg-[#0b1220]"
                aria-hidden="true"
            />

            <div class="relative aspect-[9/16] overflow-hidden rounded-[1.35rem] bg-white">
                <div class="relative flex h-[48%] flex-col items-center justify-end bg-[linear-gradient(160deg,#e8304a_0%,#c9223c_100%)] px-[0.85rem] pt-3 pb-4 text-center text-white">
                    <div
                        class="pointer-events-none absolute top-[0.65rem] left-1/2 h-20 w-18 -translate-x-1/2"
                        aria-hidden="true"
                    >
                        <span class="home-phone-mockup__clip-board" />
                        <span class="absolute top-[0.2rem] -left-[0.15rem] h-[2.2rem] w-[1.1rem] rotate-[-18deg] rounded-[999px_999px_40%_40%] bg-[#4caf7d] opacity-90" />
                        <span class="absolute top-[0.1rem] -left-[0.85rem] text-[1.1rem] leading-none font-bold text-white/35 before:content-['+']" />
                        <span class="absolute top-[1.4rem] -right-[0.75rem] text-[1.1rem] leading-none font-bold text-white/35 before:content-['+']" />
                    </div>

                    <p class="relative z-[1] mb-[0.15rem] text-[0.7rem] leading-[1.2] font-normal lg:text-[0.78rem]">
                        {{ $t('home.mockup.lookingFor') }}
                    </p>
                    <p class="relative z-[1] mb-[0.55rem] text-[1.05rem] leading-[1.15] font-bold lg:text-[1.2rem]">
                        {{ $t('home.mockup.lookingForNurse') }}
                    </p>
                    <span class="relative z-[1] inline-flex min-w-[5.5rem] items-center justify-center rounded-full bg-white px-[0.9rem] py-[0.28rem] text-[0.72rem] font-bold text-[#e8304a] lg:text-[0.78rem]">
                        {{ $t('home.mockup.consult') }}
                    </span>
                </div>

                <div class="h-[52%] overflow-hidden bg-white px-[0.8rem] pt-[0.85rem] pb-[0.7rem]">
                    <p class="mb-[0.35rem] text-[0.95rem] leading-[1.2] font-bold text-[#e8304a] lg:text-[1.05rem]">
                        {{ $t('home.mockup.replaceMe') }}
                    </p>
                    <p class="mb-[0.45rem] text-[0.72rem] leading-[1.25] font-bold text-gray-900 lg:text-[0.8rem]">
                        {{ $t('home.mockup.needReplacement') }}
                    </p>
                    <p class="mb-[0.4rem] text-[0.58rem] leading-[1.35] text-gray-700 lg:text-[0.62rem]">
                        {{ $t('home.mockup.body1') }}
                    </p>
                    <p class="mb-[0.4rem] text-[0.58rem] leading-[1.35] text-gray-500 lg:text-[0.62rem]">
                        {{ $t('home.mockup.body2') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Icône presse-papiers : composition à 5 fonds superposés, non exprimable proprement en utilitaires Tailwind. */
.home-phone-mockup__clip-board {
    position: absolute;
    inset: 0.55rem 0.55rem 0;
    border-radius: 0.35rem;
    background:
        linear-gradient(#22c55e, #22c55e) 0.45rem 0.55rem / 0.55rem 0.55rem no-repeat,
        linear-gradient(#ef4444, #ef4444) 1.2rem 0.55rem / 0.55rem 0.55rem no-repeat,
        linear-gradient(#ef4444, #ef4444) 1.95rem 0.55rem / 0.55rem 0.55rem no-repeat,
        linear-gradient(#ef4444, #ef4444) 2.7rem 0.55rem / 0.55rem 0.55rem no-repeat,
        linear-gradient(#fff, #fff);
    box-shadow: 0 6px 14px rgb(0 0 0 / 0.18);
}

.home-phone-mockup__clip-board::before {
    content: '';
    position: absolute;
    top: -0.35rem;
    left: 50%;
    width: 1.35rem;
    height: 0.55rem;
    transform: translateX(-50%);
    border-radius: 0.2rem;
    background: #d1d5db;
}
</style>
