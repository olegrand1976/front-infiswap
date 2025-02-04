<template>
    <div
        :class="collapsed ? 'w-[5vw]' : 'w-[20vw]'"
        class="transition-all duration-300 bg-white h-screen flex flex-col"
    >
        <SidebarProvider>
            <Sidebar>
                <SidebarContent class="p-2 flex flex-col h-full justify-between sidebar-content">
                    <SidebarGroup class="bg-gray-100 rounded-xl pb-6">
                        <SidebarHeader class="flex flex-col justify-center items-center">
                            <h2 class="text-primary font-bold text-center">
                                Mon compte
                            </h2>
                            <LayoutsLogo class="w-36 h-10" />
                        </SidebarHeader>

                        <SidebarGroupContent
                            class="mt-2 mx-auto"
                            :class="collapsed ? 'w-10' : 'w-52'"
                        >
                            <SidebarMenu>
                                <SidebarMenuItem
                                    v-for="item in navigationItems"
                                    :key="item.label"
                                >
                                    <SidebarMenuButton
                                        as-child
                                        class="h-12"
                                    >
                                        <NuxtLink
                                            :href="item.route"
                                            class="w-full flex justify-between items-center p-3 rounded-lg"
                                            :class="{
                                                'bg-primary text-white': isActiveRoute(item.route),
                                                'bg-gray-200 text-neutral-700': !isActiveRoute(item.route),
                                            }"
                                        >
                                            <div class="flex space-x-2 items-center">
                                                <component
                                                    :is="item.icon"
                                                    class="w-6 h-6 opacity-80"
                                                />
                                                <span class="text-xs">{{ item.label }}</span>
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

                    <SidebarGroup class="bg-gray-100 rounded-xl py-3 mt-4 mb-1">
                        <SidebarGroupContent
                            class="mt-2 w-52 flex space-x-1 justify-center items-center mx-auto"
                        >
                            <div class="flex justify-center items-center w-40">
                                <NuxtImg
                                    src="/home/infirmier_homme.png"
                                    class="rounded-full h-12 w-12"
                                />
                            </div>
                            <p class="text-primary font-bold text-sm text-center">
                                Richard Dupont
                            </p>
                            <Button
                                variant="secondary"
                                class="text-xs text-black/70"
                                href="/"
                            >
                                <PencilSquareIcon class="w-6 h-6" />
                                Editer
                            </Button>
                        </SidebarGroupContent>
                    </SidebarGroup>
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
    UserCircleIcon,
    EnvelopeIcon,
    BellAlertIcon,
    MapIcon,
    UserGroupIcon,
    IdentificationIcon,
    UserPlusIcon,
    ClipboardDocumentIcon,
    AcademicCapIcon,
    FolderIcon,
    Cog8ToothIcon,
    PencilSquareIcon,
} from '@heroicons/vue/24/solid';

import { Badge } from '@/components/ui/badge';

defineProps({
    collapsed: Boolean,
});

const emit = defineEmits(['toggle-collapse']);

const navigationItems = [
    {
        label: 'Information',
        route: '/dashboard/home',
        icon: UserCircleIcon,
    },
    {
        label: 'Messages',
        route: '/',
        count: 13,
        icon: EnvelopeIcon,
    },
    {
        label: 'Notifications',
        route: '/',
        count: 3,
        icon: BellAlertIcon,
    },
    {
        label: 'Tournées',
        route: '/',
        icon: MapIcon,
    },
    {
        label: 'Groupes',
        route: '/',
        count: 1,
        icon: UserGroupIcon,
    },
    {
        label: 'Liste des membres',
        route: '/',
        icon: IdentificationIcon,
    },
    {
        label: 'Remplacement',
        route: '/dashboard/replacement',
        icon: UserPlusIcon,
    },
    {
        label: 'Planning',
        route: '/',
        icon: ClipboardDocumentIcon,
    },
    {
        label: 'Formations',
        route: '/',
        icon: AcademicCapIcon,
    },
    {
        label: 'Documents',
        route: '/',
        icon: FolderIcon,
    },
    {
        label: 'Profil',
        route: '/',
        icon: UserCircleIcon,
    },
    {
        label: 'Paramètres',
        route: '/',
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
