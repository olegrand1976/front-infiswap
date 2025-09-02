<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Liste des contacts" />

        <DashboardAdminPageContent>
            <Tabs
                v-model="selectedType"
                class="mb-4"
            >
                <TabsList class="w-full">
                    <TabsTrigger
                        value="nurstech"
                        class="w-full md:w-48 h-12"
                    >
                        <span>
                            Nurstech
                        </span>
                        <Badge
                            class="ml-2 bg-primary text-white"
                        >
                            5
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="nursassur"
                        class="w-full md:w-48 h-12"
                    >
                        <span>
                            Nursassur
                        </span>
                        <Badge
                            class="ml-2 bg-primary text-white"
                        >
                            5
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="infiswap"
                        class="w-full md:w-48 h-12"
                    >
                        <span>
                            Infiswap
                        </span>
                        <Badge
                            class="ml-2 bg-primary text-white"
                        >
                            5
                        </Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <div class="p-4 flex gap-3 items-center overflow-x-auto pb-3 px-4 scrollbar-hide">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par Nom"
                    class="w-[250px]"
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
                :data="dataContacts"
                :columns="columns"
            />
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="count"
                    @update:page="refresh"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import { PERPAGE } from '~/lib/constants';
import type { Contact } from '~/lib/types';

useHead({ title: 'Gestion des contacts' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const perPage = ref(PERPAGE);
const page = ref(1);
const initialFilter = {
    name: null,
};
const option = ref({ ...initialFilter });

const debounce = (func, delay) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const filter = async () => {
    const currentFilter = {
        ...option.value,
    };
    await getContacts(selectedType, page.value, perPage.value, currentFilter);
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(initialFilter);
    if (isSame) {
        return;
    }

    option.value = { ...initialFilter };
    page.value = 1;
    await getContacts(selectedType, page.value, perPage.value, option.value);
};

const debouncedFilter = debounce(filter, 100);

const { contacts, count, getContacts } = useContact();
const selectedType = ref('nurstech');

await getContacts(selectedType, page.value, perPage.value, option.value);
const dataContacts = computed(() => contacts.value ?? []);

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getContacts(selectedType, page.value, value, option.value);
};

const refresh = async (page: number) => {
    await getContacts(selectedType, page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
};

const sort = reactive({
    order: 'DESC',
    by: null,
});

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

const setSort = (columnKey: string) => {
    if (sort.by === columnKey) {
        toggleSort();
    }
    else {
        sort.by = columnKey;
        sort.order = 'DESC';
    }
};

watch(selectedType, async () => {
    page.value = 1;
    await getContacts(selectedType, page.value, perPage.value, option.value);
});

watch(
    () => sort,
    async (newVal) => {
        await getContacts(selectedType, page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);

const columns: ColumnDef<Contact>[] = [
    {
        accessorKey: 'name',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('name'),
            }, () => ['Nom', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'min-h-[2rem] flex items-center capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'email',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('email'),
            }, () => ['Email', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('email')),
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
        accessorKey: 'description',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('description'),
            }, () => ['Description', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'whitespace-pre-wrap' }, row.getValue('description')),
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h('div', { class: 'flex items-center justify-center gap-1' }, [
                h(Button, {
                    variant: 'ghost',
                    onClick: () => setSort('created_at'),
                    class: 'flex items-center justify-center gap-1',
                }, () => [
                    'Création',
                    h(ArrowsUpDownIcon, { class: '' }),
                ]),
            ]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center justify-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
];
</script>
