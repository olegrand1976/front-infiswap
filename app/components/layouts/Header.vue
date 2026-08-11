<template>
    <header class="bg-muted sm:fixed sm:z-50 w-full sm:h-18 sm:block lg:flex lg:justify-center items-center lg:py-5">
        <div class="hidden lg:flex justify-between items-center container">
            <div>
                <LayoutsLogo class="h-10 lg:h-12" />
            </div>

            <nav
                :ref="(el) => { mainNav.state.containerEl = (el as HTMLElement) ?? null; }"
                class="relative flex pb-2"
                @mouseleave="mainNav.resetTo('.active-link')"
            >
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
                        <NuxtLink
                            :to="localePath(item.route)"
                            @mouseenter="mainNav.onHover"
                        >
                            {{ item.label }}
                        </NuxtLink>
                    </li>
                </ul>
                <span
                    class="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-primary transition-[left,width,opacity] duration-300 ease-out"
                    :style="{ left: mainNav.state.left, width: mainNav.state.width, opacity: mainNav.state.opacity }"
                />
            </nav>

            <div class="flex gap-4 mb-2.5 items-center">
                <LayoutsDropdownLang />
                <nav
                    v-if="!isLoggedIn"
                    :ref="(el) => { authNav.state.containerEl = (el as HTMLElement) ?? null; }"
                    class="relative flex gap-4"
                    @mouseleave="authNav.resetTo(null)"
                >
                    <NuxtLink
                        :to="localePath('/login')"
                        class="flex items-center gap-1.5 text-sm font-semibold text-dark hover:text-primary/90"
                        @mouseenter="authNav.onHover"
                    >
                        <LogIn class="size-4" />
                        {{ t('nav.login') }}
                    </NuxtLink>
                    <NuxtLink
                        :to="localePath('/register')"
                        class="flex items-center gap-1.5 text-sm font-semibold text-dark hover:text-primary/90"
                        @mouseenter="authNav.onHover"
                    >
                        <UserPlus class="size-4" />
                        {{ t('nav.register') }}
                    </NuxtLink>
                    <span
                        class="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-primary transition-[left,width,opacity] duration-300 ease-out"
                        :style="{ left: authNav.state.left, width: authNav.state.width, opacity: authNav.state.opacity }"
                    />
                </nav>
                <NuxtLink
                    v-if="isLoggedIn"
                    :to="localePath('/dashboard')"
                    class="group flex items-center gap-2"
                >
                    <span class="flex items-center gap-1.5 text-sm font-semibold text-primary">
                        <LayoutGrid class="size-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
                        <span class="relative">
                            {{ t('nav.dashboard') }}
                            <span class="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-200 ease-out group-hover:scale-x-100" />
                        </span>
                    </span>
                    <span class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-bold text-white">
                        <img
                            v-if="user?.profile?.profil_url"
                            :src="useRuntimeConfig().public.API_URL + '/storage/' + user.profile.profil_url"
                            class="size-10 object-cover"
                            alt=""
                        >
                        <template v-else>
                            {{ userInitials }}
                        </template>
                    </span>
                </NuxtLink>
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
import { LayoutGrid, LogIn, UserPlus } from 'lucide-vue-next';
import { useRuntimeConfig } from '#app';

const { isLoggedIn, user } = useAuth();
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

function useSlidingUnderline() {
    const state = reactive({
        containerEl: null as HTMLElement | null,
        left: '0px',
        width: '0px',
        opacity: 0,
    });

    function moveTo(target: HTMLElement | null) {
        if (!state.containerEl || !target) {
            state.opacity = 0;
            return;
        }
        const containerRect = state.containerEl.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        state.left = `${targetRect.left - containerRect.left}px`;
        state.width = `${targetRect.width}px`;
        state.opacity = 1;
    }

    function onHover(event: MouseEvent) {
        moveTo(event.currentTarget as HTMLElement);
    }

    function resetTo(selector: string | null) {
        nextTick(() => {
            const activeEl = selector
                ? (state.containerEl?.querySelector(selector) as HTMLElement | null)
                : null;
            moveTo(activeEl);
        });
    }

    return { state, onHover, resetTo };
}

const mainNav = useSlidingUnderline();
const authNav = useSlidingUnderline();

onMounted(() => {
    mainNav.resetTo('.active-link');
});

watch(() => route.path, () => {
    mainNav.resetTo('.active-link');
});

const userInitials = computed(() => {
    const fullName = user.value?.full_name?.trim();
    if (!fullName) return '';
    return fullName
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join('');
});

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
