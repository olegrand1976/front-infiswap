<template>
    <div>
        <div class="hidden sm:flex flex-row h-screen overflow-hidden">
            <BackButton
                to="/login"
            />
            <div class="w-1/2 bg-tertiary/30 pt-8 sm:pt-10 lg:pt-12 xl:pt-14 pb-0 overflow-hidden flex flex-col">
                <h1 class="mb-4 sm:mb-6 lg:mb-8 text-lg max-w-xl mx-auto mt-4 sm:mt-6 lg:mt-8 xl:mt-10 text-center">
                    <span>Bienvenue sur <span class="font-bold text-primary">InfiSwap</span>, la plateforme pour vos remplacements!</span>
                    <span> Pour vous inscrire, veuillez remplir le formulaire ci-dessous.</span>
                </h1>
                <div class="flex-1" />
                <div class="rounded-2xl max-w-md mx-auto">
                    <LayoutsAppImage
                        src="/auth/Group_1171.png"
                        class="relative z-20 flex justify-center mx-auto"
                    />
                </div>
                <div class="absolute lg:top-1/3 lg:left-20 md:top-32 sm:top-64 sm:left-12 ">
                    <LayoutsAppImage
                        src="/icons/plus.png"
                        class="xl:w-24 xl:h-24 lg:w-20 lg:h-20 md:w-16 md:h-16 sm:w-11 sm:h-11"
                    />
                </div>
                <div class="absolute bottom-0 left-0 w-full h-20 bg-primary" />
            </div>

            <div class="w-1/2 bg-white overflow-y-auto overflow-x-hidden flex flex-col items-center relative py-8 sm:py-10 lg:py-12 xl:py-14">
                <div class="hidden lg:block mb-2 lg:mb-4 xl:mb-6">
                    <LayoutsAppImage
                        src="logo.png"
                        class="h-14 lg:h-20"
                    />
                </div>

                <p class="text-center text-3xl 2xl:text-4xl text-primary font-bold -mt-2 sm:-mt-1 lg:mt-0 xl:-mt-4">
                    Inscription
                </p>

                <div class="w-full max-w-5xl px-8 font-light mt-4 sm:mt-6 lg:mt-8 xl:mt-10">
                    <form
                        class="grid gap-4 sm:gap-5 lg:gap-6 xl:gap-8"
                        @submit.prevent="submit"
                    >
                        <div>
                            <h2 class="mt-1 sm:mt-2 lg:mt-3 text-lg text-center max-w-xl mx-auto text-gray-500 mb-3 sm:mb-4">
                                Quel type de compte souhaitez-vous choisir ?
                            </h2>
                            <div class="px-8 mb-3 sm:mb-4 lg:mb-5 xl:mb-6">
                                <div class="grid grid-cols-2 gap-6">
                                    <div
                                        v-for="account in accountOptions"
                                        :key="account.value"
                                        class="relative cursor-pointer transition-all duration-300"
                                        :class="formData.accountType === account.value
                                            ? 'transform scale-105'
                                            : 'hover:scale-102'"
                                        @click="formData.accountType = account.value"
                                    >
                                        <div
                                            class="border-2 rounded-xl p-6 h-full flex flex-col items-center justify-center transition-all duration-300"
                                            :class="formData.accountType === account.value
                                                ? 'border-primary bg-primary/5 shadow-lg'
                                                : 'border-gray-300 hover:border-gray-400'"
                                        >
                                            <div class="relative w-full">
                                                <component
                                                    :is="account.value === 'standard' ? UserCircleIcon : BuildingOffice2Icon"
                                                    class="w-12 h-12 mx-auto mb-3"
                                                    :class="formData.accountType === account.value
                                                        ? 'text-primary'
                                                        : 'text-gray-400'"
                                                />
                                                <div
                                                    v-if="formData.accountType === account.value"
                                                    class="absolute -top-2 -right-2 bg-primary rounded-full p-1 transition-all duration-300"
                                                >
                                                    <CheckIcon class="size-3 text-white" />
                                                </div>
                                            </div>
                                            <span
                                                class="text-base font-medium"
                                                :class="formData.accountType === account.value
                                                    ? 'text-primary'
                                                    : 'text-gray-700'"
                                            >
                                                {{ account.label }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-if="formData.accountType == 'institution'"
                                    class="mt-3 sm:mt-4 lg:mt-5 relative w-full items-center"
                                >
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        Nom de l'institution <span class="text-red-500">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.institutionName"
                                        :icon="BuildingOffice2Icon"
                                        size="md"
                                        placeholder="Nom de l'institution *"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="text-md font-medium text-gray-500 mb-1 sm:mb-2 lg:mb-3 block">
                                Informations personnelles
                            </label>
                            <div class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div class="col-span-2 relative w-full items-center">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Nom <span class="text-red-500">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.lastname"
                                            :icon="UserCircleIcon"
                                            size="md"
                                            placeholder="Nom *"
                                        />
                                    </div>

                                    <div class="col-span-2 relative w-full items-center">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Prénom <span class="text-red-500">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.firstname"
                                            :icon="UserCircleIcon"
                                            size="md"
                                            placeholder="Prénoms *"
                                        />
                                    </div>

                                    <div class="col-span-2 relative w-full items-center">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Email <span class="text-red-500">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.email"
                                            :icon="EnvelopeIcon"
                                            size="md"
                                            placeholder="Email *"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            N° de téléphone
                                        </label>
                                        <InputIcon
                                            v-model="formData.phoneNumber"
                                            :icon="PhoneIcon"
                                            size="md"
                                            placeholder="N° de téléphone"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Sexe
                                        </label>
                                        <Select v-model="formData.gender">
                                            <SelectTrigger
                                                class="flex xl:h-auto sm:h-8 items-center rounded-full border-2 border-gray-300"
                                                position="right"
                                            >
                                                <LayoutsAppImage
                                                    src="/icons/gender.png"
                                                    class="h-5"
                                                />
                                                <SelectValue
                                                    placeholder="Sexe"
                                                    class="ml-3"
                                                />
                                            </SelectTrigger>
                                            <SelectContent class="border border-none">
                                                <SelectGroup>
                                                    <div
                                                        v-for="gender in genders"
                                                        :key="gender.value"
                                                        class="flex justify-center items-center -ms-3"
                                                    >
                                                        <SelectItem :value="gender.value">
                                                            <span class="text-sm">{{ gender.label }}</span>
                                                        </SelectItem>
                                                    </div>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="text-md font-medium text-gray-500 mb-1 sm:mb-2 lg:mb-3 block">
                                Informations de connexion
                            </label>
                            <div class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Mot de passe <span class="text-red-500">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.password"
                                            :icon="LockClosedIcon"
                                            size="md"
                                            type="password"
                                            placeholder="Mot de passe *"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Confirmation mot de passe <span class="text-red-500">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.passwordConfirmation"
                                            :icon="LockClosedIcon"
                                            size="md"
                                            type="password"
                                            placeholder="Confirmation mot de passe *"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="text-md font-medium text-gray-500 mb-1 sm:mb-2 lg:mb-3 block">
                                Adresses
                            </label>
                            <div class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Rue <span class="text-red-500">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.address.street"
                                            :icon="MapPinIcon"
                                            size="md"
                                            placeholder="Rue *"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Code postal <span class="text-red-500">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.address.zipCode"
                                            :icon="InboxArrowDownIcon"
                                            size="md"
                                            placeholder="Code postal *"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Ville <span class="text-red-500">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.address.city"
                                            :icon="BuildingOffice2Icon"
                                            size="md"
                                            placeholder="Ville *"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Pays <span class="text-red-500">*</span>
                                        </label>
                                        <Select v-model="formData.address.country">
                                            <SelectTrigger
                                                class="flex justify-between items-center rounded-full border-2 border-gray-300"
                                                position="right"
                                            >
                                                <LayoutsAppImage
                                                    src="/icons/flag.png"
                                                    class="h-4 ml-2"
                                                />
                                                <SelectValue
                                                    placeholder="Pays"
                                                    class="ml-3 block w-full"
                                                />
                                            </SelectTrigger>
                                            <SelectContent class="border border-none w-full">
                                                <SelectGroup>
                                                    <div
                                                        v-for="c in countries"
                                                        :key="c.value"
                                                        class="flex justify-center items-center -ms-3 w-full"
                                                    >
                                                        <SelectItem :value="c.value">
                                                            <div class="flex w-full">
                                                                <LayoutsAppImage
                                                                    :src="c.icon"
                                                                    :alt="c.name"
                                                                    class="xl:w-4 xl:h-3 sm:w-3 sm:h-2 my-auto mr-2"
                                                                    format="png"
                                                                />
                                                                <div class="sm:text-xs xl:text-sm">
                                                                    {{ c.label }}
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    </div>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Complément d'adresse
                                        </label>
                                        <InputIcon
                                            v-model="formData.address.additionnalInformation"
                                            :icon="EllipsisHorizontalCircleIcon"
                                            size="md"
                                            placeholder="Complément d'adresse"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="text-md font-medium text-gray-500 mb-1 sm:mb-2 lg:mb-3 block">
                                Informations professionnelles
                            </label>
                            <div class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div
                                        v-if="formData.accountType != 'institution'"
                                        class="col-span-2"
                                    >
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Compte
                                        </label>
                                        <Select v-model="formData.role">
                                            <SelectTrigger
                                                class="flex w-full space-x-4 text-sm justify-start items-center rounded-3xl border-2 border-gray-300 disabled:opacity-100 disabled:cursor-default"
                                                position="right"
                                            >
                                                <UsersIcon class="text-primary w-9 h-9 sm:w-7 sm:h-7" />
                                                <SelectValue
                                                    placeholder="Compte"
                                                    class="text-nowrap w-full text-sm ml-3 my-auto"
                                                />
                                            </SelectTrigger>
                                            <SelectContent class="border border-none">
                                                <SelectGroup>
                                                    <div
                                                        v-for="accountOption in roleOptions"
                                                        :key="accountOption.value"
                                                        class="flex justify-center items-center -ms-3"
                                                    >
                                                        <SelectItem :value="accountOption.value">
                                                            <span class="xl:text-sm sm:text-xs">{{ accountOption.label }}</span>
                                                        </SelectItem>
                                                    </div>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div
                                        v-if="formData.accountType != 'institution'"
                                        class="col-span-2"
                                    >
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Langue
                                        </label>
                                        <Select
                                            v-model="formData.language"
                                            disabled
                                        >
                                            <SelectTrigger
                                                class="flex w-full space-x-4 xl:text-sm sm:text-xs xl:h-auto sm:h-8 justify-start items-center rounded-3xl border-2 border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90"
                                                position="right"
                                            >
                                                <LanguageIcon class="text-primary w-6 h-6" />
                                                <SelectValue
                                                    placeholder="Langue"
                                                    class="text-sm ml-3 my-auto"
                                                />
                                            </SelectTrigger>
                                            <SelectContent class="border border-none">
                                                <SelectGroup>
                                                    <div
                                                        v-for="language in LANGUAGES"
                                                        :key="language.value"
                                                        class="flex justify-center items-center -ms-3"
                                                    >
                                                        <SelectItem :value="language.value">
                                                            <span class="xl:text-sm sm:text-xs">{{ language.label }}</span>
                                                        </SelectItem>
                                                    </div>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Votre pays de travail
                                        </label>
                                        <Select v-model="formData.address.workingAt">
                                            <SelectTrigger
                                                class="flex justify-between items-center rounded-full border-2 border-gray-300"
                                                position="right"
                                            >
                                                <LayoutsAppImage
                                                    src="/icons/plus.png"
                                                    class="h-4 ml-2"
                                                />
                                                <SelectValue
                                                    placeholder="Pays"
                                                    class="ml-3 block w-full"
                                                />
                                            </SelectTrigger>
                                            <SelectContent class="border border-none w-full">
                                                <SelectGroup>
                                                    <div
                                                        v-for="workingAt in countryOfWork"
                                                        :key="workingAt.value"
                                                        class="flex justify-center items-center -ms-3 w-full"
                                                    >
                                                        <SelectItem :value="workingAt.value">
                                                            <div class="flex w-full">
                                                                <LayoutsAppImage
                                                                    :src="workingAt.icon"
                                                                    :alt="workingAt.name"
                                                                    class="xl:w-4 xl:h-3 sm:w-3 sm:h-2 my-auto mr-2"
                                                                    format="png"
                                                                />
                                                                <div class="sm:text-xs xl:text-sm">
                                                                    {{ workingAt.label }}
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    </div>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ identifierLabel }} <span class="text-red-500">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.identifierNumber"
                                            :icon="IdentificationIcon"
                                            size="md"
                                            :placeholder="identifierLabel"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="formData.accountType != 'institution'"
                            class="mt-3 sm:mt-4 lg:mt-5 xl:mt-6"
                        >
                            <label class="text-md font-medium text-gray-500 mb-1 sm:mb-2 lg:mb-3 block">
                                Catégorie professionnel
                            </label>
                            <div class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                                <Select v-model="formData.professionalCategory">
                                    <SelectTrigger
                                        class="flex justify-between items-center rounded-full border-2 border-gray-300"
                                        position="right"
                                    >
                                        <UserGroupIcon class="text-primary w-10 h-10" />
                                        <SelectValue
                                            placeholder="Catégorie"
                                            class="ml-3 block w-full"
                                        />
                                    </SelectTrigger>
                                    <SelectContent class="border border-none w-full">
                                        <SelectGroup>
                                            <div
                                                v-for="category in professionalCategory"
                                                :key="category.value"
                                                class="flex justify-center items-center -ms-3 w-full"
                                            >
                                                <SelectItem :value="category.value">
                                                    <div class="flex w-full">
                                                        <div class="sm:text-xs xl:text-sm">
                                                            {{ category.label }}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            </div>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div
                            v-if="formData.accountType != 'institution'"
                            class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm"
                        >
                            <div class="space-y-4">
                                <label class="flex items-start cursor-pointer">
                                    <Checkbox
                                        :checked="representGroup"
                                        class="mt-1 accent-red-600"
                                        @update:checked="representGroup = $event"
                                    />
                                    <span class="text-sm ml-2 font-medium">
                                        Je représente un groupement de plusieurs infirmières et je souhaite gérer les plannings et remplacements de mes infirmières
                                    </span>
                                </label>

                                <transition name="fade">
                                    <div
                                        v-if="representGroup"
                                        class="relative"
                                    >
                                        <InputIcon
                                            v-model="formData.groupName"
                                            :icon="UserGroupIcon"
                                            placeholder="Nom du groupement"
                                        />
                                    </div>
                                </transition>
                            </div>
                        </div>

                        <div class="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
                            <label class="flex items-start cursor-pointer">
                                <Checkbox
                                    :checked="charteAccepted"
                                    class="mt-1"
                                    @update:checked="charteAccepted = $event"
                                />
                                <span class="text-sm ml-2 font-medium">
                                    J'accepte la
                                    <NuxtLink
                                        to="/legal-chart"
                                        target="_blank"
                                        class="text-primary underline font-semibold hover:text-primary/80"
                                    >
                                        charte de bonne conduite
                                    </NuxtLink>
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                        </div>

                        <div class="flex justify-center items-center">
                            <Button
                                class="w-[70%] text-base font-bold"
                                type="submit"
                                :in-progress="inProgress"
                                :disabled="!charteAccepted"
                            >
                                S'inscrire
                            </Button>
                        </div>
                    </form>

                    <div class="text-sm text-center mt-10">
                        <span>Vous avez déjà un compte ?</span>
                        <NuxtLink
                            to="/login"
                            class="font-bold text-primary underline ml-1"
                        >
                            Connexion
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile View -->
        <div class="sm:hidden min-h-screen w-screen flex flex-col relative overflow-x-hidden bg-white">
            <LayoutsHeaderMobile />
            <BackButton to="/login" />

            <div class="flex-grow flex flex-col items-center px-6 py-10 overflow-y-auto">
                <h1 class="mt-8 mb-8 text-sm text-center">
                    <span>Bienvenue sur <span class="font-bold text-primary">InfiSwap</span>, la plateforme pour vos remplacements!</span>
                    <span> Pour vous inscrire, veuillez remplir le formulaire ci-dessous.</span>
                </h1>

                <form
                    class="grid gap-4"
                    @submit.prevent="submit"
                >
                    <div class="space-y-6">
                        <div>
                            <label class="text-sm font-medium text-gray-700">
                                Type de compte
                            </label>
                            <Select v-model="formData.accountType">
                                <SelectTrigger
                                    class="w-full flex justify-between items-center rounded-full border-2 border-gray-300 mt-1"
                                    position="right"
                                >
                                    <IdentificationIcon class="text-primary w-10 h-10" />
                                    <SelectValue
                                        placeholder="Type de compte"
                                        class="ml-3 block w-full"
                                    />
                                </SelectTrigger>
                                <SelectContent class="border border-none w-full">
                                    <SelectGroup>
                                        <div
                                            v-for="account in accountOptions"
                                            :key="account.value"
                                            class="flex justify-center items-center -ms-3 w-full"
                                        >
                                            <SelectItem :value="account.value">
                                                <div class="flex w-full">
                                                    <div class="sm:text-xs xl:text-sm">
                                                        {{ account.label }}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div
                            v-if="formData.accountType == 'institution'"
                            class="col-span-2 relative w-full items-center"
                        >
                            <label class="text-sm font-medium text-gray-700">
                                Nom de l'institution
                            </label>
                            <InputIcon
                                v-model="formData.institutionName"
                                :icon="BuildingOffice2Icon"
                                size="md"
                                placeholder="Nom de l'institution *"
                            />
                        </div>
                    </div>

                    <div class="mt-6 mb-8 border-b border-gray-200" />

                    <div class="grid grid-cols-4 gap-4">
                        <div class="col-span-4 relative w-full items-center">
                            <InputIcon
                                v-model="formData.lastname"
                                :icon="UserCircleIcon"
                                size="md"
                                placeholder="Nom *"
                            />
                        </div>

                        <div class="col-span-4 relative w-full items-center">
                            <InputIcon
                                v-model="formData.firstname"
                                :icon="UserCircleIcon"
                                size="md"
                                placeholder="Prénoms *"
                            />
                        </div>

                        <div class="col-span-4 relative w-full items-center">
                            <InputIcon
                                v-model="formData.email"
                                :icon="EnvelopeIcon"
                                size="md"
                                placeholder="Email *"
                            />
                        </div>

                        <div class="col-span-4">
                            <InputIcon
                                v-model="formData.phoneNumber"
                                :icon="PhoneIcon"
                                size="md"
                                placeholder="N° de téléphone"
                            />
                        </div>

                        <div class="col-span-4">
                            <InputIcon
                                v-model="formData.password"
                                :icon="LockClosedIcon"
                                size="md"
                                type="password"
                                placeholder="Mot de passe *"
                            />
                        </div>

                        <div class="col-span-4">
                            <InputIcon
                                v-model="formData.passwordConfirmation"
                                :icon="LockClosedIcon"
                                size="md"
                                type="password"
                                placeholder="Mot de passe *"
                            />
                        </div>

                        <div class="col-span-4">
                            <Select v-model="formData.gender">
                                <SelectTrigger
                                    class="flex xl:h-auto sm:h-8 items-center rounded-full border-2 border-gray-300"
                                    position="right"
                                >
                                    <LayoutsAppImage
                                        src="/icons/gender.png"
                                        class="h-5"
                                    />
                                    <SelectValue
                                        placeholder="Sexe"
                                        class="ml-3"
                                    />
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup>
                                        <div
                                            v-for="gender in genders"
                                            :key="gender.value"
                                            class="flex justify-center items-center -ms-3"
                                        >
                                            <SelectItem :value="gender.value">
                                                <span class="text-sm">{{ gender.label }}</span>
                                            </SelectItem>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="col-span-4">
                            <InputIcon
                                v-model="formData.address.street"
                                :icon="MapPinIcon"
                                size="md"
                                placeholder="Rue *"
                            />
                        </div>

                        <div class="col-span-4">
                            <InputIcon
                                v-model="formData.address.zipCode"
                                :icon="InboxArrowDownIcon"
                                size="md"
                                placeholder="Code postal *"
                            />
                        </div>

                        <div class="col-span-4">
                            <InputIcon
                                v-model="formData.address.city"
                                :icon="BuildingOffice2Icon"
                                size="md"
                                placeholder="Ville *"
                            />
                        </div>

                        <div class="col-span-4">
                            <Select v-model="formData.address.country">
                                <SelectTrigger
                                    class="flex justify-between items-center rounded-full border-2 border-gray-300"
                                    position="right"
                                >
                                    <LayoutsAppImage
                                        src="/icons/flag.png"
                                        class="h-4 ml-2"
                                    />
                                    <SelectValue
                                        placeholder="Pays"
                                        class="ml-3 block w-full"
                                    />
                                </SelectTrigger>
                                <SelectContent class="border border-none w-full">
                                    <SelectGroup>
                                        <div
                                            v-for="c in countries"
                                            :key="c.value"
                                            class="flex justify-center items-center -ms-3 w-full"
                                        >
                                            <SelectItem :value="c.value">
                                                <div class="flex w-full">
                                                    <LayoutsAppImage
                                                        :src="c.icon"
                                                        :alt="c.name"
                                                        class="xl:w-4 xl:h-3 sm:w-3 sm:h-2 my-auto mr-2"
                                                        format="png"
                                                    />
                                                    <div class="sm:text-xs xl:text-sm">
                                                        {{ c.label }}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="col-span-4">
                            <InputIcon
                                v-model="formData.address.additionnalInformation"
                                :icon="EllipsisHorizontalCircleIcon"
                                size="md"
                                placeholder="Complément d'adresse"
                            />
                        </div>

                        <div
                            v-if="formData.accountType != 'institution'"
                            class="col-span-4"
                        >
                            <Select v-model="formData.role">
                                <SelectTrigger
                                    class="flex w-full space-x-4 text-sm justify-start items-center rounded-3xl border-2 border-gray-300 disabled:opacity-100 disabled:cursor-default"
                                    position="right"
                                >
                                    <UsersIcon class="text-primary w-9 h-9 sm:w-7 sm:h-7" />
                                    <SelectValue
                                        placeholder="Compte"
                                        class="text-nowrap w-full text-sm ml-3 my-auto"
                                    />
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup>
                                        <div
                                            v-for="accountOption in roleOptions"
                                            :key="accountOption.value"
                                            class="flex justify-center items-center -ms-3"
                                        >
                                            <SelectItem :value="accountOption.value">
                                                <span class="xl:text-sm sm:text-xs">{{ accountOption.label }}</span>
                                            </SelectItem>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            v-if="formData.accountType != 'institution'"
                            class="col-span-4"
                        >
                            <Select
                                v-model="formData.language"
                                disabled
                            >
                                <SelectTrigger
                                    class="flex w-full space-x-4 xl:text-sm sm:text-xs xl:h-auto sm:h-8 justify-start items-center rounded-3xl border-2 border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90"
                                    position="right"
                                >
                                    <LanguageIcon class="text-primary w-6 h-6" />
                                    <SelectValue
                                        placeholder="Langue"
                                        class="text-sm ml-3 my-auto"
                                    />
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup>
                                        <div
                                            v-for="language in LANGUAGES"
                                            :key="language.value"
                                            class="flex justify-center items-center -ms-3"
                                        >
                                            <SelectItem :value="language.value">
                                                <span class="xl:text-sm sm:text-xs">{{ language.label }}</span>
                                            </SelectItem>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            v-if="formData.accountType == 'institution'"
                            class="col-span-4"
                        >
                            <Select
                                v-model="formData.language"
                                disabled
                            >
                                <SelectTrigger
                                    class="flex w-full space-x-4 xl:text-sm sm:text-xs xl:h-auto sm:h-8 justify-start items-center rounded-3xl border-2 border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90"
                                    position="right"
                                >
                                    <LanguageIcon class="text-primary w-6 h-6" />
                                    <SelectValue
                                        placeholder="Langue"
                                        class="text-sm ml-3 my-auto"
                                    />
                                </SelectTrigger>
                                <SelectContent class="border border-none">
                                    <SelectGroup>
                                        <div
                                            v-for="language in LANGUAGES"
                                            :key="language.value"
                                            class="flex justify-center items-center -ms-3"
                                        >
                                            <SelectItem :value="language.value">
                                                <span class="xl:text-sm sm:text-xs">{{ language.label }}</span>
                                            </SelectItem>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="col-span-4">
                            <label class="text-sm font-medium text-gray-700">
                                Votre {{ identifierLabel }}
                            </label>
                            <InputIcon
                                v-model="formData.identifierNumber"
                                :icon="IdentificationIcon"
                                size="md"
                                class="mt-1"
                                :placeholder="identifierLabel"
                            />
                        </div>

                        <div class="col-span-4">
                            <label class="text-sm font-medium text-gray-700">
                                Votre pays de travail
                            </label>
                            <Select v-model="formData.address.workingAt">
                                <SelectTrigger
                                    class="flex justify-between items-center rounded-full border-2 border-gray-300 mt-1"
                                    position="right"
                                >
                                    <LayoutsAppImage
                                        src="/icons/plus.png"
                                        class="h-4 ml-2"
                                    />
                                    <SelectValue
                                        placeholder="Pays"
                                        class="ml-3 block w-full"
                                    />
                                </SelectTrigger>
                                <SelectContent class="border border-none w-full">
                                    <SelectGroup>
                                        <div
                                            v-for="workingAt in countryOfWork"
                                            :key="workingAt.value"
                                            class="flex justify-center items-center -ms-3 w-full"
                                        >
                                            <SelectItem :value="workingAt.value">
                                                <div class="flex w-full">
                                                    <LayoutsAppImage
                                                        :src="workingAt.icon"
                                                        :alt="workingAt.name"
                                                        class="xl:w-4 xl:h-3 sm:w-3 sm:h-2 my-auto mr-2"
                                                        format="png"
                                                    />
                                                    <div class="sm:text-xs xl:text-sm">
                                                        {{ workingAt.label }}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            v-if="formData.accountType != 'institution'"
                            class="col-span-4"
                        >
                            <label class="text-sm font-medium text-gray-700">
                                Catégorie professionnel <span class="text-red-500">*</span>
                            </label>
                            <Select v-model="formData.professionalCategory">
                                <SelectTrigger
                                    class="flex justify-between items-center rounded-full border-2 border-gray-300 mt-1"
                                    position="right"
                                >
                                    <UserGroupIcon class="text-primary w-10 h-10" />
                                    <SelectValue
                                        placeholder="Catégorie *"
                                        class="ml-3 block w-full"
                                    />
                                </SelectTrigger>
                                <SelectContent class="border border-none w-full">
                                    <SelectGroup>
                                        <div
                                            v-for="category in professionalCategory"
                                            :key="category.value"
                                            class="flex justify-center items-center -ms-3 w-full"
                                        >
                                            <SelectItem :value="category.value">
                                                <div class="flex w-full">
                                                    <div class="sm:text-xs xl:text-sm">
                                                        {{ category.label }}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </div>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            v-if="formData.accountType != 'institution'"
                            class="mt-4 col-span-4"
                        >
                            <div class="space-y-4">
                                <label class="flex items-start cursor-pointer">
                                    <Checkbox
                                        :checked="representGroup"
                                        class="mt-1 accent-red-600"
                                        @update:checked="representGroup = $event"
                                    />
                                    <span class="text-sm ml-2">
                                        Je représente un groupement de plusieurs infirmières et je souhaite gérer les plannings et remplacements de mes infirmières
                                    </span>
                                </label>

                                <transition name="fade">
                                    <div
                                        v-if="representGroup"
                                        class="relative"
                                    >
                                        <InputIcon
                                            v-model="formData.groupName"
                                            :icon="UserGroupIcon"
                                            placeholder="Nom du groupement"
                                        />
                                    </div>
                                </transition>
                            </div>
                        </div>

                        <div class="mt-4 col-span-4">
                            <label class="flex items-start cursor-pointer">
                                <Checkbox
                                    :checked="charteAccepted"
                                    class="mt-1"
                                    @update:checked="charteAccepted = $event"
                                />
                                <span class="text-sm ml-2 font-medium">
                                    J'accepte la
                                    <NuxtLink
                                        to="/legal-chart"
                                        target="_blank"
                                        class="text-primary underline font-semibold hover:text-primary/80"
                                    >
                                        charte de bonne conduite
                                    </NuxtLink>
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                        </div>

                        <div class="col-span-4 mt-4 flex justify-center items-center">
                            <Button
                                class="w-[50%]"
                                type="submit"
                                :in-progress="inProgress"
                                :disabled="!charteAccepted"
                            >
                                S'inscrire
                            </Button>
                        </div>
                    </div>
                </form>

                <div class="text-sm text-center mt-10">
                    <span>Vous avez déjà un compte ?</span>
                    <NuxtLink
                        to="/login"
                        class="font-bold text-primary underline ml-1"
                    >
                        Connexion
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    LockClosedIcon,
    EllipsisHorizontalCircleIcon,
    LanguageIcon,
    IdentificationIcon,
    UsersIcon,
    BuildingOffice2Icon,
    MapPinIcon,
    InboxArrowDownIcon,
    UserGroupIcon,
    CheckIcon,
} from '@heroicons/vue/24/solid';

