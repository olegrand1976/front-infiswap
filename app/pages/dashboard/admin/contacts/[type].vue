<template>
    <div class="w-full">
        <DashboardAdminPageHeader :title="`Liste des contacts - ${typeLabel}`" />

        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-center overflow-x-auto pb-3 px-4 scrollbar-hide">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par nom"
                    class="w-[250px]"
                    @input="debouncedFilter"
                />
                <InputIcon
                    v-model="option.email"
                    rounded="md"
                    placeholder="Filtrer par email"
                    class="w-[250px]"
                    @input="debouncedFilter"
                />
                <Button
                    class="rounded-md"
                    @click="resetFilter"
                >
                    <RefreshCw class="md:mr-2" />
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

        <div
            v-if="showMailModal"
            class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center text-sm"
        >
            <div class="bg-white p-6 rounded-lg w-full max-w-xl relative mx-4">
                <button
                    class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Fermer"
                    @click="showMailModal = false"
                >
                    <X class="h-5 w-5" />
                </button>
                <h3 class="text-lg font-semibold mb-4">
                    Répondre au contact
                </h3>

                <form @submit.prevent="submit">
                    <label class="block mb-4">
                        Destinataire :
                        <InputIcon
                            v-model="newMail.recipients[0].email"
                            class="w-full mt-2"
                        />
                    </label>

                    <label class="block mb-4">
                        Objet :
                        <InputIcon
                            v-model="newMail.object"
                            class="mt-2"
                        />
                    </label>

                    <label class="block mb-2 space-y-2">
                        <span>Contenu :</span>
                        <div class="h-40 rounded-3xl border-2 border-gray-300">
                            <Textarea
                                v-model="newMail.content"
                                class="text-base w-full h-full resize-none rounded-xl p-4 text-black placeholder:text-black/80 bg-transparent outline-none"
                            />
                        </div>
                    </label>

                    <div class="mb-4">
                        <input
                            ref="fileInput"
                            type="file"
                            multiple
                            class="hidden"
                            @change="handleFileSelection"
                        >
                        <button
                            type="button"
                            class="flex items-center gap-2 text-primary hover:underline"
                            @click="fileInput?.click()"
                        >
                            <Paperclip class="w-5 h-5" />
                            <span>Joindre des fichiers</span>
                        </button>
                    </div>

                    <div
                        v-if="selectedFiles.length"
                        class="mb-4 flex flex-wrap gap-2"
                    >
                        <div
                            v-for="(file, index) in selectedFiles"
                            :key="file.name + index"
                            class="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                        >
                            📎 <span class="mx-1 truncate max-w-[200px]">{{ file.name }}</span>
                            <button
                                type="button"
                                class="text-red-500 hover:text-red-700"
                                @click="removeFile(index)"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-2">
                        <Button
                            type="button"
                            class="px-4 py-2 rounded border bg-white text-gray-600 hover:bg-gray-100"
                            @click="showMailModal = false"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                            :in-progress="inProgress"
                        >
                            Envoyer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowUpDown, Eye, Paperclip, Pencil, RefreshCw, Star, X } from 'lucide-vue-next';

import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';
import { PERPAGE } from '~/lib/constants';
import type { Contact } from '~/lib/types';
import { useMail } from '@/composables/useMail';
import { debounce, getErrorMessage } from '~/lib/utils';

useHead({ title: 'Gestion des contacts' });
const { sendMail } = useMail();

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { $toast } = useNuxtApp();

const route = useRoute();
const router = useRouter();
const type = computed<string>(() => (route.params.type as string) || 'nurstech');
const typeLabel = computed(() => type.value.charAt(0).toUpperCase() + type.value.slice(1));

const perPage = ref(PERPAGE);
const page = ref(1);
const initialFilter = {
    name: null,
    email: null,
};
const option = ref({ ...initialFilter });
const selectedContact = ref(null);
const showMailModal = ref(false);

