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

export type StripeProductReturnZone = 'platform' | 'boost' | 'contract' | 'sponsorship' | 'pro';

export interface StripeProductReturn {
    zone: StripeProductReturnZone;
    sessionId: string;
    outcome: 'success' | 'cancel';
}

/** Détecte un retour Stripe simulé ou réel depuis la query. */
export function parseStripeProductReturn(query: Record<string, unknown>): StripeProductReturn | null {
    const sessionId = extractStripeSessionId(query);

    if (!sessionId || !isStripeCheckoutSessionId(sessionId)) {
        return null;
    }

    if (query.pro === 'success') {
        return { zone: 'pro', sessionId, outcome: 'success' };
    }

    if (query.pro === 'cancel') {
        return { zone: 'pro', sessionId, outcome: 'cancel' };
    }

    if (query.sponsorship === 'success') {
        return { zone: 'sponsorship', sessionId, outcome: 'success' };
    }

    if (query.boost === 'success') {
        return { zone: 'boost', sessionId, outcome: 'success' };
    }

    if (query.boost === 'cancel') {
        return { zone: 'boost', sessionId, outcome: 'cancel' };
    }

    if (query.contract === 'success') {
        return { zone: 'contract', sessionId, outcome: 'success' };
    }

    if (query.contract === 'cancel') {
        return { zone: 'contract', sessionId, outcome: 'cancel' };
    }

    return { zone: 'platform', sessionId, outcome: 'success' };
}

/** Nettoie les paramètres de retour Stripe avant navigation replace. */
export function stripStripeReturnQuery(query: Record<string, unknown>): Record<string, unknown> {
    const next = { ...query };
    delete next.session_id;
    delete next.sponsorship;
    delete next.boost;
    delete next.contract;
    delete next.pro;

    return next;
}

/** Préserve le retour Stripe dans l'URL de login. */
export function buildLoginRedirectWithStripeReturn(path: string, query: Record<string, unknown>): string {
    const stripeReturn = parseStripeProductReturn(query);

    if (!stripeReturn) {
        return safeLoginRedirectPath(path);
    }

    const params = new URLSearchParams();
    params.set('session_id', stripeReturn.sessionId);

    switch (stripeReturn.zone) {
        case 'sponsorship':
            params.set('sponsorship', 'success');
            break;
        case 'boost':
            params.set('boost', stripeReturn.outcome);
            break;
        case 'contract':
            params.set('contract', stripeReturn.outcome);
            break;
        case 'pro':
            params.set('pro', stripeReturn.outcome);
            break;
        case 'platform':
            break;
        default: {
            const _exhaustive: never = stripeReturn.zone;
            void _exhaustive;
            break;
        }
    }

    const separator = path.includes('?') ? '&' : '?';

    return `${safeLoginRedirectPath(path)}${separator}${params.toString()}`;
}

const ALLOWED_EXTERNAL_REDIRECT_HOSTS = [
    'checkout.stripe.com',
    'billing.stripe.com',
    'documenso.com',
    'app.documenso.com',
    // Self-hosted Documenso (staging / prod Infiswap)
    'documenso.ll-it-sc.be',
] as const;

/** Valide une URL de redirection externe (Stripe Checkout, Documenso, …). */
export function assertAllowedExternalRedirectUrl(url: unknown): string | null {
    if (typeof url !== 'string' || url.length === 0) {
        return null;
    }

    try {
        const parsed = new URL(url);

        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
            return null;
        }

        const host = parsed.hostname.toLowerCase();
        const allowed = ALLOWED_EXTERNAL_REDIRECT_HOSTS.some(
            allowedHost => host === allowedHost || host.endsWith(`.${allowedHost}`),
        );

        return allowed ? parsed.toString() : null;
    }
    catch {
        return null;
    }
}
