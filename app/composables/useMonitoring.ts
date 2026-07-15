import { useNuxtApp, useState } from '#app';
import { getErrorMessage } from '~/lib/utils';

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
    const laravelLogsMessage = useState<string | null>('monitoringLaravelLogsMessage', () => null);
    const laravelLogsError = useState<string | null>('monitoringLaravelLogsError', () => null);
    const laravelLogsSource = useState<string | null>('monitoringLaravelLogsSource', () => null);

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

    const getLaravelLogErrors = async (limit = 50, options: { bustCache?: boolean } = {}) => {
        isLoadingLaravelLogs.value = true;
        laravelLogsError.value = null;
        try {
            const response = await $apifetch('/api/admin/monitoring/errors/laravel-log', {
                params: {
                    limit,
                    ...(options.bustCache ? { _ts: Date.now() } : {}),
                },
                cache: 'no-store',
            });
            laravelLogs.value = response.data ?? [];
            laravelLogsTotal.value = response.total ?? 0;
            laravelLogsMessage.value = response.message ?? null;
            laravelLogsSource.value = response.source ?? null;
            return response;
        }
        catch (error) {
            laravelLogsError.value = getErrorMessage(error);
            throw error;
        }
        finally {
            isLoadingLaravelLogs.value = false;
        }
    };

    return {
        recipients,
        laravelLogs,
        laravelLogsTotal,
        laravelLogsMessage,
        laravelLogsError,
        laravelLogsSource,
        loading,
        isLoadingLaravelLogs,
        getDatabaseAlertRecipients,
        createDatabaseAlertRecipient,
        updateDatabaseAlertRecipient,
        deleteDatabaseAlertRecipient,
        getLaravelLogErrors,
    };
};
