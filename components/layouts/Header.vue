<template>
    <header class="bg-muted sm:fixed sm:z-50 w-full sm:h-20 sm:block lg:flex lg:justify-center items-center">
        <div class="hidden md:flex justify-between items-center container">
            <div>
                <LayoutsLogo class="h-10 lg:h-14" />
            </div>

            <nav class="flex">
                <ul class="flex gap-4 lg:text-sm md:text-[0.7em]">
                    <li
                        v-for="(item, index) in navigationItems"
                        :key="index"
                        :class="{
                            'text-primary font-semibold active-link': isActiveRoute(item.route),
                            'hover:text-primary/90 font-semibold text-dark animate duration-500': !isActiveRoute(item.route),
                        }"
                    >
                        <NuxtLink :to="item.route">
                            {{ item.label }}
                        </NuxtLink>
                    </li>
                </ul>
            </nav>

            <div class="flex gap-4 items-center">
                <Button
                    v-if="!isLoggedIn"
                    class="font-semibold text-base"
                    href="/register-beta"
                >
                    Préinscription
                </Button>
                <Button
                    v-if="isLoggedIn"
                    class="font-semibold text-base"
                    href="/dashboard"
                >
                    Tableau de bord
                </Button>
                <LayoutsDropdownLang />
            </div>
        </div>

        <div class="md:hidden">
            <div class="h-20 flex justify-between items-center my-auto px-8">
                <div>
                    <LayoutsLogo class="w-36 h-11" />
                </div>
                <div class="flex flex-row items-center space-x-4">
                    <Button
                        v-if="!isLoggedIn"
                        class="hidden sm:block font-semibold md:text-[0.7em] lg:text-xs"
                        href="/register-beta"
                    >
                        Pré-inscription
                    </Button>
                    <div>
                        <LayoutsDropdownLang />
                    </div>
                    <div class="relative my-auto">
                        <LayoutsSheetMenu />
                    </div>
                </div>
            </div>
            <div
                :class="{
                    'relative m-auto flex sm:hidden pt-12 justify-center items-center': route.path !== 'search-nurse',
                    'hidden': route.path === '/search-nurse',
                }"
            >
                <div class="absolute top-0">
                    <NuxtImg
                        src="/round_cont.png"
                        class="w-screen h-40"
                    />
                </div>
                <div class="w-screen px-10">
                    <Button
                        v-if="isLoggedIn"
                        variant="light"
                        class="font-semibold cursor-pointer w-full h-10 shadow-lg rounded-full relative z-30"
                        href="/register-beta"
                    >
                        Pré-inscription
                    </Button>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const { isLoggedIn } = useAuth();

const navigationItems = [
    { label: 'ACCUEIL', route: '/' },
    { label: 'A PROPOS', route: '/about' },
    { label: 'NOS SERVICES', route: '/services' },
    { label: 'CONTACTS', route: '/contact' },
];

const route = useRoute();
const isActiveRoute = (routePath: string) => route.path === routePath;
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
