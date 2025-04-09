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
                        @click="profileDialog = true"
                    />
                    <TrashIcon
                        v-if="user.profile?.profil_url"
                        class="w-5 text-primary absolute -bottom-1 -right-2 sm:-right-1 cursor-pointer"
                        @click="deleteAvatarDialog = true"
                    />
                    <img
                        v-if="user.profile?.profil_url"
                        :src="useRuntimeConfig().public.API_URL + '/storage/' + user.profile?.profil_url"
                        class="w-16 h-16 sm:w-24 sm:h-24 rounded-full"
                    >
                    <img
                        v-else
                        src="/images/icons/user-circle.png"
                        class="w-16 h-16 sm:w-24 sm:h-24 rounded-full opacity-60"
                    >
                </div>

                <Dialog v-model:open="profileDialog">
                    <DialogContent class="sm:max-w-[40rem]">
                        <DialogHeader>
                            <DialogTitle>Modifier la photo de profil</DialogTitle>
                        </DialogHeader>
                        <div class="grid gap-4 py-4">
                            <div class="grid gap-2">
                                <FileUpload
                                    accept="image/*"
                                    @file-selected="profileFile = $event"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                :loading="profileUpload.loading"
                                @click="handleUploadProfile"
                            >
                                Sauvegarder
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="deleteAvatarDialog">
                    <DialogContent class="sm:max-w-md h-52">
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette photo de profil?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="gap-4 sm:gap-4">
                            <Button
                                variant="outline"
                                @click="deleteAvatarDialog = false"
                            >
                                Annuler
                            </Button>
                            <Button>
                                Confirmer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
                                                @click="updateInfoUser"
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
                                    {{ formatDate(user.date_of_birth) || ' - ' }}
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
                                                @click="handleUpdateAddress"
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
                        </div>

                        <div class="mt-4 space-y-3">
                            <div class="flex justify-between items-center">
                                <label
                                    for="currentPassword"
                                    class="text-primary sm:font-normal font-semibold sm:flex sm:items-center sm:space-x-3"
                                >
                                    <KeyIcon class="w-5 " />
                                    <span>Mot de passe</span>
                                </label>

                                <PencilSquareIcon
                                    class="w-5 text-black/50 hover:text-primary font-semibold text-sm cursor-pointer"
                                    @click="changePasswordDialog = true"
                                />

                                <Dialog v-model:open="changePasswordDialog">
                                    <DialogContent class="w-full sm:max-w-xl h-96 overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Changer le mot de passe</DialogTitle>
                                        </DialogHeader>
                                        <DialogDescription>
                                            Veuillez entrer votre mot de passe actuel et nouveau mot de passe ici
                                        </DialogDescription>

                                        <form class="mt-4 space-y-3">
                                            <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                                <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                    Mot de passe actuel
                                                </p>
                                                <Input
                                                    v-model="formPassword.currentPassword"
                                                    type="password"
                                                    class="bg-transparent placeholder:text-black"
                                                />
                                            </div>

                                            <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                                <p class="bg-primary flex items-center h-full text-white ps-4 rounded-s-full">
                                                    Nouveau mot de passe
                                                </p>
                                                <Input
                                                    v-model="formPassword.password"
                                                    type="password"
                                                    class="bg-transparent placeholder:text-black"
                                                />
                                            </div>

                                            <div class="grid grid-cols-[40%_60%] items-center border border-primary h-9 rounded-full">
                                                <p class="bg-primary text-nowrap flex items-center h-full text-white ps-4 rounded-s-full">
                                                    Confirmer mot de passe
                                                </p>
                                                <Input
                                                    v-model="formPassword.password_confirmation"
                                                    type="password"
                                                    class="bg-transparent placeholder:text-black"
                                                />
                                            </div>

                                            <div class="flex justify-end items-center space-x-8 pt-6">
                                                <Button
                                                    variant="secondary"
                                                    class="bg-gray-200 hover:bg-gray-300"
                                                    @click="changePasswordDialog = false"
                                                >
                                                    Annuler
                                                </Button>
                                                <Button
                                                    @click="handleChangePassword"
                                                >
                                                    Enregistrer
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div class="flex justify-between items-center space-x-3">
                                <label
                                    for="authTwoFactor"
                                    class="text-primary truncate font-semibold sm:font-normal sm:text-black sm:flex sm:items-center sm:space-x-3"
                                >
                                    <DevicePhoneMobileIcon class="w-5 hidden sm:block" />
                                    <span class="w-full truncate">Authentification à deux facteurs</span>
                                </label>
                                <Switch id="authTwoFactor" />
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
                                <Select
                                    v-model="formSetting"
                                    @update:model-value="handleChangeLanguage"
                                >
                                    <SelectTrigger
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
                        </div>
                    </section>

                    <section class="mt-4 xl:mt-0">
                        <h3 class="flex items-center space-x-4">
                            <BellAlertIcon class="w-6 text-gray-400" />
                            <span class="text-lg">Notification</span>
                        </h3>

                        <div class="mt-4 space-y-4">
                            <div class="flex justify-between items-center">
                                <Label for="newReplacement">Nouveau remplacement</Label>
                                <Switch
                                    id="newReplacement"
                                    v-model:checked="notifNewReplacement"
                                    @update:checked="handleChangeNotifNew"
                                />
                            </div>
                            <div class="flex justify-between items-center">
                                <Label for="acceptReplacement">Remplacement accepté</Label>
                                <Switch
                                    id="acceptReplacement"
                                    v-model:checked="notifAcceptReplacement"
                                    @update:checked="handleChangeNotifAccept"
                                />
                            </div>
                        </div>
                    </section>

                    <section class="mt-8 grid grid-cols-6 sm:grid-cols-5 gap-2">
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
                        <div
                            class="col-span-2 sm:col-span-1 flex h-9 items-center justify-center rounded-full border border-gray-300 cursor-pointer"
                        >
                            Suspendu
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

