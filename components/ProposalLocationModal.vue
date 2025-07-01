<template>
    <div>
        <Dialog
            v-model:open="openDialog"
            class="pb-8 sm:pb-0"
        >
            <DialogContent class="max-h-[60vh] overflow-y-scroll pb-8 sm:max-h-auto max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Préférences</DialogTitle>
                    <DialogDescription>
                        Cochez une ou plusieurs codes postaux/villes suggérés pour l'encodage de vos préférences.
                    </DialogDescription>
                </DialogHeader>

                <section class="mt-4 flex flex-col space-y-8 justify-between">
                    <div>
                        <h5 class="font-semibold text-center sm:text-start text-primary">
                            Codes postaux et villes suggérés
                        </h5>
                        <div
                            v-if="loading"
                            class="flex justify-center items-center mt-6 space-x-2"
                        >
                            <p class="text-center text-gray-500">
                                Chargement des suggestions
                            </p>
                            <span class="animate-bounce text-gray-500">.</span>
                            <span class="animate-bounce text-gray-500 delay-150">.</span>
                            <span class="animate-bounce text-gray-500 delay-300">.</span>
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
import { useAuth } from '~/composables/useAuth';
import type { User, UserSettings } from '~/lib/types';

const { getAdjacentZipCodesAndCities, loading } = useOpenai();
const { createPreferences } = useAuth();
const user = useState<User>('user');

const props = defineProps<{
    initialZipCodes: string[];
    initialCities: string[];
    isPreferenceMode?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:initialZipCodes', value: string[]): void;
    (e: 'update:initialCities', value: string[]): void;
}>();

const modelValue = defineModel<boolean>();
const openDialog = computed({
    get: () => modelValue.value,
    set: (val: boolean) => modelValue.value = val,
});

const locationData = ref<[string, string][]>([]);

const tempSelectedLocations = ref<[string, string][]>(props.initialZipCodes.map((zip, i) => [zip, props.initialCities[i]]));

const isSelected = (zipCode: string, city: string) => {
    return tempSelectedLocations.value.some(([z, c]) => z === zipCode && c === city);
};

const toggleLocation = (zipCode: string, city: string) => {
    if (isSelected(zipCode, city)) {
        tempSelectedLocations.value = tempSelectedLocations.value.filter(([z, c]) => !(z === zipCode && c === city));
    }
    else {
        tempSelectedLocations.value.push([zipCode, city]);
    }
};

const handleCreatePreference = async () => {
    const selectedZipCodes = tempSelectedLocations.value.map(([zip]) => zip);
    const selectedCities = tempSelectedLocations.value.map(([, city]) => city);

    const mergedZipCodes = [...new Set([...props.initialZipCodes, ...selectedZipCodes])];
    const mergedCities = [...new Set([...props.initialCities, ...selectedCities])];

    if (props.isPreferenceMode) {
        const settings: UserSettings = JSON.parse(user.value.settings || '{}');
        const existingLocations = (settings.replacement?.zip_codes ?? []).map((zip, i) => [zip, settings.replacement?.cities[i] ?? '']);

        const mergedLocations = [...existingLocations];
        tempSelectedLocations.value.forEach(([zip, city]) => {
            if (!mergedLocations.some(([z, c]) => z === zip && c === city)) {
                mergedLocations.push([zip, city]);
            }
        });

        const finalLocations = mergedLocations.filter(([zip, city]) =>
            tempSelectedLocations.value.some(([z, c]) => z === zip && c === city)
            || !locationData.value.some(([z, c]) => z === zip && c === city),
        );

        const formData = {
            key: 'replacement',
            value: {
                zip_codes: finalLocations.map(([zip]) => zip),
                cities: finalLocations.map(([, city]) => city),
            },
        };

        try {
            await createPreferences(formData);
        }
        catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }
    emit('update:initialZipCodes', mergedZipCodes);
    emit('update:initialCities', mergedCities);
    openDialog.value = false;
};

const cancel = () => {
    tempSelectedLocations.value = props.initialZipCodes.map((zip, i) => [zip, props.initialCities[i]]);
    openDialog.value = false;
};

onMounted(async () => {
    locationData.value = await getAdjacentZipCodesAndCities(user.value.profile.zip_code, props.initialZipCodes, props.initialCities);
});
</script>
