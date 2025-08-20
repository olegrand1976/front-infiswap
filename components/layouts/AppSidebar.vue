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
                    class="mt-2 mx-auto h-full flex flex-col justify-between"
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

                    <div class="flex justify-between items-center mx-auto">
                        <CopyButton
                            variant="none"
                            label="Inviter vos collègues"
                            class="text-primary"
                            :show-label="true"
                            :content="`${config.public.FRONT_END_URL}/register/?referral=${user.referral_code}`"
                            success-message="Lien copié avec succès"
                        />

                        <QuestionMarkCircleIcon
                            class="w-4 text-blue-500 cursor-pointer"
                            @click="referralDialog = true"
                        />
                    </div>

                    <Dialog v-model:open="referralDialog">
                        <DialogContent class="max-w-xl">
                            <DialogHeader>
                                <DialogTitle class="text-primary">
                                    Inviter vos collègues
                                </DialogTitle>
                            </DialogHeader>
                            <p>
                                Vous êtes satisfait de notre plateforme ? <span class="font-semibold">Faites-en profiter vos collègues ! </span>Partagez votre code de parrainage avec d'autres personnes.
                            </p>

                            <div class="flex justify-between items-center mb-4">
                                <p class="mt-4">
                                    {{ `${config.public.FRONT_END_URL}/register/?referral=${user.referral_code}` }}
                                </p>

                                <CopyButton
                                    variant="none"
                                    class="text-primary mt-3"
                                    :show-label="false"
                                    :content="`${config.public.FRONT_END_URL}/register/?referral=${user.referral_code}`"
                                    success-message="Lien copié avec succès"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
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
    PlusIcon,
    DocumentMagnifyingGlassIcon,
    MagnifyingGlassIcon,
    UsersIcon,
    Cog8ToothIcon,
    HeartIcon,
    WrenchScrewdriverIcon,
    ChatBubbleLeftEllipsisIcon,
    ShieldCheckIcon,
    InboxIcon,
    QuestionMarkCircleIcon,
    PlayCircleIcon,
    ShoppingBagIcon,
} from '@heroicons/vue/24/outline';
import { StarIcon } from '@heroicons/vue/24/solid';
import type { FunctionalComponent } from 'vue';
import QuickReplacementIcon from '../icons/QuickReplacementIcon.vue';
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import { useRuntimeConfig } from '#app';

defineProps({
    collapsed: Boolean,
});

const { logout, isCollaborator } = useAuth();
const config = useRuntimeConfig();
const user = useUser();
const { isAdmin } = useAuth();
const { setOpenMobile, isMobile } = useSidebar();
const referralDialog = ref(false);
const closeSidebar = () => {
    if (isMobile.value) {
        setOpenMobile(false);
    }
};
interface NavigationItem {
    label: string;
    route: string;
    icon: Component | FunctionalComponent | VNode;
    isActive?: boolean;
    children?: NavigationItem[];
    visible?: boolean;
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
        label: 'Demander un(e) remplaçant(e)',
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
    {
        label: 'Binômes',
        route: '/dashboard/partners',
        icon: UserGroupIcon,
        children: [
            {
                label: 'Rechercher',
                route: '/dashboard/partners',
                icon: MagnifyingGlassIcon,
            },
            {
                label: 'Demander',
                route: '/dashboard/partners/create',
                icon: PlusIcon,
            },
            {
                label: 'Réponses',
                route: '/dashboard/partners/responses',
                icon: ChatBubbleLeftEllipsisIcon,
            },
        ],
    },
    {
        label: 'Mon groupement',
        route: '/dashboard/group',
        icon: UserGroupIcon,
    },
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
        visible: true,
    },
    {
        label: 'Remplacements',
        route: '/dashboard/admin/replacements',
        icon: ArrowPathIcon,
        visible: !isCollaborator.value,
    },
    {
        label: 'Intérêt pour remplacement',
        route: '/dashboard/admin/replacements/interest',
        icon: ListBulletIcon,
        visible: !isCollaborator.value,
    },
    {
        label: 'Utilisateurs',
        route: '/dashboard/admin/users',
        icon: UserGroupIcon,
        visible: !isCollaborator.value,
    },
    {
        label: 'Accueil',
        route: '/dashboard/admin/home-management',
        icon: WrenchScrewdriverIcon,
        visible: true,
    },
    {
        label: 'Patients',
        route: '/dashboard/admin/patients',
        icon: HeartIcon,
        visible: !isCollaborator.value,
    },
    {
        label: 'CRM',
        route: '/dashboard/admin/users/crm',
        icon: UsersIcon,
        visible: true,
    },
    {
        label: 'Type de soins',
        route: '/dashboard/admin/care-types',
        icon: ShieldCheckIcon,
        visible: !isCollaborator.value,
    },
    {
        label: 'Contacts',
        route: '/dashboard/admin/contacts',
        icon: InboxIcon,
        visible: !isCollaborator.value,
    },
    {
        label: 'Tutoriels',
        route: '/dashboard/admin/tutorials',
        icon: PlayCircleIcon,
        visible: !isCollaborator.value,
    },
    {
        label: 'Groupement',
        route: '/dashboard/admin/groups',
        icon: UserGroupIcon,
        visible: !isCollaborator.value,

    },
    {
        label: 'Produits',
        route: '/dashboard/admin/products',
        icon: ShoppingBagIcon,
        visible: true,
    },
];

const role = computed(() => {
    if (isAdmin.value) return 'admin';
    if (isCollaborator.value) return 'collaborator';
    return 'nurse';
});

const navigationItems = computed(() => {
    switch (role.value) {
        case 'admin':
        case 'collaborator':
            return adminNavigationItems.filter(i => i.visible);
        default:
            return nurseNavigationItems;
    }
});

const route = useRoute();
const isActiveRoute = (routePath: string) => route.path === routePath;
</script>
