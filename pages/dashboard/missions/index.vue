<template>
    <div class="lg:ml-20 xl:ml-0">
        <ArrowLeftIcon
            class="size-6 cursor-pointer hover:text-primary"
            title="Retour"
            @click="goBack"
        />

        <div class="mt-6 flex items-center justify-between w-full">
            <h1 class="flex w-full py-3 rounded-lg text-primary sm:bg-gray-100 sm:px-9">
                Offre de<span class="ml-1 font-semibold"> missions</span>
            </h1>
        </div>

        <form
            class="grid items-center w-full grid-cols-1 gap-6 mt-8 md:grid-cols-6"
            @submit.prevent="searchMission"
        >
            <div
                class="flex items-center justify-between w-full col-span-2 2xl:col-span-1 space-x-3 rounded-full bg-primary ps-3 pe-1"
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
                class="flex items-center justify-between w-full col-span-2 2xl:col-span-1 space-x-3 rounded-full bg-primary ps-3 pe-1"
            >
                <h5 class="text-xs text-white">
                    <span>Date</span>
                </h5>
                <InputIcon
                    v-model="option.date"
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
                    <ArrowPathIcon class="w-6" />
                    <span class="block ml-2 text-sm md:hidden">Réinitialiser</span>
                </Button>
                <Button
                    type="submit"
                    class="flex items-center justify-center px-4 text-sm bg-primary h-11"
                >
                    <MagnifyingGlassIcon class="w-6" />
                    <span class="ml-2 text-sm">Rechercher</span>
                </Button>
            </div>
        </form>

        <div
            v-if="isSearching"
            class="flex items-center gap-2 justify-center mt-10"
        >
            <ArrowPathIcon class="w-6 h-6 animate-spin text-primary" />
            <span>Recherche en cours...</span>
        </div>
        <div
            v-else-if="missions.data.length !== 0"
            class="mt-8 grid md:grid-cols-2 2xl:grid-cols-3 gap-6"
        >
            <div
                v-for="mission in dataMissions"
                :key="mission.id"
                class="group relative rounded-lg border border-gray-100 bg-white p-6 shadow transition hover:shadow-lg hover:border-gray-200"
            >
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-4">
                        <div class="shrink-0">
                            <img
                                v-if="mission.institution?.profil_url"
                                :src="mission.institution?.profil_url"
                                alt="Institution Logo"
                                class="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200"
                            >
                            <div
                                v-else
                                class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600"
                            >
                                {{ mission.institution.institution_name.charAt(0).toUpperCase() }}
                            </div>
                        </div>

                        <div>
                            <h2 class="text-sm font-semibold text-gray-900">
                                {{ mission.institution.institution_name }}
                            </h2>
                            <p class="text-xs text-gray-500">
                                Publié {{ formatRelativeDate(mission.created_at) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mt-5">
                    <p
                        class="text-sm leading-relaxed text-gray-700"
                        :class="!isExpanded ? 'line-clamp-3': ''"
                    >
                        {{ mission.service }}
                    </p>
                    <button
                        class="mt-2 text-sm text-primary font-semibold hover:underline focus:outline-none"
                        @click="toggleExpand"
                    >
                        {{ isExpanded ? 'Voir moins' : 'Voir plus' }}
                    </button>
                </div>

                <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <CalendarIcon class="h-4 w-4 text-gray-400" />
                    <span>
                        {{ formatToDMY(mission.start_date, true) }}
                        <span class="mx-1 text-gray-300">→</span>
                        {{ formatToDMY(mission.end_date, true) }}
                    </span>
                </div>
                <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <AcademicCapIcon class="h-4 w-4 text-gray-400" />
                    <span>
                        {{ mission.required_diploma }}
                    </span>
                </div>

                <div class="mt-6 flex items-center justify-end gap-3">
                    <Button @click="handleApply(mission.id)">
                        Postuler
                    </Button>
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
                v-if="missions.data.length > 0"
                :default-page="page"
                :per-page="perPage"
                :total="missions.meta.total"
                @update:page="changePage"
                @update:per-page="handlePerPageChange"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AcademicCapIcon, ArrowLeftIcon, ArrowPathIcon, CalendarIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { formatRelativeDate, formatToDMY } from '~/composables/useDate';
import { PERPAGE } from '~/lib/constants';
import { debounce, goBack } from '~/lib/utils';

useHead({
    title: 'Offres de missions',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

const router = useRouter();
const isSearching = ref(false);
const { getAll, missions } = useMissions();
const perPage = ref(PERPAGE);
const page = ref(1);

const initialFilter = {
    institutionName: '',
    date: '',
    type: 'nurse',
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
            date: currentFilter.date,
            institutionName: currentFilter.institutionName,
            type: 'nurse',
        });
};

const changePage = async (pge: number) => {
    page.value = pge;
    await filterMissions();
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await filterMissions();
};

const searchMission = debounce(async () => {
    isSearching.value = true;
    page.value = 1;
    await filterMissions();
    isSearching.value = false;
}, 100);

const isExpanded = ref(false);

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
};

const reinitializeFilter = async () => {
    option.value.date = '';
    option.value.institutionName = '';

    page.value = 1;
    await filterMissions();
};

watch(
    () => [option.value.institutionName, option.value.date],
    async ([newInstitution, newDate], [oldInstitution, oldDate]) => {
        const wasFiltered
            = (oldInstitution && !newInstitution)
                || (oldDate && !newDate);

        if (wasFiltered) {
            page.value = 1;
            await filterMissions();
        }
    },
);

const handleApply = (missionId: number) => {
    router.push(`/dashboard/missions/${missionId}/apply`);
};
</script>
