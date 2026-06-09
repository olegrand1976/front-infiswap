<template>
    <Sheet>
        <SheetTrigger
            as-child
            class="p-1 text-white rounded-full bg-primary"
        >
            <Bars4Icon class="inline-block text-primary w-7 h-7" />
        </SheetTrigger>
        <SheetContent
            overlay-class="bg-black/5"
            class="pt-16 bg-muted"
        >
            <div>
                <div
                    v-if="!isLoggedIn"
                    class="flex justify-between gap-4"
                >
                    <Button
                        class="z-20 inline-flex mx-auto ml-4 font-bold rounded-3xl"
                        href="/login"
                    >
                        Connexion
                    </Button>
                    <Button
                        class="z-20 inline-flex mx-auto ml-4 font-bold rounded-3xl"
                        href="/register"
                    >
                        Inscription
                    </Button>
                </div>
                <Button
                    v-if="isLoggedIn"
                    class="z-20 inline-flex mx-auto ml-4 w-44 rounded-3xl"
                    href="/dashboard"
                >
                    Tableau de bord
                </Button>
                <nav class="flex mt-8 ps-5">
                    <ul class="flex flex-col items-start text-sm space-y-9">
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

            <div class="absolute right-0 bottom-96">
                <LayoutsAppImage
                    src="stetho3.png"
                    alt="Stethoscope"
                    class="w-56 h-72"
                />
            </div>

            <div class="absolute bottom-96 right-1">
                <LayoutsAppImage
                    src="/icons/Unin.png"
                    alt="Stethoscope"
                    class="w-16 h-16"
                />
            </div>

            <div class="w-full h-12 mt-20 ml-5 shadow-xl bg-primary text-primary" />

            <div class="flex flex-col mb-8 ml-4">
                <div class="text-black">
                    <h4 class="mt-8 font-bold">
                        CONTACT
                    </h4>
                    <ul class="flex flex-col mt-8 space-y-5">
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row space-x-3"
                            >
                                <Phone class="w-4 h-4 text-primary" />
                                <p class="text-sm">0478.02.33.77</p>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row space-x-3"
                            >
                                <MapPin class="w-4 h-4 text-primary" />
                                <p class="text-sm">Rue de la Résistance, 92/A 7131 WAUDREZ</p>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row justify-start space-x-3"
                            >
                                <Mail class="w-4 h-4 text-primary" />
                                <p class="text-sm">info@infiswap.be</p>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink
                                to="/"
                                class="flex flex-row justify-start space-x-3"
                            >
                                <Globe class="w-4 h-4 text-primary" />
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
import { Globe, Mail, MapPin, Phone } from 'lucide-vue-next';

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
