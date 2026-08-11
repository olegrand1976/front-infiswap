<template>
    <div class="space-y-6">
        <section
            aria-label="Statistiques remplacements"
            class="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
            <div class="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-white shadow-lg">
                <span class="mb-2 flex size-8 items-center justify-center rounded-lg bg-white/15">
                    <Send class="size-4" />
                </span>
                <p class="font-secondary text-2xl font-bold tabular-nums">
                    {{ reports?.me ?? 0 }}
                </p>
                <p class="mt-0.5 text-[11px] text-white/80">
                    Postés (mois)
                </p>
            </div>
            <div class="rounded-2xl bg-gradient-to-br from-green-700 to-green-800 p-4 text-white shadow-lg">
                <span class="mb-2 flex size-8 items-center justify-center rounded-lg bg-white/15">
                    <CheckCircle2 class="size-4" />
                </span>
                <p class="font-secondary text-2xl font-bold tabular-nums">
                    {{ reports?.accepted ?? 0 }}
                </p>
                <p class="mt-0.5 text-[11px] text-white/80">
                    Acceptés (mois)
                </p>
            </div>
            <div class="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-4 text-white shadow-lg">
                <span class="mb-2 flex size-8 items-center justify-center rounded-lg bg-white/15">
                    <MessageSquare class="size-4" />
                </span>
                <p class="font-secondary text-2xl font-bold tabular-nums">
                    {{ reports?.total ?? 0 }}
                </p>
                <p class="mt-0.5 text-[11px] text-white/80">
                    Réponses (mois)
                </p>
            </div>
            <div class="rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 p-4 text-white shadow-lg">
                <span class="mb-2 flex size-8 items-center justify-center rounded-lg bg-white/15">
                    <Users class="size-4" />
                </span>
                <p class="font-secondary text-2xl font-bold tabular-nums">
                    {{ reports?.referrals ?? 0 }}
                </p>
                <p class="mt-0.5 text-[11px] text-white/80">
                    Parrainages
                </p>
            </div>
        </section>

        <section class="grid items-center grid-cols-1 gap-4">
            <NurstechPresentation />

            <DashboardNurseQuickActions />
        </section>

        <section class="flex flex-col items-stretch w-full lg:flex-row gap-6">
            <div class="prefs-panel-tint w-full rounded-2xl border border-primary/15 shadow-sm lg:w-1/2">
                <div class="p-4 rounded">
                    <div class="flex items-center justify-between">
                        <h2 class="font-secondary text-base font-semibold text-foreground">
                            Mes préférences
                        </h2>
                        <button
                            variant="none"
                            class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary to-primary/80 px-3 py-1.5 text-xs font-bold text-primary-foreground"
                            @click="proposalDialog = true"
                        >
                            <Sparkles class="size-3" />
                            Boost IA
                        </button>
                    </div>

                    <p class="mt-2 text-sm text-muted-foreground">
                        Codes postaux et villes préférés, pour personnaliser vos résultats.
                    </p>

                    <div class="sm:mt-4 2xl:mt-6">
                        <InputPreferences
                            :initial-zip-codes="zipCodes"
                            :initial-cities="cities"
                            @update:initial-zip-codes="updateZipCodes"
                            @update:initial-cities="updateCities"
                            @open-proposal="openProposalDialog"
                        />
                    </div>

                    <ProposalLocationModal
                        v-model="proposalDialog"
                        v-model:newly-added-value="newlyAddedValue"
                        title="Préférences"
                        description="Sélectionnez uniquement les codes postaux/villes que vous souhaitez conserver parmi ceux déjà cochés pour l'encodage de vos préférences"
                        :initial-zip-codes="zipCodes"
                        :initial-cities="cities"
                        :is-preference-mode="true"
                        @update:initial-zip-codes="updateZipCodes"
                        @update:initial-cities="updateCities"
                    />

                    <div class="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                        <div>
                            <p class="text-sm font-semibold text-foreground">
                                Rayon de recherche
                            </p>
                            <p class="text-xs text-muted-foreground">
                                Autour de vos codes postaux préférés
                            </p>
                        </div>
                        <div class="flex shrink-0 items-center gap-3">
                            <button
                                type="button"
                                aria-label="Diminuer"
                                class="flex size-7 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-muted"
                                @click="decrementRadius"
                            >
                                −
                            </button>
                            <span class="font-secondary tabular-nums text-sm font-bold text-primary">
                                {{ radiusInput }} km
                            </span>
                            <button
                                type="button"
                                aria-label="Augmenter"
                                class="flex size-7 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-muted"
                                @click="incrementRadius"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-1/2 space-y-8">
                <div class="flex flex-col gap-3 rounded-2xl border border-accent-green/20 bg-accent-green/10 p-5 shadow-sm">
                    <h3 class="font-secondary text-sm font-semibold text-foreground">
                        Collègues inscrits via votre parrainage
                    </h3>
                    <p class="text-xs text-muted-foreground">
                        Partagez InfiSwap — plus le réseau grandit, plus vous trouvez de remplacements.
                    </p>

                    <div class="flex items-center gap-3">
                        <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-green to-accent-green-light text-white shadow-md">
                            <Users class="size-5" />
                        </span>
                        <div>
                            <p class="font-secondary text-2xl font-bold tabular-nums text-foreground">
                                {{ reports?.referrals ?? 0 }}
                            </p>
                            <p class="text-[11px] text-muted-foreground">
                                collègues inscrits
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 rounded-xl border border-input bg-background py-1 pl-3 pr-1">
                        <span class="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                            {{ referralShareUrl }}
                        </span>
                        <button
                            type="button"
                            class="flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-br from-accent-green to-accent-green-light px-3 py-2 text-xs font-bold text-white"
                            @click="copyReferralLink"
                        >
                            <Copy class="size-3" />
                            Copier
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <div class="overflow-hidden rounded-2xl bg-card shadow-sm">
            <h3 class="p-3 text-primary-foreground rounded-t-2xl bg-primary text-sm font-semibold">
                Annonces auxquelles j'ai répondu / mois
            </h3>
            <div v-if="loading">
                <Skeleton class="h-64 m-8 bg-muted" />
            </div>
            <div
                v-else
                class="p-4"
            >
                <ClientOnly>
                    <LineChart
                        :data="formattedData"
                        index="month"
                        :categories="['annonces']"
                        :colors="['var(--primary)']"
                        :y-formatter="(tick) => `${tick}`"
                    />
                </ClientOnly>
            </div>
        </div>
    </div>

    <Dialog v-model:open="configDialog">
        <DialogContent class="max-w-2xl h-[60vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class="text-xl text-primary">
                    Préférences de recherche
                </DialogTitle>
            </DialogHeader>

            <div class="space-y-6 mt-4">
                <div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">
                            Quel rayon de recherche préférez-vous ?
                        </label>

                        <InputIcon
                            v-model="formData.radiusKm"
                            :icon="Map"
                            class="w-full"
                            size="md"
                            :placeholder="'5 km'"
                        />

                        <label class="text-[0.65rem]"> Ce rayon s’applique aux recherches de remplacement autour de vos codes postaux préférés.</label>
                    </div>
                </div>

                <div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">
                            Quels sont vos préférences pour une remplacement ?
                        </label>

                        <div class="hidden lg:flex space-x-4">
                            <div class="flex-1">
                                <InputTagManager
                                    v-model="formData.zipCodesArray"
                                    :icon="Inbox"
                                    label="Codes postaux *"
                                    :placeholder="formData.zipCodesArray.length === 0 ? 'Codes postaux *' : 'Codes postaux *'"
                                    :is-mobile="false"
                                    :comma-validation="false"
                                    @keydown.enter.prevent
                                />
                            </div>

                            <div class="flex-1">
                                <InputTagManager
                                    v-model="formData.citiesArray"
                                    :icon="Building2"
                                    label="Villes associées"
                                    :placeholder="formData.citiesArray.length === 0 ? 'Villes' : 'Villes'"
                                    :is-mobile="false"
                                    :comma-validation="true"
                                    :no-space-validation="true"
                                    @keydown.enter.prevent
                                />
                            </div>
                        </div>
                        <div class="block lg:hidden">
                            <div class="flex-1">
                                <InputTagManager
                                    v-model="formData.zipCodesArray"
                                    :icon="Inbox"
                                    label="Codes postaux *"
                                    :placeholder="formData.zipCodesArray.length === 0 ? 'Codes postaux *' : 'Codes postaux *'"
                                    :is-mobile="true"
                                    :comma-validation="false"
                                    @keydown.enter.prevent
                                />
                            </div>

                            <div class="flex-1">
                                <InputTagManager
                                    v-model="formData.citiesArray"
                                    :icon="Building2"
                                    label="Villes"
                                    :placeholder="formData.citiesArray.length === 0 ? 'Villes' : 'Villes'"
                                    :is-mobile="true"
                                    :comma-validation="true"
                                    :no-space-validation="true"
                                    @keydown.enter.prevent
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">
                            Comment nous avez-vous connu ?
                        </label>

                        <div class="relative w-full">
                            <div class="pointer-events-none absolute top-2 left-2 flex items-center text-primary">
                                <CircleHelp class="w-6 h-6" />
                            </div>

                            <select
                                v-model="selectedReferral"
                                class="w-full appearance-none rounded-full border border-gray-300 py-2 px-4 pl-10 pr-10 text-sm bg-white text-gray-600"
                            >
                                <option
                                    disabled
                                    value=""
                                >
                                    Sélectionnez une option
                                </option>
                                <option
                                    v-for="option in referral_source"
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.label }}
                                </option>
                            </select>

                            <div class="pointer-events-none absolute top-3 right-3 flex items-center text-primary">
                                <svg
                                    class="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>

                        <InputIcon
                            v-if="formData.referralSource.startsWith('other:')"
                            :value="formData.referralSource.replace(/^other:/, '')"
                            placeholder="Veuillez préciser"
                            :icon="EllipsisHorizontalCircleIcon"
                            class="w-full"
                            @input="event => formData.referralSource = `other:${event.target.value}`"
                        />
                    </div>
                </div>
            </div>

            <DialogFooter class="my-6 flex flex-col items-center sm:flex-row gap-4 sm:space-x-4">
                <Button
                    variant="secondary"
                    class="w-full sm:w-auto"
                    @click="configDialog = false"
                >
                    <span class="mt-2">Annuler</span>
                </Button>
                <Button
                    class="w-full sm:w-auto"
                    @click="handleSetPreference"
                >
                    <span class="mt-2">Enregistrer</span>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Building2, CheckCircle2, CircleHelp, Copy, Inbox, Map, MessageSquare, Send, Sparkles, Users } from 'lucide-vue-next';
