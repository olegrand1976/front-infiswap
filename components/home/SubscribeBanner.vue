<template>
    <div
        class="py-10 sm:shadow flex justify-center items-center mx-auto mt-16"
        :class="bgClass"
    >
        <div class="flex flex-col sm:h-[275px] justify-center items-center space-y-8 w-96 sm:w-full shadow sm:shadow-none">
            <div class="bg-primary sm:py-0 py-4 sm:bg-transparent rounded-t-2xl w-full sm:w-auto">
                <h3
                    class="text-center xl:text-3xl md:text-2xl sm:text-xl font-bold"
                    :class="titleClass"
                >
                    S'inscrire à la newsletter
                </h3>
            </div>
            <p class="lg:w-[34rem] sm:w-[24rem] w-full text-center xl:text-base lg:text-sm text-xs pb-16 px-9 sm:py-0 sm:px-0">
                Inscrivez-vous à notre newsletter pour recevoir nos futures
                communications. Vous pouvez vous désabonner à tout moment. Pour en
                savoir plus sur notre politique de protection des données.
                <span>
                    <NuxtLink
                        to="/"
                        :class="linkClass"
                    >
                        Cliquez ici
                    </NuxtLink>
                </span>
            </p>
            <Form
                class="hidden lg:w-[30rem] sm:w-[25rem] sm:flex justify-between rounded-full h-10"
                :class="formClass"
            >
                <FormField name="email">
                    <FormItem class="flex rounded-full border border-transparent">
                        <FormControl>
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
                        </FormControl>
                    </FormItem>
                </FormField>
                <Button
                    :disabled="isLoading"
                    @click="subscribeNewsletter"
                    variant="secondary"
                    class="mt-0.5 me-0.5"
                >
                    {{ isLoading ? "Envoi..." : "Enregistrer" }}
                </Button>
            </Form>
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
