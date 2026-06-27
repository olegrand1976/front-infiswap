<template>
    <div class="flex h-full min-h-0 w-full flex-col">
        <div
            v-if="selectedCount > 0"
            class="mb-3 flex shrink-0 items-center gap-3 px-2"
        >
            <span class="text-sm text-gray-600">{{ selectedCount }} sélectionné(s)</span>
            <Button
                size="sm"
                variant="outline"
                class="rounded-md"
                @click="exportSelectedCsv"
            >
                Exporter la sélection
            </Button>
        </div>
        <DataTable
            ref="dataTableRef"
            class="min-h-0 flex-1"
            :data="localUsers"
            :columns="columns"
            manual-sorting
            constrained-height
            :sticky-leading-columns="2"
        />

        <Dialog
            v-model:open="showModal"
            class="fixed inset-0 flex justify-center items-center bg-black/50"
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
                <DialogHeader class="shrink-0">
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
                            <p class="text-gray-700 w-full wrap-break-word whitespace-normal">
                                {{ comment.body ?? '' }}
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    class="shrink-0 pt-2"
                    @submit.prevent="createOrUpdateComment"
                >
                    <h3 class="text-md font-bold mb-2">
                        {{ updatingComment!== null ? 'Modification Commentaire' : 'Nouveau commentaire' }}
                    </h3>
                    <Textarea
                        v-model="updateFormData.lastComment"
                        class="w-full h-16 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
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

        <Dialog
            v-model:open="referrerDialogOpen"
            class="fixed inset-0 flex justify-center items-center bg-black/50"
        >
            <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-2">
                <p class="font-semibold mb-4">
                    Apporté par
                </p>

                <div class="flex flex-wrap gap-4 mb-4">
                    <label class="inline-flex items-center">
                        <input
                            v-model="referrerMode"
                            type="radio"
                            value="account"
                            class="form-radio"
                        >
                        <span class="ml-2">Porteur d'affaire</span>
                    </label>
                    <label class="inline-flex items-center">
                        <input
                            v-model="referrerMode"
                            type="radio"
                            value="text"
                            class="form-radio"
                        >
                        <span class="ml-2">Texte libre</span>
                    </label>
                </div>

                <div
                    v-if="referrerMode === 'text'"
                    class="mb-4"
                >
                    <label
                        for="referrerFreeText"
                        class="block mb-1 text-sm font-medium text-gray-700"
                    >
                        Nom ou source
                    </label>
                    <InputIcon
                        id="referrerFreeText"
                        v-model="tempReferrerText"
                        type="text"
                        class="w-full"
                        placeholder="Ex. Dr Dupont, salon Infirmiers 2025…"
                    />
                </div>

                <template v-else>
                    <RollingLoader
                        v-if="loading"
                        :loading="loading"
                    />

                    <template v-else>
                        <p
                            v-if="!userReferrer || userReferrer.length === 0"
                            class="text-gray-500 italic text-center py-4"
                        >
                            Pas encore de porteur d'affaire enregistré
                        </p>

                        <ul
                            v-else
                            class="space-y-2 max-h-64 overflow-y-auto"
                        >
                            <li
                                v-for="ref in userReferrer"
                                :key="ref.id"
                                class="cursor-pointer hover:bg-primary/90 hover:text-white p-2 rounded"
                                :class="{ 'bg-primary text-white font-semibold': selectedReferrer?.id === ref.id }"
                                @click="selectedReferrer = ref"
                            >
                                {{ ref.full_name }} ({{ ref.email }})
                            </li>
                        </ul>
                    </template>
                </template>

                <div class="flex justify-end space-x-2 mt-4">
                    <Button
                        variant="secondary"
                        class="px-4 py-2 rounded"
                        type="button"
                        @click="referrerDialogOpen = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        class="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                        @click="confirmReferrer"
                    >
                        Valider
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <div class="mt-auto shrink-0">
            <CustomPagination
                :default-page="page"
                :internal-per-page="perPage"
                :total="props.users?.total"
                @update:page="emit('refresh-users', $event)"
                @update:per-page="emit('handle-per-page-change', $event)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown, Eye, Pencil } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import type { Comment, Pagination, User, Referrer } from '~/lib/types';
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

const authUser = useState('user');

const emit = defineEmits(['refresh-users', 'handle-per-page-change', 'set-sort', 'update-users']);
const { loading, userComments, getUserComments, destroy, store, update } = useComment();
const { updateReferrer, userReferrer, getUserReferrer, referrerDisplayLabel } = useReferrer();

const showModal = ref(false);
const contactDialogOpen = ref(false);
const commentDialogOpen = ref(false);
const referrerDialogOpen = ref(false);
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
const selectedReferrer = ref<Referrer | null>(null);
const referrerMode = ref<'account' | 'text'>('text');
const tempReferrerText = ref('');

const localUsers = ref<User[]>(props.users?.data ? [...props.users.data] : []);
const dataTableRef = ref<{ table: { getFilteredSelectedRowModel: () => { rows: { original: User }[] } } } | null>(null);

const selectedCount = computed(() => dataTableRef.value?.table.getFilteredSelectedRowModel().rows.length ?? 0);