import { LineChart } from '@/components/ui/chart-line';
import InputPreferences from '@/components/InputPreferences.vue';
import InputTagManager from '~/components/InputTagManager.vue';
import type { UserSettings, Patient } from '~/lib/types';

type MonthlyReport = {
    month: string;
    count: number;
};

type NurseReport = {
    me: number;
    accepted: number;
    total: number;
    referrals: number;
    reponded_per_month: MonthlyReport[];
};

const props = defineProps<{
    reports: NurseReport;
    tours: Patient[];
}>();

const loading = ref(true);
const { updateRadiusKm, createPreferences, refresh } = useAuth();
const user = useUser();
const proposalDialog = ref(false);
const newlyAddedValue = ref<string>('');
const configDialog = ref(false);
const { $toast } = useNuxtApp();

const config = useRuntimeConfig();
const { trackEvent } = useProductAnalytics();

const referralShareUrl = computed(() =>
    `${config.public.FRONT_END_URL}/register/?referral=${user.value?.referral_code ?? ''}`,
);

function trackReferralCopy() {
    trackEvent('referral_dashboard_copy', { source: 'nurse_dashboard' });
}

async function copyReferralLink() {
    if (!import.meta.client) {
        return;
    }

    await navigator.clipboard.writeText(referralShareUrl.value);
    trackReferralCopy();
    $toast({ description: 'Lien copié avec succès' });
}

