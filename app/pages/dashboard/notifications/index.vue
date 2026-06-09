<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Notifications"
            :count="notifications.meta.total"
        >
            <template #action>
                <Button
                    v-if="unreadCount > 0"
                    variant="ghost"
                    class="rounded-md"
                    @click="handleMarkAllAsRead"
                >
                    Tout marquer comme lu
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div v-if="loading">
                <div class="p-8 text-center text-gray-500">
                    Chargement...
                </div>
            </div>

            <div
                v-else-if="dataNotifications.length === 0"
                class="p-8 text-center text-gray-500"
            >
                <BellRing class="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p class="text-lg">
                    Aucune notification
                </p>
            </div>

            <div v-else>
                <div
                    v-for="notification in dataNotifications"
                    :key="notification.id"
                    class="bg-white rounded-lg shadow-sm border p-4 mb-4 hover:shadow-md transition-shadow"
                    :class="{
                        'border-primary border-2': !notification.read_at,
                    }"
                >
                    <div class="flex items-start gap-4">
                        <div
                            class="flex-shrink-0 w-3 h-3 rounded-full mt-2"
                            :class="notification.read_at ? 'bg-transparent' : 'bg-primary'"
                        />
                        <div class="flex-1">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1">
                                    <h3
                                        class="text-lg font-medium text-gray-900 mb-1"
                                        :class="{
                                            'font-semibold': !notification.read_at,
                                        }"
                                    >
                                        {{ getNotificationTitle(notification) }}
                                    </h3>
                                    <p class="text-sm text-gray-600 mb-2">
                                        {{ getNotificationMessage(notification) }}
                                    </p>
                                    <p class="text-xs text-gray-400">
                                        {{ formatRelativeDate(notification.created_at) }}
                                    </p>
                                </div>
                                <div class="flex gap-2">
                                    <Button
                                        v-if="!notification.read_at"
                                        variant="ghost"
                                        size="sm"
                                        @click="handleMarkAsRead(notification.id)"
                                    >
                                        Marquer comme lu
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        @click="handleDelete(notification.id)"
                                    >
                                        <Trash2 class="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="dataNotifications.length > 0">
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="notifications.meta.total"
                    @update:page="refreshNotifications"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { BellRing, Trash2 } from 'lucide-vue-next';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { PERPAGE } from '~/lib/constants';
import type { Notification } from '~/lib/types';
import { formatRelativeDate } from '~/composables/useDate';

const { getAll, markAsRead, markAllAsRead, remove, notifications, unreadCount } = useNotifications();
const { $toast } = useNuxtApp();
const loading = ref(false);
const router = useRouter();
const perPage = ref(PERPAGE);
const page = ref(1);

useHead({ title: 'Notifications' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});

const dataNotifications = computed(() => notifications.value.data ?? []);

onMounted(async () => {
    await loadNotifications();
});

const loadNotifications = async () => {
    loading.value = true;
    try {
        await getAll(page.value, perPage.value);
    }
    finally {
        loading.value = false;
    }
};

const refreshNotifications = async (pge: number) => {
    page.value = pge;
    await loadNotifications();
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await loadNotifications();
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
            return `Un nouveau candidat a postulé pour votre mission${data.mission_id ? ` #${data.mission_id}` : ''}`;
        case 'mission.accepted':
            return `Votre candidature pour la mission${data.mission_id ? ` #${data.mission_id}` : ''} a été acceptée`;
        case 'mission.rejected':
            return `Votre candidature pour la mission${data.mission_id ? ` #${data.mission_id}` : ''} a été refusée`;
        case 'mission.new':
            return `Une nouvelle mission est disponible${data.service_name ? ` pour ${data.service_name}` : ''}`;
        case 'timesheet.pending':
            return `Vous avez des jours à valider pour la mission${data.mission_id ? ` #${data.mission_id}` : ''}`;
        case 'replacement.response':
            return `Vous avez reçu une réponse pour votre remplacement${data.replacement_id ? ` #${data.replacement_id}` : ''}`;
        case 'replacement.accepted':
            return `Votre candidature pour le remplacement${data.replacement_id ? ` #${data.replacement_id}` : ''} a été acceptée`;
        case 'replacement.refused':
            return `Votre candidature pour le remplacement${data.replacement_id ? ` #${data.replacement_id}` : ''} a été refusée`;
        case 'replacement.new':
            return `Un nouveau remplacement est disponible${data.city ? ` à ${data.city}` : ''}`;
        case 'replacement.canceled':
            return `Le remplacement${data.replacement_id ? ` #${data.replacement_id}` : ''} a été annulé${data.nurse_name ? ` par ${data.nurse_name}` : ''}`;
        case 'replacement.closed':
            return `Le remplacement${data.replacement_id ? ` #${data.replacement_id}` : ''} a été clôturé`;
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

const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    $toast({
        description: 'Notification marquée comme lue',
    });
};

const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    $toast({
        description: 'Toutes les notifications ont été marquées comme lues',
    });
};

const handleDelete = async (id: number) => {
    await remove(id);
    $toast({
        description: 'Notification supprimée',
    });
};
</script>
