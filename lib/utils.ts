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

export function formatPhoneNumber (phoneNumber: string){
    const cleanedNumber = phoneNumber.replace(/\D/g, '');

    return `${cleanedNumber.slice(0, 4)} ${cleanedNumber.slice(4, 6)} ${cleanedNumber.slice(6, 8)} ${cleanedNumber.slice(8)}`;
};

export function getFullName(user: User) {
    return [user.firstname, user.lastname?.toUpperCase()].join(' ');
}