<template>
    <header class="bg-muted sm:fixed sm:z-50 w-full sm:h-20 sm:block lg:flex lg:justify-center items-center lg:py-5">
        <div class="hidden lg:flex justify-between items-center container">
            <div>
                <LayoutsLogo class="h-10 lg:h-14" />
            </div>

            <nav class="flex">
                <ul class="flex gap-4 lg:text-sm md:text-[0.7em]">
                    <li
                        v-for="(item, index) in navigationItems"
                        :key="index"
                        class="text-center"
                        :class="{
                            'text-primary font-semibold active-link': isActiveRoute(item.route),
                            'hover:text-primary/90 font-semibold text-dark animate duration-500': !isActiveRoute(item.route),
                        }"
                    >
                        <NuxtLink :to="localePath(item.route)">
                            {{ item.label }}
                        </NuxtLink>
                    </li>
                </ul>
            </nav>

            <div class="flex gap-4 items-center">
                <Button
                    v-if="!isLoggedIn"
                    class="font-semibold text-base"
                    :href="localePath('/login')"
                >
                    {{ $t('nav.login') }}
                </Button>
                <Button
                    v-if="!isLoggedIn"
                    class="font-semibold text-base"
                    :href="localePath('/register')"
                >
                    {{ $t('nav.register') }}
                </Button>
                <Button
                    v-if="isLoggedIn"
                    class="font-semibold text-base"
                    :href="localePath('/dashboard')"
                >
                    {{ $t('nav.dashboard') }}
                </Button>
                <LayoutsDropdownLang />
            </div>
        </div>

        <div class="lg:hidden">
            <div class="h-20 flex justify-between items-center my-auto px-8">
                <div>
                    <LayoutsLogo class="w-36 h-11" />
                </div>
                <div class="flex flex-row items-center space-x-4">
                    <div>
                        <LayoutsDropdownLang />
                    </div>
                </div>
            </div>
            <div
                :class="{
                    'relative m-auto flex sm:hidden pt-12 justify-center items-center': route.path === '/' || route.path === '/nl',
                    'hidden': route.path !== '/' && route.path !== '/nl',
                }"
            >
                <div class="absolute top-0">
                    <LayoutsAppImage
                        src="round_cont.png"
                        class="w-screen h-40"
                    />
                </div>
                <div class="w-screen px-10">
                    <Button
                        v-if="isLoggedIn"
                        variant="light"
                        class="font-semibold cursor-pointer w-full h-10 shadow-lg rounded-full relative z-30"
                        :href="localePath('/login')"
                    >
                        {{ $t('nav.login') }}
                    </Button>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const { isLoggedIn } = useAuth();
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const navigationItems = computed(() => [
    { label: t('nav.homeNav'), route: '/' },
    { label: t('nav.aboutNav'), route: '/about' },
    { label: t('nav.services'), route: '/services' },
    { label: t('nav.institutionOffer'), route: '/offre-institution' },
    { label: t('nav.career'), route: '/carriere' },
    { label: t('nav.pricingNav'), route: '/pricing' },
    { label: t('nav.contactNav'), route: '/contact' },
]);

const isActiveRoute = (routePath: string) => {
    const localized = localePath(routePath);
    return route.path === localized || route.path === routePath;
};
</script>

<style scoped>
.active-link {
    position: relative;
}

.active-link::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 2%;
    width: 70%;
    height: 4px;
    background-color: hsl(349 67% 54%);
}
</style>
