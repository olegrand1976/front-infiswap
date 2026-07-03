<template>
    <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Skeleton class="h-36 rounded-lg bg-white shadow-md" />
            <Skeleton class="h-36 rounded-lg bg-white shadow-md" />
        </div>

        <div class="mx-8 hidden gap-4 lg:grid lg:grid-cols-4">
            <div
                v-for="i in 4"
                :key="i"
                class="flex flex-col overflow-hidden rounded-lg border-2 border-gray-200"
            >
                <Skeleton class="h-10 w-full rounded-none" />
                <div class="flex flex-1 flex-col space-y-3 bg-white p-4">
                    <Skeleton class="mx-auto h-4 w-3/4" />
                    <Skeleton class="h-3 w-full" />
                    <Skeleton class="h-3 w-5/6" />
                    <Skeleton class="mt-auto h-8 w-full rounded" />
                </div>
            </div>
        </div>

        <div class="mx-8 lg:hidden">
            <div class="flex flex-col overflow-hidden rounded-lg border-2 border-gray-200">
                <Skeleton class="h-10 w-full rounded-none" />
                <div class="space-y-3 bg-white p-4">
                    <Skeleton class="mx-auto h-4 w-3/4" />
                    <Skeleton class="h-3 w-full" />
                    <Skeleton class="h-8 w-full rounded" />
                </div>
            </div>
        </div>

        <section class="flex w-full flex-col items-stretch gap-6 lg:flex-row">
            <div class="w-full rounded-lg bg-gray-100 p-4 shadow-lg lg:w-1/2">
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <Skeleton class="h-5 w-36" />
                        <Skeleton class="h-6 w-16 rounded" />
                    </div>
                    <Skeleton class="hidden h-3 w-full 2xl:block" />
                    <Skeleton class="h-24 w-full rounded-md" />
                    <Skeleton class="h-9 w-full rounded-full sm:mt-8" />
                </div>
            </div>

            <div class="w-full space-y-8 lg:w-1/2">
                <div class="overflow-hidden rounded-lg bg-white shadow-lg">
                    <Skeleton class="h-16 w-full rounded-none bg-gray-200" />
                    <div class="space-y-2 p-4">
                        <Skeleton class="h-4 w-52" />
                        <Skeleton class="h-9 w-14" />
                    </div>
                </div>

                <div class="overflow-hidden rounded-lg bg-white shadow-lg">
                    <Skeleton class="h-10 w-full rounded-none rounded-t-lg" />
                    <Skeleton class="m-4 h-64 rounded-md" />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
</script>
