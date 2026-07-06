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

/** Attend la fin du bootstrap auth (plugin auth.ts). */
export async function waitForAuthReady(timeoutMs = 5000): Promise<boolean> {
    const authReady = useState<boolean>('authReady', () => false);
    const start = Date.now();

    while (!authReady.value && Date.now() - start < timeoutMs) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    return authReady.value;
}
