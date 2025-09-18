<template>
    <div>
        <DashboardAdminPageHeader
            title="Contrats / NURSTECH"
            :count="count"
        >
            <template #action>
                <Button
                    class="rounded"
                    @click="searchUserDialog = true"
                >
                    <MagnifyingGlassIcon />
                    <span class="hidden md:inline-block">
                        Rechercher un utilisateur
                    </span>
                </Button>

                <Dialog v-model:open="searchUserDialog">
                    <DialogContent class="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>
                                Rechercher un utilisateur
                            </DialogTitle>
                        </DialogHeader>

                        <div class="mt-4 mb-6">
                            <InputIcon
                                v-model="optionUser.name"
                                :icon="UserCircleIcon"
                                rounded="md"
                                placeholder="Entrer nom ou prénom"
                                class="max-w-full"
                                @input="debouncedFilterUsers"
                            />

                            <template v-if="dataUsers.length != 0">
                                <ul class="mt-4 divide-y divide-gray-100">
                                    <li
                                        v-for="user in dataUsers"
                                        :key="user.id"
                                        class="flex justify-between items-center py-4 px-2 rounded hover:bg-gray-50 transition"
                                    >
                                        <div>
                                            <UsersCrm
                                                :user="user"
                                                class="font-semibold text-gray-800"
                                            />
                                            <p>
                                                {{ user.email }}
                                            </p>
                                        </div>

                                        <div>
                                            <PlusCircleIcon
                                                class="w-8 text-primary cursor-pointer"
                                                @click="handleCreateContract(user)"
                                            />
                                        </div>
                                    </li>
                                </ul>
                            </template>
                            <template v-else>
                                <p class="mt-8 text-gray-500 text-center">
                                    Aucune résultat trouvé
                                </p>
                            </template>

                            <div class="mt-8 flex justify-end">
                                <Button
                                    variant="ghost"
                                    class="text-primary font-semibold"
                                    @click="router.push('/dashboard/admin/users/create')"
                                >
                                    <PlusIcon />
                                    <span>
                                        Créer un nouveau utilisateur
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div class="flex gap-6 items-center p-4">
                <Select
                    v-model="optionContract.status"
                    class="w-64"
                    @update:model-value="debouncedFilterContracts"
                >
                    <SelectTrigger class="rounded-md gap-2">
                        <SelectValue
                            placeholder="Filtrer par statut"
                            class="text-nowrap w-full truncate"
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="'sent_for_signature'">
                                <span>Envoyé pour signature</span>
                            </SelectItem>
                            <SelectItem :value="'sign'">
                                <span>Signé</span>
                            </SelectItem>
                            <SelectItem :value="'paid'">
                                <span>Payé</span>
                            </SelectItem>
                            <SelectItem :value="'accomplished'">
                                <span>Réalisé</span>
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

            <div class="mt-4">
                <DataTable
                    :data="dataContracts"
                    :columns="columnsContracts"
                />
            </div>

            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="count"
                    @update:page="refreshContracts"
                    @update:per-page="handlePerPageChange"
                />
            </div>

            <Dialog v-model:open="showSignPDFModal">
                <DialogContent class="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Signer le bon de commande</DialogTitle>
                    </DialogHeader>
                    <div class="mt-2">
                        Le fichier de bon de commande pour l'utilisateur sélectionné est prêt. Voulez-vous le signer ?
                    </div>
                    <DialogFooter class="mt-6">
                        <Button
                            variant="secondary"
                            @click="showSignPDFModal = false"
                        >
                            Plus tard
                        </Button>
                        <Button @click="handleConfirmSign">
                            Oui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon, ArrowPathIcon, ArrowsUpDownIcon, UserCircleIcon, PlusCircleIcon } from '@heroicons/vue/24/solid';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import { useContract } from '@/composables/useContract';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import { debounce } from '~/lib/utils';

const { isSuperAdmin, users, getUsers } = useAuth();

const router = useRouter();
const searchUserDialog = ref(false);

const initialFilterUser = {
    name: null,
};
const initialFilterContract = {
    status: null,
};
const optionUser = ref({ ...initialFilterUser });
const optionContract = ref({ ...initialFilterContract });

