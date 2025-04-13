<template>
    <div class="p-4 flex justify-end bg-white">
        <Pagination
            v-slot="{ page }"
            :items-per-page="5"
            :total="data.meta.total"
            :sibling-count="1"
            show-edges
            :default-page="2"
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
import type { Pagination as LaravelPagination } from '~/lib/types';

defineProps<{
    data: LaravelPagination<any[]>;
}>();
</script>
