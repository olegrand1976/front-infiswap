<template>
    <div class="pt-4">
        <div class="flex justify-between">
            <div class="bg-primary border border-primary rounded-2xl h-full">
                <div class="bg-white rounded-2xl flex items-center ps-4 h-10">
                    <h2 class="font-bold text-primary">
                        Période
                    </h2>
                </div>

                <div class="p-5">
                    <Form>
                        <FormField name="formData.startDate">
                            <FormItem class="flex items-center space-x-8 text-white">
                                <FormLabel>
                                    Début
                                </FormLabel>
                                <FormControl>
                                    <div class="flex px-4 w-40 space-x-1 items-center rounded-full bg-white h-10">
                                        <CalendarIcon class="w-6 h-6 text-primary" />
                                        <Input
                                            v-model="formData.startDate"
                                            placeholder="Date de début"
                                            type="text"
                                            class="text-xs w-full text-black"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>

                        <Separator class="opacity-70 my-4" />

                        <FormField name="formData.endDate">
                            <FormItem class="flex items-center space-x-[3.25rem] text-white">
                                <FormLabel>
                                    Fin
                                </FormLabel>
                                <FormControl>
                                    <div class="flex px-4 w-40 space-x-1 items-center rounded-full bg-white h-10">
                                        <CalendarIcon class="w-6 h-6 text-primary" />
                                        <Input
                                            v-model="formData.endDate"
                                            placeholder="Date de fin"
                                            type="text"
                                            class="text-xs w-full text-black"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </Form>
                </div>
            </div>

            <div>
                <RangeCalendar
                    v-model="value"
                    class="rounded-md shadow-lg"
                />
            </div>
        </div>

        <div>
            <div class="mt-10 h-12 flex items-center justify-between rounded-xl px-2 bg-gray-100">
                <div class="flex space-x-6 items-center">
                    <Form>
                        <FormField name="currentDate">
                            <FormItem>
                                <FormControl>
                                    <div class="bg-primary rounded-full h-9 px-3 text-white flex items-center">
                                        <ChevronLeftIcon
                                            class="w-5 h-5 cursor-pointer"
                                            title="Date précédente"
                                            :class="{ 'opacity-50 cursor-not-allowed': new Date(currentDate) <= new Date(formData.startDate) }"
                                            :disabled="new Date(currentDate) <= new Date(formData.startDate)"
                                            @click="decrementDate"
                                        />
                                        <Input
                                            v-model="currentDate"
                                            title="Date suivante"
                                            type="date"
                                            class="w-24 text-sm"
                                            disabled
                                        />
                                        <ChevronRightIcon
                                            class="w-5 h-5 cursor-pointer"
                                            :class="{ 'opacity-50 cursor-not-allowed': new Date(currentDate) >= new Date(formData.endDate) }"
                                            :disabled="new Date(currentDate) >= new Date(formData.endDate)"
                                            @click="incrementDate"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        </FormField>
                    </Form>
                    <div class="flex">
                        <Button
                            class="flex text-xs items-center space-x-2"
                        >
                            Copier la tournée
                            <Square2StackIcon class="w-6 h-6" />
                        </Button>
                    </div>
                </div>
                <div>
                    <Button
                        class="flex text-xs items-center space-x-2"
                    >
                        Copier tous les jours de la tournée
                        <Square2StackIcon class="w-6 h-6" />
                    </Button>
                </div>
            </div>

            <div class="mt-6">
                <Form>
                    <div class="grid overflow-x-auto">
                        <Table>
                            <TableHeader class="w-full">
                                <TableRow class="grid grid-cols-3 gap-2 border-none">
                                    <TableHead
                                        v-for="(times, period) in hours"
                                        :key="period"
                                        class="bg-primary flex justify-center items-center rounded-lg text-white text-xs"
                                    >
                                        {{ periodLabels[period] }}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                <TableRow class="grid grid-cols-3 gap-2 border-none">
                                    <TableCell
                                        v-for="(times, period) in hours"
                                        :key="period"
                                        class="p-2"
                                    >
                                        <Table class="w-full border">
                                            <TableBody class>
                                                <TableRow
                                                    v-for="(time, index) in times"
                                                    :key="index"
                                                    class="grid grid-cols-[30%_70%] items-center pr-4"
                                                >
                                                    <TableCell class="text-center border p-2 text-xs">
                                                        {{ time }}
                                                    </TableCell>
                                                    <TableCell class="border ml-auto w-6 border-none p-2">
                                                        <Checkbox
                                                            :checked="selectedTimes[period].includes(time)"
                                                            :value="time"
                                                            class="w-full rounded-full p-1 text-xs"
                                                            @update:checked="toggleSelection(time, period)"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                        <!-- <div class="mt-4">
                                            <h3>Plages horaires sélectionnées :</h3>
                                            <div>
                                                <p><strong>Matin :</strong> {{ selectedTimes.morning }}</p>
                                                <p><strong>Après-midi :</strong> {{ selectedTimes.afternoon }}</p>
                                                <p><strong>Soir :</strong> {{ selectedTimes.evening }}</p>
                                            </div>
                                        </div> -->

                                        <template v-if="selectedPatients[period]">
                                            <span class="text-center mt-6 text-sm flex justify-center items-center mx-auto font-semibold">
                                                Patient : {{ selectedPatients[period].firstName }}
                                            </span>
                                        </template>
                                        <template v-else>
                                            <PlusCircleIcon
                                                class="mt-6 w-8 h-8 flex justify-center items-center mx-auto text-primary cursor-pointer"
                                                title="Choisir le patient"
                                                @click="openModal(period)"
                                            />
                                        </template>

                                        <Dialog v-model:open="isOpen[period]">
                                            <DialogContent class="sm:max-w-xl h-[70vh]">
                                                <DialogHeader>
                                                    <DialogTitle>Détail du patient</DialogTitle>
                                                    <DialogDescription>Veuillez confirmer ici les détails concernant le patient</DialogDescription>
                                                </DialogHeader>
                                                <div class="mt-0">
                                                    <Form>
                                                        <FormField name="g">
                                                            <FormItem>
                                                                <Select v-model="selectedPatient[period]">
                                                                    <FormLabel class="font-bold">
                                                                        Choisir le patient
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <SelectTrigger
                                                                            class="flex h-10 items-center rounded-full border border-gray-300"
                                                                            position="right"
                                                                        >
                                                                            <UserPlusIcon class="text-primary w-10 h-10" />
                                                                            <span class="ml-3 w-full">{{ selectedPatient[period] ? selectedPatient[period] : 'Patient' }}</span>
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent class="border border-none">
                                                                        <SelectGroup>
                                                                            <div
                                                                                v-for="patient in patients"
                                                                                :key="patient.id"
                                                                                class="flex justify-center items-center"
                                                                            >
                                                                                <SelectItem
                                                                                    v-model="patient.id"
                                                                                    :value="`${patient.firstName} ${patient.lastName}`"
                                                                                    @click="handlePatientSelection(period, patient)"
                                                                                >
                                                                                    <div class="flex space-x-5 items-center">
                                                                                        <div>
                                                                                            <NuxtImg
                                                                                                :src="patient.avatar"
                                                                                                class="rounded-full w-10 h-10"
                                                                                            />
                                                                                        </div>
                                                                                        <div>
                                                                                            <h6 class="font-bold text-xs">
                                                                                                {{ patient.firstName }} {{ patient.lastName }} <br>
                                                                                                <span class="font-light">
                                                                                                    {{ patient.zipCode }}, {{ patient.city }}
                                                                                                </span>
                                                                                            </h6>
                                                                                        </div>
                                                                                    </div>
                                                                                </SelectItem>
                                                                            </div>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormItem>
                                                        </FormField>
                                                    </Form>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        @click="closeModal(period)"
                                                    >
                                                        Valider
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div class="mt-8 mb-12 flex justify-between items-center my-auto">
                        <div class="grid grid-cols-2 text-sm bg-primary outline outline-primary rounded-full h-9 w-48">
                            <div class="flex items-center">
                                <span class="text-white mx-auto text-center">Revenue</span>
                            </div>
                            <div class="bg-white flex items-center">
                                <span class="mx-auto text-center">8 000 £</span>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                            >
                                Créer un remplacement
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    CalendarIcon,
    Square2StackIcon,
    PlusCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    UserPlusIcon,
} from '@heroicons/vue/24/solid';

