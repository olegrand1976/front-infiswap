<template>
    <div class="space-y-8">
        <section class="grid grid-cols-1 gap-4 xl:gap-8 lg:grid-cols-2">
            <div class="col-span-1 lg:col-span-2">
                <Skeleton class="h-14 w-full rounded-md border border-gray-100 bg-white shadow-sm" />

                <div class="mt-3 grid grid-cols-1 gap-4 xl:gap-8 lg:grid-cols-2">
                    <div class="col-span-full">
                        <div class="mt-3 grid grid-cols-2 items-center gap-4 sm:gap-8">
                            <Skeleton class="h-28 rounded-sm bg-white shadow-md" />
                            <Skeleton class="h-28 rounded-sm bg-white shadow-md" />
                        </div>
                    </div>

                    <div class="col-span-1 lg:col-span-2">
                        <div class="mt-3 space-y-4">
                            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <Skeleton
                                    v-for="i in 4"
                                    :key="i"
                                    class="h-20 rounded-md border border-gray-100 bg-white shadow-sm"
                                />
                            </div>

                            <div>
                                <Skeleton class="mb-1 ml-2 h-4 w-72" />
                                <Skeleton class="mt-3 h-80 rounded-sm bg-white shadow-md" />
                            </div>
                        </div>
                    </div>

                    <div
                        v-for="group in 3"
                        :key="group"
                        class="col-span-1 lg:col-span-2"
                    >
                        <Skeleton class="mb-1 ml-2 h-4 w-48" />
                        <div class="flex flex-wrap">
                            <div
                                v-for="card in 3"
                                :key="card"
                                class="mb-4 w-full px-6 sm:w-1/2 xl:w-1/3"
                            >
                                <Skeleton class="h-[4.5rem] rounded bg-white shadow-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-1 lg:col-span-2">
                <Skeleton class="h-14 w-full rounded-md border border-gray-100 bg-white shadow-sm" />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
</script>