const filter = async () => {
    const currentFilter = {
        ...option.value,
    };
    await getContacts(type, page.value, perPage.value, currentFilter);
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(initialFilter);
    if (isSame) {
        return;
    }

    option.value = { ...initialFilter };
    page.value = 1;
    await getContacts(type, page.value, perPage.value, option.value);
};

const debouncedFilter = debounce(filter, 100);

const { contacts, count, getContacts } = useContact();

await getContacts(type, page.value, perPage.value, option.value);
const dataContacts = computed(() => contacts.value ?? []);

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getContacts(type, page.value, value, option.value);
};

const refresh = async (page: number) => {
    await getContacts(type, page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
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

watch(type, async () => {
    page.value = 1;
    await getContacts(type, page.value, perPage.value, option.value);
});

watch(
    () => sort,
    async (newVal) => {
        await getContacts(type, page.value, perPage.value, {
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
            }, () => ['Nom', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'min-h-8 flex items-center capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'email',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('email'),
            }, () => ['Email', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: '' }, row.getValue('email')),
    },
    {
        accessorKey: 'phone_number',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('phone_number'),
            }, () => ['Téléphone', h(ArrowUpDown, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('phone_number')),
    },
    {
        accessorKey: 'description',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('description'),
            }, () => ['Description', h(ArrowUpDown, { class: '' })]);
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
                    h(ArrowUpDown, { class: '' }),
                ]),
            ]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center justify-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    ...(type.value === 'infiswap'
        ? [{
                accessorKey: 'action',
                header: 'Action',
                cell: ({ row }) => {
                    const contact = row.original;

                    return h(
                        'div',
                        { class: 'flex ml-4 items-center gap-2' },
                        [
                            !contact.hasResponded
                            && h(Pencil, {
                                class: 'w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors',
                                title: 'Répondre',
                                onClick: () => handleReply(contact),
                            }),
                            contact.hasResponded
                            && h(Eye, {
                                class: 'w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors',
                                title: 'Voir la réponse',
                                onClick: () => router.push('/dashboard/admin/mails'),
                            }),
                        ].filter(Boolean),
                    );
                },
            }]
        : []),
];

const newMail = ref<{
    object: string;
    recipients: { email: string; name?: string; user_id?: string | null }[];
    content: string;
    file: File | null;
    files?: File[] | null;
}>({
    object: '',
    recipients: [],
    content: '',
    file: null,
    files: null,
});

const handleReply = (contact: Contact) => {
    selectedContact.value = contact;

    newMail.value.recipients = [
        {
            email: contact.email,
            name: contact.name ?? '',
            user_id: null,
        },
    ];

    showMailModal.value = true;
};

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);

function handleFileSelection(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
        selectedFiles.value = [...selectedFiles.value, ...Array.from(target.files)];
        newMail.value.files = selectedFiles.value;
        target.value = '';
    }
}

function removeFile(index: number) {
    selectedFiles.value.splice(index, 1);
    newMail.value.files = selectedFiles.value;
}

const { submit, inProgress } = useSubmit(
    async function sendMailFront() {
        const formData = new FormData();
        formData.append('object', newMail.value.object);
        formData.append('content', newMail.value.content);

        if (Array.isArray(newMail.value.recipients)) {
            newMail.value.recipients.forEach((recipient, index) => {
                formData.append(`recipients[${index}][email]`, recipient.email);
                formData.append(`recipients[${index}][name]`, recipient.name ?? '');
                formData.append(`recipients[${index}][user_id]`, recipient.user_id ?? '');
            });
        }

        selectedFiles.value.forEach((file, index) => {
            formData.append(`attachement[${index}]`, file);
        });

        try {
            await sendMail(formData);

            showMailModal.value = false;

            newMail.value = {
                object: '',
                recipients: [],
                content: '',
                file: null,
            };
            selectedFiles.value = [];

            await getContacts(type, page.value, perPage.value, option.value);

            $toast({
                title: 'Succès !',
                description: 'Votre réponse a bien été envoyé',
            });
        }
        catch (err) {
            $toast({
                description: getErrorMessage(err),
                variant: 'destructive',
            });
        }
    },
);
</script>
