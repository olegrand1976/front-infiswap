import {
    isPlatformAccessRole,
    resolvePlatformAccessRoles,
} from '../utils/platformAccess';

export type QuestId =
    | 'prefs_zone'
    | 'browse_list'
    | 'view_detail'
    | 'first_action'
    | 'notif_on';

export interface Quest {
    id: QuestId;
    title: string;
    cta: string;
    xp: number;
    route: string;
    optional?: boolean;
    order: number;
}

export interface OnboardingState {
    xp: number;
    completed_quests: QuestId[];
    visited_routes: string[];
    bootstrapped_at: string | null;
    snoozed_until: string | null;
    disabled: boolean;
    disabled_at: string | null;
    completed_at: string | null;
    last_progress_at: string | null;
    nudge_count: number;
    last_nudge_at: string | null;
    tips_auto_open_disabled: boolean;
}

export interface JourneyLevel {
    level: number;
    title: string;
    minXp: number;
    maxXp: number | null;
    avatarSrc: string;
    avatarAlt: string;
    mood: string;
}

export interface NurseReplacementReport {
    me?: number;
    reponded_per_month?: Array<{ month: string; count: number }>;
}

export interface JourneyUser {
    settings?: string | Record<string, unknown> | null;
    referral_source?: string | null;
    roles?: string[];
    account_type?: string | null;
    created_at?: string | null;
    platform_access_paid_at?: string | null;
    type?: string;
}

export interface JourneyContext {
    isAdmin?: boolean;
    isInstitution?: boolean;
    now?: Date;
}

export interface JourneyState {
    onboarding: OnboardingState;
    level: JourneyLevel;
    progressInLevel: number;
    totalXp: number;
    nextQuest: Quest | null;
    completedCount: number;
    totalQuests: number;
    welcomeMessage: string;
    isComplete: boolean;
    isVisible: boolean;
    nudge: JourneyNudge | null;
    tip: JourneyTip | null;
}

export interface JourneyTip {
    text: string;
    category: string;
}

export interface JourneyNudge {
    show: boolean;
    daysSinceProgress: number;
    message: string;
}

export interface JourneyTipDefinition {
    id: string;
    text: string;
    category: string;
    questId?: QuestId;
    minLevel?: number;
}

export const JOURNEY_LEVELS: JourneyLevel[] = [
    {
        level: 1,
        title: 'Curieuse',
        minXp: 0,
        maxXp: 99,
        avatarSrc: '/images/journey/level-1-curieuse.svg',
        avatarAlt: 'Avatar Curieuse — infirmière avec une loupe',
        mood: 'Tout explorer avec curiosité',
    },
    {
        level: 2,
        title: 'Exploratrice',
        minXp: 100,
        maxXp: 249,
        avatarSrc: '/images/journey/level-2-exploratrice.svg',
        avatarAlt: 'Avatar Exploratrice — boussole et carte',
        mood: 'Les premiers pas sur le réseau',
    },
    {
        level: 3,
        title: 'Connectée',
        minXp: 250,
        maxXp: 449,
        avatarSrc: '/images/journey/level-3-connectee.svg',
        avatarAlt: 'Avatar Connectée — réseau et écouteurs',
        mood: 'Bien branchée au réseau',
    },
    {
        level: 4,
        title: 'Active',
        minXp: 450,
        maxXp: 699,
        avatarSrc: '/images/journey/level-4-active.svg',
        avatarAlt: 'Avatar Active — cape et pouce levé',
        mood: 'Autonome et efficace',
    },
    {
        level: 5,
        title: 'Experte réseau',
        minXp: 700,
        maxXp: null,
        avatarSrc: '/images/journey/level-5-experte.svg',
        avatarAlt: 'Avatar Experte réseau — médaille dorée',
        mood: 'La référence du réseau',
    },
];

