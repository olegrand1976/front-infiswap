import {
    GOOGLE_REVIEW_SETTING_KEY,
    hasLeftGoogleReview,
    mergeGoogleReviewIntoSettings,
    parseUserSettings,
    type GoogleReviewSetting,
    type GoogleReviewSource,
} from '~/utils/googleReview';

export interface PostSuccessEngagementState {
    source: GoogleReviewSource;
}

export interface PostSuccessEngagementOptions {
    pendingRoute?: string;
}

export function usePostSuccessEngagement() {
    const user = useUser();
    const { $apifetch } = useNuxtApp();
    const { trackEvent } = useProductAnalytics();
    const router = useRouter();

    const activeEngagement = useState<PostSuccessEngagementState | null>('postSuccessEngagementActive', () => null);
    const pendingNavigation = useState<string | null>('postSuccessEngagementPendingNavigation', () => null);

    function shouldShowEngagement(): boolean {
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

    function requestEngagement(source: GoogleReviewSource, options?: PostSuccessEngagementOptions): boolean {
        if (!shouldShowEngagement() || activeEngagement.value) {
            return false;
        }

        if (options?.pendingRoute) {
            pendingNavigation.value = options.pendingRoute;
        }

        activeEngagement.value = { source };
        return true;
    }

    async function finishEngagement(): Promise<void> {
        activeEngagement.value = null;

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
        await finishEngagement();
    }

    async function dismissEngagement(): Promise<void> {
        if (activeEngagement.value) {
            trackEvent('google_review_dismiss', { source: activeEngagement.value.source });
        }

        await finishEngagement();
    }

    const authWatchRegistered = useState('postSuccessEngagementAuthWatch', () => false);

    if (import.meta.client && !authWatchRegistered.value) {
        authWatchRegistered.value = true;

        watch(user, (nextUser) => {
            if (!nextUser) {
                activeEngagement.value = null;
                pendingNavigation.value = null;
            }
        });
    }

    return {
        activeEngagement,
        pendingNavigation,
        shouldShowEngagement,
        requestEngagement,
        markReviewLeft,
        dismissEngagement,
        finishEngagement,
    };
}
