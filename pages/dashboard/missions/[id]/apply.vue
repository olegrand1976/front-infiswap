<template>
    <div class="lg:ml-20 xl:ml-0">
        <ArrowLeftIcon
            class="size-6 cursor-pointer hover:text-primary"
            title="Retour"
            @click="goBack"
        />

        <div class="mt-6 flex items-center justify-between w-full">
            <h1 class="flex w-full py-3 rounded-lg text-primary sm:bg-gray-100 sm:px-9">
                Postuler à la<span class="ml-1 font-semibold"> mission</span>
            </h1>
        </div>

        <div class="mt-8 2xl:mt-12 grid lg:grid-cols-3 gap-8 2xl:gap-12">
            <div class="rounded-b-lg lg:col-span-1 border border-gray-100 bg-white pb-6 shadow transition hover:shadow-lg hover:border-gray-200">
                <div class="bg-primary py-4 px-4 rounded-t-lg">
                    <h2 class="text-lg font-semibold text-white">
                        Offre #{{ mission.id }}
                    </h2>
                </div>

                <div class="flex items-start justify-between pt-6 px-6">
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
                                {{ mission.institution?.institution_name.charAt(0).toUpperCase() }}
                            </div>
                        </div>

                        <div>
                            <h2 class="text-sm font-semibold text-gray-900">
                                {{ mission.institution?.institution_name }}
                            </h2>
                            <p class="text-xs text-gray-500">
                                Publié {{ formatRelativeDate(mission.created_at) }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mt-6 px-6 flex items-center gap-2 text-xs text-gray-500">
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

                <div class="mt-10">
                    <p
                        class="px-6 text-sm leading-relaxed text-gray-700"
                        :class="!isExpanded ? 'line-clamp-6': ''"
                    >
                        {{ mission.service }}
                    </p>
                    <button
                        class="px-6 mt-2 text-sm text-primary font-semibold hover:underline focus:outline-none"
                        @click="toggleExpand"
                    >
                        {{ isExpanded ? 'Voir moins' : 'Voir plus' }}
                    </button>
                </div>
            </div>

            <form
                class="block lg:col-span-2"
                @submit.prevent="submit"
            >
                <div>
                    <label class="font-semibold text-sm text-primary">
                        Décrivez votre motivation pour cette mission
                    </label>
                    <Textarea
                        v-model="formData.description"
                        :rows="14"
                        placeholder="Écrivez ici..."
                        class="mt-2 w-full border-2 border-gray-300 rounded-lg focus-within:border-primary transition"
                    />
                </div>

                <p class="mt-8 flex items-center gap-1 text-xs text-gray-500">
                    <InformationCircleIcon class="w-4" />
                    <span>
                        Votre candidature sera envoyée à l'institution qui a publié cette mission.
                    </span>
                </p>

                <div class="mt-12 flex justify-center items-center">
                    <Button
                        type="submit"
                        class="lg:w-72"
                        :in-progress="inProgress"
                    >
                        Envoyer ma candidature
                    </Button>
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
import { AcademicCapIcon, ArrowLeftIcon, CalendarIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
import { formatRelativeDate, formatToDMY } from '~/composables/useDate';
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
await getById(Number(id.value)).then((response) => {
    mission.value = response.data;
});

const isExpanded = ref(false);

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
};

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
