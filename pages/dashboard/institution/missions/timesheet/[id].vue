<template>
    <div>
        <DashboardAdminPageHeader title="Feuille de présence" />

        <div class="mt-8 grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white shadow-lg p-6 rounded-xl">
                <div class="flex justify-between items-center gap-4">
                    <h3 class="flex items-center font-semibold text-primary text-lg gap-2">
                        <span class="w-4 h-4 rounded-full bg-primary mr-2" />
                        Détail de la mission
                    </h3>
                    <PencilIcon
                        class="w-5 h-5 text-gray-400 hover:text-primary hover:cursor-pointer transition-all duration-300"
                        @click="() => router.push(`/dashboard/institution/missions/${mission.id}`)"
                    />
                </div>

                <div class="mt-6 grid 2xl:grid-cols-3 gap-2 2xl:gap-6">
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarIcon class="w-4 h-4 text-gray-400" />
                        <span class="font-medium text-gray-700">Date :</span>
                        <span>
                            {{ formatToDMY(mission.start_date) }}
                            <span class="mx-1 text-gray-300">→</span>
                            {{ formatToDMY(mission.end_date) }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <ClockIcon class="w-4 h-4 text-gray-400" />
                        <span class="font-medium text-gray-700">Horaire :</span>
                        <span>
                            {{ formatTime(mission.time_start_at) }}
                            <span class="mx-1 text-gray-300">→</span>
                            {{ formatTime(mission.time_end_at) }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <AcademicCapIcon class="w-4 h-4 text-gray-400" />
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
            <div class="flex justify-between gap-4">
                <h1 class="text-xl font-semibold text-primary">
                    Feuille de temps
                </h1>
            </div>

            <div class="mt-4">
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
                            <TableHead class="py-4 font-semibold text-gray-600">
                                Heures modifiées
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <TableRow
                            v-for="timesheet in mission.timesheets"
                            :key="timesheet.id"
                            class="grid grid-cols-4 items-center border-b hover:bg-gray-50 transition py-4"
                        >
                            <TableCell class="text-gray-600 text-center font-medium">
                                {{ formatToDMY(timesheet.date) }}
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
                                    class="max-w-20 border border-gray-200 rounded-md py-2 px-2 focus-within:outline-none focus-within:ring-none"
                                    @blur="handleUpdateStatus(timesheet, true)"
                                >
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AcademicCapIcon, CalendarIcon, ClockIcon, PencilIcon } from '@heroicons/vue/24/outline';
import { formatTime, formatToDMY } from '~/composables/useDate';
import { useRuntimeConfig } from '#app';
import type { Mission } from '~/lib/types';

useHead({ title: 'Feuille de présence' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const { $toast } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const mission = ref<Mission>(null);
const id = computed(() => route.params.id);

const { getById } = useMissions();
const { update } = useTimesheets();

await getById(Number(id.value)).then((response) => {
    mission.value = response.data;
});

const validatedTimesheetsRatio = computed(() => {
    if (!mission.value?.timesheets?.length) return '0/0';

    const validatedCount = mission.value.timesheets.filter(ts => ts.status === 'validated').length;
    const total = mission.value.timesheets.length;

    return `${validatedCount}/${total}`;
});

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
            $toast({
                description: response.data.status == 'absent' ? 'Jour marqué comme absent' : 'Jour marqué comme présent',
            });

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
            $toast({
                description: 'Horaire du jour ajusté',
            });

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
</script>