const arePreferencesEmpty = () => {
    if (!user.value?.settings) return true;

    try {
        const settings: UserSettings = JSON.parse(user.value.settings || '{}');

        const hasZipCodes = settings.replacement?.zip_codes?.filter(Boolean).length > 0;
        const hasCities = settings.replacement?.cities?.filter(Boolean).length > 0;
        const hasReferral = user.value.referral_source !== '';

        return !(hasZipCodes && hasCities && hasReferral);
    }
    catch {
        return true;
    }
};

const formatDate = (dateString: string) => {
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
};

const formattedData = computed(() => {
    if (!props.reports) return [];

    return props.reports.reponded_per_month.map(item => ({
        month: formatDate(item.month),
        annonces: item.count,
    }));
});

const radiusKm = computed(() => {
    const settings: UserSettings = JSON.parse(user.value.settings || '{}');
    return settings.radius_km ?? '5';
});

const radiusInput = ref(Number(radiusKm.value));

const onUpdateRadius = async () => {
    await updateRadiusKm(radiusInput.value);
};

const decrementRadius = async () => {
    radiusInput.value = Math.max(1, radiusInput.value - 1);
    await onUpdateRadius();
};

const incrementRadius = async () => {
    radiusInput.value += 1;
    await onUpdateRadius();
};

