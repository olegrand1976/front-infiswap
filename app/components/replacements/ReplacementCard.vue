<template>
    <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4 border border-gray-100 hover:border-primary/20 group">
        <div class="flex justify-between items-start">
            <div class="flex-1">
                <h2 class="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    Remplacement infirmier{{ replacement.creator_name ? ` – ${replacement.creator_name}` : '' }}
                </h2>
                <p class="text-sm text-gray-500 flex items-center gap-1.5">
                    <ClockIcon class="w-4 h-4 text-primary/60" />
                    <span>{{ nextPeriodText }}</span>
                </p>
            </div>

            <span
                class="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-4"
                :class="statusBadgeClass"
            >
                {{ statusText }}
            </span>
        </div>

        <div class="grid md:grid-cols-3 gap-4 text-sm">
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-3">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <span class="text-lg">📅</span>
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

            <!-- Villes -->
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-3">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <span class="text-lg">🏙️</span>
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
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-3">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <span class="text-lg">🩺</span>
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
            class="text-sm text-gray-600 line-clamp-2"
        >
            {{ replacement.comment }}
        </p>

        <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <div class="flex items-center gap-3 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                    <ClockIcon class="w-4 h-4 text-primary" />
                    <span>{{ timeSlotsText }}</span>
                </div>
                <div
                    v-if="replacement.patient_count"
                    class="flex items-center gap-1"
                >
                    <UserGroupIcon class="w-4 h-4 text-primary" />
                    <span>{{ replacement.patient_count }} patient(s)/jour</span>
                </div>
            </div>

            <NuxtLink
                :to="`/dashboard/replacements/${replacement.id}`"
                class="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-5 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:scale-105 flex items-center gap-2"
            >
                <span>Voir détail</span>
                <ChevronRightIcon class="w-4 h-4" />
            </NuxtLink>
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
    care_types?: Array<{ name: string }>;
    comment?: string;
    time_slot?: {
        morning?: { start_at?: string; end_at?: string };
        evening?: { start_at?: string; end_at?: string };
    };
    patient_count?: number;
    status?: string;
}

const props = defineProps<{
    replacement: Replacement;
}>();

const showAllPeriods = ref(false);
const showAllCities = ref(false);
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

const careTypes = computed(() => {
    if (!props.replacement.care_types || props.replacement.care_types.length === 0) {
        return ['Aucun type de soin'];
    }
    return props.replacement.care_types.map(ct => ct.name);
});

const displayedCareTypes = computed(() => careTypes.value);

const nextPeriodText = computed(() => {
    if (periods.value.length > 0) {
        const firstPeriod = props.replacement.periods?.[0];
        if (firstPeriod) {
            const date = new Date(firstPeriod.start_date);
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
        }
    }
    return 'Aucune période définie';
});

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

const statusText = computed(() => {
    const status = props.replacement.status?.toLowerCase();
    switch (status) {
        case 'available':
        case 'disponible':
            return 'Disponible';
        case 'pending':
        case 'en attente':
            return 'En attente';
        case 'filled':
        case 'pourvu':
            return 'Pourvu';
        default:
            return 'Disponible';
    }
});

const statusBadgeClass = computed(() => {
    const status = props.replacement.status?.toLowerCase();
    switch (status) {
        case 'available':
        case 'disponible':
            return 'bg-green-100 text-green-700';
        case 'pending':
        case 'en attente':
            return 'bg-yellow-100 text-yellow-700';
        case 'filled':
        case 'pourvu':
            return 'bg-gray-100 text-gray-700';
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
