<template>
    <div
        :class="collapsed ? 'w-[3vw]' : 'w-[20vw]'"
        class="transition-all duration-300 bg-white h-screen flex flex-col"
    >
        <SidebarProvider>
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
                                <SidebarMenuItem
                                    v-for="(item, index) in navigationItems"
                                    :key="index"
                                >
                                    <SidebarMenuButton
                                        v-if="item.children && item.children.length > 0"
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
                                            <div v-if="item.count">
                                                <Badge>{{ item.count }}</Badge>
                                            </div>
                                        </NuxtLink>
                                    </SidebarMenuButton>
                                    
                                    <SidebarMenuButton
                                        v-else
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
                                            <div v-if="item.count">
                                                <Badge>{{ item.count }}</Badge>
                                            </div>
                                        </NuxtLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <!-- <SidebarGroup class="bg-gray-100 rounded-xl py-3 mt-4 mb-1">
                        <SidebarGroupContent
                            class="flex space-y-3 flex-col justify-center items-center mx-auto"
                        >
                            <div>
                                <NuxtImg
                                    src="/home/infirmier_homme.png"
                                    class="rounded-full h-12 w-12"
                                />
                            </div>
                            <p class="text-primary font-bold text-sm text-center">
                                Richard Dupont
                            </p>
                            <Button
                                class="text-white w-full"
                                href="/"
                            >
                                <PencilSquareIcon class="w-6" />
                                Editer
                            </Button>
                        </SidebarGroupContent>
                    </SidebarGroup> -->
                </SidebarContent>
            </Sidebar>

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
    PencilSquareIcon,
    IdentificationIcon,
} from '@heroicons/vue/24/outline';

import { Badge } from '@/components/ui/badge';

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
        label: 'Tournées',
        route: '/dashboard/tours',
        icon: MapIcon,
    },
    {
        label: 'Mes patients',
        route: '/dashboard/patient',
        icon: IdentificationIcon,
        children: [
            {
                label: 'Liste',
                route: '/dashboard/patient/list',
                icon: SquaresPlusIcon,
            },
            {
                label: 'Nouveau',
                route: '/dashboard/patient/new',
                icon: UserPlusIcon,
            },
        ],
    },
    {
        label: 'Remplacements',
        route: '/dashboard/replacement',
        icon: UserPlusIcon,
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
