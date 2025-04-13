<template>
    <div class="p-4 flex justify-end bg-white">
        <div class="flex items-center gap-2 mr-8">
            <span>Par page : </span>
            <Select v-model="internalPerPage">
                <SelectTrigger class="w-20">
                    <SelectValue :placeholder="internalPerPage.toString()" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem
                            v-for="(item, index) in perPageOptions"
                            :key="index"
                            :value="item.toString()"
                        >
                            {{ item }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>

        <Pagination
            v-slot="{ page }"
            v-model:page="currentPage"
            :items-per-page="Number(internalPerPage)"
            :total="props.total ?? 1"
            :sibling-count="1"
            show-edges
            :default-page="props.defaultPage ?? 1"
        >
            <PaginationList
                v-slot="{ items }"
                class="flex items-center gap-1"
            >
                <PaginationPrev />
                <template v-for="(item, index) in items">
                    <PaginationListItem
                        v-if="item.type === 'page'"
                        :key="index"
                        :value="item.value"
                        as-child
                    >
                        <Button
                            :class="[
                                'w-9 h-9 p-0 rounded-full border-[1px] border-primary',
                                {
                                    'text-white': item.value === page,
                                    'text-primary': item.value !== page,
                                },
                            ]"
                            :variant="item.value === page ? 'default' : 'none'"
                        >
                            {{ item.value }}
                        </Button>
                    </PaginationListItem>
                    <PaginationEllipsis
                        v-else
                        :key="item.type"
                        :index="index"
                    />
                </template>
                <PaginationNext />
            </PaginationList>
        </Pagination>
    </div>
</template>

<script setup lang="ts">
import { Pagination } from './ui/pagination';
import { PERPAGE } from '~/lib/constants';

const props = defineProps<{
    defaultPage?: number;
    total?: number;
}>();

const perPageOptions = [5, 10, 25, 50];
const currentPage = ref(props.defaultPage.toString() ?? '1');
const internalPerPage = ref(PERPAGE.toString());

const emit = defineEmits<{
    (e: 'update:page' | 'update:perPage', value: number): void;
}>();

watch(currentPage, (newPage) => {
    emit('update:page', Number(newPage));
});

watch(internalPerPage, (newPerPage) => {
    emit('update:perPage', Number(newPerPage));
});

console.log(internalPerPage.value);
</script>
