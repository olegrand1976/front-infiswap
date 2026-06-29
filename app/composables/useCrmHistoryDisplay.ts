import { formatToDMY } from '@/composables/useDate';
import type { CrmHistoryEntry } from '@/composables/useCrm';
import type { CrmWeeklyKpiActionType } from '@/composables/useCrmWeeklyKpi';

export const CRM_COMMERCIAL_ACTION_TYPES: CrmWeeklyKpiActionType[] = [
    'call',
    'sale',
    'recommandation',
    'meeting',
    'pending',
];

export const CRM_HISTORY_ACTION_LABELS: Record<string, string> = {
    call: 'Appel',
    sale: 'Vente',
    recommandation: 'Recommandation',
    meeting: 'Rendez-vous',
    pending: 'En attente',
    referred_by: 'Apporteur',
    last_contact_date: 'Contact (date)',
    last_contact_method: 'Contact (mode)',
    last_comment: 'Commentaire',
};

export const CRM_HISTORY_BADGE_CLASSES: Record<string, string> = {
    call: 'bg-sky-100 text-sky-800 border-sky-200',
    sale: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    recommandation: 'bg-violet-100 text-violet-800 border-violet-200',
    meeting: 'bg-amber-100 text-amber-900 border-amber-200',
    pending: 'bg-orange-100 text-orange-800 border-orange-200',
    referred_by: 'bg-slate-100 text-slate-700 border-slate-200',
    last_contact_date: 'bg-slate-100 text-slate-700 border-slate-200',
    last_contact_method: 'bg-slate-100 text-slate-700 border-slate-200',
    last_comment: 'bg-slate-100 text-slate-700 border-slate-200',
};

export type CrmHistoryFilterValue = 'all' | CrmWeeklyKpiActionType | 'other';

export const CRM_HISTORY_FILTER_OPTIONS: Array<{ value: CrmHistoryFilterValue; label: string }> = [
    { value: 'all', label: 'Toutes les actions' },
    { value: 'call', label: 'Appels' },
    { value: 'sale', label: 'Ventes' },
    { value: 'recommandation', label: 'Recommandations' },
    { value: 'meeting', label: 'RDV' },
    { value: 'pending', label: 'En attente' },
    { value: 'other', label: 'Autres (contact, apporteur…)' },
];

const commercialActionTypeSet = new Set<string>(CRM_COMMERCIAL_ACTION_TYPES);

export function getCrmHistoryActionKey(entry: CrmHistoryEntry): string | null {
    return entry.action_type ?? entry.field_name ?? null;
}

export function formatCrmHistoryActionLabel(action: string | null | undefined): string {
    if (!action) {
        return 'Action';
    }
    return CRM_HISTORY_ACTION_LABELS[action] ?? action;
}

export function crmHistoryActionBadgeClass(action: string | null | undefined): string {
    const base = 'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide';
    if (!action) {
        return `${base} bg-gray-100 text-gray-600 border-gray-200`;
    }
    return `${base} ${CRM_HISTORY_BADGE_CLASSES[action] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`;
}

export function formatCrmHistoryDates(entry: CrmHistoryEntry): string {
    const start = entry.start_date ? formatToDMY(entry.start_date) : null;
    const end = entry.end_date && entry.end_date !== entry.start_date
        ? formatToDMY(entry.end_date)
        : null;

    if (start && end) {
        return `${start} → ${end}`;
    }
    if (start) {
        return start;
    }
    if (entry.created_at) {
        return formatToDMY(entry.created_at);
    }
    return '—';
}

export function isCommercialActionType(key: string | null | undefined): boolean {
    return key != null && commercialActionTypeSet.has(key);
}

export function filterCrmHistories(entries: CrmHistoryEntry[], filter: CrmHistoryFilterValue): CrmHistoryEntry[] {
    if (filter === 'all') {
        return entries;
    }
    if (filter === 'other') {
        return entries.filter(entry => !isCommercialActionType(getCrmHistoryActionKey(entry)));
    }
    return entries.filter(entry => getCrmHistoryActionKey(entry) === filter);
}

function startOfWeekDate(): Date {
    const date = new Date();
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
}

function endOfWeekDate(): Date {
    const start = startOfWeekDate();
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
}

export function countCrmHistoriesInCurrentWeek(entries: CrmHistoryEntry[]): number {
    const weekStart = startOfWeekDate();
    const weekEnd = endOfWeekDate();

    return entries.reduce((sum, entry) => {
        if (!isCommercialActionType(getCrmHistoryActionKey(entry))) {
            return sum;
        }
        const dateStr = entry.start_date ?? entry.created_at;
        if (!dateStr) {
            return sum;
        }
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime()) || date < weekStart || date > weekEnd) {
            return sum;
        }
        return sum + (Number(entry.number_of_times) || 1);
    }, 0);
}

export function groupCrmHistoriesByMonth(entries: CrmHistoryEntry[]): Array<{
    key: string;
    label: string;
    entries: CrmHistoryEntry[];
}> {
    const groups = new Map<string, CrmHistoryEntry[]>();

    for (const entry of entries) {
        const raw = entry.start_date ?? entry.created_at ?? '';
        const date = raw ? new Date(raw) : null;
        const key = date && !Number.isNaN(date.getTime())
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            : 'unknown';
        const bucket = groups.get(key) ?? [];
        bucket.push(entry);
        groups.set(key, bucket);
    }

    return Array.from(groups.entries())
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([key, groupEntries]) => {
            if (key === 'unknown') {
                return { key, label: 'Sans date', entries: groupEntries };
            }
            const [year, month] = key.split('-');
            const label = new Date(Number(year), Number(month) - 1, 1)
                .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
            return { key, label, entries: groupEntries };
        });
}

export function crmHistoryFilterLabel(filter: CrmHistoryFilterValue): string {
    return CRM_HISTORY_FILTER_OPTIONS.find(option => option.value === filter)?.label ?? 'Toutes les actions';
}
