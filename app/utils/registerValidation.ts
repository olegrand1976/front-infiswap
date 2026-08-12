import { isBelgiumCountryCode } from './educationLevel';
import { isValidInamiFormat } from './inamiNumber';

export type RegisterBlockerKey =
    | 'consents'
    | 'personal'
    | 'password_length'
    | 'password_mismatch'
    | 'address'
    | 'working_at'
    | 'institution_name'
    | 'professional_category'
    | 'education_level'
    | 'inami_format';

export type RegisterValidationInput = {
    accountType: string;
    role: string;
    lastname?: string | null;
    firstname?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    password?: string | null;
    passwordConfirmation?: string | null;
    professionalCategory?: string | null;
    educationLevel?: string | null;
    identifierNumber?: string | null;
    institutionName?: string | null;
    address: {
        street?: string | null;
        city?: string | null;
        zipCode?: string | null;
        country?: string | null;
        workingAt?: string[] | null;
    };
    charteAccepted: boolean;
    termsAccepted: boolean;
    privacyAccepted: boolean;
};

export const REGISTER_MIN_PASSWORD_LENGTH = 8;

export function needsRegisterEducationLevel(input: {
    accountType: string;
    role: string;
    country?: string | null;
}): boolean {
    return (
        input.accountType !== 'institution'
        && input.role === 'nurse'
        && isBelgiumCountryCode(input.country)
    );
}

/** Ordre = priorité d’affichage UX (du haut du formulaire vers le bas). */
export function getRegisterBlockers(input: RegisterValidationInput): RegisterBlockerKey[] {
    const blockers: RegisterBlockerKey[] = [];

    if (!input.lastname?.trim() || !input.firstname?.trim() || !input.email?.trim() || !input.phoneNumber?.trim()) {
        blockers.push('personal');
    }

    const password = input.password ?? '';
    if (!password || password.length < REGISTER_MIN_PASSWORD_LENGTH) {
        blockers.push('password_length');
    }
    else if (password !== (input.passwordConfirmation ?? '')) {
        blockers.push('password_mismatch');
    }

    if (!input.address.street?.trim() || !input.address.city?.trim() || !input.address.zipCode?.trim()) {
        blockers.push('address');
    }

    if (!input.address.workingAt?.length) {
        blockers.push('working_at');
    }

    if (input.accountType === 'institution' && !input.institutionName?.trim()) {
        blockers.push('institution_name');
    }

    if (input.accountType !== 'institution' && !input.professionalCategory) {
        blockers.push('professional_category');
    }

    if (
        needsRegisterEducationLevel({
            accountType: input.accountType,
            role: input.role,
            country: input.address.country,
        })
        && !input.educationLevel
    ) {
        blockers.push('education_level');
    }

    if (
        input.accountType !== 'institution'
        && isBelgiumCountryCode(input.address.country)
        && !isValidInamiFormat(input.identifierNumber)
    ) {
        blockers.push('inami_format');
    }

    if (!input.charteAccepted || !input.termsAccepted || !input.privacyAccepted) {
        blockers.push('consents');
    }

    return blockers;
}

export function canRegisterSubmit(input: RegisterValidationInput): boolean {
    return getRegisterBlockers(input).length === 0;
}
