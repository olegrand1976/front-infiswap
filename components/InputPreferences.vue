<template>
    <div>
        <form class="mt-6 space-y-4">
            <div class="grid grid-cols-1 relative mb-16 sm:mb-0 sm:grid-cols-[40%_60%] sm:border sm:border-primary h-9 sm:rounded-full">
                <div class="sm:bg-primary sm:w-full flex items-center text-primary sm:text-white ps-4 rounded-s-full">
                    <label
                        class="font-semibold sm:font-normal mb-3 sm:mb-0"
                        for="zipCode"
                    >
                        Codes postaux
                    </label>
                </div>

                <transition
                    name="fade-up"
                    enter-active-class="transition ease-out duration-300"
                    enter-from-class="opacity-0 translate-y-4"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-200"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-4"
                >
                    <div
                        v-if="isZipCodeFocused"
                        class="absolute -top-2 sm:-top-12 sm:left-48 text-sm p-2 bg-gray-50 shadow rounded-md"
                    >
                        <p>Appuyer sur Entrée pour valider</p>
                    </div>
                </transition>
                <TagsInput
                    v-model="zipCodes"
                    class="relative h-9 bg-transparent flex flex-nowrap items-center xl:ml-[4.5rem] 2xl:ml-0 border sm:border-none border-primary rounded-full"
                >
                    <div class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar flex-1 min-w-0">
                        <TagsInputItem
                            v-for="item in zipCodes"
                            :key="item"
                            :value="item"
                            class="-mt-1"
                        >
                            <TagsInputItemText class="text-xs" />
                            <TagsInputItemDelete @click="removeZipCode(item)" />
                        </TagsInputItem>

                        <TagsInputInput
                            class="-mt-1 sm:w-24 2xl:w-auto flex-1 min-w-[80px]"
                            placeholder="8973"
                            @input="isZipCodeFocused = true"
                            @blur="handleBlur"
                            @keyup.enter="() => addPreference('zipCode')"
                        />
                    </div>

                    <div class="lg:hidden -mr-3">
                        <Button
                            type="button"
                            class="ml-2 shrink-0 text-white bg-primary px-3 py-1 rounded-full text-xs shadow"
                            @click="addPreference('zipCode')"
                        >
                            Ajouter
                        </Button>
                    </div>
                    <div class="hidden lg:block">
                        <Button
                            variant="ghost"
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-0 h-auto bg-transparent shadow-none hover:bg-transparent hover:text-primary focus:outline-none focus:ring-0 active:text-primary group"
                            title="Ajouter"
                            @click="addPreference('zipCode')"
                        >
                            <PlusIcon class="h-12 w-12 transform transition-transform duration-200 group-hover:scale-125" />
                        </Button>
                    </div>
                </TagsInput>
            </div>

            <div class="grid grid-cols-1 relative mb-16 sm:mb-0 sm:grid-cols-[40%_60%] sm:border sm:border-primary h-9 sm:rounded-full">
                <div class="sm:bg-primary sm:w-full flex items-center text-primary sm:text-white ps-4 rounded-s-full">
                    <label
                        class="font-semibold sm:font-normal mb-3 sm:mb-0"
                        for="zipCode"
                    >
                        Villes
                    </label>
                </div>

                <transition
                    name="fade-up"
                    enter-active-class="transition ease-out duration-300"
                    enter-from-class="opacity-0 translate-y-4"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-200"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-4"
                >
                    <div
                        v-if="isCityFocused"
                        class="absolute -top-2 sm:-top-12 sm:left-48 text-sm p-2"
                    >
                        <p>Appuyer sur Entrée pour valider</p>
                    </div>
                </transition>
                <TagsInput
                    v-model="cities"
                    class="h-9 bg-transparent flex flex-nowrap xl:ml-[4.5rem] 2xl:ml-0 border sm:border-none border-primary rounded-full"
                    @keyup.enter="addPreference('city')"
                >
                    <div class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar">
                        <TagsInputItem
                            v-for="item in cities"
                            :key="item"
                            :value="item"
                            class="-mt-1"
                        >
                            <TagsInputItemText class="text-xs" />
                            <TagsInputItemDelete @click="removeCity(item)" />
                        </TagsInputItem>
                    </div>
                    <TagsInputInput
                        class="-mt-1 sm:w-24 2xl:w-auto flex-1 min-w-[80px]"
                        placeholder="Bruxelles"
                        @input="isCityFocused = true"
                        @blur="handleBlur"
                        @keyup.enter="() => addPreference('city')"
                    />
                    <div class="lg:hidden -mr-3">
                        <Button
                            type="button"
                            class="ml-2 shrink-0 text-white bg-primary px-3 py-1 rounded-full text-xs shadow"
                            @click="addPreference('city')"
                        >
                            Ajouter
                        </Button>
                    </div>
                    <div class="hidden lg:block">
                        <Button
                            variant="ghost"
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-0 h-auto bg-transparent shadow-none hover:bg-transparent hover:text-primary focus:outline-none focus:ring-0 active:text-primary group"
                            title="Ajouter"
                            @click="addPreference('city')"
                        >
                            <PlusIcon class="h-12 w-12 transform transition-transform duration-200 group-hover:scale-125" />
                        </Button>
                    </div>
                </TagsInput>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { PlusIcon } from '@heroicons/vue/24/outline';
