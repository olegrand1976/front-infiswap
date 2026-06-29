<template>
    <div>
        <div class="hidden sm:flex flex-row h-screen overflow-hidden">
            <BackButton
                to="/login"
            />
            <div
                :class="cn(
                    'w-1/2 flex flex-col relative h-screen overflow-hidden',
                )"
            >
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <div
                        v-if="formData.accountType === 'standard'"
                        key="standard"
                        class="pt-8 sm:pt-10 lg:pt-12 xl:pt-14 flex flex-col h-full bg-white"
                    >
                        <div class="flex-1 lg:hidden" />
                        <h1 class="mb-6 sm:mb-8 lg:mb-12 text-xl lg:text-2xl xl:text-3xl max-w-xl mx-auto mt-4 sm:mt-0 lg:mt-10 xl:mt-12 text-center px-6 lg:px-0 leading-tight">
                            <span class="block mb-2 font-medium text-gray-600">Bienvenue sur <span class="font-black text-primary drop-shadow-sm uppercase tracking-wider">InfiSwap</span>,</span>
                            <span class="block text-gray-900 font-extrabold">la plateforme pour vos remplacements!</span>
                            <span class="block mt-5 text-sm font-medium text-gray-400">Pour vous inscrire, veuillez remplir le formulaire ci-dessous.</span>
                        </h1>
                        <div class="flex-1" />
                        <div class="rounded-2xl max-w-md mx-auto">
                            <LayoutsAppImage
                                src="/auth/Group_1171.png"
                                class="relative z-20 flex justify-center mx-auto"
                            />
                        </div>
                        <div class="absolute sm:top-1/2 sm:-translate-y-1/2 lg:top-1/4 lg:translate-y-0 lg:left-16 sm:left-12 opacity-70">
                            <LayoutsAppImage
                                src="/icons/plus.png"
                                class="lg:size-20 md:size-16 sm:size-11"
                            />
                        </div>
                        <div class="absolute bottom-0 left-0 w-full h-20 bg-primary" />
                    </div>
                    <div
                        v-else
                        key="institution"
                        ref="leftPanelScroll"
                        class="bg-primary shadow-2xl flex-1 overflow-y-auto custom-scrollbar relative"
                        @scroll="handleLeftPanelScroll"
                    >
                        <InstitutionPricing />
                    </div>
                </transition>
                <!-- Scroll Indicator Arrow (Fixed overlay) -->
                <transition name="fade">
                    <div
                        v-if="formData.accountType === 'institution' && !hasScrolledToBottom"
                        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer animate-bounce text-white drop-shadow-xl z-30 group"
                        @click="scrollLeftPanelDown"
                    >
                        <span class="text-[10px] font-bold uppercase tracking-widest bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 group-hover:bg-black/40 transition-colors">Découvrir nos avantages</span>
                        <CircleChevronDown class="size-8" />
                    </div>
                </transition>
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
                        autocomplete="off"
                        @submit.prevent="submit"
                    >
                        <div>
                            <h2 class="mt-1 sm:mt-2 lg:mt-3 text-lg text-center max-w-xl mx-auto text-gray-500 mb-3 sm:mb-4">
                                Quel type de compte souhaitez-vous choisir ?
                            </h2>
                            <div class="px-8 mb- lg:mb-5 xl:mb-6">
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
                                            class="border-2 rounded-xl p-6 h-full flex flex-col items-center justify-center transition-all duration-300 relative"
                                            :class="formData.accountType === account.value
                                                ? 'border-primary bg-primary/5 shadow-lg'
                                                : 'border-gray-300 hover:border-gray-400'"
                                        >
                                            <div class="relative w-full h-16">
                                                <component
                                                    :is="account.value === 'standard' ? CircleUser : Building2"
                                                    :class="cn('size-12 mx-auto mb-3 transition-colors', formData.accountType === account.value ? 'text-primary' : 'text-gray-400')"
                                                />
                                                <div
                                                    v-if="formData.accountType === account.value"
                                                    class="absolute -top-2 -right-2 bg-primary rounded-full p-1 transition-all duration-300"
                                                >
                                                    <Check class="size-3 text-white" />
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
                                            <div
                                                v-if="account.value === 'institution'"
                                                class="absolute top-0 right-0 translate-x-1/3 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-black shadow-xl border bg-primary text-white border-primary/20 z-30"
                                            >
                                                150€ / Mois
                                            </div>
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
                                        :icon="Building2"
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
                                            :icon="CircleUser"
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
                                            :icon="CircleUser"
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
                                            :icon="Mail"
                                            size="md"
                                            placeholder="Email *"
                                            autocomplete="off"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            N° de téléphone
                                        </label>
                                        <InputIcon
                                            v-model="formData.phoneNumber"
                                            :icon="Phone"
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
                                            :icon="Lock"
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
                                            :icon="Lock"
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
                                            :icon="MapPin"
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
                                            :icon="Inbox"
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
                                            :icon="Building2"
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
                                                <Users class="text-primary w-9 h-9 sm:w-7 sm:h-7" />
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

                                    <div class="col-span-4">
                                        <div class="text-sm font-medium text-gray-700 mb-4 block">
                                            Pays de recherche
                                            <span
                                                v-if="formData.address.workingAt.length === 0"
                                                class="text-gray-400 text-sm ml-2 font-light"
                                            >
                                                (Sélectionnez un ou plusieurs pays)
                                            </span>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                            <div
                                                v-for="workingAt in countryOfWork"
                                                :key="workingAt.value"
                                                class="flex items-center gap-2"
                                            >
                                                <Checkbox
                                                    :checked="formData.address.workingAt.includes(workingAt.value)"
                                                    @update:checked="(checked) => {
                                                        if (checked) {
                                                            if (!formData.address.workingAt.includes(workingAt.value)) {
                                                                formData.address.workingAt.push(workingAt.value);
                                                            }
                                                        }
                                                        else {
                                                            formData.address.workingAt = formData.address.workingAt.filter(c => c !== workingAt.value);
                                                        }
                                                    }"
                                                />
                                                <div class="flex items-center gap-2">
                                                    <LayoutsAppImage
                                                        :src="workingAt.icon"
                                                        :alt="workingAt.name"
                                                        class="xl:w-4 xl:h-3 sm:w-3 sm:h-2"
                                                        format="png"
                                                    />
                                                    <span class="sm:text-xs xl:text-sm">{{ workingAt.label }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        v-if="formData.accountType !== 'institution'"
                                        class="col-span-2"
                                    >
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ identifierLabel }}
                                        </label>
                                        <InputIcon
                                            v-model="formData.identifierNumber"
                                            :icon="IdCard"
                                            size="md"
                                            :placeholder="identifierLabel"
                                        />
                                    </div>
                                    <div
                                        v-else
                                        class="col-span-4"
                                    >
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            Numéro d'entreprise
                                        </label>
                                        <InputIcon
                                            v-model="formData.companyNumber"
                                            :icon="IdCard"
                                            size="md"
                                            placeholder="Numéro d'entreprise"
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
                                        <Users class="text-primary w-10 h-10" />
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
                                            :icon="Users"
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

        <div
            :class="cn(
                'sm:hidden min-h-screen w-screen flex flex-col relative overflow-x-hidden transition-colors duration-500',
                formData.accountType === 'institution' ? 'bg-primary institution-mode-mobile' : 'bg-white',
            )"
        >
            <LayoutsHeaderMobile />
            <BackButton to="/login" />

            <div class="grow flex flex-col items-center px-6 py-10 pb-20 overflow-y-auto">
                <div v-if="formData.accountType === 'standard'">
                    <h1 class="mt-8 mb-8 text-sm text-center">
                        <span>Bienvenue sur <span class="font-bold text-primary">InfiSwap</span>, la plateforme pour vos remplacements!</span>
                        <span> Pour vous inscrire, veuillez remplir le formulaire ci-dessous.</span>
                    </h1>
                </div>
                <NuxtLink
                    v-else
                    to="/institution/pricing"
                    class="w-full mt-12 mb-8 bg-primary rounded-3xl p-6 shadow-xl flex items-center justify-between group overflow-hidden relative"
                >
                    <div class="z-10">
                        <h3 class="text-white font-bold text-lg mb-1 leading-tight">Infiswap Institutional</h3>
                        <p class="text-white/80 text-sm">Le réseau n°1 du remplacement infirmier en Belgique</p>
                        <div class="mt-4 inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 text-sm font-medium">
                            Découvrir les avantages
                            <ArrowRight class="size-4 animate-bounce-right" />
                        </div>
                    </div>
                    <div class="absolute -right-4 -bottom-4 opacity-20">
                        <Building2 class="size-24 text-white rotate-12" />
                    </div>
                </NuxtLink>

                <form
                    class="grid gap-4 transition-all duration-00"
                    autocomplete="off"
                    @submit.prevent="submit"
                >
                    <div class="space-y-6">
                        <div>
                            <h2
                                :class="cn(
                                    'mt-1 sm:mt-2 lg:mt-3 text-lg text-center max-w-xl mx-auto mb-3 sm:mb-4 transition-colors',
                                    formData.accountType === 'institution' ? 'text-white' : 'text-gray-500',
                                )"
                            >
                                Quel type de compte souhaitez-vous choisir ?
                            </h2>
                            <div class="grid grid-cols-2 gap-4">
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
                                        :class="cn(
                                            'border-2 rounded-xl p-4 h-full flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm relative',
                                            formData.accountType === account.value
                                                ? (formData.accountType === 'institution' ? 'border-white bg-white/20 shadow-xl scale-105' : 'border-primary bg-primary/5 shadow-lg')
                                                : (formData.accountType === 'institution' ? 'border-white/30 bg-white/5 hover:border-white/50' : 'border-gray-300 hover:border-gray-400'),
                                        )"
                                    >
                                        <div class="relative w-full">
                                            <component
                                                :is="account.value === 'standard' ? CircleUser : Building2"
                                                :class="cn(
                                                    'w-10 h-10 mx-auto mb-2 transition-colors duration-300',
                                                    formData.accountType === account.value
                                                        ? (formData.accountType === 'institution' ? 'text-white' : 'text-primary')
                                                        : (formData.accountType === 'institution' ? 'text-white/60' : 'text-gray-400'),
                                                )"
                                            />
                                            <div
                                                v-if="formData.accountType === account.value"
                                                class="absolute -top-1 -right-1 rounded-full p-1 transition-all duration-300"
                                                :class="formData.accountType === 'institution' ? 'bg-white shadow-lg' : 'bg-primary'"
                                            >
                                                <Check
                                                    class="size-3"
                                                    :class="formData.accountType === 'institution' ? 'text-primary' : 'text-white'"
                                                />
                                            </div>
                                        </div>
                                        <span
                                            class="text-sm font-medium text-center transition-colors duration-300"
                                            :class="[
                                                formData.accountType === account.value
                                                    ? (formData.accountType === 'institution' ? 'text-white' : 'text-primary')
                                                    : (formData.accountType === 'institution' ? 'text-white/80' : 'text-gray-700'),
                                            ]"
                                        >
                                            {{ account.label }}
                                        </span>
                                        <span
                                            v-if="account.description"
                                            class="text-[10px] mt-1 text-center transition-opacity"
                                            :class="formData.accountType === 'institution' ? 'text-white/60' : 'text-gray-500'"
                                        >
                                            {{ account.description }}
                                        </span>

                                        <div
                                            v-if="account.value === 'institution'"
                                            :class="cn(
                                                'absolute top-0 right-3 translate-x-1/4 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-black shadow-xl border transition-all duration-300 transform z-30',
                                                formData.accountType === 'institution' ? 'bg-white text-primary border-white animate-pulse scale-110' : 'bg-primary text-white border-primary/20',
                                            )"
                                        >
                                            150€ / Mois
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="formData.accountType == 'institution'"
                            class="col-span-2 relative w-full items-center"
                        >
                            <label :class="cn('text-sm font-medium', formData.accountType === 'institution' ? 'text-white' : 'text-gray-700')">
                                Nom de l'institution
                            </label>
                            <InputIcon
                                v-model="formData.institutionName"
                                :icon="Building2"
                                size="md"
                                placeholder="Nom de l'institution *"
                            />
                        </div>
                    </div>

                    <div>
                        <label :class="cn('text-md font-medium mb-1 sm:mb-2 lg:mb-3 block', formData.accountType === 'institution' ? 'text-white' : 'text-gray-700')">
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
                                        :icon="CircleUser"
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
                                        :icon="CircleUser"
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
                                        :icon="Mail"
                                        size="md"
                                        placeholder="Email *"
                                        autocomplete="off"
                                    />
                                </div>

                                <div class="col-span-2">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        N° de téléphone
                                    </label>
                                    <InputIcon
                                        v-model="formData.phoneNumber"
                                        :icon="Phone"
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
                        <label :class="cn('text-md font-medium mb-1 sm:mb-2 lg:mb-3 block', formData.accountType === 'institution' ? 'text-white' : 'text-gray-700')">
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
                                        :icon="Lock"
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
                                        :icon="Lock"
                                        size="md"
                                        type="password"
                                        placeholder="Confirmation mot de passe *"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label :class="cn('text-md font-medium mb-1 sm:mb-2 lg:mb-3 block', formData.accountType === 'institution' ? 'text-white' : 'text-gray-700')">
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
                                        :icon="MapPin"
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
                                        :icon="Inbox"
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
                                        :icon="Building2"
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
                        <label :class="cn('text-md font-medium mb-1 sm:mb-2 lg:mb-3 block', formData.accountType === 'institution' ? 'text-white' : 'text-gray-700')">
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
                                            <Users class="text-primary w-9 h-9 sm:w-7 sm:h-7" />
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

                                <div class="col-span-4">
                                    <div class="text-sm font-medium text-gray-700 mb-4 block">
                                        Pays de recherche
                                        <span
                                            v-if="formData.address.workingAt.length === 0"
                                            class="text-gray-400 text-sm ml-2 font-light"
                                        >
                                            (Sélectionnez un ou plusieurs pays)
                                        </span>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                        <div
                                            v-for="workingAt in countryOfWork"
                                            :key="workingAt.value"
                                            class="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                :checked="formData.address.workingAt.includes(workingAt.value)"
                                                @update:checked="(checked) => {
                                                    if (checked) {
                                                        if (!formData.address.workingAt.includes(workingAt.value)) {
                                                            formData.address.workingAt.push(workingAt.value);
                                                        }
                                                    }
                                                    else {
                                                        formData.address.workingAt = formData.address.workingAt.filter(c => c !== workingAt.value);
                                                    }
                                                }"
                                            />
                                            <div class="flex items-center gap-2">
                                                <LayoutsAppImage
                                                    :src="workingAt.icon"
                                                    :alt="workingAt.name"
                                                    class="xl:w-4 xl:h-3 sm:w-3 sm:h-2"
                                                    format="png"
                                                />
                                                <span class="sm:text-xs xl:text-sm">{{ workingAt.label }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    v-if="formData.accountType !== 'institution'"
                                    class="col-span-4"
                                >
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ identifierLabel }}
                                    </label>
                                    <InputIcon
                                        v-model="formData.identifierNumber"
                                        :icon="IdCard"
                                        size="md"
                                        :placeholder="identifierLabel"
                                    />
                                </div>
                                <div
                                    v-else
                                    class="col-span-4"
                                >
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        Numéro d'entreprise
                                    </label>
                                    <InputIcon
                                        v-model="formData.companyNumber"
                                        :icon="IdCard"
                                        size="md"
                                        placeholder="Numéro d'entreprise"
                                    />
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
                                        <Users class="text-primary w-10 h-10" />
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
                                        :icon="Users"
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
                            :class="cn('w-full', formData.accountType === 'institution' ? 'bg-white text-primary hover:bg-white/80' : 'bg-primary text-white hover:bg-primary/80')"
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
                        :class="cn('font-bold underline ml-1', formData.accountType === 'institution' ? 'text-white' : 'text-primary')"
                    >
                        Connexion
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ArrowRight, Building2, Check, CircleChevronDown, CircleUser, IdCard, Inbox, Lock, Mail, MapPin, Phone, Users } from 'lucide-vue-next';
import InstitutionPricing from '~/components/register/InstitutionPricing.vue';
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
import { cn } from '~/lib/utils';

