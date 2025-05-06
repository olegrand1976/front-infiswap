<template>
    <div class="flex-1">
        <div
            class="relative flex-1 group focus-within:before:opacity-100 before:opacity-0 before:transition-opacity before:duration-300 before:absolute before:-top-10 before:left-0 before:bg-gray-100 before:text-gray-800 before:text-sm before:rounded-md before:shadow-md before:px-3 before:py-1 before:content-['Appuyer_sur_Entrée_ou_Espace_pour_valider']"
        >
            <InputIcon
                v-model="inputValue"
                :icon="icon || undefined"
                size="md"
                :placeholder="computedPlaceholder"
                @keydown="handleKey"
                @blur="addTag"
                :class="[
                    'w-full',
                    'lg:pr-0',
                    'pr-10',
                    inputClass,
                ]"
            />
            <button
                v-if="true"
                type="button"
                @click="addTag"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary lg:hidden"
            >
                <PlusCircleIcon class="h-6 w-6" />
            </button>
        </div>

        <div v-if="modelValue.length > 0" class="flex flex-wrap gap-2 mt-2">
            <div
                v-for="(item, index) in modelValue"
                :key="index"
                class="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
            >
                {{ item }}
                <button
                    type="button"
                    class="ml-2 text-gray-500 hover:text-gray-700 relative z-10"
                    @click="removeTag(index)"
                >
                    &times;
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true,
    },
    icon: {
        type: Object,
        default: null,
    },
    placeholder: {
        type: String,
        default: 'Étiquette',
    },
    inputClass: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref('');

const computedPlaceholder = computed(() =>
    props.modelValue.length === 0
        ? `${props.placeholder}`
        : `Ajouter un(e) autre ${props.placeholder.toLowerCase()}`,
);

const handleKey = (event) => {
    const validatingKeys = ['Enter', ' ', ','];
    if (validatingKeys.includes(event.key)) {
        event.preventDefault();
        addTag();
    }
};

const addTag = () => {
    const value = inputValue.value.trim().replace(/[, ]$/, '');
    if (value && !props.modelValue.includes(value)) {
        emit('update:modelValue', [...props.modelValue, value]);
    }
    inputValue.value = '';
};

const removeTag = (index) => {
    const updated = [...props.modelValue];
    updated.splice(index, 1);
    emit('update:modelValue', updated);
};
</script>
