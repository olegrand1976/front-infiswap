import { REPLACEMENT_COUNTRIES } from './constants';

export type ReplacementCountryCode = 'be' | 'fr';

const codeByStoredValue: Record<string, ReplacementCountryCode> = {
    be: 'be',
    fr: 'fr',
    belgique: 'be',
    france: 'fr',
};

export function toReplacementCountryCode(stored?: string | null): ReplacementCountryCode {
    if (!stored) {
        return 'be';
    }

    return codeByStoredValue[stored.toLowerCase()] ?? 'be';
}

export function replacementCountryLabel(stored?: string | null): string {
    const code = toReplacementCountryCode(stored);
    const match = REPLACEMENT_COUNTRIES.find(option => option.value === code);

    return match?.label ?? stored ?? '—';
}
