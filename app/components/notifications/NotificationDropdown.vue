<template>
    <DropdownMenu v-model:open="isOpen">
        <DropdownMenuTrigger as-child>
            <div
                class="relative cursor-pointer"
                @click="loadNotifications"
            >
                <BellRing
                    class="w-6 h-6 text-gray-500 hover:text-primary transition-colors"
                />

                <span
                    v-if="unreadCount > 0"
                    class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center pointer-events-none"
                >
                    {{ unreadCount > 99 ? "99+" : unreadCount }}
                </span>
            </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            class="w-96 max-h-[500px] overflow-y-auto"
            align="end"
        >
            <div class="p-4 border-b">
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-gray-900">
                        Notifications
                    </h3>
                    <div class="flex gap-2">
                        <Button
                            v-if="unreadCount > 0"
                            variant="ghost"
                            size="sm"
                            class="text-xs"
                            @click="handleMarkAllAsRead"
                        >
                            Tout marquer comme lu
                        </Button>
                    </div>
                </div>
            </div>

            <div v-if="loading">
                <div class="p-4 text-center text-gray-500">
                    Chargement...
                </div>
            </div>

            <div
                v-else-if="notificationsList.length === 0"
                class="p-8 text-center text-gray-500"
            >
                <BellRing class="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune notification</p>
            </div>

            <div v-else>
                <div
                    v-for="notification in notificationsList"
                    :key="notification.id"
                    class="border-b last:border-b-0"
                >
                    <DropdownMenuItem
                        class="p-0"
                        :class="{
                            'bg-gray-50': !notification.read_at,
                        }"
                    >
                        <div class="w-full p-4 hover:bg-gray-100 transition-colors">
                            <div class="flex items-start gap-3">
                                <div
                                    class="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                                    :class="
                                        notification.read_at ? 'bg-transparent' : 'bg-primary'
                                    "
                                />
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-start justify-between gap-2">
                                        <p
                                            class="text-sm font-medium text-gray-900"
                                            :class="{
                                                'font-semibold': !notification.read_at,
                                            }"
                                            @click="handleNotificationClick(notification)"
                                        >
                                            {{ getNotificationTitle(notification) }}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            class="h-6 w-6 p-0 flex-shrink-0"
                                            @click.stop="handleDelete(notification.id)"
                                        >
                                            <X
                                                class="w-4 h-4 text-gray-400 hover:text-red-500"
                                            />
                                        </Button>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-1">
                                        {{ getNotificationMessage(notification) }}
                                        <NuxtLink
                                            v-if="getNotificationDetailLink(notification)"
                                            class="text-primary hover:underline"
                                            :to="getNotificationDetailLink(notification)?.path"
                                        >
                                            {{ getNotificationDetailLink(notification)?.label }}
                                        </NuxtLink>
                                    </p>
                                    <p class="text-xs text-gray-400 mt-1">
                                        {{ formatRelativeDate(notification.created_at) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DropdownMenuItem>
                </div>
            </div>

            <div class="p-2 border-t space-y-1">
                <Button
                    variant="ghost"
                    class="w-full text-sm justify-start"
                    @click="handleViewAll"
                >
                    Voir toutes les notifications
                </Button>
                <Button
                    variant="ghost"
                    class="w-full text-sm justify-start text-gray-500"
                    @click="handleOpenSettings"
                >
                    Paramètres de notifications
                </Button>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script lang="ts" setup>
import { BellRing, Star, X } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Notification, User } from '~/lib/types';
import { formatRelativeDate } from '~/composables/useDate';

const {
    getAll,
    markAsRead,
    markAllAsRead,
    remove,
    getUnreadCount,
    notifications,
    unreadCount,
    startPolling,
    stopPolling,
} = useNotifications();
const loading = ref(false);
const router = useRouter();
const isOpen = ref(false);

const notificationsList = computed(() => notifications.value.data ?? []);

onMounted(async () => {
    await loadNotifications();
    await getUnreadCount();
    startPolling(10000);
});

onUnmounted(() => {
    stopPolling();
});

const loadNotifications = async () => {
    loading.value = true;
    try {
        await getAll(1, 10);
        await getUnreadCount();
    }
    finally {
        loading.value = false;
    }
};

const getNotificationTitle = (notification: Notification): string => {
    const type = notification.type;
    const data = notification.data || {};

    switch (type) {
        case 'mission.candidate':
        case 'mission_new_candidate':
            return 'Nouveau candidat';
        case 'mission.accepted':
            return 'Candidature acceptée';
        case 'mission.rejected':
            return 'Candidature refusée';
        case 'mission.new':
            return 'Nouvelle mission disponible';
        case 'timesheet.pending':
            return 'Feuille de temps à valider';
        case 'replacement.response':
            return 'Nouvelle réponse';
        case 'replacement.accepted':
            return 'Remplacement accepté';
        case 'replacement.refused':
            return 'Remplacement refusé';
        case 'replacement.new':
            return 'Nouveau remplacement';
        case 'replacement.canceled':
            return 'Remplacement annulé';
        case 'replacement.closed':
            return 'Remplacement clôturé';
        case 'partnership.request':
            return 'Demande de partenariat';
        case 'system.announcement':
            return 'Annonce';
        case 'system.update':
            return 'Mise à jour';
        default:
            return data.title || 'Notification';
    }
};

const getNotificationMessage = (notification: Notification): string => {
    const type = notification.type;
    const data = notification.data || {};

    switch (type) {
        case 'mission.candidate':
        case 'mission_new_candidate':
            return 'Un nouveau candidat a postulé pour votre mission';
        case 'mission.accepted':
            return 'Votre candidature pour la mission a été acceptée';
        case 'mission.rejected':
            return 'Votre candidature pour la mission a été refusée';
        case 'mission.new':
            return `Une nouvelle mission est disponible${data.service_name ? ` pour ${data.service_name}` : ''}`;
        case 'timesheet.pending':
            return 'Vous avez des jours à valider pour la mission';
        case 'replacement.response':
            return 'Vous avez reçu une réponse pour votre remplacement';
        case 'replacement.accepted':
            return 'Votre candidature pour le remplacement a été acceptée';
        case 'replacement.refused':
            return 'Votre candidature pour le remplacement a été refusée';
        case 'replacement.new':
            return `Un nouveau remplacement est disponible${data.city ? ` à ${data.city}` : ''}`;
        case 'replacement.canceled':
            return `Le remplacement a été annulé${data.nurse_name ? ` par ${data.nurse_name}` : ''}`;
        case 'replacement.closed':
            return 'Le remplacement a été clôturé';
        case 'partnership.request':
            return `Nouvelle demande de partenariat${data.partner_name ? ` de ${data.partner_name}` : ''}`;
        case 'system.announcement':
            return data.message || 'Nouvelle annonce de la plateforme';
        case 'system.update':
            return data.message || 'Mise à jour de la plateforme';
        default:
            return data.message || 'Nouvelle notification';
    }
};

const getNotificationDetailLink = (
    notification: Notification,
): { label: string; path: string } | null => {
    const type = notification.type;
    const data = notification.data || {};

    if (type.includes('timesheet') && data.mission_id) {
        return {
            label: `#${data.mission_id}`,
            path: `/dashboard/institution/missions/timesheet/${data.mission_id}`,
        };
    }

    if (type.includes('mission') && data.mission_id) {
        const user = useState<User>('user');
        const isMissionListType
      = type === 'mission.candidate'
          || type === 'mission_new_candidate'
          || type === 'mission.response'
          || type === 'mission.invitation';

        if (isMissionListType && user.value?.type === 'institution') {
            return {
                label: `#${data.mission_id}`,
                path: `/dashboard/institution/missions/candidacy/${data.mission_id}`,
            };
        }

        const path
      = user.value?.type === 'institution'
          ? `/dashboard/institution/missions/${data.mission_id}`
          : `/dashboard/missions/${data.mission_id}`;

        return {
            label: `#${data.mission_id}`,
            path,
        };
    }

    if (type.includes('replacement') && data.replacement_id) {
        const isReplacementListType
      = type === 'replacement.response'
          || type === 'replacement.candidate'
          || type === 'replacement.invitation';

        return {
            label: `#${data.replacement_id}`,
            path: isReplacementListType
                ? `/dashboard/replacements/detail/${data.replacement_id}/list`
                : `/dashboard/replacements/detail/${data.replacement_id}`,
        };
    }

    return null;
};

const handleNotificationLinkClick = async (notification: Notification) => {
    if (!notification.read_at) {
        await markAsRead(notification.id);
        await getUnreadCount();
    }

    const detailLink = getNotificationDetailLink(notification);
    if (!detailLink) {
        return;
    }

    isOpen.value = false;
    router.push(detailLink.path);
};

const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
        await markAsRead(notification.id);
        await getUnreadCount();
    }

    const type = notification.type;
    const data = notification.data || {};

    isOpen.value = false;

    if (type.includes('mission')) {
        if (data.mission_id) {
            const user = useState<User>('user');
            const isMissionListType
        = type === 'mission.candidate'
            || type === 'mission_new_candidate'
            || type === 'mission.response'
            || type === 'mission.invitation';

            if (isMissionListType && user.value?.type === 'institution') {
                router.push(
                    `/dashboard/institution/missions/candidacy/${data.mission_id}`,
                );
                return;
            }

            if (user.value?.type === 'institution') {
                router.push(`/dashboard/institution/missions/${data.mission_id}`);
            }
            else {
                router.push(`/dashboard/missions/${data.mission_id}`);
            }
        }
    }
    else if (type.includes('timesheet')) {
        if (data.mission_id) {
            router.push(
                `/dashboard/institution/missions/timesheet/${data.mission_id}`,
            );
        }
    }
    else if (type.includes('replacement')) {
        if (data.replacement_id) {
            const isReplacementListType
        = type === 'replacement.response'
            || type === 'replacement.candidate'
            || type === 'replacement.invitation';

            router.push(
                isReplacementListType
                    ? `/dashboard/replacements/detail/${data.replacement_id}/list`
                    : `/dashboard/replacements/detail/${data.replacement_id}`,
            );
        }
    }
    else if (type.includes('partnership')) {
        router.push('/dashboard/partners');
    }
};

const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    await getUnreadCount();
};

const handleDelete = async (id: number) => {
    await remove(id);
    await getUnreadCount();
};

const handleViewAll = () => {
    isOpen.value = false;
    router.push('/dashboard/notifications');
};

const handleOpenSettings = () => {
    isOpen.value = false;
    router.push('/dashboard/settings');
};
</script>
