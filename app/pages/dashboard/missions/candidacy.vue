<template>
    <div class="lg:ml-20 xl:ml-0">
        <ArrowLeft
            class="size-6 cursor-pointer hover:text-primary"
            title="Retour"
            @click="goBack"
        />

        <div class="mt-6 flex items-center justify-between w-full">
            <h1 class="flex w-full py-3 rounded-lg text-primary sm:bg-gray-100 sm:px-9">
                <span class="ml-1 font-semibold">Candidatures</span>
            </h1>
        </div>

        <form
            class="grid items-center w-full grid-cols-1 gap-6 mt-8 md:grid-cols-6"
            @submit.prevent="searchMission"
        >
            <div
                class="flex items-center justify-between w-full col-span-2 space-x-3 rounded-full bg-primary ps-3 pe-1"
            >
                <h5 class="text-xs text-white">
                    <span>Institution</span>
                </h5>
                <InputIcon
                    v-model="option.institutionName"
                    class="my-1"
                    :input-class="true"
                    placeholder="INAMI"
                />
            </div>
            <div
                class="flex items-center justify-between w-full col-span-2 space-x-3 rounded-full bg-primary ps-3 pe-1"
            >
                <h5 class="text-xs text-white">
                    <span>Date</span>
                </h5>
                <InputIcon
                    v-model="option.responseDate"
                    class="my-1"
                    :input-class="true"
                    type="date"
                />
            </div>

            <div class="flex items-center justify-between w-full col-span-2 gap-6 md:justify-start">
                <Button
                    class="flex items-center justify-center px-4 text-sm bg-primary h-11"
                    @click="reinitializeFilter"
                >
                    <RefreshCw class="w-6" />
                    <span class="block ml-2 text-sm md:hidden">Réinitialiser</span>
                </Button>
                <Button
                    type="submit"
                    class="flex items-center justify-center px-4 text-sm bg-primary h-11"
                >
                    <Search class="w-6" />
                    <span class="ml-2 text-sm">Rechercher</span>
                </Button>
            </div>
        </form>

        <div
            v-if="isSearching"
            class="flex items-center gap-2 justify-center mt-10"
        >
            <RefreshCw class="w-6 h-6 animate-spin text-primary" />
            <span>Recherche en cours...</span>
        </div>
        <div
            v-else-if="responses.data.length !== 0"
            class="mt-12"
        >
            <div
                v-for="(missionResponses, date) in dataResponses"
                :key="date"
                class="grid grid-cols-6 gap-y-8"
            >
                <div class="col-span-1 flex gap-8">
                    <h3 class="text-sm text-gray-600 font-semibold">
                        {{ formatToDMY(date) }}
                    </h3>
                    <div class="relative border-r border-gray-300">
                        <div class="border-r border-gray-300 gap-8" />
                        <div class="absolute top-0 -right-3 w-6 h-6 rounded-full bg-primary/60" />
                    </div>
                </div>

                <div class="col-span-5 grid grid-cols-2 gap-4">
                    <div
                        v-for="response in missionResponses"
                        :key="response.id"
                        class="group relative rounded-lg border border-gray-100 bg-white p-6 shadow transition hover:shadow-lg hover:border-gray-200"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-4">
                                <div class="shrink-0">
                                    <img
                                        v-if="response.mission.institution?.profil_url"
                                        :src="response.mission.institution?.profil_url"
                                        alt="Institution Logo"
                                        class="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200"
                                    >
                                    <div
                                        v-else
                                        class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600"
                                    >
                                        {{ response.mission.institution_name.charAt(0).toUpperCase() }}
                                    </div>
                                </div>

                                <div>
                                    <h2 class="text-sm font-semibold text-gray-900">
                                        {{ response.mission.institution_name }}
                                    </h2>
                                    <p class="text-xs text-gray-500">
                                        Publié {{ formatRelativeDate(response.mission.created_at) }}
                                    </p>
                                </div>
                            </div>

                            <Badge :class="['text-xs min-w-24', statusClasses[response.status] ?? 'bg-gray-200 text-gray-700']">
                                {{ statusResponse[response?.status] }}
                            </Badge>
                        </div>

                        <div class="mt-5">
                            <p
                                class="text-sm leading-relaxed text-gray-700"
                                :class="!expandedMissions[response.mission.id] ? 'line-clamp-3': ''"
                            >
                                {{ response.mission.description }}
                            </p>
                            <button
                                class="mt-2 text-sm text-primary font-semibold hover:underline focus:outline-none"
                                @click="toggleExpand(response.mission.id)"
                            >
                                {{ expandedMissions[response.mission.id] ? 'Voir moins' : 'Voir plus' }}
                            </button>
                        </div>

                        <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
                            <Calendar class="h-4 w-4 text-gray-400" />
                            <span>
                                {{ formatToDMY(response.mission.start_date) }}
                                <span class="mx-1 text-gray-300">→</span>
                                {{ formatToDMY(response.mission.end_date) }}
                            </span>
                        </div>
                        <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <GraduationCap class="h-4 w-4 text-gray-400" />
                            <span>
                                {{ response.mission.required_diploma }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="mt-10 text-center text-gray-500">
                Aucune offre de mission trouvée.
            </p>
        </div>

        <div class="mt-4">
            <CustomPagination
                v-if="responses.data.length > 0"
                :default-page="page"
                :per-page="perPage"
                :total="responses.meta.total"
                @update:page="changePage"
                @update:per-page="handlePerPageChange"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, Calendar, GraduationCap, RefreshCw, Search } from 'lucide-vue-next';
