<template>
    <div
        :class="cn(
            'min-w-0 w-full',
            constrainedHeight && 'flex min-h-0 flex-1 flex-col',
        )"
    >
        <div
            :class="cn(
                'data-table-scroll max-w-full rounded-md border',
                constrainedHeight ? 'min-h-0 flex-1 overflow-auto' : 'overflow-x-auto',
            )"
        >
            <Table class="w-max min-w-full">
                <TableHeader
                    :class="cn(
                        'h-14 bg-gray-100',
                        constrainedHeight && 'sticky top-0 z-10',
                    )"
                >
                    <TableRow
                        v-for="headerGroup in table.getHeaderGroups()"
                        :key="headerGroup.id"
                    >
                        <TableHead
                            v-for="(header, colIndex) in headerGroup.headers"
                            :key="header.id"
                            :class="getStickyColumnClass(colIndex, { isHeader: true })"
                        >
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody class="bg-white">
                    <template v-if="table.getRowModel().rows?.length">
                        <template
                            v-for="row in table.getRowModel().rows"
                            :key="row.id"
                        >
                            <TableRow
                                :data-state="row.getIsSelected() ? 'selected' : undefined"
                                class="group cursor-pointer"
                                @click="(event) => onRowClick(event, row)"
                            >
                                <TableCell
                                    v-for="(cell, colIndex) in row.getVisibleCells()"
                                    :key="cell.id"
                                    :class="getStickyColumnClass(colIndex, {
                                        isHeader: false,
                                        isSelected: row.getIsSelected(),
                                    })"
                                >
                                    <FlexRender
                                        :render="cell.column.columnDef.cell"
                                        :props="cell.getContext()"
                                    />
                                </TableCell>
                            </TableRow>
                        </template>
                    </template>
                    <TableRow v-else>
                        <TableCell
                            :colspan="columns.length"
                            class="h-24 text-center"
                        >
                            Aucune donnée à afficher
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
        <!-- <div class="flex-1 m-1 text-sm text-muted-foreground">
            {{ table.getFilteredSelectedRowModel().rows.length }} par
            {{ table.getFilteredRowModel().rows.length }} lignes.
        </div> -->
    </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    type ColumnDef,
    type ColumnFiltersState,
    type ExpandedState,
    type SortingState,
    type VisibilityState,
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table';
import { ref, toRefs } from 'vue';
import type { Row } from '@tanstack/vue-table';
import { cn, valueUpdater } from '~/lib/utils';

const props = withDefaults(defineProps<{
    data: any[];
    columns: ColumnDef<any>[];
    manualSorting?: boolean;
    constrainedHeight?: boolean;
    stickyLeadingColumns?: number;
}>(), {
    manualSorting: false,
    constrainedHeight: false,
    stickyLeadingColumns: 0,
});

const { columns, manualSorting, constrainedHeight, stickyLeadingColumns } = toRefs(props);

const STICKY_LEFT_OFFSETS = ['left-0', 'left-12', 'left-44'] as const;

function getStickyColumnClass(
    colIndex: number,
    options: { isHeader: boolean; isSelected?: boolean },
) {
    if (stickyLeadingColumns.value <= 0 || colIndex >= stickyLeadingColumns.value) {
        return undefined;
    }

    const isLastSticky = colIndex === stickyLeadingColumns.value - 1;
    const leftClass = STICKY_LEFT_OFFSETS[colIndex] ?? 'left-0';
    const zClass = options.isHeader
        ? (constrainedHeight.value ? 'z-30' : 'z-20')
        : 'z-10';
    const bgClass = options.isHeader
        ? 'bg-gray-100'
        : cn(
            'bg-white group-hover:bg-gray-100',
            options.isSelected && 'bg-gray-100',
        );

    return cn(
        'sticky',
        leftClass,
        zClass,
        bgClass,
        colIndex === 0 && 'w-12 min-w-12 max-w-12',
        colIndex === 1 && 'min-w-[140px]',
        isLastSticky && 'border-r border-gray-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]',
    );
}

const rows = computed(() => props.data);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
    data: rows,
    columns: columns.value,
    getRowId: (row, index) => row.id ?? index.toString(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualSorting: manualSorting.value ?? false,
    onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
    state: {
        get sorting() { return sorting.value; },
        get columnFilters() { return columnFilters.value; },
        get columnVisibility() { return columnVisibility.value; },
        get rowSelection() { return rowSelection.value; },
        get expanded() { return expanded.value; },
    },
});

defineExpose({
    table,
});

function onRowClick(event: MouseEvent, row: Row<unknown>) {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, textarea, select, label, [role="switch"], [data-no-row-select]')) {
        return;
    }

    row.toggleSelected();
}
</script>

<style scoped>
.data-table-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
}

.data-table-scroll::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.data-table-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 4px;
}

.data-table-scroll::-webkit-scrollbar-track {
    background: transparent;
}
</style>
