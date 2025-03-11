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
                <nav class="flex ps-5">
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
                <NuxtImg
                    src="/stetho3.png"
                    alt="Stethoscope"
                    class="w-[14rem] h-72"
                />
            </div>

            <div class="absolute bottom-96 right-1">
                <NuxtImg
                    src="/icons/Unin.png"
                    alt="Stethoscope"
                    class="w-16 h-16"
                />
            </div>

            <SheetFooter class="mt-20 mb-8 ps-5">
                <div class="mt-16">
                    <NuxtLink
                        to="/dashboard/home"
                        class="text-primary font-bold flex space-x-3"
                    >
                        <ArrowRightIcon class="w-4" />
                        <NuxtLink
                            to="/register-beta"
                            class="text-sm sm:hidden"
                        >
                            Préinscription
                        </NuxtLink>
                    </NuxtLink>
                </div>

                <nav class="text-black">
                    <h4 class="font-bold mt-8 ms-6">
                        CONTACT
                    </h4>
                    <ul class=" mt-8 flex flex-col space-y-5">
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row space-x-3"
                            >
                                <PhoneIcon class="h-4 w-4 text-primary" />
                                <p class="text-sm">045789101112</p>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row space-x-3"
                            >
                                <MapPinIcon class="h-4 w-4 text-primary" />
                                <p class="text-sm">92 7131 BELGIQUE</p>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row justify-start space-x-3"
                            >
                                <EnvelopeIcon class="h-4 w-4 text-primary" />
                                <p class="text-sm">INFO@infiswap.com</p>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row justify-start space-x-3"
                            >
                                <GlobeAltIcon class="h-4 w-4 text-primary" />
                                <p class="text-sm">WWW.infiswap.com</p>
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>

                <div class="bg-primary h-12 shadow-xl text-primary">
                    .
                </div>
            </SheetFooter>
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
    ArrowRightIcon,
} from '@heroicons/vue/24/solid';

import { AlignRightIcon } from 'lucide-vue-next';

const navigationItems = [
    { label: 'ACCUEIL', route: '/' },
    { label: 'A PROPOS', route: '/about' },
    { label: 'NOS SERVICES', route: '/services' },
    { label: 'ACTUALITES', route: '/news' },
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