const leftPanelScroll = ref<HTMLElement | null>(null);
const hasScrolledToBottom = ref(false);

const handleLeftPanelScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    hasScrolledToBottom.value = target.scrollTop + target.clientHeight >= target.scrollHeight - 50;
};

const scrollLeftPanelDown = () => {
    if (leftPanelScroll.value) {
        leftPanelScroll.value.scrollBy({
            top: 400,
            behavior: 'smooth',
        });
    }
};

const accountOptions = [
    {
        value: 'standard',
        label: 'Infirmier(ère)',
        description: 'Professionnel de santé',
    },
    {
        value: 'institution',
        label: 'Institution',
        description: 'MR/MRS, hôpital, bureau de tarification, groupe infirmier, centre d\'intérim',
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

type CountryOfWork = {
    value: 'Belgique' | 'France';
    label: string;
    name: string;
    icon: string;
};

const countryOfWork: CountryOfWork[] = [
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
    companyNumber: '',
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
        workingAt: country.value ? [country.value as 'Belgique' | 'France'] : [] as ('Belgique' | 'France')[],
        additionnalInformation: '',
    },
    referralSource: '',
    zipCodesArray: [],
    citiesArray: [],
    professionalCategory: '',
    radiusKm: '',
    groupName: '',
});

watch(
    () => formData.accountType,
    () => {
        if (leftPanelScroll.value) {
            leftPanelScroll.value.scrollTop = 0;
            hasScrolledToBottom.value = false;
        }
    },
);

const identifierLabel = computed(() => {
    const hasFrance = formData.address.workingAt.includes('France');
    const hasBelgique = formData.address.workingAt.includes('Belgique');

    if (hasFrance && hasBelgique) {
        return 'Numéro RPPS / Numéro INAMI';
    }
    if (hasFrance) {
        return 'Numéro RPPS';
    }
    return 'Numéro INAMI';
});

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-out;
}

.fade-enter-from {
  opacity: 0.3;
  transform: translateY(5px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}

@keyframes bounce-right {
    0%, 100% {
        transform: translateX(0);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
        transform: translateX(4px);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}
.animate-bounce-right {
    animation: bounce-right 1s infinite;
}

@keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
    animation: bounce-slow 4s infinite ease-in-out;
}
</style>
