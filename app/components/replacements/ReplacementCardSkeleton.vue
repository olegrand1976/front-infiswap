<template>
    <div class="bg-gradient-to-br from-white to-gray-50 rounded-md shadow-lg p-4 space-y-3 border border-gray-100">
        <div class="flex justify-between items-start">
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-6 w-20 rounded-full" />
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <Skeleton class="h-4 w-16 mb-2" />
                <Skeleton class="h-4 w-full" />
            </div>
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <Skeleton class="h-4 w-12 mb-2" />
                <Skeleton class="h-4 w-full" />
            </div>
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <Skeleton class="h-4 w-14 mb-2" />
                <Skeleton class="h-4 w-full" />
            </div>
            <div class="space-y-1 bg-gray-50/50 rounded-lg p-2">
                <Skeleton class="h-4 w-12 mb-2" />
                <Skeleton class="h-4 w-full" />
            </div>
        </div>

        <div class="space-y-1">
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-3/4" />
        </div>

        <div class="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2 flex-1">
                <Skeleton class="h-4 w-16" />
                <Skeleton class="h-4 w-24" />
            </div>
            <Skeleton class="h-8 w-24 rounded-lg" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton';
</script>
