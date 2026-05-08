<template>
    <div class="bg-white rounded-lg p-4 w-full max-w-md mx-auto">
        <div class="flex justify-between items-center mb-4">
            <div
                class="text-primary hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center disabled:text-gray-400 disabled:cursor-not-allowed"
                :disabled="isPrevDisabled"
                @click="prevMonth"
            >
                <ChevronLeft
                    class="w-5 h-5"
                />
            </div>
            <span class="text-lg font-semibold text-primary">{{ currentMonthYear }}</span>
            <div
                class="text-primary hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                @click="nextMonth"
            >
                <ChevronRight class="w-5 h-5" />
            </div>
        </div>
        <div class="grid grid-cols-7 gap-1">
            <div
                v-for="day in daysOfWeek"
                :key="day"
                class="text-center text-sm font-medium text-black/60"
            >
                {{ day }}
            </div>
            <div
                v-for="date in calendarDates"
                :key="date.key"
                class="text-center py-2 cursor-pointer rounded-full"
                :class="{
                    'text-gray-400 cursor-not-allowed': date.isDisabled,
                    'bg-primary text-white font-semibold': isRangeStart(date.date) || isRangeEnd(date.date) || isDateSelected(date.date),
                    'bg-primary/20': isInRange(date.date),
                    'bg-primary/50 text-white font-semibold': date.date === tempStart && !tempEnd,
                    'hover:bg-gray-100': !date.isDisabled,
                }"
                @click="handleDateClick(date.date)"
            >
                {{ date.day }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ChevronLeft, ChevronRight, Star } from 'lucide-vue-next';

import { getLocalTimeZone, today } from '@internationalized/date';

const props = defineProps<{
    modelValue: { start: string | null; end: string | null }[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: { start: string | null; end: string | null }[]): void;
}>();

const ranges = ref(props.modelValue || []);
const currentMonth = ref(new Date().getMonth() + 1); // 1-12
const currentYear = ref(new Date().getFullYear());
const tempStart = ref<string | null>(null);
const tempEnd = ref<string | null>(null);

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

const currentMonthYear = computed(() => {
    return `${monthNames[currentMonth.value - 1]} ${currentYear.value}`;
});

const calendarDates = computed(() => {
    const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
    const prevMonth = currentMonth.value === 1 ? 12 : currentMonth.value - 1;
    const prevYear = currentMonth.value === 1 ? currentYear.value - 1 : currentYear.value;
    const prevDaysInMonth = new Date(prevYear, prevMonth, 0).getDate();
    const nextMonth = currentMonth.value === 12 ? 1 : currentMonth.value + 1;
    const nextYear = currentMonth.value === 12 ? currentYear.value + 1 : currentYear.value;
    const todayDate = new Date(today(getLocalTimeZone()).toString());

    const dates = [];

    for (let i = startDay - 1; i >= 0; i--) {
        const day = prevDaysInMonth - i;
        dates.push({
            key: `prev-${prevYear}-${prevMonth}-${day}`,
            day,
            date: `${prevYear}-${prevMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            isDisabled: true,
        });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear.value}-${currentMonth.value.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dateObj = new Date(currentYear.value, currentMonth.value - 1, day);
        dates.push({
            key: `curr-${currentYear.value}-${currentMonth.value}-${day}`,
            day,
            date: dateStr,
            isDisabled: dateObj.getTime() < todayDate.setHours(0, 0, 0, 0),
        });
    }

    const remainingCells = 42 - dates.length;
    for (let day = 1; day <= remainingCells; day++) {
        dates.push({
            key: `next-${nextYear}-${nextMonth}-${day}`,
            day,
            date: `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            isDisabled: true,
        });
    }

    return dates;
});

const isPrevDisabled = computed(() => {
    const todayDate = new Date(today(getLocalTimeZone()).toString());
    return currentYear.value === todayDate.getFullYear() && currentMonth.value === todayDate.getMonth() + 1;
});

const prevMonth = () => {
    if (currentMonth.value === 1) {
        currentMonth.value = 12;
        currentYear.value--;
    }
    else {
        currentMonth.value--;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 12) {
        currentMonth.value = 1;
        currentYear.value++;
    }
    else {
        currentMonth.value++;
    }
};

const handleDateClick = (date: string) => {
    if (!tempStart.value) {
        tempStart.value = date;
        tempEnd.value = null;
    }
    else if (!tempEnd.value) {
        const startDate = new Date(tempStart.value);
        const endDate = new Date(date);
        let newRange;
        if (endDate >= startDate) {
            newRange = { start: tempStart.value, end: date };
        }
        else {
            newRange = { start: date, end: tempStart.value };
        }
        if (ranges.value.length === 1 && !ranges.value[0].start && !ranges.value[0].end) {
            ranges.value[0] = newRange;
        }
        else {
            ranges.value = [...ranges.value, newRange];
        }
        tempStart.value = null;
        tempEnd.value = null;
        emit('update:modelValue', ranges.value);
    }
};

const isDateSelected = (date: string): boolean => {
    return ranges.value.some(
        range => range.start === date || range.end === date,
    ) || tempStart.value === date || tempEnd.value === date;
};

const isRangeStart = (date: string): boolean => {
    return ranges.value.some(range => range.start === date) || tempStart.value === date;
};

const isRangeEnd = (date: string): boolean => {
    return ranges.value.some(range => range.end === date) || tempEnd.value === date;
};

const isInRange = (date: string): boolean => {
    const dateObj = new Date(date);
    return ranges.value.some((range) => {
        if (!range.start || !range.end) return false;
        const start = new Date(range.start);
        const end = new Date(range.end);
        return dateObj > start && dateObj < end;
    }) || (
        tempStart.value && tempEnd.value
        && dateObj > new Date(tempStart.value) && dateObj < new Date(tempEnd.value)
    );
};

watch(() => props.modelValue, (newValue) => {
    ranges.value = newValue || [];
}, { deep: true });
</script>
