<script lang="ts" setup>
import { RangeCalendarRoot, type RangeCalendarRootEmits, type RangeCalendarRootProps, useForwardPropsEmits } from 'radix-vue';
import { computed, type HTMLAttributes } from 'vue';
import { RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarHeading, RangeCalendarNextButton, RangeCalendarPrevButton } from '.';
import { cn } from '@/lib/utils';

const props = defineProps<RangeCalendarRootProps & { class?: HTMLAttributes['class'] }>();

const emits = defineEmits<RangeCalendarRootEmits>();

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props;
    return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
    <RangeCalendarRoot
        v-slot="{ grid, weekDays }"
        :class="cn('p-3 flex-1 w-full', props.class)"
        v-bind="forwarded"
        locale="fr"
    >
        <RangeCalendarHeader class="w-full flex justify-between items-center">
            <RangeCalendarHeading class="text-primary font-bold" />
            <div class="flex space-x-3">
                <RangeCalendarPrevButton />
                <RangeCalendarNextButton />
            </div>
        </RangeCalendarHeader>

        <div class="flex flex-col mt-4 sm:flex-row text-primary">
            <RangeCalendarGrid
                v-for="month in grid"
                :key="month.value.toString()"
                class="w-full"
            >
                <RangeCalendarGridHead>
                    <RangeCalendarGridRow class="w-full">
                        <RangeCalendarHeadCell
                            v-for="day in weekDays"
                            :key="day"
                            class="text-center font-medium"
                        >
                            {{ day }}
                        </RangeCalendarHeadCell>
                    </RangeCalendarGridRow>
                </RangeCalendarGridHead>
                <RangeCalendarGridBody>
                    <RangeCalendarGridRow
                        v-for="(weekDates, index) in month.rows"
                        :key="`weekDate-${index}`"
                        class="mt-2 w-full justify-center"
                    >
                        <RangeCalendarCell
                            v-for="weekDate in weekDates"
                            :key="weekDate.toString()"
                            :date="weekDate"
                            class="w-full"
                        >
                            <RangeCalendarCellTrigger
                                :day="weekDate"
                                :month="month.value"
                                class="p-2 rounded-md hover:bg-primary/10 transition w-full text-center"
                            />
                        </RangeCalendarCell>
                    </RangeCalendarGridRow>
                </RangeCalendarGridBody>
            </RangeCalendarGrid>
        </div>
    </RangeCalendarRoot>
</template>
