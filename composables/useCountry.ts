export const useCountry = () => {
    const url = useRequestURL();
    const host = url.hostname;
    const user = useUser();

    const defaultCountry = computed(() => {
        if (host.endsWith('.fr')) return 'France';
        if (host.endsWith('.be')) return 'Belgique';
        return 'Belgique';
    });

    const country = computed(() => {
        const userCountry = user.value?.profile?.working_at?.toLowerCase();
        if (userCountry === 'France') return 'France';
        if (userCountry === 'Belgique') return 'Belgique';
        return defaultCountry.value;
    });

    const identifierLabel = computed(() => {
        return country.value === 'France' ? 'RPPS' : 'INAMI';
    });

    return {
        country,
        identifierLabel,
    };
};
