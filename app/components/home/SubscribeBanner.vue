<template>
    <div
        class="py-10 sm:shadow flex justify-center items-center mx-auto mt-16"
        :class="bgClass"
    >
        <div class="flex flex-col sm:h-[275px] justify-center items-center space-y-8 w-96 sm:w-full shadow sm:shadow-none">
            <form
                class="hidden lg:w-120 sm:w-100 sm:flex justify-between rounded-full h-10"
                :class="formClass"
                @submit.prevent="subscribeNewsletter"
            >
                <div class="flex rounded-full border border-transparent">
                    <div class="flex items-center">
                        <EnvelopeIcon
                            class="text-primary w-5 ms-4"
                            :class="iconClass"
                        />
                        <Input
                            v-model="email"
                            placeholder="Email"
                            class="text-sm bg-transparent lg:w-80 sm:w-64"
                            :class="inputClass"
                        />
                    </div>
                </div>
                <Button
                    :disabled="isLoading"
                    variant="secondary"
                    class="mt-0.5 me-0.5"
                    type="submit"
                >
                    {{ isLoading ? "Envoi..." : "Enregistrer" }}
                </Button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { EnvelopeIcon } from '@heroicons/vue/24/solid';

import { useNewsletter } from '@/composables/useNewsletter';

const { email, isLoading, subscribeNewsletter } = useNewsletter();

defineProps({
    bgClass: String,
    titleClass: String,
    formClass: String,
    inputClass: String,
    iconClass: String,
    buttonClass: String,
    linkClass: String,
});
</script>