export const QUESTS: Quest[] = [
    {
        id: 'prefs_zone',
        title: 'Définir codes postaux + rayon',
        cta: 'Configurer ma zone',
        xp: 80,
        route: '/dashboard',
        order: 1,
    },
    {
        id: 'browse_list',
        title: 'Explorer les annonces',
        cta: 'Voir les remplacements',
        xp: 40,
        route: '/dashboard/replacements',
        order: 2,
    },
    {
        id: 'view_detail',
        title: 'Consulter une fiche remplacement',
        cta: 'Ouvrir une annonce',
        xp: 40,
        route: '/dashboard/replacements',
        order: 3,
    },
    {
        id: 'first_action',
        title: 'Répondre ou publier un remplacement',
        cta: 'Passer à l\'action',
        xp: 120,
        route: '/dashboard/replacements',
        order: 5,
    },
    {
        id: 'notif_on',
        title: 'Activer les alertes remplacement',
        cta: 'Activer les notifications',
        xp: 60,
        route: '/dashboard/settings',
        order: 6,
    },
];

export const SNOOZE_DAYS = 7;

export const JOURNEY_TIPS: JourneyTipDefinition[] = [
    { id: 'radius', text: 'Ajustez votre rayon : plus il est large, plus vous voyez d\'annonces pertinentes.', category: 'Zone de recherche', questId: 'prefs_zone' },
    { id: 'zip', text: 'Ajoutez plusieurs codes postaux pour couvrir vos secteurs habituels.', category: 'Zone de recherche', questId: 'prefs_zone' },
    { id: 'browse', text: 'Consultez la liste des remplacements chaque semaine — de nouvelles missions arrivent souvent.', category: 'Découverte', questId: 'browse_list' },
    { id: 'detail', text: 'Ouvrez les fiches détail pour voir les horaires, types de soins et localisation précise.', category: 'Découverte', questId: 'view_detail' },
    { id: 'fast', text: 'Répondez vite aux remplacements proches de chez vous — les missions partent souvent en quelques heures.', category: 'Action', questId: 'first_action', minLevel: 2 },
    { id: 'publish', text: 'Publiez votre propre remplacement quand vous cherchez de l\'aide — le réseau répond rapidement.', category: 'Action', questId: 'first_action', minLevel: 2 },
    { id: 'notif', text: 'Activez les alertes email pour être prévenue dès qu\'une annonce correspond à votre zone.', category: 'Notifications', questId: 'notif_on' },
    { id: 'notif2', text: 'Les notifications vous évitent de rater une mission qui correspond à votre profil.', category: 'Notifications', questId: 'notif_on' },
    { id: 'filter', text: 'Filtrez les remplacements par période et code postal pour gagner du temps.', category: 'Navigation', minLevel: 2 },
    { id: 'profile', text: 'Un profil complet inspire confiance aux collègues qui consultent vos réponses.', category: 'Profil', minLevel: 3 },
    { id: 'regular', text: 'Revenez régulièrement sur le dashboard : InfiSwap s\'améliore pour vous chaque jour.', category: 'Habitude', minLevel: 1 },
    { id: 'zone', text: 'Affinez votre zone de recherche après chaque mission — vous recevrez des annonces plus ciblées.', category: 'Zone de recherche', minLevel: 3 },
    { id: 'expert', text: 'Vous êtes presque Experte réseau — une dernière étape et c\'est dans la poche !', category: 'Motivation', minLevel: 4 },
];

export const REPLACEMENTS_LIST_ROUTE = '/dashboard/replacements';
export const REPLACEMENT_DETAIL_ROUTE_PREFIX = '/dashboard/replacements/detail/';

export function createEmptyOnboarding(): OnboardingState {
    return {
        xp: 0,
        completed_quests: [],
        visited_routes: [],
        bootstrapped_at: null,
        snoozed_until: null,
        disabled: false,
        disabled_at: null,
        completed_at: null,
        last_progress_at: null,
        nudge_count: 0,
        last_nudge_at: null,
        tips_auto_open_disabled: false,
    };
}

export function parseUserSettings(user: JourneyUser | null | undefined): Record<string, unknown> {
    if (!user?.settings) {
        return {};
    }

    if (typeof user.settings === 'object') {
        return user.settings as Record<string, unknown>;
    }

    try {
        return JSON.parse(user.settings) as Record<string, unknown>;
    }
    catch {
        return {};
    }
}

