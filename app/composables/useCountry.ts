export type CountryCode = 'be' | 'fr';

const COUNTRY_LABELS: Record<CountryCode, string> = {
    be: 'Belgique',
    fr: 'France',
};

const codeFromValue = (value: string | undefined | null): CountryCode | null => {
    const v = value?.toLowerCase().trim();
    if (v === 'fr' || v === 'france') return 'fr';
    if (v === 'be' || v === 'belgique' || v === 'belgium') return 'be';
    return null;
};

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
        const code = codeFromValue(value);
        if (code === 'fr') return 'France';
        if (code === 'be') return 'Belgique';
        return undefined;
    };

    const allowedCountryCodes = computed((): CountryCode[] => {
        const profile = user.value?.profile;
        if (!profile) return ['be'];

        const isInstitution = user.value?.type === 'institution'
            || user.value?.account_type === 'institution';

        if (isInstitution) {
            const institutionCountry = user.value?.institution?.country ?? profile.country;
            return [institutionCountry === 'fr' ? 'fr' : 'be'];
        }

        const codes = new Set<CountryCode>();

        const homeCode = codeFromValue(profile.country);
        if (homeCode) codes.add(homeCode);

        if (profile.working_at) {
            for (const part of profile.working_at.split(',')) {
                const code = codeFromValue(part);
                if (code) codes.add(code);
            }
        }

        return codes.size > 0 ? [...codes] : ['be'];
    });

    const defaultCountryCode = computed((): CountryCode => {
        const allowed = allowedCountryCodes.value;
        const primaryWorking = profilePrimaryWorkingCode(user.value?.profile?.working_at);
        if (primaryWorking && allowed.includes(primaryWorking)) {
            return primaryWorking;
        }

        const home = codeFromValue(user.value?.profile?.country);
        if (home && allowed.includes(home)) {
            return home;
        }

        return allowed[0] ?? 'be';
    });

    const availableCountries = computed(() =>
        Object.fromEntries(
            allowedCountryCodes.value.map(code => [code, COUNTRY_LABELS[code]]),
        ) as Partial<Record<CountryCode, string>>,
    );

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
        allowedCountryCodes,
        defaultCountryCode,
        availableCountries,
        COUNTRY_LABELS,
    };
};

function profilePrimaryWorkingCode(workingAt: string | null | undefined): CountryCode | null {
    if (!workingAt) return null;
    return codeFromValue(workingAt.split(',')[0]);
}
