export const LIFETIME_BADGE_REVEAL_STORAGE_KEY = 'infiswap:lifetime_badge_reveal';
export const LIFETIME_BADGE_REVEAL_TTL_MS = 60_000;

export function buildRevealPayload(now: number): string {
    return String(now);
}

export function parseRevealTimestamp(raw: string | null): number | null {
    if (!raw) {
        return null;
    }

    const timestamp = Number(raw);

    if (Number.isNaN(timestamp) || timestamp < 0) {
        return null;
    }

    return timestamp;
}

export function isRevealExpired(ageMs: number, ttlMs: number = LIFETIME_BADGE_REVEAL_TTL_MS): boolean {
    return ageMs < 0 || ageMs >= ttlMs;
}

export function shouldPlayRevealFromStorage(
    raw: string | null,
    now: number,
    ttlMs: number = LIFETIME_BADGE_REVEAL_TTL_MS,
): boolean {
    const timestamp = parseRevealTimestamp(raw);

    if (timestamp === null) {
        return false;
    }

    return !isRevealExpired(now - timestamp, ttlMs);
}
