<template>
    <Form>
        <div class="grid grid-cols-2 gap-12 pt-4">
            <div class="space-y-4">
                <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                    <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                        <label for="lastname">
                            Nom
                        </label>
                    </div>
                    <Input
                        v-model="formData.lastname"
                        type="text"
                        class="w-full bg-transparent"
                    />
                </div>

                <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                    <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                        <label for="firstname">
                            Prénoms
                        </label>
                    </div>
                    <Input
                        v-model="formData.firstname"
                        type="text"
                        class="w-full bg-transparent"
                    />
                </div>

                <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                    <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                        <label for="soci&a">
                            Sécurité sociale
                        </label>
                    </div>
                    <Input
                        v-model="formData.socialSecurityNumber"
                        type="text"
                        placeholder="000000.000.00"
                        class="w-full bg-transparent"
                    />
                </div>

                <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                    <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                        <label for="email">
                            Email
                        </label>
                    </div>
                    <Input
                        v-model="formData.email"
                        type="email"
                        class="w-full bg-transparent"
                    />
                </div>

                <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                    <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                        <label for="phoneNumber">
                            Téléphone
                        </label>
                    </div>
                    <Input
                        v-model="formData.phoneNumber"
                        type="text"
                        class="w-full bg-transparent"
                    />
                </div>

                <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                    <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                        <label for="zipCode">
                            Code postal
                        </label>
                    </div>
                    <Input
                        v-model="formData.zipCode"
                        type="text"
                        class="w-full bg-transparent"
                    />
                </div>

                <div class="grid grid-cols-[30%_70%] border border-primary h-9 rounded-full">
                    <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                        <label for="zipCode">
                            Disponibilité
                        </label>
                    </div>
                    <Select v-model="formData.availability">
                        <SelectTrigger
                            class="w-full bg-transparent text-nowrap border border-none"
                            position="right"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent class="border border-none">
                            <template
                                v-for="[key, value] in Object.entries(availabilities)"
                                :key="key"
                            >
                                <SelectItem :value="key">
                                    {{ value }}
                                </SelectItem>
                            </template>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div class="flex flex-col space-y-4">
                <div class="space-y-4">
                    <div>
                        <h3 class="p-2 bg-primary text-white rounded-t">
                            Date de début d'intervention
                        </h3>
                        <div class="bg-gray-100 p-4">
                            <div class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52">
                                <CalendarDaysIcon class="w-5" />
                                <Input
                                    v-model="formData.startDate"
                                    type="date"
                                    class="bg-transparent"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="p-2 bg-primary text-white rounded-t">
                            Date de fin d'intervention
                        </h3>
                        <div class="bg-gray-100 p-4">
                            <div class="flex justify-center mx-auto bg-primary rounded-full px-3 h-9 items-center text-white w-52">
                                <CalendarDaysIcon class="w-5" />
                                <Input
                                    v-model="formData.endDate"
                                    type="date"
                                    class="bg-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="bg-gray-100 p-5 rounded">
                        <h3 class="text-primary">
                            Heure de visite théorique
                        </h3>
                        <div class="grid grid-cols-[30%_70%] items-center mt-4">
                            <h5>
                                Jour
                            </h5>
                            <Select>
                                <SelectTrigger
                                    class="w-full bg-white shadow rounded-full text-nowrap border border-none"
                                    position="right"
                                >
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent class="border border-none">
                                    <template
                                        v-for="[key, value] in Object.entries(days)"
                                        :key="key"
                                    >
                                        <SelectItem :value="key">
                                            {{ value }}
                                        </SelectItem>
                                    </template>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="grid grid-cols-[30%_70%] items-center mt-4">
                            <h5>
                                Type de soin
                            </h5>
                            <Select>
                                <SelectTrigger
                                    class="w-full bg-white shadow rounded-full text-nowrap border border-none"
                                    position="right"
                                >
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent class="border border-none">
                                    <template
                                        v-for="[key, value] in Object.entries(days)"
                                        :key="key"
                                    >
                                        <SelectItem :value="key">
                                            {{ value }}
                                        </SelectItem>
                                    </template>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Button
            class="my-12 flex justify-center items-center mx-auto"
            type="submit"
        >
            Enregistrer
        </Button>
    </Form>
</template>

<script lang="ts" setup>
import { CalendarDaysIcon } from '@heroicons/vue/24/solid';

const formData = reactive({
    lastname: '',
    firstname: '',
    phoneNumber: '',
    email: '',
    socialSecurityNumber: '',
    zipCode: '',
    availability: '',
    startDate: '',
    endDate: '',
});

const availabilities = {
    available: 'Disponible',
    unavailable: 'Indisponible',
    absent: 'Absent',
    hospitalized: 'Hospitalisé',
    on_vacation: 'En vacances',
};

const days = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
};

useHead({
    title: 'Créer un patient',
});

definePageMeta({
    layout: 'dashboard',
});
</script>