export function parseOnboardingState(user: JourneyUser | null | undefined): OnboardingState {
    const settings = parseUserSettings(user);
    const raw = settings.onboarding;

    if (!raw || typeof raw !== 'object') {
        return createEmptyOnboarding();
    }

    const onboarding = raw as Partial<OnboardingState>;

    return {
        xp: typeof onboarding.xp === 'number' ? onboarding.xp : 0,
        completed_quests: Array.isArray(onboarding.completed_quests)
            ? onboarding.completed_quests.filter(isQuestId)
            : [],
        visited_routes: Array.isArray(onboarding.visited_routes)
            ? onboarding.visited_routes.filter((route): route is string => typeof route === 'string')
            : [],
        bootstrapped_at: typeof onboarding.bootstrapped_at === 'string' ? onboarding.bootstrapped_at : null,
        snoozed_until: typeof onboarding.snoozed_until === 'string' ? onboarding.snoozed_until : null,
        disabled: onboarding.disabled === true,
        disabled_at: typeof onboarding.disabled_at === 'string' ? onboarding.disabled_at : null,
        completed_at: typeof onboarding.completed_at === 'string' ? onboarding.completed_at : null,
        last_progress_at: typeof onboarding.last_progress_at === 'string' ? onboarding.last_progress_at : null,
        nudge_count: typeof onboarding.nudge_count === 'number' ? onboarding.nudge_count : 0,
        last_nudge_at: typeof onboarding.last_nudge_at === 'string' ? onboarding.last_nudge_at : null,
        tips_auto_open_disabled: onboarding.tips_auto_open_disabled === true,
    };
}

function isQuestId(value: unknown): value is QuestId {
    return typeof value === 'string' && QUESTS.some(quest => quest.id === value);
}

export function getApplicableQuests(user: JourneyUser | null | undefined): Quest[] {
    return [...QUESTS].sort((a, b) => a.order - b.order);
}

export function arePreferencesConfigured(user: JourneyUser | null | undefined): boolean {
    if (!user?.settings) {
        return false;
    }

    const settings = parseUserSettings(user);
    const replacement = settings.replacement as { zip_codes?: string[]; cities?: string[] } | undefined;
    const hasZipCodes = (replacement?.zip_codes?.filter(Boolean).length ?? 0) > 0;
    const hasCities = (replacement?.cities?.filter(Boolean).length ?? 0) > 0;
    const hasReferral = Boolean(user.referral_source);

    return hasZipCodes && hasCities && hasReferral;
}

export function hasFirstAction(report: NurseReplacementReport | null | undefined): boolean {
    if (!report) {
        return false;
    }

    if ((report.me ?? 0) > 0) {
        return true;
    }

    return (report.reponded_per_month ?? []).some(item => item.count > 0);
}

export function hasNotificationsEnabled(user: JourneyUser | null | undefined): boolean {
    const settings = parseUserSettings(user);
    const notification = settings.notification as { new_replacement?: boolean } | undefined;

    return notification?.new_replacement === true;
}

export function hasVisitedReplacementsList(onboarding: OnboardingState): boolean {
    return onboarding.visited_routes.includes(REPLACEMENTS_LIST_ROUTE);
}

export function hasVisitedReplacementDetail(onboarding: OnboardingState): boolean {
    return onboarding.visited_routes.some(route => route.startsWith(REPLACEMENT_DETAIL_ROUTE_PREFIX));
}

export function detectSignalCompletedQuests(
    user: JourneyUser | null | undefined,
    report: NurseReplacementReport | null | undefined,
    onboarding: OnboardingState,
): QuestId[] {
    const completed: QuestId[] = [];

    if (arePreferencesConfigured(user)) {
        completed.push('prefs_zone');
    }

    if (hasVisitedReplacementsList(onboarding)) {
        completed.push('browse_list');
    }

    if (hasVisitedReplacementDetail(onboarding)) {
        completed.push('view_detail');
    }

    if (hasFirstAction(report)) {
        completed.push('first_action');
    }

    if (hasNotificationsEnabled(user)) {
        completed.push('notif_on');
    }

    return completed;
}