import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';
import BackButton from '~/components/ui/back-button/BackButton.vue';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LANGUAGES } from '~/lib/constants';

const accountOptions = [
    {
        value: 'standard',
        label: 'Personnel',
    },
    {
        value: 'institution',
        label: 'Institution',
    },
];

const genders = [
    {
        value: 'M',
        label: 'Homme',
        name: 'homme',
    },
    {
        value: 'F',
        label: 'Femme',
        name: 'femme',
    },
    {
        value: 'X',
        label: 'X',
        name: 'neutre',
    },
];

const countries = [
    {
        value: 'be',
        label: 'Belgique',
        name: 'belgique',
        icon: '/icons/belgium.png',
    },
    {
        value: 'fr',
        label: 'France',
        name: 'france',
        icon: '/icons/fr.png',
    },
    {
        value: 'nl',
        label: 'Pays-Bas',
        name: 'paysBas',
        icon: '/icons/pays-bas.png',
    },
];

const countryOfWork = [
    {
        value: 'Belgique',
        label: 'Belgique',
        name: 'belgique',
        icon: '/icons/belgium.png',
    },
    {
        value: 'France',
        label: 'France',
        name: 'france',
        icon: '/icons/fr.png',
    },
];

const roleOptions = [
    {
        label: 'Infirmier(ère)',
        value: 'nurse',
    },
    {
        label: 'Aide soignant(e)',
        value: 'caregiver',
    },
    {
        label: 'Sage-femme',
        value: 'midwife',
    },
];

