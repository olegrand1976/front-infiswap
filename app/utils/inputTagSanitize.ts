/**
 * Sanitize InputTagManager keystrokes.
 * Postal codes: digits only + max length. Cities: free text.
 */
export function sanitizeTagInput(
    raw: string,
    options: { digitsOnly?: boolean; maxLength?: number } = {},
): string {
    const digitsOnly = options.digitsOnly !== false;
    if (!digitsOnly) {
        return raw;
    }

    let clean = raw.replace(/\D/g, '');
    const maxLength = options.maxLength;
    if (typeof maxLength === 'number' && maxLength > 0 && clean.length > maxLength) {
        clean = clean.slice(0, maxLength);
    }

    return clean;
}