import {
    TagsInput,
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
} from '@/components/ui/tags-input';
import { useAuth } from '~/composables/useAuth';

const props = defineProps<{
    initialZipCodes: string[];
    initialCities: string[];
}>();

const emit = defineEmits<{
    (e: 'update:initialZipCodes', value: string[]): void;
    (e: 'update:initialCities', value: string[]): void;
    (e: 'open-proposal', value: string): void;
}>();

const { createPreferences } = useAuth();

const isZipCodeFocused = ref(false);
const isCityFocused = ref(false);

const zipCodes = ref<string[]>([...props.initialZipCodes]);
const cities = ref<string[]>([...props.initialCities]);
const lastAddedValue = ref<string>('');

watch(
    () => [props.initialZipCodes, props.initialCities],
    ([newZipCodes, newCities]) => {
        zipCodes.value = [...newZipCodes].filter(zip => zip);
        cities.value = [...newCities].filter(city => city);
    },
    { deep: true },
);

const addPreference = async (type: 'zipCode' | 'city') => {
    isZipCodeFocused.value = false;
    isCityFocused.value = false;

    const validZipCodes = zipCodes.value.filter(zip => zip);
    const validCities = cities.value.filter(city => city);

    let addedValue = '';
    if (type === 'zipCode' && validZipCodes.length > props.initialZipCodes.length) {
        addedValue = validZipCodes[validZipCodes.length - 1];
    }
    else if (type === 'city' && validCities.length > props.initialCities.length) {
        addedValue = validCities[validCities.length - 1];
    }

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: validZipCodes,
            cities: validCities,
        },
    };

    try {
        await createPreferences(formData);
        await nextTick();
        emit('update:initialZipCodes', [...formData.value.zip_codes]);
        emit('update:initialCities', [...formData.value.cities]);
        if (addedValue) {
            lastAddedValue.value = addedValue;
            emit('open-proposal', addedValue);
        }
    }
    catch (error) {
        console.error('Failed to save preferences:', error);
    }
};

const removeZipCode = async (zipCode: string) => {
    zipCodes.value = zipCodes.value.filter(code => code !== zipCode);

    const validZipCodes = zipCodes.value.filter(zip => zip);
    const validCities = cities.value.filter(city => city);

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: validZipCodes,
            cities: validCities,
        },
    };

    try {
        await createPreferences(formData);
        await nextTick();
        emit('update:initialZipCodes', [...formData.value.zip_codes]);
        emit('update:initialCities', [...formData.value.cities]);
    }
    catch (error) {
        console.error('Failed to save preferences:', error);
    }
};

const removeCity = async (city: string) => {
    cities.value = cities.value.filter(c => c !== city);

    const validZipCodes = zipCodes.value.filter(zip => zip);
    const validCities = cities.value.filter(city => city);

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: validZipCodes,
            cities: validCities,
        },
    };

    try {
        await createPreferences(formData);
        await nextTick();
        emit('update:initialZipCodes', [...formData.value.zip_codes]);
        emit('update:initialCities', [...formData.value.cities]);
    }
    catch (error) {
        console.error('Failed to save preferences:', error);
    }
};

const handleBlur = async (event) => {
    const inputEl = event.target;
    const inputElement = event.target.value;

    if (inputElement) {
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
        });

        inputEl.dispatchEvent(enterEvent);

        await nextTick();
        const type = event.target.placeholder === '8973' ? 'zipCode' : 'city';
        await addPreference(type);
    }
    else {
        isZipCodeFocused.value = false;
        isCityFocused.value = false;
    }
};
</script>
