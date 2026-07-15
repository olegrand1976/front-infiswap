export function readRequestHeaders(raw: unknown): Record<string, string> {
    if (!raw) {
        return {};
    }

    if (raw instanceof Headers) {
        return Object.fromEntries(raw.entries());
    }

    if (Array.isArray(raw)) {
        return Object.fromEntries(raw);
    }

    return { ...(raw as Record<string, string>) };
}

export function extractBearerToken(authorization?: string): string | undefined {
    if (!authorization) {
        return undefined;
    }

    const match = authorization.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1]?.trim();

    return token || undefined;
}

function authorizationHeader(incoming: Record<string, string>): string | undefined {
    return incoming.Authorization ?? incoming.authorization;
}

export function resolveApiAuthorization(
    incoming: Record<string, string>,
    cookieToken?: string | null,
): string | undefined {
    return extractBearerToken(authorizationHeader(incoming))
        ?? (cookieToken ? String(cookieToken) : undefined);
}

export function buildApiRequestHeaders(
    incoming: Record<string, string>,
    cookieToken: string | null | undefined,
    language: string,
): Record<string, string> {
    const token = resolveApiAuthorization(incoming, cookieToken);

    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Accept-Language': language,
        ...incoming,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    else {
        delete headers.Authorization;
    }

    return headers;
}
