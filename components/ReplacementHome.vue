<template>
    <div>
        <div class="grid my-8">
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
                                v-for="replacement in replacements"
                                :key="replacement.id"
                                class="grid grid-cols-5 gap-2 border border-none overflow-x-hidden relative"
                            >
                                <div
                                    v-if="isUrgentReplacement(replacement)"
                                    class="urgent-indicator"
                                >
                                    URGENT
                                </div>

                                <TableCell class="flex justify-center items-center bg-[#F1F2F7] xl:text-[0.75em] lg:text-[0.5em]">
                                    <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(replacement.start_date) }}</span>
                                    </div>
                                    <span class="flex items-center">au</span>
                                    <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(replacement.end_date) }}</span>
                                    </div>
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
                                                            v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                            :key="index"
                                                            :class="'mr-1'"
                                                        >
                                                            {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                        </span>
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span
                                                        v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                        :key="index"
                                                        :class="'mr-1'"
                                                    >
                                                        {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
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
                                                            v-for="(city, index) in JSON.parse(replacement.cities)"
                                                            :key="index"
                                                            :class="'mr-1'"
                                                        >
                                                            {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
                                                        </span>
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span
                                                        v-for="(city, index) in JSON.parse(replacement.cities)"
                                                        :key="index"
                                                        :class="'mr-1'"
                                                    >
                                                        {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
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
                <div v-if="loading">
                    <div
                        v-for="(_, index) in Array.from({ length: 3 })"
                        :key="index"
                        class="grid grid-cols-1"
                    >
                        <Skeleton class="h-32 w-full bg-gray-100" />
                    </div>
                </div>
                <div v-else-if="!replacements">
                    <p class="text-center text-gray-500 py-8">
                        Aucun résultat n'est trouvé
                    </p>
                </div>
                <div
                    v-for="replacement in replacements.slice(0, 1)"
                    v-else
                    :key="replacement?.id"
                    class="grid grid-cols-2 gap-4 rounded bg-gray-100 mb-16 relative"
                >
                    <div
                        v-if="isUrgentReplacement(replacement)"
                        class="urgent-indicator mt-9"
                    >
                        URGENT
                    </div>

                    <div class="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div class="grid grid-cols-1 items-center gap-2">
                            <h4 class="bg-primary text-white py-2 text-center rounded">
                                Jour
                            </h4>
                            <div class="py-3 bg-gray-200 text-center rounded">
                                <span class="py-1 px-3 bg-gray-300">{{ formatDate(replacement.start_date) }}</span>
                                <span>   au   </span>
                                <span class="py-1 px-3 bg-gray-300">{{ formatDate(replacement.end_date) }}</span>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <div class="grid grid-cols-3 bg-primary text-white py-2 rounded-md">
                                <span class="text-center text-sm">Matin</span>
                                <span class="text-center text-sm">Après-midi</span>
                                <span class="text-center text-sm">Soir</span>
                            </div>
                            <div class="grid grid-cols-3 py-2">
                                <div class="flex justify-center">
                                    <CheckCircleIcon
                                        v-if="hasShift(replacement, 'morning')"
                                        class="h-5 w-5 text-success"
                                    />
                                    <span
                                        v-else
                                        class="h-5 w-5"
                                    />
                                </div>
                                <div class="flex justify-center">
                                    <CheckCircleIcon
                                        v-if="hasShift(replacement, 'afternoon')"
                                        class="h-5 w-5 text-success"
                                    />
                                    <span
                                        v-else
                                        class="h-5 w-5"
                                    />
                                </div>
                                <div class="flex justify-center">
                                    <CheckCircleIcon
                                        v-if="hasShift(replacement, 'evening')"
                                        class="h-5 w-5 text-success"
                                    />
                                    <span
                                        v-else
                                        class="h-5 w-5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div class="grid grid-cols-1 items-center gap-2">
                            <h4 class="bg-primary text-white py-2 text-center rounded">
                                {{ JSON.parse(replacement.zip_codes).length > 1 ? 'Codes postaux' : 'Code postal' }}
                            </h4>
                            <div class="py-3 bg-gray-200 text-center rounded">
                                <p class="py-2 px-2 text-center truncate">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                    <span
                                                        v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                        :key="index"
                                                        :class="'mr-1'"
                                                    >
                                                        {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                    </span>
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span
                                                    v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                    :key="index"
                                                    :class="'mr-1'"
                                                >
                                                    {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 items-center gap-2">
                            <h4 class="bg-primary text-white py-2 text-center rounded">
                                {{ JSON.parse(replacement.cities).length > 1 ? 'Villes' : 'Ville' }}
                            </h4>
                            <div class="py-3 bg-gray-200 text-center rounded">
                                <p class="py-2 px-2 text-center truncate w-full">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                    <span
                                                        v-for="(city, index) in JSON.parse(replacement.cities)"
                                                        :key="index"
                                                        :class="'mr-1'"
                                                    >
                                                        {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
                                                    </span>
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span
                                                    v-for="(city, index) in JSON.parse(replacement.cities)"
                                                    :key="index"
                                                    :class="'mr-1'"
                                                >
                                                    {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-2">
                        <h4 class="bg-primary text-white py-2 text-center rounded">
                            {{ replacement.care_types.length <= 1 ? 'Type de soin' : 'Types de soins' }}
                        </h4>
                        <div class="mt-3 py-3 bg-gray-200 text-center rounded">
                            <p class="truncate w-full px-2">
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
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CheckCircleIcon, EyeIcon } from '@heroicons/vue/24/outline';
import { useReplacements } from '~/composables/useReplacements';
import { getPeriodsFromTimeSlot } from '~/lib/utils';

const { loading, replacements, getAccordingReplacements } = useReplacements();

onMounted(() => {
    getAccordingReplacements();
});

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