import type { DateRange } from 'radix-vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import { RangeCalendar } from '@/components/ui/range-calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

useHead({
    title: 'Créer un remplacement',
});

definePageMeta({
    layout: 'dashboard',
});

const formData = reactive({
    startDate: '',
    endDate: '',
    replacement: [
        {
            patientId: null,
            patientName: '',
            patientFirstName: '',
            patientDateOfBirth: '',
            city: '',
            zipCode: '',
            date: '',
            time: [],
            careTypes: [],
        },
    ],
});

const addReplacement = () => {
    formData.replacement.push({
        patientId: null,
        patientName: '',
        patientFirstName: '',
        patientDateOfBirth: '',
        city: '',
        zipCode: '',
        date: '',
        time: [],
        careTypes: [],
    });
};

const selectedTimes = reactive({
    morning: [],
    afternoon: [],
    evening: [],
});

const selectedPatients = reactive({
    morning: null,
    afternoon: null,
    evening: null,
});

const selectedPatient = reactive({
    morning: null,
    afternoon: null,
    evening: null,
});

const handlePatientSelection = (period, patient) => {
    selectedPatients[period] = patient;
    selectedPatient[period] = `${patient.firstName} ${patient.lastName}`;
};

const hoursToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

const updateTimeSelection = (period) => {
    if (selectedTimes[period].length === 0) {
        return;
    }

    const sortedTimes = [...selectedTimes[period]].sort((a, b) => hoursToMinutes(a) - hoursToMinutes(b));

    const startTime = sortedTimes[0];
    const endTime = sortedTimes[sortedTimes.length - 1];

    selectedTimes[period] = [startTime, endTime];
};

