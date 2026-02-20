<template>
    <div>
        <!-- Desktop View -->
        <div class="hidden sm:flex flex-row justify-center min-h-screen">
            <div class="bg-tertiary/30 lg:block w-[115vw] hidden relative container min-h-screen">
                <div class="xl:absolute z-20 bottom-0 xl:left-32 lg:left-20">
                    <LayoutsAppImage
                        src="/auth/Group_1171.png"
                        class="xl:w-[24rem] lg:w-88 relative z-20 flex justify-center mx-auto"
                    />
                </div>
                <div class="absolute lg:top-36 lg:left-20 md:top-32 sm:top-64 sm:left-12 ">
                    <LayoutsAppImage
                        src="/icons/plus.png"
                        class="xl:w-24 xl:h-24 lg:w-20 lg:h-20 md:w-16 md:h-16 sm:w-11 sm:h-11"
                    />
                </div>
                <div class="absolute md:bottom-32 lg:right-20 md:right-12 sm:bottom-28 sm:right-6">
                    <LayoutsAppImage
                        src="/icons/Unin.png"
                        class="xl:w-16 xl:h-16 lg:w-12 lg:h-12 md:w-8 md:h-8 sm:w-6 sm:h-6"
                    />
                </div>
                <div class="absolute xl:left-24 lg:left-16 md:left-8 xl:bottom-24 lg:bottom-20 md:bottom-16 sm:bottom-12">
                    <LayoutsAppImage
                        src="/icons/cog.png"
                        class="xl:w-52 xl:h-52 lg:h-44 lg:w-44 md:h-28 md:w-28 sm:h-20 sm:w-20"
                    />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white overflow-y-auto w-full flex flex-col items-center relative py-14">
                <BackButton to="/login" />
                <div class="hidden lg:block mb-8">
                    <LayoutsAppImage
                        src="logo.png"
                        class="h-14 lg:h-28"
                    />
                </div>

                <div class="w-full max-w-lg px-8 font-light">
                    <h1 class="mb-6 text-sm xl:text-base text-center">
                        <span>Bienvenue sur <span class="font-bold text-primary">InfiSwap</span>, la plateforme pour vos remplacements!</span>
                        <span> Pour vous inscrire, veuillez remplir le formulaire ci-dessous.</span>
                    </h1>

                    <form
                        class="grid grid-cols-2 lg:grid-cols-4 gap-4"
                        @submit.prevent="submit"
                    >
                        <div class="col-span-2 relative w-full items-center">
                            <InputIcon
                                v-model="formData.lastname"
                                :icon="UserCircleIcon"
                                size="md"
                                placeholder="Nom *"
                            />
                        </div>

                        <div class="col-span-2 relative w-full items-center">
                            <InputIcon
                                v-model="formData.firstname"
                                :icon="UserCircleIcon"
                                size="md"
                                placeholder="Prénoms *"
                            />
                        </div>

                        <div class="col-span-2 relative w-full items-center">
                            <InputIcon
                                v-model="formData.email"
                                :icon="EnvelopeIcon"
                                size="md"
                                placeholder="Email *"
                            />
                        </div>

                        <div class="col-span-2">
                            <InputIcon
                                v-model="formData.phoneNumber"
                                :icon="PhoneIcon"
                                size="md"
                                placeholder="N° de téléphone"
                            />
                        </div>

                        <div class="col-span-2">
                            <InputIcon
                                v-model="formData.password"
                                :icon="LockClosedIcon"
                                size="md"
                                type="password"
                                placeholder="Mot de passe *"
                            />
                        </div>

                        <div class="col-span-2">
                            <InputIcon
                                v-model="formData.passwordConfirmation"
                                :icon="LockClosedIcon"
                                size="md"
                                type="password"
                                placeholder="Mot de passe *"
                            />
                        </div>

                        <div class="col-span-2">
                            <Select v-model="formData.gender">
                                <SelectTrigger
                                    class="flex xl:h-auto sm:h-8 items-center rounded-full border border-gray-300"
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

                        <div class="col-span-2">
                            <InputIcon
                                v-model="formData.address.street"
                                :icon="MapPinIcon"
                                size="md"
                                placeholder="Rue *"
                            />
                        </div>

                        <div class="col-span-2">
                            <InputIcon
                                v-model="formData.address.zipCode"
                                :icon="InboxArrowDownIcon"
                                size="md"
                                placeholder="Code postal *"
                            />
                        </div>

                        <div class="col-span-2">
                            <InputIcon
                                v-model="formData.address.city"
                                :icon="BuildingOffice2Icon"
                                size="md"
                                placeholder="Ville *"
                            />
                        </div>

                        <div class="col-span-2">
                            <Select v-model="formData.address.country">
                                <SelectTrigger
                                    class="flex justify-between items-center rounded-full border border-gray-300"
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
                            <InputIcon
                                v-model="formData.address.additionnalInformation"
                                :icon="EllipsisHorizontalCircleIcon"
                                size="md"
                                placeholder="Complément d'adresse"
                            />
                        </div>

                        <div class="col-span-2">
                            <Select v-model="formData.accountType">
                                <SelectTrigger
                                    class="flex w-full space-x-4 text-sm justify-start items-center rounded-3xl border border-gray-300 disabled:opacity-100 disabled:cursor-default"
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
                                            v-for="accountOption in accountOptions"
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

                        <div class="col-span-2">
                            <Select
                                v-model="formData.language"
                                disabled
                            >
                                <SelectTrigger
                                    class="flex w-full space-x-4 xl:text-sm sm:text-xs xl:h-auto sm:h-8 justify-start items-center rounded-3xl border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90"
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

                        <div class="col-span-2 lg:col-span-2">
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

                        <div class="col-span-2">
                            <label class="text-sm font-medium text-gray-700">
                                Votre pays de travail
                            </label>
                            <Select v-model="formData.address.workingAt">
                                <SelectTrigger
                                    class="flex justify-between items-center rounded-full border border-gray-300 mt-1"
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
                            <label class="text-sm font-medium text-gray-700">
                                Catégorie professionnel <span class="text-red-500">*</span>
                            </label>
                            <Select v-model="formData.professionalCategory">
                                <SelectTrigger
                                    class="flex justify-between items-center rounded-full border border-gray-300 mt-1"
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

                        <div class="mt-4 col-span-2 lg:col-span-4">
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
                        </div>

                        <div class="col-span-2 lg:col-span-4 mt-8 flex justify-center items-center">
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

            <div class="grow flex flex-col items-center px-6 py-10 overflow-y-auto">
                <h1 class="mb-8 text-sm text-center">
                    <span>Bienvenue sur <span class="font-bold text-primary">InfiSwap</span>!</span>
                    <span> Remplissez le formulaire pour vous inscrire.</span>
                </h1>

                <form
                    class="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    @submit.prevent="submit"
                >
                    <div class="col-span-2 relative w-full items-center">
                        <InputIcon
                            v-model="formData.lastname"
                            :icon="UserCircleIcon"
                            size="md"
                            placeholder="Nom *"
                        />
                    </div>

                    <div class="col-span-2 relative w-full items-center">
                        <InputIcon
                            v-model="formData.firstname"
                            :icon="UserCircleIcon"
                            size="md"
                            placeholder="Prénoms *"
                        />
                    </div>

                    <div class="col-span-2 relative w-full items-center">
                        <InputIcon
                            v-model="formData.email"
                            :icon="EnvelopeIcon"
                            size="md"
                            placeholder="Email *"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.phoneNumber"
                            :icon="PhoneIcon"
                            size="md"
                            placeholder="N° de téléphone"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.password"
                            :icon="LockClosedIcon"
                            size="md"
                            type="password"
                            placeholder="Mot de passe *"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.passwordConfirmation"
                            :icon="LockClosedIcon"
                            size="md"
                            type="password"
                            placeholder="Mot de passe *"
                        />
                    </div>

                    <div class="col-span-2">
                        <Select v-model="formData.gender">
                            <SelectTrigger
                                class="flex xl:h-auto sm:h-8 items-center rounded-full border border-gray-300"
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

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.address.street"
                            :icon="MapPinIcon"
                            size="md"
                            placeholder="Rue *"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.address.zipCode"
                            :icon="InboxArrowDownIcon"
                            size="md"
                            placeholder="Code postal *"
                        />
                    </div>

                    <div class="col-span-2">
                        <InputIcon
                            v-model="formData.address.city"
                            :icon="BuildingOffice2Icon"
                            size="md"
                            placeholder="Ville *"
                        />
                    </div>

                    <div class="col-span-2">
                        <Select v-model="formData.address.country">
                            <SelectTrigger
                                class="flex justify-between items-center rounded-full border border-gray-300"
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
                        <InputIcon
                            v-model="formData.address.additionnalInformation"
                            :icon="EllipsisHorizontalCircleIcon"
                            size="md"
                            placeholder="Complément d'adresse"
                        />
                    </div>

                    <div class="col-span-2">
                        <Select v-model="formData.accountType">
                            <SelectTrigger
                                class="flex w-full space-x-4 text-sm justify-start items-center rounded-3xl border border-gray-300 disabled:opacity-100 disabled:cursor-default"
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
                                        v-for="accountOption in accountOptions"
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

                    <div class="col-span-2">
                        <Select
                            v-model="formData.language"
                            disabled
                        >
                            <SelectTrigger
                                class="flex w-full space-x-4 xl:text-sm sm:text-xs xl:h-auto sm:h-8 justify-start items-center rounded-3xl border border-gray-300 focus-within:border-primary/90 focus-within:ring-1 focus-within:ring-primary/90"
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

                    <div class="col-span-2 lg:col-span-2">
                        <InputIcon
                            v-model="formData.identifierNumber"
                            :icon="IdentificationIcon"
                            size="md"
                            :placeholder="identifierLabel"
                        />
                    </div>

                    <br>

                    <div class="col-span-2">
                        <label class="text-sm font-medium text-gray-700">
                            Votre pays de travail
                        </label>
                        <Select v-model="formData.address.workingAt">
                            <SelectTrigger
                                class="flex justify-between items-center rounded-full border border-gray-300 mt-1"
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
                        <label class="text-sm font-medium text-gray-700">
                            Catégorie professionnel <span class="text-red-500">*</span>
                        </label>
                        <Select v-model="formData.professionalCategory">
                            <SelectTrigger
                                class="flex justify-between items-center rounded-full border border-gray-300 mt-1"
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

                    <div class="mt-4 col-span-2 lg:col-span-4">
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

                            <label class="flex items-start cursor-pointer">
                                <Checkbox
                                    :checked="charteAccepted"
                                    class="mt-1"
                                    @update:checked="charteAccepted = $event"
                                />
                                <span class="text-sm ml-2">
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
                    </div>

                    <div class="col-span-2 lg:col-span-4 mt-4 flex justify-center items-center">
                        <Button
                            class="w-[50%]"
                            type="submit"
                            :in-progress="inProgress"
                            :disabled="!charteAccepted"
                        >
                            S'inscrire
                        </Button>
                    </div>
                </form>

                <div class="text-sm text-center mt-8 pb-10">
                    <span>Déjà un compte ?</span>
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

const accountOptions = [
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
    password: '',
    accountType: accountOptions[0].value,
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
