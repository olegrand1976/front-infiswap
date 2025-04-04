<template>
    <div>
        <div class="bg-gray-100 flex flex-col space-y-4 sm:space-y-0 sm:flex-row py-4 sm:py-0 px-4 rounded-lg items-center sm:h-12">
            <h1 class="text-primary">
                Paramètres
            </h1>
        </div>

        <form class="mt-6 mb-12 bg-gray-100 p-3 sm:p-8 rounded-lg shadow">
            <div class="flex justify-center sm:justify-start space-x-4 items-center sm:w-96 h-20 sm:h-28 px-1 py-2 rounded-full border border-gray-300">
                <div class="relative">
                    <PencilSquareIcon
                        class="w-5 text-gray-600 absolute -top-1 -right-2 sm:-right-1 cursor-pointer"
                    />
                    <img
                        src="/images/icons/user-circle.png"
                        class="w-16 h-16 sm:w-24 sm:h-24 rounded-full opacity-60"
                    >
                </div>

                <div>
                    <LayoutsLogo class="w-36 sm:w-48" />
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12">
                <div class="space-y-12">
                    <section>
                        <div class="flex justify-between items-center">
                            <h3 class="flex items-center space-x-4">
                                <IdentificationIcon class="w-6 text-gray-400" />
                                <span class="text-lg">Information générale</span>
                            </h3>

                            <PencilSquareIcon
                                class="w-5 text-black/60 hover:text-primary cursor-pointer"
                                @click="personalInfoDialog = true"
                            />

                            <Dialog v-model:open="personalInfoDialog">
                                <DialogContent class="w-full sm:max-w-xl h-[36rem] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Mise à jour</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Vous pouvez mettre à jour ici vos informations personnelles
                                    </DialogDescription>

                                    <form class="mt-4 space-y-3">
                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Nom
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.lastname"
                                                type="text"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Prénom
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.firstname"
                                                type="text"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Date de naissance
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.dateOfBirth"
                                                type="date"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Email
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.email"
                                                type="email"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Numéro INAMI
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.identifierNumber"
                                                type="text"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Téléphone
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.phoneNumber"
                                                type="text"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Sexe
                                            </p>
                                            <Select v-model="formPersonalInfo.gender">
                                                <SelectTrigger
                                                    class="w-full text-black bg-transparent text-nowrap border border-none"
                                                    position="right"
                                                >
                                                    <SelectValue :value="formPersonalInfo.gender" />
                                                </SelectTrigger>

                                                <SelectContent class="border border-none">
                                                    <template
                                                        v-for="[key, value] in Object.entries(genders)"
                                                        :key="key"
                                                    >
                                                        <SelectItem :value="key">
                                                            {{ value }}
                                                        </SelectItem>
                                                    </template>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div class="flex justify-end items-center space-x-8 pt-6">
                                            <Button
                                                variant="secondary"
                                                class="bg-gray-200 hover:bg-gray-300"
                                                @click="personalInfoDialog = false"
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                            >
                                                Enregistrer
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div class="mt-4 space-y-3">
                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <UserCircleIcon class="w-5" />
                                        <span>Nom</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.lastname }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <UserPlusIcon class="w-5" />
                                        <span>Prénom</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.firstname }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <CalendarDaysIcon class="w-5" />
                                        <span>Date de naissance</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.date_of_birth || ' - ' }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <EnvelopeIcon class="w-5" />
                                        <span>Email</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.email }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <span class="font-bold">N°</span>
                                        <span>Numéro INAMI</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.identifier_number }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <PhoneIcon class="w-5" />
                                        <span>Téléphone</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.phone_number }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <img
                                            src="/images/icons/gender_white.png"
                                            class="w-5"
                                        >
                                        <span>Sexe</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ formattedGender || ' - ' }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div class="flex justify-between items-center">
                            <h3 class="flex items-center space-x-4">
                                <MapPinIcon class="w-6 text-gray-400" />
                                <span class="text-lg">Adresse</span>
                            </h3>

                            <PencilSquareIcon
                                class="w-5 text-black/50 hover:text-primary cursor-pointer"
                                @click="addressInfoDialog = true"
                            />

                            <Dialog v-model:open="addressInfoDialog">
                                <DialogContent class="w-full sm:max-w-xl h-[28rem] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Mise à jour</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Vous pouvez mettre à jour ici vos informations concernant votre adresse
                                    </DialogDescription>
 
                                    <form class="mt-4 space-y-3">
                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Rue
                                            </p>
                                            <Input
                                                v-model="formAddress.streetAddress"
                                                type="text"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Ville
                                            </p>
                                            <Input
                                                v-model="formAddress.city"
                                                type="text"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Pays
                                            </p>
                                            <Select v-model="formAddress.country">
                                                <SelectTrigger
                                                    class="w-full text-black bg-transparent text-nowrap border border-none"
                                                    position="right"
                                                >
                                                    <SelectValue :value="formPersonalInfo.gender" />
                                                </SelectTrigger>

                                                <SelectContent class="border border-none">
                                                    <template
                                                        v-for="[key, value] in Object.entries(countries)"
                                                        :key="key"
                                                    >
                                                        <SelectItem :value="key">
                                                            {{ value }}
                                                        </SelectItem>
                                                    </template>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Code postal
                                            </p>
                                            <Input
                                                v-model="formAddress.zipCode"
                                                type="text"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                            <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                Complément d'adresse
                                            </p>
                                            <Input
                                                v-model="formAddress.additionalInfo"
                                                type="text"
                                                class="bg-transparent placeholder:text-black"
                                            />
                                        </div>

                                        <div class="flex justify-end items-center space-x-8 pt-6">
                                            <Button
                                                variant="secondary"
                                                class="bg-gray-200 hover:bg-gray-300"
                                                @click="addressInfoDialog = false"
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                            >
                                                Enregistrer
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div class="mt-4 space-y-3">
                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <MapIcon class="w-5" />
                                        <span>Rue</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile.street_address || ' - ' }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <BuildingOffice2Icon class="w-5" />
                                        <span>Ville</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile.city || ' - ' }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <FlagIcon class="w-5" />
                                        <span>Pays</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ formattedCountry || ' - ' }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <img
                                            src="/images/icons/zip_code.png"
                                            class="w-5"
                                        >
                                        <span>Code postal</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile.zip_code || ' - ' }}
                                </p>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0  truncate text-nowrap"
                                    >
                                        <EllipsisHorizontalCircleIcon class="w-5" />
                                        <span>Complément d'adresse</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile.additionnal_info || ' - ' }}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <div class="space-y-12 mt-4 xl:mt-0">
                    <section>
                        <div class="flex justify-between items-center">
                            <h3 class="flex items-center space-x-4">
                                <ShieldCheckIcon class="w-6 text-gray-400" />
                                <span class="text-lg">Sécurité</span>
                            </h3>

                            <p class="text-primary font-semibold text-sm pt-4 cursor-pointer">
                                Changer de mot de passe ?
                            </p>
                        </div>

                        <div class="mt-4 space-y-3">
                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        for="currentPassword"
                                        class="text-primary font-semibold sm:text-white sm:flex sm:items-center sm:space-x-3"
                                    >
                                        <KeyIcon class="w-5 " />
                                        <span>Mot de passe actuel</span>
                                    </label>
                                </div>
                                <InputIcon
                                    type="password"
                                    class="sm:hidden"
                                />
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    class="w-full bg-transparent hidden sm:block"
                                />
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        for="authTwoFactor"
                                        class="text-primary truncate font-semibold sm:text-white sm:flex sm:items-center sm:space-x-3"
                                    >
                                        <DevicePhoneMobileIcon class="w-5 hidden sm:block" />
                                        <span class="w-full truncate">Authentification à deux facteurs</span>
                                    </label>
                                </div>
                                <div
                                    id="authTwoFactor"
                                    class="flex items-center justify-center px-2 sm:space-x-1 space-x-4 mt-2 sm:mt-0"
                                >
                                    <div class="flex h-9 items-center justify-center rounded-full border border-gray-300 w-44 cursor-pointer">
                                        Activé
                                    </div>
                                    <div class="flex h-9 items-center justify-center rounded-full border border-gray-300 w-44 cursor-pointer">
                                        Désactivé
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center space-x-2 mt-3">
                                <Checkbox id="confirm" />
                                <label
                                    for="confirm"
                                    class="font-sans font-light text-black/60 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Confirmation de mot de passe
                                </label>
                            </div>
                        </div>
                    </section>

                    <section class="mt-4 xl:mt-0">
                        <h3 class="flex items-center space-x-4">
                            <WrenchScrewdriverIcon class="w-6 text-gray-400" />
                            <span class="text-lg">Préférences</span>
                        </h3>

                        <div class="mt-4 space-y-3">
                            <div class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        for="language"
                                        class="text-primary font-semibold sm:text-white sm:flex sm:items-center sm:space-x-3"
                                    >
                                        <LanguageIcon class="w-5 hidden sm:block" />
                                        <span>Langue</span>
                                    </label>
                                </div>
                                <Select>
                                    <SelectTrigger
                                        v-model="formSetting"
                                        class="w-full text-black bg-white sm:bg-transparent text-nowrap border-2 border-gray-300 focus-within:border-primary sm:focus-within:border-none rounded-full sm:rounded-none sm:border-none"
                                        position="right"
                                    >
                                        <SelectValue :placeholder="languages[formSetting]" />
                                    </SelectTrigger>

                                    <SelectContent class="border border-none">
                                        <template
                                            v-for="[key, value] in Object.entries(languages)"
                                            :key="key"
                                        >
                                            <SelectItem :value="key">
                                                {{ value }}
                                            </SelectItem>
                                        </template>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div class="block sm:grid sm:grid-cols-2 sm:h-9 sm:rounded-full">
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        for="notification"
                                        class="text-primary font-semibold sm:text-white sm:flex sm:items-center sm:space-x-3"
                                    >
                                        <BellAlertIcon class="w-5 hidden sm:block" />
                                        <span class="text-nowrap w-full truncate">Notification</span>
                                    </label>
                                </div>
                                <div
                                    id="notification"
                                    class="flex items-center justify-center px-2 space-x-4 sm:space-x-1 mt-2 sm:mt-0"
                                >
                                    <div class="flex h-9 items-center justify-center rounded-full border border-gray-300 w-44 cursor-pointer">
                                        Activé
                                    </div>
                                    <div class="flex h-9 items-center justify-center rounded-full border border-gray-300 w-44 cursor-pointer">
                                        Désactivé
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 grid grid-cols-6 sm:grid-cols-5 gap-2">
                            <div class="mb-2 sm:mb-0 col-span-6 sm:col-span-2 flex space-x-1 h-9 justify-center items-center bg-success text-white rounded-full">
                                <ChartPieIcon class="w-5" />
                                <label>Statut de compte</label>
                            </div>
                            <div class="col-span-2 sm:col-span-1 flex h-9 items-center justify-center rounded-full border border-gray-300 cursor-pointer">
                                Activé
                            </div>
                            <div class="col-span-2 sm:col-span-1 flex h-9 items-center justify-center rounded-full border border-gray-300 cursor-pointer">
                                Désactivé
                            </div>
                            <div class="col-span-2 sm:col-span-1 flex h-9 items-center justify-center rounded-full border border-gray-300 cursor-pointer">
                                Suspendu
                            </div>
                        </div>
                    </section>

                    <section class="flex flex-col justify-end items-center pt-48 space-y-4">
                        <Button class="flex w-48 ml-auto text-end text-primary bg-transparent border border-primary shadow-none hover:text-white">
                            <TrashIcon class="w-5" />
                            <span>Supprimer compte</span>
                        </Button>
                    </section>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import {
    IdentificationIcon,
    UserCircleIcon,
    UserPlusIcon,
    CalendarDaysIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    MapIcon,
    BuildingOffice2Icon,
    FlagIcon,
    EllipsisHorizontalCircleIcon,
    ShieldCheckIcon,
    KeyIcon,
    DevicePhoneMobileIcon,
    WrenchScrewdriverIcon,
    LanguageIcon,
    BellAlertIcon,
    ChartPieIcon,
    TrashIcon,
    PencilSquareIcon,
} from '@heroicons/vue/24/solid';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const user = useState('user');
const setting = JSON.parse(user.value.settings);

const formSetting = ref(setting.language);

const personalInfoDialog = ref(false);
const addressInfoDialog = ref(false);
const securityInfoDialog = ref(false);

const formattedGender = computed(() => {
    return user.value.gender == 'F' ? 'Homme' : 'Femme';
});

const formattedCountry = computed(() => {
    return user.value.profile.country == 'be' ? 'Belgique' : 'France';
});

const formPersonalInfo = reactive({
    lastname: user.value.lastname,
    firstname: user.value.firstname,
    dateOfBirth: user.value.date_of_birth,
    email: user.value.email,
    identifierNumber: user.value.identifier_number,
    phoneNumber: user.value.phone_number,
    gender: user.value.gender,
});

const formAddress = reactive({
    streetAddress: user.value.profile.street_address,
    city: user.value.profile.city,
    country: user.value.profile.country,
    zipCode: user.value.profile.zip_code,
    additionalInfo: user.value.additional_info,
});

const languages = {
    fr: 'Français',
    nl: 'Néerlandais',
};

const genders = {
    M: 'Homme',
    F: 'Femme',
    X: 'X',
};

const countries = {
    be: 'Belgique',
    fr: 'France',
};

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

useHead({
    title: 'Paramètres',
});
</script>
