<template>
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div class="flex items-center justify-around h-16 px-1">
            <NuxtLink
                v-for="item in tabs"
                :key="item.route"
                :to="item.route"
                class="flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 relative min-w-0 px-1"
                :class="isActiveRoute(item.path) ? 'text-primary' : 'text-gray-500'"
            >
                <component
                    :is="isActiveRoute(item.path) ? item.iconSolid : item.iconOutline"
                    class="w-5 h-5 mb-0.5 flex-shrink-0"
                />
                <span class="text-[10px] font-medium leading-tight text-center truncate w-full">{{ item.label }}</span>
                <div
                    v-if="isActiveRoute(item.path)"
                    class="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-primary rounded-b-full"
                />
            </NuxtLink>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { Briefcase, Building2, Headphones as HeadphonesIcon, Home, Info, LayoutGrid, LogIn as LogInIcon, Sparkles } from 'lucide-vue-next';

const { isLoggedIn } = useAuth();
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const tabs = computed(() => {
    const baseTabs = [
        {
            label: t('nav.home'),
            path: '/',
            route: localePath('/'),
            iconOutline: Home,
            iconSolid: Home,
        },
        {
            label: t('nav.about'),
            path: '/about',
            route: localePath('/about'),
            iconOutline: Info,
            iconSolid: Info,
        },
        {
            label: t('nav.servicesTab'),
            path: '/services',
            route: localePath('/services'),
            iconOutline: Briefcase,
            iconSolid: Briefcase,
        },
        {
            label: t('nav.institutionTab'),
            path: '/offre-institution',
            route: localePath('/offre-institution'),
            iconOutline: Building2,
            iconSolid: Building2,
        },
        {
            label: t('nav.careerTab'),
            path: '/carriere',
            route: localePath('/carriere'),
            iconOutline: Sparkles,
            iconSolid: Sparkles,
        },
        {
            label: t('nav.contact'),
            path: '/contact',
            route: localePath('/contact'),
            iconOutline: HeadphonesIcon,
            iconSolid: HeadphonesIcon,
        },
    ];

    if (isLoggedIn.value) {
        baseTabs.push({
            label: t('nav.dashboardTab'),
            path: '/dashboard',
            route: localePath('/dashboard'),
            iconOutline: LayoutGrid,
            iconSolid: LayoutGrid,
        });
    }
    else {
        baseTabs.push({
            label: t('nav.login'),
            path: '/login',
            route: localePath('/login'),
            iconOutline: LogInIcon,
            iconSolid: LogInIcon,
        });
    }

    return baseTabs;
});

const isActiveRoute = (routePath: string) => {
    const localized = localePath(routePath);
    if (routePath === '/') {
        return route.path === localized || route.path === '/';
    }
    return route.path === localized || route.path.startsWith(`${localized}/`) || route.path.startsWith(routePath);
};
</script>

<style scoped>
.router-link-active {
    color: hsl(349 67% 54%);
}
</style>
