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
                v-for="section in navigationSections"
                :key="section.label || 'main'"
                :class="
                    cn('rounded-xl pb-4', {
                        'bg-white': isAdmin,
                        'bg-gray-100': !isAdmin,
                    })
                "
            >
                <SidebarGroupLabel
                    v-if="section.label"
                    class="px-2 text-xs uppercase tracking-wide text-neutral-500"
                >
                    {{ section.label }}
                </SidebarGroupLabel>
                <SidebarGroupContent class="mx-auto mt-2 flex flex-col gap-2 lg:w-44 xl:w-52">
                    <SidebarMenu>
                        <SidebarMenuItem
                            v-for="item in section.items"
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
                                        <Badge
                                            v-if="item.badge"
                                            class="ml-auto mr-1 h-5 min-w-5 justify-center rounded-full bg-primary px-1.5 text-[0.65rem] text-white"
                                        >
                                            {{ item.badge > 99 ? '99+' : item.badge }}
                                        </Badge>
                                        <ChevronRight
                                            :class="[
                                                'size-4 transition-transform group-data-[state=open]/collapsible:rotate-90',
                                                item.badge ? '' : 'ml-auto',
                                            ]"
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
                                                    :to="localePath(subItem.route)"
                                                    class="flex h-10 w-full items-center rounded px-2"
                                                    @click="closeSidebar"
                                                >
                                                    <component
                                                        :is="subItem.icon"
                                                        class="mr-2 size-4 opacity-80"
                                                    />
                                                    <span class="flex-1">{{ subItem.label }}</span>
                                                    <Badge
                                                        v-if="subItem.badge"
                                                        class="ml-2 h-5 min-w-5 justify-center rounded-full bg-primary px-1.5 text-[0.65rem] text-white"
                                                    >
                                                        {{ subItem.badge > 99 ? '99+' : subItem.badge }}
                                                    </Badge>
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
                                    :to="item.external ? item.route : localePath(item.route)"
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
                                        v-if="item.badge"
                                        class="ml-2 h-5 min-w-5 justify-center rounded-full bg-primary px-1.5 text-[0.65rem] text-white"
                                    >
                                        {{ item.badge > 99 ? '99+' : item.badge }}
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
                v-if="showGoogleReviewLink"
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
import { BarChart3, Briefcase, ChevronRight, CircleHelp, CirclePlay, CircleUser, ClipboardList, Cog, CreditCard, Crown, Euro, FileSearch, FileText, Inbox, LayoutGrid, Link, List, Mail, MapPin, MessageSquare, Plus, Power, RefreshCw, Search, ShieldAlert, ShieldCheck, ShoppingBag, Sparkles, Star, UserCheck, Users, UserSearch, Wrench, IdCard } from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';
import QuickReplacementIcon from '../icons/QuickReplacementIcon.vue';
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import { useRuntimeConfig } from '#app';
import { PERPAGE } from '~/lib/constants';
import { hasLeftGoogleReview } from '~/utils/googleReview';

const {
    isSuperAdmin,
    isAdmin,
    isManager,
    isCollaborator,
    isCommunityManager,
    isSaleRepresentative,
    canAccessMarketingAnalytics,
    isMedical,
    isInstitution,
    isInstitutionAdmin,
    logout,
} = useAuth();
const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const user = useUser();
const showGoogleReviewLink = computed(() => !hasLeftGoogleReview(user.value));
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
const { unreadCounts, fetchUnreadCounts } = useContact();

if (!isInstitution.value) {
    await getProducts(page.value, perPage.value);
}

const canSeeContactBadges = computed(() => isSuperAdmin.value || isAdmin.value || isManager.value);

if (canSeeContactBadges.value) {
    try {
        await fetchUnreadCounts();
    }
    catch {
        // badges optionnels — ne pas bloquer le sidebar
    }
}

const unreadBadgeForRoute = (route: string): number | undefined => {
    const match = route.match(/\/dashboard\/admin\/contacts\/([^/]+)/);
    if (!match) {
        return undefined;
    }

    const type = match[1].toLowerCase() as keyof typeof unreadCounts.value;
    if (type === 'total') {
        return undefined;
    }

    const count = unreadCounts.value[type] ?? 0;

    return count > 0 ? count : undefined;
};

