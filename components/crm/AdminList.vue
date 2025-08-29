<template>
    <div>
        <DataTable
            :data="localUsers"
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
            <DialogContent class="bg-white rounded-lg w-full min-h-[40vh] sm:min-h-[300px] sm:max-w-[700px] max-h-[700px] flex flex-col">
                <DialogHeader class="flex-shrink-0">
                    <DialogTitle class="text-primary">
                        Commentaires
                    </DialogTitle>
                </DialogHeader>

                <div class="flex-1 overflow-y-auto space-y-4">
                    <RollingLoader
                        v-if="loading"
                        :loading="loading"
                    />
                    <div v-else>
                        <div
                            v-for="comment in userComments"
                            :key="comment.id"
                            class="bg-white p-4 rounded-lg shadow-md"
                        >
                            <div class="text-gray-700 text-sm mb-2 flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <span>{{ formatRelativeDate(comment.created_at) }}</span>
                                    <span
                                        v-if="comment.created_at !== comment.updated_at"
                                        class=" text-xs font-semibold"
                                    >Modifié</span>
                                </div>
                                <div>
                                    <EditAndDeleteAction
                                        :on-delete="() => deleteComment(comment)"
                                        :on-edit="() => prepareCommentToUpdate(comment)"
                                    />
                                </div>
                            </div>
                            <p class="text-gray-700 w-full break-words whitespace-normal">
                                {{ comment.body ?? '' }}
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    class="flex-shrink-0 pt-2"
                    @submit.prevent="createOrUpdateComment"
                >
                    <h3 class="text-md font-bold mb-2">
                        {{ updatingComment!== null ? 'Modificatoin Commentaire' : 'Nouveau commentaire' }}
                    </h3>
                    <Textarea
                        v-model="updateFormData.lastComment"
                        class="w-full h-[4rem] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    />
                    <Button
                        class="rounded"
                        type="submit"
                        :in-progress="progressingComment"
                    >
                        {{ updatingComment !== null ? 'Modifier' : 'Créer' }}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

        <div>
            <CustomPagination
                :default-page="page"
                :per-page="perPage"
                :total="props.users?.total"
                @update:page="emit('refresh-users', $event)"
                @update:per-page="emit('handle-per-page-change', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { EyeIcon, PencilIcon } from '@heroicons/vue/24/outline';
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import type { Comment, Pagination, User } from '~/lib/types';
import { InputIcon } from '~/components/ui/input-with-icon';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { Switch } from '~/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/composables/useAuth';
import { formatRelativeDate } from '@/composables/useDate';
import { useCrm } from '@/composables/useCrm';
import { useComment } from '~/composables/useComment';

const props = defineProps<{
    users: Pagination<User>;
    page: number;
    perPage: number;
}>();

const emit = defineEmits(['refresh-users', 'handle-per-page-change', 'set-sort', 'update-users']);
const { loading, userComments, getUserComments, destroy, store, update } = useComment();

const showModal = ref(false);
const contactDialogOpen = ref(false);
const commentDialogOpen = ref(false);
const tempContactDate = ref('');
const tempContactMethod = ref('mail');
const editingUserId = ref<number | null>(null);
const tempCrmId = ref<number | null>(null);
const tempComment = ref('');
const tempClientType = ref('user');
const updatingComment = ref<Comment | null>(null);
const { $toast } = useNuxtApp();
const { edit, isCollaborator } = useAuth();
const { updateCrmUser } = useCrm();
const user = ref<User | null>(null);

const localUsers = ref<User[]>(props.users?.data ? [...props.users.data] : []);

function openModal(selectedUser: User) {
    user.value = selectedUser;
    showModal.value = true;
}

function openContactDialog(user: User) {
    editingUserId.value = user.id;
    tempCrmId.value = Number(user.crm.id);
    tempClientType.value = user.crm.client_type ?? '';
    tempContactDate.value = user.crm.last_contact_date ?? '';
    tempContactMethod.value = user.crm.last_contact_method ?? 'mail';
    updateFormData.lastContactDate = tempContactDate.value;
    updateFormData.lastContactMethod = tempContactMethod.value;
    contactDialogOpen.value = true;
}

async function openCommentDialog(user: User) {
    commentDialogOpen.value = true;
    tempCrmId.value = user.id;
    await getUserComments(user);
}

const prepareCommentToUpdate = (comment: Comment) => {
    updatingComment.value = comment;
    tempComment.value = comment.body;
};

