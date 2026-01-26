<template>
    <div class="w-full">
        <DashboardAdminPageHeader
            title="Missions"
            :count="missions.meta.total"
        >
            <template #action>
                <Button class="rounded-md">
                    <NuxtLink
                        to="/dashboard/institution/missions/create"
                        class="flex gap-3 items-center"
                    >
                        <PlusIcon class="w-6 h-6" />
                        <span>Nouveau</span>
                    </NuxtLink>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-end overflow-x-auto pb-3 px-4 scrollbar-hide mb-4">
                <div class="space-y-1">
                    <label class="font-medium text-gray-500">Filtrer par service</label>
                    <InputIcon
                        v-model="option.service"
                        rounded="md"
                        class="w-[250px]"
                        placeholder="Service"
                        @input="debouncedFilterMissions"
                    />
                </div>
                <div class="space-y-1">
                    <label class="font-medium text-gray-500">Filtrer par date</label>
                    <InputIcon
                        v-model="option.date"
                        rounded="md"
                        class="w-[250px]"
                        type="date"
                        @input="debouncedFilterMissions"
                    />
                </div>
                <Button
                    class="rounded-md h-11"
                    @click="resetFilter"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

            <DataTable
                :data="dataMissions"
                :columns="columns"
            />

            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="missions.meta.total"
                    @update:page="refreshMissions"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>

        <Dialog v-model:open="statusDialog">
            <DialogContent class="max-w-xl p-6">
                <DialogTitle class="text-lg font-semibold text-gray-900">
                    Changer le statut
                </DialogTitle>

                <DialogDescription class="mt-4 text-sm text-gray-600">
                    En changeant le statut de la mission, vous mettez à jour son état d’avancement
                </DialogDescription>

                <div class="grid grid-cols-2 gap-6">
                    <label
                        v-for="status in statuses"
                        :key="status.key"
                        class="cursor-pointer rounded-lg border p-5 transition
               hover:border-primary"
                        :class="selectedStatus === status.key
                            ? 'border-2 border-primary bg-primary/5'
                            : 'border-gray-200 bg-gray-50'"
                    >
                        <input
                            v-model="selectedStatus"
                            type="radio"
                            :value="status.key"
                            class="sr-only"
                        >

                        <div class="space-y-1">
                            <h3 class="font-semibold text-primary">
                                {{ status.label }}
                            </h3>
                            <p class="text-xs text-gray-500">
                                {{ statusDescription[status.key] }}
                            </p>
                        </div>
                    </label>
                </div>

                <DialogFooter class="mt-6 flex gap-4 items-center">
                    <Button
                        class="bg-gray-200 text-gray-800 hover:bg-gray-300"
                        @click="handleCloseStatusDialog"
                    >
                        Annuler
                    </Button>
                    <Button @click="handleChangeStatus">
                        Enregistrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import type { ColumnDef } from '@tanstack/vue-table';
