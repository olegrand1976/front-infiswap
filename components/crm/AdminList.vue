<template>
    <div class="w-full">
        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-center overflow-x-auto pb-3 px-4 scrollbar-hide">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par Nom ou Prénom"
                    class="w-[250px]"
                    @input="debouncedFilterUsers"
                />
                <InputIcon
                    v-model="option.zip"
                    rounded="md"
                    placeholder="Code postal"
                    class="w-[250px]"
                    type="number"
                    @input="debouncedFilterUsers"
                />
                <InputIcon
                    v-model="option.city"
                    rounded="md"
                    placeholder="Ville"
                    class="w-[250px]"
                    @input="debouncedFilterUsers"
                />
                <Select
                    v-model="option.insurance"
                    @update:model-value="debouncedFilterUsers"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Nursassur</span>
                        <strong class="ml-4">
                            {{
                                option.insurance === 1 ? 'oui' : option.insurance === 0 ? 'non' : 'tous'
                            }}
                        </strong>
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
                <Select
                    v-model="option.site"
                    @update:model-value="debouncedFilterUsers"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>NursTech</span>
                        <strong class="ml-4">
                            {{
                                option.site === 1 ? 'oui' : option.site === 0 ? 'non' : 'tous'
                            }}
                        </strong>
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
                :columns="columnsCrm"
            />
            <Dialog
                v-model:open="showModal"
                class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
            >
                <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full mx-2">
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
import { PencilIcon } from '@heroicons/vue/24/outline';
import { ArrowsUpDownIcon, ArrowPathIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import type { User } from '~/lib/types';
import { InputIcon } from '~/components/ui/input-with-icon';
import { PERPAGE } from '~/lib/constants';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const showModal = ref(false);

const openModal = (selectedUser) => {
    user.value = selectedUser;
    showModal.value = true;
};

useHead({ title: 'Suivi commercial' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { getAll } = useProduct();
const { users, getCrmPlus, isCollaborator } = useAuth();

const user = ref(null);
const route = useRoute();

const perPage = ref(PERPAGE);
const page = ref(1);

const emptyFilter = {
    name: null as string | null,
    zip: null as string | null,
    city: null as string | null,
    insurance: null as number | null,
    site: null as number | null,
};

const initialFilter = {
    ...emptyFilter,
    name: (route.query.name as string) ?? null,
    zip: null,
    city: null,
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
    await getCrmPlus(page.value, perPage.value, currentFilter);
};

const debouncedFilterUsers = debounce(filterUsers, 100);

onMounted(() => {
    if (option.value.name) {
        debouncedFilterUsers();
    }
});

await getAll();
await getCrmPlus(page.value, perPage.value, option.value);

const dataUsers = computed(() => users.value?.data ?? []);

const refreshUsers = async (page: number) => {
    await getCrmPlus(page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getCrmPlus(page.value, value, option.value);
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(emptyFilter);
    if (isSame) {
        return;
    }

    option.value = { ...emptyFilter };
    page.value = 1;

    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);

    await getCrmPlus(page.value, perPage.value, option.value);
};

const columnsCrm: ColumnDef<User>[] = [
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
        accessorKey: 'comment_crm',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('comment_crm') }, () => [
                'Commentaire',
                h(ArrowsUpDownIcon, { class: 'inline w-4 h-4 ml-1' }),
            ]),
        cell: ({ row }) => {
            const comment = row.original.comment_crm;

            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: comment,
                            }, comment || ''),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'contact_date',
        header: () => h(Button, { variant: 'ghost', onClick: () => setSort('contact_date') }, () => [
            'Date de contact',
            h(ArrowsUpDownIcon, { class: 'inline w-4 h-4 ml-1' }),
        ]),
        cell: ({ row }) => {
            const rawDate = row.original.contact_date;
            let formattedDate = '';

            if (rawDate) {
                const date = new Date(rawDate);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                formattedDate = `${day}/${month}/${year}`;
            }

            return h('div', { class: 'flex justify-center items-center gap-1' }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', formattedDate),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'contact_method',
        header: () => h(Button, { variant: 'ghost', onClick: () => setSort('contact_method') }, () => [
            'Contacté par',
            h(ArrowsUpDownIcon, { class: 'inline w-4 h-4 ml-1' }),
        ]),
        cell: ({ row }) => {
            const method = row.original.contact_method;
            const displayMethod = method === 'mail'
                ? 'Mail'
                : method === 'phone'
                    ? 'Téléphone'
                    : method === 'visio'
                        ? 'Visioconférence'
                        : '';

            return h('div', { class: 'flex justify-center items-center gap-1' }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', displayMethod),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'contact',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('contact'),
            }, () => ['Contact', h(ArrowsUpDownIcon)]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, [
                h(PencilIcon, {
                    class: 'w-5 h-5 text-blue-500 cursor-pointer inline-block',
                    onClick: () => openModal(row.original),
                }),
            ]);
        },
    },
    {
        accessorKey: 'nb_call',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('nb_call') }, () => [
                'Nombre d\'appels passés dans la semaine',
                h(ArrowsUpDownIcon, { class: 'inline w-4 h-4 ml-1' }),
            ]),
        cell: ({ row }) => {
            const nb_call = Number(row.original.crm?.nb_call) || 0;

            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: nb_call,
                            }, nb_call || ''),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'nb_sale',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('nb_sale') }, () => [
                'Nombre de vente passés dans la semaine',
                h(ArrowsUpDownIcon, { class: 'inline w-4 h-4 ml-1' }),
            ]),
        cell: ({ row }) => {
            const nb_sale = Number(row.original.crm?.nb_sale) || 0;

            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: nb_sale,
                            }, nb_sale || ''),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'nb_recommandation',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('nb_recommandation') }, () => [
                'Nombre de recommandations obtenues',
                h(ArrowsUpDownIcon, { class: 'inline w-4 h-4 ml-1' }),
            ]),
        cell: ({ row }) => {
            const nb_recommandation = Number(row.original.crm?.nb_recommandation) || 0;

            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: nb_recommandation,
                            }, nb_recommandation || ''),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'nb_meeting',
        header: () =>
            h(Button, { variant: 'ghost', onClick: () => setSort('nb_meeting') }, () => [
                'Nombre de rendez-vous planifiés',
                h(ArrowsUpDownIcon, { class: 'inline w-4 h-4 ml-1' }),
            ]),
        cell: ({ row }) => {
            const nb_meeting = Number(row.original.crm?.nb_meeting) || 0;

            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: nb_meeting,
                            }, nb_meeting || ''),
                        ]),
            ]);
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
        await getCrmPlus(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by,
        });
    },
    { deep: true },
);
</script>
