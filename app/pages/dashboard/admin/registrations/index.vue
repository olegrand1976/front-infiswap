<template>
    <div>
        <DashboardAdminPageHeader
            title="Suivi inscriptions"
        />

        <DashboardAdminPageContent>
            <Tabs
                v-model="selectedPeriod"
                class="mb-4"
            >
                <TabsList class="w-full">
                    <TabsTrigger
                        value="lastWeek"
                        class="md:w-80 h-16 flex items-center"
                    >
                        <span>
                            Semaine dernière
                        </span>
                        <Badge
                            v-if="dataWeekUsers?.length != 0"
                            class="bg-primary text-white ml-2 px-2 py-1 inline-flex items-center justify-center"
                        >
                            {{ dataWeekUsers?.length }}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="lastMonth"
                        class="md:w-80 h-16 flex items-center"
                    >
                        <span>
                            Mois dernier
                        </span>
                        <Badge
                            v-if="dataMonthUsers?.length != 0"
                            class="bg-primary text-white ml-2 px-2 py-1 inline-flex items-center justify-center"
                        >
                            {{ dataMonthUsers?.length }}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <DataTable
                :data="selectedPeriod == 'lastWeek' ? dataWeekUsers : dataMonthUsers"
                :columns="columns"
            />
        </DashboardAdminPageContent>
        <div>
            <CustomPagination
                :default-page="page"
                :per-page="perPage"
                :total="selectedPeriod == 'lastWeek' ? dataWeekUsers?.length : dataMonthUsers?.length"
                @update:per-page="handlePerPageChange"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid';
import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import type { User } from '~/lib/types';
import { formatPhoneNumber } from '~/lib/utils';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { PERPAGE } from '~/lib/constants';
import { Switch } from '~/components/ui/switch';

useHead({ title: 'Inscriptions au cours d\'une période' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const option = ref();
const selectedPeriod = ref('lastWeek');

const perPage = ref(PERPAGE);
const page = ref(1);

const { users, getRecentUsers } = useAuth();

await getRecentUsers(page.value, perPage.value);

const dataWeekUsers = computed(() => users.value?.weekly ?? []);
const dataMonthUsers = computed(() => users.value?.monthly ?? []);

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getRecentUsers(page.value, value, option.value);
};

const columns: ColumnDef<User>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                    ? 'indeterminate'
                    : false,
            'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
            'class': 'mx-2',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': value => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
            'class': 'mx-2',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Création', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        accessorKey: 'lastname',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('lastname'),
            }, () => ['Nom', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'uppercase ml-4' }, row.getValue('lastname')),
    },
    {
        accessorKey: 'firstname',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('firstname'),
            }, () => ['Prénoms', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize ml-4' }, row.getValue('firstname')),
    },
    {
        accessorKey: 'gender',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('gender'),
            }, () => ['Sexe', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize ml-4' }, row.getValue('gender')),
    },
    {
        accessorKey: 'phone_number',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('phone_number'),
            }, () => ['Téléphone', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize ml-4' }, formatPhoneNumber(row.getValue('phone_number'))),
    },
    {
        accessorKey: 'email',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('email'),
            }, () => ['Email', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'ml-4' }, row.getValue('email')),
    },
    {
        accessorKey: 'created_by',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_by'),
            }, () => ['Créé par', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'ml-4' }, row.getValue('created_by')),
    },
    {
        accessorKey: 'affiliate_by',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('affiliate_by'),
            }, () => ['Affilié par', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'ml-4' }, row.getValue('affiliate_by')),
    },
    {
        accessorKey: 'insurance',
        header: 'NursAssur',
        cell: ({ row }) => {
            const user = row.original as User;

            const currentValue = (() => {
                const mods = user.last_product_modifications ?? [];
                const found = mods.find(p => (p.product_name || '').toLowerCase().includes('nursassur'));
                if (found !== undefined && found.activate !== undefined && found.activate !== null) {
                    return Number(found.activate);
                }
                if (user.insurance !== undefined && user.insurance !== null) {
                    return Number(user.insurance);
                }
                return 0;
            })();
            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    class: 'mx-auto text-center',
                    checked: currentValue === 1,
                    disabled: true,
                }),
            ]);
        },
        enableSorting: false,
    },
    {
        accessorKey: 'site',
        header: 'NursTech',
        cell: ({ row }) => {
            const user = row.original as User;

            const currentValue = (() => {
                const mods = user.last_product_modifications ?? [];
                const found = mods.find(p => (p.product_name || '').toLowerCase().includes('nurstech'));
                if (found !== undefined && found.activate !== undefined && found.activate !== null) {
                    return Number(found.activate);
                }
                if (user.site !== undefined && user.site !== null) {
                    return Number(user.site);
                }
                return 0;
            })();
            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    class: 'mx-auto text-center',
                    checked: currentValue === 1,
                    disabled: true,
                }),
            ]);
        },
        enableSorting: false,
    },
    {
        accessorKey: 'account_type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue('account_type');

            const label = type === 'institution'
                ? 'Institution'
                : 'Infirmier';

            return h('div', { class: 'ml-4' }, label);
        },
    },
        {
        accessorKey: 'ambassador',
        header: 'Inficoncept',
        cell: ({ row }) => {
            const user = row.original as User;

            const currentValue = (() => {
                const mods = user.last_product_modifications ?? [];
                const found = mods.find(p => (p.product_name || '').toLowerCase().includes('inficoncept'));
                if (found !== undefined && found.activate !== undefined && found.activate !== null) {
                    return Number(found.activate);
                }
                if (user.ambassador !== undefined && user.ambassador !== null) {
                    return Number(user.ambassador);
                }
                return 0;
            })();
            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    class: 'mx-auto text-center',
                    checked: currentValue === 1,
                    disabled: true,
                }),
            ]);
        },
        enableSorting: false,
    },
    {
        accessorKey: 'last_contact_date',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('last_contact_date'),
            }, () => ['Date de dernier contact', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            const value = row.getValue('last_contact_date');
            return h('div', { class: 'text-center' }, value ? formatRelativeDate(String(value)) : '');
        },
    },
    {
        accessorKey: 'last_login_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('last_login_at'),
            }, () => ['Dernière connexion', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            const value = row.getValue('last_login_at');
            return h('div', { class: 'text-center' }, value ? formatRelativeDate(String(value)) : '');
        },
    },
];

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

watch(
    () => sort,
    async (newVal) => {
        await getRecentUsers(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);
</script>
