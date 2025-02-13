<template>
    <!-- <div class="py-16 sm:shadow flex justify-center items-center mx-auto">
        <div class="container flex flex-col justify-center items-center lg:space-y-6 sm:space-y-4 w-96 sm:w-full shadow sm:shadow-none">
            <div class="bg-primary sm:bg-transparent p-4 rounded-t-2xl w-full sm:w-auto">
                <h3 class="text-white text-center sm:text-primary xl:text-3xl md:text-2xl sm:text-xl font-bold">
                    S'inscrire à la newsletter
                </h3>
            </div>
            <p class="lg:w-[34rem] sm:w-[24rem] w-full text-center xl:text-base lg:text-sm text-xs pt-6 pb-16 px-9 sm:py-0 sm:px-0">
                Inscrivez-vous à notre newsletter pour recevoir nos futures
                communications. Vous pouvez vous désabonner à tout moment. Pour en
                savoir plus sur notre politique de protection des données,
                <NuxtLink
                    to="/"
                    class="text-primary"
                >
                    Cliquez ici
                </NuxtLink>
            </p>
            <Form class="hidden bg-primary lg:w-[30rem] sm:w-[25rem] sm:flex justify-between rounded-full h-10">
                <FormField name="email">
                    <FormItem class="flex rounded-full border border-transparent">
                        <FormControl>
                            <div class="flex items-center">
                                <EnvelopeIcon class="text-white w-5 h-5 ms-4" />
                                <Input
                                    v-model="email"
                                    placeholder="Email"
                                    class="text-sm text-white bg-transparent placeholder:text-white lg:w-80 sm:w-64"
                                />
                            </div>
                        </FormControl>
                    </FormItem>
                </FormField>
                <Button
                    variant="secondary"
                    type="submit"
                    class="mt-0.5 me-0.5 text-primary"
                >
                    Enregistrer
                </Button>
            </Form>
        </div>
    </div> -->
</template>

<script lang="ts" setup>
import { EnvelopeIcon } from '@heroicons/vue/24/solid';

const email = ref('');
</script>