type StaffRole = 'super_admin' | 'admin' | 'manager' | 'community_manager' | 'sale_representative';

interface NavigationItem {
    label: string;
    route: string;
    icon: Component | FunctionalComponent | VNode;
    children?: NavigationItem[];
    visible?: boolean;
    external?: boolean;
    roles?: StaffRole[];
    badge?: number;
}

interface NavigationSection {
    label: string;
    roles: StaffRole[];
    items: NavigationItem[];
}

const canShowItem = (
    item: NavigationItem,
    currentRole: StaffRole,
    sectionRoles: StaffRole[],
): boolean => {
    if (item.visible === false) {
        return false;
    }

    const allowedRoles = item.roles ?? sectionRoles;

    return allowedRoles.includes(currentRole);
};

const resolveNavigationItems = (
    items: NavigationItem[],
    currentRole: StaffRole,
    sectionRoles: StaffRole[],
): NavigationItem[] => {
    const resolved: NavigationItem[] = [];

    for (const item of items) {
        if (item.children?.length) {
            const children = resolveNavigationItems(item.children, currentRole, sectionRoles);

            if (children.length === 0) {
                continue;
            }

            if (!canShowItem(item, currentRole, sectionRoles) && item.roles) {
                continue;
            }

            if (item.visible === false) {
                continue;
            }

            resolved.push({ ...item, children });
            continue;
        }

        if (!canShowItem(item, currentRole, sectionRoles)) {
            continue;
        }

        resolved.push(item);
    }

    return resolved;
};

const contactChildren = computed<NavigationItem[]>(() => [
    {
        label: 'Infiswap',
        route: '/dashboard/admin/contacts/infiswap',
        icon: Inbox,
        badge: unreadBadgeForRoute('/dashboard/admin/contacts/infiswap'),
    },
    ...products.value
        .filter(p => p.name.toLowerCase() !== 'inficoncept')
        .map((p) => {
            const route = `/dashboard/admin/contacts/${p.name.toLowerCase()}`;

            return {
                label: p.name,
                route,
                icon: Inbox,
                badge: unreadBadgeForRoute(route),
            };
        }),
]);

const crmChildren = computed<NavigationItem[]>(() => [
    {
        label: 'Suivi commercial',
        route: '/dashboard/admin/users/crm',
        icon: UserCheck,
    },
    {
        label: 'Récap activité',
        route: '/dashboard/admin/users/crm/commercial-activity',
        icon: BarChart3,
        visible: isSuperAdmin.value || isAdmin.value,
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
        label: 'Paramètres BC institution',
        route: '/dashboard/admin/institution-crm-settings',
        icon: Euro,
        visible: isSuperAdmin.value || isAdmin.value,
    },
    {
        label: 'Bon de commande vierge',
        route: '/dashboard/admin/crm/documentation/blank-purchase-order',
        icon: FileText,
    },
    {
        label: 'Conditions générales de vente',
        route: '/dashboard/admin/crm/documentation/general-terms',
        icon: FileText,
    },
].filter(item => item.visible !== false));

const nurseNavigationItems = computed<NavigationItem[]>(() => {
    return [
        {
            label: t('nav.dashboard'),
            route: '/dashboard',
            icon: LayoutGrid,
        },
        {
            label: t('nav.nurseMap'),
            route: '/dashboard/nurses-map',
            icon: MapPin,
        },
        {
            label: t('nav.quickReplacement'),
            route: '/dashboard/replacements/immediate',
            icon: QuickReplacementIcon,
        },
        {
            label: t('nav.requestReplacement'),
            route: '/dashboard/replacements/create',
            icon: RefreshCw,
        },
        {
            label: t('nav.myReplacements'),
            route: '/dashboard/replacements/me',
            icon: List,
        },
        {
            label: t('nav.findReplacement'),
            route: '/dashboard/replacements',
            icon: FileSearch,
        },
        {
            label: t('nav.myResponses'),
            route: '/dashboard/replacements/responses',
            icon: Users,
        },
        {
            label: t('nav.missions'),
            route: '/dashboard/missions',
            icon: Briefcase,
        },
        {
            label: t('nav.pairings'),
            route: '/dashboard/partners',
            icon: Users,
            children: [
                {
                    label: t('common.search'),
                    route: '/dashboard/partners',
                    icon: Search,
                },
                {
                    label: t('nav.requestReplacement'),
                    route: '/dashboard/partners/create',
                    icon: Plus,
                },
                {
                    label: t('nav.myResponses'),
                    route: '/dashboard/partners/responses',
                    icon: MessageSquare,
                },
            ],
        },
        {
            label: t('nav.network'),
            route: '/dashboard/group',
            icon: Users,
        },
        {
            label: 'Infiswap Premium',
            route: '/dashboard/subscriptions',
            icon: Crown,
        },
        {
            label: t('nav.settings'),
            route: '/dashboard/settings',
            icon: Cog,
        },
    ];
});

