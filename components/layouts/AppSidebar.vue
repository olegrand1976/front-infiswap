<template>
    <Sidebar>
        <SidebarContent class="p-2 bg-white flex flex-col h-full justify-between sidebar-content">
            <SidebarGroup class="bg-gray-100 h-full rounded-xl pb-6">
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
                                            >
                                                <SidebarMenuButton class="w-full h-full p-0">
                                                    <NuxtLink
                                                        :href="subItem.route"
                                                        class="flex items-center h-full w-full p-2"
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
                            <SidebarMenuItem v-else>
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
            <SidebarGroup>
                <SidebarMenuButton class="bg-primary text-white">
                    <Button
                        class="w-full flex space-x-2 items-center justify-center"
                        @click="logout"
                    >
                        <PowerIcon class="w-6 opacity-80" />
                        <span>Déconnexion</span>
                    </Button>
                </SidebarMenuButton>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import {
    SquaresPlusIcon,
    MapIcon,
    FolderIcon,
    Cog8ToothIcon,
    ArrowPathIcon,
    UserGroupIcon,
    ChevronRightIcon,
    QueueListIcon,
    ListBulletIcon,
    DocumentPlusIcon, DocumentMagnifyingGlassIcon,
    UserPlusIcon,
    ClipboardDocumentListIcon,
    PowerIcon,
} from '@heroicons/vue/24/outline';

defineProps({
    collapsed: Boolean,
});

const navigationItems = [
    {
        label: 'Informations',
        route: '/dashboard',
        icon: SquaresPlusIcon,
    },
    {
        label: 'Mes patients',
        route: '/dashboard/patients',
        icon: UserGroupIcon,
        isActive: true,
        children: [
            {
                label: 'Listes',
                route: '/dashboard/patients',
                icon: ClipboardDocumentListIcon,
            },
            {
                label: 'Nouveau',
                route: '/dashboard/patients/create',
                icon: UserPlusIcon,
            },
        ],
    },
    {
        label: 'Tournées',
        route: '/dashboard/tours',
        icon: MapIcon,
    },
    {
        label: 'Remplacements',
        route: '/dashboard/replacements',
        icon: ArrowPathIcon,
        children: [
            {
                label: 'Listes',
                route: '/dashboard/replacements',
                icon: QueueListIcon,
            },
            {
                label: 'Rechercher',
                route: '/dashboard/replacements/search',
                icon: DocumentMagnifyingGlassIcon,
            },
            {
                label: 'Mes remplacements',
                route: '/dashboard/replacements/me',
                icon: ListBulletIcon,
            },
            {
                label: 'Nouveau',
                route: '/dashboard/replacements/create',
                icon: DocumentPlusIcon,
            },
        ],
    },
    // {
    //     label: 'Documents',
    //     route: '/dashboard/documents',
    //     icon: FolderIcon,
    // },
    {
        label: 'Paramètres',
        route: '/dashboard/settings',
        icon: Cog8ToothIcon,
    },
];

const route = useRoute();
const isActiveRoute = (routePath: string) => route.path === routePath;

const { logout } = useAuth();
</script>
