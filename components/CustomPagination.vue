<template>
    <div class="p-4 flex justify-end bg-white">
        <Pagination
            v-slot="{ page }"
            v-model:page="currentPage"
            :items-per-page="props.perPage ?? 15"
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
                            :class="['w-9 h-9 p-0 rounded-full border-[1px] border-primary', {
                                'text-white': item.value === page,
                                'text-primary': item.value !== page,
                            }]"
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

const props = defineProps<{
    defaultPage?: number;
    total?: number;
    perPage?: number;
}>();

const currentPage = ref(props.defaultPage ?? 1);

const emit = defineEmits<{
    (e: 'update:page', value: number): void;
}>();

watch(currentPage, (newPage) => {
    emit('update:page', newPage);
});
</script>
