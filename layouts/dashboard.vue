<template>
    <SidebarProvider>
        <Sidebar>
            <LayoutsAppSidebar />
        </Sidebar>
        <SidebarInset>
            <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div class="flex items-center gap-2 px-4">
                    <SidebarTrigger class="-ml-1" />
                    <Separator
                        orientation="vertical"
                        class="mr-2 h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem class="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Building Your Application
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator class="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
                <NuxtPage />
            </div>
        </SidebarInset>
    </SidebarProvider>
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
} from '@heroicons/vue/24/outline';

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
/* :deep(.sidebar-content) {
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
} */
</style>
