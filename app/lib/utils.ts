/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Updater } from '@tanstack/vue-table';
import type { Ref } from 'vue';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import type { AccountType, User } from './types';

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

export function getShortDisplayName(user: Pick<User, 'firstname' | 'lastname' | 'full_name'> | null | undefined): string {
    if (!user) return '';

    const first = user.firstname?.trim();
    const last = user.lastname?.trim();
    if (first && last) {
        return `${first} ${last.charAt(0).toUpperCase()}.`;
    }

    const full = user.full_name?.trim();
    if (!full) return '';

    const parts = full.split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return full;

    const lastPart = parts[parts.length - 1];
    return `${parts[0]} ${lastPart.charAt(0).toUpperCase()}.`;
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

export function getRole(role: AccountType) {
    const activeRole = ref('nurse');

    switch (role) {
        case 'administrator':
            activeRole.value = 'Administrateur';
            break;
        case 'developer':
            activeRole.value = 'Développeur';
            break;
        case 'tester':
            activeRole.value = 'Testeur';
            break;
        case 'manager':
            activeRole.value = 'Gestionnaire';
            break;
        case 'community_manager':
            activeRole.value = 'Community Manager';
            break;
        case 'collaborator':
            activeRole.value = 'Collaborateur';
            break;
        case 'sale_representative':
            activeRole.value = 'Commerciale';
            break;
        case 'caregiver':
            activeRole.value = 'Aide soignant(e)';
            break;
        case 'midwife':
            activeRole.value = 'Sage-femme';
            break;
        case 'nurse':
            activeRole.value = 'Infirmier(e)';
            break;
        default:
            activeRole.value = 'Infirmier(e)';
            break;
    }

    return activeRole.value;
}

export function getPeriodsFromTimeSlot(startAt, endAt = null) {
    if (!startAt) return [];

    const toMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const startMinutes = toMinutes(startAt);
    const endMinutes = endAt ? toMinutes(endAt) : startMinutes + 60;

    const periods = new Set();

    const morningStart = 0;
    const morningEnd = 12 * 60 + 59;
    const afternoonStart = 13 * 60;
    const afternoonEnd = 17 * 60 + 59;
    const eveningStart = 18 * 60;
    const eveningEnd = 23 * 60 + 59;

    if (
        (startMinutes <= morningEnd && endMinutes >= morningStart)
        || (startMinutes >= morningStart && startMinutes <= morningEnd)
        || (endMinutes >= morningStart && endMinutes <= morningEnd)
    ) {
        periods.add('morning');
    }
    if (
        (startMinutes <= afternoonEnd && endMinutes >= afternoonStart)
        || (startMinutes >= afternoonStart && startMinutes <= afternoonEnd)
        || (endMinutes >= afternoonStart && endMinutes <= afternoonEnd)
    ) {
        periods.add('afternoon');
    }
    if (
        (startMinutes <= eveningEnd && endMinutes >= eveningStart)
        || (startMinutes >= eveningStart && startMinutes <= eveningEnd)
        || (endMinutes >= eveningStart && endMinutes <= eveningEnd)
    ) {
        periods.add('evening');
    }

    return Array.from(periods);
}

export function formatCalendarDate(date: { day: number | null; month: number | null; year: number | null }): string | null {
    if (date == null) {
        return null;
    }
    const day = String(date.day).padStart(2, '0');
    const month = String(date.month).padStart(2, '0');
    const year = String(date.year);
    return `${day}/${month}/${year}`;
}

export function formatRange(range: { start: { day: number | null; month: number | null; year: number | null }; end: { day: number | null; month: number | null; year: number | null } }) {
    return {
        start: formatCalendarDate(range.start),
        end: formatCalendarDate(range.end),
    };
}

export const regions = [
    'Bruxelles-Capitale',
    'Brabant wallon',
    'Brabant flamand',
    'Anvers',
    'Brabant flamand - Overijse',
    'Limbourg',
    'Liège',
    'Namur',
    'Hainaut',
    'Luxembourg',
    'Flandre-Occidentale',
    'Flandre-Orientale',
];

export const departments = [
    'Ain',
    'Aisne',
    'Allier',
    'Alpes-de-Haute-Provence',
    'Hautes-Alpes',
    'Alpes-Maritimes',
    'Ardèche',
    'Ardennes',
    'Ariège',
    'Aube',
    'Aude',
    'Aveyron',
    'Bouches-du-Rhône',
    'Calvados',
    'Cantal',
    'Charente',
    'Charente-Maritime',
    'Cher',
    'Corrèze',
    'Corse-du-Sud',
    'Haute-Corse',
    'Côte-d\'Or',
    'Côtes-d\'Armor',
    'Creuse',
    'Dordogne',
    'Doubs',
    'Drôme',
    'Eure',
    'Eure-et-Loir',
    'Finistère',
    'Gard',
    'Haute-Garonne',
    'Gers',
    'Gironde',
    'Hérault',
    'Ille-et-Vilaine',
    'Indre',
    'Indre-et-Loire',
    'Isère',
    'Jura',
    'Landes',
    'Loir-et-Cher',
    'Loire',
    'Haute-Loire',
    'Loire-Atlantique',
    'Loiret',
    'Lot',
    'Lot-et-Garonne',
    'Lozère',
    'Maine-et-Loire',
    'Manche',
    'Marne',
    'Haute-Marne',
    'Mayenne',
    'Meurthe-et-Moselle',
    'Meuse',
    'Morbihan',
    'Moselle',
    'Nièvre',
    'Nord',
    'Oise',
    'Orne',
    'Pas-de-Calais',
    'Puy-de-Dôme',
    'Pyrénées-Atlantiques',
    'Hautes-Pyrénées',
    'Pyrénées-Orientales',
    'Bas-Rhin',
    'Haut-Rhin',
    'Rhône',
    'Haute-Saône',
    'Saône-et-Loire',
    'Sarthe',
    'Savoie',
    'Haute-Savoie',
    'Paris',
    'Seine-Maritime',
    'Seine-et-Marne',
    'Yvelines',
    'Deux-Sèvres',
    'Somme',
    'Tarn',
    'Tarn-et-Garonne',
    'Var',
    'Vaucluse',
    'Vendée',
    'Vienne',
    'Haute-Vienne',
    'Vosges',
    'Yonne',
    'Territoire de Belfort',
    'Essonne',
    'Hauts-de-Seine',
    'Seine-Saint-Denis',
    'Val-de-Marne',
    'Val-d\'Oise',
    'Guadeloupe',
    'Martinique',
    'Guyane',
    'La Réunion',
    'Mayotte',
];

export function debounce(func, delay) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export function goBack() {
    window.history.back();
};
export function getErrorMessage(error: any): string {
    if (!error) return 'Une erreur inconnue est survenue';

    if (typeof error === 'string') return error;

    return (
        error.data?.message
        || error.response?._data?.message
        || error.message
        || 'Une erreur est survenue lors de la communication avec le serveur'
    );
}

export function resolveProvinceFromZip(zipCode: string | null | undefined, country: string = 'be'): string | null {
    if (!zipCode) return null;
    const zip = parseInt(zipCode.replace(/\D/g, ''), 10);
    if (isNaN(zip)) return null;

    if (country === 'fr') {
        if (zip >= 97100 && zip <= 97680) {
            const prefix = Math.floor(zip / 100);
            const domMap: Record<number, string> = {
                971: 'Guadeloupe', 972: 'Martinique', 973: 'Guyane',
                974: 'La Réunion', 976: 'Mayotte',
            };
            return domMap[prefix] ?? null;
        }
        const deptNum = Math.floor(zip / 1000);
        const deptIndexMap: Record<number, number> = {
            1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9,
            11: 10, 12: 11, 13: 12, 14: 13, 15: 14, 16: 15, 17: 16, 18: 17,
            19: 18,
            20: 19,
            21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28,
            29: 29, 30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36,
            37: 37, 38: 38, 39: 39, 40: 40, 41: 41, 42: 42, 43: 43, 44: 44,
            45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 50: 50, 51: 51, 52: 52,
            53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59, 60: 60,
            61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68,
            69: 69, 70: 70, 71: 71, 72: 72, 73: 73, 74: 74,
            75: 75, // Paris
            76: 76, 77: 77, 78: 78, 79: 79, 80: 80, 81: 81, 82: 82, 83: 83,
            84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89,
            90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95,
        };
        const idx = deptIndexMap[deptNum];
        return idx !== undefined ? departments[idx] : null;
    }

    // Belgique
    if (zip >= 1000 && zip <= 1299) return regions[0];
    if (zip >= 1300 && zip <= 1499) return regions[1];
    if (zip >= 1500 && zip <= 1999) return regions[2];
    if (zip >= 2000 && zip <= 2999) return regions[3];
    if (zip >= 3000 && zip <= 3499) return regions[2];
    if (zip >= 3500 && zip <= 3999) return regions[5];
    if (zip >= 4000 && zip <= 4999) return regions[6];
    if (zip >= 5000 && zip <= 5999) return regions[7];
    if (zip >= 6000 && zip <= 6599) return regions[8];
    if (zip >= 6600 && zip <= 6999) return regions[9];
    if (zip >= 7000 && zip <= 7999) return regions[8];
    if (zip >= 8000 && zip <= 8999) return regions[10];
    if (zip >= 9000 && zip <= 9999) return regions[11];
    return null;
}
