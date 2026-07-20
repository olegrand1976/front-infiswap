import { describe, expect, it } from 'vitest';
import {
    addSnoozeUntil,
    bootstrapOnboardingState,
    createEmptyOnboarding,
    detectSignalCompletedQuests,
    disableJourney,
    enableJourney,
    filterJourneyTips,
    getApplicableQuests,
    getNudgeThresholdDays,
    hasFirstAction,
    isEligibleForNetworkJourney,
    isJourneyComplete,
    JOURNEY_LEVELS,
    recordNudgeDisplay,
    resolveJourneyNudge,
    resolveJourneyState,
    resolveJourneyTip,
    resolveLevel,
    resolveLevelProgress,
    resolveNextQuest,
    resolveQuestXp,
    shouldRecordNudge,
    shouldShowNetworkJourney,
    syncOnboardingProgress,
    trackRouteVisit,
} from './networkJourney';

const nurseUser = {
    roles: ['nurse'],
    account_type: 'nurse',
    created_at: '2026-07-02T10:00:00',
    type: 'standard',
    referral_source: 'word_of_mouth',
    settings: JSON.stringify({
        replacement: {
            zip_codes: ['1000'],
            cities: ['Bruxelles'],
        },
        notification: {
            new_replacement: true,
        },
    }),
};

