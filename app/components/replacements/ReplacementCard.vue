<template>
    <div class="bg-gradient-to-br from-white to-gray-50 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 p-4 space-y-3 border border-gray-100 hover:border-primary/20 group relative">
        <div
            v-if="isNew"
            class="absolute -top-2 left-2 z-10 bg-primarytech text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm tracking-wide uppercase"
        >
            New
        </div>
        <div class="flex justify-between items-start">
            <div class="flex-1 flex items-center gap-2">
                <div
                    v-if="replacement.institution || rawReplacement?.institution || rawReplacement?.user?.institution"
                    class="flex items-center gap-2"
                >
                    <div
                        v-if="institutionLogoUrl"
                        class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0"
                    >
                        <img
                            :src="institutionLogoUrl"
                            :alt="institutionName"
                            class="max-w-full max-h-full object-contain"
                        >
                    </div>
                    <span
                        v-else-if="institutionName"
                        class="text-xs font-medium text-gray-600"
                    >
                        {{ institutionName }}
                    </span>
                </div>
            </div>

            <span
                class="px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ml-3"
                :class="statusBadgeClass"
            >
                {{ statusText }}
            </span>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <!-- Périodes -->
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs">
                    <span class="text-base">📅</span>
                    <span>Périodes</span>
                </p>
                <div class="text-gray-600">
                    <p v-if="displayedPeriods.length > 0">
                        {{ displayedPeriods[0] }}
                    </p>
                    <button
                        v-if="periods.length > 1"
                        class="text-primary hover:text-primary/80 font-medium text-xs mt-1 flex items-center gap-1"
                        @click="showAllPeriods = !showAllPeriods"
                    >
                        {{ showAllPeriods ? 'Masquer' : `+${periods.length - 1} autres` }}
                        <ChevronDown
                            class="w-3 h-3 transition-transform"
                            :class="{ 'rotate-180': showAllPeriods }"
                        />
                    </button>
                    <div
                        v-if="showAllPeriods && periods.length > 1"
                        class="mt-2 space-y-1"
                    >
                        <p
                            v-for="(period, index) in periods.slice(1)"
                            :key="index"
                            class="text-gray-600 text-xs"
                        >
                            {{ period }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Codes postaux -->
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs">
                    <span class="text-base">📮</span>
                    <span>C . P</span>
                </p>
                <div class="text-gray-600">
                    <p v-if="displayedZipCodes.length > 0">
                        {{ displayedZipCodes[0] }}
                    </p>
                    <button
                        v-if="zipCodes.length > 1"
                        class="text-primary hover:text-primary/80 font-medium text-xs mt-1 flex items-center gap-1"
                        @click="showAllZipCodes = !showAllZipCodes"
                    >
                        {{ showAllZipCodes ? 'Masquer' : `+${zipCodes.length - 1} autres` }}
                        <ChevronDown
                            class="w-3 h-3 transition-transform"
                            :class="{ 'rotate-180': showAllZipCodes }"
                        />
                    </button>
                    <div
                        v-if="showAllZipCodes && zipCodes.length > 1"
                        class="mt-2 space-y-1"
                    >
                        <p
                            v-for="(zipCode, index) in zipCodes.slice(1)"
                            :key="index"
                            class="text-gray-600 text-xs"
                        >
                            {{ zipCode }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Villes -->
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs">
                    <span class="text-base">🏙️</span>
                    <span>Villes</span>
                </p>
                <div class="text-gray-600">
                    <p v-if="displayedCities.length > 0">
                        {{ displayedCities[0] }}
                    </p>
                    <button
                        v-if="cities.length > 1"
                        class="text-primary hover:text-primary/80 font-medium text-xs mt-1 flex items-center gap-1"
                        @click="showAllCities = !showAllCities"
                    >
                        {{ showAllCities ? 'Masquer' : `+${cities.length - 1} autres` }}
                        <ChevronDown
                            class="w-3 h-3 transition-transform"
                            :class="{ 'rotate-180': showAllCities }"
                        />
                    </button>
                    <div
                        v-if="showAllCities && cities.length > 1"
                        class="mt-2 space-y-1"
                    >
                        <p
                            v-for="(city, index) in cities.slice(1)"
                            :key="index"
                            class="text-gray-600 text-xs"
                        >
                            {{ city }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Types de soins -->
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs">
                    <span class="text-base">🩺</span>
                    <span>Soins</span>
                </p>
                <div class="text-gray-600">
                    <p v-if="displayedCareTypes.length > 0">
                        {{ displayedCareTypes[0] }}
                    </p>
                    <button
                        v-if="careTypes.length > 1"
                        class="text-primary hover:text-primary/80 font-medium text-xs mt-1 flex items-center gap-1"
                        @click="showAllCareTypes = !showAllCareTypes"
                    >
                        {{ showAllCareTypes ? 'Masquer' : `+${careTypes.length - 1} autres` }}
                        <ChevronDown
                            class="w-3 h-3 transition-transform"
                            :class="{ 'rotate-180': showAllCareTypes }"
                        />
                    </button>
                    <div
                        v-if="showAllCareTypes && careTypes.length > 1"
                        class="mt-2 space-y-1"
                    >
                        <p
                            v-for="(careType, index) in careTypes.slice(1)"
                            :key="index"
                            class="text-gray-600 text-xs"
                        >
                            {{ careType }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <p
            v-if="replacement.comment"
            class="text-xs text-gray-600 line-clamp-2"
        >
            {{ replacement.comment }}
        </p>

        <div>
            <span
                v-if="replacement.replacement_type"
                class="px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap"
                :class="replacementTypeBadgeClass"
            >
                {{ replacementTypeLabel }}
            </span>
        </div>
        <div class="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2 text-xs text-gray-600 font-bold flex-1 min-w-0">
                <div class="flex items-center gap-1">
                    <Clock class="w-3.5 h-3.5 text-primary shrink-0" />
                    <span class="truncate">{{ timeSlotsText }}</span>
                </div>
                <div
                    v-if="replacement.patient_count"
                    class="flex items-center gap-1 shrink-0"
                >
                    <Users class="w-3.5 h-3.5 text-primary" />
                    <span>{{ replacement.patient_count }} patient(s)/jour</span>
                </div>
            </div>

            <template v-if="!isOwner">
                <div class="flex items-center gap-2 shrink-0">
                    <ReplacementBoostTrustBadge
                        v-if="isBoosted"
                        variant="visitor"
                        compact
                    />
                    <Button
                        size="sm"
                        :href="`/dashboard/replacements/detail/${replacement.id}`"
                        class="shrink-0 gap-1.5"
                    >
                        <span>Voir détail</span>
                        <ChevronRight class="w-3.5 h-3.5" />
                    </Button>
                </div>
            </template>

            <template v-else>
                <div class="flex items-center gap-2 shrink-0">
                    <ReplacementBoostButton
                        v-if="showBoostAction && !isBoosted"
                        variant="card"
                        @boost="openBoostPreview()"
                    />
                    <ReplacementBoostStars
                        v-else-if="isBoosted"
                        clickable
                        @click="openBoostActive()"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button
                                size="sm"
                                variant="outline"
                                class="shrink-0 w-9 h-9 p-0 border-gray-300 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                            >
                                <Ellipsis class="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        class="w-48"
                    >
                        <DropdownMenuLabel class="text-gray-400 font-semibold px-2 py-1.5">
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem as-child>
                            <NuxtLink
                                :href="`/dashboard/replacements/detail/${replacement.id}`"
                                class="flex items-center gap-2 text-sm cursor-pointer"
                            >
                                <Eye class="w-4 h-4 text-gray-500" />
                                <span>Voir le détail</span>
                            </NuxtLink>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            class="flex items-center gap-2 text-sm cursor-pointer"
                            @click="emit('open-edit', props.rawReplacement ?? replacement)"
                        >
                            <SquarePen class="w-4 h-4 text-gray-500" />
                            <span>Modifier</span>
                        </DropdownMenuItem>
                        <template v-if="canClose">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                class="flex items-center gap-2 text-sm text-primary hover:text-primary/90 focus:text-primary cursor-pointer"
                                @click="closeDialog = true"
                            >
                                <Lock class="w-4 h-4" />
                                <span>Fermer</span>
                            </DropdownMenuItem>
                        </template>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </template>
        </div>

        <ReplacementBoostModal
            v-model:open="boostModalOpen"
            :replacement="boostModalReplacement"
            @cancelled="onBoostCancelled"
        />

        <Dialog v-model:open="closeDialog">
            <DialogContent class="sm:max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Fermer le remplacement</DialogTitle>
                    <DialogDescription class="mt-3 mb-6">
                        Êtes-vous sûr de vouloir fermer ce remplacement ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <div class="mt-4 sm:mt-8 flex justify-center sm:justify-end space-x-6 items-center">
                    <Button
                        variant="secondary"
                        class="bg-gray-200 hover:bg-gray-300 px-8"
                        @click="closeDialog = false"
                    >
                        Non
                    </Button>
                    <Button
                        variant="default"
                        class="px-8 bg-red-600 hover:bg-red-700 text-white"
                        :disabled="isClosing"
                        @click="handleCloseReplacement"
                    >
                        <span v-if="isClosing">Fermeture...</span>
                        <span v-else>Oui, fermer</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { ChevronDown, ChevronRight, Clock, Ellipsis, Eye, Lock, SquarePen, Users } from 'lucide-vue-next';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { toast } from 'vue-sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import ReplacementBoostButton from '@/components/replacements/ReplacementBoostButton.vue';
import ReplacementBoostStars from '@/components/replacements/ReplacementBoostStars.vue';
import ReplacementBoostTrustBadge from '@/components/replacements/ReplacementBoostTrustBadge.vue';
import ReplacementBoostModal from '@/components/replacements/ReplacementBoostModal.vue';
import { useReplacements } from '~/composables/useReplacements';
import { useInstitutions } from '~/composables/useInstitution';
import type { User } from '~/lib/types';

interface CareTypeItem {
    name: string;
}

interface TimeSlotPeriod {
    start_at?: string;
    end_at?: string;
}

interface Replacement {
    id: number;
    creator_name?: string | null;
    user_id: number;
    institution_id?: number | null;
    replacement_type?: string | null;
    institution?: {
        id: number;
        name: string;
        logo: string | null;
    } | null;
    periods?: Array<{ start_date: string; end_date: string }>;
    cities?: string[];
    zip_codes?: string[];
    care_types?: CareTypeItem[];
    comment?: string;
    time_slot?: {
        morning?: TimeSlotPeriod;
        evening?: TimeSlotPeriod;
    };
    patient_count?: number;
    status?: string;
    type?: string;
    details?: Record<string, unknown>[];
    has_confirmed_substitute?: boolean;
    is_boosted?: boolean;
    boosted_until?: string | null;
    stars?: number;
    is_favorited?: boolean;
}

const props = defineProps<{
    replacement: Replacement;
    rawReplacement?: Record<string, any>;
}>();

const emit = defineEmits<{
    (e: 'closed'): void;
    (e: 'open-edit', replacement: Replacement): void;
}>();
const { updateReplacement } = useReplacements();
const { getLogoUrl } = useInstitutions();
const { canBoostReplacement } = useReplacementBoost();

const boostModalOpen = ref(false);
const boostModalReplacement = ref<Replacement | null>(null);
const localBoosted = ref<boolean | null>(null);

const openBoostPreview = () => {
    const source = (props.rawReplacement ?? props.replacement) as Replacement;
    boostModalReplacement.value = source;
    boostModalOpen.value = true;
};

const openBoostActive = () => {
    const source = (props.rawReplacement ?? props.replacement) as Replacement;
    boostModalReplacement.value = source;
    boostModalOpen.value = true;
};

const onBoostCancelled = () => {
    localBoosted.value = false;
    if (props.rawReplacement) {
        props.rawReplacement.is_boosted = false;
        props.rawReplacement.boosted_until = null;
    }
};
const user = useState<User>('user');
const config = useRuntimeConfig();

const showAllPeriods = ref(false);
const showAllCities = ref(false);
const showAllZipCodes = ref(false);
const showAllCareTypes = ref(false);
const closeDialog = ref(false);
const isClosing = ref(false);
const localClosed = ref(false);

const isOwner = computed(() =>
    Number(user.value?.id) === Number(props.replacement.user_id),
);

const isClosed = computed(() =>
    localClosed.value
    || props.replacement.status === 'closed'
    || props.replacement.has_confirmed_substitute === true,
);

const canClose = computed(() => isOwner.value && !isClosed.value);

const isBoosted = computed(() => {
    if (localBoosted.value !== null) return localBoosted.value;
    return props.replacement.is_boosted === true || props.rawReplacement?.is_boosted === true;
});

const showBoostAction = computed(() =>
    canBoostReplacement(props.rawReplacement ?? props.replacement, 'me'),
);

const handleCloseReplacement = async (): Promise<void> => {
    isClosing.value = true;
    try {
        const payload = { ...props.replacement, status: 'closed' };
        const response = await updateReplacement(payload);
        if (response) {
            toast(response.message ?? 'Remplacement fermé avec succès.');
            closeDialog.value = false;
            localClosed.value = true;
            emit('closed');
        }
    }
    catch (error) {
        console.error(error);
        toast.error('Une erreur est survenue.');
    }
    finally {
        isClosing.value = false;
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const periods = computed(() => {
    if (!props.replacement.periods || props.replacement.periods.length === 0) {
        return ['Aucune période définie'];
    }
    return props.replacement.periods.map((period) => {
        const start = formatDate(period.start_date);
        const end = formatDate(period.end_date);
        return `${start} → ${end}`;
    });
});

const displayedPeriods = computed(() => periods.value);

const cities = computed(() => {
    if (!props.replacement.cities || props.replacement.cities.length === 0) {
        return ['Aucune ville'];
    }
    return props.replacement.cities;
});

const displayedCities = computed(() => cities.value);

const zipCodes = computed(() => {
    if (!props.replacement.zip_codes || props.replacement.zip_codes.length === 0) {
        return ['Aucun code postal'];
    }
    return props.replacement.zip_codes;
});

const displayedZipCodes = computed(() => zipCodes.value);

const careTypes = computed(() => {
    if (!props.replacement.care_types || props.replacement.care_types.length === 0) {
        return ['Aucun type de soin'];
    }
    return props.replacement.care_types.map(ct => ct.name);
});

const displayedCareTypes = computed(() => careTypes.value);

const timeSlotsText = computed(() => {
    const slots: string[] = [];
    const timeSlot = props.replacement.time_slot;

    if (timeSlot?.morning?.start_at && timeSlot?.morning?.end_at) {
        slots.push('Matin');
    }
    if (timeSlot?.evening?.start_at && timeSlot?.evening?.end_at) {
        slots.push('Soir');
    }

    if (slots.length === 0) {
        return 'Horaires non définis';
    }

    return slots.join(' & ');
});

const isUrgent = computed(() => {
    return props.replacement.type === 'immediate'
        && props.replacement.details
        && props.replacement.details.length > 0;
});

const statusText = computed(() => {
    if (isClosed.value) return 'Fermé';
    if (isUrgent.value) return 'Urgent';

    const status = props.replacement.status?.toLowerCase();
    switch (status) {
        case 'available':
        case 'disponible':
        case 'open':
            return 'Disponible';
        case 'pending':
        case 'en attente':
            return 'En attente';
        case 'filled':
        case 'pourvu':
            return 'Pourvu';
        case 'closed':
            return 'Fermé';
        default:
            return 'Disponible';
    }
});

const statusBadgeClass = computed(() => {
    if (isClosed.value) return 'bg-red-100 text-red-700';
    if (isUrgent.value) return 'bg-orange-100 text-orange-700 animate-pulse';

    const status = props.replacement.status?.toLowerCase();
    switch (status) {
        case 'available':
        case 'disponible':
        case 'open':
            return 'bg-green-100 text-green-700';
        case 'pending':
        case 'en attente':
            return 'bg-yellow-100 text-yellow-700';
        case 'filled':
        case 'pourvu':
            return 'bg-gray-100 text-gray-700';
        case 'closed':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-green-100 text-green-700';
    }
});

const replacementTypeLabel = computed(() => {
    const type = props.replacement.replacement_type;
    if (!type) return '';
    const labels: Record<string, string> = {
        nurse: 'Infirmier(ère)',
        caregiver: 'Aide soignant(e)',
        midwife: 'Sage-femme',
    };
    return labels[type] || type;
});

const replacementTypeBadgeClass = computed(() => {
    return 'bg-blue-100 text-blue-700';
});

const institutionLogoUrl = computed(() => {
    const institution = props.replacement.institution || props.rawReplacement?.institution || props.rawReplacement?.user?.institution;
    if (!institution || !institution.logo) return null;

    const logo = institution.logo;
    if (logo.startsWith('http://') || logo.startsWith('https://')) {
        return logo;
    }

    const logoUrl = getLogoUrl(logo);
    return logoUrl;
});

const institutionName = computed(() => {
    const institution = props.replacement.institution || props.rawReplacement?.institution || props.rawReplacement?.user?.institution;
    return institution?.name || '';
});

const isNew = computed(() => {
    console.log('props.rawReplacement', props.rawReplacement);
    const createdAt = props.rawReplacement?.created_at;
    if (!createdAt) return false;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(createdAt) > oneWeekAgo;
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
