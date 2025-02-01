<template>
    <div>
        <div class="flex flex-row justify-center sm:h-[80vh] lg:h-auto sm:pt-52 xl:pt-0">
            <div class="bg-tertiary/30 flex flex-col items-center lg:w-[115vw] sm:w-1/2 relative container">
                <div class="flex justify-center items-center mb-auto xl:mt-36 lg:mt-64 md:mt-48 sm:mt-36">
                    <NuxtImg
                        src="/auth/Group_1170.png"
                        class="xl:w-96 lg:w-80 md:w-52 sm:w-44"
                    />
                </div>

                <div class="absolute md:right-6 md:top-6 sm:right-4 sm:top-3">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white container lg:w-full sm:w-1/2 xl:h-[100vh] lg:h-[65vh] sm:h-auto flex flex-col lg:space-y-8 md:space-y-6 sm:space-y-4 justify-center items-center">
                <div>
                    <LayoutsLogo class="xl:w-[28rem] xl:h-36 lg:w-[20rem] lg:h-24 md:w-72 md:h-20 sm:w-[14rem] sm:h-16" />
                </div>
                <h1 class="xl:text-2xl lg:text-xl md:text-lg sm:text-base text-center text-primary">
                    Vérifiez votre <span class="font-bold">email</span>
                </h1>
                <p class="text-center md:w-96 sm:w-64 xl:text-base md:text-sm sm:text-xs">
                    Entrez le code à 6 chiffres qui a été envoyé à votre adresse e-mail
                    <span>
                        z*******@mews.com
                    </span>
                </p>
                <NuxtLink
                    to="/"
                    class="underline text-blue-500 xl:text-sm md:text-xs sm:text-[0.7rem]"
                >
                    Renvoyer l'email
                </NuxtLink>

                <Form>
                    <FormField name="code">
                        <FormItem>
                            <FormControl>
                                <div class="flex items-center justify-center">
                                    <PinInput
                                        id="pin-input"
                                        v-model="code"
                                        placeholder=""
                                        @complete="handleComplete"
                                    >
                                        <PinInputGroup class="gap-x-4">
                                            <template
                                                v-for="(id, index) in 6"
                                                :key="id"
                                            >
                                                <PinInputInput
                                                    class="rounded-md border xl:h-12 xl:w-12 lg:h-10 lg:w-10 md:h-9 md:w-9 sm:h-7 sm:w-7"
                                                    :index="index"
                                                />
                                                <template v-if="index !== 5">
                                                    <PinInputSeparator class="hidden" />
                                                </template>
                                            </template>
                                        </PinInputGroup>
                                    </PinInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <FormField name="ask">
                        <FormItem>
                            <FormControl>
                                <div class="flex justify-center items-center space-x-2 mt-6">
                                    <Checkbox id="ask" />
                                    <label
                                        for="ask"
                                        class="font-sans xl:text-sm md:text-xs sm:text-[0.65rem] font-light text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Ne plus demander sur cet appareil pendant 3 jours
                                    </label>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <div class="flex flex-row justify-center xl:space-x-12 md:space-x-10 sm:space-x-8 xl:mt-20 md:mt-16 sm:mt-8">
                        <div>
                            <NuxtLink to="/">
                                <Button
                                    variant="outline"
                                    class="w-full lg:px-16 md:px-12 sm:px-7 rounded-full font-bold xl:text-base lg:text-sm md:text-sm sm:text-xs"
                                >
                                    Retour
                                </Button>
                            </NuxtLink>
                        </div>
                        <div>
                            <Button
                                type="submit"
                                class="w-full lg:px-16 md:px-12 sm:px-7 font-bold xl:text-base md:text-sm sm:text-xs"
                            >
                                Vérifier
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    PinInput,
    PinInputGroup,
    PinInputInput,
    PinInputSeparator,
} from '@/components/ui/pin-input';

definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Vérification 2FA',
});

const code = ref<string[]>([]);

const handleComplete = (e: string[]) => alert(e.join(''));
</script>
