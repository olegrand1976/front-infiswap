import { useNuxtApp, useState } from '#app';

export type AiProvider = 'openai' | 'gemini';

export type AiSettings = {
    provider: AiProvider;
    model: string;
    active: boolean;
    has_api_key: boolean;
    masked_api_key: string | null;
    modified_at: string | null;
    modified_by: {
        id: number;
        name: string;
    } | null;
};

export type AiTestResult = {
    success: boolean;
    message: string;
    response?: string;
};

export const useAiSettings = () => {
    const { $apifetch } = useNuxtApp();

    const settings = useState<AiSettings | null>('aiSettings', () => null);
    const loading = useState<boolean>('aiSettingsLoading', () => false);
    const saving = useState<boolean>('aiSettingsSaving', () => false);
    const testing = useState<boolean>('aiSettingsTesting', () => false);

    const fetchSettings = async () => {
        loading.value = true;
        try {
            const response = await $apifetch<{ data: AiSettings }>('/api/admin/ai-settings');
            settings.value = response.data;
            return settings.value;
        }
        finally {
            loading.value = false;
        }
    };

    const saveSettings = async (payload: Partial<Pick<AiSettings, 'provider' | 'active' | 'model'>>) => {
        saving.value = true;
        try {
            const response = await $apifetch<{ message: string; data: AiSettings }>('/api/admin/ai-settings', {
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

    const saveApiKey = async (apiKey: string) => {
        saving.value = true;
        try {
            const response = await $apifetch<{ message: string; data: AiSettings }>('/api/admin/ai-settings/api-key', {
                method: 'PUT',
                body: { api_key: apiKey },
            });
            settings.value = response.data;
            return response;
        }
        finally {
            saving.value = false;
        }
    };

    const removeApiKey = async () => {
        saving.value = true;
        try {
            const response = await $apifetch<{ message: string; data: AiSettings }>('/api/admin/ai-settings/api-key', {
                method: 'DELETE',
            });
            settings.value = response.data;
            return response;
        }
        finally {
            saving.value = false;
        }
    };

    const testConnection = async () => {
        testing.value = true;
        try {
            return await $apifetch<AiTestResult>('/api/admin/ai-settings/test', {
                method: 'POST',
            });
        }
        finally {
            testing.value = false;
        }
    };

    return {
        settings,
        loading,
        saving,
        testing,
        fetchSettings,
        saveSettings,
        saveApiKey,
        removeApiKey,
        testConnection,
    };
};
