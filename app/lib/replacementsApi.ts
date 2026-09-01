import type { ReplacementListing } from '~/lib/replacementsData';

function parseJson<T>(value: unknown, fallback: T): T {
    if (typeof value !== 'string') {
        return (value as T) ?? fallback;
    }
    try {
        return JSON.parse(value) as T;
    }
    catch {
        return fallback;
    }
}

function formatDate(value?: string | null): string | null {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateRange(start?: string | null, end?: string | null): string {
    const from = formatDate(start);
    const to = formatDate(end);
    if (from && to && from !== to) return `${from} → ${to}`;
    return from ?? to ?? '';
}

interface ApiPeriod {
    start_date?: string | null;
    end_date?: string | null;
}

function formatPeriodRanges(periods: ApiPeriod[]): string[] {
    return periods
        .filter(period => period.start_date)
        .slice()
        .sort((a, b) => (a.start_date! < b.start_date! ? -1 : 1))
        .map(period => formatDateRange(period.start_date, period.end_date ?? period.start_date));
}

function slotsFromTimeSlot(raw: unknown): string[] {
    const timeSlot = parseJson<Record<string, unknown>>(raw, {});
    const slots: string[] = [];
    if (timeSlot.morning) slots.push('Matin');
    if (timeSlot.afternoon) slots.push('Après-midi');
    if (timeSlot.evening) slots.push('Soir');
    return slots;
}

function slotsFromMission(item: Record<string, unknown>): string[] {
    const slots: string[] = [];
    if (item.morning_start_at) slots.push('Matin');
    if (item.afternoon_start_at) slots.push('Après-midi');
    if (!slots.length && item.time_start_at) slots.push('Journée');
    return slots;
}

function institutionInitial(name?: string | null): string {
    return (name ?? '?').trim().slice(0, 2).toUpperCase();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRecordToListing(record: any): ReplacementListing {
    if (record.record_type === 'mission') {
        const institution = record.institution;

        return {
            id: record.id,
            type: 'mission',
            date: formatDateRange(record.start_date, record.end_date),
            startDateIso: record.start_date ?? undefined,
            city: institution?.city || 'Lieu à confirmer',
            zipCodes: institution?.zip_code ? [institution.zip_code] : [],
            careTypes: [],
            slots: slotsFromMission(record),
            description: record.description ?? undefined,
            patientsPerDay: undefined,
            institution: institution
                ? {
                        initial: institutionInitial(institution.institution_name),
                        name: institution.institution_name,
                        contract: record.required_diploma ?? '',
                    }
                : undefined,
        };
    }

    const periods = Array.isArray(record.periods) ? record.periods as ApiPeriod[] : [];
    const periodRanges = formatPeriodRanges(periods);
    const earliestPeriodStart = periods
        .map(period => period.start_date)
        .filter(Boolean)
        .sort()[0];
    const zipCodes = parseJson<string[]>(record.zip_codes, []);
    const cities = parseJson<string[]>(record.cities, []);
    const careTypes = Array.isArray(record.care_types)
        ? record.care_types.map((careType: { name: string }) => careType.name)
        : [];

    return {
        id: record.id,
        type: 'replacement',
        date: periodRanges[0] ?? formatDateRange(record.start_date, record.end_date),
        periods: periodRanges.length ? periodRanges : undefined,
        startDateIso: record.start_date ?? earliestPeriodStart ?? undefined,
        city: cities[0] || 'Lieu à confirmer',
        zipCodes,
        careTypes,
        slots: slotsFromTimeSlot(record.timeSlot),
        description: record.comment ?? undefined,
        isBoosted: Boolean(record.is_boosted),
        isUrgent: record.type === 'immediate',
        isNew: record.created_at
            ? Date.now() - new Date(record.created_at).getTime() < 1000 * 60 * 60 * 24 * 3
            : false,
        patientsPerDay: record.patient_count ?? undefined,
        institution: record.institution
            ? {
                    initial: institutionInitial(record.institution.name),
                    name: record.institution.name,
                    contract: '',
                }
            : undefined,
    };
}
