<template>
    <div>
        <Dialog
            v-model:open="openDialog"
            class="pb-8 sm:pb-0"
        >
            <DialogContent class="max-h-[60vh] overflow-y-scroll pb-8 sm:max-h-auto max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{{ props.title }}</DialogTitle>
                    <DialogDescription>
                        {{ props.description }}
                    </DialogDescription>
                </DialogHeader>

                <section class="mt-4 flex flex-col space-y-8 justify-between">
                    <div>
                        <h5 class="font-semibold text-center sm:text-start text-primary">
                            Codes postaux et villes suggérés
                        </h5>
                        <div
                            v-if="loading"
                            class="flex ml-[20%] md:ml-[35%] items-center mt-12"
                        >
                            <RollingLoader :loading="loading" />
                        </div>
                        <div
                            v-else-if="locationData.length != 0"
                            class="mt-4 grid sm:grid-cols-2 gap-4 items-center"
                        >
                            <div
                                v-for="([zipCode, city], index) in locationData"
                                :key="`${zipCode}-${city}-${index}`"
                                class="flex items-center"
                            >
                                <label
                                    :for="`${zipCode}-${city}-${index}`"
                                    class="grid grid-cols-[10%_90%] items-center w-full text-sm font-medium border border-gray-300 rounded-full cursor-pointer hover:bg-primary hover:text-white group px-4 py-2 transition-colors"
                                    :class="{ 'bg-primary text-white': isSelected(zipCode, city) }"
                                >
                                    <Checkbox
                                        :id="`${zipCode}-${city}-${index}`"
                                        :checked="isSelected(zipCode, city)"
                                        :value="[zipCode, city]"
                                        class="group-hover:border-white"
                                        @update:checked="toggleLocation(zipCode, city)"
                                    />
                                    <span class="ml-3 w-full truncate">
                                        {{ zipCode }} - {{ city }}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div
                            v-else
                            class="mt-4"
                        >
                            <p class="mt-6 text-center text-gray-500">
                                Aucune suggestion à afficher
                            </p>
                        </div>
                    </div>
                </section>

                <DialogFooter class="my-6 flex flex-col items-center sm:flex-row gap-4 sm:space-x-4">
                    <Button
                        variant="secondary"
                        class="w-full sm:w-auto"
                        @click="cancel"
                    >
                        Annuler
                    </Button>
                    <Button
                        class="w-full sm:w-auto"
                        @click="handleCreatePreference"
                    >
                        Valider
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { useOpenai } from '@/composables/useOpenai';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

// const { getAdjacentZipCodesAndCities, loading } = useOpenai();
const { loading, getNearbyLocalities } = useLocation();
const { createPreferences } = useAuth();
const user = useUser();

const props = defineProps<{
    title: string;
    description: string;
    initialZipCodes: string[];
    initialCities: string[];
    newlyAddedValue: string;
    isPreferenceMode: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:initialZipCodes', value: string[]): void;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    (e: 'update:initialCities', value: string[]): void;
    (e: 'update:newlyAddedValue', value: string): void;
}>();

const modelValue = defineModel<boolean>();
const openDialog = computed({
    get: () => modelValue.value,
    set: (val: boolean) => modelValue.value = val,
});

const locationData = ref<[string, string][]>([]);
const tempSelectedLocations = ref<[string, string][]>([]);

const existingZipCodes = ref<string[]>([]);
const existingCities = ref<string[]>([]);

watch(
    () => [props.initialZipCodes, props.initialCities],
    ([newZipCodes, newCities]) => {
        existingZipCodes.value = [...newZipCodes].filter(zip => zip);
        existingCities.value = [...newCities].filter(city => city);
        tempSelectedLocations.value = locationData.value.filter(([zip, city]) =>
            zip && city && (existingZipCodes.value.includes(zip) || existingCities.value.includes(city)),
        );
    },
    { immediate: true, deep: true },
);

watch(
    () => openDialog.value,
    async (isOpen) => {
        if (isOpen) {
            const zipCode = props.newlyAddedValue || user.value.profile.zip_code || '';
            if (zipCode) {
                locationData.value = await getNearbyLocalities(zipCode, 5, 'be', props.initialZipCodes, props.initialCities);
            }
        }
    },
    { immediate: false },
);

const isSelected = (zipCode: string, city: string) => {
    return tempSelectedLocations.value.some(([z, c]) => z === zipCode && c === city);
};

const toggleLocation = (zipCode: string, city: string) => {
    if (!zipCode || !city) return;
    if (isSelected(zipCode, city)) {
        tempSelectedLocations.value = tempSelectedLocations.value.filter(([z, c]) => z !== zipCode || c !== city);
    }
    else {
        tempSelectedLocations.value.push([zipCode, city]);
    }
};

const handleCreatePreference = async () => {
    const inputZipCodes = [...props.initialZipCodes].filter(zip => zip);
    const inputCities = [...props.initialCities].filter(city => city);

    const selectedZipCodes = tempSelectedLocations.value.map(([zip]) => zip).filter(zip => zip);
    const selectedCities = tempSelectedLocations.value.map(([, city]) => city).filter(city => city);

    const mergedZipCodes = [...new Set([...inputZipCodes, ...selectedZipCodes])];
    const mergedCities = [...new Set([...inputCities, ...selectedCities])];

    if (props.isPreferenceMode) {
        const formData = {
            key: 'replacement',
            value: {
                zip_codes: mergedZipCodes,
                cities: mergedCities,
            },
        };

        try {
            await createPreferences(formData);
            existingZipCodes.value = mergedZipCodes;
            existingCities.value = mergedCities;
        }
        catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    await nextTick();
    emit('update:initialZipCodes', mergedZipCodes);
    emit('update:initialCities', mergedCities);
    emit('update:newlyAddedValue', '');
    openDialog.value = false;
};

const cancel = () => {
    tempSelectedLocations.value = locationData.value.filter(([zip, city]) =>
        zip && city && (existingZipCodes.value.includes(zip) || existingCities.value.includes(city)),
    );
    emit('update:newlyAddedValue', '');
    openDialog.value = false;
};
</script>