import { formatRelativeDate, formatToDMY } from '~/composables/useDate';
import { PERPAGE } from '~/lib/constants';
import { debounce, goBack } from '~/lib/utils';

useHead({
    title: 'Candidatures',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

const statusResponse = {
    pending: 'En attente',
    accepted: 'Accepté',
    rejected: 'Rejeté',
};

const statusClasses: Record<string, string> = {
    pending: 'bg-gray-200 text-gray-700',
    accepted: 'bg-success text-white',
    rejected: 'bg-primary text-white',
};

const isSearching = ref(false);
const { getAll, responses } = useMissionResponses();
const perPage = ref(PERPAGE);
const page = ref(1);

const initialFilter = {
    institutionName: '',
    responseDate: '',
    type: 'nurse',
};

const option = ref({ ...initialFilter });

await getAll(page.value, perPage.value, option.value);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataResponses = computed<Record<string, any[]>>(() =>
    (responses.value.data ?? []).reduce((acc, response) => {
        const date = response.responded_at
            ? response.responded_at.slice(0, 10)
            : 'unknown';

        acc[date] ??= [];
        acc[date].push(response);
        return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any[]>),
);

const filterResponses = async () => {
    const currentFilter = { ...option.value };

    await getAll(
        page.value,
        perPage.value,
        {
            date: currentFilter.responseDate,
            institutionName: currentFilter.institutionName,
            type: 'nurse',
        });
};

const changePage = async (pge: number) => {
    page.value = pge;
    await filterResponses();
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await filterResponses();
};

const searchMission = debounce(async () => {
    isSearching.value = true;
    page.value = 1;
    await filterResponses();
    isSearching.value = false;
}, 100);

const expandedMissions = ref<Record<number, boolean>>({});

const toggleExpand = (missionId: number) => {
    expandedMissions.value[missionId] = !expandedMissions.value[missionId];
};

const reinitializeFilter = async () => {
    option.value.responseDate = '';
    option.value.institutionName = '';

    page.value = 1;
    await filterResponses();
};

watch(
    () => [option.value.institutionName, option.value.responseDate],
    async ([newInstitution, newDate], [oldInstitution, oldDate]) => {
        const wasFiltered
            = (oldInstitution && !newInstitution)
                || (oldDate && !newDate);

        if (wasFiltered) {
            page.value = 1;
            await filterResponses();
        }
    },
);
</script>
