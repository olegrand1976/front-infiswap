import { normalizeAnalyticsRoutePath } from '@/utils/analyticsRoutePath';

type PendingPageView = {
    route_path: string;
    route_name: string | null;
    viewed_at: string;
};

const MAX_BUFFER = 10;
const FLUSH_DELAY_MS = 5000;

let buffer: PendingPageView[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let isFlushing = false;

function scheduleFlush() {
    if (flushTimer) {
        return;
    }

    flushTimer = setTimeout(() => {
        flushTimer = null;
        void flushPageViews();
    }, FLUSH_DELAY_MS);
}

export async function flushPageViews(): Promise<void> {
    if (import.meta.server || isFlushing || buffer.length === 0) {
        return;
    }

    const batch = buffer.splice(0, MAX_BUFFER);
    isFlushing = true;

    try {
        const { $apifetch } = useNuxtApp();
        await $apifetch('api/analytics/page-views', {
            method: 'POST',
            body: { views: batch },
        });
    }
    catch {
        buffer.unshift(...batch);
    }
    finally {
        isFlushing = false;

        if (buffer.length >= MAX_BUFFER) {
            void flushPageViews();
        }
        else if (buffer.length > 0) {
            scheduleFlush();
        }
    }
}

export function trackPageView(path: string, routeName?: string | null): void {
    if (import.meta.server) {
        return;
    }

    const { isLoggedIn } = useAuth();

    if (!isLoggedIn.value) {
        return;
    }

    buffer.push({
        route_path: normalizeAnalyticsRoutePath(path),
        route_name: routeName ?? null,
        viewed_at: new Date().toISOString(),
    });

    if (buffer.length >= MAX_BUFFER) {
        void flushPageViews();
        return;
    }

    scheduleFlush();
}

export function resetPageViewTrackingForTests(): void {
    buffer = [];

    if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = null;
    }

    isFlushing = false;
}
