<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="mt-6 flex items-center gap-2 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
            <ArrowLeft
                class="size-5 cursor-pointer hover:text-primary"
                title="Retour"
                @click="goBack"
            />
            <h1 class="py-3 text-primary font-bold">
                <strong>Missions</strong>
            </h1>
        </div>

        <Tabs
            v-model="activeTab"
            class="mt-8"
            @update:model-value="handleTabChange"
        >
            <TabsList class="grid w-full grid-cols-2 gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                    value="my-missions"
                    class="flex flex-col items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3
                           data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                >
                    <div class="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                        <Briefcase class="w-4 h-4 sm:w-5 sm:h-5 text-success shrink-0" />
                        <span class="font-medium text-xs sm:text-sm">Mes missions</span>
                        <Badge
                            v-if="myMissionsCount > 0"
                        >
                            {{ myMissionsCount }}
                        </Badge>
                    </div>
                    <span class="text-xs text-gray-500 hidden sm:block text-center leading-tight">
                        Missions acceptées
                    </span>
                </TabsTrigger>

                <TabsTrigger
                    value="candidacy"
                    class="flex flex-col items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3
                           data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                >
                    <div class="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                        <CircleUser class="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
                        <span class="font-medium text-xs sm:text-sm">Candidatures</span>
                        <Badge
                            v-if="candidacyCount > 0"
                        >
                            {{ candidacyCount }}
                        </Badge>
                    </div>
                    <span class="text-xs text-gray-500 hidden sm:block text-center leading-tight">
                        Mes candidatures
                    </span>
                </TabsTrigger>
            </TabsList>

            <TabsContent
                value="my-missions"
                class="mt-6"
            >
                <div
                    v-if="isLoadingMyMissions"
                    class="flex items-center justify-center py-20"
                >
                    <div class="flex flex-col items-center gap-4">
                        <RefreshCw class="w-12 h-12 animate-spin text-success" />
                        <p class="text-gray-500">
                            Chargement de vos missions...
                        </p>
                    </div>
                </div>

                <template v-else>
                    <form
                        class="flex flex-wrap items-center gap-3"
                        @submit.prevent="searchMyMissions"
                    >
                        <InputIcon
                            v-model="myMissionsOption.institutionName"
                            rounded="md"
                            placeholder="Institution (INAMI)"
                            class="w-full lg:w-[250px]"
                        />
                        <InputIcon
                            v-model="myMissionsOption.date"
                            rounded="md"
                            type="date"
                            class="w-full lg:w-[250px]"
                        />
                        <div class="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                class="flex-1 sm:flex-none rounded-md bg-success hover:bg-success/90 text-white"
                                @click="reinitializeMyMissionsFilter"
                            >
                                <RefreshCw class="w-4 h-4 shrink-0 sm:mr-2" />
                                <span class="ml-2 sm:hidden text-sm">Réinitialiser</span>
                                <span class="hidden sm:inline-block text-sm">Réinitialiser</span>
                            </Button>
                            <Button
                                type="submit"
                                class="flex-1 sm:flex-none rounded-md bg-success hover:bg-success/90 text-white"
                            >
                                <Search class="w-4 h-4 mr-2 shrink-0" />
                                <span class="text-sm">Rechercher</span>
                            </Button>
                        </div>
                    </form>

                    <div
                        v-if="isSearchingMyMissions"
                        class="flex items-center gap-2 justify-center mt-10"
                    >
                        <RefreshCw class="w-6 h-6 animate-spin text-success" />
                        <span>Recherche en cours...</span>
                    </div>
                    <div
                        v-else-if="dataAllMyMissions.length !== 0"
                        class="mt-8 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6"
                    >
                        <div
                            v-for="mission in dataAllMyMissions"
                            :key="mission.id"
                            :class="[
                                'group relative rounded-lg border-2 bg-white p-4 md:p-6 shadow transition hover:shadow-lg',
                                mission.status === 'completed'
                                    ? 'border-gray-200 opacity-75'
                                    : 'border-success/30 hover:border-success/50',
                            ]"
                        >
                            <div class="flex items-start justify-between">
                                <div class="flex items-center gap-3 md:gap-4 min-w-0">
                                    <div class="shrink-0">
                                        <img
                                            v-if="mission.institution?.profil_url"
                                            :src="mission.institution?.profil_url"
                                            alt="Institution Logo"
                                            :class="[
                                                'h-10 w-10 md:h-12 md:w-12 rounded-full object-cover',
                                                mission.status === 'completed' ? 'ring-2 ring-gray-200' : 'ring-2 ring-success/20',
                                            ]"
                                        >
                                        <div
                                            v-else
                                            :class="[
                                                'flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full text-sm font-semibold',
                                                mission.status === 'completed'
                                                    ? 'bg-gray-200 text-gray-600'
                                                    : 'bg-success/10 text-success',
                                            ]"
                                        >
                                            {{ mission.institution.institution_name.charAt(0).toUpperCase() }}
                                        </div>
                                    </div>
                                    <div class="min-w-0">
                                        <h2 class="text-sm font-semibold text-gray-900 truncate">
                                            {{ mission.institution.institution_name }}
                                        </h2>
                                        <p class="text-xs text-gray-500">
                                            {{ missionStatusLabel(mission.status) }}
                                            {{ formatRelativeDate(mission.status === 'completed' ? mission.updated_at : mission.created_at) }}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    :class="[
                                        '!whitespace-nowrap !w-auto !min-w-fit px-2 py-1 text-xs shrink-0',
                                        missionStatusBadgeClass(mission.status),
                                    ]"
                                >
                                    {{ missionStatusLabel(mission.status) }}
                                </Badge>
                            </div>

                            <div class="mt-4 md:mt-5">
                                <p
                                    class="text-sm leading-relaxed text-gray-700 line-clamp-3"
                                >
                                    <span
                                        v-if="mission.service?.name"
                                        class="font-bold"
                                    >{{ mission.service?.name }}</span>
                                    {{ mission.description }}
                                </p>
                            </div>

                            <div class="mt-3 md:mt-4 flex items-center gap-2 text-sm text-gray-500">
                                <Calendar class="h-4 w-4 text-gray-400 shrink-0" />
                                <span>
                                    {{ formatToDMY(mission.start_date, mission.status === 'completed') }}
                                    <span class="mx-1 text-gray-300">→</span>
                                    {{ formatToDMY(mission.end_date, mission.status === 'completed') }}
                                </span>
                            </div>
                            <div
                                v-if="mission.status !== 'completed'"
                                class="mt-2 md:mt-3 flex items-center gap-2 text-sm text-gray-500"
                            >
                                <Clock class="h-4 w-4 text-gray-400 shrink-0" />
                                <span
                                    v-if="mission.is_long_term"
                                    class="font-medium text-gray-600"
                                >
                                    Disponibilités (long terme)
                                </span>
                                <span v-else>
                                    {{ formatTime(mission.time_start_at) }}
                                    <span class="mx-1 text-gray-300">→</span>
                                    {{ formatTime(mission.time_end_at) }}
                                </span>
                            </div>
                            <div
                                v-else
                                class="mt-2 md:mt-3 flex items-center gap-2 text-sm text-gray-500"
                            >
                                <GraduationCap class="h-4 w-4 text-gray-400 shrink-0" />
                                <span>{{ mission.required_diploma }}</span>
                            </div>
                            <div class="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                <NuxtLink :href="`/dashboard/missions/${mission.id}`">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="text-xs border-gray-200 text-gray-600 hover:border-success hover:text-success"
                                    >
                                        <Eye class="w-3.5 h-3.5 mr-1.5" />
                                        Voir les détails
                                    </Button>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="mt-10 text-center">
                            <Briefcase class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p class="text-gray-500 text-lg font-medium">
                                Aucune mission acceptée
                            </p>
                        </div>
                    </div>
                </template>
            </TabsContent>

            <TabsContent
                value="candidacy"
                class="mt-6"
            >
                <div
                    v-if="isLoadingCandidacy"
                    class="flex items-center justify-center py-20"
                >
                    <div class="flex flex-col items-center gap-4">
                        <RefreshCw class="w-12 h-12 animate-spin text-orange-500" />
                        <p class="text-gray-500">
                            Chargement de vos candidatures...
                        </p>
                    </div>
                </div>

                <template v-else>
                    <form
                        class="flex flex-wrap items-center gap-3"
                        @submit.prevent="searchCandidacy"
                    >
                        <InputIcon
                            v-model="candidacyOption.institutionName"
                            rounded="md"
                            placeholder="Institution (INAMI)"
                            class="w-full lg:w-[250px]"
                        />
                        <InputIcon
                            v-model="candidacyOption.responseDate"
                            rounded="md"
                            type="date"
                            class="w-full lg:w-[250px]"
                        />
                        <div class="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                class="flex-1 sm:flex-none rounded-md bg-orange-500 hover:bg-orange-600 text-white py-2"
                                @click="reinitializeCandidacyFilter"
                            >
                                <RefreshCw class="w-4 h-4 shrink-0 sm:mr-2" />
                                <span class="ml-2 sm:hidden text-sm">Réinitialiser</span>
                                <span class="hidden sm:inline-block text-sm">Réinitialiser</span>
                            </Button>
                            <Button
                                type="submit"
                                class="flex-1 sm:flex-none rounded-md bg-orange-500 hover:bg-orange-600 text-white py-2"
                            >
                                <Search class="w-4 h-4 mr-2 shrink-0" />
                                <span class="text-sm">Rechercher</span>
                            </Button>
                        </div>
                    </form>

                    <div
                        v-if="isSearchingCandidacy"
                        class="flex items-center gap-2 justify-center mt-10"
                    >
                        <RefreshCw class="w-6 h-6 animate-spin text-orange-500" />
                        <span>Recherche en cours...</span>
                    </div>
                    <div
                        v-else-if="Object.keys(dataResponses).length !== 0"
                        class="mt-12"
                    >
                        <div
                            v-for="(missionResponses, date) in dataResponses"
                            :key="date"
                            class="mb-8"
                        >
                            <div class="flex items-center gap-3 mb-4 md:hidden">
                                <div class="w-3 h-3 rounded-full bg-orange-500/60 shrink-0" />
                                <h3 class="text-sm text-gray-600 font-semibold">
                                    {{ formatToDMY(date) }}
                                </h3>
                                <div class="flex-1 h-px bg-orange-200" />
                            </div>

                            <div class="hidden md:grid grid-cols-6 gap-8">
                                <div class="col-span-1 flex gap-8 relative">
                                    <h3 class="text-sm text-gray-600 font-semibold">
                                        {{ formatToDMY(date) }}
                                    </h3>
                                    <div class="relative border-r border-orange-300">
                                        <div class="border-r border-orange-300" />
                                        <div class="absolute top-0 -right-3 w-6 h-6 rounded-full bg-orange-500/60" />
                                    </div>
                                </div>
                                <div class="col-span-5 grid grid-cols-2 gap-4">
                                    <div
                                        v-for="response in missionResponses"
                                        :key="response.id"
                                        class="group relative rounded-lg border-2 border-orange-100 bg-white p-6 shadow transition hover:shadow-lg hover:border-orange-300"
                                    >
                                        <div class="flex items-start justify-between">
                                            <div class="flex items-center gap-4 min-w-0">
                                                <div class="shrink-0">
                                                    <img
                                                        v-if="response.mission.institution?.profil_url"
                                                        :src="response.mission.institution?.profil_url"
                                                        alt="Institution Logo"
                                                        class="h-12 w-12 rounded-full object-cover ring-2 ring-orange-200"
                                                    >
                                                    <div
                                                        v-else
                                                        class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600"
                                                    >
                                                        {{ response.mission.institution.institution_name.charAt(0).toUpperCase() }}
                                                    </div>
                                                </div>
                                                <div class="min-w-0">
                                                    <h2 class="text-sm font-semibold text-gray-900 truncate">
                                                        {{ response.mission.institution.institution_name }}
                                                    </h2>
                                                    <p class="text-xs text-gray-500">
                                                        Publié {{ formatRelativeDate(response.mission.created_at) }}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge :class="['text-xs min-w-24 shrink-0', statusClasses[response.status] ?? 'bg-gray-200 text-gray-700']">
                                                {{ statusResponse[response?.status] }}
                                            </Badge>
                                        </div>
                                        <div class="mt-5">
                                            <p
                                                class="text-sm leading-relaxed text-gray-700 line-clamp-3"
                                            >
                                                {{ response.mission.description }}
                                            </p>
                                        </div>
                                        <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar class="h-4 w-4 text-gray-400 shrink-0" />
                                            <span>
                                                {{ formatToDMY(response.mission.start_date) }}
                                                <span class="mx-1 text-gray-300">→</span>
                                                {{ formatToDMY(response.mission.end_date) }}
                                            </span>
                                        </div>
                                        <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                            <GraduationCap class="h-4 w-4 text-gray-400 shrink-0" />
                                            <span>{{ response.mission.required_diploma }}</span>
                                        </div>
                                        <div class="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                            <NuxtLink :href="`/dashboard/missions/${response.mission.id}`">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    class="text-xs border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                                                >
                                                    <Eye class="w-3.5 h-3.5 mr-1.5" />
                                                    Voir les détails
                                                </Button>
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="md:hidden grid grid-cols-1 gap-4">
                                <div
                                    v-for="response in missionResponses"
                                    :key="response.id"
                                    class="rounded-lg border-2 border-orange-100 bg-white p-4 shadow"
                                >
                                    <div class="flex items-start justify-between gap-2">
                                        <div class="flex items-center gap-3 min-w-0">
                                            <div class="shrink-0">
                                                <img
                                                    v-if="response.mission.institution?.profil_url"
                                                    :src="response.mission.institution?.profil_url"
                                                    alt="Institution Logo"
                                                    class="h-10 w-10 rounded-full object-cover ring-2 ring-orange-200"
                                                >
                                                <div
                                                    v-else
                                                    class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600"
                                                >
                                                    {{ response.mission.institution.institution_name.charAt(0).toUpperCase() }}
                                                </div>
                                            </div>
                                            <div class="min-w-0">
                                                <h2 class="text-sm font-semibold text-gray-900 truncate">
                                                    {{ response.mission.institution.institution_name }}
                                                </h2>
                                                <p class="text-xs text-gray-500">
                                                    Publié {{ formatRelativeDate(response.mission.created_at) }}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge :class="['text-xs shrink-0 whitespace-nowrap', statusClasses[response.status] ?? 'bg-gray-200 text-gray-700']">
                                            {{ statusResponse[response?.status] }}
                                        </Badge>
                                    </div>
                                    <div class="mt-3">
                                        <p
                                            class="text-sm leading-relaxed text-gray-700 line-clamp-3"
                                        >
                                            {{ response.mission.description }}
                                        </p>
                                    </div>
                                    <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar class="h-4 w-4 text-gray-400 shrink-0" />
                                        <span>
                                            {{ formatToDMY(response.mission.start_date) }}
                                            <span class="mx-1 text-gray-300">→</span>
                                            {{ formatToDMY(response.mission.end_date) }}
                                        </span>
                                    </div>
                                    <div class="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                        <GraduationCap class="h-4 w-4 text-gray-400 shrink-0" />
                                        <span>{{ response.mission.required_diploma }}</span>
                                    </div>
                                    <div class="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                        <NuxtLink :href="`/dashboard/missions/${response.mission.id}`">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                class="text-xs border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                                            >
                                                <Eye class="w-3.5 h-3.5 mr-1.5" />
                                                Voir les détails
                                            </Button>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else>
                        <div class="mt-10 text-center">
                            <CircleUser class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p class="text-gray-500 text-lg font-medium">
                                Aucune candidature trouvée
                            </p>
                            <p class="text-gray-400 text-sm mt-2">
                                Vos candidatures apparaîtront ici une fois que vous aurez postulé
                            </p>
                        </div>
                    </div>

                    <div class="mt-4">
                        <CustomPagination
                            v-if="responses.data.length > 0"
                            :default-page="candidacyPage"
                            :per-page="candidacyPerPage"
                            :total="responses.meta.total"
                            @update:page="changeCandidacyPage"
                            @update:per-page="handleCandidacyPerPageChange"
                        />
                    </div>
                </template>
            </TabsContent>
        </Tabs>
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, Briefcase, Calendar, CircleUser, Clock, Eye, GraduationCap, Megaphone, RefreshCw, Search, Star } from 'lucide-vue-next';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { formatRelativeDate, formatTime, formatToDMY } from '~/composables/useDate';
import { PERPAGE } from '~/lib/constants';
import { debounce, goBack } from '~/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

