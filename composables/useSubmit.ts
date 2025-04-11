export type ValidationErrors = Record<string, string[]>;

export type UseSubmitOptions = {
    onSuccess?: (result: any) => any;
    onError?: (error: Error) => any;
};

export function useSubmit<T>(
    fetchable: () => Promise<T>,
    options: UseSubmitOptions = {}) {
    const validationErrors = ref<ValidationErrors>({});
    const error = ref(null);
    const inProgress = ref(false);
    const succeeded = ref(null);
    const { $toast } = useNuxtApp();

    async function submit() {
        validationErrors.value = {};
        error.value = null;
        inProgress.value = true;
        succeeded.value = null;

        try {
            const data = await fetchable();
            succeeded.value = true;
            options?.onSuccess?.(data);
            return data;
        }
        catch (e) {
            error.value = e;
            succeeded.value = false;
            options?.onError?.(e);
            validationErrors.value = e.data?.errors ?? {};
            if (e.data.message) {
                const firstError = e.data.message ?? 'Une erreur est survenue';
                $toast({
                    title: firstError,
                    variant: 'destructive',
                });
            }
        }
        finally {
            inProgress.value = false;
        }
    }

    return {
        submit,
        inProgress,
        succeeded,
        validationErrors,
        error,
    };
}
