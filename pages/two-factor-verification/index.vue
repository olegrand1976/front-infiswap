<template>
    <div>
        <div class="hidden sm:flex flex-row justify-center h-auto sm:pt-[25vh] xl:pt-0">
            <div class="bg-tertiary/30 hidden lg:flex flex-col items-center lg:w-[115vw] relative container">
                <div class="flex justify-center items-center my-auto">
                    <NuxtImg
                        src="/auth/Group_1170.png"
                        class="w-80"
                    />
                </div>

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white container w-full xl:h-[100vh] lg:h-[50vh] flex flex-col lg:space-y-8 space-y-12 justify-center items-center">
                <div>
                    <LayoutsLogo class="sm:w-64 lg:w-72" />
                </div>
                <h1 class="md:text-2xl sm:text-xl text-center text-primary">
                    Vérifiez votre <span class="font-bold">email</span>
                </h1>
                <p class="text-center lg:w-96 xl:text-base sm:text-sm">
                    Entrez le code à 6 chiffres qui a été envoyé à votre adresse e-mail
                    <span>
                        z*******@mews.com
                    </span>
                </p>
                <NuxtLink
                    to="/"
                    class="underline text-blue-500 xl:text-sm sm:text-xs"
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
                                                    class="rounded-md border xl:w-12 xl:h-12 sm:w-10 sm:h-10"
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
                                        class="font-sans xl:text-sm sm:text-xs font-light text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Ne plus demander sur cet appareil pendant 3 jours
                                    </label>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>

                    <div class="flex flex-row justify-center space-x-12 mt-16">
                        <div>
                            <NuxtLink to="/">
                                <Button
                                    variant="outline"
                                    class="w-full px-16 rounded-full font-bold xl:text-base text-sm"
                                >
                                    Retour
                                </Button>
                            </NuxtLink>
                        </div>
                        <div>
                            <Button
                                type="submit"
                                class="w-full px-16 font-bold xl:text-base text-sm"
                            >
                                Vérifier
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>

        <div class="sm:hidden w-screen flex flex-col justify-between relative overflow-hidden">
            <LayoutsHeaderMobile />

            <div class="container mt-32 flex flex-col space-y-8">
                <h1 class="text-lg text-center text-primary">
                    Vérifiez votre <span class="font-bold">email</span>
                </h1>
                <p class="text-center text-sm">
                    Entrez le code à 6 chiffres qui a été envoyé à votre adresse e-mail
                    <span>
                        z*******@mews.com
                    </span>
                </p>
                <NuxtLink
                    to="/"
                    class="underline text-blue-500 text-xs text-center"
                >
                    Renvoyer l'email
                </NuxtLink>
            </div>

            <Form class="mt-12">
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
                                                class="rounded-md border w-10 h-10"
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
                                    class="font-sans text-xs font-light text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Ne plus demander sur cet appareil pendant 3 jours
                                </label>
                            </div>
                        </FormControl>
                    </FormItem>
                </FormField>

                <div class="flex flex-row justify-center space-x-8 mt-16">
                    <div>
                        <NuxtLink to="/">
                            <Button
                                variant="outline"
                                class="w-full px-10 rounded-full font-bold xl:text-base text-sm"
                            >
                                Retour
                            </Button>
                        </NuxtLink>
                    </div>
                    <div>
                        <Button
                            type="submit"
                            class="w-full px-16 font-bold xl:text-base text-sm"
                        >
                            Vérifier
                        </Button>
                    </div>
                </div>
            </Form>
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
