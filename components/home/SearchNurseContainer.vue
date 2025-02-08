<template>
    <div class="pt-32 relative">
        <div class="flex justify-end items-center">
            <NuxtImg
                src="/Group_2968.png"
                class="w-[90%] z-10"
            />
        </div>
        <div class="absolute top-40 left-96">
            <div class="relative z-20 flex space-x-32 justify-center items-center">
                <div>
                    <h2 class="text-[3.5rem] text-white">
                        je cherche <br>
                        <strong>Un(e) infirmier(e)</strong>
                    </h2>
                    <Button
                        variant="secondary"
                        class="text-primary w-64 mt-12"
                        href="/search-nurse"
                    >
                        Consulter
                    </Button>
                </div>
                <div>
                    <NuxtImg
                        src="/home/Group_2050.png"
                        class="w-52"
                    />
                </div>
                <div class="absolute -top-6 right-48">
                    <NuxtImg
                        src="/icons/Union_3.png"
                        class="w-16"
                    />
                </div>
                <div class="absolute -bottom-12 right-28">
                    <NuxtImg
                        src="/icons/cog.png"
                        class="w-36"
                    />
                </div>
                <div class="absolute -bottom-8 right-72">
                    <NuxtImg
                        src="/icons/Union.png"
                        class="w-10"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
</script>
