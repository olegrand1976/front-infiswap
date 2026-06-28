<template>
    <Sidebar
        collapsible="offcanvas"
        class="bg-white"
    >
        <SidebarHeader class="flex flex-col items-center justify-center px-2 pb-2 pt-4">
            <LayoutsLogo class="w-36" />
        </SidebarHeader>

        <SidebarContent
            class="sidebar-content flex flex-col gap-4 bg-white p-2"
        >
            <SidebarGroup
                :class="
                    cn('rounded-xl pb-4', {
                        'bg-white': isAdmin,
                        'bg-gray-100': !isAdmin,
                    })
                "
            >
                <SidebarGroupContent class="mx-auto mt-2 flex flex-col gap-2 lg:w-44 xl:w-52">
                    <SidebarMenu>
                        <SidebarMenuItem
                            v-for="item in navigationItems"
                            :key="item.route"
                        >
                            <Collapsible
                                v-if="item.children?.length"
                                :default-open="isGroupActive(item)"
                                class="group/collapsible"
                            >
                                <CollapsibleTrigger as-child>
                                    <SidebarMenuButton
                                        class="h-12"
                                        :is-active="isGroupActive(item)"
                                        :class="menuButtonClass(isGroupActive(item))"
                                    >
                                        <component
                                            :is="item.icon"
                                            class="size-5 opacity-80"
                                        />
                                        <span>{{ item.label }}</span>
                                        <ChevronRight
                                            class="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
                                        />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem
                                            v-for="subItem in item.children"
                                            :key="subItem.route"
                                        >
                                            <SidebarMenuSubButton
                                                as-child
                                                :is-active="isActiveRoute(subItem.route)"
                                                :class="subMenuButtonClass(isActiveRoute(subItem.route))"
                                            >
                                                <NuxtLink
                                                    :to="subItem.route"
                                                    class="flex h-10 w-full items-center rounded px-2"
                                                    @click="closeSidebar"
                                                >
                                                    <component
                                                        :is="subItem.icon"
                                                        class="mr-2 size-4 opacity-80"
                                                    />
                                                    <span>{{ subItem.label }}</span>
                                                </NuxtLink>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </Collapsible>

                            <SidebarMenuButton
                                v-else
                                as-child
                                class="h-12"
                                :is-active="isActiveRoute(item.route)"
                                :class="menuButtonClass(isActiveRoute(item.route))"
                            >
                                <NuxtLink
                                    :to="item.route"
                                    class="flex w-full items-center justify-between rounded-lg p-3"
                                    :target="item.external ? '_blank' : undefined"
                                    @click="closeSidebar"
                                >
                                    <div class="flex items-center gap-2">
                                        <component
                                            :is="item.icon"
                                            class="size-5 opacity-80"
                                        />
                                        <span>{{ item.label }}</span>
                                    </div>
                                    <Badge
                                        v-if="item.route === '/dashboard/admin/contacts'"
                                        class="ml-2 bg-primary text-white"
                                    >
                                        5
                                    </Badge>
                                </NuxtLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter class="gap-4 border-t border-sidebar-border bg-white p-2">
            <div
                v-if="user.type != 'institution'"
                class="mx-auto flex items-center justify-between"
            >
                <CopyButton
                    variant="none"
                    label="Inviter vos collègues"
                    class="text-primary"
                    :show-label="true"
                    :content="`${config.public.FRONT_END_URL}/register/?referral=${user.referral_code}`"
                    success-message="Lien copié avec succès"
                />
                <CircleHelp
                    class="size-4 cursor-pointer text-blue-500"
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
                        Vous êtes satisfait de notre plateforme ?
                        <span class="font-semibold">Faites-en profiter vos collègues ! </span>Partagez votre code de parrainage avec d'autres personnes.
                    </p>
                    <div class="mb-4 flex items-center justify-between">
                        <p class="mt-4">
                            {{ `${config.public.FRONT_END_URL}/register/?referral=${user.referral_code}` }}
                        </p>
                        <CopyButton
                            variant="none"
                            class="mt-3 text-primary"
                            :show-label="false"
                            :content="`${config.public.FRONT_END_URL}/register/?referral=${user.referral_code}`"
                            success-message="Lien copié avec succès"
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <NuxtLink
                to="https://g.page/r/Cf8HfnS8YUz2EAE/review"
                target="_blank"
                class="flex flex-col gap-1 text-center"
            >
                <div class="flex justify-center text-yellow-400">
                    <Star
                        v-for="i in 5"
                        :key="i"
                        class="size-5"
                    />
                </div>
                <p class="text-sm font-bold">Évaluez-nous sur</p>
                <LayoutsAppImage
                    src="/google-brand.svg"
                    class="mx-auto w-32"
                />
            </NuxtLink>

            <Button
                class="mt-2 flex w-full items-center justify-center gap-2 rounded"
                @click="logout"
            >
                <Power class="size-5 opacity-80" />
                <span>Déconnexion</span>
            </Button>
        </SidebarFooter>
    </Sidebar>