const zipCodes = ref<string[]>([]);
const cities = ref<string[]>([]);

const updateFromSettings = () => {
    const settings: UserSettings = JSON.parse(user.value.settings || '{}');
    zipCodes.value = settings.replacement?.zip_codes?.filter(zip => zip) ?? [];
    cities.value = settings.replacement?.cities?.filter(city => city) ?? [];
};

updateFromSettings();

watch(
    () => user.value.settings,
    () => {
        updateFromSettings();
    },
    { deep: true },
);

const updateZipCodes = async (newZipCodes: string[]) => {
    zipCodes.value = newZipCodes.filter(zip => zip);
    await nextTick();
};

const updateCities = async (newCities: string[]) => {
    cities.value = newCities.filter(city => city);
    await nextTick();
};

const openProposalDialog = (value: string) => {
    newlyAddedValue.value = value;
    proposalDialog.value = true;
};

const previousMonth = ref('');

const currentDate = new Date();
const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const currentMonthIndex = currentDate.getMonth();
const previousMonthIndex = (currentMonthIndex - 1 + 12) % 12;
previousMonth.value = months[previousMonthIndex];

const referral_source = [
    {
        label: 'Publicité Facebook',
        value: 'facebook_ads',
    },
    {
        label: 'Post page Infiswap',
        value: 'infiswap_post',
    },
    {
        label: 'Communication forum infirmière',
        value: 'nurse_forum',
    },
    {
        label: 'Moteur de recherche',
        value: 'search_engine',
    },
    {
        label: 'Bouche à oreille',
        value: 'word_of_mouth',
    },
    {
        label: 'Autres',
        value: 'other:',
    },
];

const selectedReferral = computed({
    get() {
        return formData.referralSource.startsWith('other:') ? 'other:' : formData.referralSource;
    },
    set(val) {
        formData.referralSource = val;
    },
});

const formData = reactive({
    referralSource: user.value.referral_source ?? '',
    zipCodesArray: [],
    citiesArray: [],
    radiusKm: '',
});

const prefsDialogRequest = useState('nursePrefsDialogRequest', () => 0);

watch(prefsDialogRequest, () => {
    configDialog.value = true;
});

watch(configDialog, (isOpen) => {
    if (isOpen) {
        const settings = user.value?.settings ? JSON.parse(user.value.settings) : {};
        formData.zipCodesArray = settings.replacement?.zip_codes || [];
        formData.citiesArray = settings.replacement?.cities || [];
        formData.radiusKm = settings.radius_km || 5;
        formData.referralSource = user.value.referral_source || '';
    }
});

const handleSetPreference = async () => {
    try {
        if (formData.referralSource) {
            await useAuth().updateField(user.value.id, { referral_source: formData.referralSource });
        }

        await createPreferences({
            key: 'replacement',
            value: {
                zip_codes: formData.zipCodesArray,
                cities: formData.citiesArray,
            },
        });

        await updateRadiusKm(Number(formData.radiusKm));
        await refresh();

        zipCodes.value = [...formData.zipCodesArray];
        cities.value = [...formData.citiesArray];

        $toast({ description: 'Préférences enregistrées avec succès' });
        configDialog.value = false;
    }
    catch {
        $toast({ variant: 'destructive', description: 'Erreur lors de l’enregistrement' });
    }
};

onMounted(() => {
    loading.value = false;
});
</script>

<style scoped>
.carousel-container {
    max-width: 100%;
    overflow: hidden;
}
.relative {
    padding-bottom: 20px;
}

/* Fond du panneau "Mes préférences" — dégradé qui s'estompe vers la carte,
   même recette que la maquette. En CSS brute (comme .home-hero__mesh dans
   NewBanner.vue) car color-mix()/oklch imbriqués dans une valeur arbitraire
   Tailwind ne se résolvaient pas correctement. */
.prefs-panel-tint {
    background: linear-gradient(160deg, color-mix(in oklch, var(--primary) 9%, var(--card)), var(--card) 65%);
}
</style>
