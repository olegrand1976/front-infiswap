<template>
    <section
        class="fixed top-0 w-full z-50 h-10 text-white flex items-center"
        :class="bgClass"
    >
        <div class="container mx-auto flex justify-between text-sm items-center px-4">
            <p class="flex items-center gap-2">
                <MapPinIcon class="w-5 h-5" />
                Rue de la Résistance, 92/A 7131 Waudrez Belgium
            </p>
            <p class="flex items-center gap-2">
                <EnvelopeIcon class="w-5 h-5" />
                infiswap.be
            </p>
        </div>
    </section>
    <header class="bg-white fixed top-10 w-full z-40 h-20 hidden sm:flex justify-center items-center shadow">
        <div class="hidden lg:flex justify-between items-center container">
            <div>
                <LayoutsAppImage
                    :src="imgData.src"
                    :alt="imgData.alt"
                    class="h-10 lg:h-14"
                />
            </div>

            <nav class="flex">
                <ul class="flex gap-4 lg:text-sm md:text-[0.7em]">
                    <li
                        v-for="(item, index) in navigationNurseItems"
                        :key="index"
                        class="text-center cursor-pointer"
                        :class="{
                            'text-primary font-semibold active-link': isActive(item.targetId),
                            'hover:text-primary font-semibold text-dark animate duration-500': !isActive(item.targetId),
                        }"
                        @click="handleNavigation(item.targetId)"
                    >
                        {{ item.label }}
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
                        <LayoutsNurseSheetMenu :theme="theme" />
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

const props = defineProps<{
    theme: string;
}>();

const bgClass = computed(() =>
    props.theme === 'assur' ? 'bg-primaryassur' : 'bg-primarytech',
);

const imgData = computed(() => {
    if (props.theme === 'assur') {
        return {
            src: '/nurs_assur.png',
            alt: 'NurseAssur',
        };
    }
    return {
        src: '/nurs_tech.png',
        alt: 'NurseTech',
    };
});

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

const { isLoggedIn } = useAuth();

const navigationNurseItems = [
    { label: 'Qui sommes-nous?', targetId: menuData.value.whoAreWe },
    ...(props.theme !== 'assur' ? [{ label: 'Nos Partenaires', targetId: 'partners' }] : []),
    { label: 'Services', targetId: menuData.value.services },
    { label: 'Contact', targetId: menuData.value.contact },
];

const route = useRoute();
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

    navigationNurseItems.forEach((item) => {
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
