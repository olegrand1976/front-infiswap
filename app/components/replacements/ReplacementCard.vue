<template>
    <div class="bg-gradient-to-br from-white to-gray-50 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 p-4 space-y-3 border border-gray-100 hover:border-primary/20 group relative h-full flex flex-col">
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

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm items-stretch">
            <div class="flex flex-col h-full min-h-[5.5rem] bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs shrink-0">
                    <span class="text-base">📅</span>
                    <span>Périodes</span>
                </p>
                <p
                    class="text-gray-600 text-xs flex-1"
                    :class="{ 'line-clamp-2': !expanded.periods && isLongText(periodsText) }"
                >
                    {{ periodsText }}
                </p>
                <button
                    v-if="isLongText(periodsText)"
                    type="button"
                    class="text-primary text-xs font-medium mt-1 text-left hover:underline shrink-0"
                    @click="expanded.periods = !expanded.periods"
                >
                    {{ expanded.periods ? 'Voir moins' : 'Voir plus' }}
                </button>
            </div>

            <div class="flex flex-col h-full min-h-[5.5rem] bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs shrink-0">
                    <span class="text-base">📮</span>
                    <span>C . P</span>
                </p>
                <p
                    class="text-gray-600 text-xs flex-1"
                    :class="{ 'line-clamp-2': !expanded.zipCodes && isLongText(zipCodesText) }"
                >
                    {{ zipCodesText }}
                </p>
                <button
                    v-if="isLongText(zipCodesText)"
                    type="button"
                    class="text-primary text-xs font-medium mt-1 text-left hover:underline shrink-0"
                    @click="expanded.zipCodes = !expanded.zipCodes"
                >
                    {{ expanded.zipCodes ? 'Voir moins' : 'Voir plus' }}
                </button>
            </div>

            <div class="flex flex-col h-full min-h-[5.5rem] bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs shrink-0">
                    <span class="text-base">🏙️</span>
                    <span>Villes</span>
                </p>
                <p
                    class="text-gray-600 text-xs flex-1"
                    :class="{ 'line-clamp-2': !expanded.cities && isLongText(citiesText) }"
                >
                    {{ citiesText }}
                </p>
                <button
                    v-if="isLongText(citiesText)"
                    type="button"
                    class="text-primary text-xs font-medium mt-1 text-left hover:underline shrink-0"
                    @click="expanded.cities = !expanded.cities"
                >
                    {{ expanded.cities ? 'Voir moins' : 'Voir plus' }}
                </button>
            </div>

            <div class="flex flex-col h-full min-h-[5.5rem] bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs shrink-0">
                    <span class="text-base">🩺</span>
                    <span>Soins</span>
                </p>
                <p
                    class="text-gray-600 text-xs flex-1"
                    :class="{ 'line-clamp-2': !expanded.careTypes && isLongText(careTypesText) }"
                >
                    {{ careTypesText }}
                </p>
                <button
                    v-if="isLongText(careTypesText)"
                    type="button"
                    class="text-primary text-xs font-medium mt-1 text-left hover:underline shrink-0"
                    @click="expanded.careTypes = !expanded.careTypes"
                >
                    {{ expanded.careTypes ? 'Voir moins' : 'Voir plus' }}
                </button>
            </div>
        </div>

        <div
            v-if="replacement.comment"
            class="min-h-[2.75rem] bg-gray-50/50 rounded-lg p-2"
        >
            <p class="font-medium text-gray-700 mb-1 text-xs shrink-0">
                Description
            </p>
            <p
                class="text-xs text-gray-600"
                :class="{ 'line-clamp-2': !expanded.comment && isLongText(replacement.comment) }"
            >
                {{ replacement.comment }}
            </p>
            <button
                v-if="isLongText(replacement.comment)"
                type="button"
                class="text-primary text-xs font-medium mt-1 hover:underline"
                @click="expanded.comment = !expanded.comment"
            >
                {{ expanded.comment ? 'Voir moins' : 'Voir plus' }}
            </button>
        </div>

        <div>
            <span
                v-if="replacement.replacement_type"
                class="px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap"
                :class="replacementTypeBadgeClass"
            >
                {{ replacementTypeLabel }}
            </span>
        </div>
        <div class="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 mt-auto">
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
                    <ReplacementBoostStars
                        v-if="showBoostStars && isBoosted"
                        size="sm"
                    />
                    <ReplacementBoostTrustBadge
                        v-if="showBoostBadge && isBoosted"
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
                        plain
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
import { ChevronRight, Clock, Ellipsis, Eye, Lock, SquarePen, Users } from 'lucide-vue-next';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { toast } from 'vue-sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import ReplacementBoostButton from '@/components/replacements/ReplacementBoostButton.vue';
import ReplacementBoostStars from '@/components/replacements/ReplacementBoostStars.vue';
import ReplacementBoostTrustBadge from '@/components/replacements/ReplacementBoostTrustBadge.vue';
import { isReplacementActivelyBoosted } from '~/lib/replacementBoost';
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

const props = withDefaults(defineProps<{
    replacement: Replacement;
    rawReplacement?: Record<string, any>;
    showBoostBadge?: boolean;
    showBoostStars?: boolean;
}>(), {
    showBoostBadge: false,
    showBoostStars: false,
});

const emit = defineEmits<{
    (e: 'closed' | 'boost-cancelled'): void;
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
    emit('boost-cancelled');
};
const user = useState<User>('user');
const config = useRuntimeConfig();

const expanded = reactive({
    periods: false,
    zipCodes: false,
    cities: false,
    careTypes: false,
    comment: false,
});

const LONG_TEXT_MIN = 55;

const isLongText = (text: string) => text.length > LONG_TEXT_MIN;

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

    const source = {
        is_boosted: props.replacement.is_boosted ?? props.rawReplacement?.is_boosted,
        boosted_until: props.replacement.boosted_until ?? props.rawReplacement?.boosted_until,
    };

    return isReplacementActivelyBoosted(source);
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

const periodsText = computed(() => periods.value.join(' · '));

const cities = computed(() => {
    if (!props.replacement.cities || props.replacement.cities.length === 0) {
        return ['Aucune ville'];
    }
    return props.replacement.cities;
});

const citiesText = computed(() => cities.value.join(' · '));

const zipCodes = computed(() => {
    if (!props.replacement.zip_codes || props.replacement.zip_codes.length === 0) {
        return ['Aucun code postal'];
    }
    return props.replacement.zip_codes;
});

const zipCodesText = computed(() => zipCodes.value.join(' · '));

const careTypes = computed(() => {
    if (!props.replacement.care_types || props.replacement.care_types.length === 0) {
        return ['Aucun type de soin'];
    }
    return props.replacement.care_types.map(ct => ct.name);
});

const careTypesText = computed(() => careTypes.value.join(' · '));

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
