import { useNuxtApp, useState } from '#app';

export type InamiSettings = {
    cobrha_enabled: boolean;
    modified_at: string | null;
    modified_by: {
        id: number;
        name: string;
    } | null;
};

export const useInamiSettings = () => {
    const { $apifetch } = useNuxtApp();

    const settings = useState<InamiSettings | null>('inamiSettings', () => null);
    const loading = useState<boolean>('inamiSettingsLoading', () => false);
    const saving = useState<boolean>('inamiSettingsSaving', () => false);

    const fetchSettings = async () => {
        loading.value = true;
        try {
            const response = await $apifetch<{ data: InamiSettings }>('/api/admin/inami-settings');
            settings.value = response.data;
            return settings.value;
        }
        finally {
            loading.value = false;
        }
    };

    const saveSettings = async (payload: Pick<InamiSettings, 'cobrha_enabled'>) => {
        saving.value = true;
        try {
            const response = await $apifetch<{ message: string; data: InamiSettings }>('/api/admin/inami-settings', {
                method: 'PUT',
                body: payload,
            });
            settings.value = response.data;
            return response;
        }
        finally {
            saving.value = false;
        }
    };

    return {
        settings,
        loading,
        saving,
        fetchSettings,
        saveSettings,
    };
};
