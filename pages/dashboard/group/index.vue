<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="flex items-center justify-between w-full mb-4">
            <h1 class="py-3 text-primary sm:bg-gray-100 sm:w-[65%] lg:w-[80%] sm:px-9 rounded-lg">
                Mon <strong>espace groupement</strong>
            </h1>
            <Button
                class="rounded flex items-center gap-2"
                href="/dashboard/group/create"
            >
                <PlusCircleIcon class="w-5 h-5" />
                <span class="hidden md:inline-block">Nouveau</span>
            </Button>
        </div>

        <Tabs
            v-model="selectedGroupId"
            class="mb-4 mt-2"
        >
            <TabsList class="w-full flex flex-wrap gap-2">
                <TabsTrigger
                    v-for="group in groups"
                    :key="group.id"
                    :value="group.id.toString()"
                    class="w-full md:w-48 h-12"
                >
                    {{ group.name }}
                </TabsTrigger>
            </TabsList>

            <TabsContent
                v-if="selectedGroup"
                :value="selectedGroupId"
            >
                <div class="p-4 flex gap-3 items-center">
                    <InputIcon
                        v-model="option.name"
                        rounded="md"
                        placeholder="Filtrer par Nom ou Prénom"
                        class="max-w-sm"
                        @input="debouncedFilter"
                    />
                    <Button
                        class="rounded-md"
                        @click="resetFilter"
                    >
                        <ArrowPathIcon class="md:mr-2" />
                        <span class="hidden md:inline-block">Restaurer</span>
                    </Button>
                </div>
                <DataTable
                    :data="selectedGroupUsers"
                    :columns="columns"
                    class="no-hover-bg"
                    @sort="handleSort"
                />
                <CustomPagination
                    :default-page="pagination.current_page"
                    :per-page="pagination.per_page"
                    :total="pagination.total"
                    @update:page="handlePageChange"
                    @update:per-page="handlePerPageChange"
                />
            </TabsContent>
        </Tabs>
    </div>
</template>

<script lang="ts" setup>
import { PlusCircleIcon, ArrowsUpDownIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import type { ColumnDef } from '@tanstack/vue-table';
import { ref, watch, reactive } from 'vue';
import { PERPAGE } from '~/lib/constants';
import { Button } from '@/components/ui/button';
import type { User } from '~/lib/types';

const { groups, selectedGroup, selectedGroupUsers, pagination, myGroups, fetchGroupDetails } = useGroup();

const selectedGroupId = ref<string>('');
const page = ref(1);
const perPage = ref(PERPAGE);
const filters = reactive({
    name: '',
    sortKey: 'lastname',
    sortOrder: 'ASC',
});
const option = ref({ ...filters });

const debounce = (func, delay) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const filterUsers = async () => {
    filters.name = option.value.name;
    page.value = 1;
    await fetchGroupDetails(parseInt(selectedGroupId.value), page.value, perPage.value, filters);
};

const debouncedFilter = debounce(filterUsers, 100);

const resetFilter = async () => {
    const hasActiveFilter = option.value.name !== null && option.value.name !== '';

    if (!hasActiveFilter) {
        return;
    }

    option.value.name = null;
    filters.name = null;
    page.value = 1;

    await fetchGroupDetails(parseInt(selectedGroupId.value), page.value, perPage.value, filters);
};

await myGroups();

if (groups.value.length > 0) {
    selectedGroupId.value = groups.value[0].id.toString();
    await fetchGroupDetails(parseInt(selectedGroupId.value), page.value, perPage.value, filters);
}

watch(selectedGroupId, async (newId) => {
    if (newId) {
        page.value = 1;
        await fetchGroupDetails(parseInt(newId), page.value, perPage.value, filters);
    }
});

const handlePageChange = async (newPage: number) => {
    page.value = newPage;
    await fetchGroupDetails(parseInt(selectedGroupId.value), page.value, perPage.value, filters);
};

const handlePerPageChange = async (newPerPage: number) => {
    perPage.value = newPerPage;
    page.value = 1;
    await fetchGroupDetails(parseInt(selectedGroupId.value), page.value, perPage.value, filters);
};

const handleSort = async ({ column, order }) => {
    filters.sortKey = column;
    filters.sortOrder = order;
    page.value = 1;
    await fetchGroupDetails(parseInt(selectedGroupId.value), page.value, perPage.value, filters);
};

const sort = reactive({
    order: 'DESC',
    by: null,
});

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

const applySort = async () => {
    filters.sortKey = sort.by;
    filters.sortOrder = sort.order;
    page.value = 1;
    await fetchGroupDetails(parseInt(selectedGroupId.value), page.value, perPage.value, filters);
};

const setSort = async (columnKey: string) => {
    if (sort.by === columnKey) {
        toggleSort();
    }
    else {
        sort.by = columnKey;
        sort.order = 'ASC';
    }
    await applySort();
};

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'full_name',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('name'),
            }, () => ['Nom', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'min-h-[2rem] flex items-center capitalize' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'email',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('email'),
            }, () => ['Email', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: '' }, row.getValue('email')),
    },
    {
        accessorKey: 'phone_number',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('phone_number'),
            }, () => ['Téléphone', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('phone_number')),
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Date d\'affectation', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            const date = row.getValue('created_at');
            return h('div', { class: 'text-center' }, formatRelativeDate(date));
        },
    },
];

useHead({
    title: 'Mon espace groupement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>

<style>
.no-hover-bg tr:hover {
    background-color: #f3f4f6 !important;
}
</style>
