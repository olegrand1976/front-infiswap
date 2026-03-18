/* eslint-disable @typescript-eslint/no-explicit-any */
export function useFile() {
    const { $toast, $apifetch } = useNuxtApp();
    const file = ref<File | null>(null);
    const loading = ref(false);
    async function uploadFile({ records = {}, url }: { records: Record<string, string | number | Blob> ; url: string }): Promise<any> {
        try {
            loading.value = true;
            const formData = new FormData();

            formData.append('file', file.value);
            Object.keys(records).forEach((key: string) => {
                const value = records[key];
                if (typeof value === 'string' || typeof value === 'number') {
                    formData.append(key, value.toString());
                }
                else if (value instanceof Blob) {
                    formData.append(key, value);
                }
            });
            const response: Response = await $apifetch(url, {
                method: 'POST',
                body: formData,
            });

            $toast({
                variant: 'success',
                description: 'Fichier uploadé avec succès',
            });

            return response;
        }
        catch (e) {
            if (e.response?.status === 422 && e.data?.errors) {
                const firstError = Object.values(e.data.errors)[0]?.[0] ?? 'Erreur lors de l\'upload du fichier';
                $toast({
                    title: firstError,
                    variant: 'destructive',
                });
            }
        }
        finally {
            loading.value = false;
        }
    }

    return {
        file,
        loading,
        uploadFile,
    };
}
