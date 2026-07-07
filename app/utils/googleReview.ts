import type { PurchaseCelebrationVariant } from '~/utils/purchaseCelebration';

export const GOOGLE_REVIEW_URL = 'https://g.page/r/Cf8HfnS8YUz2EAE/review';
export const GOOGLE_REVIEW_SETTING_KEY = 'google_review';

export type GoogleReviewSource =
    | 'platform_access'
    | 'boost'
    | 'contract'
    | 'replacement_accepted'
    | 'onboarding_quest'
    | 'onboarding_complete';

export interface GoogleReviewSetting {
    left_at: string;
    source: GoogleReviewSource;
}

export interface GoogleReviewCopy {
    title: string;
    subtitle: string;
}

interface GoogleReviewUser {
    settings?: string | Record<string, unknown> | null;
}

const GOOGLE_REVIEW_COPY: Record<GoogleReviewSource, GoogleReviewCopy> = {
    platform_access: {
        title: 'Bienvenue dans le réseau',
        subtitle: '30 secondes pour nous aider à grandir — laissez un avis Google.',
    },
    boost: {
        title: 'Votre annonce est boostée',
        subtitle: 'Votre avis compte pour la notoriété du réseau InfiSwap.',
    },
    contract: {
        title: 'Remplacement confirmé',
        subtitle: 'Recommandez InfiSwap à vos collègues avec un avis Google.',
    },
    replacement_accepted: {
        title: 'Remplaçant trouvé',
        subtitle: 'Un avis Google nous aide à faire connaître la plateforme.',
    },
    onboarding_quest: {
        title: 'Bravo pour votre progression',
        subtitle: 'Partagez votre expérience InfiSwap en laissant un avis Google.',
    },
    onboarding_complete: {
        title: 'Parcours terminé',
        subtitle: 'Votre avis aide d\'autres infirmières à nous découvrir.',
    },
};

export function parseUserSettings(user: GoogleReviewUser | null | undefined): Record<string, unknown> {
    if (!user?.settings) {
        return {};
    }

    if (typeof user.settings === 'string') {
        try {
            return JSON.parse(user.settings) as Record<string, unknown>;
        }
        catch {
            return {};
        }
    }

    return user.settings;
}

export function parseGoogleReviewSetting(user: GoogleReviewUser | null | undefined): GoogleReviewSetting | null {
    const raw = parseUserSettings(user)[GOOGLE_REVIEW_SETTING_KEY];

    if (!raw || typeof raw !== 'object') {
        return null;
    }

    const setting = raw as Partial<GoogleReviewSetting>;

    if (typeof setting.left_at !== 'string' || setting.left_at.trim() === '') {
        return null;
    }

    return {
        left_at: setting.left_at,
        source: setting.source ?? 'platform_access',
    };
}

export function hasLeftGoogleReview(user: GoogleReviewUser | null | undefined): boolean {
    return parseGoogleReviewSetting(user) !== null;
}

export function getGoogleReviewCopy(source: GoogleReviewSource): GoogleReviewCopy {
    return GOOGLE_REVIEW_COPY[source];
}

export function mapCelebrationVariantToReviewSource(
    variant: PurchaseCelebrationVariant,
): GoogleReviewSource {
    switch (variant) {
        case 'platform_access':
            return 'platform_access';
        case 'boost':
            return 'boost';
        case 'contract':
            return 'contract';
        default: {
            const _exhaustive: never = variant;
            return _exhaustive;
        }
    }
}

export function mergeGoogleReviewIntoSettings(
    settings: Record<string, unknown>,
    value: GoogleReviewSetting,
): Record<string, unknown> {
    return {
        ...settings,
        [GOOGLE_REVIEW_SETTING_KEY]: value,
    };
}
