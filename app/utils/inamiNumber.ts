/**
 * Validation format numéro INAMI (Belgique) — alignée sur le back InamiNumber.
 * Check-digit : C = M − (N mod M), M ∈ {97, 89, 83, 79}.
 */

export const INAMI_MODULOS = [97, 89, 83, 79] as const;

export function inamiDigits(value?: string | null): string {
    return String(value ?? '').replace(/\D/g, '');
}

export function hasValidInamiCheckDigit(digits: string): boolean {
    if (digits.length < 8) {
        return false;
    }

    const n = Number.parseInt(digits.slice(0, 6), 10);
    const c = Number.parseInt(digits.slice(6, 8), 10);

    if (Number.isNaN(n) || Number.isNaN(c)) {
        return false;
    }

    return INAMI_MODULOS.some((modulo) => {
        const expected = modulo - (n % modulo);
        return expected === c;
    });
}

/** Chaîne vide = OK (champ optionnel). */
export function isValidInamiFormat(value?: string | null): boolean {
    const digits = inamiDigits(value);

    if (digits === '') {
        return true;
    }

    if (digits.length !== 8 && digits.length !== 11) {
        return false;
    }

    return hasValidInamiCheckDigit(digits);
}

export const INAMI_FORMAT_ERROR
    = 'Le numéro INAMI est invalide (chiffre de contrôle ou longueur).';
