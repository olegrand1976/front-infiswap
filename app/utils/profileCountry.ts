import type { ReplacementCountryCode } from '~/lib/replacementCountry';

type ProfileLike = {
    country?: string | null;
    working_at?: string | null;
} | null | undefined;

function mapKnownCountry(value: string): ReplacementCountryCode | null {
    const key = value.trim().toLowerCase();
    if (['be', 'belgique', 'belgium'].includes(key)) {
        return 'be';
    }
    if (['fr', 'france'].includes(key)) {
        return 'fr';
    }

    return null;
}

/** Mirrors back ReplacementCountry::tryFromProfilDetail (null = incomplete). */
export function resolveProfileCountryCode(profile: ProfileLike): ReplacementCountryCode | null {
    if (!profile) {
        return null;
    }

    if (profile.working_at && String(profile.working_at).trim()) {
        const first = String(profile.working_at).split(',')[0] ?? '';
        const fromWorkingAt = mapKnownCountry(first);
        if (fromWorkingAt) {
            return fromWorkingAt;
        }
    }

    if (profile.country && String(profile.country).trim()) {
        return mapKnownCountry(String(profile.country));
    }

    return null;
}

export function needsProfileCountryConfirmation(profile: ProfileLike): boolean {
    return resolveProfileCountryCode(profile) === null;
}

export function workingAtFromCountryCode(code: ReplacementCountryCode): string {
    return code === 'fr' ? 'France' : 'Belgique';
}