useHead({
    title: 'Missions',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});

const statusResponse = {
    pending: 'En attente',
    accepted: 'Accepté',
    rejected: 'Rejeté',
};

const statusClasses: Record<string, string> = {
    pending: 'bg-orange-200 text-orange-700',
    accepted: 'bg-success text-white',
    rejected: 'bg-red-500 text-white',
};

const user = useState<any>('user');

const MISSION_STATUS_LABELS: Record<string, string> = {
    open: 'Ouverte',
    assigned: 'Assignée',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
};

const MISSION_STATUS_BADGE_CLASSES: Record<string, string> = {
    open: 'bg-emerald-100 text-emerald-800',
    assigned: 'bg-indigo-100 text-indigo-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-400 text-white',
    cancelled: 'bg-red-100 text-red-700',
};

const missionStatusLabel = (status?: string) => {
    const key = (status ?? '').toLowerCase();
    return MISSION_STATUS_LABELS[key] ?? 'Ouverte';
};

const missionStatusBadgeClass = (status?: string) => {
    const key = (status ?? '').toLowerCase();
    return MISSION_STATUS_BADGE_CLASSES[key] ?? 'bg-emerald-100 text-emerald-800';
};

const activeTab = ref('my-missions');
const isSearchingMyMissions = ref(false);
const isSearchingCandidacy = ref(false);
const isLoadingMyMissions = ref(true);
const isLoadingCandidacy = ref(true);

