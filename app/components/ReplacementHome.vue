<template>
    <div>
        <div class="grid my-2">
            <div class="hidden lg:block">
                <Table>
                    <TableHeader class="w-full">
                        <TableRow class="grid grid-cols-5 overflow-x-hidden gap-2 rounded-t-lg border-none">
                            <TableHead class="bg-primary w-full xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center text-white text-xs">
                                Jour
                            </TableHead>
                            <TableHead class="bg-primary w-full grid grid-cols-3 justify-center items-center text-white text-xs">
                                <div class="text-center">
                                    Matin
                                </div>
                                <div class="text-center">
                                    Midi
                                </div>
                                <div class="text-center">
                                    Soir
                                </div>
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Codes postaux
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Ville(s)
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Types de soins
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody class="rounded-b-lg">
                        <div v-if="loading">
                            <TableRow
                                v-for="(_, index) in Array.from({ length: 5 })"
                                :key="index"
                                class="grid grid-cols-5 gap-2 border border-none overflow-x-hidden h-16"
                            >
                                <TableCell><Skeleton class="h-10 w-[200px] bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                            </TableRow>
                        </div>
                        <div v-else-if="!replacements">
                            <p class="text-center text-gray-500 py-8">
                                Aucun résultat n'est trouvé
                            </p>
                        </div>
                        <div v-else>
                            <TableRow
                                v-for="replacement in props.replacements"
                                :key="replacement.id"
                                class="grid grid-cols-5 gap-2 border border-none overflow-x-hidden relative"
                            >
                                <div
                                    v-if="isUrgentReplacement(replacement)"
                                    class="-ml-[-2] text-xs absolute top-[5px] left-0 text-[0.7rem] font-bold px-2 py-[2px] rounded-br-[4px] z-10 animate-pulse shadow-md bg-primary text-white"
                                >
                                    URGENT
                                </div>

                                <TableCell
                                    :class="[cn('flex justify-center items-center bg-[#F1F2F7] xl:text-[0.7em] lg:text-[0.65em]', { 'flex-col': replacement.periods.length > 0 })]"
                                >
                                    <template v-if="replacement.periods.length > 0">
                                        <div
                                            v-for="(period, index) in replacement.periods.slice(0, 2)"
                                            :key="index"
                                            class="flex items-center"
                                        >
                                            <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                                <span>{{ formatDate(period.start_date) }}</span>
                                            </div>
                                            <span class="flex items-center">au</span>
                                            <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                                <span>{{ formatDate(period.end_date) }}</span>
                                            </div>
                                        </div>
                                        <div
                                            class="mt-1 text-xs font-semibold text-primary cursor-pointer"
                                            @click="handleShowPeriods(replacement.periods)"
                                        >
                                            Voir tout
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(replacement.start_date) }}</span>
                                        </div>
                                        <span class="flex items-center">au</span>
                                        <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(replacement.end_date) }}</span>
                                        </div>
                                    </template>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs grid grid-cols-3 place-items-center">
                                    <div>
                                        <span v-if="hasShift(replacement, 'morning')">
                                            <CheckCircleIcon class="h-6 text-green-500" />
                                        </span>
                                        <span v-else />
                                    </div>
                                    <div>
                                        <span v-if="hasShift(replacement, 'afternoon')">
                                            <CheckCircleIcon class="h-6 text-green-500" />
                                        </span>
                                        <span v-else />
                                    </div>
                                    <div>
                                        <span v-if="hasShift(replacement, 'evening')">
                                            <CheckCircleIcon class="h-6 text-green-500" />
                                        </span>
                                        <span v-else />
                                    </div>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs">
                                    <div class="flex bg-[#E4E7F4] truncate h-10 rounded mt-3 items-center overflow-hidden">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                        <span
                                                            v-for="(zipCode, index) in (Array.isArray(replacement.zip_codes) ? replacement.zip_codes : JSON.parse(replacement.zip_codes ?? '[]'))"
                                                            :key="index"
                                                            class="mr-1"
                                                        >
                                                            {{ zipCode }}{{ index < (Array.isArray(replacement.zip_codes) ? replacement.zip_codes.length : JSON.parse(replacement.zip_codes ?? '[]').length) - 1 ? ',' : '' }}
                                                        </span>
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span
                                                        v-for="(zipCode, index) in (Array.isArray(replacement.zip_codes) ? replacement.zip_codes : JSON.parse(replacement.zip_codes ?? '[]'))"
                                                        :key="index"
                                                        class="mr-1"
                                                    >
                                                        {{ zipCode }}{{ index < (Array.isArray(replacement.zip_codes) ? replacement.zip_codes.length : JSON.parse(replacement.zip_codes ?? '[]').length) - 1 ? ',' : '' }}
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs">
                                    <div class="flex bg-[#E4E7F4] truncate w-full h-10 rounded mt-3 items-center overflow-hidden">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                        <span
                                                            v-for="(city, index) in (Array.isArray(replacement.cities) ? replacement.cities : JSON.parse(replacement.cities ?? '[]'))"
                                                            :key="index"
                                                            class="mr-1"
                                                        >
                                                            {{ city }}{{ index < (Array.isArray(replacement.cities) ? replacement.cities.length : JSON.parse(replacement.cities ?? '[]').length) - 1 ? ',' : '' }}
                                                        </span>
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span
                                                        v-for="(city, index) in (Array.isArray(replacement.cities) ? replacement.cities : JSON.parse(replacement.cities ?? '[]'))"
                                                        :key="index"
                                                        class="mr-1"
                                                    >
                                                        {{ city }}{{ index < (Array.isArray(replacement.cities) ? replacement.cities.length : JSON.parse(replacement.cities ?? '[]').length) - 1 ? ',' : '' }}
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell class="bg-gray-100 text-xs pt-5">
                                    <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-start px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {{ getUniqueValues(replacement.care_types, careType => careType.name).join(', ') }}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {{ getUniqueValues(replacement.care_types, careType => careType.name).join(', ') }}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </div>
                    </TableBody>
                </Table>
            </div>

            <div class="lg:hidden">
                <Table>
                    <TableHeader class="w-full">
                        <TableRow class="grid grid-cols-3 overflow-x-hidden gap-1 rounded-t-lg border-none">
                            <TableHead class="bg-primary w-full xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center text-white text-xs">
                                Date
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Localité
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody class="rounded-b-lg">
                        <div v-if="loading">
                            <TableRow
                                v-for="(_, index) in Array.from({ length: 5 })"
                                :key="index"
                                class="grid grid-cols-3 gap-1 border border-none overflow-x-hidden h-16"
                            >
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                            </TableRow>
                        </div>
                        <div v-else-if="!replacements">
                            <p class="text-center text-gray-500 py-8">
                                Aucun résultat n'est trouvé
                            </p>
                        </div>
                        <div v-else>
                            <TableRow
                                v-for="replacement in props.replacements"
                                :key="replacement.id"
                                class="grid grid-cols-3 gap-1 border border-none overflow-x-hidden relative gap-y-2"
                            >
                                <div
                                    v-if="isUrgentReplacement(replacement)"
                                    class="urgent-indicator -ml-[-2] text-xs"
                                >
                                    URGENT
                                </div>

                                <TableCell class="flex flex-col items-center bg-[#F1F2F7] text-[0.75em] py-6">
                                    <template v-if="replacement.periods.length > 0">
                                        <div
                                            v-for="(period, index) in replacement.periods.slice(0, 2)"
                                            :key="index"
                                            class="flex flex-col items-center mb-2 space-x-2"
                                        >
                                            <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                                <span>{{ formatDate(period.start_date) }}</span>
                                            </div>
                                            <span class="flex items-center">au</span>
                                            <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                                <span>{{ formatDate(period.end_date) }}</span>
                                            </div>
                                        </div>
                                        <div
                                            class="mt-1 text-xs font-semibold text-primary cursor-pointer"
                                            @click="handleShowPeriods(replacement.periods)"
                                        >
                                            Voir tout
                                        </div>
                                    </template>
                                    <template v-else-if="replacement.start_date !== replacement.end_date && replacement.start_date != null && replacement.end_date != null">
                                        <div class="flex h-6 py-1 px-2 mb-1 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(replacement.start_date) }}</span>
                                        </div>
                                        <span class="text-xs mb-1">au</span>
                                        <div class="flex h-6 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(replacement.end_date) }}</span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div
                                            class="flex h-full w-full justify-center items-center"
                                            style="min-height: 3rem;"
                                        >
                                            <span class="bg-[#E4E7F4] rounded px-2 py-1">{{ formatDate(replacement.start_date) }}</span>
                                        </div>
                                    </template>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs px-2 py-4">
                                    <div class="bg-[#E4E7F4] rounded p-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger class="block w-full text-start">
                                                    <div class="flex flex-col space-y-1 max-h-20 overflow-y-hidden">
                                                        <span
                                                            v-for="(zipCode, index) in (Array.isArray(replacement.zip_codes) ? replacement.zip_codes : JSON.parse(replacement.zip_codes ?? '[]'))"
                                                            :key="index"
                                                            class="mr-1 text-xs"
                                                        >
                                                            {{ zipCode }}{{ index < (Array.isArray(replacement.zip_codes) ? replacement.zip_codes.length : JSON.parse(replacement.zip_codes ?? '[]').length) - 1 ? ',' : '' }}
                                                        </span>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent class="text-sm max-w-[200px]">
                                                    <div class="flex flex-wrap gap-1">
                                                        <span
                                                            v-for="(zipCode, index) in (Array.isArray(replacement.zip_codes) ? replacement.zip_codes : JSON.parse(replacement.zip_codes ?? '[]'))"
                                                            :key="'tooltip-' + index"
                                                            class="text-xs"
                                                        >
                                                            {{ zipCode }}{{ index < (Array.isArray(replacement.zip_codes) ? replacement.zip_codes.length : JSON.parse(replacement.zip_codes ?? '[]').length) - 1 ? ',' : '' }}
                                                        </span>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell
                                    class="text-xs bg-[#F1F2F7] overflow-x-hidden pt-4"
                                >
                                    <div class="flex flex-col items-center justify-center space-y-2">
                                        <Button
                                            class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white justify-center items-center"
                                            :href="`/dashboard/replacements/detail/${replacement.id}`"
                                        >
                                            <EyeIcon class="h-6 mt-1" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <span class="bg-white h-[0.01em]" />
                            </TableRow>
                        </div>
                    </TableBody>
                </Table>
            </div>

            <Dialog v-model:open="periodDialog">
                <DialogContent class="max-w-md">
                    <DialogHeader>
                        <DialogTitle class="text-base font-semibold text-primary">
                            Période de remplacement
                        </DialogTitle>
                    </DialogHeader>
                    <div class="mt-3 text-sm grid grid-cols-2 items-center font-semibold text-gray-700">
                        <h5>
                            Date de début
                        </h5>
                        <h5>
                            Date de fin
                        </h5>
                    </div>
                    <div
                        v-for="period in selectedPeriods"
                        :key="period.id"
                        class="mt-1"
                    >
                        <div class="text-sm grid grid-cols-2 items-center">
                            <span>
                                {{ formatDate(period.start_date) }}
                            </span>
                            <span>
                                {{ formatDate(period.end_date) }}
                            </span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CheckCircleIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { getPeriodsFromTimeSlot, cn } from '~/lib/utils';
