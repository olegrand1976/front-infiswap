<template>
    <div class="lg:ml-20 xl:ml-0">
        <ArrowLeftIcon
            class="size-6 cursor-pointer hover:text-primary mt-4"
            title="Retour"
            @click="goBack"
        />

        <div class="mt-6 bg-gray-100 flex flex-col space-y-4 sm:space-y-0 sm:flex-row py-4 sm:py-0 px-4 rounded-lg items-center sm:h-12">
            <h1 class="text-primary">
                Paramètres
            </h1>
        </div>

        <form class="mt-6 mb-12">
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
                        v-if="user.profile?.profil_url != null"
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
                                @click="submit"
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
                            <Button
                                @click="handleDeleteAvatar"
                            >
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
                    <section class="shadow rounded-lg p-6">
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
                                <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle class="text-center">
                                            Mise à jour
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Vous pouvez mettre à jour ici vos informations personnelles
                                    </DialogDescription>

                                    <form class="mt-4 space-y-3">
                                        <div
                                            v-if="user.type == 'institution'"
                                            class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                        >
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Nom de l'institution
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.institution.name"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Nom
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.lastname"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Prénom
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.firstname"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Date de naissance
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.dateOfBirth"
                                                type="date"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary w-full truncate sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Email
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.email"
                                                type="email"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Numéro {{ identifierLabel }}
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.identifierNumber"
                                                type="text"
                                                :placeholder="!formPersonalInfo.identifierNumber ? '19960116' : ''"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-gray-400 h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Téléphone
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.phoneNumber"
                                                type="text"
                                                :placeholder="!formPersonalInfo.phoneNumber ? '00 32 2 374 XX XX' : ''"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-gray-400 h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Sexe
                                            </p>
                                            <Select v-model="formPersonalInfo.gender">
                                                <SelectTrigger
                                                    class="w-full text-black bg-gray-100 sm:bg-transparent text-nowrap border-none"
                                                    position="right"
                                                >
                                                    <SelectValue :value="formPersonalInfo.gender" />
                                                </SelectTrigger>
                                                <SelectContent class="border-none">
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

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Catégorie professionnel
                                            </p>
                                            <Select v-model="formPersonalInfo.professionalCategory">
                                                <SelectTrigger
                                                    class="w-full text-black bg-gray-100 sm:bg-transparent text-nowrap border-none"
                                                    position="right"
                                                >
                                                    <SelectValue :value="formPersonalInfo.professionalCategory" />
                                                </SelectTrigger>
                                                <SelectContent class="border-none">
                                                    <template
                                                        v-for="[key, value] in Object.entries(professionalCategory)"
                                                        :key="key"
                                                    >
                                                        <SelectItem :value="key">
                                                            {{ value }}
                                                        </SelectItem>
                                                    </template>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div class="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8 pt-6">
                                            <Button
                                                variant="secondary"
                                                class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                                                @click="personalInfoDialog = false"
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                class="w-full sm:w-auto"
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
                            <div
                                v-if="user.type == 'institution'"
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <BuildingOfficeIcon class="w-5" />
                                        <span>Nom de l'institution</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.institution.name }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
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

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
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

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <CalendarDaysIcon class="w-5" />
                                        <span>Date de naissance</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ formatStringDate(user.date_of_birth) !== '01/01/1970' ? formatStringDate(user.date_of_birth) : 'jj/mm/aaaa' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <EnvelopeIcon class="w-5" />
                                        <span class="truncate w-full">Email</span>
                                    </label>
                                </div>
                                <p class="border w-full truncate border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.email }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <span class="font-bold">N°</span>
                                        <span>{{ identifierLabel }}</span>
                                    </label>
                                </div>
                                <p
                                    class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded"
                                    :class="{ 'text-gray-400': !user?.identifier_number }"
                                >
                                    {{ user.identifier_number || '19960116' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <PhoneIcon class="w-5" />
                                        <span>Téléphone</span>
                                    </label>
                                </div>
                                <p
                                    class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded"
                                    :class="{ 'text-gray-400': !user?.phone_number }"
                                >
                                    {{ user?.phone_number || '00 32 2 374 XX XX' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
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

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <UserGroupIcon class="text-white w-5" />
                                        <span>Catégorie professionnel</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ formattedCategory || ' - ' }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section
                        v-if="user.type != 'institution'" 
                        class="shadow rounded-lg p-6"
                    >
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
                                <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle class="text-center">
                                            Mise à jour
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Vous pouvez mettre à jour ici vos informations concernant votre adresse
                                    </DialogDescription>

                                    <form class="mt-4 space-y-3">
                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Rue
                                            </p>
                                            <Input
                                                v-model="formAddress.streetAddress"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Ville
                                            </p>
                                            <Input
                                                v-model="formAddress.city"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Pays
                                            </p>
                                            <Select v-model="formAddress.country">
                                                <SelectTrigger
                                                    class="w-full text-black bg-gray-100 sm:bg-transparent text-nowrap border-none"
                                                    position="right"
                                                >
                                                    <SelectValue :value="formAddress.country" />
                                                </SelectTrigger>
                                                <SelectContent class="border-none">
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

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Pays de travail
                                            </p>
                                            <Select v-model="formAddress.workingAt">
                                                <SelectTrigger
                                                    class="w-full text-black bg-gray-100 sm:bg-transparent text-nowrap border-none"
                                                    position="right"
                                                >
                                                    <SelectValue :value="formAddress.workingAt" />
                                                </SelectTrigger>
                                                <SelectContent class="border-none">
                                                    <template
                                                        v-for="(value, key) in ['Belgique', 'France']"
                                                        :key="key"
                                                    >
                                                        <SelectItem :value="value">
                                                            {{ value }}
                                                        </SelectItem>
                                                    </template>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Code postal
                                            </p>
                                            <Input
                                                v-model="formAddress.zipCode"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Complément
                                            </p>
                                            <Input
                                                v-model="formAddress.additionalInfo"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8 pt-6">
                                            <Button
                                                variant="secondary"
                                                class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                                                @click="addressInfoDialog = false"
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                class="w-full sm:w-auto"
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
                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <MapIcon class="w-5" />
                                        <span>Rue</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile?.street_address || ' - ' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <BuildingOffice2Icon class="w-5" />
                                        <span>Ville</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile?.city || ' - ' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
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

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <BuildingOfficeIcon class="w-5" />
                                        <span>Pays de travail</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile?.working_at || ' - ' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <EnvelopeOpenIcon class="w-5" />
                                        <span>Code postal</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile?.zip_code || ' - ' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0  truncate text-nowrap"
                                    >
                                        <EllipsisHorizontalCircleIcon class="w-5" />
                                        <span>Complément</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.additional_info || ' - ' }}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <div class="space-y-12 mt-4 xl:mt-0">
                    <section
                        v-if="user.type == 'institution'"
                        class="shadow rounded-lg p-6 mb-6"
                    >
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
                                <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle class="text-center">
                                            Mise à jour
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        Vous pouvez mettre à jour ici vos informations concernant votre adresse
                                    </DialogDescription>

                                    <form class="mt-4 space-y-3">
                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Rue
                                            </p>
                                            <Input
                                                v-model="formAddress.streetAddress"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Ville
                                            </p>
                                            <Input
                                                v-model="formAddress.city"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Pays
                                            </p>
                                            <Select v-model="formAddress.country">
                                                <SelectTrigger
                                                    class="w-full text-black bg-gray-100 sm:bg-transparent text-nowrap border-none"
                                                    position="right"
                                                >
                                                    <SelectValue :value="formAddress.country" />
                                                </SelectTrigger>
                                                <SelectContent class="border-none">
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

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Pays de travail
                                            </p>
                                            <Select v-model="formAddress.workingAt">
                                                <SelectTrigger
                                                    class="w-full text-black bg-gray-100 sm:bg-transparent text-nowrap border-none"
                                                    position="right"
                                                >
                                                    <SelectValue :value="formAddress.workingAt" />
                                                </SelectTrigger>
                                                <SelectContent class="border-none">
                                                    <template
                                                        v-for="(value, key) in ['Belgique', 'France']"
                                                        :key="key"
                                                    >
                                                        <SelectItem :value="value">
                                                            {{ value }}
                                                        </SelectItem>
                                                    </template>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Code postal
                                            </p>
                                            <Input
                                                v-model="formAddress.zipCode"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                Complément
                                            </p>
                                            <Input
                                                v-model="formAddress.additionalInfo"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8 pt-6">
                                            <Button
                                                variant="secondary"
                                                class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                                                @click="addressInfoDialog = false"
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                class="w-full sm:w-auto"
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
                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <MapIcon class="w-5" />
                                        <span>Rue</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile?.street_address || ' - ' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <BuildingOffice2Icon class="w-5" />
                                        <span>Ville</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile?.city || ' - ' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
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

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <BuildingOfficeIcon class="w-5" />
                                        <span>Pays de travail</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile?.working_at || ' - ' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <EnvelopeOpenIcon class="w-5" />
                                        <span>Code postal</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.profile?.zip_code || ' - ' }}
                                </p>
                            </div>

                            <div
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="addressInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0  truncate text-nowrap"
                                    >
                                        <EllipsisHorizontalCircleIcon class="w-5" />
                                        <span>Complément</span>
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.additional_info || ' - ' }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section class="shadow rounded-lg p-6">
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
                                    class="font-normal flex items-center space-x-3"
                                >
                                    <KeyIcon class="w-5 " />
                                    <span>Mot de passe</span>
                                </label>

                                <PencilSquareIcon
                                    class="w-5 text-black/50 hover:text-primary font-semibold text-sm cursor-pointer"
                                    @click="changePasswordDialog = true"
                                />

                                <Dialog v-model:open="changePasswordDialog">
                                    <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle class="text-center">
                                                Changer le mot de passe
                                            </DialogTitle>
                                        </DialogHeader>
                                        <DialogDescription>
                                            Veuillez entrer votre mot de passe actuel et nouveau mot de passe ici
                                        </DialogDescription>

                                        <form class="mt-4 space-y-3">
                                            <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                                <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                    Mot de passe actuel
                                                </p>
                                                <Input
                                                    v-model="formPassword.currentPassword"
                                                    type="password"
                                                    class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                                />
                                            </div>

                                            <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                                <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                    Nouveau mot de passe
                                                </p>
                                                <Input
                                                    v-model="formPassword.password"
                                                    type="password"
                                                    class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                                />
                                            </div>

                                            <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                                <p class="text-primary sm:text-white sm:bg-primary text-nowrap flex items-center h-full ps-4 rounded-s-full">
                                                    Confirmer mot de passe
                                                </p>
                                                <Input
                                                    v-model="formPassword.password_confirmation"
                                                    type="password"
                                                    class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                                />
                                            </div>

                                            <div class="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8 pt-6">
                                                <Button
                                                    variant="secondary"
                                                    class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                                                    @click="changePasswordDialog = false"
                                                >
                                                    Annuler
                                                </Button>
                                                <Button
                                                    class="w-full sm:w-auto"
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
                                <Switch
                                    id="authTwoFactor"
                                    v-model:checked="enableTwoFactor"
                                    @update:checked="handleEnableAuth2Fa"
                                />

                                <Dialog v-model:open="twoFactorDialog">
                                    <DialogContent class="sm:max-w-[40rem]">
                                        <DialogHeader>
                                            <DialogTitle>Authentification à deux facteurs</DialogTitle>
                                        </DialogHeader>
                                        <div class="text-center mx-12 mt-8">
                                            Afin d'activer cette option, veuillez entrer les 6 chiffres envoyés à votre adresse e-mail
                                            <span class="font-semibold text-primary">{{ user.email }}</span>. Le code
                                            envoyé est valide pour 5 min
                                        </div>

                                        <div class="flex justify-center items-center mt-6 mx-auto">
                                            <PinInput
                                                id="pin-input"
                                                v-model="pinValue"
                                                placeholder="○"
                                            >
                                                <PinInputGroup>
                                                    <PinInputInput
                                                        v-for="(id, index) in 6"
                                                        :key="id"
                                                        :index="index"
                                                        class="w-12 h-12"
                                                    />
                                                </PinInputGroup>
                                            </PinInput>
                                        </div>

                                        <DialogFooter class="mt-12 gap-4">
                                            <Button
                                                variant="secondary"
                                                class="bg-gray-200 hover:bg-gray-300"
                                                @click="twoFactorDialog = false"
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                @click="handleVerifyCode"
                                            >
                                                Valider
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Dialog v-model:open="enterPasswordDialog">
                                    <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle class="text-center">
                                                Authentification à deux facteurs
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div class="mt-8">
                                            Veuillez confirmer votre action en entrant votre mot de passe
                                        </div>

                                        <form class="mt-4 space-y-3">
                                            <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                                <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                                    Mot de passe
                                                </p>
                                                <Input
                                                    v-model="currentPassword"
                                                    type="password"
                                                    class="mb-12 sm:mb-0 w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                                />
                                            </div>

                                            <DialogFooter class="mt-12 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8">
                                                <Button
                                                    variant="secondary"
                                                    class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                                                    @click="enterPasswordDialog = false"
                                                >
                                                    Annuler
                                                </Button>
                                                <Button
                                                    class="w-full sm:w-auto"
                                                    @click="disableAuth2Fa"
                                                >
                                                    Valider
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </section>

                    <section
                        v-if="user.type != 'institution'"
                        class="mt-4 xl:mt-0 shadow rounded-lg p-6"
                    >
                        <div class="flex justify-between items-center">
                            <h3 class="flex items-center space-x-4">
                                <WrenchScrewdriverIcon class="w-6 text-gray-400" />
                                <span class="text-lg">Préférences</span>
                            </h3>

                            <Button
                                variant="outline"
                                class="font-bold text-xs text-primary -mt-1 lg:-mt-2"
                                @click="proposalDialog = true"
                            >
                                Boost IA
                            </Button>
                        </div>

                        <div class="mt-4">
                            <InputPreferences
                                :initial-zip-codes="zipCodes"
                                :initial-cities="cities"
                                @update:initial-zip-codes="updateZipCodes"
                                @update:initial-cities="updateCities"
                                @open-proposal="openProposalDialog"
                            />
                        </div>

                        <ProposalLocationModal
                            v-model="proposalDialog"
                            v-model:newly-added-value="newlyAddedValue"
                            title="Préférences"
                            description="Sélectionnez uniquement les codes postaux/villes que vous souhaitez conserver parmi ceux déjà cochés pour l'encodage de vos préférences."
                            :initial-zip-codes="zipCodes"
                            :initial-cities="cities"
                            :is-preference-mode="true"
                            @update:initial-zip-codes="updateZipCodes"
                            @update:initial-cities="updateCities"
                        />

                        <div class="mt-12 lg:mt-6 space-y-3">
                            <div
                                class="block sm:grid sm:grid-cols-[40%_60%] sm:border sm:border-primary sm:h-9 sm:rounded-full opacity-70 cursor-not-allowed"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        for="language"
                                        class="text-primary mb-4 sm:mb-0 font-semibold sm:text-white sm:flex sm:items-center sm:space-x-3"
                                    >
                                        <LanguageIcon class="w-5 hidden sm:block" />
                                        <span>Langue</span>
                                    </label>
                                </div>
                                <Select
                                    v-model="formSetting"
                                    disabled
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

                    <section
                        v-if="user.type != 'institution'"
                        class="mt-4 xl:mt-0 shadow rounded-lg p-6"
                    >
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
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                            <div class="flex justify-between items-center">
                                <Label for="acceptReplacement">Remplacement accepté</Label>
                                <Switch
                                    id="acceptReplacement"
                                    v-model:checked="notifAcceptReplacement"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                        </div>
                    </section>

                    <!-- <section class="mt-8 grid grid-cols-6 sm:grid-cols-5 gap-2 shadow rounded-lg p-6">
                        <div class="mb-2 sm:mb-0 col-span-6 sm:col-span-2 flex space-x-1 h-9 justify-center items-center bg-success text-white rounded-full">
                            <ChartPieIcon class="w-5" />
                            <label>Statut de compte</label>
                        </div>
                        <div
                            :class="isActivated ? 'text-white bg-primary' : 'text-black border border-gray-300'"
                            class="col-span-2 sm:col-span-1 flex h-9 items-center justify-center rounded-full cursor-pointer"
                            @click="enterPasswordActivateDialog = true"
                        >
                            Activé
                        </div>

                        <Dialog v-model:open="enterPasswordActivateDialog">
                            <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle class="text-center">
                                        Statut de votre compte
                                    </DialogTitle>
                                </DialogHeader>
                                <div class="mt-8">
                                    Veuillez confirmer votre action en entrant votre mot de passe
                                </div>

                                <form class="mt-4 space-y-3">
                                    <div class="mb-0 sm:mb-12 grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                        <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                            Mot de passe
                                        </p>
                                        <Input
                                            v-model="currentPassword"
                                            type="password"
                                            class="mb-12 sm:mb-0 w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                        />
                                    </div>

                                    <DialogFooter class="mt-12 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8">
                                        <Button
                                            variant="secondary"
                                            class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                                            @click="enterPasswordActivateDialog = false"
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            class="w-full sm:w-auto"
                                            @click="handleActivateStatus"
                                        >
                                            Valider
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <div
                            :class="isActivated ? 'text-black border border-gray-300 ' : 'text-white bg-primary'"
                            class="col-span-2 sm:col-span-1 flex h-9 items-center justify-center rounded-full cursor-pointer"
                            @click="enterPasswordDeactivateDialog = true"
                        >
                            Désactivé
                        </div>

                        <Dialog v-model:open="enterPasswordDeactivateDialog">
                            <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle class="text-center">
                                        Statut de votre compte
                                    </DialogTitle>
                                </DialogHeader>
                                <div class="mt-8">
                                    Veuillez confirmer votre action en entrant votre mot de passe
                                </div>

                                <form class="mt-4 space-y-3">
                                    <div class="mb-0 sm:mb-12 grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                        <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                            Mot de passe
                                        </p>
                                        <Input
                                            v-model="currentPassword"
                                            type="password"
                                            class="mb-12 sm:mb-0 w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                        />
                                    </div>

                                    <DialogFooter class="mt-12 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8">
                                        <Button
                                            variant="secondary"
                                            class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                                            @click="enterPasswordDeactivateDialog = false"
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            class="w-full sm:w-auto"
                                            @click="handleDeactivateStatus"
                                        >
                                            Valider
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <div
                            :class="user.account_type != 'manager' ? 'disabled cursor-not-allowed opacity-70' : ' cursor-pointer'"
                            class="col-span-2 sm:col-span-1 flex h-9 items-center justify-center rounded-full border border-gray-300"
                        >
                            Suspendu
                        </div>
                    </section> -->

                    <section class="flex flex-col justify-end items-center pt-8 space-y-4">
                        <Button
                            class="flex w-48 ml-auto text-end text-primary bg-transparent border border-primary shadow-none hover:text-white"
                            @click="deleteAccountDialog = true"
                        >
                            <TrashIcon class="w-5" />
                            <span>Supprimer compte</span>
                        </Button>

                        <Dialog v-model:open="deleteAccountDialog">
                            <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle class="text-center">
                                        Supprimer votre compte
                                    </DialogTitle>
                                </DialogHeader>
                                <div class="mt-8">
                                    Veuillez confirmer votre action en entrant votre mot de passe. En le confirmant, vous ne pouvez plus
                                    accéder aux informations de votre compte.
                                </div>

                                <form class="mt-4 space-y-3">
                                    <div class="mb-0 sm:mb-12 grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                        <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                            Mot de passe
                                        </p>
                                        <Input
                                            v-model="currentPassword"
                                            type="password"
                                            class="mb-12 sm:mb-0 w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                        />
                                    </div>

                                    <DialogFooter class="mt-12 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8">
                                        <Button
                                            variant="secondary"
                                            class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                                            @click="deleteAccountDialog = false"
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            class="w-full sm:w-auto"
                                            @click="handleDeleteAccount"
                                        >
                                            Valider
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
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
    TrashIcon,
    PencilSquareIcon,
    BuildingOfficeIcon,
    EnvelopeOpenIcon,
    UserGroupIcon,
} from '@heroicons/vue/24/solid';
import { useRouter } from 'vue-router';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { getErrorMessage, goBack } from '~/lib/utils';
import { AUTH_TOKEN } from '~/lib/constants';
import { useCookie, useRuntimeConfig } from '#app';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import InputPreferences from '@/components/InputPreferences.vue';
import { useAuth } from '~/composables/useAuth';
import { useSubmit } from '~/composables/useSubmit';
import FileUpload from '~/components/ui/form/FileUpload.vue';
import type { User, UserSettings } from '~/lib/types';