import { PlusIcon, ArrowPathIcon, ChevronUpDownIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import UsersName from '@/components/users/Name.vue';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import DropdownMenuAction from '~/components/dashboard/AdminDropdownMenuAction.vue';
import { PERPAGE } from '~/lib/constants';
import type { Mission, User } from '~/lib/types';
import { debounce } from '~/lib/utils';
import { formatTime } from '~/composables/useDate';

const { $toast } = useNuxtApp();
const { getAll, missions, update, remove } = useMissions();

useHead({ title: 'Mission' });

definePageMeta({
    layout: 'dashboard',
    middleware: 'institution',
});

const statusLabel = {
    open: 'Planifiée',
    assigned: 'Assignée',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
};

const statuses = [
    { key: 'open', label: 'Planifiée' },
    { key: 'in_progress', label: 'En cours' },
    { key: 'completed', label: 'Terminée' },
    { key: 'cancelled', label: 'Annulée' },
];

const statusDescription: Record<string, string> = {
    open: 'Mission planifiée, en attente de démarrage.',
    in_progress: 'Mission actuellement en cours.',
    completed: 'Mission terminée avec succès.',
    cancelled: 'Mission annulée par l’institution.',
};

const router = useRouter();
const perPage = ref(PERPAGE);
const user = useState<User>('user');
const selectedMission = ref<Mission>(null);
const selectedStatus = ref(null);
const statusDialog = ref(false);
const page = ref(1);

const initialFilter = {
    service: '',
    date: '',
    type: 'institution',
};

const option = ref({ ...initialFilter });

await getAll(page.value, perPage.value, option.value);
const dataMissions = computed(() => missions.value.data ?? []);

const filterMissions = async () => {
    const currentFilter = { ...option.value };

    await getAll(
        page.value,
        perPage.value,
        {
            service: currentFilter.service,
            date: currentFilter.date,
            type: 'institution',
        });
};

const debouncedFilterMissions = debounce(filterMissions, 100);

const refreshMissions = async (pge: number) => {
    page.value = pge;
    await filterMissions();
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await filterMissions();
};

const resetFilter = async () => {
    option.value.date = '';
    option.value.service = '';

    page.value = 1;
    await filterMissions();
};

const columns: ColumnDef<Mission>[] = [
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
        id: 'service',
        accessorFn: row => row.service,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Service', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const serviceName = row.original.service.name || '-';
            return h('div', { class: 'ml-4 w-40 truncate' }, serviceName);
        },
    },
    {
        id: 'start_date',
        accessorFn: row => row.start_date,
        header: () =>
            h(Button, {
                variant: 'ghost',
                onClick: () => setSort('start_date'),
            }, () => ['Date de début', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const startDate = row.original.start_date;
            return h('div', { class: 'ml-4' }, formatToDMY(startDate));
        },
    },
    {
        id: 'end_date',
        accessorFn: row => row.end_date,
        header: () =>
            h(Button, {
                variant: 'ghost',
                onClick: () => setSort('end_date'),
            }, () => ['Date de fin', h(ChevronUpDownIcon, { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const endDate = row.original.end_date;
            return h('div', { class: 'ml-4' }, formatToDMY(endDate));
        },
    },
    {
        id: 'description',
        accessorFn: row => row.description,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Description', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const description = row.original.description;
            return h('div', { class: 'ml-4 w-40 truncate' }, description);
        },
    },
    {
        id: 'time_start_at',
        accessorFn: row => row.time_start_at,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Horaire', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const timeStartAt = row.original.time_start_at;
            const timeEndAt = row.original.time_end_at;
            return h('div', { class: 'ml-4' }, `${formatTime(timeStartAt)} à ${formatTime(timeEndAt)}`);
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
        id: 'required_diploma',
        accessorFn: row => row.required_diploma,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Diplôme', h('', { class: 'ml-2 h-4 w-4' })]),
        cell: ({ row }) => {
            const diploma = row.original.required_diploma;
            return h('div', { class: 'ml-4' }, diploma);
        },
    },
    {
        id: 'accepted_candidate',
        accessorFn: row => row.accepted_candidate,
        header: () =>
            h(Button, {
                variant: 'ghost',
            }, () => ['Candidat retenu', h('', { class: 'ml-2 h-4 w-4' })]),

        cell: ({ row }) => {
            const user = row.original.accepted_candidate;
            if (!user) {
                return h(
                    'div',
                    { class: 'ml-4' },
                    '-',
                );
            }

            return h(UsersName, { class: 'ml-4', user });
        },
    },
    {
        id: 'matching_candidates',
        header: () => h(Button, { variant: 'ghost' }, () => 'Candidats'),
        cell: ({ row }) => {
            const users = row.original.matching_candidates || [];
            const displayText = users.map(u => u.full_name).join(', ');
            const missionId = row.original.id;

            return h('div', { class: 'flex items-center text-center' }, [
                h('div', {
                    class: 'ml-2 capitalize truncate max-w-[180px] whitespace-nowrap overflow-hidden',
                    title: displayText,
                }, displayText || '-'),
                users.length > 0
                && h(Button, {
                    variant: 'ghost',
                    size: 'sm',
                    onClick: () => navigateTo(`/dashboard/institution/missions/candidacy/${missionId}`),
                }, () => h(EyeIcon, { class: 'h-4 w-4 ml-1' })),
            ]);
        },
    },
    {
        accessorKey: 'created_at',
        header: () => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => setSort('created_at'),
            }, () => ['Création', h(ChevronUpDownIcon, { class: '' })]);
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
            const mission = row.original;
            const actions = [
                {
                    label: 'Modifier',
                    onClick: () => handleEdit(mission),
                },
                {
                    label: 'Changer le statut',
                    onClick: () => handleOpenStatusDialog(mission),
                },
                {
                    label: 'Voir les candidatures',
                    onClick: () => handleShowCandidacy(mission),
                },
                ...(mission.has_timesheet && mission.accepted_candidate != null
                    ? [{
                            label: 'Gérer la présence',
                            onClick: () => handleShowTimesheet(mission),
                        }]
                    : []),
                {
                    label: 'Supprimer',
                    confirm: true,
                    onClick: () => handleDelete(mission),
                },
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

const handleEdit = (mission: Mission) => {
    router.push(`/dashboard/institution/missions/${mission.id}`);
};

const handleShowCandidacy = (mission: Mission) => {
    router.push(`/dashboard/institution/missions/candidacy/${mission.id}`);
};

const handleShowTimesheet = (mission: Mission) => {
    router.push(`/dashboard/institution/missions/timesheet/${mission.id}`);
};

const handleDelete = async (mission: Mission) => {
    return await remove(mission.id).then(async () => {
        missions.value.data = missions.value.data.filter(
            m => m.id !== mission.id,
        );

        $toast({
            description: 'Mission supprimée avec succès.',
        });
    });
};

const handleOpenStatusDialog = (mission: Mission) => {
    selectedMission.value = mission;
    selectedStatus.value = mission.status;
    statusDialog.value = true;
};

const handleCloseStatusDialog = () => {
    statusDialog.value = false;
    selectedMission.value = null;
    selectedStatus.value = null;
};

const handleChangeStatus = async () => {
    const formData = {
        institution_id: user.value.id,
        start_date: selectedMission.value.start_date,
        time_start_at: selectedMission.value.time_start_at,
        time_end_at: selectedMission.value.time_end_at,
        required_diploma: selectedMission.value.required_diploma,
        status: selectedStatus.value,
    };

    try {
        const response = await update(selectedMission.value.id, formData);

        if (response.data) {
            $toast({
                description: 'Mission mis à jour avec succès',
            });

            const updatedMission = response.data;

            missions.value = {
                ...missions.value,
                data: missions.value.data.map(mission =>
                    mission.id === updatedMission.id
                        ? { ...mission, ...updatedMission }
                        : mission,
                ),
            };

            handleCloseStatusDialog();
        }
    }
    catch (err) {
        if (err.data?.errors) {
            const firstError = Object.values(err.data.errors)[0][0];
            $toast({
                description: firstError,
                status: 'error',
                variant: 'destructive',
            });
        }
    }
};
</script>
