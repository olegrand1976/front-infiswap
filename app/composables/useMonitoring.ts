import { useNuxtApp, useState } from '#app';

type AlertRecipient = {
    email: string;
    name: string;
};

type MonitoringErrorEntry = {
    id: string;
    level: string;
    message: string;
    exception_class: string;
    file: string | null;
    line: number | null;
    url: string | null;
    method: string | null;
    created_at: string;
};

export const useMonitoring = () => {
    const { $apifetch } = useNuxtApp();

    const recipients = useState<AlertRecipient[]>('dbAlertRecipients', () => []);
    const loading = useState<boolean>('dbAlertRecipientsLoading', () => false);
    const errors = useState<MonitoringErrorEntry[]>('monitoringErrors', () => []);
    const errorsTotal = useState<number>('monitoringErrorsTotal', () => 0);

    const getDatabaseAlertRecipients = async () => {
        loading.value = true;
        try {
            const response = await $apifetch('/api/admin/monitoring/database-alert-recipients');
            recipients.value = response.recipients ?? [];
            return recipients.value;
        } finally {
            loading.value = false;
        }
    };

    const updateDatabaseAlertRecipients = async (payload: AlertRecipient[]) => {
        loading.value = true;
        try {
            const response = await $apifetch('/api/admin/monitoring/database-alert-recipients', {
                method: 'PUT',
                body: { recipients: payload },
            });
            recipients.value = response.recipients ?? [];
            return response;
        } finally {
            loading.value = false;
        }
    };

    const getMonitoringErrors = async (page = 1, perPage = 25) => {
        loading.value = true;
        try {
            const response = await $apifetch('/api/admin/monitoring/errors', {
                params: { page, per_page: perPage },
            });
            errors.value = response.data ?? [];
            errorsTotal.value = response.total ?? 0;
            return response;
        } finally {
            loading.value = false;
        }
    };

    return {
        recipients,
        errors,
        errorsTotal,
        loading,
        getDatabaseAlertRecipients,
        updateDatabaseAlertRecipients,
        getMonitoringErrors,
    };
};
