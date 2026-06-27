<template>
    <div class="min-w-0 w-full">
        <div class="data-table-scroll max-w-full overflow-x-auto rounded-md border">
            <Table class="w-max min-w-full">
                <TableHeader class="h-14 bg-gray-100">
                    <TableRow
                        v-for="headerGroup in table.getHeaderGroups()"
                        :key="headerGroup.id"
                    >
                        <TableHead
                            v-for="header in headerGroup.headers"
                            :key="header.id"
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
                                class="cursor-pointer"
                                @click="(event) => onRowClick(event, row)"
                            >
                                <TableCell
                                    v-for="cell in row.getVisibleCells()"
                                    :key="cell.id"
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
import { valueUpdater } from '~/lib/utils';

const props = withDefaults(defineProps<{
    data: any[];
    columns: ColumnDef<any>[];
    manualSorting?: boolean;
}>(), {
    manualSorting: false,
});

const { columns, manualSorting } = toRefs(props);

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
