<template>
    <div>
        <div class="hidden lg:flex flex-row h-screen overflow-hidden">
            <BackButton
                :to="localePath('/login')"
            />
            <div class="hidden sm:block absolute top-6 right-6 z-30">
                <LayoutsDropdownLang />
            </div>
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
                        <h1 class="mb-6 sm:mb-8 lg:mb-12 max-w-xl mx-auto mt-4 sm:mt-0 lg:mt-10 xl:mt-12 text-center px-6 lg:px-0">
                            <span class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                                <span class="h-px w-3.5 bg-primary/35" />
                                {{ $t('register.welcome') }}
                                <span class="h-px w-3.5 bg-primary/35" />
                            </span>
                            <span class="mt-3 block font-secondary text-2xl font-bold leading-tight text-gray-900 lg:text-3xl xl:text-4xl">
                                {{ $t('register.tagline') }}
                            </span>
                            <svg
                                class="mx-auto mt-2 h-3 w-24 text-primary/80"
                                viewBox="0 0 96 12"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.4"
                                stroke-linecap="round"
                            >
                                <path d="M2 8c8-9 14 3 22-6s14 9 22 0 14-9 22 0 14 6 22-2" />
                            </svg>
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
                <transition name="fade">
                    <div
                        v-if="formData.accountType === 'institution' && !hasScrolledToBottom"
                        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer animate-bounce text-white drop-shadow-xl z-30 group"
                        @click="scrollLeftPanelDown"
                    >
                        <span class="text-[10px] font-bold uppercase tracking-widest bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 group-hover:bg-black/40 transition-colors">{{ $t('register.discoverBenefits') }}</span>
                        <CircleChevronDown class="size-8" />
                    </div>
                </transition>
            </div>

            <div class="w-1/2 bg-white overflow-y-auto overflow-x-hidden flex flex-col items-center relative py-8 sm:py-10">
                <div class="relative hidden lg:flex lg:justify-center mb-2 lg:mb-4 xl:mb-6">
                    <span class="pointer-events-none absolute -inset-x-12 -inset-y-6 rounded-full bg-primary/10 blur-2xl" />
                    <LayoutsAppImage
                        src="logo.png"
                        class="relative h-14 lg:h-20"
                    />
                </div>

                <div class="text-center -mt-2 sm:-mt-1 lg:mt-2 xl:mt-4">
                    <h2 class="font-secondary text-2xl font-semibold text-dark lg:text-3xl 2xl:text-4xl">
                        {{ $t('register.title') }}
                    </h2>
                    <p class="mt-2 text-sm text-gray-500">
                        {{ $t('register.subtitle') }}
                    </p>
                </div>

                <div class="w-full max-w-5xl px-8 font-light mt-4 sm:mt-6 lg:mt-8 xl:mt-10">
                    <form
                        class="grid gap-4 sm:gap-5 lg:gap-6 xl:gap-8"
                        autocomplete="off"
                        @submit.prevent="submit"
                    >
                        <div
                            v-if="referrerDisplay"
                            class="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-gray-700"
                        >
                            {{ $t('register.referredBy') }}
                            <span class="font-semibold text-primary">{{ referrerDisplay }}</span>
                        </div>

                        <div class="relative space-y-4">
                            <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                            <RegisterStepHeading
                                :number="1"
                                :title="$t('register.step1Title')"
                                :subtitle="$t('register.step1Subtitle')"
                            />
                            <div class="pl-12">
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
                                            class="border-2 rounded-lg p-6 h-full flex flex-col items-center justify-center transition-all duration-300 relative"
                                            :class="formData.accountType === account.value
                                                ? 'border-primary bg-primary/5 shadow-lg'
                                                : 'border-gray-300 hover:border-gray-400'"
                                        >
                                            <div class="relative w-full h-8">
                                                <component
                                                    :is="account.value === 'standard' ? CircleUser : Building2"
                                                    :class="cn('size-6 mx-auto mb-3 transition-colors', formData.accountType === account.value ? 'text-primary' : 'text-gray-400')"
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
                                            <span
                                                v-if="account.description"
                                                class="mt-1 text-xs text-center text-gray-500"
                                            >
                                                {{ account.description }}
                                            </span>
                                            <div
                                                v-if="account.value === 'institution'"
                                                class="absolute top-0 right-0 translate-x-1/3 -translate-y-1/2 px-3 py-1 rounded-md text-[10px] font-black shadow-xl border bg-primary text-white border-primary/20 z-30"
                                            >
                                                {{ $t('register.institutionPrice') }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-if="formData.accountType == 'institution'"
                                    class="mt-3 sm:mt-4 lg:mt-5 relative w-full items-center"
                                >
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.institutionNameLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.institutionName"
                                        :icon="Building2"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.institutionName')"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="relative space-y-4">
                            <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                            <RegisterStepHeading
                                :number="2"
                                :title="$t('register.step2Title')"
                                :subtitle="$t('register.step2Subtitle')"
                            />
                            <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div class="col-span-2 relative w-full items-center">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.lastnameLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.lastname"
                                            :icon="CircleUser"
                                            size="md"
                                            rounded="md"
                                            :placeholder="$t('register.lastname')"
                                        />
                                    </div>

                                    <div class="col-span-2 relative w-full items-center">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.firstnameLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.firstname"
                                            :icon="CircleUser"
                                            size="md"
                                            rounded="md"
                                            :placeholder="$t('register.firstname')"
                                        />
                                    </div>

                                    <div class="col-span-2 relative w-full items-center">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.emailLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.email"
                                            :icon="Mail"
                                            size="md"
                                            rounded="md"
                                            :placeholder="$t('register.email')"
                                            autocomplete="off"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.phoneLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.phoneNumber"
                                            :icon="Phone"
                                            size="md"
                                            rounded="md"
                                            :placeholder="$t('register.phone')"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.gender') }} <span class="text-xs font-normal text-muted-foreground">({{ $t('pricing.optional') }})</span>
                                        </label>
                                        <Select v-model="formData.gender">
                                            <SelectTrigger
                                                class="flex items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                                position="right"
                                            >
                                                <LayoutsAppImage
                                                    src="/icons/gender.png"
                                                    class="h-5"
                                                />
                                                <SelectValue
                                                    :placeholder="$t('register.gender')"
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

                        <div class="relative space-y-4">
                            <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                            <RegisterStepHeading
                                :number="3"
                                :title="$t('register.step3Title')"
                                :subtitle="$t('register.step3Subtitle')"
                            />
                            <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.passwordLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.password"
                                            :icon="Lock"
                                            size="md"
                                            rounded="md"
                                            type="password"
                                            :placeholder="$t('register.password')"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.passwordConfirmLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.passwordConfirmation"
                                            :icon="Lock"
                                            size="md"
                                            rounded="md"
                                            type="password"
                                            :placeholder="$t('register.passwordConfirm')"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="relative space-y-4">
                            <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                            <RegisterStepHeading
                                :number="4"
                                :title="$t('register.step4Title')"
                                :subtitle="$t('register.step4Subtitle')"
                            />
                            <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.streetLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.address.street"
                                            :icon="MapPin"
                                            size="md"
                                            rounded="md"
                                            :placeholder="$t('register.street')"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.zipCodeLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.address.zipCode"
                                            :icon="Inbox"
                                            size="md"
                                            rounded="md"
                                            :placeholder="$t('register.zipCode')"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.cityLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.address.city"
                                            :icon="Building2"
                                            size="md"
                                            rounded="md"
                                            :placeholder="$t('register.city')"
                                        />
                                    </div>

                                    <div class="col-span-2">
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.country') }} <span class="text-primary">*</span>
                                        </label>
                                        <Select v-model="formData.address.country">
                                            <SelectTrigger
                                                class="flex justify-between items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                                position="right"
                                            >
                                                <LayoutsAppImage
                                                    src="/icons/flag.png"
                                                    class="h-4 ml-2"
                                                />
                                                <SelectValue
                                                    :placeholder="$t('register.country')"
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
                                            {{ $t('register.addressExtra') }} <span class="text-xs font-normal text-muted-foreground">({{ $t('pricing.optional') }})</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.address.additionalInformation"
                                            :icon="EllipsisHorizontalCircleIcon"
                                            size="md"
                                            rounded="md"
                                            :placeholder="$t('register.addressExtra')"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="relative space-y-4">
                            <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                            <RegisterStepHeading
                                :number="5"
                                :title="$t('register.step5Title')"
                                :subtitle="$t('register.step5Subtitle')"
                            />
                            <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div
                                        v-if="formData.accountType != 'institution'"
                                        class="col-span-2"
                                    >
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.account') }} <span class="text-xs font-normal text-muted-foreground">({{ $t('pricing.optional') }})</span>
                                        </label>
                                        <Select v-model="formData.role">
                                            <SelectTrigger
                                                class="flex w-full space-x-4 text-sm justify-start items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary disabled:opacity-100 disabled:cursor-default"
                                                position="right"
                                            >
                                                <Users class="text-primary w-9 h-9 sm:w-7 sm:h-7" />
                                                <SelectValue
                                                    :placeholder="$t('register.account')"
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
                                            {{ $t('register.language') }}
                                        </label>
                                        <Select v-model="formData.language">
                                            <SelectTrigger
                                                class="flex w-full space-x-4 text-sm justify-start items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                                position="right"
                                            >
                                                <SelectValue
                                                    :placeholder="$t('register.language')"
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
                                                            <div class="flex items-center">
                                                                <LayoutsAppImage
                                                                    :src="language.icon"
                                                                    :alt="language.name"
                                                                    class="xl:w-4 xl:h-3 sm:w-3 sm:h-2 my-auto mr-2"
                                                                    format="png"
                                                                />
                                                                <span class="xl:text-sm sm:text-xs">{{ language.name }}</span>
                                                            </div>
                                                        </SelectItem>
                                                    </div>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div class="col-span-4">
                                        <div class="text-sm font-medium text-gray-700 mb-4 block">
                                            {{ $t('register.searchCountries') }} <span class="text-primary">*</span>
                                            <span
                                                v-if="formData.address.workingAt.length === 0"
                                                class="text-gray-400 text-sm ml-2 font-light"
                                            >
                                                ({{ $t('register.workingAtHint') }})
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
                                            <span class="text-xs font-normal text-muted-foreground">({{ $t('pricing.optional') }})</span>
                                        </label>
                                        <InputIcon
                                            v-model="formData.identifierNumber"
                                            :icon="IdCard"
                                            size="md"
                                            rounded="md"
                                            :placeholder="identifierLabel"
                                        />
                                        <p
                                            v-if="formData.accountType !== 'institution'
                                                && isBelgiumCountryCode(formData.address.country)
                                                && formData.identifierNumber?.trim()
                                                && !isValidInamiFormat(formData.identifierNumber)"
                                            class="mt-1 text-xs text-destructive"
                                        >
                                            {{ INAMI_FORMAT_ERROR }}
                                        </p>
                                    </div>
                                    <div
                                        v-else
                                        class="col-span-4"
                                    >
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.companyNumber') }}
                                        </label>
                                        <InputIcon
                                            v-model="formData.companyNumber"
                                            :icon="IdCard"
                                            size="md"
                                            rounded="md"
                                            :placeholder="$t('register.companyNumber')"
                                        />
                                    </div>

                                    <div
                                        v-if="formData.accountType != 'institution'"
                                        class="col-span-2"
                                    >
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.professionalCategoryLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <Select v-model="formData.professionalCategory">
                                            <SelectTrigger
                                                class="flex justify-between items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                                position="right"
                                            >
                                                <Users class="text-primary w-5 h-5" />
                                                <SelectValue
                                                    :placeholder="$t('register.professionalCategory')"
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
                                        v-if="showEducationLevel"
                                        class="col-span-2"
                                    >
                                        <label class="text-sm font-medium text-gray-700 mb-1 block">
                                            {{ $t('register.educationLevelLabel') }} <span class="text-primary">*</span>
                                        </label>
                                        <Select v-model="formData.educationLevel">
                                            <SelectTrigger
                                                class="flex justify-between items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                                position="right"
                                            >
                                                <GraduationCap class="text-primary w-5 h-5" />
                                                <SelectValue
                                                    :placeholder="$t('register.educationLevel')"
                                                    class="ml-3 block w-full"
                                                />
                                            </SelectTrigger>
                                            <SelectContent class="border border-none w-full">
                                                <SelectGroup>
                                                    <div
                                                        v-for="level in educationLevelOptions"
                                                        :key="level.value"
                                                        class="flex justify-center items-center -ms-3 w-full"
                                                    >
                                                        <SelectItem :value="level.value">
                                                            <div class="flex w-full">
                                                                <div class="sm:text-xs xl:text-sm">
                                                                    {{ level.label }}
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
                                    class="mt-6 pt-5 border-t border-dashed border-gray-200"
                                >
                                    <span class="mb-3 block text-xs font-bold uppercase tracking-wide text-gray-400">
                                        {{ $t('register.groupCheckbox') }}
                                    </span>
                                    <label class="flex items-start cursor-pointer">
                                        <Checkbox
                                            :checked="representGroup"
                                            class="mt-1"
                                            @update:checked="representGroup = $event"
                                        />
                                        <span class="text-sm ml-2 font-medium">
                                            {{ $t('register.groupCheckbox') }}
                                        </span>
                                    </label>

                                    <transition name="fade">
                                        <div
                                            v-if="representGroup"
                                            class="relative mt-3"
                                        >
                                            <InputIcon
                                                v-model="formData.groupName"
                                                :icon="Users"
                                                rounded="md"
                                                :placeholder="$t('register.groupName')"
                                            />
                                        </div>
                                    </transition>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <RegisterStepHeading
                                :number="6"
                                :title="$t('register.step6Title')"
                                :subtitle="$t('register.step6Subtitle')"
                            />
                            <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-3">
                                <label class="flex items-start cursor-pointer">
                                    <Checkbox
                                        :checked="termsAccepted"
                                        class="mt-1"
                                        @update:checked="termsAccepted = $event"
                                    />
                                    <span class="text-sm ml-2 font-medium">
                                        {{ $t('register.acceptTermsPrefix') }}
                                        <NuxtLink
                                            :to="localePath('/terms')"
                                            target="_blank"
                                            class="text-primary underline font-semibold hover:text-primary/80"
                                        >
                                            {{ $t('register.termsLinkLabel') }}
                                        </NuxtLink>
                                        <span class="text-primary">*</span>
                                    </span>
                                </label>
                                <label class="flex items-start cursor-pointer">
                                    <Checkbox
                                        :checked="privacyAccepted"
                                        class="mt-1"
                                        @update:checked="privacyAccepted = $event"
                                    />
                                    <span class="text-sm ml-2 font-medium">
                                        {{ $t('register.acceptPrivacyPrefix') }}
                                        <NuxtLink
                                            :to="localePath('/privacy-security')"
                                            target="_blank"
                                            class="text-primary underline font-semibold hover:text-primary/80"
                                        >
                                            {{ $t('register.privacyLinkLabel') }}
                                        </NuxtLink>
                                        <span class="text-primary">*</span>
                                    </span>
                                </label>
                                <label class="flex items-start cursor-pointer">
                                    <Checkbox
                                        :checked="charteAccepted"
                                        class="mt-1"
                                        @update:checked="charteAccepted = $event"
                                    />
                                    <span class="text-sm ml-2 font-medium">
                                        {{ $t('register.acceptChartePrefix') }}
                                        <NuxtLink
                                            to="/legal-chart"
                                            target="_blank"
                                            class="text-primary underline font-semibold hover:text-primary/80"
                                        >
                                            {{ $t('register.charteLinkLabel') }}
                                        </NuxtLink>
                                        <span class="text-primary">*</span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div class="flex justify-center items-center">
                            <Button
                                class="w-[70%] text-base font-bold"
                                type="submit"
                                :in-progress="inProgress"
                                :disabled="!canSubmit"
                            >
                                {{ $t('register.submit') }}
                            </Button>
                        </div>
                    </form>

                    <div class="text-sm text-center mt-10">
                        <span>{{ $t('register.hasAccount') }}</span>
                        <NuxtLink
                            :to="localePath('/login')"
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
                'lg:hidden min-h-screen w-screen flex flex-col relative overflow-x-hidden transition-colors duration-500',
                formData.accountType === 'institution' ? 'bg-primary institution-mode-mobile' : 'bg-white',
            )"
        >
            <LayoutsHeaderMobile />
            <BackButton :to="localePath('/login')" />

            <div class="grow flex flex-col items-center px-6 pb-8 overflow-y-auto">
                <div v-if="formData.accountType === 'standard'">
                    <h1 class="mt-2 mb-8 text-center">
                        <span class="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                            <span class="h-px w-3 bg-primary/35" />
                            {{ $t('register.welcome') }}
                            <span class="h-px w-3 bg-primary/35" />
                        </span>
                        <span class="mt-2 block font-secondary text-xl font-bold leading-tight text-gray-900">
                            {{ $t('register.tagline') }}
                        </span>
                        <svg
                            class="mx-auto mt-1.5 h-2.5 w-16 text-primary/80"
                            viewBox="0 0 96 12"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.4"
                            stroke-linecap="round"
                        >
                            <path d="M2 8c8-9 14 3 22-6s14 9 22 0 14-9 22 0 14 6 22-2" />
                        </svg>
                    </h1>
                </div>
                <NuxtLink
                    v-else
                    to="/institution/pricing"
                    class="w-full mt-12 mb-8 bg-primary rounded-3xl p-6 shadow-xl flex items-center justify-between group overflow-hidden relative"
                >
                    <div class="z-10">
                        <h3 class="text-white font-bold text-lg mb-1 leading-tight">Infiswap Institutional</h3>
                        <p class="text-white/80 text-sm">{{ $t('register.networkTaglineBe') }}</p>
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
                    <div
                        v-if="referrerDisplay"
                        class="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-gray-700"
                    >
                        {{ $t('register.referredBy') }}
                        <span class="font-semibold text-primary">{{ referrerDisplay }}</span>
                    </div>

                    <div class="relative space-y-4">
                        <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                        <RegisterStepHeading
                            :number="1"
                            :title="$t('register.step1Title')"
                            :subtitle="$t('register.step1Subtitle')"
                            :light="formData.accountType === 'institution'"
                        />
                        <div class="pl-12">
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
                                            'border-2 rounded-lg p-4 h-full flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm relative',
                                            formData.accountType === account.value
                                                ? (formData.accountType === 'institution' ? 'border-white bg-white/20 shadow-xl scale-105' : 'border-primary bg-primary/5 shadow-lg')
                                                : (formData.accountType === 'institution' ? 'border-white/30 bg-white/5 hover:border-white/50' : 'border-gray-300 hover:border-gray-400'),
                                        )"
                                    >
                                        <div class="relative w-full">
                                            <component
                                                :is="account.value === 'standard' ? CircleUser : Building2"
                                                :class="cn(
                                                    'w-5 h-5 mx-auto mb-2 transition-colors duration-300',
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
                                                'absolute top-0 right-3 translate-x-1/4 -translate-y-1/2 px-3 py-1 rounded-md text-[10px] font-black shadow-xl border transition-all duration-300 transform z-30',
                                                formData.accountType === 'institution' ? 'bg-white text-primary border-white animate-pulse scale-110' : 'bg-primary text-white border-primary/20',
                                            )"
                                        >
                                            {{ $t('register.institutionPrice') }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="formData.accountType == 'institution'"
                                class="col-span-2 relative w-full items-center mt-4"
                            >
                                <label :class="cn('text-sm font-medium', formData.accountType === 'institution' ? 'text-white' : 'text-gray-700')">
                                    {{ $t('register.institutionNameLabel') }} <span :class="formData.accountType === 'institution' ? 'text-white' : 'text-primary'">*</span>
                                </label>
                                <InputIcon
                                    v-model="formData.institutionName"
                                    :icon="Building2"
                                    size="md"
                                    rounded="md"
                                    :placeholder="$t('register.institutionName')"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="relative space-y-4">
                        <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                        <RegisterStepHeading
                            :number="2"
                            :title="$t('register.step2Title')"
                            :subtitle="$t('register.step2Subtitle')"
                            :light="formData.accountType === 'institution'"
                        />
                        <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div class="col-span-2 relative w-full items-center">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.lastnameLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.lastname"
                                        :icon="CircleUser"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.lastname')"
                                    />
                                </div>

                                <div class="col-span-2 relative w-full items-center">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.firstnameLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.firstname"
                                        :icon="CircleUser"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.firstname')"
                                    />
                                </div>

                                <div class="col-span-2 relative w-full items-center">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.emailLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.email"
                                        :icon="Mail"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.email')"
                                        autocomplete="off"
                                    />
                                </div>

                                <div class="col-span-2">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.phoneLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.phoneNumber"
                                        :icon="Phone"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.phone')"
                                    />
                                </div>

                                <div class="col-span-2">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.gender') }} <span class="text-xs font-normal text-muted-foreground">({{ $t('pricing.optional') }})</span>
                                    </label>
                                    <Select v-model="formData.gender">
                                        <SelectTrigger
                                            class="flex items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                            position="right"
                                        >
                                            <LayoutsAppImage
                                                src="/icons/gender.png"
                                                class="h-5"
                                            />
                                            <SelectValue
                                                :placeholder="$t('register.gender')"
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

                    <div class="relative space-y-4">
                        <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                        <RegisterStepHeading
                            :number="3"
                            :title="$t('register.step3Title')"
                            :subtitle="$t('register.step3Subtitle')"
                            :light="formData.accountType === 'institution'"
                        />
                        <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div class="col-span-2">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.passwordLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.password"
                                        :icon="Lock"
                                        size="md"
                                        rounded="md"
                                        type="password"
                                        :placeholder="$t('register.password')"
                                    />
                                </div>

                                <div class="col-span-2">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.passwordConfirmLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.passwordConfirmation"
                                        :icon="Lock"
                                        size="md"
                                        rounded="md"
                                        type="password"
                                        :placeholder="$t('register.passwordConfirm')"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="relative space-y-4">
                        <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                        <RegisterStepHeading
                            :number="4"
                            :title="$t('register.step4Title')"
                            :subtitle="$t('register.step4Subtitle')"
                            :light="formData.accountType === 'institution'"
                        />
                        <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div class="col-span-2">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.streetLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.address.street"
                                        :icon="MapPin"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.street')"
                                    />
                                </div>

                                <div class="col-span-2">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.zipCodeLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.address.zipCode"
                                        :icon="Inbox"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.zipCode')"
                                    />
                                </div>

                                <div class="col-span-2">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.cityLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.address.city"
                                        :icon="Building2"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.city')"
                                    />
                                </div>

                                <div class="col-span-2">
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.country') }} <span class="text-primary">*</span>
                                    </label>
                                    <Select v-model="formData.address.country">
                                        <SelectTrigger
                                            class="flex justify-between items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                            position="right"
                                        >
                                            <LayoutsAppImage
                                                src="/icons/flag.png"
                                                class="h-4 ml-2"
                                            />
                                            <SelectValue
                                                :placeholder="$t('register.country')"
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
                                        {{ $t('register.addressExtra') }} <span class="text-xs font-normal text-muted-foreground">({{ $t('pricing.optional') }})</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.address.additionalInformation"
                                        :icon="EllipsisHorizontalCircleIcon"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.addressExtra')"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="relative space-y-4">
                        <span class="pointer-events-none absolute left-[18px] top-9 bottom-0 w-0.5 bg-primary/25" />

                        <RegisterStepHeading
                            :number="5"
                            :title="$t('register.step5Title')"
                            :subtitle="$t('register.step5Subtitle')"
                            :light="formData.accountType === 'institution'"
                        />
                        <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div
                                    v-if="formData.accountType != 'institution'"
                                    class="col-span-2"
                                >
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.account') }} <span class="text-xs font-normal text-muted-foreground">({{ $t('pricing.optional') }})</span>
                                    </label>
                                    <Select v-model="formData.role">
                                        <SelectTrigger
                                            class="flex w-full space-x-4 text-sm justify-start items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary disabled:opacity-100 disabled:cursor-default"
                                            position="right"
                                        >
                                            <Users class="text-primary w-9 h-9 sm:w-7 sm:h-7" />
                                            <SelectValue
                                                :placeholder="$t('register.account')"
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
                                        {{ $t('register.language') }}
                                    </label>
                                    <Select v-model="formData.language">
                                        <SelectTrigger
                                            class="flex w-full space-x-4 text-sm justify-start items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                            position="right"
                                        >
                                            <SelectValue
                                                :placeholder="$t('register.language')"
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
                                                        <div class="flex items-center">
                                                            <LayoutsAppImage
                                                                :src="language.icon"
                                                                :alt="language.name"
                                                                class="xl:w-4 xl:h-3 sm:w-3 sm:h-2 my-auto mr-2"
                                                                format="png"
                                                            />
                                                            <span class="xl:text-sm sm:text-xs">{{ language.name }}</span>
                                                        </div>
                                                    </SelectItem>
                                                </div>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="col-span-2">
                                    <div class="text-sm font-medium text-gray-700 mb-4 block">
                                        {{ $t('register.searchCountries') }} <span class="text-primary">*</span>
                                        <span
                                            v-if="formData.address.workingAt.length === 0"
                                            class="text-gray-400 text-sm ml-2 font-light"
                                        >
                                            ({{ $t('register.workingAtHint') }})
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
                                        <span class="text-xs font-normal text-muted-foreground">({{ $t('pricing.optional') }})</span>
                                    </label>
                                    <InputIcon
                                        v-model="formData.identifierNumber"
                                        :icon="IdCard"
                                        size="md"
                                        rounded="md"
                                        :placeholder="identifierLabel"
                                    />
                                    <p
                                        v-if="isBelgiumCountryCode(formData.address.country)
                                            && formData.identifierNumber?.trim()
                                            && !isValidInamiFormat(formData.identifierNumber)"
                                        class="mt-1 text-xs text-destructive"
                                    >
                                        {{ INAMI_FORMAT_ERROR }}
                                    </p>
                                </div>
                                <div
                                    v-else
                                    class="col-span-2"
                                >
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.companyNumber') }}
                                    </label>
                                    <InputIcon
                                        v-model="formData.companyNumber"
                                        :icon="IdCard"
                                        size="md"
                                        rounded="md"
                                        :placeholder="$t('register.companyNumber')"
                                    />
                                </div>

                                <div
                                    v-if="formData.accountType != 'institution'"
                                    class="col-span-2"
                                >
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.professionalCategoryLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <Select v-model="formData.professionalCategory">
                                        <SelectTrigger
                                            class="flex justify-between items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                            position="right"
                                        >
                                            <Users class="text-primary w-5 h-5" />
                                            <SelectValue
                                                :placeholder="$t('register.professionalCategory')"
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
                                    v-if="showEducationLevel"
                                    class="col-span-2"
                                >
                                    <label class="text-sm font-medium text-gray-700 mb-1 block">
                                        {{ $t('register.educationLevelLabel') }} <span class="text-primary">*</span>
                                    </label>
                                    <Select v-model="formData.educationLevel">
                                        <SelectTrigger
                                            class="flex justify-between items-center rounded-md h-11 border-2 border-gray-300 transition-colors duration-150 hover:border-gray-400 focus:border-primary data-[state=open]:border-primary"
                                            position="right"
                                        >
                                            <GraduationCap class="text-primary w-5 h-5" />
                                            <SelectValue
                                                :placeholder="$t('register.educationLevel')"
                                                class="ml-3 block w-full"
                                            />
                                        </SelectTrigger>
                                        <SelectContent class="border border-none w-full">
                                            <SelectGroup>
                                                <div
                                                    v-for="level in educationLevelOptions"
                                                    :key="level.value"
                                                    class="flex justify-center items-center -ms-3 w-full"
                                                >
                                                    <SelectItem :value="level.value">
                                                        <div class="flex w-full">
                                                            <div class="sm:text-xs xl:text-sm">
                                                                {{ level.label }}
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
                                class="mt-6 pt-5 border-t border-dashed border-gray-200"
                            >
                                <label class="flex items-start cursor-pointer">
                                    <Checkbox
                                        :checked="representGroup"
                                        class="mt-1"
                                        @update:checked="representGroup = $event"
                                    />
                                    <span class="text-sm ml-2 font-medium">
                                        {{ $t('register.groupCheckbox') }}
                                    </span>
                                </label>

                                <transition name="fade">
                                    <div
                                        v-if="representGroup"
                                        class="relative mt-3"
                                    >
                                        <InputIcon
                                            v-model="formData.groupName"
                                            :icon="Users"
                                            rounded="md"
                                            :placeholder="$t('register.groupName')"
                                        />
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <RegisterStepHeading
                            :number="6"
                            :title="$t('register.step6Title')"
                            :subtitle="$t('register.step6Subtitle')"
                            :light="formData.accountType === 'institution'"
                        />
                        <div class="ml-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-3">
                            <label class="flex items-start cursor-pointer">
                                <Checkbox
                                    :checked="termsAccepted"
                                    class="mt-1"
                                    @update:checked="termsAccepted = $event"
                                />
                                <span class="text-sm ml-2 font-medium">
                                    {{ $t('register.acceptTermsPrefix') }}
                                    <NuxtLink
                                        :to="localePath('/terms')"
                                        target="_blank"
                                        class="text-primary underline font-semibold hover:text-primary/80"
                                    >
                                        {{ $t('register.termsLinkLabel') }}
                                    </NuxtLink>
                                    <span class="text-primary">*</span>
                                </span>
                            </label>
                            <label class="flex items-start cursor-pointer">
                                <Checkbox
                                    :checked="privacyAccepted"
                                    class="mt-1"
                                    @update:checked="privacyAccepted = $event"
                                />
                                <span class="text-sm ml-2 font-medium">
                                    {{ $t('register.acceptPrivacyPrefix') }}
                                    <NuxtLink
                                        :to="localePath('/privacy-security')"
                                        target="_blank"
                                        class="text-primary underline font-semibold hover:text-primary/80"
                                    >
                                        {{ $t('register.privacyLinkLabel') }}
                                    </NuxtLink>
                                    <span class="text-primary">*</span>
                                </span>
                            </label>
                            <label class="flex items-start cursor-pointer">
                                <Checkbox
                                    :checked="charteAccepted"
                                    class="mt-1"
                                    @update:checked="charteAccepted = $event"
                                />
                                <span class="text-sm ml-2 font-medium">
                                    {{ $t('register.acceptChartePrefix') }}
                                    <NuxtLink
                                        to="/legal-chart"
                                        target="_blank"
                                        class="text-primary underline font-semibold hover:text-primary/80"
                                    >
                                        {{ $t('register.charteLinkLabel') }}
                                    </NuxtLink>
                                    <span class="text-primary">*</span>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div class="flex justify-center mt-2 items-center">
                        <Button
                            :class="cn('w-full', formData.accountType === 'institution' ? 'bg-white text-primary hover:bg-white/80' : 'bg-primary text-white hover:bg-primary/80')"
                            type="submit"
                            :in-progress="inProgress"
                            :disabled="!canSubmit"
                        >
                            {{ $t('register.submit') }}
                        </Button>
                    </div>
                </form>

                <div class="text-sm text-center mt-8">
                    <span>{{ $t('register.hasAccount') }}</span>
                    <NuxtLink
                        :to="localePath('/login')"
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
import { ArrowRight, Building2, Check, CircleChevronDown, CircleUser, GraduationCap, IdCard, Inbox, Lock, Mail, MapPin, Phone, Users } from 'lucide-vue-next';
import { EDUCATION_LEVEL_OPTIONS, isBelgiumCountryCode } from '~/utils/educationLevel';
import { INAMI_FORMAT_ERROR, isValidInamiFormat } from '~/utils/inamiNumber';
import InstitutionPricing from '~/components/register/InstitutionPricing.vue';
import RegisterStepHeading from '~/components/register/StepHeading.vue';
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
import { isAppLocale } from '~/utils/appLocale';

const leftPanelScroll = ref<HTMLElement | null>(null);
const hasScrolledToBottom = ref(false);
const localePath = useLocalePath();
const { locale, t } = useI18n();

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
        label: t('register.nurse'),
        description: t('register.nurseDesc'),
    },
    {
        value: 'institution',
        label: t('register.institution'),
        description: t('register.institutionDesc'),
    },
];

