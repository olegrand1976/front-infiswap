<template>
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div class="flex items-center justify-around h-16 px-1">
            <NuxtLink
                v-for="item in tabs"
                :key="item.route"
                :to="item.route"
                class="flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 relative min-w-0 px-1"
                :class="isActiveRoute(item.route) ? 'text-primary' : 'text-gray-500'"
            >
                <component
                    :is="isActiveRoute(item.route) ? item.iconSolid : item.iconOutline"
                    class="w-5 h-5 mb-0.5 flex-shrink-0"
                />
                <span class="text-[10px] font-medium leading-tight text-center truncate w-full">{{ item.label }}</span>
                <div
                    v-if="isActiveRoute(item.route)"
                    class="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-primary rounded-b-full"
                />
            </NuxtLink>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import { Briefcase, Headphones as HeadphonesIcon, Home, Info, LayoutGrid, LogIn as LogInIcon } from 'lucide-vue-next';

const { isLoggedIn } = useAuth();
const route = useRoute();

const tabs = computed(() => {
    const baseTabs = [
        {
            label: 'Accueil',
            route: '/',
            iconOutline: Home,
            iconSolid: Home,
        },
        {
            label: 'À propos',
            route: '/about',
            iconOutline: Info,
            iconSolid: Info,
        },
        {
            label: 'Services',
            route: '/services',
            iconOutline: Briefcase,
            iconSolid: Briefcase,
        },
        {
            label: 'Contact',
            route: '/contact',
            iconOutline: HeadphonesIcon,
            iconSolid: HeadphonesIcon,
        },
    ];

    if (isLoggedIn.value) {
        baseTabs.push({
            label: 'Dashboard',
            route: '/dashboard',
            iconOutline: LayoutGrid,
            iconSolid: LayoutGrid,
        });
    }
    else {
        baseTabs.push({
            label: 'Connexion',
            route: '/login',
            iconOutline: LogInIcon,
            iconSolid: LogInIcon,
        });
    }

    return baseTabs;
});

const isActiveRoute = (routePath: string) => {
    if (routePath === '/') {
        return route.path === '/';
    }
    return route.path.startsWith(routePath);
};
</script>

<style scoped>
.router-link-active {
    color: hsl(349 67% 54%);
}
</style>
