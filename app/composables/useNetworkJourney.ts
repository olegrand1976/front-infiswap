import { useRoute } from 'vue-router';
import type { OnboardingState, QuestId } from '~/lib/networkJourney';
import {
    addSnoozeUntil,
    bootstrapOnboardingState,
    disableJourney,
    enableJourney,
    parseOnboardingState,
    recordNudgeDisplay,
    resolveJourneyState,
    shouldRecordNudge,
    suppressTipsAutoOpen,
    syncOnboardingProgress,
    trackRouteVisit,
} from '~/lib/networkJourney';

export const useNetworkJourney = () => {
    const user = useUser();
    const route = useRoute();
    const { $apifetch, $toast } = useNuxtApp();
    const { refresh, isAdmin, isInstitution } = useAuth();
    const { reports } = useReports();

    const onboarding = useState<OnboardingState>('networkJourneyOnboarding', () => parseOnboardingState(user.value));
    const isBootstrapping = useState('networkJourneyBootstrapping', () => false);
    const nursePrefsDialogRequest = useState('nursePrefsDialogRequest', () => 0);
    const lastCelebratedXp = useState<number>('networkJourneyLastCelebratedXp', () => 0);
    const nudgeRecordedThisSession = useState('networkJourneyNudgeRecorded', () => false);

    const replacementReport = computed(() => reports.value?.replacement ?? null);

    const journeyState = computed(() => resolveJourneyState(
        user.value,
        replacementReport.value,
        onboarding.value,
        {
            isAdmin: isAdmin.value,
            isInstitution: isInstitution.value,
        },
    ));

    const showWidget = computed(() => journeyState.value.isVisible);
    const isJourneyDisabled = computed(() => onboarding.value.disabled);

    const syncLocalOnboardingFromUser = () => {
        onboarding.value = parseOnboardingState(user.value);
    };

    const updateUserSettingsCache = (nextOnboarding: OnboardingState) => {
        if (!user.value) {
            return;
        }

        const currentSettings = typeof user.value.settings === 'string'
            ? JSON.parse(user.value.settings || '{}')
            : (user.value.settings ?? {});

        currentSettings.onboarding = nextOnboarding;
        user.value.settings = JSON.stringify(currentSettings);
    };

    const persistOnboarding = async (nextOnboarding: OnboardingState) => {
        onboarding.value = nextOnboarding;
        updateUserSettingsCache(nextOnboarding);

        await $apifetch('/api/users/settings', {
            method: 'POST',
            body: {
                key: 'onboarding',
                value: nextOnboarding,
            },
        });
    };

    const maybeRecordNudge = async () => {
        if (nudgeRecordedThisSession.value || !journeyState.value.nudge?.show) {
            return;
        }

        if (!shouldRecordNudge(onboarding.value, journeyState.value.nudge)) {
            return;
        }

        nudgeRecordedThisSession.value = true;
        await persistOnboarding(recordNudgeDisplay(onboarding.value));
    };

    const bootstrapJourney = async () => {
        if (!user.value || isBootstrapping.value) {
            return;
        }

        if (onboarding.value.bootstrapped_at) {
            const synced = syncOnboardingProgress(user.value, replacementReport.value, onboarding.value);
            if (JSON.stringify(synced) !== JSON.stringify(onboarding.value)) {
                await persistOnboarding(synced);
            }
            await maybeRecordNudge();
            return;
        }

        isBootstrapping.value = true;

        try {
            const bootstrapped = bootstrapOnboardingState(
                user.value,
                replacementReport.value,
                onboarding.value,
            );
            await persistOnboarding(bootstrapped);
            lastCelebratedXp.value = bootstrapped.xp;
            await maybeRecordNudge();
        }
        finally {
            isBootstrapping.value = false;
        }
    };

    const syncQuests = async () => {
        if (!user.value?.id || onboarding.value.disabled) {
            return;
        }

        const synced = syncOnboardingProgress(user.value, replacementReport.value, onboarding.value);

        if (JSON.stringify(synced) !== JSON.stringify(onboarding.value)) {
            nudgeRecordedThisSession.value = false;
            await persistOnboarding(synced);
        }

        await maybeRecordNudge();
    };

    const trackCurrentRoute = async (path = route.path) => {
        if (!user.value?.id || onboarding.value.disabled) {
            return;
        }

        const tracked = trackRouteVisit(onboarding.value, path);
        const synced = syncOnboardingProgress(user.value, replacementReport.value, tracked);

        if (JSON.stringify(synced) !== JSON.stringify(onboarding.value)) {
            nudgeRecordedThisSession.value = false;
            await persistOnboarding(synced);
        }

        await maybeRecordNudge();
    };

    const snooze = async (days = 7) => {
        const next = addSnoozeUntil(onboarding.value, days);
        await persistOnboarding(next);
        $toast({
            description: 'On vous laisse tranquille 7 jours. Le parcours réapparaîtra automatiquement.',
        });
    };

    const disable = async () => {
        const next = disableJourney(onboarding.value);
        await persistOnboarding(next);
        $toast({
            description: 'Parcours masqué. Réactivez-le quand vous voulez depuis Mon compte → Mon réseau InfiSwap.',
        });
    };

    const enable = async () => {
        const next = enableJourney(onboarding.value);
        await persistOnboarding(next);
        await refresh();
        syncLocalOnboardingFromUser();
        $toast({
            description: 'Mon réseau InfiSwap est réactivé.',
        });
    };

    const persistTipsAutoOpenDisabled = async () => {
        const next = suppressTipsAutoOpen(onboarding.value);
        await persistOnboarding(next);
    };

    const navigateToQuest = async (questId: QuestId) => {
        const quest = journeyState.value.nextQuest;

        if (!quest || quest.id !== questId) {
            return;
        }

        if (questId === 'prefs_zone') {
            nursePrefsDialogRequest.value += 1;
            await navigateTo('/dashboard');
            return;
        }

        await navigateTo(quest.route);
    };

    const celebrateXpGain = () => {
        const currentXp = journeyState.value.totalXp;

        if (currentXp <= lastCelebratedXp.value) {
            return null;
        }

        const gained = currentXp - lastCelebratedXp.value;
        lastCelebratedXp.value = currentXp;

        return {
            gained,
            levelTitle: journeyState.value.level.title,
        };
    };

    watch(
        () => user.value?.settings,
        async () => {
            syncLocalOnboardingFromUser();
            await syncQuests();
        },
    );

    watch(
        () => route.path,
        async (path) => {
            if (!journeyState.value.isVisible && !onboarding.value.bootstrapped_at) {
                return;
            }

            await trackCurrentRoute(path);
        },
        { immediate: true },
    );

    watch(
        replacementReport,
        async () => {
            await syncQuests();
        },
        { deep: true },
    );

    return {
        onboarding,
        journeyState,
        showWidget,
        isJourneyDisabled,
        bootstrapJourney,
        syncQuests,
        trackCurrentRoute,
        snooze,
        disable,
        enable,
        persistTipsAutoOpenDisabled,
        navigateToQuest,
        celebrateXpGain,
    };
};
