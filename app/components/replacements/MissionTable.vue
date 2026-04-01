<template>
    <div class="hidden lg:contents">
        <TableRow
            :class="['gap-2 grid border border-none overflow-x-hidden relative', gridClass]"
        >
            <div class="text-xs absolute -top-1 left-0 z-10 text-[0.7rem] font-bold px-2 py-0.5 rounded-br-sm shadow-md bg-blue-600 text-white">
                MISSION
            </div>

            <TableCell class="flex flex-col justify-center items-center bg-[#F1F2F7] xl:text-[0.7em] lg:text-[0.65em]">
                <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                    <span>{{ formatDate(mission.start_date) }}</span>
                </div>
                <span class="flex items-center text-xs">au</span>
                <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                    <span>{{ formatDate(mission.end_date ?? mission.start_date) }}</span>
                </div>
            </TableCell>

            <TableCell class="bg-[#F1F2F7] text-xs grid grid-cols-3 place-items-center relative">
                <template v-if="mission.is_long_term">
                    <div class="col-span-3 text-center w-full font-medium text-blue-700 bg-blue-100/50 py-1 rounded text-[10px] leading-tight flex items-center justify-center min-h-[24px]">
                        Long terme
                    </div>
                </template>
                <template v-else>
                    <div>
                        <CheckCircleIcon
                            v-if="hasMorning"
                            class="h-6 text-green-500"
                        />
                    </div>
                    <div>
                        <CheckCircleIcon
                            v-if="hasAfternoon"
                            class="h-6 text-green-500"
                        />
                    </div>
                    <div>
                        <CheckCircleIcon
                            v-if="hasEvening"
                            class="h-6 text-green-500"
                        />
                    </div>
                </template>
            </TableCell>

            <TableCell class="bg-[#F1F2F7] text-xs">
                <div class="flex bg-[#E4E7F4] truncate h-10 rounded mt-3 items-center overflow-hidden">
                    <p class="truncate w-full text-start px-2">
                        {{ mission.institution?.zip_code ?? '—' }}
                    </p>
                </div>
            </TableCell>

            <TableCell class="bg-[#F1F2F7] text-xs">
                <div class="flex bg-[#E4E7F4] truncate w-full h-10 rounded mt-3 items-center overflow-hidden">
                    <p class="truncate w-full text-start px-2">
                        {{ mission.institution?.city ?? '—' }}
                    </p>
                </div>
            </TableCell>

            <TableCell class="bg-gray-100 text-xs pt-5">
                <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-start px-3 flex items-center overflow-hidden whitespace-nowrap text-ellipsis">
                    {{ mission.required_diploma ?? '—' }}
                </div>
            </TableCell>

            <TableCell
                v-if="type === 'groups'"
                class="bg-gray-100 text-xs pt-5"
            >
                <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-start px-3">
                    —
                </div>
            </TableCell>
            <TableCell
                v-if="type === 'groups'"
                class="bg-gray-100 text-xs pt-5"
            >
                <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-start px-3">
                    —
                </div>
            </TableCell>

            <TableCell
                v-if="type === ''"
                class="bg-gray-100 text-xs pt-5"
            >
                <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-center px-3 flex items-center justify-center">
                    <span class="">Mission</span>
                </div>
            </TableCell>

            <TableCell
                v-if="type === ''"
                class="bg-gray-100 text-xs pt-5"
            >
                <div class="pt-3 h-10 rounded bg-[#E4E7F4] flex items-center justify-center px-3">
                    <template v-if="institutionLogoUrl">
                        <div class="w-8 h-8 rounded bg-white flex items-center justify-center">
                            <img
                                :src="institutionLogoUrl"
                                :alt="institutionName"
                                class="max-w-full max-h-full object-contain"
                            >
                        </div>
                    </template>
                    <span
                        v-else
                        class="text-xs truncate"
                    >
                        {{ institutionName }}
                    </span>
                </div>
            </TableCell>

            <TableCell class="text-xs flex -mt-12 2xl:mt-0 items-center justify-center bg-[#F1F2F7] overflow-x-hidden pt-4">
                <Button
                    :href="`/dashboard/missions/${mission.id}`"
                    class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white mx-auto justify-center items-center"
                >
                    <EyeIcon class="h-6 mt-1" />
                </Button>
                <Button
                    v-if="isOwner"
                    class="inline-block rounded bg-[#E4E7F4] text-primary hover:bg-primary hover:text-white mx-auto justify-center items-center ml-2"
                    title="Reposter cette mission"
                    @click="duplicateMission"
                >
                    <ArrowPathIcon class="h-6 mt-1" />
                </Button>
            </TableCell>

            <span class="bg-white h-[0.01em]" />
        </TableRow>
    </div>

    <div class="lg:hidden contents">
        <TableRow class="grid grid-cols-3 gap-1 border border-none overflow-x-hidden relative">
            <div class="text-xs absolute -top-1 left-0 z-10 text-[0.7rem] font-bold px-2 py-0.5 rounded-br-sm shadow-md bg-blue-600 text-white">
                MISSION
            </div>

            <TableCell class="flex flex-col items-center bg-[#F1F2F7] text-[0.75em] py-6">
                <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                    <span>{{ formatDate(mission.start_date) }}</span>
                </div>
                <span class="flex items-center text-xs">au</span>
                <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                    <span>{{ formatDate(mission.end_date ?? mission.start_date) }}</span>
                </div>
            </TableCell>

            <TableCell class="bg-[#F1F2F7] flex flex-col justify-center w-full items-center text-xs px-2 py-4">
                <div class="bg-[#E4E7F4] rounded p-2 text-xs">
                    {{ mission.institution?.zip_code ?? '—' }}
                </div>
            </TableCell>

            <TableCell class="text-xs flex flex-col justify-center w-full items-center bg-[#F1F2F7] overflow-x-hidden pt-4">
                <Button
                    :href="`/dashboard/missions/${mission.id}`"
                    class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white justify-center items-center"
                >
                    <EyeIcon class="h-6 mt-1" />
                </Button>
                <Button
                    v-if="isOwner"
                    class="inline-block rounded bg-[#E4E7F4] text-primary hover:bg-primary hover:text-white justify-center items-center ml-2"
                    @click="duplicateMission"
                >
                    <ArrowPathIcon class="h-6 mt-1" />
                </Button>
            </TableCell>

            <span class="bg-white h-[0.01em]" />
        </TableRow>
    </div>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircleIcon, EyeIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import { useInstitutions } from '~/composables/useInstitution';