</template>

<script lang="ts" setup>
import { BarChart3, Briefcase, ChevronRight, CircleHelp, CirclePlay, CircleUser, ClipboardList, Cog, Euro, FileSearch, FileText, Inbox, LayoutGrid, Link, List, Mail, MessageSquare, Plus, Power, RefreshCw, Search, ShieldAlert, ShieldCheck, ShoppingBag, Sparkles, Star, UserCheck, Users, UserSearch, Wrench } from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';
import QuickReplacementIcon from '../icons/QuickReplacementIcon.vue';
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import { useRuntimeConfig } from '#app';
import { PERPAGE } from '~/lib/constants';

const {
    isSuperAdmin,
    isAdmin,
    isManager,
    isCollaborator,
    isCommunityManager,
    isSaleRepresentative,
    isMedical,
    isInstitution,
    isInstitutionAdmin,
    logout,
} = useAuth();
const config = useRuntimeConfig();
const user = useUser();
const { setOpenMobile, isMobile } = useSidebar();
const referralDialog = ref(false);

const closeSidebar = () => {
    if (isMobile.value) {
        setOpenMobile(false);
    }
};

const menuButtonClass = (active: boolean) =>
    active
        ? 'bg-primary text-white font-bold hover:bg-primary hover:text-white'
        : 'bg-gray-200 text-neutral-700 hover:bg-primary/20';

const subMenuButtonClass = (active: boolean) =>
    active
        ? 'bg-primary/90 text-white hover:bg-primary/90 hover:text-white'
        : 'text-neutral-700 hover:bg-primary/20';

const perPage = ref(PERPAGE);
const page = ref(1);
const { products, getProducts } = useProduct();

if (!isInstitution.value) {
    await getProducts(page.value, perPage.value);
}

interface NavigationItem {
    label: string;
    route: string;
    icon: Component | FunctionalComponent | VNode;
    children?: NavigationItem[];
    visible?: boolean;
    external?: boolean;
}

const contactChildren = computed<NavigationItem[]>(() => [
    {
        label: 'Infiswap',
        route: '/dashboard/admin/contacts/infiswap',
        icon: Inbox,
    },
    ...products.value.map(p => ({
        label: p.name,
        route: `/dashboard/admin/contacts/${p.name.toLowerCase()}`,
        icon: Inbox,
    })),
]);

const crmChildren = computed<NavigationItem[]>(() => [
    {
        label: 'Suivi commercial',
        route: '/dashboard/admin/users/crm',
        icon: UserCheck,
        visible: true,
    },
    {
        label: 'BC Institutions',
        route: '/dashboard/admin/contracts/institutions',
        icon: FileText,
        visible: isSuperAdmin.value || isAdmin.value || isSaleRepresentative.value,
    },
    {
        label: 'Suivi commissions',
        route: '/dashboard/admin/institution-commission-tracking',
        icon: Euro,
        visible: isSuperAdmin.value || isAdmin.value || isSaleRepresentative.value,
    },
    {
        label: 'Paramètres commissions',
        route: '/dashboard/admin/institution-commission-settings',
        icon: Euro,
        visible: isSuperAdmin.value || isAdmin.value,
    },
].filter(item => item.visible !== false));