const { $toast } = useNuxtApp();
const router = useRouter();

const {
    updateUser,
    updateAddressUser,
    updatePasswordUser,
    updateAvatarUser,
    activeTwoFactorAuth,
    verifyCode,
    // updateStatusAccount,
    deleteAccount,
    deleteAvatar,
} = useAuth();
const { createPreferences, createNotifPreferences } = useAuth();

const user = useState<User>('user');
const setting = JSON.parse(user.value.settings);
const proposalDialog = ref(false);
const newlyAddedValue = ref<string>('');

const openProposalDialog = (value: string) => {
    newlyAddedValue.value = value;
    proposalDialog.value = true;
};

const { identifierLabel } = useCountry();

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
    switch (user.value.gender) {
        case 'F':
            return 'Femme';
        case 'M':
            return 'Homme';
        case 'X':
            return 'X';
        default:
            return '';
    }
});

const formattedCategory = computed(() => {
    switch (user.value.professional_category) {
        case 'salaried':
            return 'Salarié(e)';
        case 'independent':
            return 'Indépendant(e)';
        default:
            return '';
    }
});

const formattedCountry = computed(() => {
    if (user.value.profile && user.value.profile.country && user.value.profile?.country == 'be') {
        return 'Belgique';
    }

    return 'France';
});

const formatStringDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const formatDate = (dateString) => {
    if (!dateString || dateString === '01/01/1970') {
        return null;
    }

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
};

const formPersonalInfo = reactive({
    id: user.value.id,
    institution: {
        name: user.value.institution.name,
    },
    lastname: user.value.lastname,
    firstname: user.value.firstname,
    dateOfBirth: formatDate(user.value.date_of_birth),
    email: user.value.email,
    identifierNumber: user.value.identifier_number,
    phoneNumber: user.value.phone_number,
    gender: user.value.gender,
    professionalCategory: user.value.professional_category,
});

const formAddress = reactive({
    streetAddress: user.value.profile?.street_address,
    city: user.value.profile?.city,
    country: user.value.profile?.country ?? 'Belgique',
    zipCode: user.value.profile?.zip_code,
    additionalInfo: user.value.profile?.additional_info,
    workingAt: user.value.profile?.working_at,
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
        user.value.professional_category = formPersonalInfo.professionalCategory;

        $toast({
            description: 'Mise à jour effectué avec succès',
        });

        personalInfoDialog.value = false;
    }
    catch (err) {
        if (err.data && err.data.errors) {
            const backendErrors = err.data.errors;
            const firstField = Object.keys(backendErrors)[0];
            const firstMessage = backendErrors[firstField][0];

            $toast({
                description: firstMessage,
                status: 'error',
                variant: 'destructive',
            });
        }
    }
};