export function mergeCompletedQuests(
    current: QuestId[],
    detected: QuestId[],
    applicableQuests: Quest[],
): QuestId[] {
    const applicableIds = new Set(applicableQuests.map(quest => quest.id));
    const merged = new Set<QuestId>(current);

    for (const questId of detected) {
        if (applicableIds.has(questId)) {
            merged.add(questId);
        }
    }

    return QUESTS
        .map(quest => quest.id)
        .filter(questId => merged.has(questId));
}

export function resolveQuestXp(completedQuests: QuestId[]): number {
    return completedQuests.reduce((total, questId) => {
        const quest = QUESTS.find(item => item.id === questId);
        return total + (quest?.xp ?? 0);
    }, 0);
}

export function resolveLevel(xp: number): JourneyLevel {
    let current = JOURNEY_LEVELS[0]!;

    for (const level of JOURNEY_LEVELS) {
        if (xp >= level.minXp) {
            current = level;
        }
    }

    return current;
}

export function resolveLevelProgress(xp: number): { level: JourneyLevel; progressInLevel: number } {
    const level = resolveLevel(xp);

    if (level.maxXp === null) {
        return { level, progressInLevel: 100 };
    }

    const span = level.maxXp - level.minXp + 1;
    const xpInLevel = Math.min(span, Math.max(0, xp - level.minXp));
    const progressInLevel = Math.round((xpInLevel / span) * 100);

    return { level, progressInLevel };
}

export function resolveNextQuest(
    completedQuests: QuestId[],
    applicableQuests: Quest[],
): Quest | null {
    return applicableQuests.find(quest => !completedQuests.includes(quest.id)) ?? null;
}

export function isJourneyComplete(
    completedQuests: QuestId[],
    applicableQuests: Quest[],
): boolean {
    return applicableQuests.every(quest => completedQuests.includes(quest.id));
}

export function resolveWelcomeMessage(completedCount: number, totalQuests: number): string {
    if (completedCount >= 2) {
        const remaining = Math.max(totalQuests - completedCount, 0);
        return `Bon retour ! Vous avez déjà ${completedCount} étapes validées — plus que ${remaining} !`;
    }

    return 'Bienvenue ! Complétez quelques étapes et devenez Experte réseau.';
}

export function isSnoozeActive(onboarding: OnboardingState, now: Date = new Date()): boolean {
    if (!onboarding.snoozed_until) {
        return false;
    }

    return new Date(onboarding.snoozed_until) > now;
}

export function isEligibleForNetworkJourney(
    user: JourneyUser | null | undefined,
    context: JourneyContext = {},
): boolean {
    if (!user) {
        return false;
    }

    if (context.isAdmin || context.isInstitution || user.type === 'institution') {
        return false;
    }

    return isPlatformAccessRole(resolvePlatformAccessRoles(user));
}

export function shouldShowNetworkJourney(
    user: JourneyUser | null | undefined,
    onboarding: OnboardingState,
    context: JourneyContext = {},
): boolean {
    if (!isEligibleForNetworkJourney(user, context)) {
        return false;
    }

    if (onboarding.disabled || onboarding.completed_at) {
        return false;
    }

    if (isSnoozeActive(onboarding, context.now)) {
        return false;
    }

    return true;
}

export function trackRouteVisit(
    onboarding: OnboardingState,
    routePath: string,
): OnboardingState {
    const normalized = routePath.split('?')[0] ?? routePath;
    const visited = new Set(onboarding.visited_routes);

    if (normalized === REPLACEMENTS_LIST_ROUTE || normalized.startsWith(REPLACEMENT_DETAIL_ROUTE_PREFIX)) {
        visited.add(normalized);
    }

    return {
        ...onboarding,
        visited_routes: Array.from(visited),
    };
}

export function daysBetween(from: Date, to: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((to.getTime() - from.getTime()) / msPerDay);
}

export function getNudgeThresholdDays(nudgeCount: number): number {
    if (nudgeCount <= 0) {
        return 7;
    }

    if (nudgeCount === 1) {
        return 15;
    }

    return 30;
}

export function filterJourneyTips(
    _user: JourneyUser | null | undefined,
    level: JourneyLevel,
    nextQuest: Quest | null,
    completedQuests: QuestId[],
): JourneyTipDefinition[] {
    return JOURNEY_TIPS.filter((tip) => {
        if (tip.minLevel && level.level < tip.minLevel) {
            return false;
        }

        if (tip.questId && !completedQuests.includes(tip.questId) && nextQuest?.id !== tip.questId) {
            return false;
        }

        return true;
    });
}