const nurseNavigationItems: NavigationItem[] = [
    {
        label: 'Informations',
        route: '/dashboard',
        icon: LayoutGrid,
    },
    {
        label: 'Remplacement rapide',
        route: '/dashboard/replacements/immediate',
        icon: QuickReplacementIcon,
    },
    {
        label: 'Demander un(e) remplaçant(e)',
        route: '/dashboard/replacements/create',
        icon: RefreshCw,
    },
    {
        label: 'Mes remplacements',
        route: '/dashboard/replacements/me',
        icon: List,
    },
    {
        label: 'Chercher un remplacement',
        route: '/dashboard/replacements',
        icon: FileSearch,
    },
    {
        label: 'Mes réponses reçues',
        route: '/dashboard/replacements/responses',
        icon: Users,
    },
    {
        label: 'Missions',
        route: '/dashboard/missions',
        icon: Briefcase,
    },
    {
        label: 'Binômes',
        route: '/dashboard/partners',
        icon: Users,
        children: [
            {
                label: 'Rechercher',
                route: '/dashboard/partners',
                icon: Search,
            },
            {
                label: 'Demander',
                route: '/dashboard/partners/create',
                icon: Plus,
            },
            {
                label: 'Réponses',
                route: '/dashboard/partners/responses',
                icon: MessageSquare,
            },
        ],
    },
    {
        label: 'Mon groupement',
        route: '/dashboard/group',
        icon: Users,
    },
    {
        label: 'Paramètres',
        route: '/dashboard/settings',
        icon: Cog,
    },
];

const adminNavigationItems = computed<NavigationItem[]>(() => [
    {
        label: 'Tableau de bord',
        route: '/dashboard',
        icon: LayoutGrid,
        visible: !isManager.value,
    },
    {
        label: 'Suivi inscriptions',
        route: '/dashboard/admin/registrations',
        icon: BarChart3,
        visible: true,
    },
    {
        label: 'Remplacements',
        route: '/dashboard/admin/replacements',
        icon: RefreshCw,
        visible: true,
    },
    {
        label: 'Intérêt pour remplacement',
        route: '/dashboard/admin/replacements/interest',
        icon: List,
        visible: true,
    },
    {
        label: 'Binômes',
        route: '/dashboard/admin/partners',
        icon: UserSearch,
        visible: true,
    },
    {
        label: 'Utilisateurs',
        route: '/dashboard/admin/users',
        icon: Users,
        visible: true,
    },
    {
        label: 'Accueil',
        route: '/dashboard/admin/home-management',
        icon: Wrench,
        visible: true,
    },
    {
        label: 'CRM',
        route: '/dashboard/admin/users/crm',
        icon: UserCheck,
        visible: crmChildren.value.length > 0,
        children: crmChildren.value,
    },
    {
        label: 'Institutions',
        route: '/dashboard/admin/institutions',
        icon: FileText,
        visible: true,
    },
    {
        label: 'Type de soins',
        route: '/dashboard/admin/care-types',
        icon: ShieldCheck,
        visible: true,
    },
    {
        label: 'Contacts',
        route: '/dashboard/admin/contacts/infiswap',
        icon: Inbox,
        visible: true,
        children: contactChildren.value,
    },
    {
        label: 'Mails',
        route: '/dashboard/admin/mails',
        icon: Mail,
        visible: isSuperAdmin.value || isAdmin.value,
    },
    {
        label: 'Contrats NURSTECH',
        route: '/dashboard/admin/contracts/nurstech',
        icon: Euro,
        visible: isSuperAdmin.value || isSaleRepresentative.value,
    },
    {
        label: 'Tutoriels',
        route: '/dashboard/admin/tutorials',
        icon: CirclePlay,
        visible: true,
    },
    {
        label: 'Groupement',
        route: '/dashboard/admin/groups',
        icon: Users,
        visible: true,
    },
    {
        label: 'Produits',
        route: '/dashboard/admin/products',
        icon: ShoppingBag,
        visible: true,
    },
    {
        label: 'Suivi des liens',
        route: '/dashboard/admin/stats',
        icon: Link,
        visible: true,
    },
    {
        label: 'Alertes',
        route: '/dashboard/admin/alerts',
        icon: ShieldAlert,
        visible: isSuperAdmin.value || isAdmin.value,
    },
    {
        label: 'AI - Configuration',
        route: '/dashboard/admin/ai-settings',
        icon: Sparkles,
        visible: isSuperAdmin.value,
    },
    {
        label: 'Logs',
        route: '/dashboard/admin/monitoring-errors',
        icon: ClipboardList,
        visible: isSuperAdmin.value || isAdmin.value,
    },
].filter(i => i.visible !== false));

