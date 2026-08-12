import type { ConfirmAccessOutcome } from '~/utils/accessReturn';

/** Le back renvoie `outcome` à plat ; `status` porte le libellé traduit de jsonResponse(). */
export function parseProOutcome(
    response: { outcome?: string } | null,
    error?: unknown,
): ConfirmAccessOutcome {
    if (!error) {
        if (response?.outcome === 'active') {
            return 'active';
        }

        if (response?.outcome === 'pending') {
            return 'pending';
        }

        return 'error';
    }

    const err = error as { status?: number; data?: { outcome?: string } };

    if (err?.status === 401 || err?.status === 403) {
        return 'auth_error';
    }

    if (err?.status === 202 || err?.data?.outcome === 'pending') {
        return 'pending';
    }

    return 'error';
}
