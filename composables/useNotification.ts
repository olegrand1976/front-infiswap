import { useState, useNuxtApp } from '#app';
import type { Notification } from '~/lib/types';

type NotificationList = {
    data: Notification[];
    meta: any;
};

export const useNotifications = () => {
    const { $apifetch } = useNuxtApp();
    const notifications = useState<NotificationList>('notifications', () => ({ data: [], meta: {} }));
    const unreadCount = useState<number>('unreadCount', () => 0);
    const loading = useState('notifLoading', () => false);
    const pollingInterval = useState<NodeJS.Timeout | null>('notificationPollingInterval', () => null);
    const isPollingActive = useState<boolean>('isNotificationPollingActive', () => false);

    async function getAll(page = 1, perPage = 25, options = {}) {
        return await $apifetch('api/notifications/', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            notifications.value = response;
        });
    }

    async function getUnreadCount() {
        try {
            const response = await $apifetch('api/notifications/unread-count');
            unreadCount.value = response.count;
            return response.count;
        }
        catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    }

    function startPolling(intervalMs = 10000) {
        if (isPollingActive.value && pollingInterval.value) {
            return;
        }

        if (!import.meta.client) {
            return;
        }

        isPollingActive.value = true;

        const poll = async () => {
            if (document.visibilityState === 'visible') {
                await getUnreadCount();
            }
        };

        poll();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                poll();
            }
        };

        const handleFocus = () => {
            poll();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        const interval = setInterval(poll, intervalMs);
        pollingInterval.value = interval as any;
    }

    function stopPolling() {
        if (pollingInterval.value) {
            clearInterval(pollingInterval.value);
            pollingInterval.value = null;
        }
        isPollingActive.value = false;
    }

    async function markAsRead(id: number) {
        const response = await $apifetch(`/api/notifications/${id}/read`, {
            method: 'put',
        });

        if (notifications.value.data) {
            const index = notifications.value.data.findIndex(n => n.id === id);
            if (index !== -1) {
                notifications.value.data[index].read_at = response.data.read_at;
                if (unreadCount.value > 0) {
                    unreadCount.value = Math.max(0, unreadCount.value - 1);
                }
            }
        }
        else {
            await getUnreadCount();
        }

        return response;
    }

    async function markAllAsRead() {
        const response = await $apifetch('/api/notifications/mark-all-read', {
            method: 'put',
        });

        if (notifications.value.data) {
            notifications.value.data.forEach((n) => {
                n.read_at = new Date().toISOString();
            });
        }

        unreadCount.value = 0;

        return response;
    }

    async function remove(id: number) {
        const wasUnread = notifications.value.data?.find(n => n.id === id && !n.read_at);

        return await $apifetch(`api/notifications/${id}`, {
            method: 'DELETE',
        }).then(() => {
            if (notifications.value.data) {
                notifications.value.data = notifications.value.data.filter(n => n.id !== id);
            }

            if (wasUnread && unreadCount.value > 0) {
                unreadCount.value = Math.max(0, unreadCount.value - 1);
            }
            else {
                getUnreadCount();
            }
        });
    }

    return {
        notifications,
        unreadCount,
        loading,
        getAll,
        getUnreadCount,
        markAsRead,
        markAllAsRead,
        remove,
        startPolling,
        stopPolling,
    };
};
