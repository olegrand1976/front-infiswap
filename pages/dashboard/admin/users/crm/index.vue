<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Suivi utilisateurs - CRM" />

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
                :columns="columns"
            />
            <Dialog
                v-model:open="showModal"
                class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
            >
                <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-2">
                    <UsersCard :user="user" />
                </DialogContent>
            </Dialog>

            <Dialog
                v-model:open="contactDialogOpen"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
                <DialogContent class="bg-white rounded-lg p-6 max-w-md w-full">
                    <DialogHeader>
                        <DialogTitle class="text-lg font-semibold text-primary mb-4">
                            Modifier le contact
                        </DialogTitle>
                    </DialogHeader>

                    <form @submit.prevent="saveContact">
                        <div class="mb-4">
                            <label
                                for="contactDate"
                                class="block mb-1 text-sm font-medium text-gray-700"
                            >
                                Date de contact
                            </label>
                            <InputIcon
                                id="contactDate"
                                v-model="tempContactDate"
                                type="date"
                                class="w-full"
                            />
                        </div>

                        <div class="mb-4">
                            <span class="block mb-1 text-sm font-medium text-gray-700">Mode de contact</span>
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input
                                        v-model="tempContactMethod"
                                        type="radio"
                                        value="mail"
                                        class="form-radio"
                                    >
                                    <span class="ml-2">Mail</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        v-model="tempContactMethod"
                                        type="radio"
                                        value="phone"
                                        class="form-radio"
                                    >
                                    <span class="ml-2">Téléphone</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input
                                        v-model="tempContactMethod"
                                        type="radio"
                                        value="visio"
                                        class="form-radio"
                                    >
                                    <span class="ml-2">Visioconférence</span>
                                </label>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-2">
                            <Button
                                variant="secondary"
                                class="px-4 py-2 rounded"
                                type="button"
                                @click="contactDialogOpen = false"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                class="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                            >
                                Valider
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                v-model:open="commentDialogOpen"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
                <DialogContent class="bg-white rounded-lg p-6 max-w-md w-full">
                    <DialogHeader>
                        <DialogTitle class="text-lg font-semibold text-primary mb-4">
                            Rajouter un commentaire
                        </DialogTitle>
                    </DialogHeader>

                    <form @submit.prevent="saveComment">
                        <div>
                            <Textarea
                                v-model="tempComment"
                                class="w-full h-[9rem] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary peer mb-4"
                            />
                        </div>

                        <div class="flex justify-end space-x-2">
                            <Button
                                variant="secondary"
                                class="px-4 py-2 rounded"
                                type="button"
                                @click="contactDialogOpen = false"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                class="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                            >
                                Valider
                            </Button>
                        </div>
                    </form>
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
import { EyeIcon, PencilIcon } from '@heroicons/vue/24/outline';
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

const contactDialogOpen = ref(false);
const commentDialogOpen = ref(false);

const tempContactDate = ref('');
const tempContactMethod = ref('mail');
const editingUserId = ref<number | null>(null);
const tempComment = ref('');

const { $toast } = useNuxtApp();
const { getAll } = useProduct();
const { users, getUsers, edit, updateContact, updateField, isCollaborator } = useAuth();

function openContactDialog(user) {
    editingUserId.value = user.id;
    tempContactDate.value = user.contact_date ?? '';
    tempContactMethod.value = user.contact_method ?? 'mail';
    contactDialogOpen.value = true;
}

function openCommentDialog(user) {
    editingUserId.value = user.id;
    commentDialogOpen.value = true;
}

async function saveContact() {
    if (!editingUserId.value) return;

    await updateContact(editingUserId.value, {
        contact_date: tempContactDate.value,
        contact_method: tempContactMethod.value,
    });

    contactDialogOpen.value = false;
    await getUsers();
}

async function saveComment() {
    if (!editingUserId.value) return;
    await updateField(Number(editingUserId.value), { comment_crm: tempComment.value }).then(async () => {
        $toast({ description: 'Commentaire mises à jour avec succès' });

        commentDialogOpen.value = false;
        tempComment.value = '';
        await getUsers();
    });
}

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
    await getUsers(page.value, perPage.value, currentFilter);
};

