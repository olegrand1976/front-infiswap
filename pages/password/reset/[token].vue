<template>
    <div>
        <div class="flex flex-row justify-center h-auto sm:pt-52 xl:pt-0">
            <div class="bg-tertiary/30 flex flex-col items-center lg:w-[115vw] sm:w-[85vw] relative container">
                <div class="flex justify-center items-center mb-auto md:mt-36 sm:mt-32">
                    <LayoutsAppImage
                        src="/icons/unlock.png"
                        class="lg:w-52 md:w-44 sm:w-32"
                    />
                </div>
                <div class="absolute lg:top-24 lg:left-12 md:left-8 md:top-12 sm:top-12 sm:left-8">
                    <LayoutsAppImage
                        src="/icons/plus.png"
                        class="lg:w-24 lg:h-24 md:w-20 md:h-20 sm:h-12 sm:w-12"
                    />
                </div>
                <div class="absolute lg:bottom-32 lg:right-20 md:bottom-24 md:right-12 sm:bottom-20 sm:right-8">
                    <LayoutsAppImage
                        src="/icons/Unin.png"
                        class="lg:w-16 lg:h-16 md:w-12 md:h-12 sm:h-8 sm:w-8"
                    />
                </div>

                <div class="absolute md:right-6 md:top-6 sm:right-4 sm:top-3">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute lg:left-28 lg:bottom-40 md:left-16 md:bottom-28 sm:left-12 sm:bottom-24">
                    <LayoutsAppImage
                        src="/icons/cog_2.png"
                        class="lg:w-52 lg:h-52 md:w-40 md:h-40 sm:h-28 sm:w-28"
                    />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white container w-full xl:h-[100vh] flex flex-col md:space-y-12 sm:space-y-8 justify-center items-center">
                <div>
                    <LayoutsAppImage
                        src="logo.png"
                        class="lg:w-[28rem] lg:h-36 md:w-[20rem] md:h-[6.5rem] sm:w-[17rem] sm:h-[5rem]"
                    />
                </div>
                <h1 class="md:text-2xl sm:text-xl text-center text-primary">
                    Réinitialisez votre <span class="font-bold">mot de passe</span>
                </h1>
                <div class="w-full container">
                    <Form class="flex flex-col">
                        <FormField name="email">
                            <FormItem>
                                <FormLabel class="md:text-xs sm:text-[0.7em] text-primary font-bold mb-12">
                                    Votre adresse e-mail
                                </FormLabel>
                                <div class="flex flex-col space-x-1 px-4 lg:h-11 md:h-10 rounded-full border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90">
                                    <FormControl>
                                        <div class="flex items-center space-x-1">
                                            <EnvelopeIcon class="text-primary w-7 h-7" />
                                            <Input
                                                v-model="email"
                                                type="email"
                                                placeholder="Email"
                                                class="md:text-sm sm:text-xs"
                                            />
                                        </div>
                                    </FormControl>
                                </div>
                            </FormItem>
                        </FormField>

                        <div class="md:px-8 sm:px-0 md:pt-12 sm:pt-8">
                            <h4 class="font-light lg:text-sm md:text-xs sm:text-[0.7em] text-primary text-center">
                                Saisissez votre adresse éléctronique et nous vous enverrons un code
                                pour réinitialiser votre mot de passe
                            </h4>
                        </div>

                        <div class="flex justify-center items-center mx-auto pt-8">
                            <Button
                                class="font-bold px-16 md:text-sm sm:text-xs"
                                href="/auth/verify-2fa"
                            >
                                Envoyer un email
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { EnvelopeIcon } from '@heroicons/vue/24/solid';

definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Réinitialisation de mot de passe',
});

const email = ref('');
</script>
