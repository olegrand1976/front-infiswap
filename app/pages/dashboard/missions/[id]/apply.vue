<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="mt-4 flex items-center justify-between w-full">
            <div class="flex items-center gap-2 w-full py-3 rounded-lg text-primary sm:bg-gray-100 sm:px-4">
                <ArrowLeft
                    class="size-5 cursor-pointer hover:text-primary"
                    title="Retour"
                    @click="goBack"
                />
                Postuler à la<span class="ml-1 font-semibold"> mission</span>
            </div>
        </div>

        <div class="mt-8 grid lg:grid-cols-12 gap-8 2xl:gap-10 items-start">
            <div class="lg:col-span-5 flex flex-col gap-6">
                <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <!-- Header -->
                    <div class="p-5 sm:p-6 bg-linear-to-r from-primary/10 to-transparent flex items-start justify-between border-b border-gray-50">
                        <div class="flex items-center gap-4">
                            <div class="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
                                <img
                                    v-if="institutionLogoUrl"
                                    :src="institutionLogoUrl"
                                    class="w-full h-full object-cover"
                                >
                                <span
                                    v-else
                                    class="text-primary font-bold text-lg"
                                >
                                    {{ mission.institution?.institution_name?.charAt(0).toUpperCase() }}
                                </span>
                            </div>
                            <div>
                                <h2 class="text-base sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                                    {{ mission.institution?.institution_name }}
                                </h2>
                                <p class="text-[11px] sm:text-xs text-gray-500 mt-1 font-medium">
                                    Mission #{{ mission.id }} • Publiée {{ formatRelativeDate(mission.created_at) }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 sm:p-6 flex flex-col gap-6">
                        <p class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/70">
                            Informations clés
                        </p>

                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <Calendar class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                            </div>
                            <div class="flex flex-col">
                                <span class="text-[11px] sm:text-xs text-gray-400 font-medium">Période</span>
                                <span class="text-sm font-semibold text-gray-800 mt-0.5">
                                    {{ formatToDMY(mission.start_date) }} <span
                                        v-if="mission.end_date"
                                        class="text-gray-400 mx-0.5"
                                    >→</span> <span v-if="mission.end_date">{{ formatToDMY(mission.end_date) }}</span>
                                </span>
                                <span
                                    v-if="mission.days_per_month"
                                    class="text-[11px] sm:text-xs font-semibold text-blue-600 mt-1.5 bg-blue-50/80 px-2.5 py-0.5 rounded-full w-fit"
                                >
                                    {{ mission.days_per_month }} jours / mois
                                </span>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                <Clock class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                            </div>
                            <div class="flex flex-col w-full">
                                <span class="text-[11px] sm:text-xs text-gray-400 font-medium">{{ mission.is_long_term ? 'Disponibilités (long terme)' : 'Horaires' }}</span>
                                <div
                                    v-if="mission.is_long_term && mission.availabilities && mission.availabilities.length > 0"
                                    class="flex flex-col gap-2 mt-2"
                                >
                                    <div
                                        v-for="(av, i) in mission.availabilities"
                                        :key="i"
                                        class="bg-gray-50/80 border border-gray-100 rounded-lg p-2.5 text-sm"
                                    >
                                        <p class="font-bold text-gray-700 mb-1 border-b border-gray-200/60 pb-1">
                                            {{ av.day }}
                                        </p>
                                        <div class="flex flex-col gap-0.5 text-xs text-gray-600 font-medium">
                                            <span v-if="av.morning_start_at">Matin : {{ formatTime(av.morning_start_at) }} → {{ formatTime(av.morning_end_at) }}</span>
                                            <span v-if="av.afternoon_start_at">A-M : {{ formatTime(av.afternoon_start_at) }} → {{ formatTime(av.afternoon_end_at) }}</span>
                                            <span v-if="!av.morning_start_at && !av.afternoon_start_at && av.start_time">{{ formatTime(av.start_time) }} → {{ formatTime(av.end_time) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-else-if="mission.morning_start_at || mission.afternoon_start_at"
                                    class="flex flex-col gap-1 mt-1 text-sm font-semibold text-gray-800"
                                >
                                    <span v-if="mission.morning_start_at && mission.morning_end_at">Matin : {{ formatTime(mission.morning_start_at) }} <span class="text-gray-300 mx-0.5">→</span> {{ formatTime(mission.morning_end_at) }}</span>
                                    <span v-if="mission.afternoon_start_at && mission.afternoon_end_at">Après-midi : {{ formatTime(mission.afternoon_start_at) }} <span class="text-gray-300 mx-0.5">→</span> {{ formatTime(mission.afternoon_end_at) }}</span>
                                </div>
                                <span
                                    v-else-if="mission.time_start_at"
                                    class="text-sm font-semibold text-gray-800 mt-1"
                                >
                                    {{ formatTime(mission.time_start_at) }} <span class="text-gray-300 mx-0.5">→</span> {{ formatTime(mission.time_end_at) }}
                                </span>
                                <span
                                    v-else
                                    class="text-sm font-semibold text-gray-800 mt-1"
                                >Non défini</span>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 sm:gap-4">
                            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                                <GraduationCap class="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                            </div>
                            <div class="flex flex-col">
                                <span class="text-[11px] sm:text-xs text-gray-400 font-medium">Diplôme requis</span>
                                <span class="text-sm font-semibold text-gray-800 mt-0.5">{{ mission.required_diploma }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 transition-all hover:shadow-md">
                    <p class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-4">
                        <FileText class="w-4 h-4" /> Description globale
                    </p>
                    <div class="text-[13px] sm:text-sm text-gray-600 leading-relaxed whitespace-pre-wrap max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {{ mission.description }}
                    </div>
                </div>
            </div>

            <form
                class="lg:col-span-7 flex flex-col h-full"
                @submit.prevent="submit"
            >
                <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-8 flex-1 flex flex-col transition-all hover:shadow-md">
                    <div class="mb-6">
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900">
                            Pourquoi êtes-vous le ou la candidat(e) idéal(e) ?
                        </h3>
                        <p class="text-[13px] sm:text-sm text-gray-500 mt-2 leading-relaxed">
                            Expliquez vos motivations et mettez en avant vos compétences pour cette mission. Ce texte sera lu par l'institution afin d'évaluer votre profil.
                        </p>
                    </div>

                    <Textarea
                        v-model="formData.description"
                        class="flex-1 min-h-[250px] lg:min-h-[350px] w-full border-2 border-gray-200 rounded-xl focus-within:border-primary transition-colors text-[13px] sm:text-sm leading-relaxed p-4 sm:p-5 resize-none bg-gray-50/50"
                        placeholder="Bonjour, je suis très intéressé(e) par cette offre car..."
                    />

                    <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="flex items-center gap-2 text-[11px] sm:text-xs text-gray-400 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 w-full sm:w-auto justify-center">
                            <Info class="w-4 h-4 text-primary shrink-0" />
                            Candidature confidentielle et sécurisée
                        </div>
                        <Button
                            type="submit"
                            class="w-full cursor-pointer sm:w-auto text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                            :in-progress="inProgress"
                        >
                            Envoyer la candidature
                        </Button>
                    </div>
                </div>
            </form>
        </div>

        <Dialog v-model:open="openDialog">
            <DialogContent class="max-w-md p-6 rounded-lg">
                <DialogTitle class="text-lg font-semibold text-gray-900">
                    Candidature envoyée
                </DialogTitle>

                <DialogDescription class="mt-4 text-sm text-gray-600">
                    Votre candidature a été envoyée avec succès. L'institution vous contactera si votre profil correspond à leurs besoins.
                </DialogDescription>

                <div class="mt-6 flex justify-end">
                    <Button @click="handleCloseDialog">
                        Fermer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, Calendar, Clock, FileText, GraduationCap, Info, Star } from 'lucide-vue-next';

import { formatRelativeDate, formatTime, formatToDMY } from '~/composables/useDate';
import type { Mission, User } from '~/lib/types';
import { goBack } from '~/lib/utils';

useHead({
    title: 'Postuler - mission',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

const user = useState<User>('user');
const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();
const mission = ref<Mission>(null);
const id = computed(() => route.params.id);
const openDialog = ref(false);

const { getById } = useMissions();
const { apply } = useMissionResponses();
const { getLogoUrl } = useInstitutions();

await getById(Number(id.value)).then((response) => {
    mission.value = response.data;
});

const institutionLogoUrl = computed(() => {
    const institution = mission.value?.institution as any;
    if (!institution) return null;

    const logo = institution.logo || institution.profil_url;
    if (!logo) return null;

    if (typeof logo === 'string' && (logo.startsWith('http://') || logo.startsWith('https://'))) {
        return logo;
    }

    return getLogoUrl(logo);
});

const formData = reactive({
    mission_id: mission.value?.id || null,
    responded_by: user.value?.id || null,
    description: '',
});

const { submit, inProgress } = useSubmit(async () => {
    formData.mission_id = mission.value?.id || null;
    formData.responded_by = user.value?.id || null;

    try {
        const response = await apply(formData);

        if (response.data) {
            formData.description = '';
            openDialog.value = true;
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
});

const handleCloseDialog = () => {
    openDialog.value = false;
    router.push('/dashboard/missions');
};
</script>
