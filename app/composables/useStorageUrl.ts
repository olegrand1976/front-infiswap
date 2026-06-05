export function useStorageUrl() {
    const config = useRuntimeConfig();

    function getStorageUrl(path: string | null | undefined): string | null {
        if (!path) return null;

        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }

        const normalized = path.startsWith('/') ? path.slice(1) : path;

        if (normalized.startsWith('storage/')) {
            return `${config.public.API_URL}/${normalized}`;
        }

        return `${config.public.API_URL}/storage/${normalized}`;
    }

    return { getStorageUrl };
}