const adminNavigationSections = computed<NavigationSection[]>(() => [
    {
        label: 'Vue d\'ensemble',
        roles: ['super_admin', 'admin', 'community_manager'],
        items: [
            {
                label: 'Tableau de bord',
                route: '/dashboard',
                icon: LayoutGrid,
            },
        ],
    },
    {
        label: 'Opérations',
        roles: ['super_admin', 'admin', 'community_manager', 'manager', 'sale_representative'],
        items: [
            {
                label: 'Remplacements',
                route: '/dashboard/admin/replacements',
                icon: RefreshCw,
                children: [
                    {
                        label: 'Liste',
                        route: '/dashboard/admin/replacements',
                        icon: RefreshCw,
                    },
                    {
                        label: 'Intérêt pour remplacement',
                        route: '/dashboard/admin/replacements/interest',
                        icon: List,
                    },
                ],
                roles: ['super_admin', 'admin', 'community_manager', 'manager'],
            },
            {
                label: 'Suivi inscriptions',
                route: '/dashboard/admin/registrations',
                icon: BarChart3,
                roles: ['super_admin', 'admin', 'community_manager', 'manager'],
            },
            {
                label: 'Binômes',
                route: '/dashboard/admin/partners',
                icon: UserSearch,
                roles: ['super_admin', 'admin', 'manager'],
            },
            {
                label: 'Carte infirmières',
                route: '/dashboard/admin/nurses-map',
                icon: MapPin,
                roles: ['super_admin', 'admin', 'community_manager', 'sale_representative', 'manager'],
            },
        ],
    },
    {
        label: 'Utilisateurs & réseau',
        roles: ['super_admin', 'admin', 'manager', 'community_manager'],
        items: [
            {
                label: 'Utilisateurs',
                route: '/dashboard/admin/users',
                icon: Users,
                roles: ['super_admin', 'admin', 'community_manager', 'manager'],
            },
            {
                label: 'Institutions',
                route: '/dashboard/admin/institutions',
                icon: FileText,
                roles: ['super_admin', 'admin', 'manager'],
            },
            {
                label: 'Groupement',
                route: '/dashboard/admin/groups',
                icon: Users,
                roles: ['super_admin', 'admin', 'manager'],
            },
            {
                label: 'Type de soins',
                route: '/dashboard/admin/care-types',
                icon: ShieldCheck,
                roles: ['super_admin', 'admin'],
            },
            {
                label: 'Contacts',
                route: '/dashboard/admin/contacts/infiswap',
                icon: Inbox,
                roles: ['super_admin', 'admin', 'manager'],
                badge: unreadCounts.value.total > 0 ? unreadCounts.value.total : undefined,
                children: contactChildren.value,
            },
        ],
    },
    {
        label: 'Commercial',
        roles: ['super_admin', 'admin', 'community_manager', 'sale_representative'],
        items: [
            {
                label: 'CRM',
                route: '/dashboard/admin/users/crm',
                icon: UserCheck,
                children: crmChildren.value,
            },
            {
                label: 'Contrats NURSTECH',
                route: '/dashboard/admin/contracts/nurstech',
                icon: Euro,
                visible: isSuperAdmin.value || isSaleRepresentative.value,
            },
            {
                label: 'Canal téléphonique Premium',
                route: '/dashboard/admin/sales',
                icon: Crown,
                roles: ['super_admin', 'admin', 'sale_representative'],
            },
            {
                label: 'Mes commissions Premium',
                route: '/dashboard/admin/commissions',
                icon: Euro,
                roles: ['super_admin', 'admin', 'sale_representative'],
            },
            {
                label: 'Produits',
                route: '/dashboard/admin/products',
                icon: ShoppingBag,
                roles: ['super_admin', 'admin', 'sale_representative'],
            },
            {
                label: 'Suivi marketing',
                route: '/dashboard/admin/marketing-analytics',
                icon: BarChart3,
                visible: canAccessMarketingAnalytics.value,
            },
            {
                label: 'Carte infirmières',
                route: '/dashboard/admin/nurses-map',
                icon: MapPin,
            },
        ],
    },
    {
        label: 'Contenu plateforme',
        roles: ['super_admin', 'admin', 'community_manager', 'manager'],
        items: [
            {
                label: 'Accueil',
                route: '/dashboard/admin/home-management',
                icon: Wrench,
                roles: ['super_admin', 'admin', 'community_manager', 'manager'],
            },
            {
                label: 'Tutoriels',
                route: '/dashboard/admin/tutorials',
                icon: CirclePlay,
                roles: ['super_admin', 'admin', 'manager'],
            },
        ],
    },
    {
        label: 'Monétisation',
        roles: ['super_admin', 'admin', 'manager'],
        items: [
            {
                label: 'Abonnement',
                route: '/dashboard/admin/subscription-plans',
                icon: Euro,
            },
            {
                label: 'Paiements Stripe',
                route: '/dashboard/admin/stripe-payments',
                icon: CreditCard,
            },
        ],
    },
    {
        label: 'Suivi & analytics',
        roles: ['super_admin', 'admin', 'manager'],
        items: [
            {
                label: 'Suivi des liens',
                route: '/dashboard/admin/stats',
                icon: Link,
            },
        ],
    },
    {
        label: 'Technique',
        roles: ['super_admin', 'admin'],
        items: [
            {
                label: 'Mails',
                route: '/dashboard/admin/mails',
                icon: Mail,
            },
            {
                label: 'Alertes',
                route: '/dashboard/admin/alerts',
                icon: ShieldAlert,
            },
            {
                label: 'AI - Configuration',
                route: '/dashboard/admin/ai-settings',
                icon: Sparkles,
                visible: isSuperAdmin.value,
            },
            {
                label: 'INAMI / CoBRHA',
                route: '/dashboard/admin/inami-settings',
                icon: IdCard,
                visible: isSuperAdmin.value,
            },
            {
                label: 'Logs',
                route: '/dashboard/admin/monitoring-errors',
                icon: ClipboardList,
            },
        ],
    },
]);

