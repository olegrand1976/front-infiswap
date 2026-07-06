export const PLATFORM_ACCESS_CUTOFF_DATE = '2026-07-01';

export const PLATFORM_ACCESS_ROLES = ['nurse', 'caregiver', 'midwife'] as const;

export type PlatformAccessRole = typeof PLATFORM_ACCESS_ROLES[number];

export function isPlatformAccessRole(roles: string[] | undefined | null): boolean {
    if (!roles?.length) {
        return false;
    }

    return roles.some(role => PLATFORM_ACCESS_ROLES.includes(role as PlatformAccessRole));
}

/** Rôles effectifs pour la cotisation (fallback account_type si roles absent du cache). */
export function resolvePlatformAccessRoles(user: {
    roles?: string[];
    account_type?: string | null;
} | null | undefined): string[] {
    if (user?.roles?.length) {
        return user.roles;
    }

    if (user?.account_type) {
        return [user.account_type];
    }

    return [];
}

export function isRegisteredAfterPlatformAccessCutoff(createdAt: string | null | undefined): boolean {
    if (!createdAt) {
        return false;
    }

    const cutoff = new Date(`${PLATFORM_ACCESS_CUTOFF_DATE}T00:00:00`);

    return new Date(createdAt) >= cutoff;
}

export function hasPaidPlatformAccess(user: { platform_access_paid_at?: string | null } | null | undefined): boolean {
    return Boolean(user?.platform_access_paid_at);
}

/** Badge header : infirmière ayant souscrit l'accès réseau (post-cutoff + payé). */
export function showsPaidNetworkAccessBadge(user: {
    roles?: string[];
    account_type?: string | null;
    created_at?: string | null;
    platform_access_paid_at?: string | null;
} | null | undefined): boolean {
    return isSubjectToPlatformAccessPayment(user) && hasPaidPlatformAccess(user);
}

export function isSubjectToPlatformAccessPayment(user: {
    roles?: string[];
    account_type?: string | null;
    created_at?: string | null;
} | null | undefined): boolean {
    if (!user) {
        return false;
    }

    return isPlatformAccessRole(resolvePlatformAccessRoles(user))
        && isRegisteredAfterPlatformAccessCutoff(user.created_at);
}

export function isLocallyExemptFromPlatformPayment(user: {
    id?: number;
    roles?: string[];
    created_at?: string | null;
    platform_access_paid_at?: string | null;
} | null | undefined, options: {
    bypassesPlatformAccess: boolean;
}): boolean {
    if (options.bypassesPlatformAccess) {
        return true;
    }

    if (!user?.id) {
        return true;
    }

    if (!user.roles?.length) {
        return false;
    }

    if (!isPlatformAccessRole(user.roles)) {
        return true;
    }

    if (!isRegisteredAfterPlatformAccessCutoff(user.created_at)) {
        return true;
    }

    if (hasPaidPlatformAccess(user)) {
        return true;
    }

    return false;
}

export type PlatformAccessCheckResult = {
    payment_required: boolean;
    status?: string;
} | null;

/** Décision après check API ou exemption locale (testable sans composable). */
export function resolvePlatformAccessPromptAction(
    checkResult: PlatformAccessCheckResult,
    locallyExempt: boolean,
): 'allow' | 'deny' | 'prompt_payment' {
    if (locallyExempt) {
        return 'allow';
    }

    if (!checkResult) {
        return 'deny';
    }

    if (!checkResult.payment_required) {
        return 'allow';
    }

    return 'prompt_payment';
}

interface CreateReplacementForm {
    periods: Array<{ startDate: string | null; endDate: string | null }>;
    roleType: string | null;
    patientCount: number | string | null;
    zipCodes: string[];
    careTypes: number[];
    timeSlot: {
        morning: { startAt: string; endAt: string };
        evening: { startAt: string; endAt: string };
    };
}

export function validateCreateReplacementForm(formData: CreateReplacementForm): string | null {
    if (!formData.roleType) {
        return 'Veuillez sélectionner votre type de professionnel.';
    }

    const validPeriods = formData.periods.filter(
        period => period.startDate && period.endDate,
    );

    if (validPeriods.length === 0) {
        return 'Veuillez sélectionner au moins une période de remplacement.';
    }

    for (const period of validPeriods) {
        if (period.endDate! < period.startDate!) {
            return 'La date de fin doit être postérieure ou égale à la date de début.';
        }
    }

    if (!formData.patientCount || !/^\d+$/.test(String(formData.patientCount))) {
        return 'Veuillez indiquer un nombre de patients valide.';
    }

    if (!formData.zipCodes.length) {
        return 'Veuillez ajouter au moins un code postal.';
    }

    if (!formData.careTypes.length) {
        return 'Veuillez sélectionner au moins un type de soin.';
    }

    const hasTimeSlot = [
        formData.timeSlot.morning.startAt && formData.timeSlot.morning.endAt,
        formData.timeSlot.evening.startAt && formData.timeSlot.evening.endAt,
    ].some(Boolean);

    if (!hasTimeSlot) {
        return 'Veuillez renseigner au moins un créneau horaire (matin ou soir).';
    }

    return null;
}

interface ImmediateReplacementForm {
    startTime: string;
    endTime: string;
    patientCount: string | number;
    roleType: string | null;
    zipCodes: string[];
    cities: string[];
    careTypes: number[];
}

export function validateImmediateReplacementForm(formData: ImmediateReplacementForm): string | null {
    if (!formData.startTime || !formData.endTime) {
        return 'Veuillez renseigner les heures de début et de fin.';
    }

    if (formData.endTime <= formData.startTime) {
        return 'L\'heure de fin doit être postérieure à l\'heure de début.';
    }

    if (!formData.patientCount || Number(formData.patientCount) < 1) {
        return 'Veuillez indiquer un nombre de patients valide.';
    }

    if (!formData.roleType) {
        return 'Veuillez sélectionner votre type de professionnel.';
    }

    if (!formData.zipCodes.length) {
        return 'Veuillez ajouter au moins un code postal.';
    }

    if (!formData.cities.length) {
        return 'Veuillez ajouter au moins une ville.';
    }

    if (!formData.careTypes.length) {
        return 'Veuillez sélectionner au moins un type de soin.';
    }

    return null;
}

export function isOneTimeAccessPlan(plan: { interval?: string | null } | null | undefined): boolean {
    return plan?.interval === 'one_time';
}
