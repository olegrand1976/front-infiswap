<template>
    <div
        class="home-phone-mockup relative mx-auto select-none"
        role="img"
        :aria-label="$t('home.mockup.alt')"
    >
        <div class="home-phone-mockup__bezel relative">
            <div
                class="home-phone-mockup__notch"
                aria-hidden="true"
            />
            <div class="home-phone-mockup__screen">
                <div class="home-phone-mockup__hero">
                    <div
                        class="home-phone-mockup__clip"
                        aria-hidden="true"
                    >
                        <span class="home-phone-mockup__clip-board" />
                        <span class="home-phone-mockup__clip-leaf" />
                        <span class="home-phone-mockup__clip-plus home-phone-mockup__clip-plus--l" />
                        <span class="home-phone-mockup__clip-plus home-phone-mockup__clip-plus--r" />
                    </div>
                    <p class="home-phone-mockup__eyebrow">
                        {{ $t('home.mockup.lookingFor') }}
                    </p>
                    <p class="home-phone-mockup__title">
                        {{ $t('home.mockup.lookingForNurse') }}
                    </p>
                    <span class="home-phone-mockup__cta">
                        {{ $t('home.mockup.consult') }}
                    </span>
                </div>
                <div class="home-phone-mockup__body">
                    <p class="home-phone-mockup__replace">
                        {{ $t('home.mockup.replaceMe') }}
                    </p>
                    <p class="home-phone-mockup__need">
                        {{ $t('home.mockup.needReplacement') }}
                    </p>
                    <p class="home-phone-mockup__copy">
                        {{ $t('home.mockup.body1') }}
                    </p>
                    <p class="home-phone-mockup__copy home-phone-mockup__copy--muted">
                        {{ $t('home.mockup.body2') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home-phone-mockup {
    width: 100%;
    max-width: 20rem;
}

.home-phone-mockup__bezel {
    border-radius: 1.75rem;
    background: #111827;
    padding: 0.45rem;
    box-shadow:
        0 18px 40px rgb(0 0 0 / 0.28),
        inset 0 0 0 1px rgb(255 255 255 / 0.12);
}

.home-phone-mockup__notch {
    position: absolute;
    top: 0.7rem;
    left: 50%;
    z-index: 2;
    width: 38%;
    height: 0.55rem;
    transform: translateX(-50%);
    border-radius: 999px;
    background: #0b1220;
}

.home-phone-mockup__screen {
    position: relative;
    overflow: hidden;
    border-radius: 1.35rem;
    background: #fff;
    aspect-ratio: 9 / 16;
}

.home-phone-mockup__hero {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 48%;
    padding: 0.75rem 0.85rem 1rem;
    background: linear-gradient(160deg, #e8304a 0%, #c9223c 100%);
    text-align: center;
    color: #fff;
}

.home-phone-mockup__clip {
    position: absolute;
    top: 0.65rem;
    left: 50%;
    width: 4.5rem;
    height: 5rem;
    transform: translateX(-50%);
    pointer-events: none;
}

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

.home-phone-mockup__clip-leaf {
    position: absolute;
    top: 0.2rem;
    left: -0.15rem;
    width: 1.1rem;
    height: 2.2rem;
    border-radius: 999px 999px 40% 40%;
    background: #4caf7d;
    opacity: 0.9;
    transform: rotate(-18deg);
}

.home-phone-mockup__clip-plus {
    position: absolute;
    color: rgb(255 255 255 / 0.35);
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1;
}

.home-phone-mockup__clip-plus::before {
    content: '+';
}

.home-phone-mockup__clip-plus--l {
    top: 0.1rem;
    left: -0.85rem;
}

.home-phone-mockup__clip-plus--r {
    top: 1.4rem;
    right: -0.75rem;
}

.home-phone-mockup__eyebrow {
    position: relative;
    z-index: 1;
    margin-bottom: 0.15rem;
    font-size: 0.7rem;
    font-weight: 400;
    line-height: 1.2;
}

.home-phone-mockup__title {
    position: relative;
    z-index: 1;
    margin-bottom: 0.55rem;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.15;
}

.home-phone-mockup__cta {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 5.5rem;
    border-radius: 999px;
    background: #fff;
    padding: 0.28rem 0.9rem;
    color: #e8304a;
    font-size: 0.72rem;
    font-weight: 700;
}

.home-phone-mockup__body {
    height: 52%;
    overflow: hidden;
    padding: 0.85rem 0.8rem 0.7rem;
    background: #fff;
}

.home-phone-mockup__replace {
    margin-bottom: 0.35rem;
    color: #e8304a;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.2;
}

.home-phone-mockup__need {
    margin-bottom: 0.45rem;
    color: #111827;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1.25;
}

.home-phone-mockup__copy {
    margin-bottom: 0.4rem;
    color: #374151;
    font-size: 0.58rem;
    font-weight: 400;
    line-height: 1.35;
}

.home-phone-mockup__copy--muted {
    color: #6b7280;
}

@media (min-width: 1024px) {
    .home-phone-mockup__eyebrow {
        font-size: 0.78rem;
    }

    .home-phone-mockup__title {
        font-size: 1.2rem;
    }

    .home-phone-mockup__cta {
        font-size: 0.78rem;
    }

    .home-phone-mockup__replace {
        font-size: 1.05rem;
    }

    .home-phone-mockup__need {
        font-size: 0.8rem;
    }

    .home-phone-mockup__copy {
        font-size: 0.62rem;
    }
}
</style>