export function resolveJourneyTip(
    user: JourneyUser | null | undefined,
    level: JourneyLevel,
    nextQuest: Quest | null,
    completedQuests: QuestId[],
    now: Date = new Date(),
): JourneyTip | null {
    const eligible = filterJourneyTips(user, level, nextQuest, completedQuests);

    if (!eligible.length) {
        return null;
    }

    const daySeed = `${now.toISOString().slice(0, 10)}-${nextQuest?.id ?? 'general'}-${level.level}`;
    const hash = daySeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const tip = eligible[hash % eligible.length]!;

    return {
        text: tip.text,
        category: tip.category,
    };
}

export function resolveJourneyNudge(
    onboarding: OnboardingState,
    options: {
        isVisible: boolean;
        hasNextQuest: boolean;
        now?: Date;
    },
): JourneyNudge | null {
    if (!options.isVisible || !options.hasNextQuest || !onboarding.bootstrapped_at) {
        return null;
    }

    const now = options.now ?? new Date();
    const lastProgressAt = onboarding.last_progress_at ?? onboarding.bootstrapped_at;
    const daysSinceProgress = daysBetween(new Date(lastProgressAt), now);
    const threshold = getNudgeThresholdDays(onboarding.nudge_count);

    if (onboarding.last_nudge_at && onboarding.last_progress_at) {
        if (new Date(onboarding.last_progress_at) > new Date(onboarding.last_nudge_at)) {
            return null;
        }
    }

    const referenceDate = onboarding.last_nudge_at
        ? new Date(onboarding.last_nudge_at)
        : new Date(lastProgressAt);
    const daysSinceReference = daysBetween(referenceDate, now);

    if (daysSinceProgress < threshold || daysSinceReference < threshold) {
        return null;
    }

    return {
        show: true,
        daysSinceProgress,
        message: `Il y a ${daysSinceProgress} jours que vous n'avez pas avancé — une petite étape suffit !`,
    };
}

export function shouldRecordNudge(onboarding: OnboardingState, nudge: JourneyNudge | null, now: Date = new Date()): boolean {
    if (!nudge?.show) {
        return false;
    }

    if (!onboarding.last_nudge_at) {
        return true;
    }

    if (onboarding.last_progress_at && new Date(onboarding.last_progress_at) > new Date(onboarding.last_nudge_at)) {
        return false;
    }

    const threshold = getNudgeThresholdDays(onboarding.nudge_count);
    return daysBetween(new Date(onboarding.last_nudge_at), now) >= threshold;
}

export function recordNudgeDisplay(onboarding: OnboardingState, now: Date = new Date()): OnboardingState {
    return {
        ...onboarding,
        nudge_count: onboarding.nudge_count + 1,
        last_nudge_at: now.toISOString(),
    };
}

function applyProgressTimestamp(
    onboarding: OnboardingState,
    completedQuests: QuestId[],
    now: Date,
): Pick<OnboardingState, 'last_progress_at'> {
    const previousCount = onboarding.completed_quests.length;

    if (completedQuests.length > previousCount) {
        return { last_progress_at: now.toISOString() };
    }

    if (completedQuests.length > 0 && !onboarding.last_progress_at) {
        return { last_progress_at: now.toISOString() };
    }

    return { last_progress_at: onboarding.last_progress_at };
}

export function bootstrapOnboardingState(
    user: JourneyUser | null | undefined,
    report: NurseReplacementReport | null | undefined,
    existing: OnboardingState,
    now: Date = new Date(),
): OnboardingState {
    const applicableQuests = getApplicableQuests(user);
    const detected = detectSignalCompletedQuests(user, report, existing);
    const completedQuests = mergeCompletedQuests(existing.completed_quests, detected, applicableQuests);
    const xp = resolveQuestXp(completedQuests);
    const complete = isJourneyComplete(completedQuests, applicableQuests);

    return {
        ...existing,
        xp,
        completed_quests: completedQuests,
        bootstrapped_at: existing.bootstrapped_at ?? now.toISOString(),
        completed_at: complete ? (existing.completed_at ?? now.toISOString()) : null,
        ...applyProgressTimestamp(existing, completedQuests, now),
    };
}

