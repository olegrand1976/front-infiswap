<template>
    <tr class="border-b border-gray-100 animate-pulse">
        <td class="px-4 py-3">
            <div class="space-y-2">
                <Skeleton class="h-4 w-28" />
                <Skeleton class="h-4 w-16 rounded-full" />
            </div>
        </td>
        <td class="px-4 py-3">
            <Skeleton class="h-3 w-32" />
        </td>
        <td class="px-4 py-3">
            <Skeleton class="h-3 w-12" />
        </td>
        <td class="px-4 py-3">
            <Skeleton class="h-3 w-20" />
        </td>
        <td class="px-4 py-3">
            <Skeleton class="h-3 w-24" />
        </td>
        <td class="px-4 py-3">
            <div class="space-y-2">
                <Skeleton class="h-3 w-16" />
                <Skeleton class="h-3 w-20" />
            </div>
        </td>
        <td class="px-4 py-3 text-right">
            <Skeleton class="h-8 w-24 rounded-lg ml-auto" />
        </td>
    </tr>
</template>

<script lang="ts" setup>
import { Skeleton } from '@/components/ui/skeleton';
</script>