const debouncedFilterUsers = debounce(filterUsers, 100);

onMounted(() => {
    if (option.value.name) {
        debouncedFilterUsers();
    }
});

await getAll();
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
    const isSame = JSON.stringify(option.value) === JSON.stringify(emptyFilter);
    if (isSame) {
        return;
    }

    option.value = { ...emptyFilter };
    page.value = 1;

    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);

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

            const toggle = async (value: boolean) => {
                const index = dataUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    dataUsers.value[index].insurance = value ? 1 : 0;

                    const mods = dataUsers.value[index].last_product_modifications ?? [];
                    const modIndex = mods.findIndex(p => (p.product_name || '').toLowerCase() === 'nursassur');
                    if (modIndex !== -1) {
                        mods[modIndex].activate = value ? 1 : 0;
                    }
                    dataUsers.value[index].last_product_modifications = [...mods];
                }

                await edit(Number(row.original.id), { nursassur: value });
            };

            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': currentValue === 1,
                    'onUpdate:checked': toggle,
                    'disabled': isCollaborator.value,
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

            const toggle = async (value: boolean) => {
                const index = dataUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    dataUsers.value[index].site = value ? 1 : 0;

                    const mods = dataUsers.value[index].last_product_modifications ?? [];
                    const modIndex = mods.findIndex(p => (p.product_name || '').toLowerCase() === 'nurstech');
                    if (modIndex !== -1) mods[modIndex].activate = value ? 1 : 0;
                    dataUsers.value[index].last_product_modifications = [...mods];
                }
                await edit(Number(row.original.id), { nurstech: value });
            };

            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': currentValue === 1,
                    'onUpdate:checked': toggle,
                    'disabled': isCollaborator.value,
                }),
            ]);
        },
        enableSorting: false,
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

            const toggle = async (value: boolean) => {
                const index = dataUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    dataUsers.value[index].ambassador = value ? 1 : 0;

                    const mods = dataUsers.value[index].last_product_modifications ?? [];
                    const modIndex = mods.findIndex(p => (p.product_name || '').toLowerCase() === 'inficoncept');
                    if (modIndex !== -1) mods[modIndex].activate = value ? 1 : 0;
                    dataUsers.value[index].last_product_modifications = [...mods];
                }
                await edit(Number(row.original.id), { inficoncept: value });
            };

            return h('div', { class: 'flex justify-center' }, [
                h(Switch, {
                    'class': 'mx-auto text-center',
                    'checked': currentValue === 1,
                    'onUpdate:checked': toggle,
                    'disabled': isCollaborator.value,
                }),
            ]);
        },
        enableSorting: false,
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

                            h(PencilIcon, {
                                class: 'w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800 flex-shrink-0',
                                onClick: () => openCommentDialog(row.original),
                            }),
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
                            h(PencilIcon, {
                                class: 'w-3 h-3 cursor-pointer hover:text-gray-700',
                                onClick: () => openContactDialog(row.original),
                            }),
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
                            h(PencilIcon, {
                                class: 'w-3 h-3 cursor-pointer hover:text-gray-700',
                                onClick: () => openContactDialog(row.original),
                            }),
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
            }, () => ['Date de création', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => {
            const rawDate = row.original.created_at;
            const dateObj = new Date(rawDate);

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            const formattedDate = `${day}/${month}/${year}`;

            return h('div', { class: 'text-center' }, formattedDate);
        },
    },
    {
        id: 'last_post_date',
        accessorKey: 'activite.last_post_date',
        header: ({ column }) =>
            h(
                'div',
                {
                    class: 'relative group w-max mx-auto cursor-default',
                    title: 'Date de dernière post d\'un remplacement',
                },
                [
                    h(
                        Button,
                        {
                            variant: 'ghost',
                            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                        },
                        () => [
                            'Dernière post',
                            h(ArrowsUpDownIcon, { class: 'ml-1 inline w-4 h-4' }),
                        ],
                    ),
                ],
            ),
        cell: ({ row }) => {
            const rawDate = row.original.historic_activity?.last_post_date;

            if (!rawDate) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const dateObj = new Date(rawDate);

            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');

            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

            return h('div', { class: 'text-center' }, formattedDate);
        },
        sortingFn: (rowA, rowB) => {
            const a = new Date(rowA.original.historic_activity?.last_post_date ?? 0).getTime();
            const b = new Date(rowB.original.historic_activity?.last_post_date ?? 0).getTime();
            return a - b;
        },
    },
    {
        id: 'last_accept_posted_date',
        accessorKey: 'activite.last_accept_posted_date',
        header: ({ column }) =>
            h(
                'div',
                {
                    class: 'relative group w-max mx-auto cursor-default',
                    title: 'Date de dernière acceptation d\'un remplacement',
                },
                [
                    h(
                        Button,
                        {
                            variant: 'ghost',
                            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                        },
                        () => [
                            'Dernière acceptation',
                            h(ArrowsUpDownIcon, { class: 'ml-1 inline w-4 h-4' }),
                        ],
                    ),
                ],
            ),
        cell: ({ row }) => {
            const rawDate = row.original.historic_activity?.last_accept_posted_date;

            if (!rawDate) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const dateObj = new Date(rawDate);

            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');

            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

            return h('div', { class: 'text-center' }, formattedDate);
        },
        sortingFn: (rowA, rowB) => {
            const a = new Date(rowA.original.historic_activity?.last_accept_posted_date ?? 0).getTime();
            const b = new Date(rowB.original.historic_activity?.last_accept_posted_date ?? 0).getTime();
            return a - b;
        },
    },
    {
        id: 'last_response_date',
        accessorKey: 'activite.last_response_date',
        header: ({ column }) =>
            h(
                'div',
                {
                    class: 'relative group w-max mx-auto cursor-default',
                    title: 'Date de dernière réponse à un remplacement posté',
                },
                [
                    h(
                        Button,
                        {
                            variant: 'ghost',
                            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                        },
                        () => [
                            'Dernière réponse',
                            h(ArrowsUpDownIcon, { class: 'ml-1 inline w-4 h-4' }),
                        ],
                    ),
                ],
            ),
        cell: ({ row }) => {
            const rawDate = row.original.historic_activity?.last_response_date;

            if (!rawDate) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const dateObj = new Date(rawDate);

            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');

            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

            return h('div', { class: 'text-center' }, formattedDate);
        },
        sortingFn: (rowA, rowB) => {
            const a = new Date(rowA.original.historic_activity?.last_response_date ?? 0).getTime();
            const b = new Date(rowB.original.historic_activity?.last_response_date ?? 0).getTime();
            return a - b;
        },
    },
    {
        id: 'last_accept_response_date',
        accessorKey: 'activite.last_accept_response_date',
        header: ({ column }) =>
            h(
                'div',
                {
                    class: 'relative group w-max mx-auto cursor-default',
                    title: 'Date de dernière acceptation sur un remplacement posté',
                },
                [
                    h(
                        Button,
                        {
                            variant: 'ghost',
                            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                        },
                        () => [
                            'Acceptation réponse',
                            h(ArrowsUpDownIcon, { class: 'ml-1 inline w-4 h-4' }),
                        ],
                    ),
                ],
            ),
        cell: ({ row }) => {
            const rawDate = row.original.historic_activity?.last_accept_response_date;

            if (!rawDate) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const dateObj = new Date(rawDate);

            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, ' ');
            }

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');

            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

            return h('div', { class: 'text-center' }, formattedDate);
        },
        sortingFn: (rowA, rowB) => {
            const a = new Date(rowA.original.historic_activity?.last_accept_response_date ?? 0).getTime();
            const b = new Date(rowB.original.historic_activity?.last_accept_response_date ?? 0).getTime();
            return a - b;
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
            const rawDate = row.original.last_login_at;

            if (!rawDate) {
                return h('div', { class: 'text-center' }, '');
            }

            const dateObj = new Date(rawDate);

            if (isNaN(dateObj.getTime())) {
                return h('div', { class: 'text-center' }, '');
            }

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');

            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

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
            sortKey: newVal.by,
        });
    },
    { deep: true },
);
</script>
