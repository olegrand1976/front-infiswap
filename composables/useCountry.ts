export const useCountry = () => {
    const url = useRequestURL();
    const host = url.hostname;
    const user = useUser();
    const defaultCountry = computed(() => {
        if (host.endsWith('.fr')) return 'France';
        if (host.endsWith('.be')) return 'Belgique';
        return 'Belgique';
    });

    const normalizeCountry = (value: string | undefined | null): 'France' | 'Belgique' | undefined => {
        const v = value?.toLowerCase().trim();
        if (v === 'france') return 'France';
        if (v === 'belgique') return 'Belgique';
        return undefined;
    };

    const country = computed(() => {
        const userCountry = normalizeCountry(user.value?.profile?.working_at);
        return userCountry || defaultCountry.value;
    });

    const identifierLabel = computed(() => {
        return country.value === 'France' ? 'RPPS' : 'INAMI';
    });

    return {
        country,
        identifierLabel,
    };
};
