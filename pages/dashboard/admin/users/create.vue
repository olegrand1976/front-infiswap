<template>
    <div>
        <DashboardAdminPageHeader title="Nouvel utilisateur" />
        <DashboardAdminPageContent class="bg-gray-100">
            <form>
                <div class="grid grid-cols-[40%_60%] gap-4 lg:gap-8">
                    <div class="p-4">
                        <h1 class="font-semibold text-gray-600">
                            Information
                        </h1>
                        <p class="mt-2 text-md text-gray-500">
                            Les information personnelles
                        </p>
                    </div>
                    <div class="bg-white p-4 rounded-md flex flex-col gap-4">
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Nom"
                                name="lastname"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Prénom"
                                name="firstname"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="INAMI"
                                name="identifier_number"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                type="email"
                                label="Email"
                                name="email"
                            />
                        </div>
                        <div>sexe</div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Téléphone"
                                name="phone_number"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Date de naissance"
                                name="date_of_birth"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Langue"
                                name="language"
                            />
                        </div>
                    </div>
                </div>
                <Separator class="my-10" />
                <div class="grid grid-cols-[40%_60%] gap-4 lg:gap-8">
                    <div class="p-4">
                        <h1 class="font-semibold text-gray-600">
                            Adresse
                        </h1>
                        <p class="mt-2 text-md text-gray-500">
                            Les informations d'addresse
                        </p>
                    </div>
                    <div class="bg-white p-4 rounded-md flex flex-col gap-4">
                        <div>
                            <InputIcon
                                rounded="md"
                                label="N° et rue"
                                name="street"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Ville"
                                name="city"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Code postale"
                                name="zipCode"
                            />
                        </div>
                        <div>
                            <InputIcon
                                rounded="md"
                                label="Complément d'adresse"
                                name="additionnalInformation"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
useHead({ title: 'Nouvel utilisateur' });

definePageMeta({
    layout: 'dashboard',
});
</script>
