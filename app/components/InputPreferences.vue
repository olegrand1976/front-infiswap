<template>
    <div>
        <form class="w-full grid 2xl:grid-cols-2 gap-6">
            <div>
                <label class="font-semibold text-primary">Codes postaux</label>
                <div class="grid gap-3 mt-3">
                    <div
                        v-for="i in 4"
                        :key="'zip-' + i"
                        class="flex relative items-center gap-2 rounded-full border border-primary bg-white"
                    >
                        <div
                            v-if="showZipTooltip[i - 1]"
                            class="absolute -top-10 left-2 text-xs bg-white shadow rounded-md p-2"
                        >
                            Cliquez sur “Ajouter” pour valider votre saisie.
                        </div>

                        <InputIcon
                            v-model="zipInputs[i - 1]"
                            type="text"
                            :placeholder="user.profile.country === 'fr' ? '75000' : '1000'"
                            class="border-none flex-1 w-full"
                            :input-class="true"
                            @input="onZipInput(i - 1)"
                        />
                        <Button
                            class="bg-primary text-white rounded-full hover:bg-primary/90 h-10"
                            @click="isInitialZip(i - 1) ? removeZip(i - 1) : saveZip(i - 1)"
                        >
                            {{ isInitialZip(i - 1) ? 'Retirer' : 'Ajouter' }}
                        </Button>
                    </div>
                </div>
            </div>

            <div>
                <label class="font-semibold text-primary">Villes</label>
                <div class="grid gap-3 mt-3">
                    <div
                        v-for="i in 4"
                        :key="'city-' + i"
                        class="flex relative items-center gap-2 rounded-full border border-primary bg-white"
                    >
                        <div
                            v-if="showCityTooltip[i - 1]"
                            class="absolute -top-10 left-2 text-xs bg-white shadow rounded-md p-2"
                        >
                            Cliquez sur “Ajouter” pour valider votre saisie.
                        </div>

                        <InputIcon
                            v-model="cityInputs[i - 1]"
                            type="text"
                            :placeholder="user.profile.country === 'fr' ? 'Paris' : 'Bruxelles'"
                            class="border-none flex-1 w-full bg-transparent"
                            :input-class="true"
                            @input="onCityInput(i - 1)"
                        />
                        <Button
                            size="sm"
                            class="bg-primary text-white rounded-full hover:bg-primary/90 h-10"
                            @click="isInitialCity(i - 1) ? removeCity(i - 1) : saveCity(i - 1)"
                        >
                            {{ isInitialCity(i - 1) ? 'Retirer' : 'Ajouter' }}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { useAuth } from '~/composables/useAuth';
import type { User } from '~/lib/types';

const props = defineProps<{
    initialZipCodes: string[];
    initialCities: string[];
}>();

const emit = defineEmits<{
    (e: 'update:initialZipCodes', v: string[]): void;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    (e: 'update:initialCities', v: string[]): void;
    (e: 'open-proposal', v: string): void;
}>();

const { createPreferences } = useAuth();
const user = useState<User>('user');

const zipCodes = ref([...props.initialZipCodes]);
const cities = ref([...props.initialCities]);

const showZipTooltip = ref([false, false, false, false]);
const showCityTooltip = ref([false, false, false, false]);

const zipInputs = ref([
    props.initialZipCodes[0] || '',
    props.initialZipCodes[1] || '',
    props.initialZipCodes[2] || '',
    props.initialZipCodes[3] || '',
]);

const cityInputs = ref([
    props.initialCities[0] || '',
    props.initialCities[1] || '',
    props.initialCities[2] || '',
    props.initialCities[3] || '',
]);

watch(
    () => [props.initialZipCodes, props.initialCities],
    ([z, c]) => {
        zipCodes.value = [...z];
        cities.value = [...c];

        zipInputs.value = [
            z[0] || '',
            z[1] || '',
            z[2] || '',
            z[3] || '',
        ];

        cityInputs.value = [
            c[0] || '',
            c[1] || '',
            c[2] || '',
            c[3] || '',
        ];
    },
);

async function savePreferences(addedValue?: string) {
    const newZipList = zipInputs.value.filter(v => v.trim());
    const newCityList = cityInputs.value.filter(v => v.trim());

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: newZipList,
            cities: newCityList,
        },
    };

    try {
        await createPreferences(formData);
        await nextTick();
        emit('update:initialZipCodes', formData.value.zip_codes);
        emit('update:initialCities', formData.value.cities);

        if (addedValue) emit('open-proposal', addedValue);
    }
    catch (err) {
        console.error(err);
    }
}

function isInitialZip(index: number) {
    const initial = props.initialZipCodes[index] || '';
    const current = zipInputs.value[index] || '';
    return current === initial && current.trim() !== '';
}

function isInitialCity(index: number) {
    const initial = props.initialCities[index] || '';
    const current = cityInputs.value[index] || '';
    return current === initial && current.trim() !== '';
}

function onZipInput(index: number) {
    const value = zipInputs.value[index].trim();
    showZipTooltip.value[index] = value !== '' && !isInitialZip(index);
}

function onCityInput(index: number) {
    const value = cityInputs.value[index].trim();
    showCityTooltip.value[index] = value !== '' && !isInitialCity(index);
}

async function saveZip(index: number) {
    const value = zipInputs.value[index].trim();
    if (!value) return;
    showZipTooltip.value[index] = false;
    await savePreferences(value);
}

async function saveCity(index: number) {
    const value = cityInputs.value[index].trim();
    if (!value) return;
    showCityTooltip.value[index] = false;
    await savePreferences(value);
}

async function removeZip(index: number) {
    zipInputs.value[index] = '';
    await savePreferences();
}

async function removeCity(index: number) {
    cityInputs.value[index] = '';
    await savePreferences();
}
</script>