const { getAll: getCandidacy, responses } = useMissionResponses();
const myMissionsState = useState('myMissions', () => ({ data: [], meta: {} }));

const candidacyPerPage = ref(PERPAGE);
const candidacyPage = ref(1);

const myMissionsOption = ref({ institutionName: '', date: '' });
const candidacyOption = ref({ institutionName: '', responseDate: '' });

const dataAllMyMissions = computed(() => myMissionsState.value?.data ?? []);

const myMissionsCount = computed(() => dataAllMyMissions.value.length);
const candidacyCount = computed(() => responses.value.meta?.total || 0);

async function loadMyMissions() {
    isLoadingMyMissions.value = true;
    try {
        const { $apifetch } = useNuxtApp();
        const params: Record<string, any> = {
            institutionName: myMissionsOption.value.institutionName,
            date: myMissionsOption.value.date,
            type: user.value?.type === 'institution' ? 'institution' : 'me',
        };

        const response = await $apifetch('api/institution/missions/', {
            params,
        });
        myMissionsState.value = response;
    }
    catch (error) {
        console.error('Error loading my missions:', error);
    }
    finally {
        isLoadingMyMissions.value = false;
    }
}

async function loadCandidacy() {
    isLoadingCandidacy.value = true;
    try {
        await getCandidacy(candidacyPage.value, candidacyPerPage.value, {
            date: candidacyOption.value.responseDate,
            institutionName: candidacyOption.value.institutionName,
            type: 'nurse',
            exclude_status: 'accepted',
        });
    }
    catch (error) {
        console.error('Error loading candidacy:', error);
    }
    finally {
        isLoadingCandidacy.value = false;
    }
}