const institutionNavigationItems: NavigationItem[] = [
    {
        label: 'Tableau de bord',
        route: '/dashboard/institution',
        icon: LayoutGrid,
    },
    {
        label: 'Carte infirmières',
        route: '/dashboard/nurses-map',
        icon: MapPin,
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

const navigationSections = computed(() => {
    if (role.value === 'institution') {
        return [{
            label: '',
            roles: [] as StaffRole[],
            items: institutionNavigationItems.filter(i => i.visible !== false),
        }];
    }

    if (role.value === 'collaborator' || role.value === 'medical' || role.value === 'nurse') {
        return [{
            label: '',
            roles: [] as StaffRole[],
            items: nurseNavigationItems.value,
        }];
    }

    const currentRole = role.value as StaffRole;

    return adminNavigationSections.value
        .filter(section => section.roles.includes(currentRole))
        .map(section => ({
            ...section,
            items: resolveNavigationItems(section.items, currentRole, section.roles),
        }))
        .filter(section => section.items.length > 0);
});

const route = useRoute();
const isActiveRoute = (routePath: string) => {
    const localized = localePath(routePath);
    return route.path === localized || route.path === routePath;
};

const isGroupActive = (item: NavigationItem) => {
    if (route.path.startsWith(item.route)) {
        return true;
    }

    return item.children?.some(child => isActiveRoute(child.route)) ?? false;
};
</script>
