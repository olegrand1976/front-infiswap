<template>
    <div class="">
        <div>
            <div class="bg-gray-100 flex px-9 rounded-lg items-center w-full h-[3.5rem]">
                <h1 class="text-primary">
                    Liste des
                    <strong>
                        remplacements
                    </strong>
                </h1>
            </div>

            <div class="flex justify-between mt-6">
                <Form class="flex justify-between space-x-52">
                    <FormField name="search">
                        <FormItem>
                            <FormControl>
                                <div class="flex w-64 bg-gray-100 rounded-full items-center justify-between ps-3 pe-1">
                                    <Input
                                        :v-model="search"
                                        placeholder="Rechercher"
                                        class="w-full text-xs bg-transparent"
                                    />
                                    <Button
                                        type="submit"
                                        class="bg-primary text-white w-7 h-7 rounded-full"
                                    >
                                        <MagnifyingGlassIcon class="h-7 w-7" />
                                    </Button>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <div class="flex space-x-4">
                        <FormField name="postalCode">
                            <FormItem>
                                <FormControl>
                                    <div class="flex space-x-6 bg-primary rounded-full items-center justify-between ps-3 pe-1">
                                        <h5 class="text-white text-xs">
                                            Codes postaux
                                        </h5>
                                        <Input
                                            variant="light"
                                            :v-model="postalCode"
                                            placeholder="1000 - Bruxelles"
                                            class="w-32 text-xs my-0.5 rounded-full"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>

                        <FormField name="city">
                            <FormItem>
                                <FormControl>
                                    <Input
                                        variant="light"
                                        :v-model="postalCode"
                                        placeholder="Ville"
                                        class="w-32 text-xs my-0.5 rounded-full bg-white shadow"
                                    />
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </div>
                </Form>

                <div>
                    <Button
                        class="text-sm"
                        href="/dashboard/replacement/create"
                    >
                        <PlusIcon class="w-6 h-6" />
                        Créer
                    </Button>
                </div>
            </div>

            <div class="grid my-8">
                <Table>
                    <TableHeader class="w-full">
                        <TableRow class="grid grid-cols-6 overflow-x-hidden gap-2 border border-none">
                            <TableHead class="w-48 bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                                Jour
                            </TableHead>
                            <TableHead class="w-52 ml-5 bg-primary grid grid-cols-3 justify-center items-center rounded-lg text-white text-xs">
                                <span>Matin</span>
                                <span>Midi</span>
                                <span>Soir</span>
                            </TableHead>
                            <TableHead class="w-36 ml-[3.5rem] bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                                Codes postaux
                            </TableHead>
                            <TableHead class="w-36 ml-7 bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                                Ville
                            </TableHead>
                            <TableHead class="w-64 bg-primary ml-0 flex justify-center items-center rounded-lg text-white text-xs">
                                Type de soin à pratiquer
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <template
                            v-for="replacement in replacements.data"
                            :key="replacement.id"
                        >
                            <TableRow class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden">
                                <TableCell class="w-48 flex justify-center items-center bg-gray-100 text-xs">
                                    <div class="flex h-8 py-1 px-2 rounded bg-gray-200 mx-auto justify-center items-center">
                                        <span>{{ formatDate(replacement.start_date) }}</span>
                                    </div>
                                    <span class="flex items-center">au</span>
                                    <div class="flex h-8 py-1 p x-2 rounded bg-gray-200 mx-auto justify-center items-center">
                                        <span>{{ formatDate(replacement.end_date) }}</span>
                                    </div>
                                </TableCell>

                                <TableCell class="w-52 ml-5 grid grid-cols-3 justify-center items-center pl-6 bg-gray-100 text-xs">
                                    <Switch
                                        id="morning"
                                        :checked="getShift(replacement.details[0].start_at, replacement.details[0].end_at) === 'morning'"
                                        disabled
                                    />
                                    <Switch
                                        id="afternoon"
                                        :checked="getShift(replacement.details[0].start_at, replacement.details[0].end_at) === 'afternoon'"
                                        disabled
                                    />
                                    <Switch
                                        id="evening"
                                        :checked="getShift(replacement.details[0].start_at, replacement.details[0].end_at) === 'evening'"
                                        disabled
                                    />
                                </TableCell>

                                <TableCell className="w-36 ml-[3.5rem] bg-gray-100 text-xs">
                                    <div className="flex h-10 rounded bg-gray-200 mt-3 justify-center items-center overflow-hidden">
                                        <span className="truncate w-full px-2">
                                            {{replacement.details
                                                ?.map((detail) => detail?.patient?.profile?.zip_code)
                                                .filter(Boolean) 
                                                .join(', ') || ''}}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="w-36 ml-7 bg-gray-100 text-xs">
                                    <div className="flex h-10 rounded bg-gray-200 mt-3 justify-center items-center overflow-hidden">
                                        <span className="truncate w-full px-2">
                                            {{replacement.details
                                                ?.map((detail) => detail?.patient?.profile?.city)
                                                .filter(Boolean) 
                                                .join(', ') || ''}}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="w-64 ml-0 bg-gray-100 text-xs">
                                    <div
                                        className="pt-3 h-10 rounded bg-gray-200 mx-auto px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis"
                                    >
                                        {{replacement.details
                                        ?.flatMap((detail) => detail.care_types?.map((careType) => careType.name) || [])
                                        .join(', ')}}
                                    </div>
                                </TableCell>


                                <TableCell class="w-24 ml-20 text-xs overflow-x-hidden">
                                    <Button
                                        class="flex h-10 rounded bg-gray-200 text-black hover:text-white mx-auto justify-center items-center"
                                        :href="`/dashboard/replacement/detail/${replacement.id}`"
                                    >
                                        <span class="text-xs">Voir plus</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </template>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PlusIcon, MagnifyingGlassIcon, PaperAirplaneIcon } from '@heroicons/vue/24/solid';
import { Switch } from '@/components/ui/switch';

import { useGetReplacements } from '~/composables/useReplacements';

useHead({
    title: 'Liste des remplacements',
});

const { replacements, fetchReplacements } = useGetReplacements();

onMounted(() => {
    fetchReplacements();
});

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const getShift = (startAt, endAt) => {
    if (!startAt || !endAt) return null;

    const startHour = parseInt(startAt.split(':')[0], 10);

    if (startHour >= 1 && startHour < 12) {
        return 'morning';
    }
    else if (startHour >= 12 && startHour < 18) {
        return 'afternoon';
    }
    else {
        return 'evening';
    }
};

const search = ref('');
const postalCode = ref('');

definePageMeta({
    layout: 'dashboard',
});
</script>