import { useRuntimeConfig } from '#app';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useReports } from '~/composables/useReports';
import { useAuth } from '~/composables/useAuth';
import FileUpload from '~/components/ui/form/FileUpload.vue';
import type { User } from '~/lib/types';

const { $toast } = useNuxtApp();

const { updateUser, updateAddressUser, updatePasswordUser, updateAvatarUser} = useAuth();
const { createPreferences, createNotifPreferences } = useReports();

const user = useState<User>('user');
const setting = JSON.parse(user.value.settings);

const formSetting = ref(setting.language);
const formPassword = reactive({
    currentPassword: '',
    password: '',
    password_confirmation: '',
});

const personalInfoDialog = ref(false);
const addressInfoDialog = ref(false);
const changePasswordDialog = ref(false);
const profileDialog = ref(false);
const deleteAvatarDialog = ref(false);

const formattedGender = computed(() => {
    return user.value.gender == 'F' ? 'Homme' : 'Femme';
});

const formattedCountry = computed(() => {
    return user.value.profile.country == 'be' ? 'Belgique' : 'France';
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const formPersonalInfo = reactive({
    id: user.value.id,
    lastname: user.value.lastname,
    firstname: user.value.firstname,
    dateOfBirth: formatDate(user.value.date_of_birth),
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
    additionalInfo: user.value.profile.additional_info,
});

const updateInfoUser = async () => {
    try {
        await updateUser(formPersonalInfo);

        user.value.lastname = formPersonalInfo.lastname;
        user.value.firstname = formPersonalInfo.firstname;
        user.value.date_of_birth = formPersonalInfo.dateOfBirth;
        user.value.email = formPersonalInfo.email;
        user.value.identifier_number = formPersonalInfo.identifierNumber;
        user.value.phone_number = formPersonalInfo.phoneNumber;
        user.value.gender = formPersonalInfo.gender;

        $toast({
            description: 'Mise à jour effectué avec succès',
        });
    }
    catch (error) {
        console.log(error);

        $toast({
            variant: 'destructive',
            description: 'Echec de la mise à jour',
        });
    }
    finally {
        personalInfoDialog.value = false;
    }
};

const handleUpdateAddress = async () => {
    try {
        await updateAddressUser(formAddress);

        user.value.profile.street_address = formAddress.streetAddress;
        user.value.profile.city = formAddress.city;
        user.value.profile.country = formAddress.country;
        user.value.profile.zip_code = formAddress.zipCode;
        user.value.profile.additional_info = formAddress.additionalInfo;

        $toast({
            description: 'Mise à jour effectué avec succès',
        });
    }
    catch (error) {
        console.log(error);

        $toast({
            variant: 'destructive',
            description: 'Echec de la mise à jour',
        });
    }
    finally {
        addressInfoDialog.value = false;
    }
};

const languages = {
    fr: 'Français',
    nl: 'Néerlandais',
};

const handleChangeLanguage = async () => {
    const formData = reactive({
        key: 'language',
        value: formSetting.value,
    });
    await createPreferences(formData);
};

const handleChangePassword = async () => {
    try {
        await updatePasswordUser(formPassword);
        $toast({
            description: 'Mise à jour effectuée avec succès',
        });
    }
    catch (error) {
        console.log(error);
        $toast({
            variant: 'destructive',
            description: 'Echec de la mise à jour',
        });
    }
    finally {
        changePasswordDialog.value = false;

        formPassword.currentPassword = '';
        formPassword.password = '';
        formPassword.password_confirmation = '';
    }
};

const verifyNotifNewRePlacement = () => {
    return setting.notification == 'newReplacement' ? true : false;
};

const verifyNotifAcceptRePlacement = () => {
    return setting.notification == 'acceptReplacement' ? true : false;
};

const notifNewReplacement = ref(verifyNotifNewRePlacement());
const notifAcceptReplacement = ref(verifyNotifAcceptRePlacement());

const handleChangeNotifNew = async () => {
    try {
        if (notifNewReplacement.value) {
            const formData = reactive({
                key: 'notification',
                value: 'newReplacement',
            });

            await createNotifPreferences(formData);
        }
        else {
            const formData = reactive({
                key: 'notification',
                value: '',
            });

            await createNotifPreferences(formData);
        }
    }
    catch (error) {
        console.log(error);
    }
};

const handleChangeNotifAccept = async () => {
    try {
        if (notifAcceptReplacement.value) {
            const formData = reactive({
                key: 'notification',
                value: 'acceptReplacement',
            });

            await createNotifPreferences(formData);
        }
        else {
            const formData = reactive({
                key: 'notification',
                value: '',
            });

            await createNotifPreferences(formData);
        }
    }
    catch (error) {
        console.log(error);
    }
};

const handleUploadProfile = async () => {
    if (!profileFile.value) {
        $toast({
            description: 'Veuillez sélectionner une image',
        });
        return;
    }

    try {
        const formData = new FormData();
        formData.append('profil_url', profileFile.value);

        const response = await updateAvatarUser(formData);
        user.value.profile.profil_url = response.profile.profil_url;

        $toast({
            description: 'Photo mise à jour',
        });
        profileDialog.value = false;
    }
    catch (error) {
        console.log(error);
    }
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

const profileFile = ref(null);
const profileUpload = useFile();

watch(profileFile, (newFile) => {
    profileUpload.file.value = newFile;
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});

useHead({
    title: 'Paramètres',
});
</script>