const { submit: createOrUpdateComment, inProgress: progressingComment } = useSubmit(
    async () => {
        if (updatingComment.value !== null && typeof updatingComment.value.body === 'string') {
            const response = await update(updatingComment.value, {
                commentableId: updatingComment.value.commentable_id,
                commentableType: 'User',
                body: tempComment.value,
            });

            userComments.value = userComments.value.map(c =>
                c.id === updatingComment.value!.id ? { ...c, ...response } : c,
            );

            localUsers.value = localUsers.value.map(u =>
                u.id === tempCrmId.value ? { ...u, last_comment: response } : u,
            );
            emit('update-users', {
                ...props.users,
                data: props.users.data.map((u: User) =>
                    u.id === tempCrmId.value ? { ...u, last_comment: response } : u,
                ),
            });
        }
        else {
            const response = await store(tempCrmId.value, 'User', tempComment.value);

            userComments.value.unshift(response);

            localUsers.value = localUsers.value.map(u =>
                u.id === tempCrmId.value ? { ...u, last_comment: response } : u,
            );

            emit('update-users', {
                ...props.users,
                data: props.users.data.map((u: User) =>
                    u.id === tempCrmId.value ? { ...u, last_comment: response } : u,
                ),
            });
        }

        tempComment.value = null;
        updatingComment.value = null;
    },
    {
        onError: () => {
            $toast({
                description: 'Une erreur est survenue',
                variant: 'destructive',
            });
        },
    },
);

const deleteComment = (comment: Comment) => {
    destroy(comment).then(() => {
        userComments.value = userComments.value.filter((item: Comment) => item.id !== comment.id);

        localUsers.value = localUsers.value.map(u =>
            u.id === tempCrmId.value ? { ...u, last_comment: userComments.value[0] } : u,
        );

        emit('update-users', {
            ...props.users,
            data: props.users.data.map((u: User) =>
                u.id === tempCrmId.value
                    ? { ...u, last_comment: userComments.value[0] || null }
                    : u,
            ),
        });

        $toast({
            description: 'Commentaire supprimé avec succès',
        });
    }).catch(() => {
        $toast({
            description: 'Une erreur est survenue',
            variant: 'destructive',
        });
    });
};

const updateFormData = reactive({
    userId: editingUserId,
    clientType: tempClientType.value,
    lastContactDate: tempContactDate,
    lastContactMethod: tempContactMethod,
    lastComment: tempComment,
});

const updateCrmUserField = async (
    type: 'comment' | 'contact',
    dialogRef: Ref<boolean>,
) => {
    try {
        const response = await updateCrmUser(tempCrmId.value, updateFormData);
        $toast({
            description: response.message,
        });
        const idx = localUsers.value.findIndex(u => u.id === editingUserId.value);
        if (idx !== -1) {
            const current = localUsers.value[idx];
            const updatedUser = {
                ...current,
                crm: {
                    ...current.crm,
                    ...(type === 'contact'
                        ? {
                                last_contact_date: updateFormData.lastContactDate,
                                last_contact_method: updateFormData.lastContactMethod,
                            }
                        : { last_comment: updateFormData.lastComment }),
                },
            };
            localUsers.value[idx] = updatedUser;
            localUsers.value = [...localUsers.value];
        }
    }
    catch {
        $toast({
            description: 'Une erreur est survenue',
            variant: 'destructive',
        });
    }
    finally {
        dialogRef.value = false;
    }
};

function saveContact() {
    return updateCrmUserField(
        'contact',
        contactDialogOpen,
    );
}

const setSort = (columnKey: string) => {
    emit('set-sort', columnKey);
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
                const index = localUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== -1) {
                    localUsers.value[index].insurance = value ? 1 : 0;
                    const mods = localUsers.value[index].last_product_modifications ?? [];
                    const modIndex = mods.findIndex(p => (p.product_name || '').toLowerCase() === 'nursassur');
                    if (modIndex !== -1) {
                        mods[modIndex].activate = value ? 1 : 0;
                    }
                    localUsers.value[index].last_product_modifications = [...mods];
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
                const index = localUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== undefined && index !== -1 && props.users) {
                    localUsers.value[index].site = value ? 1 : 0;
                    const mods = localUsers.value[index].last_product_modifications ?? [];
                    const modIndex = mods.findIndex(p => (p.product_name || '').toLowerCase() === 'nurstech');
                    if (modIndex !== -1) mods[modIndex].activate = value ? 1 : 0;
                    localUsers.value[index].last_product_modifications = [...mods];
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
                const index = localUsers.value.findIndex(item => item.id === row.original.id);
                if (index !== undefined && index !== -1 && props.users) {
                    localUsers.value[index].ambassador = value ? 1 : 0;
                    const mods = localUsers[index].last_product_modifications ?? [];
                    const modIndex = mods.findIndex(p => (p.product_name || '').toLowerCase() === 'inficoncept');
                    if (modIndex !== -1) mods[modIndex].activate = value ? 1 : 0;
                    localUsers.value[index].last_product_modifications = [...mods];
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
        accessorKey: 'last_comment',
        header: 'Commentaire',
        cell: ({ row }) => {
            const comment = row.original?.last_comment;
            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: comment?.body ?? '',
                            }, comment?.body || ''),
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
        accessorKey: 'historic_activity.last_post_date',
        header: ({ column }) => h(
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
        accessorKey: 'historic_activity.last_accept_posted_date',
        header: ({ column }) => h(
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
        accessorKey: 'historic_activity.last_response_date',
        header: ({ column }) => h(
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
        accessorKey: 'historic_activity.last_accept_response_date',
        header: ({ column }) => h(
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
        id: 'action',
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

watch(() => props.users, (newUsers) => {
    localUsers.value = newUsers?.data ? [...newUsers.data] : [];
}, { immediate: true });
</script>
