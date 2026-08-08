/**
 * Password reset helpers — ofetch returns the parsed JSON body on HTTP 2xx,
 * not a Fetch Response. Never require `payload.status === 200`.
 */

export type PasswordResetApiPayload = {
    message?: string;
    status?: number;
};

export type ResetPasswordQueryParams = {
    email: string;
    token: string;
};

export type PasswordRequirementKey = 'length' | 'uppercase' | 'digit' | 'match';

export type PasswordRequirement = {
    key: PasswordRequirementKey;
    met: boolean;
};

/**
 * Laravel forgot/reset success body is `{ message: string }`.
 * ofetch resolves with that body — `status` is absent (undefined !== 200 was the regression).
 */
export function shouldShowPasswordResetSuccess(payload: unknown): boolean {
    if (payload === null || payload === undefined) {
        return true;
    }

    if (typeof payload !== 'object') {
        return false;
    }

    const body = payload as PasswordResetApiPayload;

    if (typeof body.status === 'number') {
        return body.status >= 200 && body.status < 300;
    }

    if (typeof body.message === 'string' && body.message.length > 0) {
        return true;
    }

    // Settled ofetch call with empty/unknown 2xx body still counts as success.
    return !('success' in body) || Boolean((body as { success?: unknown }).success);
}

export function parseResetPasswordQuery(
    query: Record<string, unknown> | URLSearchParams | null | undefined,
): ResetPasswordQueryParams | null {
    if (!query) {
        return null;
    }

    let email = '';
    let token = '';

    if (query instanceof URLSearchParams) {
        email = query.get('email') ?? '';
        token = query.get('token') ?? '';
    }
    else {
        const rawEmail = query.email;
        const rawToken = query.token;
        email = typeof rawEmail === 'string' ? rawEmail : Array.isArray(rawEmail) ? String(rawEmail[0] ?? '') : '';
        token = typeof rawToken === 'string' ? rawToken : Array.isArray(rawToken) ? String(rawToken[0] ?? '') : '';
    }

    if (!email || !token) {
        return null;
    }

    return { email, token };
}

export function evaluatePasswordRequirements(
    password: string,
    passwordConfirm: string,
): PasswordRequirement[] {
    return [
        { key: 'length', met: password.length >= 8 },
        { key: 'uppercase', met: /[A-Z]/.test(password) },
        { key: 'digit', met: /\d/.test(password) },
        {
            key: 'match',
            met: password.length > 0 && password === passwordConfirm,
        },
    ];
}

export function firstUnmetPasswordRequirement(
    password: string,
    passwordConfirm: string,
): PasswordRequirement | null {
    return evaluatePasswordRequirements(password, passwordConfirm).find(req => !req.met) ?? null;
}

export function buildResetPasswordPayload(
    email: string,
    password: string,
    passwordConfirm: string,
    token: string,
): Record<string, string> {
    return {
        email,
        password,
        password_confirmation: passwordConfirm,
        token,
    };
}
