export const AUTH_TOKEN_COOKIE = 'INFISWAP_TOKEN';

export function uniqueE2eEmail(): string {
    const stamp = Date.now();
    const suffix = Math.random().toString(36).slice(2, 8);

    return `e2e-${stamp}-${suffix}@test.infiswap.local`;
}

export const E2E_PASSWORD = 'Password123!';

export type RegistrationFormData = {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    password: string;
    street: string;
    city: string;
    zipCode: string;
};

export function buildRegistrationForm(overrides: Partial<RegistrationFormData> = {}): RegistrationFormData {
    return {
        firstname: 'E2E',
        lastname: 'Nurse',
        email: uniqueE2eEmail(),
        phoneNumber: '+32470000000',
        password: E2E_PASSWORD,
        street: 'Rue Test E2E',
        city: 'Namur',
        zipCode: '5000',
        ...overrides,
    };
}