describe('networkJourney', () => {
    it('resolves levels from XP thresholds', () => {
        expect(resolveLevel(0).title).toBe('Curieuse');
        expect(resolveLevel(100).title).toBe('Exploratrice');
        expect(resolveLevel(700).title).toBe('Experte réseau');
    });

    it('assigns avatar assets per level', () => {
        for (const level of JOURNEY_LEVELS) {
            expect(level.avatarSrc).toContain(`/images/journey/level-${level.level}`);
            expect(level.avatarAlt.length).toBeGreaterThan(0);
        }
    });

    it('computes progress inside the current level', () => {
        expect(resolveLevelProgress(50).progressInLevel).toBeGreaterThan(0);
        expect(resolveLevelProgress(700).progressInLevel).toBe(100);
    });

    it('sums XP from completed quests', () => {
        expect(resolveQuestXp(['prefs_zone', 'browse_list'])).toBe(120);
    });

    it('detects first action from reports', () => {
        expect(hasFirstAction({ me: 0, reponded_per_month: [{ month: '2026-06', count: 1 }] })).toBe(true);
        expect(hasFirstAction({ me: 2 })).toBe(true);
        expect(hasFirstAction({ me: 0, reponded_per_month: [{ month: '2026-06', count: 0 }] })).toBe(false);
    });

    it('never includes discover_access quest', () => {
        expect(getApplicableQuests({
            roles: ['nurse'],
            created_at: '2026-07-02T10:00:00',
            platform_access_paid_at: null,
        }).map(quest => quest.id)).not.toContain('discover_access');

        const legacyUser = {
            roles: ['nurse'],
            created_at: '2026-05-01T10:00:00',
        };

        expect(getApplicableQuests(legacyUser).map(quest => quest.id)).not.toContain('discover_access');
    });

    it('bootstraps retroactive quests for active nurse', () => {
        const onboarding = bootstrapOnboardingState(
            nurseUser,
            { me: 1, reponded_per_month: [{ month: '2026-06', count: 1 }] },
            createEmptyOnboarding(),
            new Date('2026-07-06T12:00:00Z'),
        );

        expect(onboarding.bootstrapped_at).toBe(new Date('2026-07-06T12:00:00Z').toISOString());
        expect(onboarding.completed_quests).toEqual(expect.arrayContaining([
            'prefs_zone',
            'first_action',
            'notif_on',
        ]));
        expect(onboarding.last_progress_at).not.toBeNull();
        expect(onboarding.xp).toBeGreaterThan(0);
    });

    it('tracks replacement routes for browse and detail quests', () => {
        let onboarding = trackRouteVisit(createEmptyOnboarding(), '/dashboard/replacements');
        onboarding = trackRouteVisit(onboarding, '/dashboard/replacements/detail/42');

        const detected = detectSignalCompletedQuests(nurseUser, null, onboarding);

        expect(detected).toEqual(expect.arrayContaining(['browse_list', 'view_detail']));
    });

    it('resolves next quest in order', () => {
        const applicable = getApplicableQuests({
            roles: ['nurse'],
            created_at: '2026-05-01T10:00:00',
        });

        expect(resolveNextQuest([], applicable)?.id).toBe('prefs_zone');
        expect(resolveNextQuest(['prefs_zone'], applicable)?.id).toBe('browse_list');
    });

    it('marks journey complete when all applicable quests are done', () => {
        const applicable = getApplicableQuests({
            roles: ['nurse'],
            created_at: '2026-05-01T10:00:00',
        });

        expect(isJourneyComplete(applicable.map(quest => quest.id), applicable)).toBe(true);
    });

    it('hides journey when disabled or snoozed', () => {
        const disabled = disableJourney(createEmptyOnboarding());
        const snoozed = addSnoozeUntil(createEmptyOnboarding(), 7, new Date('2026-07-06T12:00:00Z'));

        expect(shouldShowNetworkJourney(nurseUser, disabled)).toBe(false);
        expect(shouldShowNetworkJourney(nurseUser, snoozed, { now: new Date('2026-07-06T13:00:00Z') })).toBe(false);
        expect(shouldShowNetworkJourney(nurseUser, snoozed, { now: new Date('2026-07-14T13:00:00Z') })).toBe(true);
    });

    it('re-enables journey from disabled state', () => {
        const enabled = enableJourney(disableJourney(createEmptyOnboarding()));

        expect(enabled.disabled).toBe(false);
        expect(enabled.disabled_at).toBeNull();
    });

    it('limits eligibility to medical roles outside admin/institution', () => {
        expect(isEligibleForNetworkJourney(nurseUser)).toBe(true);
        expect(isEligibleForNetworkJourney(nurseUser, { isAdmin: true })).toBe(false);
        expect(isEligibleForNetworkJourney({ roles: ['administrator'], type: 'standard' })).toBe(false);
    });

    it('resolves journey state with welcome message and visibility', () => {
        const state = resolveJourneyState(
            nurseUser,
            { me: 1 },
            bootstrapOnboardingState(nurseUser, { me: 1 }, createEmptyOnboarding()),
        );

        expect(state.completedCount).toBeGreaterThanOrEqual(2);
        expect(state.welcomeMessage).toContain('Bon retour');
        expect(state.nextQuest).not.toBeNull();
        expect(state.tip).not.toBeNull();
    });

    it('syncs XP when notifications are enabled later', () => {
        const synced = syncOnboardingProgress(
            nurseUser,
            null,
            {
                ...createEmptyOnboarding(),
                completed_quests: ['prefs_zone', 'browse_list', 'view_detail', 'first_action'],
            },
        );

        expect(synced.completed_quests).toContain('notif_on');
        expect(synced.xp).toBe(resolveQuestXp(synced.completed_quests));
    });

    it('never includes retired access or legacy paywall tips', () => {
        const tips = filterJourneyTips(nurseUser, resolveLevel(0), null, []);

        expect(tips.map(t => t.id)).not.toContain('access');
        expect(tips.map(t => t.id)).not.toContain('legacy');
    });

    it('resolves deterministic tip of the day', () => {
        const tip = resolveJourneyTip(
            nurseUser,
            resolveLevel(100),
            { id: 'browse_list', title: '', cta: '', xp: 40, route: '/', order: 2 },
            ['prefs_zone'],
            new Date('2026-07-06T12:00:00Z'),
        );

        expect(tip?.text.length).toBeGreaterThan(10);
        expect(tip?.category.length).toBeGreaterThan(0);
    });

    it('uses escalating nudge thresholds', () => {
        expect(getNudgeThresholdDays(0)).toBe(7);
        expect(getNudgeThresholdDays(1)).toBe(15);
        expect(getNudgeThresholdDays(3)).toBe(30);
    });

    it('shows nudge after 7 days without progress', () => {
        const onboarding = {
            ...createEmptyOnboarding(),
            bootstrapped_at: '2026-06-01T12:00:00Z',
            last_progress_at: '2026-06-01T12:00:00Z',
            completed_quests: ['prefs_zone'],
            nudge_count: 0,
            last_nudge_at: null,
        };

        const nudge = resolveJourneyNudge(onboarding, {
            isVisible: true,
            hasNextQuest: true,
            now: new Date('2026-06-10T12:00:00Z'),
        });

        expect(nudge?.show).toBe(true);
        expect(nudge?.daysSinceProgress).toBeGreaterThanOrEqual(7);
    });

    it('records nudge only once per stagnation cycle', () => {
        const onboarding = {
            ...createEmptyOnboarding(),
            bootstrapped_at: '2026-06-01T12:00:00Z',
            last_progress_at: '2026-06-01T12:00:00Z',
            nudge_count: 0,
            last_nudge_at: null,
        };

        const nudge = resolveJourneyNudge(onboarding, {
            isVisible: true,
            hasNextQuest: true,
            now: new Date('2026-06-10T12:00:00Z'),
        });

        expect(shouldRecordNudge(onboarding, nudge)).toBe(true);

        const recorded = recordNudgeDisplay(onboarding, new Date('2026-06-10T12:00:00Z'));
        expect(recorded.nudge_count).toBe(1);
        expect(shouldRecordNudge(recorded, nudge, new Date('2026-06-11T12:00:00Z'))).toBe(false);
    });
});