const genders = [
    {
        value: 'M',
        label: t('register.male'),
        name: 'homme',
    },
    {
        value: 'F',
        label: t('register.female'),
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
    // {
    //     value: 'nl',
    //     label: 'Pays-Bas',
    //     name: 'paysBas',
    //     icon: '/icons/pays-bas.png',
    // },
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
        label: t('register.nurse'),
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
        label: t('register.employee'),
        value: 'salaried',
    },
    {
        label: t('register.independent'),
        value: 'independent',
    },
];

const educationLevelOptions = EDUCATION_LEVEL_OPTIONS;

const { country } = useCountry();

const representGroup = ref(false);
const charteAccepted = ref(false);
const termsAccepted = ref(false);
const privacyAccepted = ref(false);

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
    language: isAppLocale(locale.value) ? locale.value : LANGUAGES[0].value,
    phoneNumber: '',
    identifierNumber: '',

    address: {
        street: '',
        city: '',
        zipCode: '',
        country: countries[0].value,
        workingAt: country.value ? [country.value as 'Belgique' | 'France'] : [] as ('Belgique' | 'France')[],
        additionalInformation: '',
    },
    referralSource: '',
    zipCodesArray: [],
    citiesArray: [],
    professionalCategory: '',
    educationLevel: '' as '' | 'a1' | 'a2',
    radiusKm: '',
    groupName: '',
});

