<template>
    <div>
        <div class="bg-gray-100 flex px-4 rounded-lg items-center h-12">
            <h1 class="text-primary">
                Liste des
                <strong>
                    remplacements
                </strong>
            </h1>
            <div class="ml-auto">
                <Button
                    class="text-sm"
                    href="/dashboard/replacements/create"
                >
                    Créer remplacement
                </Button>
            </div>
        </div>

        <div class="grid my-8">
            <Table>
                <TableHeader class="w-full">
                    <TableRow class="grid grid-cols-6 overflow-x-hidden gap-2 border border-none">
                        <TableHead class="bg-primary xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center rounded-lg text-white text-xs">
                            Jour
                        </TableHead>
                        <TableHead class="bg-primary grid grid-cols-3 justify-center items-center rounded-lg text-white text-xs">
                            <span>Matin</span>
                            <span>Midi</span>
                            <span>Soir</span>
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Codes postaux
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Ville
                        </TableHead>
                        <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                            Type de soin
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
                            <TableCell class="flex justify-center items-center bg-gray-100 xl:text-[0.75em] lg:text-[0.5em]">
                                <div class="flex h-8 py-1 px-2 rounded bg-gray-200 justify-center items-center">
                                    <span>{{ formatDate(replacement.start_date) }}</span>
                                </div>
                                <span class="flex items-center">au</span>
                                <div class="flex h-8 py-1 px-2 rounded bg-gray-200 justify-center items-center">
                                    <span>{{ formatDate(replacement.end_date) }}</span>
                                </div>
                            </TableCell>

                            <TableCell class="grid grid-cols-3 justify-center items-center bg-gray-100 text-xs">
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'morning')"
                                    class="h-6 mx-auto text-green-500"
                                />
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'afternoon')"
                                    class="h-6 mx-auto text-green-500"
                                />
                                <CheckCircleIcon
                                    v-if="hasShift(replacement.details, 'evening')"
                                    class="h-6 mx-auto text-green-500"
                                />
                            </TableCell>

                            <TableCell class="bg-gray-100 text-xs">
                                <div
                                    class="flex bg-gray-200 h-10 rounded mt-3 justify-center items-center"
                                >
                                    <span class="truncate w-full px-2">
                                        {{ replacement.details
                                            ?.map((detail) => detail?.patient?.zip_code)
                                            .filter(Boolean)
                                            .join(', ') || '' }}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell class="bg-gray-100 text-xs">
                                <div
                                    class="flex h-10 bg-gray-200 rounded mt-3 justify-center items-center overflow-hidden"
                                >
                                    <span class="truncate w-full px-2">
                                        {{ replacement.details
                                            ?.map((detail) => detail?.patient?.city)
                                            .filter(Boolean)
                                            .join(', ') || '' }}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell class="bg-gray-100 text-xs pt-6">
                                <div
                                    class="pt-3 h-10 rounded bg-gray-200 mx-auto px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                >
                                    {{ replacement.details
                                        ?.flatMap((detail) => detail.care_types?.map((careType) => careType.name) || [])
                                        .join(', ') }}
                                </div>
                            </TableCell>

                            <TableCell class="text-xs pt-6 overflow-x-hidden">
                                <Button
                                    class="flex h-10 rounded bg-gray-200 text-black hover:text-white mx-auto justify-center items-center"
                                    :href="`/dashboard/replacements/detail/${replacement.id}`"
                                >
                                    <span class="text-xs">Voir plus</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </div>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

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