onMounted(async () => {
    await Promise.all([
        loadMyMissions(),
        loadCandidacy(),
    ]);
});

const dataResponses = computed<Record<string, any[]>>(() => {
    if (!responses.value?.data) {
        return {};
    }
    return (responses.value.data ?? []).reduce((acc, response) => {
        const date = response.responded_at
            ? response.responded_at.slice(0, 10)
            : 'unknown';

        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(response);
        return acc;
    }, {} as Record<string, any[]>);
});

const filterMissions = async () => {
    await loadMyMissions();
};

const filterCandidacy = async () => {
    const currentFilter = { ...candidacyOption.value };
    await getCandidacy(
        candidacyPage.value,
        candidacyPerPage.value,
        {
            date: currentFilter.responseDate,
            institutionName: currentFilter.institutionName,
            type: 'nurse',
            exclude_status: 'accepted',
        });
};

const changeCandidacyPage = async (pge: number) => {
    candidacyPage.value = pge;
    await filterCandidacy();
};

const handleCandidacyPerPageChange = async (value: number) => {
    candidacyPerPage.value = value;
    await filterCandidacy();
};

const searchMyMissions = debounce(async () => {
    isSearchingMyMissions.value = true;
    await filterMissions();
    isSearchingMyMissions.value = false;
}, 100);

const searchCandidacy = debounce(async () => {
    isSearchingCandidacy.value = true;
    candidacyPage.value = 1;
    await filterCandidacy();
    isSearchingCandidacy.value = false;
}, 100);

const reinitializeMyMissionsFilter = async () => {
    myMissionsOption.value.date = '';
    myMissionsOption.value.institutionName = '';
    await filterMissions();
};

const reinitializeCandidacyFilter = async () => {
    candidacyOption.value.responseDate = '';
    candidacyOption.value.institutionName = '';
    await filterCandidacy();
};

const handleTabChange = async (newTab: string) => {
    activeTab.value = newTab;
    if (newTab === 'my-missions' && !myMissionsState.value.data.length) {
        await loadMyMissions();
    }
    else if (newTab === 'candidacy' && !responses.value.data.length) {
        await loadCandidacy();
    }
};
</script>
