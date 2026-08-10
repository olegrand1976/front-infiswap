<template>
    <div class="mb-4">
        <div
            v-if="pending || loading"
            class="space-y-6"
        >
            <Skeleton class="h-32 rounded-3xl" />
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton
                    v-for="n in 4"
                    :key="n"
                    class="h-28 rounded-2xl"
                />
            </div>
            <Skeleton class="h-64 rounded-2xl" />
        </div>

        <template v-else>
            <!-- Hero CTA -->
            <div class="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-accent-green via-accent-green-light to-primary p-7 shadow-xl">
                <div class="flex items-center gap-4">
                    <span class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                        <LayoutsAppImage
                            :src="'/icons/plus.png'"
                            alt="Medical plus icon"
                            class="w-7 opacity-90"
                        />
                    </span>
                    <div>
                        <p class="font-secondary text-lg font-bold text-white sm:text-xl">
                            Besoin d’un infirmier rapidement ?
                        </p>
                        <p class="mt-1 text-sm text-white/90">
                            Publiez une mission et recevez des candidatures en quelques minutes.
                        </p>
                    </div>
                </div>
                <Button
                    class="h-auto shrink-0 rounded-xl bg-white px-6 py-3.5 font-bold text-primary shadow-lg transition hover:scale-[1.02]"
                    @click="handleCreateMission"
                >
                    Publier une mission
                </Button>
            </div>

            <!-- KPIs -->
            <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-2xl bg-gradient-to-br from-green-700 to-green-800 p-5 text-white shadow-lg">
                    <span class="mb-2 flex size-9 items-center justify-center rounded-lg bg-white/15">
                        <ClipboardCheck class="size-4" />
                    </span>
                    <p class="font-secondary text-2xl font-bold tabular-nums">
                        {{ dataReports?.stats?.mission?.in_progress }}
                    </p>
                    <p class="mt-1 text-xs text-white/85">
                        Mission en cours
                    </p>
                </div>

                <div class="rounded-2xl bg-gradient-to-br from-green-700 to-green-800 p-5 text-white shadow-lg">
                    <span class="mb-2 flex size-9 items-center justify-center rounded-lg bg-white/15">
                        <UserSearch class="size-4" />
                    </span>
                    <p class="font-secondary text-2xl font-bold tabular-nums">
                        {{ dataReports?.stats?.mission?.open }}
                    </p>
                    <p class="mt-1 text-xs text-white/85">
                        Mission à pourvoir
                    </p>
                </div>

                <div class="rounded-2xl bg-primary p-5 text-primary-foreground shadow-lg">
                    <span class="mb-2 flex size-9 items-center justify-center rounded-lg bg-white/15">
                        <Clock class="size-4" />
                    </span>
                    <p class="font-secondary text-2xl font-bold tabular-nums">
                        {{ dataReports?.stats?.timesheet_validate }}
                    </p>
                    <p class="mt-1 text-xs text-white/85">
                        Feuille de temps à valider
                    </p>
                </div>

                <div class="rounded-2xl bg-primary p-5 text-primary-foreground shadow-lg">
                    <span class="mb-2 flex size-9 items-center justify-center rounded-lg bg-white/15">
                        <Receipt class="size-4" />
                    </span>
                    <p class="font-secondary text-2xl font-bold tabular-nums">
                        {{ dataReports?.stats?.mission?.invoice_pending || 0 }}
                    </p>
                    <p class="mt-1 text-xs text-white/85">
                        Factures en attente
                    </p>
                </div>
            </div>

            <div class="mt-6 grid gap-6 lg:grid-cols-3">
                <div class="rounded-2xl bg-card p-6 shadow-sm lg:col-span-2">
                    <div class="flex items-center justify-between">
                        <h3 class="font-secondary text-lg font-semibold text-foreground">
                            Vos récentes missions
                        </h3>
                        <Button
                            variant="ghost"
                            class="font-bold text-primary"
                            @click="handleShowMissions"
                        >
                            Voir tout
                        </Button>
                    </div>

                    <Tabs
                        v-model="activeTab"
                        class="mt-4"
                        @update:model-value="handleTabChange"
                    >
                        <TabsList class="gap-2.5 border-0 bg-transparent p-0">
                            <TabsTrigger
                                value="open"
                                class="gap-2 rounded-full border border-transparent px-4 py-2 text-xs font-bold data-[state=inactive]:border-primary/35 data-[state=inactive]:text-primary data-[state=active]:rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                            >
                                <span class="tabular-nums">{{ dataReports?.stats?.mission?.open }}</span> À pourvoir
                            </TabsTrigger>
                            <TabsTrigger
                                value="in_progress"
                                class="gap-2 rounded-full border border-green-700/35 px-4 py-2 text-xs font-bold data-[state=inactive]:text-green-700 data-[state=active]:rounded-full data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-700 data-[state=active]:to-green-800 data-[state=active]:text-white data-[state=active]:shadow-sm"
                            >
                                <span class="tabular-nums">{{ dataReports?.stats?.mission?.in_progress }}</span> En cours
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="open">
                            <div
                                v-if="dataReports.missions.open.length == 0"
                                class="py-10 text-center text-sm text-muted-foreground"
                            >
                                Aucune mission pour le moment
                            </div>
                            <div
                                v-else
                                class="mt-2 divide-y divide-border"
                            >
                                <div
                                    v-for="mission in dataReports.missions.open"
                                    :key="mission.id"
                                    class="flex items-center gap-3 py-3"
                                >
                                    <span class="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 font-secondary text-sm font-bold text-primary">
                                        {{ getInitials(mission.service.name) }}
                                    </span>
                                    <div class="min-w-0 flex-1">
                                        <p class="truncate text-sm font-semibold text-foreground">
                                            {{ mission.service.name || '-' }}
                                        </p>
                                        <p class="mt-0.5 truncate text-xs text-muted-foreground">
                                            {{ formatToDMY(mission.start_date) }} → {{ formatToDMY(mission.end_date) }} ·
                                            {{ formatTime(mission.time_start_at) }}–{{ formatTime(mission.time_end_at) }}
                                        </p>
                                    </div>
                                    <div class="shrink-0 text-right">
                                        <p class="text-xs font-bold text-primary">
                                            {{ mission.matching_candidates.length }} candidat{{ mission.matching_candidates.length > 1 ? 's' : '' }}
                                        </p>
                                        <p class="mt-0.5 text-[11px] text-muted-foreground">
                                            {{ formatRelativeDate(mission.created_at) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="in_progress">
                            <div
                                v-if="dataReports.missions.in_progress.length == 0"
                                class="py-10 text-center text-sm text-muted-foreground"
                            >
                                Aucune mission pour le moment
                            </div>
                            <div
                                v-else
                                class="mt-2 divide-y divide-border"
                            >
                                <div
                                    v-for="mission in dataReports.missions.in_progress"
                                    :key="mission.id"
                                    class="flex items-center gap-3 py-3"
                                >
                                    <span class="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-green-700/10 font-secondary text-sm font-bold text-green-700">
                                        {{ getInitials(mission.service.name) }}
                                    </span>
                                    <div class="min-w-0 flex-1">
                                        <p class="truncate text-sm font-semibold text-foreground">
                                            {{ mission.service.name || '-' }}
                                        </p>
                                        <p class="mt-0.5 truncate text-xs text-muted-foreground">
                                            {{ formatToDMY(mission.start_date) }} → {{ formatToDMY(mission.end_date) }} ·
                                            {{ formatTime(mission.time_start_at) }}–{{ formatTime(mission.time_end_at) }}
                                        </p>
                                    </div>
                                    <div class="shrink-0 text-right">
                                        <p class="truncate text-xs font-bold text-foreground">
                                            {{ mission.accepted_candidate.full_name }}
                                        </p>
                                        <p class="mt-0.5 text-[11px] text-muted-foreground">
                                            {{ formatRelativeDate(mission.created_at) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div class="rounded-2xl bg-card p-6 shadow-sm">
                    <h3 class="font-secondary text-lg font-semibold text-foreground">
                        Notifications
                    </h3>
                    <div v-if="dataReports?.notifications?.missions?.length == 0 && dataReports?.notifications?.timesheets?.length == 0">
                        <p class="py-16 text-center text-sm text-muted-foreground lg:py-0">
                            Aucune notification pour le moment
                        </p>
                    </div>
                    <div
                        v-else
                        class="mt-4 grid gap-3"
                    >
                        <div
                            v-for="notification in dataReports?.notifications?.missions"
                            :key="notification.id"
                            class="flex cursor-pointer items-center gap-3 rounded-xl bg-muted/60 p-3.5 transition hover:bg-muted"
                            @click="handleReadNotification(notification, 'mission')"
                        >
                            <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <UserPlus class="size-4" />
                            </span>
                            <div>
                                <p class="text-xs font-semibold text-foreground">
                                    Un nouveau candidat pour la mission #{{ notification.notifiable_id }}
                                </p>
                                <p class="mt-0.5 text-[11px] text-muted-foreground">
                                    {{ formatRelativeDate(notification.created_at) }} · Nouveau candidat
                                </p>
                            </div>
                        </div>
                        <div
                            v-for="notification in dataReports?.notifications?.timesheets"
                            :key="notification.mission_id"
                            class="flex cursor-pointer items-center gap-3 rounded-xl bg-muted/60 p-3.5 transition hover:bg-muted"
                            @click="handleReadNotification(notification, 'timesheet')"
                        >
                            <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <ClipboardList class="size-4" />
                            </span>
                            <div>
                                <p class="text-xs font-semibold text-foreground">
                                    Vous avez {{ notification.data.length > 1 ? `${notification.data.length} jours` : `${notification.data.length} jour` }} à valider pour la mission #{{ notification.mission_id }}
                                </p>
                                <p class="mt-0.5 text-[11px] text-muted-foreground">
                                    {{ formatRelativeDate(notification.data[0].created_at) }} · Feuille de temps
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { ClipboardCheck, ClipboardList, Clock, Receipt, UserPlus, UserSearch } from 'lucide-vue-next';
import { Skeleton } from '@/components/ui/skeleton';
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

const { reports, getReports, loading } = useReports();
const { markAsRead } = useNotifications();
const dataReports = computed(() => reports?.value);

const { pending } = useAsyncData('institution-dashboard-reports', () => getReports(), {
    server: false,
    lazy: true,
});

const activeTab = ref('open');
const handleTabChange = async (newTab: string) => {
    activeTab.value = newTab;
};

const getInitials = (name?: string | null) => (name ?? '').trim().slice(0, 2).toUpperCase() || '–';

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