const handleUpdateAddress = async () => {
    try {
        await updateAddressUser(formAddress).then(() => {
            addressInfoDialog.value = false;
            user.value.profile.street_address = formAddress.streetAddress;
            user.value.profile.city = formAddress.city;
            user.value.profile.country = formAddress.country;
            user.value.profile.zip_code = formAddress.zipCode;
            user.value.profile.additional_info = formAddress.additionalInfo;
            user.value.profile.working_at = formAddress.workingAt;

            $toast({
                description: 'Mise à jour effectué avec succès',
            });
        });
    }
    catch (err) {
        if (err.data && err.data.errors) {
            const backendErrors = err.data.errors;
            const firstField = Object.keys(backendErrors)[0];
            const firstMessage = backendErrors[firstField][0];

            $toast({
                description: firstMessage,
                status: 'error',
                variant: 'destructive',
            });
        }
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

        changePasswordDialog.value = false;

        formPassword.currentPassword = '';
        formPassword.password = '';
        formPassword.password_confirmation = '';
    }
    catch (err) {
        if (err.data && err.data.errors) {
            const backendErrors = err.data.errors;
            const firstField = Object.keys(backendErrors)[0];
            const firstMessage = backendErrors[firstField][0];

            $toast({
                description: firstMessage,
                status: 'error',
                variant: 'destructive',
            });
        }
    }
};

