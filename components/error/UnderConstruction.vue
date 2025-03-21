<template>
    <div>
        <LayoutError>
            <template #image>
                <div class="relative">
                    <LayoutsAppImage
                        src="under_construction.png"
                        class="h-72"
                    />
                    <LayoutsAppImage
                        src="/icons/cog.png"
                        class="w-52 absolute bottom-[5%] left-[115%]"
                    />
                    <LayoutsAppImage
                        src="/icons/cog.png"
                        class="w-20 absolute bottom-[55%] -left-[35%]"
                    />
                </div>
            </template>
            <template #title>
                <span>
                    Page en construction
                </span>
            </template>
            <template #message>
                La page que vous avez demandée est introuvable.
            </template>
        </LayoutError>
    </div>
</template>

<script lang="ts" setup>
import LayoutError from '~/layouts/error.vue';
</script>
