<template>
    <Sheet>
        <SheetTrigger
            as-child
            class="bg-primary rounded-full text-white p-1"
        >
            <Bars4Icon class="inline-block text-primary w-7 h-7" />
        </SheetTrigger>
        <SheetContent
            overlay-class="bg-black/5"
            class="bg-muted pt-16"
        >
            <div>
                <div
                    v-if="!isLoggedIn"
                    class="flex justify-between gap-4"
                >
                    <Button
                        class="mx-auto inline-flex font-bold rounded-3xl ml-4 z-20"
                        href="/login"
                    >
                        Connexion
                    </Button>
                    <Button
                        class="mx-auto inline-flex font-bold rounded-3xl ml-4 z-20"
                        href="/register"
                    >
                        Inscription
                    </Button>
                </div>
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
                            class="text-center cursor-pointer"
                            :class="{
                                'text-primary font-semibold active-link': isActive(item.targetId),
                                'hover:text-primary/90 font-semibold text-dark animate duration-500': !isActive(item.targetId),
                            }"
                            @click="handleNavigation(item.targetId)"
                        >
                            {{ item.label }}
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
                                <p class="text-sm">+32 (0) 478.02.33.77</p>
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
                </div>
            </div>
        </SheetContent>
    </Sheet>
</template>

<script lang="ts" setup>
import {
    PhoneIcon,
    MapPinIcon,
    EnvelopeIcon,
    GlobeAltIcon,
} from '@heroicons/vue/24/outline';

import {
    Bars4Icon,
} from '@heroicons/vue/24/solid';

const { isLoggedIn } = useAuth();
const props = defineProps<{
    theme: string;
}>();

const menuData = computed(() => {
    if (props.theme === 'assur') {
        return {
            whoAreWe: 'overview',
            services: 'target',
            contact: 'quote',
        };
    }
    return {
        whoAreWe: 'banner',
        services: 'website-creation',
        contact: 'information-form',
    };
});

const navigationItems = [
    { label: 'Qui sommes-nous?', targetId: menuData.value.whoAreWe },
    ...(props.theme !== 'assur' ? [{ label: 'Nos Partenaires', targetId: 'partners' }] : []),
    { label: 'Services', targetId: menuData.value.services },
    { label: 'Contact', targetId: menuData.value.contact },
];

const activeSection = ref('');

const handleNavigation = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        activeSection.value = targetId;

        const handleScroll = () => {
            const rect = element.getBoundingClientRect();
            if (Math.abs(rect.top) < 10) {
                window.removeEventListener('scroll', handleScroll);
            }
            else {
                activeSection.value = targetId;
            }
        };

        window.addEventListener('scroll', handleScroll);
    }
};

const isActive = (targetId: string) => activeSection.value === targetId;

onMounted(() => {
    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting && entry.target.id) {
                activeSection.value = entry.target.id;
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50% 0px',
    });

    navigationItems.forEach((item) => {
        const element = document.getElementById(item.targetId);
        if (element) {
            observer.observe(element);
        }
    });
});
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
