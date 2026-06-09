<template>
    <div>
        <DashboardAdminPageHeader
            title="Factures"
            :count="invoices.meta.total"
        />

        <DashboardAdminPageContent>
            <DataTable
                :data="dataInvoices"
                :columns="columns"
            />

            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="invoices.meta.total"
                    @update:page="refreshInvoices"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>

        <Dialog v-model:open="mailComposeDialog">
            <DialogContent class="max-w-xl h-[70%] overflow-y-auto">
                <DialogTitle>
                    Envoyer la facture
                </DialogTitle>
                <DialogDescription>
                    Prêt à envoyer la facture ? Ajoutez un message personnalisé et envoyez-la directement en cliquant sur <span class="font-semibold">'Envoyer'</span>.
                </DialogDescription>

                <form
                    class="mt-4 grid gap-4"
                    @submit.prevent="submit"
                >
                    <div class="space-y-2">
                        <label class="text-gray-600 text-sm font-medium">
                            Destinataire
                        </label>
                        <InputIcon
                            v-model="formEmail.recipient"
                            :disabled="true"
                            rounded="md"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-gray-600 text-sm font-medium">
                            Objet
                        </label>
                        <InputIcon
                            v-model="formEmail.object"
                            rounded="md"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-gray-600 text-sm font-medium">
                            Contenu
                        </label>
                        <Textarea
                            v-model="formEmail.content"
                            :rows="8"
                            class="text-sm w-full resize-none rounded-md p-4 text-gray-900 placeholder:text-gray-900/80 bg-transparent outline-none border-2 border-gray-300 focus-within:border-primary"
                        />
                    </div>

                    <div
                        class="mb-4 flex items-center gap-2 text-primary cursor-pointer"
                        @click="handleViewInvoice(selectedInvoice.id)"
                    >
                        <Paperclip class="w-5 h-5" />
                        <span
                            v-if="attachedFile"
                            class="text-sm text-gray-700 truncate max-w-[240px]"
                        >
                            Pièce jointe : {{ attachedFile.name }}
                        </span>
                    </div>

                    <div class="mt-6 mb-4 flex justify-end gap-4">
                        <Button
                            class="rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-700"
                            @click="handleCancelCompose"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            class="rounded-md"
                            :in-progress="inProgress"
                        >
                            Envoyer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { ChevronsUpDown, FileText, Paperclip } from 'lucide-vue-next';
import type { ColumnDef } from '@tanstack/vue-table';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { UsersName } from '#components';
import Button from '~/components/ui/button/Button.vue';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { PERPAGE } from '~/lib/constants';
import type { MissionInvoice } from '~/lib/types';

