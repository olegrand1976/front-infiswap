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
                                        class="w-full text-xs"
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
                </Form>

                <div>
                    <Button class="text-sm">
                        <PlusIcon class="w-6 h-6" />
                        Créer
                    </Button>
                </div>
            </div>

            <div class="grid overflow-x-auto mt-8">
                <Table>
                    <TableHeader class="w-full">
                        <TableRow class="grid grid-cols-4 gap-2 border border-none">
                            <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                                Nom
                            </TableHead>
                            <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                                Jour
                            </TableHead>
                            <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                                Code postal
                            </TableHead>
                            <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white text-xs">
                                Type de soin à pratiquer
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <template
                            v-for="replacement in replacements"
                            :key="replacement.id"
                        >
                            <TableRow class="grid grid-cols-4 gap-2 border border-none">
                                <TableCell class="w-full bg-gray-100 text-xs">
                                    <div class="flex bg-gray-200 rounded mx-auto space-x-3 justify-center items-center">
                                        <div>
                                            <NuxtImg
                                                :src="replacement.user.img"
                                                :alt="replacement.user.fullname"
                                                class="object-cover object-center w-10 h-10 rounded-full"
                                            />
                                        </div>
                                        <span>{{ replacement.user.fullname }}</span>
                                    </div>
                                </TableCell>

                                <TableCell class="w-full bg-gray-100 text-xs">
                                    <div class="flex h-10 rounded bg-gray-200 mx-auto justify-center items-center">
                                        <span>{{ replacement.day }}</span>
                                    </div>
                                </TableCell>

                                <TableCell class="w-full bg-gray-100 text-xs">
                                    <div class="flex h-10 rounded bg-gray-200 mx-auto justify-center items-center">
                                        <span>{{ replacement.postalCode }}</span>
                                    </div>
                                </TableCell>

                                <TableCell class="w-full bg-gray-100 text-xs">
                                    <div class="flex h-10 rounded bg-gray-200 mx-auto justify-center items-center">
                                        <span>{{ replacement.careType }}</span>
                                    </div>
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
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';

useHead({
    title: 'Liste des remplacements',
});

const search = ref('');
const postalCode = ref('');

const replacements = [
    {
        id: 1,
        user: {
            fullname: 'Richard Dupond',
            img: '/home/infirmier_homme.png',
        },
        day: '24/01/2025',
        postalCode: '7000 - Mons',
        careType: 'Bandage',
    },
    {
        id: 2,
        user: {
            fullname: 'Richard Dupond',
            img: '/home/infirmier_homme.png',
        },
        day: '24/01/2025',
        postalCode: '7000 - Mons',
        careType: 'Bandage',
    },
    {
        id: 3,
        user: {
            fullname: 'Richard Dupond',
            img: '/home/infirmier_homme.png',
        },
        day: '24/01/2025',
        postalCode: '7000 - Mons',
        careType: 'Bandage',
    },
    {
        id: 4,
        user: {
            fullname: 'Richard Dupond',
            img: '/home/infirmier_homme.png',
        },
        day: '24/01/2025',
        postalCode: '7000 - Mons',
        careType: 'Bandage',
    },
    {
        id: 5,
        user: {
            fullname: 'Richard Dupond',
            img: '/home/infirmier_homme.png',
        },
        day: '24/01/2025',
        postalCode: '7000 - Mons',
        careType: 'Bandage',
    },
];

definePageMeta({
    layout: 'dashboard',
});
</script>
