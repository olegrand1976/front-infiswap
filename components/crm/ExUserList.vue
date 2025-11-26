<template>
    <div class="w-full">
        <DataTable
            :data="localUsers"
            :columns="columnsExUsers"
        />

        <Dialog
            v-model:open="showModal"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
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
                :per-page="perPage"
                :total="props.users.total"
                @update:page="emit('refresh-users', $event)"
                @update:per-page="emit('handle-per-page-change', $event)"
                @user-updated="emit('user-updated', $event)"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { ColumnDef } from '@tanstack/vue-table';
import { PencilIcon } from '@heroicons/vue/24/outline';
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { Button } from '@/components/ui/button';
import type { Pagination, User } from '~/lib/types';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Switch } from '~/components/ui/switch';
import UsersName from '@/components/users/Name.vue';

const props = defineProps<{
    users: Pagination<User>;
    page: number;
    perPage: number;
}>();

const { edit } = useAuth();

const showModal = ref(false);
const loggedUser = useUser();
const user = ref<User | null>(null);

function openModal(selectedUser: User) {
    user.value = selectedUser;
    showModal.value = true;
}

const emit = defineEmits(['refresh-users', 'handle-per-page-change', 'set-sort', 'user-updated']);

const localUsers = ref<User[]>(props.users?.data ? [...props.users.data] : []);

const setSort = (columnKey: string) => {
    emit('set-sort', columnKey);
};

const columnsExUsers: ColumnDef<User>[] = [
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
            return h('div', { class: 'ml-4' }, row.getValue('zip_code'));
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
            return h('div', { class: 'ml-4' }, row.getValue('city'));
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
            return h('div', { class: 'ml-8' }, [
                h(PencilIcon, {
                    class: 'w-5 h-5 text-blue-500 cursor-pointer inline-block',
                    onClick: () => openModal(row.original),
                }),
            ]);
        },
    },
    {
        accessorKey: 'restored_by',
        header: 'Contacté',
        cell: ({ row }) => {
            const user = row.original as User;
            let disabled = false;

            const toggle = async () => {
                if (!user.restored_by) {
                    const response = await edit(Number(user.id), { restored_by: loggedUser.value.id });

                    if (response.status === 'Succès') {
                        user.restored_by = loggedUser.value;
                    }
                }
                else {
                    disabled = true;
                }
            };

            return h('div', { class: 'flex justify-start ml-4' }, [
                h(Switch, {
                    'class': '',
                    'checked': !!user.restored_by,
                    'onUpdate:checked': toggle,
                    'disabled': disabled,
                }),
            ]);
        },
        enableSorting: false,
    },
    {
        accessorKey: 'restored_by',
        header: 'Contacté par',
        cell: ({ row }) => {
            const user = row.original as User;

            const restoredByName = user.restored_by?.full_name ?? '-';

            if (!user.restored_by) {
                return h('div', { class: 'ml-10' }, restoredByName);
            }

            const restoredBy = user.restored_by;
            return h(UsersName, { class: 'hover:scale-105 hover:transition-all hover:duration-300 cursor-pointer', user: restoredBy });
        },
        enableSorting: false,
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
            return h('div', { class: 'ml-4' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'actions',
        header: () => {
            return h('div', { class: 'mx-2' }, 'Actions');
        },
        enableHiding: false,
        cell: () => {
            const actions = [
                {
                    label: 'Restaurer',
                },
            ];

            return h('div', { class: 'flex ml-4' }, [
                h(DropdownMenuAction, {
                    actions: actions,
                }),
            ]);
        },
    },
];

watch(() => props.users.data, (newUsersData) => {
    if (newUsersData) {
        localUsers.value = [...newUsersData];
    }
}, { deep: true, immediate: true });
</script>
