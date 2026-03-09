<template>
    <div class="mb-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex items-start gap-3">
                <InformationCircleIcon class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                    <p class="text-sm text-blue-900">
                        <strong>Votre compte a été validé !</strong> Vous pouvez maintenant utiliser toutes les fonctionnalités de la plateforme.
                    </p>
                    <p class="text-xs text-blue-700 mt-1">
                        Pour toute question, contactez-nous au <strong>0478 02 33 77</strong>
                    </p>
                </div>
            </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
            <div class="md:col-span-1 bg-white shadow rounded-lg p-8 flex gap-8 items-center">
                <LayoutsAppImage
                    :src="'/icons/plus.png'"
                    alt="Medical plus icon"
                    class="w-16 sm:w-20 opacity-90"
                />
                <div class="space-y-8">
                    <p class="text-gray-700">
                        <span class="text-gray-900 text-lg font-bold">Besoin d’un infirmier rapidement ?</span> <br>
                        Publiez une mission et recevez des candidatures en quelques minutes.
                    </p>
                    <Button
                        class="rounded-md animate-bounce mt-6"
                        @click="handleCreateMission"
                    >
                        Publier une mission
                    </Button>
                </div>
            </div>

            <div class="md:col-span-1 grid grid-cols-2 gap-4">
                <div class="col-span-1 bg-white shadow rounded-lg p-6 space-y-1">
                    <h4 class="text-sm text-gray-500">
                        Mission en cours
                    </h4>
                    <p class="font-bold text-primary text-3xl">
                        {{ dataReports?.stats?.mission?.in_progress }}
                    </p>
                </div>
                <div class="col-span-1 bg-white shadow rounded-lg p-6 space-y-1">
                    <h4 class="text-sm text-gray-500">
                        Mission à pourvoir
                    </h4>
                    <p class="font-bold text-primary text-3xl">
                        {{ dataReports?.stats?.mission?.open }}
                    </p>
                </div>
                <div class="col-span-1 bg-white shadow rounded-lg p-6 space-y-1">
                    <h4 class="text-sm text-gray-500">
                        Feuille de temps à valider
                    </h4>
                    <p class="font-bold text-primary text-3xl">
                        {{ dataReports?.stats?.timesheet_validate }}
                    </p>
                </div>
                <div class="col-span-1 bg-white shadow rounded-lg p-6 space-y-1">
                    <h4 class="text-sm text-gray-500">
                        Factures en attente
                    </h4>
                    <p class="font-bold text-primary text-3xl">
                        {{ dataReports?.stats?.mission?.invoice_pending || 0 }}
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-12 grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 shadow p-6 rounded-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-700">
                        Vos récentes missions
                    </h3>
                    <Button
                        variant="ghost"
                        class="text-primary font-bold"
                        @click="handleShowMissions"
                    >
                        Voir tout
                    </Button>
                </div>

                <Tabs
                    v-model="activeTab"
                    class="mt-3 mb-6"
                    @update:model-value="handleTabChange"
                >
                    <TabsList class="w-full">
                        <TabsTrigger
                            value="open"
                            class="w-full lg:w-64"
                        >
                            À pourvoir
                        </TabsTrigger>
                        <TabsTrigger
                            value="in_progress"
                            class="w-full lg:w-64"
                        >
                            En cours
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="open">
                        <div class="hidden mt-4 lg:grid">
                            <Table class="w-full overflow-hidden">
                                <TableHeader>
                                    <TableRow class="grid grid-cols-6 border-b">
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Service
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Date de début
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Date de fin
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Horaire
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Nb.candidats
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Création
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    <div
                                        v-if="dataReports.missions.open.length == 0"
                                        class="text-center mt-12 text-gray-600"
                                    >
                                        Aucune mission pour le moment
                                    </div>
                                    <div
                                        v-else
                                    >
                                        <TableRow
                                            v-for="mission in dataReports.missions.open"
                                            :key="mission.id"
                                            class="grid grid-cols-6 pb-4 border-b"
                                        >
                                            <TableHead class="py-4 truncate text-gray-800">
                                                {{ mission.service.name || '-' }}
                                            </TableHead>
                                            <TableHead class="py-4 truncate text-gray-800">
                                                {{ formatToDMY(mission.start_date) }}
                                            </TableHead>
                                            <TableHead class="py-4 truncate text-gray-800">
                                                {{ formatToDMY(mission.end_date) }}
                                            </TableHead>
                                            <TableHead class="py-4 truncate text-gray-800">
                                                {{ formatTime(mission.time_start_at) }}
                                                <span class="mx-1 text-gray-500">→</span>
                                                {{ formatTime(mission.time_end_at) }}
                                            </TableHead>
                                            <TableHead class="py-4 truncate text-gray-800">
                                                {{ mission.matching_candidates.length }}
                                            </TableHead>
                                            <TableHead class="py-4 truncate text-gray-800">
                                                {{ formatRelativeDate(mission.created_at) }}
                                            </TableHead>
                                        </TableRow>
                                    </div>
                                </TableBody>
                            </Table>
                        </div>

                        <div class="lg:hidden mt-4 space-y-4">
                            <div
                                v-for="mission in dataReports.missions.open"
                                :key="mission.id"
                                class="rounded-md bg-gray-50 p-4"
                            >
                                <div class="flex justify-between">
                                    <span class="text-sm text-gray-500">Service</span>
                                    <span class="font-semibold text-sm text-gray-500">{{ mission.service.name || '-' }}</span>
                                </div>

                                <div class="mt-2 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p class="text-gray-500">
                                            Début
                                        </p>
                                        <p>{{ formatToDMY(mission.start_date) }}</p>
                                    </div>

                                    <div>
                                        <p class="text-gray-500">
                                            Fin
                                        </p>
                                        <p>{{ formatToDMY(mission.start_date) }}</p>
                                    </div>

                                    <div>
                                        <p class="text-gray-500">
                                            Horaire
                                        </p>
                                        <p>
                                            {{ formatTime(mission.time_start_at) }}
                                            <span class="mx-1 text-gray-500">→</span>
                                            {{ formatTime(mission.time_end_at) }}
                                        </p>
                                    </div>

                                    <div>
                                        <p class="text-gray-500">
                                            Nb.candidats
                                        </p>
                                        <p>
                                            {{ mission.matching_candidates.length }}
                                        </p>
                                    </div>
                                </div>

                                <p class="mt-3 text-xs text-gray-400">
                                    Créée {{ mission.created_at }}
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="in_progress">
                        <div class="hidden mt-4 lg:grid">
                            <Table class="w-full overflow-hidden">
                                <TableHeader>
                                    <TableRow class="grid grid-cols-6 pb-4 border-b">
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Service
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Date de début
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Date de fin
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Horaire
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Infirmier
                                        </TableHead>
                                        <TableHead class="py-4 font-semibold text-gray-600">
                                            Création
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    <div
                                        v-if="dataReports.missions.in_progress.length == 0"
                                        class="text-center mt-12 text-gray-600"
                                    >
                                        Aucune mission pour le moment
                                    </div>
                                    <div
                                        v-else
                                    >
                                        <TableRow
                                            v-for="mission in dataReports.missions.in_progress"
                                            :key="mission.id"
                                            class="grid grid-cols-6 pb-4 border-b"
                                        >
                                            <TableHead class="py-4 text-gray-800">
                                                {{ mission.service.name || '-' }}
                                            </TableHead>
                                            <TableHead class="py-4 text-gray-800">
                                                {{ formatToDMY(mission.start_date) }}
                                            </TableHead>
                                            <TableHead class="py-4 text-gray-800">
                                                {{ formatToDMY(mission.end_date) }}
                                            </TableHead>
                                            <TableHead class="py-4 text-gray-800">
                                                {{ formatTime(mission.time_start_at) }}
                                                <span class="mx-1 text-gray-500">→</span>
                                                {{ formatTime(mission.time_end_at) }}
                                            </TableHead>
                                            <TableHead class="py-4 text-gray-800">
                                                {{ mission.accepted_candidate.full_name }}
                                            </TableHead>
                                            <TableHead class="py-4 text-gray-800">
                                                {{ formatRelativeDate(mission.created_at) }}
                                            </TableHead>
                                        </TableRow>
                                    </div>
                                </TableBody>
                            </Table>
                        </div>

                        <div class="lg:hidden mt-4 space-y-4">
                            <div
                                v-for="mission in dataReports.missions.in_progress"
                                :key="mission.id"
                                class="rounded-md bg-gray-50 p-4"
                            >
                                <div class="flex justify-between">
                                    <span class="text-sm text-gray-500">Service</span>
                                    <span class="font-semibold text-sm text-gray-500">{{ mission.service.name || '-' }}</span>
                                </div>

                                <div class="mt-2 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p class="text-gray-500">
                                            Début
                                        </p>
                                        <p>{{ mission.start_date }}</p>
                                    </div>

                                    <div>
                                        <p class="text-gray-500">
                                            Fin
                                        </p>
                                        <p>{{ mission.end_date }}</p>
                                    </div>

                                    <div>
                                        <p class="text-gray-500">
                                            Horaire
                                        </p>
                                        <p>
                                            {{ formatTime(mission.time_start_at) }}
                                            <span class="mx-1 text-gray-500">→</span>
                                            {{ formatTime(mission.time_end_at) }}
                                        </p>
                                    </div>

                                    <div>
                                        <p class="text-gray-500">
                                            Infirmier
                                        </p>
                                        <p>{{ mission.accepted_candidate.full_name }}</p>
                                    </div>
                                </div>

                                <p class="mt-3 text-xs text-gray-400">
                                    Créée {{ mission.created_at }}
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <div class="lg:col-span-1 shadow p-6 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-700">
                    Notifications
                </h3>
                <div v-if="dataReports?.notifications?.missions?.length == 0 && dataReports?.notifications?.timesheets?.length == 0">
                    <p class="mt-16 mb-16 lg:mb-0 text-center text-sm text-gray-500">
                        Aucune notification pour le moment
                    </p>
                </div>
                <div
                    v-else
                    class="mt-4 grid gap-4"
                >
                    <div
                        v-for="notification in dataReports?.notifications?.missions"
                        :key="notification.id"
                        class="bg-gray-50 rounded-md p-4 shadow-sm flex gap-4 items-center hover:transition-all hover:duration-300 hover:scale-105 hover:cursor-pointer"
                        @click="handleReadNotification(notification, 'mission')"
                    >
                        <UserPlusIcon class="w-6 h-6 text-primary" />
                        <div class="space-y-2">
                            <h6 class="text-sm text-gray-600 font-medium">
                                Un nouveau candidat pour la mission #{{ notification.notifiable_id }}
                            </h6>
                            <p class="text-xs text-gray-400">
                                {{ formatRelativeDate(notification.created_at) }} . Nouveau candidat
                            </p>
                        </div>
                    </div>
                    <div
                        v-for="notification in dataReports?.notifications?.timesheets"
                        :key="notification.mission_id"
                        class="bg-gray-50 rounded-md p-4 shadow-sm flex gap-4 items-center hover:transition-all hover:duration-300 hover:scale-105 hover:cursor-pointer"
                        @click="handleReadNotification(notification, 'timesheet')"
                    >
                        <ClipboardDocumentListIcon class="w-6 h-6 text-primary" />
                        <div class="space-y-2">
                            <h6 class="text-sm text-gray-600 font-medium">
                                Vous avez {{ notification.data.length > 1 ? `${notification.data.length} jours` : `${notification.data.length} jour` }} à valider pour la mission #{{ notification.mission_id }}
                            </h6>
                            <p class="text-xs text-gray-400">
                                {{ formatRelativeDate(notification.data[0].created_at) }} . Feuille de temps
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ClipboardDocumentListIcon, UserPlusIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
import { formatRelativeDate, formatTime, formatToDMY } from '~/composables/useDate';

useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const router = useRouter();

const handleCreateMission = () => {
    router.push('/dashboard/institution/missions/create');
};

const handleShowMissions = () => {
    router.push('/dashboard/institution/missions');
};

const { reports, getReports } = useReports();
const { markAsRead } = useNotifications();
const dataReports = computed(() => reports?.value);

await getReports();

const activeTab = ref('open');
const handleTabChange = async (newTab: string) => {
    activeTab.value = newTab;
};

const handleReadNotification = async (notification, typeNotif) => {
    if (typeNotif == 'mission') {
        const response = await markAsRead(notification.id);

        if (response.data) {
            router.push(`/dashboard/institution/missions/candidacy/${notification.notifiable_id}`);
        }
    }
    else {
        for (const notif of notification.data) {
            await markAsRead(notif.id);
        }

        router.push(
            `/dashboard/institution/missions/timesheet/${notification.mission_id}`,
        );
    }
};
</script>
