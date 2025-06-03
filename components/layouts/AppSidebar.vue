<template>
    <Sidebar>
        <SidebarContent class="p-2 bg-white flex flex-col h-full justify-between sidebar-content min-w-[260px] w-[260px]">
            <SidebarGroup
                :class="cn('h-full rounded-xl pb-6', {
                    'bg-white': isAdmin,
                    'bg-gray-100': !isAdmin,
                })"
            >
                <SidebarHeader class="flex flex-col mb-4 justify-center items-center">
                    <LayoutsLogo class="w-36" />
                </SidebarHeader>

                <SidebarGroupContent
                    class="mt-2 mx-auto"
                    :class="collapsed ? 'w-10' : 'lg:w-44 xl:w-52'"
                >
                    <SidebarMenu>
                        <section
                            v-for="(item, index) in navigationItems"
                            :key="index"
                        >
                            <SidebarMenuItem v-if="item?.children?.length > 0">
                                <Collapsible class="group/collapsible transition-all duration-500">
                                    <CollapsibleTrigger as-child>
                                        <SidebarMenuButton
                                            class="h-12 w-full"
                                            :class="{
                                                'bg-primary text-white font-bold': route.path.startsWith(item.route),
                                                'bg-gray-200 text-neutral-700 hover:bg-primary/20': !route.path.startsWith(item.route),
                                            }"
                                        >
                                            <NuxtLink
                                                :href="item.route"
                                                class="w-full flex items-center justify-between"
                                            >
                                                <div class="flex space-x-2 items-center">
                                                    <component
                                                        :is="item.icon"
                                                        class="w-6 opacity-80"
                                                    />
                                                    <span>{{ item.label }}</span>
                                                </div>
                                                <div>
                                                    <ChevronRightIcon
                                                        class="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
                                                    />
                                                </div>
                                            </NuxtLink>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub class="w-full">
                                            <SidebarMenuSubItem
                                                v-for="(subItem, subIndex) in item.children"
                                                :key="subIndex"
                                                class="h-10 rounded w-full"
                                                :class="{
                                                    'bg-primary/90 text-white': isActiveRoute(subItem.route),
                                                    'text-neutral-700 hover:bg-primary/20': !isActiveRoute(subItem.route),
                                                }"
                                                :onclick="closeSidebar"
                                            >
                                                <SidebarMenuButton class="w-full h-full p-0">
                                                    <NuxtLink
                                                        :href="subItem.route"
                                                        class="flex items-center h-full w-full p-2"
                                                        onclick="clicked"
                                                    >
                                                        <component
                                                            :is="subItem.icon"
                                                            class="w-4 mr-2 opacity-80"
                                                        />

                                                        <span>
                                                            {{ subItem.label }}
                                                        </span>
                                                    </NuxtLink>
                                                </SidebarMenuButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                            <SidebarMenuItem
                                v-else
                                :onclick="closeSidebar"
                            >
                                <SidebarMenuButton
                                    as-child
                                    class="h-12"
                                >
                                    <NuxtLink
                                        :href="item.route"
                                        class="w-full flex justify-between items-center p-3 rounded-lg transition-all duration-75"
                                        :class="{
                                            'bg-primary text-white font-bold': isActiveRoute(item.route),
                                            'bg-gray-200 text-neutral-700 hover:bg-primary/20': !isActiveRoute(item.route),
                                        }"
                                    >
                                        <div class="flex space-x-2 items-center">
                                            <component
                                                :is="item.icon"
                                                class="w-6 opacity-80"
                                            />
                                            <span>{{ item.label }}</span>
                                        </div>
                                    </NuxtLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </section>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup class="hover:cursor-pointer">
                <NuxtLink
                    to="https://g.page/r/Cf8HfnS8YUz2EAE/review"
                    target="_blanl"
                    class="text-center flex flex-col gap-1"
                >
                    <div class="flex justify-center text-yellow-400">
                        <StarIcon class="h-5" />
                        <StarIcon class="h-5" />
                        <StarIcon class="h-5" />
                        <StarIcon class="h-5" />
                        <StarIcon class="h-5" />
                    </div>
                    <p class="text-sm font-bold">Évaluez-nous sur</p>
                    <LayoutsAppImage
                        src="/google-brand-color.svg"
                        class="w-32 mx-auto"
                    />
                </NuxtLink>
            </SidebarGroup>
            <SidebarGroup>
                <Button
                    class="w-full rounded flex space-x-2 items-center justify-arround"
                    @click="logout"
                >
                    <PowerIcon class="w-6 opacity-80" />
                    <span>Déconnexion</span>
                </Button>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import {
    SquaresPlusIcon,
    ArrowPathIcon,
    UserGroupIcon,
    ChevronRightIcon,
    ListBulletIcon,
    PowerIcon,
    DocumentMagnifyingGlassIcon,
    UsersIcon,
    Cog8ToothIcon,
    HeartIcon,
} from '@heroicons/vue/24/outline';
import { StarIcon } from '@heroicons/vue/24/solid';
import type { FunctionalComponent } from 'vue';
import QuickReplacementIcon from '../icons/QuickReplacementIcon.vue';
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';