useHead({ title: 'Factures' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const statusLabel = {
    draft: 'Brouillon',
    sent: 'Livré',
    paid: 'Payé',
};

const { $toast } = useNuxtApp();
const selectedInvoice = ref<MissionInvoice>(null);
const attachedFile = ref<File | null>(null);
const mailComposeDialog = ref(false);
const router = useRouter();
const perPage = ref(PERPAGE);
const page = ref(1);

const { getAll, invoices, viewPdf, update } = useMissionInvoices();
const { sendMail } = useMail();

await getAll(page.value, perPage.value);
const dataInvoices = computed(() => invoices.value.data ?? []);

const refreshInvoices = async (pge: number) => {
    page.value = pge;
    await getAll(page.value, perPage.value);
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getAll(page.value, perPage.value);
};

const columns: ColumnDef<MissionInvoice>[] = [
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
        id: 'mission',
        accessorFn: row => row.mission_id,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Mission', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const missionId = `#${row.original.mission_id}`;
            return h('div', { class: 'ml-4 w-40 truncate' }, missionId);
        },
    },
    {
        id: 'period_start',
        accessorFn: row => row.period_start,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Début', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const start = row.original.period_start;
            return h('div', { class: 'ml-4 w-40 truncate' }, formatToDMY(start));
        },
    },
    {
        id: 'period_end',
        accessorFn: row => row.period_end,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Fin', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const end = row.original.period_end;
            return h('div', { class: 'ml-4 w-40 truncate' }, formatToDMY(end));
        },
    },
    {
        id: 'nurse',
        accessorFn: row => row.mission.nurse,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Infirmier', h('', { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            const user = row.original.mission.nurse;
            return h(UsersName, { class: 'ml-4', user: user });
        },
    },
    {
        id: 'status',
        accessorFn: row => row.status,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Statut', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const status = row.original.status;
            return h('div', { class: 'px-4 py-3 text-xs text-center font-medium bg-primary/20 text-gray-700 rounded-full' }, statusLabel[status]);
        },
    },
    {
        id: 'path',
        accessorFn: row => row.path,
        header: () =>
            h(Button, { variant: 'ghost' }, () => ['Fichier', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const fullPath = row.original.path;
            const fileName = fullPath.split('/').pop();

            return h('div', { class: 'flex items-center justify-center gap-2 font-medium text-gray-700 truncate w-40' }, [
                h(FileText, { class: 'w-4 h-4 text-gray-500 flex-shrink-0' }),
                h('span', { class: 'truncate' }, fileName),
            ]);
        },
    },
    {
        id: 'invoice_lines',
        accessorFn: row => row.invoice_lines,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Jours facturés', h('', { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            const count = row.original.invoice_lines.length;
            return h('div', { class: 'w-40 text-center truncate' }, count);
        },
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Création', h(ChevronsUpDown, { class: '' })]);
        },
        cell: ({ row }) => {
            return h('div', { class: '' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const invoice = row.original;
            const actions = [
                {
                    label: 'Visualiser',
                    onClick: () => handleViewInvoice(invoice.id),
                },
                {
                    label: 'Détail de la mission',
                    onClick: () => handleShowMission(invoice.mission_id),
                },
                {
                    label: 'Feuille de temps',
                    onClick: () => handleShowTimesheet(invoice.mission_id),
                },
                ...(invoice.status == 'draft'
                    ? [{
                            label: 'Envoyer la facture',
                            onClick: () => handleComposeMail(invoice),
                        }]
                    : []),
                ...(invoice.status != 'draft' && (invoice.status == 'sent' || invoice.status != 'paid')
                    ? [{
                            label: 'Marquer comme payé',
                            onClick: () => handleMarkAsPaid(invoice),
                        }]
                    : []),
            ];

            return h('div', { class: 'ml-4' }, [
                h(DropdownMenuAction, {
                    actions: actions,
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
        await getAll(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);

const handleShowMission = (id: number) => {
    router.push(`/dashboard/institution/missions/${id}`);
};

const handleShowTimesheet = (id: number) => {
    router.push(`/dashboard/institution/missions/timesheet/${id}`);
};

const handleViewInvoice = async (id: number) => {
    await viewPdf(id);
};

const handleComposeMail = async (invoice: MissionInvoice) => {
    selectedInvoice.value = invoice;
    mailComposeDialog.value = true;

    const file = await viewPdf(selectedInvoice.value.id, false);
    if (file) {
        attachedFile.value = file;
    }
};

const formEmail = reactive({
    recipient: '',
    object: '',
    content: '',
});

watch(selectedInvoice, (newValue) => {
    if (newValue) {
        formEmail.recipient = newValue.mission.nurse.email ?? '';
    }
}, { immediate: true });

const handleCancelCompose = () => {
    mailComposeDialog.value = false;
    selectedInvoice.value = null;
    attachedFile.value = null;
};

const handleUpdateInvoice = async (invoice: MissionInvoice, status: string) => {
    return await update(invoice.id, { status: status });
};

const { submit, inProgress } = useSubmit(
    async function sendMailFront() {
        const formData = new FormData();
        formData.append('object', formEmail.object);
        formData.append('content', formEmail.content);

        formData.append(`recipients[${0}][email]`, formEmail.recipient);
        formData.append(`recipients[${0}][name]`, selectedInvoice.value.mission.nurse.full_name);
        formData.append(`recipients[${0}][user_id]`, selectedInvoice.value.mission.nurse.id.toString());

        if (attachedFile.value instanceof File) {
            formData.append('attachement[]', attachedFile.value);
        }

        try {
            await sendMail(formData);
            const response = await handleUpdateInvoice(selectedInvoice.value, 'sent');

            if (response.data) {
                const updatedInvoice = response.data;

                invoices.value = {
                    ...invoices.value,
                    data: invoices.value.data.map(invoice =>
                        invoice.id === updatedInvoice.id
                            ? { ...invoice, ...updatedInvoice }
                            : invoice,
                    ),
                };

                handleCancelCompose();

                $toast({
                    title: 'Succès !',
                    description: 'La facture a été bien envoyée',
                });
            }
        }
        catch (err) {
            if (err.data && err.data.errors) {
                const backendErrors = err.data.errors;
                const firstField = Object.keys(backendErrors)[0];
                const firstMessage = backendErrors[firstField][0];

                $toast({
                    description: firstMessage,
                    status: 'error',
                    variant: 'destructive',
                });
            }
        }
    },
);

const handleMarkAsPaid = async (invoice: MissionInvoice) => {
    const response = await handleUpdateInvoice(invoice, 'paid');

    if (response.data) {
        const updatedInvoice = response.data;

        invoices.value = {
            ...invoices.value,
            data: invoices.value.data.map(invoice =>
                invoice.id === updatedInvoice.id
                    ? { ...invoice, ...updatedInvoice }
                    : invoice,
            ),
        };

        handleCancelCompose();

        $toast({
            title: 'Succès !',
            description: 'La facture a été marquée comme payé',
        });
    }
};
</script>
