<template>
    <div
        :class="collapsed ? 'w-[3vw]' : 'w-[20vw]'"
        class="transition-all duration-300 bg-white h-screen flex flex-col"
    >
        <SidebarProvider>
            <Collapsible
                default-open
                class="group/collapsible"
            >
                <Sidebar>
                    <SidebarContent class="p-2 flex flex-col h-full justify-between sidebar-content">
                        <SidebarGroup class="bg-gray-100 h-full rounded-xl pb-6">
                            <SidebarHeader class="flex flex-col mb-4 justify-center items-center">
                                <LayoutsLogo class="w-36" />
                            </SidebarHeader>

                            <SidebarGroupContent
                                class="mt-2 mx-auto"
                                :class="collapsed ? 'w-10' : 'xl:w-52 lg:w-44'"
                            >
                                <SidebarMenu>
                                    <section
                                        v-for="(item, index) in navigationItems"
                                        :key="index"
                                    >
                                        <SidebarMenuItem v-if="item?.children?.length > 0">
                                            <CollapsibleTrigger as-child>
                                                <SidebarMenuButton
                                                    class="h-12"
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
                                                            <ChevronRightIcon class="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                                        </div>
                                                    </NuxtLink>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub class="w-full">
                                                    <SidebarMenuSubItem
                                                        v-for="(subItem, subIndex) in item.children"
                                                        :key="subIndex"
                                                        class="hover:bg-gray-300"
                                                        :class="{
                                                            'bg-gray-300': isActiveRoute(subItem.route),
                                                        }"
                                                    >
                                                        <SidebarMenuButton class="w-full h-10">
                                                            <NuxtLink
                                                                :href="subItem.route"
                                                                class="flex"
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
                        <!-- <SidebarGroup class="py-3 mt-4 mb-1">
                            <SidebarGroupContent
                                class="flex space-y-3 flex-col justify-center text-center items-center mx-auto"
                            >
                                <p class="font-bold">
                                    Version test
                                </p>
                                <p>Données supprimées avant le lancement du 15/03/2025</p>
                            </SidebarGroupContent>
                        </SidebarGroup> -->
                    </SidebarContent>
                </Sidebar>
            </Collapsible>

            <SidebarInset>
                <Navbar sticky>
                    <Container class="flex h-12 items-center justify-between">
                        <SidebarTrigger
                            class="text-primary"
                            @click="emit('toggle-collapse')"
                        />
                    </Container>
                </Navbar>
            </SidebarInset>
        </SidebarProvider>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

import {
    SquaresPlusIcon,
    MapIcon,
    UserPlusIcon,
    FolderIcon,
    Cog8ToothIcon,
    ArrowPathIcon,
    UserGroupIcon,
    ChevronDownIcon,
    UserIcon,
    ChevronRightIcon,
    QueueListIcon,
    ListBulletIcon,
    DocumentPlusIcon, DocumentMagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';

import { Badge } from '@/components/ui/badge';
import { NuxtLink } from '#components';

defineProps({
    collapsed: Boolean,
});

const emit = defineEmits(['toggle-collapse']);

const navigationItems = [
    {
        label: 'Informations',
        route: '/dashboard',
        icon: SquaresPlusIcon,
    },
    {
        label: 'Mes patients',
        route: '/dashboard/patient',
        icon: UserGroupIcon,
    },
    {
        label: 'Tournées',
        route: '/dashboard/tours',
        icon: MapIcon,
    },
    {
        label: 'Remplacements',
        route: '/dashboard/replacement',
        icon: ArrowPathIcon,
        children: [
            {
                label: 'Listes',
                route: '/dashboard/replacement',
                icon: QueueListIcon,
            },
            {
                label: 'Rechercher',
                route: '/dashboard/replacement/search',
                icon: DocumentMagnifyingGlassIcon,
            },
            {
                label: 'Mes remplacements',
                route: '/dashboard/replacement/me',
                icon: ListBulletIcon,
            },
            {
                label: 'Nouveau',
                route: '/dashboard/replacement/create',
                icon: DocumentPlusIcon,
            },
        ],
    },
    {
        label: 'Documents',
        route: '/dashboard/document',
        icon: FolderIcon,
    },
    {
        label: 'Paramètres',
        route: '/dashboard/setting',
        icon: Cog8ToothIcon,
    },
];

const route = useRoute();
const isActiveRoute = (routePath: string) => route.path === routePath;
</script>

<style scoped>
:deep(.sidebar-content) {
    overflow-y: auto;
}

:deep(.sidebar-content::-webkit-scrollbar) {
    width: 6px;
}

:deep(.sidebar-content::-webkit-scrollbar-thumb) {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

:deep(.sidebar-content::-webkit-scrollbar-track) {
    background: transparent;
}

:deep(.sidebar-content::-webkit-scrollbar) {
    width: 0;
}

:deep(.sidebar-content:hover::-webkit-scrollbar) {
    width: 6px;
}
</style>
