import {
    GOOGLE_REVIEW_SETTING_KEY,
    hasLeftGoogleReview,
    mergeGoogleReviewIntoSettings,
    parseUserSettings,
    type GoogleReviewSetting,
    type GoogleReviewSource,
} from '~/utils/googleReview';

export interface GoogleReviewPromptState {
    source: GoogleReviewSource;
}

export interface GoogleReviewPromptOptions {
    pendingRoute?: string;
}

export function useGoogleReviewPrompt() {
    const user = useUser();
    const { $apifetch } = useNuxtApp();
    const { trackEvent } = useProductAnalytics();
    const router = useRouter();

    const activePrompt = useState<GoogleReviewPromptState | null>('googleReviewPromptActive', () => null);
    const pendingNavigation = useState<string | null>('googleReviewPendingNavigation', () => null);

    function shouldShowPrompt(): boolean {
        return !hasLeftGoogleReview(user.value);
    }

    function updateUserSettingsCache(value: GoogleReviewSetting): void {
        if (!user.value) {
            return;
        }

        const currentSettings = parseUserSettings(user.value);
        const nextSettings = mergeGoogleReviewIntoSettings(currentSettings, value);
        user.value.settings = JSON.stringify(nextSettings);
    }

    function requestPrompt(source: GoogleReviewSource, options?: GoogleReviewPromptOptions): boolean {
        if (!shouldShowPrompt() || activePrompt.value) {
            return false;
        }

        if (options?.pendingRoute) {
            pendingNavigation.value = options.pendingRoute;
        }

        activePrompt.value = { source };
        return true;
    }

    async function finishPrompt(): Promise<void> {
        activePrompt.value = null;

        const route = pendingNavigation.value;
        pendingNavigation.value = null;

        if (route) {
            await router.replace(route);
        }
    }

    async function markReviewLeft(source: GoogleReviewSource): Promise<void> {
        const value: GoogleReviewSetting = {
            left_at: new Date().toISOString(),
            source,
        };

        await $apifetch('/api/users/settings', {
            method: 'POST',
            body: {
                key: GOOGLE_REVIEW_SETTING_KEY,
                value,
            },
        });

        updateUserSettingsCache(value);
        trackEvent('google_review_cta_click', { source });
        await finishPrompt();
    }

    async function dismissPrompt(): Promise<void> {
        if (activePrompt.value) {
            trackEvent('google_review_dismiss', { source: activePrompt.value.source });
        }

        await finishPrompt();
    }

    return {
        activePrompt,
        pendingNavigation,
        shouldShowPrompt,
        requestPrompt,
        markReviewLeft,
        dismissPrompt,
    };
}
