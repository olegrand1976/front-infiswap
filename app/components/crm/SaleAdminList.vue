<template>
    <div class="w-full">
        <DataTable
            :data="localUsers"
            :columns="columnsCrm"
        />

        <Dialog
            v-model:open="showModal"
            class="fixed inset-0 flex items-center justify-center bg-black/50"
        >
            <DialogContent class="w-full max-w-3xl p-6 mx-2 bg-white rounded-lg shadow-lg">
                <UsersCard
                    :user="user"
                    @close="showModal = false"
                    @user-updated="emit('user-updated', $event)"
                />
            </DialogContent>
        </Dialog>

        <div>
            <CustomPagination
                :default-page="page"
                :internal-per-page="perPage"
                :total="props.users.total"
                @update:page="emit('refresh-users', $event)"
                @update:per-page="emit('handle-per-page-change', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown, Pencil } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import type { Pagination, User } from '~/lib/types';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/composables/useAuth';

const props = defineProps<{
    users: Pagination<User>;
    page: number;
    perPage: number;
}>();

const emit = defineEmits(['refresh-users', 'handle-per-page-change', 'set-sort', 'user-updated']);

const showModal = ref(false);
const user = ref<User | null>(null);
const { isCollaborator } = useAuth();

function openModal(selectedUser: User) {
    user.value = selectedUser;
    showModal.value = true;
}

const setSort = (columnKey: string) => {
    emit('set-sort', columnKey);
};

const localUsers = ref<User[]>(props.users?.data ? [...props.users.data] : []);

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
            }, () => ['Nom', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'crm.last_comment',
        header: () => h(Button, { variant: 'ghost', onClick: () => setSort('crm.last_comment') }, () => [
            'Commentaire',
            h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
        ]),
        cell: ({ row }) => {
            const comment = row.original?.crm?.last_comment;
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
            h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
        ]),
        cell: ({ row }) => {
            const rawDate = row.original.crm.last_contact_date;
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
            h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
        ]),
        cell: ({ row }) => {
            const method = row.original.crm.last_contact_method;
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
            }, () => ['Contact', h(ArrowUpDown)]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, [
                h(Pencil, {
                    class: 'w-5 h-5 text-blue-500 cursor-pointer inline-block',
                    onClick: () => openModal(row.original),
                }),
            ]);
        },
    },
    {
        accessorKey: 'nb_call',
        header: () => h(Button,
            {
                variant: 'ghost',
                onClick: () => setSort('nb_call'),
                title: 'Nombre d\'appels passés dans la semaine',
            },
            () => [
                'Nombre d\'appels passés',
                h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
            ],
        ),
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
                                title: nb_call.toString(),
                            }, nb_call || ''),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'nb_sale',
        header: () => h(Button,
            {
                variant: 'ghost',
                onClick: () => setSort('nb_sale'),
                title: 'Nombre de ventes passées dans la semaine',
            },
            () => [
                'Nombre de ventes passées',
                h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
            ],
        ),
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
                                title: nb_sale.toString(),
                            }, nb_sale || ''),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'nb_recommandation',
        header: () => h(Button,
            {
                variant: 'ghost',
                onClick: () => setSort('nb_recommandation'),
                title: 'Nombre de recommandations obtenues dans la semaine',
            },
            () => [
                'Nombre de recommandations obtenues',
                h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
            ],
        ),
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
                                title: nb_recommandation.toString(),
                            }, nb_recommandation || ''),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'nb_meeting',
        header: () => h(Button,
            {
                variant: 'ghost',
                onClick: () => setSort('nb_meeting'),
                title: 'Nombre de rendez-vous planifiés dans la semaine',
            },
            () => [
                'Nombre de rendez-vous planifiés',
                h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
            ],
        ),
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
                                title: nb_meeting.toString(),
                            }, nb_meeting || ''),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'nb_pending',
        header: () => h(Button,
            {
                variant: 'ghost',
                onClick: () => setSort('nb_pending'),
                title: 'Nombre de réponses en attente dans la semaine',
            },
            () => [
                'Nombre de réponses en attente',
                h(ArrowUpDown, { class: 'inline w-4 h-4 ml-1' }),
            ],
        ),
        cell: ({ row }) => {
            const nb_pending = Number(row.original.crm?.nb_pending) || 0;
            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: nb_pending.toString(),
                            }, nb_pending || ''),
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
            }, () => ['Création', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
];

watch(() => props.users.data, (newUsersData) => {
    if (newUsersData) {
        localUsers.value = [...newUsersData];
    }
}, { deep: true, immediate: true });
</script>
