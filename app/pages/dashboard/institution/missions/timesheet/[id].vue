<template>
    <div>
        <DashboardAdminPageHeader title="Feuille de présence">
            <template #action>
                <Button
                    class="rounded-md flex gap-2 items-center"
                    @click="handleGenerateInvoice"
                >
                    <ClipboardList class="w-4 h-4" />
                    <span>Générer la facture</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <div class="mt-8 grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white shadow-lg p-6 rounded-xl">
                <div class="flex justify-between items-center gap-4">
                    <h3 class="flex items-center font-semibold text-primary text-lg gap-2">
                        <span class="w-4 h-4 rounded-full bg-primary mr-2" />
                        Détail de la mission
                    </h3>
                    <Pencil
                        class="w-5 h-5 text-gray-400 hover:text-primary hover:cursor-pointer transition-all duration-300"
                        @click="() => router.push(`/dashboard/institution/missions/${mission.id}`)"
                    />
                </div>

                <div class="mt-6 grid 2xl:grid-cols-3 gap-2 2xl:gap-6">
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar class="w-4 h-4 text-gray-400" />
                        <span class="font-medium text-gray-700">Date :</span>
                        <span>
                            {{ formatToDMY(mission.start_date) }}
                            <span class="mx-1 text-gray-300">→</span>
                            {{ formatToDMY(mission.end_date) }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <Clock class="w-4 h-4 text-gray-400" />
                        <span class="font-medium text-gray-700">Horaire :</span>
                        <span>
                            {{ formatTime(mission.time_start_at) }}
                            <span class="mx-1 text-gray-300">→</span>
                            {{ formatTime(mission.time_end_at) }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <GraduationCap class="w-4 h-4 text-gray-400" />
                        <span class="font-medium text-gray-700">Diplôme :</span>
                        <span>{{ mission.required_diploma }}</span>
                    </div>
                </div>

                <div class="mt-8 flex flex-col xl:flex-row items-start gap-4">
                    <div class="flex items-center gap-4">
                        <img
                            v-if="mission.accepted_candidate.profil_url"
                            :src="useRuntimeConfig().public.API_URL + '/storage/' + mission.accepted_candidate.profil_url"
                            class="w-14 h-14 rounded-full object-cover shadow-sm"
                        >
                        <LayoutsAppImage
                            v-else
                            src="icons/user-circle.png"
                            class="w-14 h-14 rounded-full opacity-40 shadow-sm"
                        />
                        <UsersName
                            :user="mission.accepted_candidate"
                            class="block xl:hidden font-medium text-gray-800 hover:text-primary transition-all duration-300"
                        />
                    </div>
                    <div class="xl:flex-1">
                        <UsersName
                            :user="mission.accepted_candidate"
                            class="hidden xl:block font-medium text-gray-800 hover:text-primary transition-all duration-300"
                        />
                        <div class="mt-4 gap-4 grid xl:grid-cols-3 xl:gap-6">
                            <div class="space-y-1">
                                <h6 class="text-xs font-medium text-gray-500">
                                    Email
                                </h6>
                                <p class="text-sm text-gray-800">
                                    {{ mission.accepted_candidate.email }}
                                </p>
                            </div>
                            <div class="space-y-1">
                                <h6 class="text-xs font-medium text-gray-500">
                                    Téléphone
                                </h6>
                                <p class="text-sm text-gray-800">
                                    {{ mission.accepted_candidate.phone_number }}
                                </p>
                            </div>
                            <div class="space-y-1">
                                <h6 class="text-xs font-medium text-gray-500">
                                    Adresse
                                </h6>
                                <p class="text-sm text-gray-800">
                                    {{ mission.accepted_candidate.street_address }}, {{ mission.accepted_candidate.city }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-1 grid grid-cols-2 gap-4">
                <div class="bg-white shadow-lg p-6 rounded-xl space-y-2">
                    <h4 class="text-gray-500 text-sm">
                        Durée de mission
                    </h4>
                    <p class="text-xl font-bold text-primary">
                        {{ mission.duration }} jours
                    </p>
                </div>
                <div class="bg-white shadow-lg p-6 rounded-xl space-y-2">
                    <h4 class="text-gray-500 text-sm">
                        Horaire régulier
                    </h4>
                    <p class="text-xl font-bold text-primary">
                        {{ mission.timesheets[0].planned_hours }} heures
                    </p>
                </div>
                <div class="bg-white shadow-lg p-6 rounded-xl space-y-2">
                    <h4 class="text-gray-500 text-sm">
                        Temps validé
                    </h4>
                    <p class="text-xl font-bold text-primary">
                        {{ validatedTimesheetsRatio }} jours
                    </p>
                </div>
                <div class="bg-white shadow-lg p-6 rounded-xl space-y-2">
                    <h4 class="text-gray-500 text-sm">
                        Total heures modifiées
                    </h4>
                    <p class="text-xl font-bold text-primary">
                        {{ totalModifiedHours }} heures
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-12">
            <div class="flex flex-col sm:flex-row sm:justify-between gap-4">
                <h1 class="text-xl font-semibold text-primary">
                    Feuille de temps
                </h1>
                <div class="flex gap-6 items-center">
                    <span class="hidden text-gray-600 text-sm min-[450px]:inline text-nowrap">
                        Rechercher par date :
                    </span>
                    <input
                        v-model="search"
                        type="date"
                        class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm
           text-gray-700 shadow-sm
           focus:border-primary outline-none focus:ring-2 focus:ring-primary/40
           transition-colors"
                        @input="debouncedFilterTimesheets"
                    >
                    <Button
                        class="rounded-md h-11"
                        @click="resetFilter"
                    >
                        <RefreshCw class="md:mr-2" />
                        <span class="hidden md:inline-block">Restaurer</span>
                    </Button>
                </div>
            </div>

            <div class="mt-6">
                <Table class="w-full border rounded-xl overflow-hidden shadow-sm">
                    <TableHeader>
                        <TableRow class="grid grid-cols-4 bg-gray-50 border-b">
                            <TableHead class="py-4 font-semibold text-gray-600" />
                            <TableHead class="py-4 font-semibold text-gray-600">
                                Présent
                            </TableHead>
                            <TableHead class="py-4 font-semibold text-gray-600">
                                Absent
                            </TableHead>
                            <TableHead class="py-4 font-semibold max-w-64 truncate text-gray-600">
                                Heures modifiées
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <TableRow
                            v-for="timesheet in dataTimesheets"
                            :key="timesheet.id"
                            class="grid grid-cols-4 items-center border-b hover:bg-gray-50 transition py-4"
                        >
                            <TableCell class="text-gray-600 text-center font-medium">
                                {{ formatToDMY(timesheet.work_date) }}
                            </TableCell>
                            <TableCell class="text-center ml-4">
                                <label class="flex items-center justify-start cursor-pointer">
                                    <input
                                        v-model="timesheet.status"
                                        type="radio"
                                        :name="`timesheet-${timesheet.id}`"
                                        value="validated"
                                        class="sr-only peer"
                                        @change="handleUpdateStatus(timesheet)"
                                    >
                                    <span
                                        class="w-5 h-5 rounded-full border-2 border-gray-300
                   flex items-center justify-center
                   transition-all duration-200
                   peer-checked:border-primary
                   peer-checked:bg-primary
                   hover:border-primary"
                                    >
                                        <span
                                            class="w-2.5 h-2.5 rounded-full bg-white
                       scale-0 peer-checked:scale-100
                       transition-transform duration-200"
                                        />
                                    </span>
                                </label>
                            </TableCell>
                            <TableCell class="text-center ml-4">
                                <label class="flex items-center justify-start cursor-pointer">
                                    <input
                                        v-model="timesheet.status"
                                        type="radio"
                                        class="sr-only peer"
                                        :name="`timesheet-${timesheet.id}`"
                                        value="absent"
                                        @change="handleUpdateStatus(timesheet)"
                                    >
                                    <span
                                        class="w-5 h-5 rounded-full border-2 border-gray-300
                   flex items-center justify-center
                   transition-all duration-200
                   peer-checked:border-primary
                   peer-checked:bg-primary
                   hover:border-primary"
                                    >
                                        <span
                                            class="w-2.5 h-2.5 rounded-full bg-white
                       scale-0 peer-checked:scale-100
                       transition-transform duration-200"
                                        />
                                    </span>
                                </label>
                            </TableCell>
                            <TableCell class="text-center flex gap-3 items-center">
                                <label class="flex items-center justify-start cursor-pointer">
                                    <input
                                        v-model="timesheet.status"
                                        type="radio"
                                        class="sr-only peer"
                                        :name="`timesheet-${timesheet.id}`"
                                        value="adjusted"
                                    >
                                    <span
                                        class="w-5 h-5 rounded-full border-2 border-gray-300
                   flex items-center justify-center
                   transition-all duration-200
                   peer-checked:border-primary
                   peer-checked:bg-primary
                   hover:border-primary"
                                    >
                                        <span
                                            class="w-2.5 h-2.5 rounded-full bg-white
                       scale-0 peer-checked:scale-100
                       transition-transform duration-200"
                                        />
                                    </span>
                                </label>
                                <input
                                    v-model="timesheet.worked_hours"
                                    class="max-w-8 min-[450px]:max-w-20 border border-gray-200 rounded-md py-2 px-2 focus-within:outline-none focus-within:ring-none"
                                    @blur="handleUpdateStatus(timesheet, true)"
                                >
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div class="mt-6">
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :internal-per-page="5"
                    :total="timesheets.meta.total"
                    @update:page="refreshTimesheets"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </div>

        <Dialog v-model:open="generateDialog">
            <DialogContent class="max-w-xl">
                <DialogDescription
                    class="flex flex-col items-center justify-center text-center gap-4 my-10"
                >
                    <svg
                        class="animate-spin h-8 w-8 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>

                    <span class="text-base font-medium animate-pulse">
                        Génération en cours...
                    </span>
                </DialogDescription>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="validateDialog">
            <DialogContent class="max-w-xl">
                <DialogTitle>
                    Générer la facture
                </DialogTitle>
                <DialogDescription>
                    Vous avez encore <span class="font-semibold">{{ pendingWorkCount > 1 ? `${pendingWorkCount} jours`: `${pendingWorkCount} jour` }}</span> de travail à valider. {{ pendingWorkCount > 1 ? '' : 'Êtes-vous sûr de vouloir poursuivre cette action ?' }}
                </DialogDescription>
                <DialogFooter
                    v-if="pendingWorkCount < 1"
                    class="mt-6 mb-4 flex gap-4 items-center"
                >
                    <Button
                        class="rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-800"
                        @click="handleCancelGenerate"
                    >
                        Non
                    </Button>
                    <Button
                        class="rounded-md"
                        @click="handleGenerateInvoice"
                    >
                        Oui
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { Calendar, ClipboardList, Clock, GraduationCap, Pencil, RefreshCw, Star } from 'lucide-vue-next';

import { toast } from 'vue-sonner';
import { formatTime, formatToDMY } from '~/composables/useDate';
import { useRuntimeConfig } from '#app';
import type { Mission } from '~/lib/types';
import { debounce } from '~/lib/utils';

useHead({ title: 'Feuille de présence' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const validateDialog = ref(false);
const generateDialog = ref(false);
const search = ref('');
const pendingWorkCount = ref(0);
const route = useRoute();
const router = useRouter();
const mission = ref<Mission>(null);
const id = computed(() => route.params.id);
const perPage = ref(5);
const page = ref(1);

const { getById } = useMissions();
const { timesheets, getAll, update } = useTimesheets();
const { create } = useMissionInvoices();

await getById(Number(id.value)).then((response) => {
    mission.value = response.data;
});

await getAll(mission.value.id, page.value, perPage.value, { date: search.value });
const dataTimesheets = computed(() => timesheets.value.data ?? []);

const validatedTimesheetsRatio = computed(() => {
    if (!mission.value?.timesheets?.length) return '0/0';

    const validatedCount = mission.value.timesheets.filter(ts => ts.status === 'validated').length;
    const total = mission.value.timesheets.length;

    return `${validatedCount}/${total}`;
});

const refreshTimesheets = async (pge: number) => {
    page.value = pge;
    await getAll(mission.value.id, page.value, perPage.value, { date: search.value });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getAll(mission.value.id, page.value, perPage.value, { date: search.value });
};

const filterTimesheets = async () => {
    await getAll(mission.value.id, page.value, perPage.value, { date: search.value });
};

const debouncedFilterTimesheets = debounce(filterTimesheets, 100);

const resetFilter = async () => {
    search.value = '';

    page.value = 1;
    await filterTimesheets();
};

const totalModifiedHours = computed(() => {
    if (!mission.value?.timesheets?.length) return 0;

    return mission.value.timesheets.reduce((total, ts) => {
        if (
            ts.planned_hours == null
            || ts.worked_hours == null
        ) {
            return total;
        }

        return total + Math.abs(ts.planned_hours - ts.worked_hours);
    }, 0);
});

const handleUpdateStatus = async (timesheet, force = false) => {
    if (timesheet.status !== 'adjusted') {
        const response = await update(timesheet.id, {
            status: timesheet.status,
        });

        if (response.data) {
            toast(response.data.status == 'absent' ? 'Jour marqué comme absent' : 'Jour marqué comme présent');

            const updatedTimesheet = response.data;

            mission.value = {
                ...mission.value,
                // eslint-disable-next-line @stylistic/arrow-parens
                timesheets: mission.value.timesheets.map((ts) =>
                    ts.id === updatedTimesheet.id
                        ? { ...ts, ...updatedTimesheet }
                        : ts,
                ),
            };
        }

        return;
    }

    if (
        timesheet.status === 'adjusted'
        && timesheet.worked_hours
        && force
    ) {
        const response = await update(timesheet.id, {
            status: 'adjusted',
            worked_hours: timesheet.worked_hours,
        });

        if (response.data) {
            toast.success('Horaire du jour ajusté');

            const updatedTimesheet = response.data;

            mission.value = {
                ...mission.value,
                // eslint-disable-next-line @stylistic/arrow-parens
                timesheets: mission.value.timesheets.map((ts) =>
                    ts.id === updatedTimesheet.id
                        ? { ...ts, ...updatedTimesheet }
                        : ts,
                ),
            };
        }

        return;
    }
};

const handleGenerateInvoice = async () => {
    if (!mission.value.timesheets) return;

    pendingWorkCount.value = mission.value.timesheets.filter(
        ts => ts.status === 'pending',
    ).length;

    if (pendingWorkCount.value === 0) {
        generateDialog.value = true;

        try {
            const response = await create({ mission_id: mission.value.id });

            if (response.mission_invoice) {
                toast(response.message);
            };
        }
        catch (err) {
            if (err.data?.errors) {
                const firstError = Object.values(err.data.errors)[0][0];
                toast.error(firstError);
            }
        }
        finally {
            generateDialog.value = false;
        }
    }
    else {
        validateDialog.value = true;
    }
};

const handleCancelGenerate = () => {
    validateDialog.value = false;
    pendingWorkCount.value = 0;
};
</script>