import type { MergedItem } from '~/composables/useMergedSearch';
import { getPeriodsFromTimeSlot } from '~/lib/utils';

const props = defineProps<{
    mission: MergedItem;
    type?: string;
    gridClass?: string;
}>();

const { getLogoUrl } = useInstitutions();

const formatDate = (d?: string | null) => {
    if (!d) return '—';
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const normalizeTime = (t?: string | null) => t?.split(':').slice(0, 2).join(':') ?? null;

const timePeriods = computed(() => {
    const set = new Set<string>();
    const start = normalizeTime(props.mission.time_start_at);
    const end = normalizeTime(props.mission.time_end_at);
    if (start && end) getPeriodsFromTimeSlot(start, end).forEach(p => set.add(p));
    return set;
});

const hasMorning = computed(() => timePeriods.value.has('morning'));
const hasAfternoon = computed(() => timePeriods.value.has('afternoon'));
const hasEvening = computed(() => timePeriods.value.has('evening'));

const user = useState<any>('user');
const isOwner = computed(() => {
    return user.value?.institution?.id && user.value.institution.id === props.mission.institution_id;
});

const duplicateMission = () => {
    navigateTo(`/dashboard/institution/missions/create?duplicate_id=${props.mission.id}`);
};

const institutionLogoUrl = computed(() => {
    const logo = (props.mission as any).institution?.logo || (props.mission as any).institution?.profil_url;
    if (!logo) return null;
    if (logo.startsWith('http://') || logo.startsWith('https://')) return logo;
    return getLogoUrl(logo);
});

const institutionName = computed(() =>
    (props.mission as any).institution?.institution_name
    || (props.mission as any).institution?.name
    || '—',
);
</script>