export function syncOnboardingProgress(
    user: JourneyUser | null | undefined,
    report: NurseReplacementReport | null | undefined,
    onboarding: OnboardingState,
    now: Date = new Date(),
): OnboardingState {
    const applicableQuests = getApplicableQuests(user);
    const detected = detectSignalCompletedQuests(user, report, onboarding);
    const completedQuests = mergeCompletedQuests(onboarding.completed_quests, detected, applicableQuests);
    const xp = resolveQuestXp(completedQuests);
    const complete = isJourneyComplete(completedQuests, applicableQuests);

    return {
        ...onboarding,
        xp,
        completed_quests: completedQuests,
        completed_at: complete ? (onboarding.completed_at ?? now.toISOString()) : null,
        ...applyProgressTimestamp(onboarding, completedQuests, now),
    };
}

export function addSnoozeUntil(onboarding: OnboardingState, days = SNOOZE_DAYS, now: Date = new Date()): OnboardingState {
    const until = new Date(now);
    until.setDate(until.getDate() + days);

    return {
        ...onboarding,
        snoozed_until: until.toISOString(),
    };
}

export function disableJourney(onboarding: OnboardingState, now: Date = new Date()): OnboardingState {
    return {
        ...onboarding,
        disabled: true,
        disabled_at: now.toISOString(),
        snoozed_until: null,
    };
}

export function enableJourney(onboarding: OnboardingState): OnboardingState {
    return {
        ...onboarding,
        disabled: false,
        disabled_at: null,
        snoozed_until: null,
    };
}

export function suppressTipsAutoOpen(onboarding: OnboardingState): OnboardingState {
    return {
        ...onboarding,
        tips_auto_open_disabled: true,
    };
}

export function completeQuestManually(
    onboarding: OnboardingState,
    questId: QuestId,
    user: JourneyUser | null | undefined,
    now: Date = new Date(),
): OnboardingState {
    const applicableQuests = getApplicableQuests(user);

    if (!applicableQuests.some(quest => quest.id === questId)) {
        return onboarding;
    }

    const completedQuests = mergeCompletedQuests(
        onboarding.completed_quests,
        [questId],
        applicableQuests,
    );
    const xp = resolveQuestXp(completedQuests);
    const complete = isJourneyComplete(completedQuests, applicableQuests);

    return {
        ...onboarding,
        xp,
        completed_quests: completedQuests,
        completed_at: complete ? (onboarding.completed_at ?? now.toISOString()) : null,
        ...applyProgressTimestamp(onboarding, completedQuests, now),
    };
}

export function resolveJourneyState(
    user: JourneyUser | null | undefined,
    report: NurseReplacementReport | null | undefined,
    onboardingInput: OnboardingState | null | undefined,
    context: JourneyContext = {},
): JourneyState {
    const onboarding = onboardingInput ?? createEmptyOnboarding();
    const applicableQuests = getApplicableQuests(user);
    const synced = syncOnboardingProgress(user, report, onboarding, context.now);
    const { level, progressInLevel } = resolveLevelProgress(synced.xp);
    const nextQuest = resolveNextQuest(synced.completed_quests, applicableQuests);
    const completedCount = synced.completed_quests.length;
    const totalQuests = applicableQuests.length;
    const isComplete = Boolean(synced.completed_at);
    const isVisible = shouldShowNetworkJourney(user, synced, context) && !isComplete;
    const nudge = resolveJourneyNudge(synced, {
        isVisible,
        hasNextQuest: nextQuest !== null,
        now: context.now,
    });
    const tip = resolveJourneyTip(user, level, nextQuest, synced.completed_quests, context.now);

    return {
        onboarding: synced,
        level,
        progressInLevel,
        totalXp: synced.xp,
        nextQuest,
        completedCount,
        totalQuests,
        welcomeMessage: resolveWelcomeMessage(completedCount, totalQuests),
        isComplete,
        isVisible,
        nudge,
        tip,
    };
}