const institutionNavigationItems: NavigationItem[] = [
    {
        label: 'Tableau de bord',
        route: '/dashboard/institution',
        icon: LayoutGrid,
    },
    {
        label: 'Membres',
        route: '/dashboard/institution/members',
        icon: Users,
        visible: isInstitutionAdmin.value,
    },
    {
        label: 'Services',
        route: '/dashboard/institution/services',
        icon: Briefcase,
    },
    {
        label: 'Missions',
        route: '/dashboard/institution/missions',
        icon: Briefcase,
    },
    {
        label: 'Chercher un remplacement',
        route: '/dashboard/institution/replacements',
        icon: FileSearch,
    },
    {
        label: 'Binômes',
        route: '/dashboard/institution/partners',
        icon: Users,
    },
    {
        label: 'Mes Favoris',
        route: '/dashboard/institution/favorites',
        icon: Users,
    },
    {
        label: 'Paramètres institution',
        route: '/dashboard/institution/settings',
        icon: Cog,
    },
    {
        label: 'Mon compte',
        route: '/dashboard/account',
        icon: CircleUser,
    },
];

const role = computed(() => {
    if (isInstitution.value) return 'institution';
    if (isSuperAdmin.value) return 'super_admin';
    if (isAdmin.value) return 'admin';
    if (isManager.value) return 'manager';
    if (isCommunityManager.value) return 'community_manager';
    if (isSaleRepresentative.value) return 'sale_representative';
    if (isCollaborator.value) return 'collaborator';
    if (isMedical.value) return 'medical';
    return 'nurse';
});

const navigationItems = computed(() => {
    const items = adminNavigationItems.value;

    switch (role.value) {
        case 'super_admin':
        case 'admin':
            return items;
        case 'institution':
            return institutionNavigationItems.filter(
                i => i.visible !== false,
            );
        case 'manager':
            return items.filter(
                i =>
                    !i.route.includes('/users/crm')
                    && !i.route.includes('/care-types'),
            );
        case 'community_manager':
            return items.filter(
                i =>
                    i.route === '/dashboard'
                    || i.route.includes('/registrations')
                    || i.route.includes('/replacements')
                    || i.route.includes('/replacements/interest')
                    || i.route.includes('/users')
                    || i.route.includes('/users/crm')
                    || i.route.includes('/home-management'),
            );
        case 'sale_representative':
            return items.filter(
                i =>
                    i.route.includes('/users/crm')
                    || i.route.includes('/products')
                    || i.route.includes('/contracts/nurstech')
                    || i.route.includes('/contracts/institutions'),
            );
        case 'collaborator':
        case 'medical':
        default:
            return nurseNavigationItems;
    }
});

const route = useRoute();
const isActiveRoute = (routePath: string) => route.path === routePath;

const isGroupActive = (item: NavigationItem) => {
    if (route.path.startsWith(item.route)) {
        return true;
    }

    return item.children?.some(child => isActiveRoute(child.route)) ?? false;
};
</script>
