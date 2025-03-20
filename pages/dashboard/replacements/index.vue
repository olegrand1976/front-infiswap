<template>
    <div>
        <div class="bg-gray-100 flex flex-col space-y-4 sm:space-y-0 sm:flex-row py-4 sm:py-0 px-4 rounded-lg items-center sm:h-12">
            <h1 class="text-primary">
                Liste des
                <strong>
                    remplacements
                </strong>
            </h1>
            <div class="sm:ml-auto">
                <Button
                    class="text-sm"
                    href="/dashboard/replacements/create"
                >
                    Créer remplacement
                </Button>
            </div>
        </div>

        <div class="grid my-8">
            <Table class="hidden lg:block">
                <TableHeader class="w-full">
                    <TableRow class="grid grid-cols-6 overflow-x-hidden gap-2 border border-none">
                        <TableHead class="bg-primary xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center text-white text-xs">
                            Jour
                        </TableHead>
                        <TableHead class="bg-primary grid grid-cols-3 justify-center items-center text-white text-xs">
                            <span>Matin</span>
                            <span>Midi</span>
                            <span>Soir</span>
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center text-white text-xs">
                            Codes postaux
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center text-white text-xs">
                            Ville
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center text-white text-xs">
                            Type de soin
                        </TableHead>
                         <TableHead class="bg-primary flex justify-center items-center text-white text-xs">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <div v-if="loading">
                        <TableRow
                            v-for="(_, index) in Array.from({ length: 10 })"
                            :key="index"
                            class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden"
                        >
                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>

                            <TableCell>
                                <Skeleton class="h-10 w-full bg-gray-100" />
                            </TableCell>
                        </TableRow>
                    </div>
                    <div v-else>
                        <TableRow
                            v-for="replacement in replacements.data"
                            :key="replacement.id"
                            class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden"
                        >
                            <TableCell class="flex  justify-around items-center bg-[#F1F2F7] xl:text-[0.75em] lg:text-[0.5em]">
                                <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                    <span>{{ formatDate(replacement.start_date) }}</span>
                                </div>
                                <span class="flex items-center">au</span>
                                <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                    <span>{{ formatDate(replacement.end_date) }}</span>
                                </div>
                            </TableCell>

                            <TableCell class="grid grid-cols-3 justify-center items-center bg-[#F1F2F7] text-xs">
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'morning')"
                                    class="h-6 mx-auto text-success"
                                />
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'afternoon')"
                                    class="h-6 mx-auto text-success"
                                />
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'evening')"
                                    class="h-6 mx-auto text-success"
                                />
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] text-xs">
                                <div
                                    class="flex bg-[#E4E7F4] h-10 rounded mt-3 justify-center items-center"
                                >
                                    <span class="truncate w-full px-2">
                                        {{ replacement.details
                                            ?.map((detail) => detail?.patient?.zip_code)
                                            .filter(Boolean)
                                            .join(', ') || '' }}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] text-xs">
                                <div
                                    class="flex h-10 bg-[#E4E7F4] rounded mt-3 justify-center items-center overflow-hidden"
                                >
                                    <span class="truncate w-full px-2">
                                        {{ replacement.details
                                            ?.map((detail) => detail?.patient?.city)
                                            .filter(Boolean)
                                            .join(', ') || '' }}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] text-xs pt-6">
                                <div
                                    class="pt-3 h-10 rounded bg-[#E4E7F4] mx-auto px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                >
                                    {{ replacement.details
                                        ?.flatMap((detail) => detail.care_types?.map((careType) => careType.name) || [])
                                        .join(', ') }}
                                </div>
                            </TableCell>

                            <TableCell class="text-xs text-center bg-[#F1F2F7] pt-6 overflow-x-hidden">
                                <Button
                                    class="inline-block items-center h-10 rounded bg-[#E4E7F4] text-black hover:text-white mx-auto justify-center items-center"
                                    :href="`/dashboard/replacements/detail/${replacement.id}`"
                                >
                                    <!-- <span class="text-xs">Voir plus</span> -->
                                    <EyeIcon class="h-6 mt-1" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </div>
                </TableBody>
            </Table>

            <div class="lg:hidden">
                <div
                    v-for="replacement in replacements.data"
                    :key="replacement.id"
                    class="grid grid-cols-2 p-8 rounded bg-gray-100 mb-12"
                >
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

                        <div class="grid grid-cols-1 items-center gap-2">
                            <h4 class="flex justify-around bg-primary text-white py-2 text-center rounded">
                                <span>Matin</span>
                                <span>Après-midi</span>
                                <span>Soir</span>
                            </h4>
                            <p class="py-2 rounded">
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'morning')"
                                    class="h-6 text-success text-start ml-4"
                                />
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'afternoon')"
                                    class="h-6 text-success text-center"
                                />
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'evening')"
                                    class="h-6 text-success text-end mr-4"
                                />
                            </p>
                        </div>
                    </div>

                    <div class="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div class="grid grid-cols-1 items-center gap-2">
                            <h4 class="bg-primary text-white py-2 text-center rounded">
                                Codes postaux
                            </h4>
                            <div class="py-3 bg-gray-200 text-center rounded">
                                <p class="py-2 px-6 text-center truncate">
                                    {{ replacement.details
                                        ?.map((detail) => detail?.patient?.zip_code)
                                        .filter(Boolean)
                                        .join(', ') || '' }}
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 items-center gap-2">
                            <h4 class="bg-primary text-white py-2 text-center rounded">
                                Villes
                            </h4>
                            <div class="py-3 bg-gray-200 text-center rounded">
                                <p class="py-2 px-6 text-center truncate">
                                    {{ replacement.details
                                        ?.map((detail) => detail?.patient?.city)
                                        .filter(Boolean)
                                        .join(', ') || '' }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-2">
                        <h4 class="bg-primary text-white py-2 text-center rounded">
                            Type de soin à effectuer
                        </h4>
                        <div class="mt-3 py-3 bg-gray-200 text-center rounded">
                            <p class="truncate w-full px-6">
                                {{ replacement.details
                                    ?.flatMap((detail) => detail.care_types?.map((careType) => careType.name) || [])
                                    .join(', ') }}
                            </p>
                        </div>
                    </div>

                    <Button
                        class="col-span-2 flex justify-center text-black hover:text-white items-center text-base mx-auto mt-10 mb-4 rounded-none bg-gray-200 hover:bg-primary py-2 px-6"
                        :href="`/dashboard/replacements/detail/${replacement.id}`"
                    >
                        Voir plus
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CheckCircleIcon, EyeIcon } from '@heroicons/vue/24/outline';

import { useReplacements } from '~/composables/useReplacements';

useHead({
    title: 'Liste des remplacements',
});

const { loading, getReplacements } = useReplacements();

const replacements = await getReplacements();

onMounted(async () => {
    await getReplacements();
});

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getShift = (startAt) => {
    if (!startAt) return null;

    const [hours] = startAt.split(':').map(Number);

    if (hours >= 0 && hours < 12) {
        return 'morning';
    }
    if (hours >= 12 && hours < 18) {
        return 'afternoon';
    }
    return 'evening';
};

const hasShift = (details, period) => {
    return details.some(detail => getShift(detail.start_at) === period);
};

definePageMeta({
    layout: 'dashboard',
    middleware: ['verified'],
    ssr: false,
});
</script>