import type { Replacement } from '~/lib/types';

const rawProps = defineProps({
    replacements: {
        type: Array,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
});

const props = rawProps as {
    replacements: Replacement[];
    loading: boolean;
};

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const selectedPeriods = ref([]);
const periodDialog = ref(false);

const handleShowPeriods = (periods) => {
    selectedPeriods.value = periods;
    periodDialog.value = true;
};

const normalizeTime = (time) => {
    if (!time) return null;
    return time.split(':').slice(0, 2).join(':');
};

const hasShift = (replacement, period) => {
    const periods = new Set();

    const timeSlotRaw = replacement.time_slot || replacement.timeSlot;
    if (timeSlotRaw) {
        const timeSlot = typeof timeSlotRaw === 'string' ? JSON.parse(timeSlotRaw) : timeSlotRaw;
        if (timeSlot.start_at) {
            const startAt = normalizeTime(timeSlot.start_at);
            const endAt = normalizeTime(timeSlot.end_at);

            const timeSlotPeriods = getPeriodsFromTimeSlot(startAt, endAt);
            timeSlotPeriods.forEach(p => periods.add(p));
        }
    }

    if (replacement.details && Array.isArray(replacement.details)) {
        replacement.details.forEach((detail) => {
            if (detail.start_at) {
                const startAt = normalizeTime(detail.start_at);
                const endAt = normalizeTime(detail.end_at);

                const detailPeriods = getPeriodsFromTimeSlot(startAt, endAt);
                detailPeriods.forEach(p => periods.add(p));
            }
        });
    }

    return periods.has(period);
};

const isUrgentReplacement = (replacement) => {
    return !replacement.time_slot && replacement.details.length != 0;
};

const getUniqueValues = (details, extractor, transformer = x => x) => {
    const values = details
        .flatMap(detail => extractor(detail) || [])
        .map(transformer)
        .filter(value => value);

    return [...new Set(values)];
};

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>

<style>
.no-scrollbar {
-ms-overflow-style: none;
scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
display: none;
}
</style>
