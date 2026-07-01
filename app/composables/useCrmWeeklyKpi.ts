import { ArrowUpDown } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import CrmWeeklyKpiCell from '@/components/crm/CrmWeeklyKpiCell.vue';

export type CrmWeeklyKpiActionType = 'call' | 'sale' | 'recommandation' | 'meeting' | 'pending';

export type CrmWeeklyKpiCounterKey = 'nb_call' | 'nb_sale' | 'nb_recommandation' | 'nb_meeting' | 'nb_pending';

export const CRM_WEEKLY_KPI_ACTION_SHORT_LABELS: Record<CrmWeeklyKpiActionType, string> = {
    call: 'appel',
    sale: 'vente',
    recommandation: 'recommandation',
    meeting: 'rendez-vous',
    pending: 'réponse en attente',
};

export const CRM_WEEKLY_KPI_COLUMNS: Array<{
    accessorKey: CrmWeeklyKpiCounterKey;
    sortKey: string;
    label: string;
    actionType: CrmWeeklyKpiActionType;
    actionLabel: string;
    headerTitle: string;
}> = [
    {
        accessorKey: 'nb_call',
        sortKey: 'nb_call',
        label: 'Appels',
        actionType: 'call',
        actionLabel: 'un appel',
        headerTitle: 'Nombre d\'appels passés cette semaine (lun.–dim.)',
    },
    {
        accessorKey: 'nb_sale',
        sortKey: 'nb_sale',
        label: 'Ventes',
        actionType: 'sale',
        actionLabel: 'une vente',
        headerTitle: 'Nombre de ventes cette semaine (lun.–dim.)',
    },
    {
        accessorKey: 'nb_recommandation',
        sortKey: 'nb_recommandation',
        label: 'Recommandations',
        actionType: 'recommandation',
        actionLabel: 'une recommandation',
        headerTitle: 'Recommandations obtenues cette semaine (lun.–dim.)',
    },
    {
        accessorKey: 'nb_meeting',
        sortKey: 'nb_meeting',
        label: 'RDV',
        actionType: 'meeting',
        actionLabel: 'un rendez-vous',
        headerTitle: 'Rendez-vous planifiés cette semaine (lun.–dim.)',
    },
    {
        accessorKey: 'nb_pending',
        sortKey: 'nb_pending',
        label: 'En attente',
        actionType: 'pending',
        actionLabel: 'une réponse en attente',
        headerTitle: 'Réponses en attente cette semaine (lun.–dim.)',
    },
];

type EntityWithCrm = {
    crm?: {
        id?: number;
        nb_call?: number;
        nb_sale?: number;
        nb_recommandation?: number;
        nb_meeting?: number;
        nb_pending?: number;
    } | null;
};

export function crmWeeklyCounterKeyForAction(actionType: CrmWeeklyKpiActionType): CrmWeeklyKpiCounterKey {
    const map: Record<CrmWeeklyKpiActionType, CrmWeeklyKpiCounterKey> = {
        call: 'nb_call',
        sale: 'nb_sale',
        recommandation: 'nb_recommandation',
        meeting: 'nb_meeting',
        pending: 'nb_pending',
    };

    return map[actionType];
}

export function useCrmWeeklyKpiColumns<T extends EntityWithCrm>(options: {
    setSort: (key: string) => void;
    isCollaborator: Ref<boolean>;
    onIncrement: (row: T, actionType: CrmWeeklyKpiActionType) => void | Promise<void>;
    onDecrement: (row: T, actionType: CrmWeeklyKpiActionType) => void | Promise<void>;
    getCrmUserId: (row: T) => number | null;
    resolvingRowId?: Ref<number | null>;
    getRowId: (row: T) => number;
}) {
    const {
        setSort,
        isCollaborator,
        onIncrement,
        onDecrement,
        getCrmUserId,
        resolvingRowId,
        getRowId,
    } = options;

    function renderKpiHeader(meta: typeof CRM_WEEKLY_KPI_COLUMNS[number]) {
        return h(Button, {
            variant: 'ghost',
            class: 'h-auto py-1 px-2',
            onClick: () => setSort(meta.sortKey),
            title: meta.headerTitle,
        }, () => [
            h('span', { class: 'flex flex-col items-start gap-0 leading-tight text-left' }, [
                h('span', { class: 'text-xs font-medium' }, meta.label),
                h('span', { class: 'text-[10px] font-normal text-gray-500' }, 'cette semaine'),
            ]),
            h(ArrowUpDown, { class: 'inline w-3.5 h-3.5 ml-1 shrink-0 self-center' }),
        ]);
    }

    function renderKpiCell(row: T, meta: typeof CRM_WEEKLY_KPI_COLUMNS[number]) {
        const value = Number(row.crm?.[meta.accessorKey]) || 0;
        const rowId = getRowId(row);
        const loading = resolvingRowId?.value === rowId;

        if (isCollaborator.value) {
            return h('span', { class: 'text-gray-400 text-sm' }, '-');
        }

        return h(CrmWeeklyKpiCell, {
            value,
            actionLabel: meta.actionLabel,
            columnLabel: meta.label,
            actionType: meta.actionType,
            crmUserId: getCrmUserId(row),
            loading,
            hint: `${value} ${meta.label.toLowerCase()} cette semaine. + pour ajouter, − pour retirer (avec confirmation).`,
            onIncrement: () => void onIncrement(row, meta.actionType),
            onDecrement: () => void onDecrement(row, meta.actionType),
        });
    }

    const kpiColumns: ColumnDef<T>[] = CRM_WEEKLY_KPI_COLUMNS.map(meta => ({
        accessorKey: meta.accessorKey,
        header: () => renderKpiHeader(meta),
        cell: ({ row }) => h('div', {
            class: 'flex justify-center items-center',
            'data-no-row-select': 'true',
        }, [renderKpiCell(row.original, meta)]),
    }));

    return { kpiColumns, CRM_WEEKLY_KPI_COLUMNS };
}

export function crmWeeklyActionTotal(crm?: EntityWithCrm['crm']): number {
    if (!crm) {
        return 0;
    }

    return CRM_WEEKLY_KPI_COLUMNS.reduce(
        (sum, column) => sum + (Number(crm[column.accessorKey]) || 0),
        0,
    );
}
