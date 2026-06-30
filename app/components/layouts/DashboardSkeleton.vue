<template>
    <div class="flex min-h-svh bg-white">
        <aside class="hidden w-52 shrink-0 flex-col border-r border-gray-200 bg-white p-2 md:flex xl:w-52">
            <div class="flex flex-col items-center px-2 pb-2 pt-4">
                <Skeleton class="mb-2 h-10 w-36" />
            </div>
            <div class="mx-auto mt-2 flex w-44 flex-col gap-2 xl:w-52">
                <Skeleton
                    v-for="i in 7"
                    :key="i"
                    class="h-12 w-full rounded-md"
                />
            </div>
        </aside>

        <div class="flex min-w-0 flex-1 flex-col bg-gray-100">
            <header class="flex h-20 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 shadow-md sm:px-6">
                <Skeleton class="h-8 w-8 rounded-md" />
                <div class="ml-auto flex items-center gap-2 sm:gap-4">
                    <Skeleton class="h-5 w-5 rounded-full" />
                    <Skeleton class="h-5 w-5 rounded-full" />
                    <Skeleton class="h-9 w-9 rounded-full" />
                    <Skeleton class="hidden h-8 w-28 rounded-md sm:block" />
                </div>
            </header>

            <main class="flex-1 overflow-hidden p-6">
                <DashboardNurseSkeleton />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
</script>