const notifNewReplacement = ref(setting.notification?.new_replacement);
const notifAcceptReplacement = ref(setting.notification?.replacement_accepted);

const handleChangeNotif = async () => {
    try {
        const formData = reactive({
            key: 'notification',
            value: {
                new_replacement: notifNewReplacement.value,
                replacement_accepted: notifAcceptReplacement.value,
            },
        });

        await createNotifPreferences(formData);
    }
    catch (error) {
        console.log(error);
    }
};

const { submit } = useSubmit(
    async () => {
        if (!profileFile.value) {
            $toast({
                description: 'Veuillez sélectionner une image',
                variant: 'destructive',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('profil_url', profileFile.value);

            const response = await updateAvatarUser(formData);

            user.value.profile.profil_url = response.user.profile.profil_url;

            $toast({
                description: 'Photo mise à jour',
            });
            profileDialog.value = false;
        }
        catch (error) {
            console.log(error);
            $toast({
                variant: 'destructive',
                description: getErrorMessage(error),
            });
        }
    },
);

const handleDeleteAvatar = async () => {
    try {
        await deleteAvatar(user.value.id);

        user.value.profile.profil_url = null;

        $toast({
            description: 'Photo supprimée',
        });
        deleteAvatarDialog.value = false;
    }
    catch (error) {
        console.log(error);
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
    }
};

const verifyTwoFactorStatus = () => {
    return user.value.two_factor_enabled;
};

const enableTwoFactor = ref(verifyTwoFactorStatus());
const twoFactorDialog = ref(false);
const enterPasswordDialog = ref(false);
// const enterPasswordActivateDialog = ref(false);
// const enterPasswordDeactivateDialog = ref(false);
const deleteAccountDialog = ref(false);
const currentPassword = ref('');

const handleEnableAuth2Fa = async () => {
    if (enableTwoFactor.value) {
        const formData = reactive({
            twoFactorEnabled: true,
            twoFactorType: 'mail',
        });

        await activeTwoFactorAuth(formData);

        enableTwoFactor.value = false;
        twoFactorDialog.value = true;
    }
    else {
        enableTwoFactor.value = true;
        enterPasswordDialog.value = true;
    }
};

const disableAuth2Fa = async () => {
    try {
        const formData = reactive({
            twoFactorEnabled: false,
            currentPassword: currentPassword.value,
        });

        await activeTwoFactorAuth(formData);

        enableTwoFactor.value = false;
        enterPasswordDialog.value = false;

        $toast({
            description: 'Authentification à deux facteurs désactivé',
        });

        currentPassword.value = '';
    }
    catch (error) {
        console.log(error);
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
    }
};

const pinValue = ref<string[]>([]);

const zipCodes = ref<string[]>([]);
const cities = ref<string[]>([]);

const updateFromSettings = () => {
    const settings: UserSettings = JSON.parse(user.value.settings || '{}');
    zipCodes.value = settings.replacement?.zip_codes?.filter(zip => zip) ?? [];
    cities.value = settings.replacement?.cities?.filter(city => city) ?? [];
};

updateFromSettings();

watch(
    () => user.value.settings,
    () => {
        updateFromSettings();
    },
    { deep: true },
);

const updateZipCodes = async (newZipCodes: string[]) => {
    zipCodes.value = newZipCodes.filter(zip => zip);
    await nextTick();
};

const updateCities = async (newCities: string[]) => {
    cities.value = newCities.filter(city => city);
    await nextTick();
};

const handleVerifyCode = async () => {
    const formData = reactive({
        code: pinValue.value.join(''),
    });
    try {
        await verifyCode(formData);

        $toast({
            description: 'Authentification à deux facteurs activé',
        });

        pinValue.value = [];

        twoFactorDialog.value = false;
        enableTwoFactor.value = true;
    }
    catch (error) {
        console.log(error);
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
    }
};

// const verifyStatusAccount = () => {
//     return user.value.status == 'active' ? true : false;
// };

// const isActivated = ref(verifyStatusAccount());

// const handleActivateStatus = async () => {
//     const formData = reactive({
//         currentPassword: currentPassword.value,
//         status: 'active',
//     });

//     try {
//         await updateStatusAccount(formData);

//         $toast({
//             description: 'Statut du compte mis à jour',
//         });

//         enterPasswordActivateDialog.value = false;
//         isActivated.value = true;
//     }
//     catch (error) {
//         console.log(error);
//         $toast({
//             variant: 'destructive',
//             description: 'Echec de la mise à jour',
//         });
//     }
// };

// const handleDeactivateStatus = async () => {
//     const formData = reactive({
//         currentPassword: currentPassword.value,
//         status: 'inactive',
//     });

//     try {
//         await updateStatusAccount(formData);

//         $toast({
//             description: 'Statut du compte mis à jour',
//         });

//         enterPasswordDeactivateDialog.value = false;
//         isActivated.value = false;
//     }
//     catch (error) {
//         console.log(error);
//         $toast({
//             variant: 'destructive',
//             description: 'Echec de la mise à jour',
//         });
//     }
// };

const handleDeleteAccount = async () => {
    const formData = reactive({
        user: user.value.id,
        password: currentPassword.value,
    });

    try {
        await deleteAccount(formData);
        user.value = null;
        useCookie(AUTH_TOKEN).value = '';

        deleteAccountDialog.value = false;
        router.push('/');
    }
    catch (error) {
        console.log(error);
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
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

const professionalCategory = {
    salaried: 'Salarié(e)',
    independent: 'Indépendant(e)',
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
