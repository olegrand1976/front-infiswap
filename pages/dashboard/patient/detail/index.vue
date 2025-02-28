<template>
    <div>
        <div class="grid grid-cols-2 gap-4">
            <section class="flex flex-col space-y-6">
                <div class="flex flex-col space-y-6 pt-4 rounded bg-gray-100">
                    <div class="flex space-x-3 items-center px-6">
                        <NuxtImg
                            src="/home/infirmier_homme.png"
                            class="w-12 h-12 rounded-full"
                        />
                        <h2 class="text-primary">
                            Information patients
                        </h2>
                    </div>

                    <div class="space-y-2 px-6">
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Nom
                            </h4>
                            <p>Richard</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Prénom
                            </h4>
                            <p>Dupond</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Téléphone
                            </h4>
                            <p>9088786786</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Email
                            </h4>
                            <p>Dupond@gmail.com</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Adresse
                            </h4>
                            <p>Rue du prévot, 42 100 La Louvrière</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Rue
                            </h4>
                            <p>123 Baker</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Ville
                            </h4>
                            <p>Liege</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Code postal
                            </h4>
                            <p>8788</p>
                        </div>
                        <div class="grid grid-cols-[30%_70%] gap-4">
                            <h4 class="font-semibold">
                                Complément
                            </h4>
                            <p>Lorem ipsum</p>
                        </div>
                    </div>

                    <div class="bg-primary h-10 rounded-b" />
                </div>

                <div class="rounded-b bg-gray-100">
                    <h1 class="p-4 bg-primary text-white rounded-t">
                        Numéro de sécurité social
                    </h1>
                    <p class="p-4">
                        089789-778-99
                    </p>
                </div>

                <div class="p-4 rounded bg-gray-100">
                    <h4 class="text-primary">
                        Heure visite théorique
                    </h4>

                    <div class="space-y-6 mt-6">
                        <div>
                            <h5 class="font-semibold">
                                Lundi
                            </h5>
                            <div class="grid grid-cols-[30%_70%] items-center">
                                <span>Matin</span>
                                <div class="rounded-full w-[14.5rem] h-9 px-3 mt-2 flex items-center space-x-3 bg-white border border-primary">
                                    <div class="flex items-center space-x-1">
                                        <Input
                                            type="time"
                                            class="bg-transparent"
                                        />
                                        <p>-</p>
                                        <Input
                                            type="time"
                                            class="bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h5 class="font-semibold">
                                Mardi
                            </h5>
                            <div class="grid grid-cols-[30%_70%] items-center">
                                <span>Après-midi</span>
                                <div class="rounded-full w-[14.5rem] h-9 px-3 mt-2 flex items-center space-x-3 bg-white border border-primary">
                                    <div class="flex items-center space-x-1">
                                        <Input
                                            type="time"
                                            class="bg-transparent"
                                        />
                                        <p>-</p>
                                        <Input
                                            type="time"
                                            class="bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h5 class="font-semibold">
                                Jeudi
                            </h5>
                            <div class="grid grid-cols-[30%_70%] items-center">
                                <span>Soir</span>
                                <div class="rounded-full w-[14.5rem] h-9 px-3 mt-2 flex items-center space-x-3 bg-white border border-primary">
                                    <div class="flex items-center space-x-1">
                                        <Input
                                            type="time"
                                            class="bg-transparent"
                                        />
                                        <p>-</p>
                                        <Input
                                            type="time"
                                            class="bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="flex flex-col space-y-6">
                <div>
                    <div class="rounded-b pb-2 bg-gray-100">
                        <h1 class="p-4 bg-primary text-white rounded-t">
                            Date de début d'intervention
                        </h1>
                        <div class="flex my-4 w-48 bg-primary px-2 rounded-full text-white justify-center mx-auto items-center h-10 border border-primary">
                            <CalendarDaysIcon class="w-5" />
                            <Input
                                type="date"
                                class="bg-transparent text-white"
                            />
                        </div>
                    </div>

                    <div class="rounded-b pb-2 bg-gray-100 mt-6">
                        <h1 class="p-4 bg-primary text-white rounded-t">
                            Date de fin d'intervention
                        </h1>
                        <div class="flex my-4 w-48 bg-primary px-2 rounded-full text-white justify-center mx-auto items-center h-10 border border-primary">
                            <CalendarDaysIcon class="w-5" />
                            <Input
                                type="date"
                                class="bg-transparent text-white"
                            />
                        </div>
                    </div>
                </div>
                <div class="mt-6 p-4 rounded bg-gray-100">
                    <h4 class="text-primary">
                        Disponibilité
                    </h4>

                    <Select>
                        <SelectTrigger
                            class="flex my-4 w-full rounded-full border border-gray-300"
                            position="right"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent class="border border-none">
                            .
                        </SelectContent>
                    </Select>
                </div>

                <div class="p-4 rounded bg-gray-100">
                    <h4 class="text-primary">
                        Type de soins à effectuer
                    </h4>

                    <Select>
                        <SelectTrigger
                            class="flex my-4 w-full rounded-full border border-gray-300"
                            position="right"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent class="border border-none">
                            .
                        </SelectContent>
                    </Select>
                </div>

                <div class="p-4 rounded bg-gray-100">
                    <h5 class="text-primary text-sm font-bold">
                        Note médicale
                    </h5>

                    <div class="my-4">
                        <h5 class="text-sm font-bold">
                            Allergie
                        </h5>

                        <Select>
                            <SelectTrigger
                                class="flex my-2 w-full rounded-full border border-gray-300"
                                position="right"
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent class="border border-none">
                                .
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="my-2">
                        <h4 class="text-sm font-bold">
                            Instruction
                        </h4>

                        <Select>
                            <SelectTrigger
                                class="flex my-2 w-full rounded-full border border-gray-300"
                                position="right"
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent class="border border-none">
                                .
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div class="p-4 rounded bg-gray-100">
                    <h4 class="text-primary">
                        Liste de ses documents
                    </h4>

                    <div class="flex flex-col space-y-2 mt-4">
                        <div class="flex justify-between">
                            <p>
                                Lorem ipsum
                            </p>
                            <ArrowDownTrayIcon class="w-5 text-primary" />
                        </div>
                        <div class="flex justify-between">
                            <p>
                                Lorem ipsum
                            </p>
                            <ArrowDownTrayIcon class="w-5 text-primary" />
                        </div>
                        <div class="flex justify-between">
                            <p>
                                Lorem ipsum
                            </p>
                            <ArrowDownTrayIcon class="w-5 text-primary" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import {
    ArrowDownTrayIcon,
    CalendarDaysIcon,
} from '@heroicons/vue/24/solid';

useHead({
    title: 'Détail du patient',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
