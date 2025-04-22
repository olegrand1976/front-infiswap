<template>
    <div>
        <form class="mt-6 space-y-4">
            <div class="grid grid-cols-1 mb-16 sm:mb-0 sm:grid-cols-[40%_60%] sm:border sm:border-primary h-9 sm:rounded-full">
                <div class="sm:bg-primary sm:w-full flex items-center text-primary sm:text-white ps-4 rounded-s-full">
                    <label
                        class="font-semibold sm:font-normal mb-3 sm:mb-0"
                        for="zipCode"
                    >
                        Codes postaux
                    </label>
                </div>
                <TagsInput
                    v-model="zipCodes"
                    class="h-9 bg-transparent flex flex-nowrap xl:ml-[4.5rem] 2xl:ml-0 border sm:border-none border-primary rounded-full"
                >
                    <div class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar">
                        <TagsInputItem
                            v-for="item in zipCodes"
                            :key="item"
                            :value="item"
                            class="-mt-1"
                        >
                            <TagsInputItemText class="text-xs" />
                            <TagsInputItemDelete @click="removeZipCode(item)" />
                        </TagsInputItem>
                    </div>
                    <TagsInputInput
                        class="-mt-1 sm:w-24 2xl:w-auto"
                        placeholder="8973"
                        @blur="handleBlur"
                        @keyup.enter="() => addPreference()"
                    />
                </TagsInput>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipContent>
                            <p>Add to library</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div class="grid grid-cols-1 mb-16 sm:mb-0 sm:grid-cols-[40%_60%] sm:border sm:border-primary h-9 sm:rounded-full">
                <div class="sm:bg-primary sm:w-full flex items-center text-primary sm:text-white ps-4 rounded-s-full">
                    <label
                        class="font-semibold sm:font-normal mb-3 sm:mb-0"
                        for="zipCode"
                    >
                        Villes
                    </label>
                </div>
                <TagsInput
                    v-model="cities"
                    class="h-9 bg-transparent flex flex-nowrap xl:ml-[4.5rem] 2xl:ml-0 border sm:border-none border-primary rounded-full"
                    @keyup.enter="addPreference"
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
                        class="-mt-1 sm:w-24 2xl:w-auto"
                        placeholder="Bruxelles"
                        @blur="handleBlur"
                        @keyup.enter="() => addPreference()"
                    />
                </TagsInput>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import {
    TagsInput,
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
} from '@/components/ui/tags-input';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';

import { useReports } from '~/composables/useReports';

const props = defineProps<{
    initialZipCodes: string[];
    initialCities: string[];
}>();

const { createPreferences } = useReports();

const zipCodes = ref<string[]>(props.initialZipCodes);
const cities = ref<string[]>(props.initialCities);

const addPreference = async () => {
    const formData = {
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    };

    await createPreferences(formData);
};

const removeZipCode = async (zipCode: string) => {
    zipCodes.value = zipCodes.value.filter(code => code !== zipCode);

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    };

    await createPreferences(formData);
};

const removeCity = async (city: string) => {
    cities.value = cities.value.filter(c => c !== city);

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: zipCodes.value,
            cities: cities.value,
        },
    };

    await createPreferences(formData);
};

const handleBlur = (event) => {
    const inputEl = event.target;

    const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
    });

    inputEl.dispatchEvent(enterEvent);

    nextTick(() => {
        setTimeout(() => {
            addPreference();
        }, 0);
    });
};
</script>
