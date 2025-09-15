<template>
    <form class="w-full">
        <Separator class="my-4 lg:my-10" />

        <div class="grid lg:grid-cols-3 gap-8 items-center">
            <div class="lg:col-span-1">
                <h3 class="font-semibold text-lg">
                    Utilisateur sélectionné
                </h3>
                <p class="mt-2">
                    L'utilisateur à attribuer le bon de commande
                </p>
            </div>

            <div class="lg:col-span-2 flex gap-8">
                <InputIcon
                    rounded="md"
                    class="max-w-full"
                />

                <Button class="rounded-md">
                    <EyeIcon />
                    <span>Détail</span>
                </Button>
            </div>
        </div>

        <Separator class="my-4 lg:my-10" />

        <div class="grid grid-cols-3 gap-8 items-center">
            <div class="lg:col-span-1 text-nowrap lg:text-wrap">
                <h3 class="font-semibold text-lg">
                    Information
                </h3>
                <p class="mt-2">
                    Les informations à compléter
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-8">
                <Select
                    label="Formule"
                    class="font-medium"
                >
                    <SelectTrigger
                        position="right"
                        class="rounded-md mt-2"
                    >
                        <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent class="border border-none">
                        <SelectGroup>
                            <SelectItem :value="'starter'">
                                <span class="text-sm">STARTER</span>
                            </SelectItem>
                            <SelectItem :value="'standard'">
                                <span class="text-sm">STANDARD</span>
                            </SelectItem>
                            <SelectItem :value="'premium'">
                                <span class="text-sm">PREMIUM</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div class="flex flex-col space-y-6 text-gray-600 text-sm">
                    <label class="font-medium">
                        Options supplémentaires
                    </label>

                    <div class="flex flex-col gap-8 md:flex-row md:gap-24">
                        <div class="flex items-center space-x-2">
                            <Checkbox id="customDomain" />
                            <label
                                for="customDomain"
                            >
                                Nom de domaine personnalisé
                            </label>
                        </div>

                        <div class="sm:flex sm:space-x-6 text-gray-600 text-sm">
                            <label>
                                Maintenance :
                            </label>
                            <div class="flex gap-8 items-center mt-4 sm:mt-0">
                                <div class="flex gap-3 items-center">
                                    <input
                                        id="monthly"
                                        type="radio"
                                        value="monthly"
                                    >
                                    <label
                                        for="monthly"
                                        class="text-sm"
                                    >
                                        Mensuel
                                    </label>
                                </div>

                                <div class="flex gap-3 items-center">
                                    <input
                                        id="yearly"
                                        type="radio"
                                        value="yearly"
                                    >
                                    <label
                                        for="yearly"
                                        class="text-sm"
                                    >Annuel</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col space-y-3 text-gray-600 text-sm">
                    <label class="font-medium">
                        Mode de paiement
                    </label>
                    <div class="flex gap-8 items-center">
                        <div class="flex gap-3 items-center">
                            <input
                                id="monthly"
                                type="radio"
                                value="monthly"
                            >
                            <label
                                for="monthly"
                                class="text-sm"
                            >
                                Mensuel
                            </label>
                        </div>

                        <div class="flex gap-3 items-center">
                            <input
                                id="yearly"
                                type="radio"
                                value="yearly"
                            >
                            <label
                                for="yearly"
                                class="text-sm"
                            >Annuel</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Separator class="my-10" />

        <Button class="rounded-md mt-4 flex justify-center mx-auto w-64">
            Créer
        </Button>
    </form>
</template>

<script lang="ts" setup>
import { EyeIcon } from '@heroicons/vue/24/outline';
</script>