function exportSelectedCsv() {
    const rows = dataTableRef.value?.table.getFilteredSelectedRowModel().rows.map(r => r.original) ?? [];
    if (!rows.length) return;

    const headers = ['Nom', 'Email', 'Téléphone', 'Code postal', 'Ville', 'NursAssur', 'NursTech'];
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const lines = [
        headers.join(';'),
        ...rows.map(user => [
            user.full_name,
            user.email,
            user.phone_number,
            user.zip_code,
            user.city,
            user.insurance ? 'oui' : 'non',
            user.site ? 'oui' : 'non',
        ].map(escape).join(';')),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crm-selection-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

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

async function openReferrerDialog(user: User) {
    referrerDialogOpen.value = true;
    tempCrmId.value = user.id;
    const referrer = user.referred_by;

    if (referrer?.text) {
        referrerMode.value = 'text';
        tempReferrerText.value = referrer.text;
        selectedReferrer.value = null;
    }
    else if (referrer?.id) {
        referrerMode.value = 'account';
        tempReferrerText.value = '';
        selectedReferrer.value = referrer;
    }
    else {
        referrerMode.value = 'text';
        tempReferrerText.value = '';
        selectedReferrer.value = null;
    }

    await getUserReferrer();
}

async function confirmReferrer() {
    const payload = referrerMode.value === 'text'
        ? {
                referred_by: null,
                referred_by_text: tempReferrerText.value.trim() || null,
            }
        : {
                referred_by: selectedReferrer.value?.id ?? null,
                referred_by_text: null,
            };

    try {
        const response = await updateReferrer(tempCrmId.value, payload);

        localUsers.value = localUsers.value.map(u =>
            u.id === tempCrmId.value
                ? { ...u, referred_by: { ...response } }
                : u,
        );

        emit('update-users', {
            ...props.users,
            data: localUsers.value,
        });

        $toast({
            description: 'Apporté par mis à jour avec succès',
            variant: 'success',
        });

        referrerDialogOpen.value = false;
    }
    catch (error) {
        console.error(error);
        $toast({
            description: 'Une erreur est survenue',
            variant: 'destructive',
        });
    }
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

const isFranceUser = computed(() => {
    const country = authUser.value?.profile?.country?.toLowerCase();

    return country === 'fr' || country === 'france';
});

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
            }, () => ['Nom', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('full_name')),
    },
    {
        accessorKey: 'zip_code',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('zip_code'),
            }, () => ['C.P', h(ArrowUpDown, { class: '' })]);
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
            }, () => ['Ville', h(ArrowUpDown, { class: '' })]);
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
                    'disabled': isCollaborator.value || isFranceUser.value,

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
                            h(Pencil, {
                                class: 'w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800 shrink-0',
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
                            h(Pencil, {
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
                            h(Pencil, {
                                class: 'w-3 h-3 cursor-pointer hover:text-gray-700',
                                onClick: () => openContactDialog(row.original),
                            }),
                        ]),
            ]);
        },
    },
    {
        accessorKey: 'crm.referred_by',
        header: 'Apporté par',
        cell: ({ row }) => {
            const referrer = row.original?.referred_by as Referrer | undefined;
            const label = referrerDisplayLabel(referrer);

            return h('div', {
                class: 'flex justify-center items-center gap-1',
            }, [
                isCollaborator.value
                    ? h('span', { class: 'text-gray-400' }, label || '-')
                    : h('div', { class: 'flex justify-center items-center gap-1' }, [
                            h('span', {
                                class: 'max-w-[150px] truncate text-sm',
                                title: label,
                            }, label),
                            h(Pencil, {
                                class: 'w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800 shrink-0',
                                onClick: () => openReferrerDialog(row.original),
                            }),
                        ]),
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
            }, () => ['Date de création', h(ArrowUpDown, { class: '' })]);
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
        header: () => h('div', {
            class: 'text-center text-sm',
            title: 'Date de dernière post d\'un remplacement',
        }, 'Dernière post'),
        enableSorting: false,
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
    },
    {
        id: 'last_accept_posted_date',
        accessorKey: 'historic_activity.last_accept_posted_date',
        header: () => h('div', {
            class: 'text-center text-sm',
            title: 'Date de dernière acceptation d\'un remplacement',
        }, 'Dernière acceptation'),
        enableSorting: false,
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
    },
    {
        id: 'last_response_date',
        accessorKey: 'historic_activity.last_response_date',
        header: () => h('div', {
            class: 'text-center text-sm',
            title: 'Date de dernière réponse à un remplacement posté',
        }, 'Dernière réponse'),
        enableSorting: false,
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
    },
    {
        id: 'last_accept_response_date',
        accessorKey: 'historic_activity.last_accept_response_date',
        header: () => h('div', {
            class: 'text-center text-sm',
            title: 'Date de dernière acceptation sur un remplacement posté',
        }, 'Acceptation réponse'),
        enableSorting: false,
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
    },
    {
        accessorKey: 'last_login_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('last_login_at'),
            }, () => ['Dernière connexion', h(ArrowUpDown, { class: '' })]);
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
            }, () => ['Création', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'action',
        header: () => 'Action',
        cell: ({ row }) => {
            return h('div', { class: 'text-center' }, [
                h(Eye, {
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
