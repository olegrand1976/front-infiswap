<template>
    <div>
        <label
            v-if="label"
            :class="labelClass"
        >
            {{ label }}
        </label>
        <Select v-model="country">
            <SelectTrigger
                position="right"
                :class="triggerClass"
            >
                <SelectValue>
                    {{ selectedLabel }}
                </SelectValue>
            </SelectTrigger>
            <SelectContent :class="contentClass">
                <SelectGroup>
                    <SelectItem
                        v-for="option in REPLACEMENT_COUNTRIES"
                        :key="option.value"
                        :value="option.value"
                    >
                        <span :class="itemClass">{{ option.label }}</span>
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
</template>

<script setup lang="ts">
import { REPLACEMENT_COUNTRIES } from '~/lib/constants';
import type { ReplacementCountryCode } from '~/lib/replacementCountry';

const country = defineModel<ReplacementCountryCode>({ required: true });

withDefaults(defineProps<{
    label?: string;
    labelClass?: string;
    triggerClass?: string;
    contentClass?: string;
    itemClass?: string;
}>(), {
    label: 'Pays',
    labelClass: 'text-gray-600 text-sm font-medium',
    triggerClass: 'rounded-md',
    contentClass: 'border border-none',
    itemClass: 'text-sm',
});

const selectedLabel = computed(() => {
    const match = REPLACEMENT_COUNTRIES.find(option => option.value === country.value);

    return match?.label ?? 'Sélectionner...';
});
</script>
