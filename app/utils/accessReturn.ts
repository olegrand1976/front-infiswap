/** Chemin interne sûr pour la redirection après paiement (query `redirectTo` uniquement). */
export function safeReturnPath(path: unknown): string {
    if (typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/acces-plan')) {
        return path;
    }

    return '/dashboard';
}
