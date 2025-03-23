export function useFile() {
    const { $toast, $apifetch } = useNuxtApp();
    const file = ref<File | null>(null);
    const loading = ref(false);
    async function uploadFile({ records = {}, url }: { records: Record<string, string | number | Blob> ; url: string }): Promise<void> {
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
            await $apifetch(url, {
                method: 'POST',
                body: formData,
            });

            $toast({
                variant: 'success',
                description: 'Fichier uploadé avec succès',
            });
        }
        catch (e) {
            $toast({
                variant: 'destructive',
                description: 'Erreur lors de l\'upload du fichier',
            });
            console.error(e);
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