defineProps({
    collapsed: Boolean,
});

const { isAdmin } = useAuth();
const { setOpenMobile, isMobile } = useSidebar();
const closeSidebar = () => {
    if (isMobile.value) {
        setOpenMobile(false);
    }
};
interface NavigationItem {
    label: string;
    route: string;
    icon: FunctionalComponent;
    isActive?: boolean;
    children?: NavigationItem[];
}

const nurseNavigationItems: NavigationItem[] = [
    {
        label: 'Informations',
        route: '/dashboard',
        icon: SquaresPlusIcon,
    },
    {
        label: 'Remplacement rapide',
        route: '/dashboard/replacements/immediate',
        icon: QuickReplacementIcon,
    },
    {
        label: 'Proposer un remplacement',
        route: '/dashboard/replacements/create',
        icon: ArrowPathIcon,
    },
    {
        label: 'Mes remplacements',
        route: '/dashboard/replacements/me',
        icon: ListBulletIcon,
    },
    {
        label: 'Chercher un remplacement',
        route: '/dashboard/replacements',
        icon: DocumentMagnifyingGlassIcon,
    },
    {
        label: 'Mes réponses reçues',
        route: '/dashboard/replacements/responses',
        icon: UsersIcon,
    },
    // {
    //     label: 'Mes patients',
    //     route: '/dashboard/patients',
    //     icon: UserGroupIcon,
    //     children: [
    //         {
    //             label: 'Listes',
    //             route: '/dashboard/patients',
    //             icon: ClipboardDocumentListIcon,
    //         },
    //         {
    //             label: 'Nouveau',
    //             route: '/dashboard/patients/create',
    //             icon: UserPlusIcon,
    //         },
    //         // {
    //         //     label: 'De ma région',
    //         //     route: '/dashboard/patients/myregion',
    //         //     icon: MapPinIcon,
    //         // },
    //     ],
    // },
    // {
    //     label: 'Tournées',
    //     route: '/dashboard/tours',
    //     icon: MapIcon,
    // },
    {
        label: 'Paramètres',
        route: '/dashboard/settings',
        icon: Cog8ToothIcon,
    },
];

const adminNavigationItems: NavigationItem[] = [
    {
        label: 'Tableau de bord',
        route: '/dashboard/admin',
        icon: SquaresPlusIcon,
    },
    {
        label: 'Remplacements',
        route: '/dashboard/admin/replacements',
        icon: ArrowPathIcon,
    },
    {
        label: 'Utilisateurs',
        route: '/dashboard/admin/users',
        icon: UserGroupIcon,
    },
    {
        label: 'Patients',
        route: '/dashboard/admin/patients',
        icon: HeartIcon,
    },
];

const navigationItems = computed(() => {
    return isAdmin.value ? adminNavigationItems : nurseNavigationItems;
});

const route = useRoute();
const isActiveRoute = (routePath: string) => route.path === routePath;

const { logout } = useAuth();
</script>
