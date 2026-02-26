import type { AccountType } from '../types';

export const AUTH_TOKEN = 'INFISWAP_TOKEN';
export const LANGUAGE = 'LANGUAGE';
export const PERPAGE = 25;

export const SUPER_ADMIN_ROLES: AccountType[] = [
    'administrator',
];

export const ADMIN_ROLES: AccountType[] = [
    'administrator',
    'developer',
    'tester',
    'community_manager',
];

export const ALL_ROLES: AccountType[] = [
    'administrator',
    'developer',
    'tester',
    'manager',
    'collaborator',
    'community_manager',
    'sale_representative',
    'nurse',
    'caregiver',
    'midwife',
];

export const BASIC_ROLES: AccountType[] = [
    'collaborator',
    'nurse',
    'caregiver',
    'midwife',
];

export const LANGUAGES = [
    {
        value: 'fr',
        label: 'FR',
        name: 'France',
        icon: '/icons/fr.png',
    },
    {
        value: 'nl',
        label: 'NL',
        name: 'Nederlands',
        icon: '/icons/pays-bas.png',
    },
];
