/** Chemin interne sûr pour la redirection après paiement (query `redirectTo` uniquement). */
export function safeReturnPath(path: unknown): string {
    if (typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/acces-plan')) {
        return path;
    }

    return '/dashboard';
}

/** Chemin de retour après login (autorise /acces-plan?session_id=…). */
export function safeLoginRedirectPath(path: unknown): string {
    if (typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')) {
        return path;
    }

    return '/dashboard';
}

export type ConfirmAccessOutcome = 'active' | 'pending' | 'auth_error' | 'error';

/** Valide le format d'un id de session Stripe Checkout. */
export function isStripeCheckoutSessionId(sessionId: string): boolean {
    return sessionId.startsWith('cs_');
}

/** Interprète la réponse ou l'erreur HTTP de POST /api/subscription/confirm. */
export function parseConfirmAccessOutcome(
    response: { status?: string } | null,
    error?: unknown,
): ConfirmAccessOutcome {
    if (!error) {
        return response?.status === 'active' ? 'active' : 'pending';
    }

    const err = error as { status?: number; data?: { status?: string } };

    if (err?.status === 401 || err?.status === 403) {
        return 'auth_error';
    }

    if (err?.status === 202 && err?.data?.status === 'pending') {
        return 'pending';
    }

    return 'error';
}

/** Extrait session_id depuis la query (Stripe). */
export function extractStripeSessionId(query: Record<string, unknown>): string | null {
    const raw = query.session_id;

    if (typeof raw === 'string' && raw.length > 0) {
        return raw;
    }

    if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].length > 0) {
        return raw[0];
    }

    return null;
}

/** Attend la fin du bootstrap auth (plugin auth.ts). */
export async function waitForAuthReady(timeoutMs = 5000): Promise<boolean> {
    const authReady = useState<boolean>('authReady', () => false);
    const start = Date.now();

    while (!authReady.value && Date.now() - start < timeoutMs) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    return authReady.value;
}