const showEducationLevel = computed(() => (
    formData.accountType !== 'institution'
    && formData.role === 'nurse'
    && isBelgiumCountryCode(formData.address.country)
));

watch(showEducationLevel, (visible) => {
    if (!visible) {
        formData.educationLevel = '';
    }
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

const canSubmit = computed(() => {
    if (!charteAccepted.value || !termsAccepted.value || !privacyAccepted.value) {
        return false;
    }

    if (!formData.lastname?.trim() || !formData.firstname?.trim() || !formData.email?.trim() || !formData.phoneNumber?.trim()) {
        return false;
    }

    if (!formData.password || formData.password.length < 8) {
        return false;
    }

    if (formData.password !== formData.passwordConfirmation) {
        return false;
    }

    if (!formData.address.street?.trim() || !formData.address.city?.trim() || !formData.address.zipCode?.trim()) {
        return false;
    }

    if (!formData.address.workingAt?.length) {
        return false;
    }

    if (formData.accountType === 'institution' && !formData.institutionName?.trim()) {
        return false;
    }

    if (formData.accountType !== 'institution' && !formData.professionalCategory) {
        return false;
    }

    if (showEducationLevel.value && !formData.educationLevel) {
        return false;
    }

    if (
        formData.accountType !== 'institution'
        && isBelgiumCountryCode(formData.address.country)
        && !isValidInamiFormat(formData.identifierNumber)
    ) {
        return false;
    }

    return true;
});

function trimOrNull(value: string | null | undefined): string | null {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
}

function buildRegistrationPayload() {
    return {
        ...formData,
        phoneNumber: trimOrNull(formData.phoneNumber),
        identifierNumber: trimOrNull(formData.identifierNumber),
        professionalCategory: formData.professionalCategory || null,
        educationLevel: formData.educationLevel || null,
        companyNumber: trimOrNull(formData.companyNumber),
        zipCodes: formData.zipCodesArray.join(', '),
        cities: formData.citiesArray.join(', '),
        charteAccepted: charteAccepted.value,
        termsAccepted: termsAccepted.value,
        privacyAccepted: privacyAccepted.value,
        referralCode: referralCode.value ?? undefined,
    };
}

const route = useRoute();
const { register } = useAuth();
const { referralCode, referrerDisplay, clearReferralRegistration } = useReferralRegistration();

const status = ref(
    (route.query.reset ?? '').length > 0 ? atob(route.query.reset as string) : '',
);

const { submit, inProgress } = useSubmit(
    async () => {
        status.value = '';
        const formDataForBackend = buildRegistrationPayload();

        if (
            formData.accountType !== 'institution'
            && isBelgiumCountryCode(formData.address.country)
            && !isValidInamiFormat(formData.identifierNumber)
        ) {
            throw new Error(INAMI_FORMAT_ERROR);
        }

        await register(formDataForBackend);
        clearReferralRegistration();
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
