<template>
    <div class="bg-linear-to-br from-white to-gray-50 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 p-4 space-y-3 border border-gray-100 hover:border-primary/20 group">
        <div class="flex justify-between items-start">
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <div
                        v-if="institutionLogoUrl"
                        class="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center"
                    >
                        <img
                            :src="institutionLogoUrl"
                            :alt="(mission.institution as any)?.institution_name || (mission.institution as any)?.name || 'Institution'"
                            class="w-full h-full object-contain"
                            @error="handleImageError"
                        >
                    </div>
                    <div
                        v-else
                        class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
                    >
                        <span class="text-primary font-semibold text-xs">
                            {{ institutionInitial }}
                        </span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h2 class="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                            {{ mission.institution?.institution_name ?? '' }}
                            <span v-if="mission.service && mission.service !== null">
                                - {{ mission.service.name }}
                            </span>
                        </h2>
                        <p class="text-xs text-gray-500">
                            Publié {{ formatRelativeDate(mission.created_at) }}
                        </p>
                    </div>
                </div>
            </div>

            <span
                class="px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ml-3"
                :class="statusBadgeClass"
            >
                {{ statusText }}
            </span>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <!-- Dates -->
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs">
                    <span class="text-base">📅</span>
                    <span>Dates</span>
                </p>
                <div class="text-gray-600 text-xs">
                    <p v-if="mission.start_date">
                        Du {{ formatToDMY(mission.start_date) }}
                    </p>
                    <p v-if="mission.end_date">
                        Au {{ formatToDMY(mission.end_date) }}
                    </p>
                </div>
            </div>

            <!-- Horaires -->
            <div
                class="space-y-1 bg-gray-50/50 rounded-lg p-2"
                :class="{ 'md:col-span-2': mission.is_long_term }"
            >
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs">
                    <span class="text-base">🕐</span>
                    <span>{{ mission.is_long_term ? 'Disponibilités (long terme)' : 'Horaires' }}</span>
                </p>
                <div class="text-gray-600 text-xs text-nowrap">
                    <div
                        v-if="mission.is_long_term && mission.availabilities && mission.availabilities.length > 0"
                        class="flex flex-wrap gap-1 mt-1"
                    >
                        <span
                            v-for="(av, i) in mission.availabilities"
                            :key="i"
                            class="bg-white border border-gray-200 rounded px-1.5 py-0.5"
                        >
                            <span class="font-medium">{{ av.day }}</span> : {{ formatTime(av.start_time) }} - {{ formatTime(av.end_time) }}
                        </span>
                    </div>
                    <p v-else-if="mission.time_start_at && mission.time_end_at">
                        {{ formatTime(mission.time_start_at) }} - {{ formatTime(mission.time_end_at) }}
                    </p>
                    <p v-else>
                        Non défini
                    </p>
                </div>
            </div>

            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <p class="font-medium text-gray-700 mb-1 flex items-center gap-1.5 text-xs">
                    <span class="text-base">🎓</span>
                    <span>Diplôme</span>
                </p>
                <div class="text-gray-600 text-xs">
                    <p>{{ mission.required_diploma || 'Non spécifié' }}</p>
                </div>
            </div>
        </div>

        <p
            v-if="mission.description"
            class="text-xs text-gray-600 line-clamp-2"
            :class="{ 'line-clamp-none': showFullDescription }"
        >
            {{ mission.description }}
        </p>
        <button
            v-if="mission.description && mission.description.length > 100"
            class="text-primary hover:text-primary/80 font-medium text-xs"
            @click="showFullDescription = !showFullDescription"
        >
            {{ showFullDescription ? 'Voir moins' : 'Voir plus' }}
        </button>

        <div class="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2 text-xs text-gray-600 font-bold flex-1">
                <div class="flex items-center gap-1">
                    <BuildingOfficeIcon class="w-3.5 h-3.5 text-primary" />
                    <span>{{ mission.institution?.city ?? 'Mission' }}</span>
                </div>
                <div
                    v-if="mission.institution?.zip_code"
                    class="flex items-center gap-1"
                >
                    <span class="text-gray-400">•</span>
                    <span>{{ mission.institution.zip_code }}</span>
                </div>
            </div>

            <Button
                size="sm"
                variant="outline"
                :href="`/dashboard/missions/${mission.id}`"
                class="text-xs border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            >
                <EyeIcon class="w-3.5 h-3.5 mr-1" /> Détails
            </Button>
            <Button
                v-if="!mission.has_answered"
                size="sm"
                :href="`/dashboard/missions/${mission.id}/apply`"
            >
                <span>Postuler</span>
                <ChevronRightIcon class="w-3.5 h-3.5" />
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronRightIcon, BuildingOfficeIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import { useInstitutions } from '~/composables/useInstitution';
import type { Mission } from '~/lib/types';

interface MissionCardProps {
    mission: Mission;
}

const props = defineProps<MissionCardProps>();

const { getLogoUrl } = useInstitutions();
const showFullDescription = ref(false);

const formatToDMY = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Format HH:MM
};

const formatRelativeDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'il y a quelques secondes';
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''}`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} heure${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''}`;
    if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`;

    return formatToDMY(dateString);
};

const statusText = computed(() => {
    const status = props.mission.status?.toLowerCase();
    switch (status) {
        case 'open':
            return 'Ouverte';
        case 'in_progress':
            return 'En cours';
        case 'completed':
            return 'Terminée';
        case 'cancelled':
            return 'Annulée';
        default:
            return 'Ouverte';
    }
});

const statusBadgeClass = computed(() => {
    const status = props.mission.status?.toLowerCase();
    switch (status) {
        case 'open':
            return 'bg-green-100 text-green-700';
        case 'in_progress':
            return 'bg-blue-100 text-blue-700';
        case 'completed':
            return 'bg-gray-100 text-gray-700';
        case 'cancelled':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-green-100 text-green-700';
    }
});

const institutionLogoUrl = computed(() => {
    const institution = props.mission.institution;
    if (!institution) {
        return null;
    }

    const institutionAny = institution as any;
    const logo = institutionAny.logo || institution.profil_url;
    if (!logo) {
        return null;
    }

    if (typeof logo === 'string' && (logo.startsWith('http://') || logo.startsWith('https://'))) {
        return logo;
    }

    return getLogoUrl(logo);
});

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    if (img) {
        img.style.display = 'none';
    }
};

const institutionInitial = computed(() => {
    const institution = props.mission.institution;
    const institutionAny = institution as any;
    const name = institutionAny?.institution_name || institutionAny?.name || '';
    if (!name) return 'M';
    return name.charAt(0).toUpperCase();
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-none {
    display: block;
}
</style>