const perPage = ref(5);
const page = ref(1);

const showSignPDFModal = ref(false);
const selectedContractId = ref<number | null>(null);

const { contracts, count, getContracts, signContract } = useContract();

const dataUsers = computed(() => users.value?.data ?? []);

const filterUsers = async () => {
    if (optionUser.value.name != '') {
        const currentFilter = { ...optionUser.value };
        await getUsers(page.value, perPage.value, currentFilter);
    }
};

const filterContracts = async () => {
    const currentFilter = { ...optionContract.value };
    await getContracts(page.value, perPage.value, currentFilter);
};

const debouncedFilterUsers = debounce(filterUsers, 100);
const debouncedFilterContracts = debounce(filterContracts, 100);

const handleCreateContract = (user) => {
    localStorage.setItem('user_contract', JSON.stringify(user));
    router.push('/dashboard/admin/contracts/nurstech/create');
};

await getContracts(page.value, perPage.value, optionContract.value);

const dataContracts = computed(() => contracts.value ?? []);

const refreshContracts = async (page: number) => {
    await getContracts(page, perPage.value, { sortOrder: sort.order, sortKey: sort.by });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getContracts(page.value, value, optionContract.value);
};

const columnsContracts = [
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
        accessorKey: 'name',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('name'),
            }, () => ['Nom', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize ml-4' }, row.getValue('name')),
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
        accessorKey: 'phone_number',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('phone_number'),
            }, () => ['Téléphone', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize ml-4' }, row.getValue('phone_number')),
    },
    {
        accessorKey: 'formula',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('formula'),
            }, () => ['Formule', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'ml-4' }, row.getValue('formula')),
    },
    {
        accessorKey: 'payment_mode',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('payment_mode'),
            }, () => ['Mode de paiement', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'capitalize text-center' }, row.getValue('payment_mode')),
    },
    {
        accessorKey: 'pdf_path',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('pdf_path'),
            }, () => ['Fichier PDF', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'ml-4' }, row.getValue('pdf_path')),
    },
    {
        accessorKey: 'status',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('status'),
            }, () => ['Statut', h(ArrowsUpDownIcon, { class: '' })]);
        },
        cell: ({ row }) => h('div', { class: 'ml-4' }, row.getValue('status')),
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
                    h(ArrowsUpDownIcon, { class: '' }),
                ]),
            ]);
        },
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center justify-center' }, formatRelativeDate(row.getValue('created_at')));
        },
    },
    {
        id: 'actions',
        header: () => {
            return h('div', { class: 'mx-2' }, 'Actions');
        },
        enableHiding: false,
        cell: ({ row }) => {
            const contract = row.original;
            const actions = [
                {
                    label: 'Modifier',
                },
                {
                    label: 'Signer le bon',
                    onClick: () => handleOpenSignModal(contract.id),
                },
                {
                    label: 'Visualiser le PDF',
                    onClick: () => {
                        window.open(`/api/contracts/${contract.id}/view-pdf`, '_blank');
                    },
                },
                ...(isSuperAdmin.value
                    ? [
                            {
                                label: 'Supprimer',
                                confirm: true,
                            },
                        ]
                    : []),
            ];

            return h('div', { class: 'flex justify-start ml-4' }, [
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
        await getContracts(page.value, perPage.value, {
            sortOrder: newVal.order,
            sortKey: newVal.by });
    },
    { deep: true },
);

const resetFilter = async () => {
    const isSame = JSON.stringify(optionContract.value) === JSON.stringify(initialFilterContract);
    if (isSame) {
        return;
    }

    optionContract.value = { ...initialFilterContract };
    page.value = 1;
    await getContracts(page.value, perPage.value, optionContract.value);
};

const handleOpenSignModal = (contractId: number) => {
    selectedContractId.value = contractId;
    showSignPDFModal.value = true;
};

const handleConfirmSign = async () => {
    if (selectedContractId.value) {
        await signContract(selectedContractId.value);
    }
    showSignPDFModal.value = false;
};

useHead({ title: 'Contrats / NursTech' });
definePageMeta({ layout: 'dashboard', middleware: ['auth', 'verified'] });
</script>
