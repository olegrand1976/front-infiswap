<script lang="ts" setup>
import { CalendarRoot, type CalendarRootEmits, type CalendarRootProps, useForwardPropsEmits } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNextButton, CalendarPrevButton } from '.';
import { cn } from '@/lib/utils';

const props = defineProps<CalendarRootProps & { class?: HTMLAttributes['class'] }>();

const emits = defineEmits<CalendarRootEmits>();

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;

    return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <CalendarRoot
        v-slot="{ grid, weekDays }"
        :class="cn('p-3', props.class)"
        v-bind="forwarded"
    >
        <CalendarHeader class="flex justify-between items-center">
            <CalendarHeading />
            <div class="flex space-x-3">
                <CalendarPrevButton class="border border-none" />
                <CalendarNextButton class="border border-none" />
            </div>
        </CalendarHeader>

        <div class="flex flex-col gap-y-6 mt-4 sm:flex-row sm:gap-x-12 sm:gap-y-0">
            <CalendarGrid
                v-for="month in grid"
                :key="month.value.toString()"
            >
                <CalendarGridHead>
                    <CalendarGridRow class="flex space-x-2">
                        <CalendarHeadCell
                            v-for="day in weekDays"
                            :key="day"
                            class="w-full h-8"
                        >
                            {{ day }}
                        </CalendarHeadCell>
                    </CalendarGridRow>
                </CalendarGridHead>
                <CalendarGridBody>
                    <CalendarGridRow
                        v-for="(weekDates, index) in month.rows"
                        :key="`weekDate-${index}`"
                        class="mt-2 w-full flex space-x-2"
                    >
                        <CalendarCell
                            v-for="weekDate in weekDates"
                            :key="weekDate.toString()"
                            :date="weekDate"
                            class="w-full text-lg"
                        >
                            <CalendarCellTrigger
                                :day="weekDate"
                                :month="month.value"
                            />
                        </CalendarCell>
                    </CalendarGridRow>
                </CalendarGridBody>
            </CalendarGrid>
        </div>
    </CalendarRoot>
</template>
