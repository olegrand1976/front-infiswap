import type { Updater } from '@tanstack/vue-table';
import type { Ref } from 'vue';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
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
        case 'tester' :
            activeRole.value = 'Testeur';
            break;
        case 'manager':
            activeRole.value = 'Gestionnaire';
            break;
        case 'community_manager' :
            activeRole.value = 'Community Manager';
            break;
        case 'collaborator':
            activeRole.value = 'Collaborateur';
            break;
        case 'sale_representative' :
            activeRole.value = 'Commerciale';
            break;
        case 'caregiver' :
            activeRole.value = 'Aide soignant(e)';
            break;
        case 'midwife' :
            activeRole.value = 'Sage-femme';
            break;
        case 'nurse' :
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
