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
                        <FormField name="startDate">
                            <FormItem>
                                <FormControl>
                                    <div class="bg-primary rounded-full h-9 px-3 text-white flex items-center">
                                        <ChevronLeftIcon
                                            class="w-5 h-5 cursor-pointer"
                                            title="Date précédente"
                                            :class="{ 'opacity-90': new Date(currentDate) <= new Date(formData.startDate) }"
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
                                            <TableBody>
                                                <TableRow
                                                    v-for="(time, index) in times"
                                                    :key="index"
                                                    class="grid grid-cols-[30%_70%] items-center pr-4"
                                                >
                                                    <TableCell class="text-center border p-2 text-xs">
                                                        {{ time }}
                                                    </TableCell>
                                                    <TableCell class="border border-none p-2">
                                                        <span>.</span>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                        <PlusCircleIcon
                                            class="mt-6 w-8 h-8 flex justify-center items-center mx-auto text-primary cursor-pointer"
                                            title="Choisir le patient"
                                            @click="openModal(period)"
                                        />

                                        <Dialog v-model:open="isOpen[period]">
                                            <DialogContent class="sm:max-w-xl h-[70vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Détail du patient</DialogTitle>
                                                    <DialogDescription>Veuillez confirmer ici les détails concernant le patient</DialogDescription>
                                                </DialogHeader>

                                                <div class="mt-6 grid grid-cols-1 gap-4 mx-8">
                                                    <FormField name="fullname">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <UserCircleIcon class="w-6 h-6" />
                                                                        <span>Nom</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="formData.replacement[0].patientName"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

                                                    <FormField name="firstname">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex relative h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <UserCircleIcon class="w-6 h-6" />
                                                                        <PlusIcon class="w-3 h-3 absolute top-0 left-4" />
                                                                        <span>Prénoms</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="formData.replacement[0].patientFirstName"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

                                                    <FormField name="patientDateOfBirth">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <CalendarIcon class="w-6 h-6" />
                                                                        <span>Naissance</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="formData.replacement[0].patientDateOfBirth"
                                                                        type="date"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

                                                    <FormField name="city">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <NuxtImg
                                                                            src="/icons/city_white.png"
                                                                            class="w-6 h-6"
                                                                        />
                                                                        <span>Ville</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="formData.replacement[0].city"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>

                                                    <FormField name="zipCode">
                                                        <FormItem>
                                                            <FormControl class="grid grid-cols-[30%_70%] items-center rounded-full border border-primary">
                                                                <div>
                                                                    <FormLabel class="flex h-9 rounded-s-full text-xs bg-primary text-white space-x-4 items-center pl-4">
                                                                        <NuxtImg
                                                                            src="/icons/city_white.png"
                                                                            class="w-6 h-6"
                                                                        />
                                                                        <span>Code postal</span>
                                                                    </FormLabel>
                                                                    <Input
                                                                        v-model="formData.replacement[0].city"
                                                                        variant="transparent"
                                                                        class="text-black"
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                        </FormItem>
                                                    </FormField>
                                                </div>

                                                <FormField name="careTypes">
                                                    <FormItem class="my-4">
                                                        <FormControl>
                                                            <FormLabel class="font-bold text-lg">
                                                                Séléctionnez le type de soin
                                                            </FormLabel>
                                                            <ul class="grid grid-cols-2 container gap-4">
                                                                <li
                                                                    v-for="care in careTypes"
                                                                    :key="care.id"
                                                                    class="text-xs h-8 cursor-pointer flex rounded-full justify-center items-center"
                                                                    :class="{
                                                                        'bg-primary text-white': isSelected(care),
                                                                        'border border-primary': !isSelected(care),
                                                                    }"
                                                                    @click="toggleSelectionCare(care)"
                                                                >
                                                                    <span>{{ care.name }}</span>
                                                                </li>
                                                            </ul>
                                                        </FormControl>
                                                    </FormItem>
                                                </FormField>

                                                <DialogFooter>
                                                    <Button>
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

                    <div class="mt-8 mb-16 flex justify-between items-center">
                        <div class="h-10 w-44 bg-white text-sm rounded-full border border-primary grid grid-cols-2">
                            <div class="bg-primary flex rounded-s-full justify-center items-center px-auto">
                                <span class="text-center text-white">Revenu</span>
                            </div>
                            <div class="flex justify-center items-center mx-auto">
                                <span class="text-center">8 000 £</span>
                            </div>
                        </div>

                        <div>
                            <Button>
                                Enregistrer
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
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusCircleIcon,
    UserCircleIcon,
    PlusIcon,
} from '@heroicons/vue/24/solid';

import type { DateRange } from 'radix-vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import { RangeCalendar } from '@/components/ui/range-calendar';

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

const start = today(getLocalTimeZone());
const end = null;

/** Function for dynamic date selection in range calendar */
const value = ref({
    start,
    end,
}) as Ref<DateRange>;

watch(value, (newValue) => {
    if (newValue?.start) {
        const localStartDate = new Date(newValue.start.year, newValue.start.month - 1, newValue.start.day);
        formData.startDate = localStartDate.toLocaleDateString('fr-CA');
        currentDate.value = formData.startDate;
    }
    if (newValue?.end) {
        const localEndDate = new Date(newValue.end.year, newValue.end.month - 1, newValue.end.day);
        formData.endDate = localEndDate.toLocaleDateString('fr-CA');
    }
});

const currentDate = ref('');

const incrementDate = () => {
    if (!currentDate.value) return;

    const nextDate = new Date(currentDate.value);
    nextDate.setDate(nextDate.getDate() + 1);

    if (nextDate.toISOString().split('T')[0] <= formData.endDate) {
        currentDate.value = nextDate.toLocaleDateString('fr-CA');
    }
};

const decrementDate = () => {
    if (!currentDate.value) return;

    const prevDate = new Date(currentDate.value);
    prevDate.setDate(prevDate.getDate() - 1);

    if (prevDate.toISOString().split('T')[0] >= formData.startDate) {
        currentDate.value = prevDate.toLocaleDateString('fr-CA');
    }
};
/** */

/** Multiple times selection configuration */
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
/** */

/** Dialog configuration */
const isOpen = ref<{ [key: string]: boolean }>({
    morning: false,
    afternoon: false,
    evening: false,
});

const openModal = (period: string) => {
    isOpen.value[period] = true;
};
/** */

/** Patient configuration */
/** */

/** Caretype configuration */
const { careTypes, fetchCareTypes } = useCareTypes();

onMounted(() => {
    fetchCareTypes();
});

const selectedCareTypes = ref([]);

const isSelected = (care) => {
    return selectedCareTypes.value.some(item => item.id === care.id);
};

const toggleSelectionCare = (care) => {
    const index = selectedCareTypes.value.findIndex(item => item.id === care.id);
    if (index > -1) {
        selectedCareTypes.value.splice(index, 1);
    }
    else {
        selectedCareTypes.value.push(care);
    }
};
/** */

useHead({
    title: 'Créer un remplacement',
});

definePageMeta({
    layout: 'dashboard',
});
</script>
