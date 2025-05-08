<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    containerClass: {
        type: String,
        default: '',
    },
    inputContainerClass: {
        type: String,
        default: '',
    },
    inputClass: {
        type: String,
        default: '',
    },
    iconButtonClass: {
        type: String,
        default: '',
    },
    iconClass: {
        type: String,
        default: '',
    },
    dropdownClass: {
        type: String,
        default: '',
    },
    hoursContainerClass: {
        type: String,
        default: '',
    },
    minutesContainerClass: {
        type: String,
        default: '',
    },
    hourButtonClass: {
        type: String,
        default: '',
    },
    minuteButtonClass: {
        type: String,
        default: '',
    },
    timeRange: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);

const showPicker = ref(false);
const selectedHour = ref(0);
const selectedMinute = ref(0);

const displayValue = computed(() => {
    return `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`;
});

const filteredHours = computed(() => {
    switch (props.timeRange) {
        case 'morning':
            return Array.from({ length: 6 }, (_, i) => i + 6);
        case 'afternoon':
            return Array.from({ length: 6 }, (_, i) => i + 12);
        case 'evening':
            return Array.from({ length: 6 }, (_, i) => i + 18);
        default:
            return Array.from({ length: 24 }, (_, i) => i);
    }
});

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        const [hours, minutes] = newValue.split(':');
        selectedHour.value = parseInt(hours);
        selectedMinute.value = parseInt(minutes);
    }
}, { immediate: true });

const selectHour = (hour) => {
    selectedHour.value = hour;
    updateValue();
    showPicker.value = false; // Close picker after selecting hour
};

const selectMinute = (minute) => {
    selectedMinute.value = minute;
    updateValue();
    showPicker.value = false;
};

const updateValue = () => {
    emit('update:modelValue', displayValue.value);
};

const handleManualInput = (event) => {
    const value = event.target.value;
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

    if (timeRegex.test(value)) {
        const [hours, minutes] = value.split(':');
        selectedHour.value = parseInt(hours);
        selectedMinute.value = Math.round(parseInt(minutes) / 15) * 15;
        if (selectedMinute.value === 60) selectedMinute.value = 45;
        updateValue();
    }
};

const handleClockClick = () => {
    showPicker.value = true; // Show full picker on clock click
};

onMounted(() => {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.time-picker-container')) {
            showPicker.value = false;
        }
    });
});

onUnmounted(() => {
    document.removeEventListener('click', () => {
        showPicker.value = false;
    });
});
</script>

<template>
    <div
        class="relative min-w-36 time-picker-container"
        :class="containerClass"
        @click.stop
    >
        <div
            class="relative flex items-center"
            :class="inputContainerClass"
        >
            <input
                type="text"
                :value="displayValue"
                placeholder="HH:mm"
                pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
                class="w-full px-3 py-2 pr-10 text-sm border-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                :class="inputClass"
                @input="handleManualInput"
            >
            <button
                type="button"
                class="absolute right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                :class="iconButtonClass"
                @click="handleClockClick"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    :class="iconClass"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                    />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            </button>
        </div>

        <Transition name="fade">
            <div
                v-if="showPicker"
                class="absolute top-full left-0 mt-1 flex bg-white border border-gray-200 shadow-lg z-50"
                :class="dropdownClass"
            >
                <div
                    class="flex flex-col max-h-[200px] overflow-y-auto border-r border-gray-100"
                    :class="hoursContainerClass"
                >
                    <button
                        v-for="hour in filteredHours"
                        :key="`hour-${hour}`"
                        type="button"
                        class="px-4 py-2 text-center hover:bg-gray-50 w-full"
                        :class="[
                            hourButtonClass,
                            { 'bg-gray-100 font-bold': selectedHour === hour },
                        ]"
                        @click="selectHour(hour)"
                    >
                        {{ String(hour).padStart(2, '0') }}
                    </button>
                </div>
                <div
                    class="flex flex-col max-h-[200px] overflow-y-auto"
                    :class="minutesContainerClass"
                >
                    <button
                        v-for="minute in [0, 15, 30, 45]"
                        :key="`minute-${minute}`"
                        type="button"
                        class="px-4 py-2 text-center hover:bg-gray-50 w-full"
                        :class="[
                            minuteButtonClass,
                            { 'bg-gray-100 font-bold': selectedMinute === minute },
                        ]"
                        @click="selectMinute(minute)"
                    >
                        {{ String(minute).padStart(2, '0') }}
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
