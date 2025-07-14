<template>
    <header class="bg-primarytech fixed top-0 w-full z-50 h-10 text-white flex items-center">
        <div class="container mx-auto flex justify-between items-center px-4">
            <p class="flex items-center gap-2">
                <MapPinIcon class="w-5 h-5" />
                Lorem ipsum dolores - Belgique
            </p>
            <p class="flex items-center gap-2">
                <EnvelopeIcon class="w-5 h-5" />
                info@nursitech.be
            </p>
        </div>
    </header>
    <header class="bg-white fixed top-10 w-full z-40 h-20 hidden sm:flex justify-center items-center px-4 shadow">
        <div class="hidden lg:flex justify-between items-center container">
            <div>
                <LayoutsAppImage
                    src="/nurs_tech.png"
                    alt="NurseTech"
                    class="h-10 lg:h-14"
                />
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
                    href="/login"
                >
                    Connexion
                </Button>
                <Button
                    v-if="isLoggedIn"
                    class="font-semibold text-base"
                    href="/dashboard"
                >
                    Tableau de bord
                </Button>
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
                    <div class="relative my-auto">
                        <LayoutsSheetMenu />
                    </div>
                </div>
            </div>
            <div
                :class="{
                    'relative m-auto flex sm:hidden pt-12 justify-center items-center': route.path === '/',
                    'hidden': route.path != '/',
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
                        href="/login"
                    >
                        Connexion
                    </Button>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { MapPinIcon, EnvelopeIcon } from '@heroicons/vue/24/solid';
import { useRoute } from 'vue-router';

const { isLoggedIn } = useAuth();

const navigationItems = [
    { label: 'Qui sommes-nous?', route: '/nurstech-by-infiswap' },
    { label: 'Nos Partenaires', route: '/' },
    { label: 'Services', route: '/services' },
    { label: 'Contact', route: '/contact' },
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
