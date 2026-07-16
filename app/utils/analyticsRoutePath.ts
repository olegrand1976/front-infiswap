const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeAnalyticsRoutePath(path: string): string {
    const trimmed = path.trim() || '/';
    const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    const segments = normalized.split('/').filter(Boolean);

    const mapped = segments.map((segment) => {
        if (/^\d+$/.test(segment) || UUID_PATTERN.test(segment)) {
            return ':id';
        }

        return segment;
    });

    return mapped.length === 0 ? '/' : `/${mapped.join('/')}`;
}

export function shortenRoutePath(path: string, maxLength = 40): string {
    if (path.length <= maxLength) {
        return path;
    }

    return `…${path.slice(-(maxLength - 1))}`;
}
