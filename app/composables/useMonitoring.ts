import { useNuxtApp, useState } from '#app';

type AlertRecipient = {
    email: string;
    name: string;
};

type LaravelLogEntry = {
    id: string;
    source: string;
    datetime: string;
    environment: string;
    level: string;
    message: string;
    details: string;
    raw: string;
};

export const useMonitoring = () => {
    const { $apifetch } = useNuxtApp();

    const recipients = useState<AlertRecipient[]>('dbAlertRecipients', () => []);
    const loading = useState<boolean>('dbAlertRecipientsLoading', () => false);
    const isLoadingLaravelLogs = useState<boolean>('monitoringLaravelLogsLoading', () => false);
    const laravelLogs = useState<LaravelLogEntry[]>('monitoringLaravelLogs', () => []);
    const laravelLogsTotal = useState<number>('monitoringLaravelLogsTotal', () => 0);

    const getDatabaseAlertRecipients = async () => {
        loading.value = true;
        try {
            const response = await $apifetch('/api/admin/monitoring/database-alert-recipients');
            recipients.value = response.recipients ?? [];
            return recipients.value;
        }
        finally {
            loading.value = false;
        }
    };

    const createDatabaseAlertRecipient = async (payload: AlertRecipient) => {
        loading.value = true;
        try {
            const response = await $apifetch('/api/admin/monitoring/database-alert-recipients', {
                method: 'POST',
                body: payload,
            });
            recipients.value = response.recipients ?? [];
            return response;
        }
        finally {
            loading.value = false;
        }
    };

    const deleteDatabaseAlertRecipient = async (email: string) => {
        loading.value = true;
        try {
            const response = await $apifetch(`/api/admin/monitoring/database-alert-recipients/${encodeURIComponent(email)}`, {
                method: 'DELETE',
            });
            recipients.value = response.recipients ?? [];
            return response;
        }
        finally {
            loading.value = false;
        }
    };

    const updateDatabaseAlertRecipient = async (originalEmail: string, payload: AlertRecipient) => {
        loading.value = true;
        try {
            const response = await $apifetch(`/api/admin/monitoring/database-alert-recipients/${encodeURIComponent(originalEmail)}`, {
                method: 'PUT',
                body: payload,
            });
            recipients.value = response.recipients ?? [];
            return response;
        }
        finally {
            loading.value = false;
        }
    };

    const getLaravelLogErrors = async (limit = 50) => {
        isLoadingLaravelLogs.value = true;
        try {
            const response = await $apifetch('/api/admin/monitoring/errors/laravel-log', {
                params: { limit },
            });
            laravelLogs.value = response.data ?? [];
            laravelLogsTotal.value = response.total ?? 0;
            return response;
        }
        finally {
            isLoadingLaravelLogs.value = false;
        }
    };

    return {
        recipients,
        laravelLogs,
        laravelLogsTotal,
        loading,
        isLoadingLaravelLogs,
        getDatabaseAlertRecipients,
        createDatabaseAlertRecipient,
        updateDatabaseAlertRecipient,
        deleteDatabaseAlertRecipient,
        getLaravelLogErrors,
    };
};
