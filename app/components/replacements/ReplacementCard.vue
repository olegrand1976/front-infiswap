<template>
    <div class="bg-gradient-to-br from-white to-gray-50 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 p-4 space-y-3 border border-gray-100 hover:border-primary/20 group">
        <div class="flex justify-between items-start">
            <div class="flex-1">
                <h2 class="text-base font-semibold text-gray-900 mb-0.5 group-hover:text-primary transition-colors">
                    {{ replacement.creator_name ?? '' }}
                </h2>
            </div>

            <span
                class="px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ml-3"
                :class="statusBadgeClass"
            >
                {{ statusText }}
            </span>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
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
                        <ChevronDownIcon
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
                        <ChevronDownIcon
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
                        <ChevronDownIcon
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
                        <ChevronDownIcon
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

        <div class="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2 text-xs text-gray-600 font-bold flex-1">
                <div class="flex items-center gap-1">
                    <ClockIcon class="w-3.5 h-3.5 text-primary" />
                    <span>{{ timeSlotsText }}</span>
                </div>
                <div
                    v-if="replacement.patient_count"
                    class="flex items-center gap-1"
                >
                    <UserGroupIcon class="w-3.5 h-3.5 text-primary" />
                    <span>{{ replacement.patient_count }} patient(s)/jour</span>
                </div>
            </div>

            <Button
                size="sm"
                :href="`/dashboard/replacements/${replacement.id}`"
                class="shrink-0"
            >
                <span>Voir détail</span>
                <ChevronRightIcon class="w-3.5 h-3.5" />
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ChevronDownIcon, ChevronRightIcon, ClockIcon, UserGroupIcon } from '@heroicons/vue/24/outline';

interface Replacement {
    id: number;
    creator_name?: string;
    periods?: Array<{ start_date: string; end_date: string }>;
    cities?: string[];
    zip_codes?: string[];
    care_types?: Array<{ name: string }>;
    comment?: string;
    time_slot?: {
        morning?: { start_at?: string; end_at?: string };
        evening?: { start_at?: string; end_at?: string };
    };
    patient_count?: number;
    status?: string;
    type?: string;
    details?: any[];
    replaced_by?: number | null;
}

const props = defineProps<{
    replacement: Replacement;
}>();

const showAllPeriods = ref(false);
const showAllCities = ref(false);
const showAllZipCodes = ref(false);
const showAllCareTypes = ref(false);

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const periods = computed(() => {
    if (!props.replacement.periods || props.replacement.periods.length === 0) {
        return ['Aucune période définie'];
    }
    return props.replacement.periods.map(period => {
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
    return props.replacement.type === 'immediate' && 
           props.replacement.details && 
           props.replacement.details.length > 0;
});

const isClosed = computed(() => {
    return props.replacement.status === 'closed' || 
           props.replacement.replaced_by !== null;
});

const statusText = computed(() => {
    if (isClosed.value) {
        return 'Fermé';
    }
    
    if (isUrgent.value) {
        return 'Urgent';
    }
    

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
    // Priorité 1: Fermé
    if (isClosed.value) {
        return 'bg-red-100 text-red-700';
    }
    
    // Priorité 2: Urgent
    if (isUrgent.value) {
        return 'bg-orange-100 text-orange-700 animate-pulse';
    }
    
    // Priorité 3: Statut normal
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
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
