import type { Updater } from '@tanstack/vue-table';
import type { Ref } from 'vue';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { User } from './types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
    ref.value
    = typeof updaterOrValue === 'function'
            ? updaterOrValue(ref.value)
            : updaterOrValue;
}

export function firstUpperCase(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function selectDays(day: string, days: string[]) {
    if (day === 'all') {
        if (!days.includes('all')) {
            days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'all'];
        }
        else {
            days = [];
        }
    }
    else {
        if (days.includes(day)) {
            days = days.filter(d => d !== day);
        }
        else {
            days.push(day);
        }

        const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        if (allDays.every(d => days.includes(d))) {
            days.push('all');
        }
        else {
            days = days.filter(d => d !== 'all');
        }
    }

    return days;
}

export function formatPhoneNumber(phoneNumber: string | null) {
    if (phoneNumber == null) return;

    const cleanedNumber = phoneNumber.replace(/\D/g, '');

    return `${cleanedNumber.slice(0, 4)} ${cleanedNumber.slice(4, 6)} ${cleanedNumber.slice(6, 8)} ${cleanedNumber.slice(8)}`;
};

export function getFullName(user: User) {
    return [user.firstname, user.lastname?.toUpperCase()].join(' ');
}

export function formatInamiNumber(inami: string | null) {
    if (inami == null) return;

    const cleanedNumber = inami.replace(/\D/g, '');

    if (cleanedNumber.length === 11) {
        return cleanedNumber.replace(/^(\d{1})(\d{2})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3.$4.$5');
    }

    return cleanedNumber.replace(/^(\d{4})(\d{4})$/, '$1.$2');
}

export function formatNISS(input: string): string {
    const raw = input.replace(/\D/g, '');

    if (raw.length !== 11 && raw.length !== 8) return input;

    if (raw.length === 11) {
        return `${raw.slice(0, 6)}-${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
    }

    return `${raw.slice(0, 6)}-${raw.slice(6)}`;
}