const toggleSelection = (time, period) => {
    const index = selectedTimes[period].indexOf(time);
    if (index === -1) {
        selectedTimes[period].push(time);
    }
    else {
        selectedTimes[period].splice(index, 1);
    }

    updateTimeSelection(period);
};

const currentDate = ref('');

/* const scheduleSlots = {
    dateJour: {
        slotTime: {
            patient: {
                id: '',
                nom: '',
                prenom: '',
                typeSoin: [

                ],
                time: [
                    8, 10,
                ],
            },
        },
    },
},

const date = ref(formData.startDate);
const stockSlot = reactive(null);
const formDatas = {
    startDate: formData.startDate,
    endDate: formData.endDate,
    // {...scheduleSlots, 20250130:slotTime},
}; */

const start = today(getLocalTimeZone());
const end = start.add({ days: 7 });

const value = ref({
    start,
    end,
}) as Ref<DateRange>;

const hours = ref({
    morning: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'],
    afternoon: ['12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    evening: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
});

const periodLabels = {
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soir',
};

const isOpen = ref<{ [key: string]: boolean }>({
    morning: false,
    afternoon: false,
    evening: false,
});

const openModal = (period: string) => {
    isOpen.value[period] = true;
};

const closeModal = (period) => {
    isOpen.value[period] = false;
};

watch(value, (newValue) => {
    if (newValue?.start && newValue?.end) {
        formData.startDate = newValue.start.toString();
        formData.endDate = newValue.end.toString();
        currentDate.value = newValue.start.toString();
    }
});

const incrementDate = () => {
    const nextDate = new Date(currentDate.value);
    nextDate.setDate(nextDate.getDate() + 1);

    if (nextDate <= new Date(formData.endDate)) {
        currentDate.value = nextDate.toISOString().split('T')[0];
    }
};

const decrementDate = () => {
    const prevDate = new Date(currentDate.value);
    prevDate.setDate(prevDate.getDate() - 1);

    if (prevDate >= new Date(formData.startDate)) {
        currentDate.value = prevDate.toISOString().split('T')[0];
    }
};

const patients = [
    {
        id: 1,
        firstName: 'Jean Paul',
        lastName: 'Dubois',
        dateOfBirth: '2024-01-02',
        city: 'Bruxelles',
        zipCode: '7768',
        avatar: '/home/infirmier_homme.png',
    },
    {
        id: 2,
        firstName: 'Marie',
        lastName: 'Claire',
        dateOfBirth: '2024-02-03',
        city: 'Genève',
        zipCode: '7760',
        avatar: '/home/infirmier_femme.png',
    },
];
</script>
