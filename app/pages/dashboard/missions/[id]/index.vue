<template>
    <div class="lg:ml-20 xl:ml-0 pb-24">
        <div class="mt-6 flex items-center gap-2 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
            <ArrowLeftIcon
                class="size-5 cursor-pointer hover:text-primary"
                title="Retour"
                @click="goBack"
            />
            <h1 class="py-3 text-primary font-bold">
                <strong>Détail de la mission</strong>
            </h1>
        </div>

        <div
            v-if="loading"
            class="mt-32 flex flex-col items-center gap-3 text-gray-400"
        >
            <ArrowPathIcon class="w-6 h-6 animate-spin text-primary" />
            <p class="text-sm">
                Chargement...
            </p>
        </div>

        <template v-else-if="mission">
            <div class="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-7 mb-6 flex items-start justify-between gap-6">
                <div class="flex items-center gap-5 min-w-0">
                    <div class="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                        <img
                            v-if="mission.institution?.profil_url"
                            :src="mission.institution.profil_url"
                            class="w-full h-full object-cover"
                            :alt="mission.institution.institution_name ?? 'Institution'"
                        >
                        <span
                            v-else
                            class="text-primary font-bold text-lg"
                        >
                            {{ mission.institution?.institution_name?.charAt(0).toUpperCase() }}
                        </span>
                    </div>
                    <div class="min-w-0">
                        <p class="font-semibold text-gray-900 truncate">
                            {{ mission.institution?.institution_name }}
                        </p>
                        <p class="text-xs text-gray-400 mt-1">
                            Publiée {{ formatRelativeDate(mission.created_at) }}
                        </p>
                    </div>
                </div>
                <span
                    class="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full mt-1"
                    :class="statusBadgeClass"
                >
                    {{ statusText }}
                </span>
            </div>

            <div class="grid lg:grid-cols-12 gap-5">
                <div class="lg:col-span-4 space-y-5">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
                            Informations
                        </p>
                        <div class="space-y-4">
                            <div class="flex items-start gap-3.5">
                                <div class="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <CalendarIcon class="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p class="text-[11px] text-gray-400 font-medium">
                                        Période
                                    </p>
                                    <p class="text-sm font-semibold text-gray-800 mt-0.5">
                                        {{ formatToDMY(mission.start_date) }} → {{ formatToDMY(mission.end_date) }}
                                    </p>
                                    <p
                                        v-if="mission.days_per_month"
                                        class="text-sm font-semibold text-primary mt-1"
                                    >
                                        {{ mission.days_per_month }} jours / mois
                                    </p>
                                </div>
                            </div>

                            <div class="h-px bg-gray-50" />

                            <div class="flex items-start gap-3.5">
                                <div class="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <ClockIcon class="w-4 h-4 text-gray-500" />
                                </div>
                                <div class="w-full">
                                    <p class="text-[11px] text-gray-400 font-medium">
                                        {{ mission.is_long_term ? 'Disponibilités (long terme)' : 'Horaires' }}
                                    </p>
                                    <div
                                        v-if="mission.is_long_term && mission.availabilities && mission.availabilities.length > 0"
                                        class="mt-2 flex flex-col gap-1.5"
                                    >
                                        <div
                                            v-for="(avail, idx) in mission.availabilities"
                                            :key="idx"
                                            class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-100 rounded px-2.5 py-1.5 w-fit"
                                        >
                                            <span class="w-16">{{ avail.day }} :</span>
                                            <div class="flex flex-wrap gap-x-4 gap-y-1">
                                                <span v-if="avail.morning_start_at">Matin : {{ formatTime(avail.morning_start_at) }} – {{ formatTime(avail.morning_end_at) }}</span>
                                                <span v-if="avail.afternoon_start_at">A-M : {{ formatTime(avail.afternoon_start_at) }} – {{ formatTime(avail.afternoon_end_at) }}</span>
                                                <span v-if="!avail.morning_start_at && !avail.afternoon_start_at && avail.start_time">{{ formatTime(avail.start_time) }} – {{ formatTime(avail.end_time) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        v-else-if="mission.morning_start_at || mission.afternoon_start_at"
                                        class="mt-1.5 flex flex-col gap-1"
                                    >
                                        <p
                                            v-if="mission.morning_start_at && mission.morning_end_at"
                                            class="text-sm font-semibold text-gray-800"
                                        >
                                            Matin : {{ formatTime(mission.morning_start_at) }} <span class="mx-0.5 text-gray-400">→</span> {{ formatTime(mission.morning_end_at) }}
                                        </p>
                                        <p
                                            v-if="mission.afternoon_start_at && mission.afternoon_end_at"
                                            class="text-sm font-semibold text-gray-800"
                                        >
                                            Après-midi : {{ formatTime(mission.afternoon_start_at) }} <span class="mx-0.5 text-gray-400">→</span> {{ formatTime(mission.afternoon_end_at) }}
                                        </p>
                                    </div>
                                    <p
                                        v-else
                                        class="text-sm font-semibold text-gray-800 mt-1"
                                    >
                                        {{ mission.time_start_at ? `${formatTime(mission.time_start_at)} – ${formatTime(mission.time_end_at ?? '')}` : 'Non défini' }}
                                    </p>
                                </div>
                            </div>

                            <div class="h-px bg-gray-50" />

                            <div class="flex items-start gap-3.5">
                                <div class="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <AcademicCapIcon class="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p class="text-[11px] text-gray-400 font-medium">
                                        Diplôme requis
                                    </p>
                                    <p class="text-sm font-semibold text-gray-800 mt-0.5">
                                        {{ mission.required_diploma || 'Non spécifié' }}
                                    </p>
                                </div>
                            </div>

                            <template v-if="mission.service?.name">
                                <div class="h-px bg-gray-50" />
                                <div class="flex items-start gap-3.5">
                                    <div class="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <BuildingOfficeIcon class="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <p class="text-[11px] text-gray-400 font-medium">
                                            Service
                                        </p>
                                        <p class="text-sm font-semibold text-gray-800 mt-0.5">
                                            {{ mission.service.name }}
                                        </p>
                                    </div>
                                </div>
                            </template>

                            <template v-if="missionDuration !== '—'">
                                <div class="h-px bg-gray-50" />
                                <div class="flex items-start gap-3.5">
                                    <div class="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <ClockIcon class="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <p class="text-[11px] text-gray-400 font-medium">
                                            Durée
                                        </p>
                                        <p class="text-sm font-semibold text-gray-800 mt-0.5">
                                            {{ missionDuration }} jours
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <div v-if="mission.status === 'open' && !alreadyApplied">
                        <NuxtLink :href="`/dashboard/missions/${mission.id}/apply`">
                            <button class="w-full h-12 rounded-2xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity">
                                Postuler à cette mission
                                <ChevronRightIcon class="w-4 h-4" />
                            </button>
                        </NuxtLink>
                    </div>

                    <div
                        v-else-if="alreadyApplied"
                        class="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center"
                    >
                        <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                            <svg
                                class="w-4 h-4 text-emerald-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2.5"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>
                        </div>
                        <p class="text-emerald-800 text-sm font-semibold">
                            Candidature envoyée
                        </p>
                        <p class="text-emerald-500 text-xs mt-1">
                            Vous avez déjà postulé à cette mission
                        </p>
                    </div>

                    <div
                        v-else
                        class="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center"
                    >
                        <p class="text-gray-400 text-sm font-medium">
                            Mission fermée
                        </p>
                    </div>
                </div>

                <div class="lg:col-span-8 space-y-5">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
                            Description
                        </p>
                        <p class="text-[14.5px] text-gray-600 leading-[1.85] whitespace-pre-wrap">
                            {{ mission.description }}
                        </p>
                    </div>

                    <div
                        v-if="mission.periods?.length"
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
                    >
                        <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-5">
                            Périodes disponibles
                        </p>
                        <div class="grid sm:grid-cols-2 gap-2.5">
                            <div
                                v-for="(p, i) in mission.periods"
                                :key="i"
                                class="flex items-center gap-3 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100/60 transition rounded-xl px-4 py-3"
                            >
                                <span class="w-6 h-6 rounded-lg bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {{ i + 1 }}
                                </span>
                                <span class="text-sm text-gray-700 font-medium">
                                    {{ formatToDMY(p.start_date) }} → {{ formatToDMY(p.end_date) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div
            v-else
            class="mt-32 text-center text-gray-400"
        >
            <p class="text-sm">
                Mission introuvable.
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    CalendarIcon,
    ClockIcon,
    AcademicCapIcon,
    BuildingOfficeIcon,
    ChevronRightIcon,
} from '@heroicons/vue/24/outline';
import type { Mission } from '~/lib/types';
import { goBack } from '~/lib/utils';

useHead({ title: 'Détail mission' });
definePageMeta({ layout: 'dashboard', middleware: ['auth', 'verified'] });

const route = useRoute();
const mission = ref<Mission | null>(null);
const loading = ref(true);
const alreadyApplied = ref(false);

const { getById } = useMissions();
const { getAll: getCandidacy, responses } = useMissionResponses();

onMounted(async () => {
    try {
        const [res] = await Promise.all([
            getById(Number(route.params.id)),
            getCandidacy(1, 100, { type: 'nurse' }),
        ]);
        mission.value = res.data;
        alreadyApplied.value = (responses.value?.data ?? []).some(
            (r: { mission_id: number }) => r.mission_id === mission.value?.id,
        );
    }
    catch (e) {
        console.error(e);
    }
    finally {
        loading.value = false;
    }
});

function formatToDMY(d?: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatTime(t?: string): string {
    return t?.substring(0, 5) ?? '';
}

function formatRelativeDate(d?: string): string {
    if (!d) return '';
    const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'il y a quelques secondes';
    if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
    if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
    return `il y a ${Math.floor(s / 86400)} j`;
}

const STATUS_LABELS: Record<string, string> = {
    open: 'Ouverte',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
    open: 'bg-emerald-50 text-emerald-700',
    in_progress: 'bg-blue-50 text-blue-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-50 text-red-600',
};

const missionDuration = computed((): string => {
    if (!mission.value?.start_date || !mission.value?.end_date) return '—';
    const diff = Math.ceil(
        (new Date(mission.value.end_date).getTime() - new Date(mission.value.start_date).getTime()) / 86_400_000,
    );
    return diff > 0 ? String(diff) : '—';
});

const statusText = computed((): string =>
    STATUS_LABELS[mission.value?.status ?? ''] ?? 'Ouverte',
);

const statusBadgeClass = computed((): string =>
    STATUS_BADGE_CLASSES[mission.value?.status ?? ''] ?? 'bg-emerald-50 text-emerald-700',
);
</script>
