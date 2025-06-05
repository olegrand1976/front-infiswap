<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Suivi utilisateurs - CRM" />

        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-center">
                <InputIcon
                    v-model="option.zip"
                    rounded="md"
                    placeholder="Code postal"
                    class="max-w-sm"
                    type="number"
                    @input="debouncedFilterUsers"
                />
                <InputIcon
                    v-model="option.city"
                    rounded="md"
                    placeholder="Ville"
                    class="max-w-sm"
                    @input="debouncedFilterUsers"
                />
                <Select v-model="option.biotrax" @update:modelValue="debouncedFilterUsers">
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Biotrax</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="1">
                                <span class="ml-2">Oui</span>
                            </SelectItem>
                            <SelectItem :value="0">
                                <span class="ml-2">Non</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select v-model="option.insurance" @update:modelValue="debouncedFilterUsers">
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Assurance</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="1">
                                <span class="ml-2">Oui</span>
                            </SelectItem>
                            <SelectItem :value="0">
                                <span class="ml-2">Non</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select v-model="option.site" @update:modelValue="debouncedFilterUsers">
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Site</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="1">
                                <span class="ml-2">Oui</span>
                            </SelectItem>
                            <SelectItem :value="0">
                                <span class="ml-2">Non</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    class="rounded-md"
                    @click="resetFilter"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>
            <DataTable
                :data="dataUsers"
                :columns="columns"
            />
            <Dialog v-model:open="showModal">
                <DialogContent>
                    <UsersCard :user="user" />
                </DialogContent>
            </Dialog>
            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="users.total"
                    @update:page="refreshUsers"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { EyeIcon } from '@heroicons/vue/24/outline';
import { ArrowsUpDownIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import type { User } from '~/lib/types';
import { InputIcon } from '~/components/ui/input-with-icon';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Switch } from '~/components/ui/switch';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const showModal = ref(false);

const openModal = (selectedUser) => {
    user.value = selectedUser;
    showModal.value = true;
};

useHead({ title: 'Suivi utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { users, getUsers, edit } = useAuth();

const user = ref(null);

const perPage = ref(PERPAGE);
const page = ref(1);
const initialFilter = {
    zip: null,
    city: null,
    biotrax: null,
    insurance: null,
    site: null,
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

const filterUsers = async () => {
    const currentFilter = { ...option.value };
    await getUsers(page.value, perPage.value, currentFilter);
};

const debouncedFilterUsers = debounce(filterUsers, 100);

await getUsers(page.value, perPage.value, option.value);

const dataUsers = computed(() => users.value?.data ?? []);

const refreshUsers = async (page: number) => {
    await getUsers(page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getUsers(page.value, value, option.value);
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(initialFilter);
    if (isSame) {
        return;
    }

    option.value = { ...initialFilter };
    page.value = 1;
    await getUsers(page.value, perPage.value, option.value);
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
        accessorKey: 'full_name',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('firstname'),
            }, () => ['Nom', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'zip_code',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('zip_code'),
            }, () => ['C.P', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('zip_code'));
        },
    },
    {
        accessorKey: 'city',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('city'),
            }, () => ['Ville', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, row.getValue('city'));
        },
    },
    {
        accessorKey: 'biotrax',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'w-full text-center',
            }, () => ['Biotrax', h(ArrowsUpDownIcon, { class: 'text-center' })]);
        },
        cell: ({ row }) => {
            const toggle = async (value: boolean) => {
                const index = dataUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    dataUsers.value[index].biotrax = value ? 1 : 0;
                }

                await edit(Number(row.original.id), { biotrax: dataUsers.value[index].biotrax == 1 });
            };

            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': row.original.biotrax === 1,
                    'onUpdate:checked': toggle,
                }),
            ]);
        },
    },
    {
        accessorKey: 'insurance',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'w-full text-center',
            }, () => ['Assurances', h(ArrowsUpDownIcon, { class: 'text-center' })]);
        },
        cell: ({ row }) => {
            const toggle = async (value: boolean) => {
                const index = dataUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    dataUsers.value[index].insurance = value ? 1 : 0;
                }

                await edit(Number(row.original.id), { insurance: dataUsers.value[index].insurance == 1 });
            };

            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': row.original.insurance === 1,
                    'onUpdate:checked': toggle,
                }),
            ]);
        },
    },
    {
        accessorKey: 'site',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'w-full text-center',
            }, () => ['Site', h(ArrowsUpDownIcon, { class: 'text-center' })]);
        },
        cell: ({ row }) => {
            const toggle = async (value: boolean) => {
                const index = dataUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    dataUsers.value[index].site = value ? 1 : 0;
                }

                await edit(Number(row.original.id), { site: dataUsers.value[index].site == 1 });
            };

            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': row.original.site === 1,
                    'onUpdate:checked': toggle,
                }),
            ]);
        },
    },
    {
        accessorKey: 'ambassador',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                class: 'w-full text-center',
            }, () => ['Ambassadeur', h(ArrowsUpDownIcon, { class: 'text-center' })]);
        },
        cell: ({ row }) => {
            const toggle = async (value: boolean) => {
                const index = dataUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    dataUsers.value[index].ambassador = value ? 1 : 0;
                }

                await edit(Number(row.original.id), { ambassador: dataUsers.value[index].ambassador == 1 });
            };

            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': row.original.ambassador === 1,
                    'onUpdate:checked': toggle,
                }),
            ]);
        },
    },
    {
        accessorKey: 'last_contact',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('last_contact'),
            }, () => ['Date dernier contact', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: () => {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('fr-FR');

            return h('div', { class: 'text-center' }, formattedDate);
        },
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
        accessorKey: 'action',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('action'),
            }, () => ['Action', h(ArrowsUpDownIcon)]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, [
                h(EyeIcon, {
                    class: 'w-5 h-5 text-blue-500 cursor-pointer inline-block',
                    onClick: () => openModal(row.original),
                }),
            ]);
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
        await getUsers(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);
</script>