const professionalCategory = [
    {
        label: 'Indépendant(e)',
        value: 'salaried',
    },
    {
        label: 'Salarié(e)',
        value: 'independent',
    },
];

const { country } = useCountry();

const representGroup = ref(false);
const charteAccepted = ref(false);

const formData = reactive({
    lastname: '',
    firstname: '',
    email: '',
    accountType: accountOptions[0].value,
    institutionName: '',
    password: '',
    role: roleOptions[0].value,
    passwordConfirmation: '',
    gender: 'F',
    language: LANGUAGES[0].value,
    phoneNumber: undefined,
    identifierNumber: '',
    address: {
        street: '',
        city: '',
        zipCode: '',
        country: countries[0].value,
        workingAt: country.value,
        additionnalInformation: '',
    },
    referralSource: '',
    zipCodesArray: [],
    citiesArray: [],
    professionalCategory: '',
    radiusKm: '',
    groupName: '',
});

const identifierLabel = computed(() =>
    formData.address.workingAt === 'France'
        ? 'Numéro RPPS'
        : 'Numéro INAMI',
);

const route = useRoute();
const { register } = useAuth();

const status = ref(
    (route.query.reset ?? '').length > 0 ? atob(route.query.reset as string) : '',
);

const { submit, inProgress } = useSubmit(
    async () => {
        status.value = '';
        const formDataForBackend = {
            ...formData,
            zipCodes: formData.zipCodesArray.join(', '),
            cities: formData.citiesArray.join(', '),
            charteAccepted: charteAccepted.value ? true : false,
        };

        return register(formDataForBackend);
    },
);

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});

useHead({
    title: 'Inscription',
    meta: [
        {
            name: 'description',
            content:
                'Inscrivez-vous sur InfiSwap et rejoignez la plateforme dédiée aux infirmiers indépendants. Trouvez des remplacements, organisez vos absences, gérez vos missions et rejoignez une communauté professionnelle active en Belgique et en France.',
        },
    ],
});
</script>
