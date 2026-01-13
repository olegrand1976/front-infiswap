import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);

dayjs.locale('fr');

export function formatRelativeDate(dateString: string) {
    return dayjs(dateString).fromNow();
}
export function formatDate(date: Date): string {
    return date.getFullYear() + '-' + date.getMonth();
}

export function isFuture(dateString: string | null): boolean {
    if (dateString == null) {
        return false;
    }

    return new Date(dateString).getTime() > Date.now();
}

export function formatToDMY(
    dateStr: string | null,
    withTime: boolean | null = null,
): string {
    if (dateStr == null) {
        return '';
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        return '';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    let formattedDate = `${day}/${month}/${year}`;

    if (withTime === true) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        formattedDate += ` à ${hours}:${minutes}`;
    }

    return formattedDate;
}
