<template>
    <div
        class="flex flex-col space-y-2 relative group focus-within:before:opacity-100 before:opacity-0 before:transition-opacity before:duration-300 before:absolute before:-top-8 before:sm:-top-4 before:left-4 before:bg-gray-100 before:text-gray-800 before:text-sm before:rounded-md before:shadow-md before:px-3 before:py-1"
        :data-hint="commaValidation ? 'Appuyer sur PLUS, VIRGULE ou ENTRER pour valider' : 'Appuyer sur PLUS, VIRGULE, ESPACE ou ENTRER pour valider'"
    >
        <label class="text-primary font-semibold">{{ label }}</label>
        <div class="relative flex-1 gap-x-4">
            <InputIcon
                v-model="inputValue"
                :icon="icon"
                :placeholder="placeholder"
                class="w-full"
                @keyup="handleKeyUp"
                @blur="handleBlur"
            />

            <Button
                variant="ghost"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-primary p-0 h-auto bg-transparent shadow-none hover:bg-transparent hover:text-primary focus:outline-none focus:ring-0 active:text-primary group"
                title="Ajouter"
                @click="addItem"
            >
                <PlusIcon class="h-12 w-12 transform transition-transform duration-200 group-hover:scale-125" />
            </Button>
        </div>
        <div
            v-if="items.length"
            class="flex flex-wrap gap-2 mt-2"
        >
            <div
                v-for="(item, index) in items"
                :key="index"
                class="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
            >
                {{ item }}
                <button
                    type="button"
                    class="ml-2 text-gray-500 hover:text-gray-700 relative z-10"
                    @click="removeItem(index)"
                >
                    ×
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/outline';
import { InputIcon } from '~/components/ui/input-with-icon';

const props = defineProps({
    label: String,
    icon: Object,
    placeholder: String,
    modelValue: Array,
    count: {
        type: Number,
        required: false,
    },
    isMobile: {
        type: Boolean,
        default: false,
    },
    commaValidation: {
        type: Boolean,
        default: false,
    },
    noSpaceValidation: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref('');
const items = ref([...props.modelValue]);

watch(
    () => props.modelValue,
    (newVal) => {
        items.value = [...newVal];
    },
);

const addItem = () => {
    const value = inputValue.value.trim().replace(/[,\s]+$/, '');
    if (value && !items.value.includes(value)) {
        items.value.push(value);
        emit('update:modelValue', items.value);
    }
    inputValue.value = '';
};

const removeItem = (index) => {
    items.value.splice(index, 1);
    emit('update:modelValue', items.value);
};

const handleKeyUp = (event) => {
    if (props.isMobile) {
        let keys = [];
        if (props.noSpaceValidation) {
            keys = [',', 'Enter'];
        }
        else {
            keys = props.commaValidation ? [','] : [' ', ',', 'Enter'];
        }

        if (keys.includes(event.key)) {
            event.preventDefault();
            addItem();
        }
    }
    else {
        let keys = [];
        if (props.noSpaceValidation) {
            keys = [',', 'Enter'];
        }
        else {
            keys = props.commaValidation ? [','] : [' ', ',', 'Enter'];
        }

        if (keys.includes(event.key)) {
            event.preventDefault();
            addItem();
        }
    }
};

const handleBlur = () => {
    if (!props.isMobile || (props.count && inputValue.value.length === props.count)) {
        addItem();
    }
};
// script
</script>

<style scoped>
[data-hint]::before {
    content: attr(data-hint);
}
</style>
