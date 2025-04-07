<template>
    <Sheet>
        <SheetTrigger as-child>
            <AlignRightIcon
                class="text-primary cursor-pointer"
                title="Menu de navigation"
            />
        </SheetTrigger>
        <SheetContent
            overlay-class="bg-black/5"
            class="bg-muted pt-24"
        >
            <div>
                <Button
                    v-if="!isLoggedIn"
                    class="w-44 mx-auto inline-flex rounded-3xl ml-4 z-20"
                    href="/login"
                >
                    Connexion
                </Button>
                <Button
                    v-if="isLoggedIn"
                    class="w-44 mx-auto inline-flex rounded-3xl ml-4 z-20"
                    href="/dashboard"
                >
                    Tableau de bord
                </Button>
                <nav class="flex ps-5 mt-8">
                    <ul class="flex flex-col text-sm space-y-9 items-start">
                        <li
                            v-for="(item, index) in navigationItems"
                            :key="index"
                            :class="{
                                'text-primary font-semibold active-link': isActiveRoute(item.route),
                                'hover:underline font-semibold hover:underline-offset-8': !isActiveRoute(item.route),
                            }"
                        >
                            <NuxtLink :to="item.route">
                                {{ item.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>

            <div class="absolute bottom-96 right-0">
                <LayoutsAppImage
                    src="stetho3.png"
                    alt="Stethoscope"
                    class="w-[14rem] h-72"
                />
            </div>

            <div class="absolute bottom-96 right-1">
                <LayoutsAppImage
                    src="/icons/Unin.png"
                    alt="Stethoscope"
                    class="w-16 h-16"
                />
            </div>

            <div class="bg-primary w-full h-12 mt-20 ml-5 shadow-xl text-primary" />

            <div class="mb-8 ml-4 flex flex-col">
                <div class="text-black">
                    <h4 class="font-bold mt-8">
                        CONTACT
                    </h4>
                    <ul class="mt-8 flex flex-col space-y-5">
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row space-x-3"
                            >
                                <PhoneIcon class="h-4 w-4 text-primary" />
                                <p class="text-sm">0478.02.33.77</p>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row space-x-3"
                            >
                                <MapPinIcon class="h-4 w-4 text-primary" />
                                <p class="text-sm">Rue de la Résistance, 92/A 7131 WAUDREZ</p>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row justify-start space-x-3"
                            >
                                <EnvelopeIcon class="h-4 w-4 text-primary" />
                                <p class="text-sm">info@infiswap.be</p>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row justify-start space-x-3"
                            >
                                <GlobeAltIcon class="h-4 w-4 text-primary" />
                                <p class="text-sm">www.infiswap.be</p>
                            </NuxtLink>
                        </li>
                    </ul>
                    <Button
                        v-if="!isLoggedIn"
                        href="/register"
                        class="w-44 mx-auto inline-flex rounded-3xl font-bold mt-12  ml-1"
                    >
                        Inscription
                    </Button>
                </div>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import {
    PhoneIcon,
    MapPinIcon,
    EnvelopeIcon,
    GlobeAltIcon,
} from '@heroicons/vue/24/outline';

import { AlignRightIcon } from 'lucide-vue-next';

const { isLoggedIn } = useAuth();

const navigationItems = [
    { label: 'ACCUEIL', route: '/' },
    { label: 'A PROPOS', route: '/about' },
    { label: 'NOS SERVICES', route: '/services' },
    { label: 'NOS TARIFS', route: '/pricing' },
    { label: 'NOUS CONTACTER', route: '/contact' },
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
