<template>
    <Pagination
        v-slot="{ page }"
        :total="total"
        :sibling-count="siblingCount"
        show-edges
        :default-page="defaultPage"
        @update:model-value="emitPageChange"
    >
        <PaginationList
            v-slot="{ items }"
            class="flex items-center sm:space-x-12 space-x-6"
        >
            <PaginationPrev
                :class="prevNextClass"
                :disabled="page === 1"
                @click="switchPage('prev', page)"
            />

            <template v-for="(item, index) in items">
                <PaginationListItem
                    v-if="item.type === 'page'"
                    :key="index"
                    :value="item.value"
                    as-child
                >
                    <Button
                        :class="itemClass"
                        :variant="item.value === page ? 'default' : 'outline'"
                        @click="emitPageChange(item.value)"
                    >
                        {{ item.value }}
                    </Button>
                </PaginationListItem>
                <PaginationEllipsis
                    v-else
                    :key="item.type"
                    :index="index"
                    class="w-12 h-12 p-2 rounded-full"
                />
            </template>

            <PaginationNext
                :class="prevNextClass"
                :disabled="page === total"
                @click="switchPage('next', page)"
            />
        </PaginationList>
    </Pagination>
</template>

<script lang="ts" setup>
import {
    Pagination,
    PaginationEllipsis,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from '@/components/ui/pagination';

defineProps({
    total: {
        type: Number,
        required: true,
    },
    siblingCount: {
        type: Number,
        default: 1,
    },
    defaultPage: {
        type: Number,
        default: 1,
    },
    prevNextClass: {
        type: String,
        default: 'w-20 h-20 rounded-full hover:bg-primary',
    },
    itemClass: {
        type: String,
        default: 'w-12 h-12 rounded-full',
    },
});

const emit = defineEmits(['page-change']);
function emitPageChange(newPage: number) {
    emit('page-change', newPage);
}

function switchPage(direction: string, currentPage: number) {
    let newPage = currentPage;

    if (direction === 'prev') {
        if (currentPage > 1) {
            newPage = currentPage - 1;
        }
    }
    else if (direction === 'next') {
        if (currentPage < 4) {
            newPage = currentPage + 1;
        }
    }

    emitPageChange(newPage);
}
</script>
