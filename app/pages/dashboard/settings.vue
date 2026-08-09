<template>
    <div class="w-full mx-auto">
        <div class="flex items-center gap-2">
            <button
                type="button"
                class="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                :title="t('common.back')"
                @click="goBack"
            >
                <ArrowLeft class="size-4" />
            </button>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink as-child>
                            <NuxtLink
                                :to="localePath(dashboardRoute)"
                                class="flex items-center gap-1.5"
                            >
                                <LayoutGrid class="size-3.5" />
                                {{ t('nav.dashboard') }}
                            </NuxtLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{{ t('settings.title') }}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        <form class="mt-4 mb-12">
            <div class="rounded-lg border border-border bg-card p-4 sm:p-5">
                <div class="flex flex-wrap items-center gap-4">
                    <div
                        class="relative group/avatar shrink-0 cursor-pointer rounded-full"
                        role="button"
                        tabindex="0"
                        :aria-label="t('settings.editPhoto')"
                        @click="profileDialog = !profileDialog"
                        @keydown.enter="profileDialog = !profileDialog"
                    >
                        <ProfileLifetimeAccessBadge size="lg">
                            <ProfileInamiVerifiedBadge size="lg">
                                <img
                                    v-if="user.profile?.profil_url != null"
                                    :src="useRuntimeConfig().public.API_URL + '/storage/' + user.profile?.profil_url"
                                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                                >
                                <img
                                    v-else
                                    src="/images/icons/user-circle.png"
                                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-full opacity-60"
                                >
                            </ProfileInamiVerifiedBadge>
                        </ProfileLifetimeAccessBadge>
                        <span class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover/avatar:opacity-100">
                            <Camera class="size-5 text-white" />
                        </span>
                    </div>

                    <div class="min-w-0 flex-1">
                        <h1 class="font-secondary truncate text-xl font-semibold text-foreground sm:text-2xl">
                            {{ user.type == 'institution' ? (user.institution?.name || '-') : `${user.firstname} ${user.lastname}` }}
                        </h1>
                        <p class="truncate text-sm text-muted-foreground">
                            <template v-if="user.type == 'institution'">
                                {{ user.email }}
                            </template>
                            <template v-else>
                                {{ formattedCategory || t('settings.title') }}
                                <template v-if="user.profile?.city">
                                    · {{ user.profile.city }}
                                </template>
                            </template>
                        </p>
                    </div>

                    <LayoutsLogo class="hidden w-28 shrink-0 sm:block" />
                </div>

                <div
                    v-if="profileDialog"
                    class="mt-4 flex flex-col gap-3 border-t border-border pt-4"
                >
                    <FileUpload
                        accept="image/*"
                        @file-selected="profileFile = $event"
                    />
                    <div class="flex flex-wrap items-center gap-2">
                        <Button
                            :loading="profileUpload.loading"
                            @click="submit"
                        >
                            {{ t('settings.save') }}
                        </Button>
                        <Button
                            v-if="user.profile?.profil_url"
                            @click="deleteAvatarDialog = true"
                        >
                            <Trash2 class="size-4" />
                            {{ t('settings.confirmDelete') }}
                        </Button>
                        <Button
                            variant="ghost"
                            @click="profileDialog = false"
                        >
                            {{ t('common.cancel') }}
                        </Button>
                    </div>
                    <div
                        v-if="deleteAvatarDialog"
                        class="flex items-center gap-2 text-sm text-destructive"
                    >
                        <span>{{ t('settings.deletePhotoConfirm') }}</span>
                        <button
                            type="button"
                            class="font-medium underline"
                            @click="handleDeleteAvatar"
                        >
                            {{ t('common.confirm') }}
                        </button>
                        <button
                            type="button"
                            class="underline"
                            @click="deleteAvatarDialog = false"
                        >
                            {{ t('common.cancel') }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex flex-col gap-6 mt-12">
                <div class="space-y-6">
                    <section class="rounded-lg border border-border bg-card p-6">
                        <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                            <h3 class="flex items-center gap-3">
                                <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <IdCard class="size-5" />
                                </span>
                                <span class="text-lg font-secondary">{{ t('settings.generalInfo') }}</span>
                            </h3>
                            <Button
                                v-if="!personalInfoDialog"
                                variant="outline"
                                @click="personalInfoDialog = true"
                            >
                                <SquarePen class="size-4" />
                                {{ t('common.edit') }}
                            </Button>
                        </div>

                        <div
                            v-if="!personalInfoDialog"
                            class="mt-4 divide-y divide-border"
                        >
                            <div
                                v-if="user.type == 'institution'"
                                class="flex items-center justify-between gap-3 py-2.5"
                            >
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Building2 class="size-4" />
                                    {{ t('settings.institutionName') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ user.institution?.name || '-' }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <CircleUser class="size-4" />
                                    {{ t('settings.lastname') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ user.lastname }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <UserPlus class="size-4" />
                                    {{ t('settings.firstname') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ user.firstname }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Calendar class="size-4" />
                                    {{ t('settings.birthDate') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ formatStringDate(user.date_of_birth) !== '01/01/1970' ? formatStringDate(user.date_of_birth) : 'jj/mm/aaaa' }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Mail class="size-4" />
                                    {{ t('settings.email') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ user.email }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <span class="font-bold">N°</span>
                                    {{ identifierLabel }}
                                </span>
                                <span
                                    class="min-w-0 truncate text-sm font-medium"
                                    :class="{ 'text-muted-foreground': !hasRealIdentifierDisplay }"
                                >
                                    {{ identifierDisplayLabel }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Phone class="size-4" />
                                    {{ t('settings.phone') }}
                                </span>
                                <span
                                    class="min-w-0 truncate text-sm font-medium"
                                    :class="{ 'text-muted-foreground': !user?.phone_number }"
                                >
                                    {{ user?.phone_number || '00 32 2 374 XX XX' }}
                                </span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <VenusAndMars class="size-4" />
                                    {{ t('settings.gender') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ formattedGender || ' - ' }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Users class="size-4" />
                                    {{ t('settings.professionalCategory') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ formattedCategory || ' - ' }}</span>
                            </div>
                            <div
                                v-if="showEducationLevelSettings"
                                class="flex items-center justify-between gap-3 py-2.5"
                            >
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <GraduationCap class="size-4" />
                                    {{ t('settings.educationLevel') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ formattedEducationLevel || ' - ' }}</span>
                            </div>
                        </div>

                        <form
                            v-else
                            class="mt-4 space-y-4"
                            @submit.prevent="updateInfoUser"
                        >
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div
                                    v-if="user.type == 'institution'"
                                    class="flex flex-col gap-1.5 sm:col-span-2"
                                >
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.institutionName') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.institutionName)"
                                            :label="t('settings.institutionName')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <Building2 class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formPersonalInfo.institution.name"
                                            type="text"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.lastname') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.lastname)"
                                            :label="t('settings.lastname')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <CircleUser class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formPersonalInfo.lastname"
                                            type="text"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.firstname') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.firstname)"
                                            :label="t('settings.firstname')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <UserPlus class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formPersonalInfo.firstname"
                                            type="text"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.birthDate') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.dateOfBirth)"
                                            :label="t('settings.birthDate')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <Calendar class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formPersonalInfo.dateOfBirth"
                                            type="date"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.email') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.email)"
                                            :label="t('settings.email')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <Mail class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formPersonalInfo.email"
                                            type="email"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.identifierNumber', { label: identifierLabel }) }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.identifierNumber)"
                                            :label="t('settings.identifierNumber', { label: identifierLabel })"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <span class="text-sm font-bold text-primary">N°</span>
                                        <Input
                                            v-model="formPersonalInfo.identifierNumber"
                                            type="text"
                                            :placeholder="!formPersonalInfo.identifierNumber ? '19960116' : ''"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.phone') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.phoneNumber)"
                                            :label="t('settings.phone')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <Phone class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formPersonalInfo.phoneNumber"
                                            type="text"
                                            :placeholder="!formPersonalInfo.phoneNumber ? '00 32 2 374 XX XX' : ''"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.gender') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.gender)"
                                            :label="t('settings.gender')"
                                        />
                                    </label>
                                    <Select v-model="formPersonalInfo.gender">
                                        <SelectTrigger class="h-11 w-full rounded-md border border-input">
                                            <VenusAndMars class="size-4 shrink-0 text-primary" />
                                            <SelectValue :value="formPersonalInfo.gender" />
                                        </SelectTrigger>
                                        <SelectContent>
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

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.professionalCategory') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.professionalCategory)"
                                            :label="t('settings.professionalCategory')"
                                        />
                                    </label>
                                    <Select v-model="formPersonalInfo.professionalCategory">
                                        <SelectTrigger class="h-11 w-full rounded-md border border-input">
                                            <Users class="size-4 shrink-0 text-primary" />
                                            <SelectValue :value="formPersonalInfo.professionalCategory" />
                                        </SelectTrigger>
                                        <SelectContent>
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

                                <div
                                    v-if="showEducationLevelSettings"
                                    class="flex flex-col gap-1.5 sm:col-span-2"
                                >
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.educationLevel') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.educationLevel)"
                                            :label="t('settings.educationLevel')"
                                        />
                                    </label>
                                    <Select v-model="formPersonalInfo.educationLevel">
                                        <SelectTrigger class="h-11 w-full rounded-md border border-input">
                                            <GraduationCap class="size-4 shrink-0 text-primary" />
                                            <SelectValue :value="formPersonalInfo.educationLevel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                v-for="level in educationLevelOptions"
                                                :key="level.value"
                                                :value="level.value"
                                            >
                                                {{ level.label }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div class="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    @click="personalInfoDialog = false"
                                >
                                    {{ t('common.cancel') }}
                                </Button>
                                <Button type="submit">
                                    Enregistrer
                                </Button>
                            </div>
                        </form>
                    </section>

                    <section
                        v-if="user.type != 'institution'"
                        class="rounded-lg border border-border bg-card p-6"
                    >
                        <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                            <h3 class="flex items-center gap-3">
                                <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <MapPin class="size-5" />
                                </span>
                                <span class="text-lg font-secondary">{{ t('settings.address') }}</span>
                            </h3>
                            <Button
                                v-if="!addressInfoDialog"
                                variant="outline"
                                @click="addressInfoDialog = true"
                            >
                                <SquarePen class="size-4" />
                                {{ t('common.edit') }}
                            </Button>
                        </div>

                        <!-- Vue lecture -->
                        <div
                            v-if="!addressInfoDialog"
                            class="mt-4 divide-y divide-border"
                        >
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Map class="size-4" />
                                    {{ t('settings.street') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ user.profile?.street_address || ' - ' }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Building2 class="size-4" />
                                    {{ t('settings.city') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ user.profile?.city || ' - ' }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Flag class="size-4" />
                                    {{ t('settings.country') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ formattedCountry || ' - ' }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Building2 class="size-4" />
                                    {{ t('settings.workCountry') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ user.profile?.working_at || ' - ' }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Mailbox class="size-4" />
                                    {{ t('settings.zipCode') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ user.profile?.zip_code || ' - ' }}</span>
                            </div>
                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <CircleEllipsis class="size-4" />
                                    {{ t('settings.extra') }}
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium">{{ user.additional_info || ' - ' }}</span>
                            </div>
                        </div>

                        <!-- Édition en ligne (remplace le Dialog) -->
                        <form
                            v-else
                            class="mt-4 space-y-4"
                            @submit.prevent="handleUpdateAddress"
                        >
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="flex flex-col gap-1.5 sm:col-span-2">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.street') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.street)"
                                            :label="t('settings.street')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <Map class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formAddress.streetAddress"
                                            type="text"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.zipCode') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.zipCode)"
                                            :label="t('settings.zipCode')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <Mailbox class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formAddress.zipCode"
                                            type="text"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.city') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.city)"
                                            :label="t('settings.city')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <Building2 class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formAddress.city"
                                            type="text"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.country') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.country)"
                                            :label="t('settings.country')"
                                        />
                                    </label>
                                    <Select v-model="formAddress.country">
                                        <SelectTrigger class="h-11 w-full rounded-md border border-input">
                                            <Flag class="size-4 shrink-0 text-primary" />
                                            <SelectValue :value="formAddress.country" />
                                        </SelectTrigger>
                                        <SelectContent>
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

                                <div class="flex flex-col gap-1.5">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.workCountry') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.workingAt)"
                                            :label="t('settings.workCountry')"
                                        />
                                    </label>
                                    <Select v-model="formAddress.workingAt">
                                        <SelectTrigger class="h-11 w-full rounded-md border border-input">
                                            <Building2 class="size-4 shrink-0 text-primary" />
                                            <SelectValue :value="formAddress.workingAt" />
                                        </SelectTrigger>
                                        <SelectContent>
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

                                <div class="flex flex-col gap-1.5 sm:col-span-2">
                                    <label class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        {{ t('settings.extra') }}
                                        <SettingsFieldHint
                                            :text="t(SETTINGS_TOOLTIPS.additionalInfo)"
                                            :label="t('settings.extra')"
                                        />
                                    </label>
                                    <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                        <CircleEllipsis class="size-4 shrink-0 text-primary" />
                                        <Input
                                            v-model="formAddress.additionalInfo"
                                            type="text"
                                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    @click="addressInfoDialog = false"
                                >
                                    {{ t('common.cancel') }}
                                </Button>
                                <Button type="submit">
                                    Enregistrer
                                </Button>
                            </div>
                        </form>
                    </section>
                </div>

                <div class="space-y-6">
                    <section
                        v-if="user.type == 'institution'"
                        class="shadow rounded-lg p-6 mb-6"
                    >
                        <div class="flex justify-between items-center">
                            <h3 class="flex items-center space-x-4">
                                <MapPin class="w-6 text-gray-400" />
                                <span class="text-lg font-secondary">{{ t('settings.address') }}</span>
                            </h3>

                            <SquarePen
                                class="w-5 text-black/50 hover:text-primary cursor-pointer"
                                @click="addressInfoDialog = true"
                            />

                            <Dialog v-model:open="addressInfoDialog">
                                <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle class="text-center">
                                            {{ t('settings.updateTitle') }}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        {{ t('settings.updateAddressDesc') }}
                                    </DialogDescription>

                                    <form class="mt-4 space-y-3">
                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ t('settings.street') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="t(SETTINGS_TOOLTIPS.street)"
                                                    :label="t('settings.street')"
                                                />
                                            </p>
                                            <Input
                                                v-model="formAddress.streetAddress"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ t('settings.city') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="t(SETTINGS_TOOLTIPS.city)"
                                                    :label="t('settings.city')"
                                                />
                                            </p>
                                            <Input
                                                v-model="formAddress.city"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ t('settings.country') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="t(SETTINGS_TOOLTIPS.country)"
                                                    :label="t('settings.country')"
                                                />
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
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ t('settings.workCountry') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="t(SETTINGS_TOOLTIPS.workingAt)"
                                                    :label="t('settings.workCountry')"
                                                />
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
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ t('settings.zipCode') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="t(SETTINGS_TOOLTIPS.zipCode)"
                                                    :label="t('settings.zipCode')"
                                                />
                                            </p>
                                            <Input
                                                v-model="formAddress.zipCode"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ t('settings.extra') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="t(SETTINGS_TOOLTIPS.additionalInfo)"
                                                    :label="t('settings.extra')"
                                                />
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
                                                {{ t('common.cancel') }}
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
                                        <Map class="w-5" />
                                        <span>{{ t('settings.street') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="t(SETTINGS_TOOLTIPS.street)"
                                            :label="t('settings.street')"
                                        />
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
                                        <Building2 class="w-5" />
                                        <span>{{ t('settings.city') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="t(SETTINGS_TOOLTIPS.city)"
                                            :label="t('settings.city')"
                                        />
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
                                        <span>{{ t('settings.country') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="t(SETTINGS_TOOLTIPS.country)"
                                            :label="t('settings.country')"
                                        />
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
                                        <Building2 class="w-5" />
                                        <span>{{ t('settings.workCountry') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="t(SETTINGS_TOOLTIPS.workingAt)"
                                            :label="t('settings.workCountry')"
                                        />
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
                                        <span>{{ t('settings.zipCode') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="t(SETTINGS_TOOLTIPS.zipCode)"
                                            :label="t('settings.zipCode')"
                                        />
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
                                        <span>{{ t('settings.extra') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="t(SETTINGS_TOOLTIPS.additionalInfo)"
                                            :label="t('settings.extra')"
                                        />
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.additional_info || ' - ' }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section class="rounded-lg border border-border bg-card p-6">
                        <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                            <h3 class="flex items-center gap-3">
                                <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <ShieldCheck class="size-5" />
                                </span>
                                <span class="text-lg font-secondary">{{ t('settings.security') }}</span>
                            </h3>
                            <Button
                                v-if="!changePasswordDialog"
                                variant="outline"
                                @click="changePasswordDialog = true"
                            >
                                <KeyRound class="size-4" />
                                {{ t('settings.changePassword') }}
                            </Button>
                        </div>

                        <div class="mt-4">
                            <div
                                v-if="!changePasswordDialog"
                                class="flex items-center justify-between gap-3 py-2.5"
                            >
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <KeyRound class="size-4" />
                                    {{ t('settings.password') }}
                                    <SettingsFieldHint
                                        :text="t(SETTINGS_TOOLTIPS.password)"
                                        :label="t('settings.password')"
                                    />
                                </span>
                                <span class="min-w-0 truncate text-sm font-medium text-muted-foreground">••••••••••</span>
                            </div>

                            <!-- Édition en ligne (remplace le Dialog) -->
                            <form
                                v-else
                                class="space-y-4 border-b border-border pb-5"
                                @submit.prevent="handleChangePassword"
                            >
                                <p class="text-sm text-muted-foreground">
                                    {{ t('settings.changePasswordDesc') }}
                                </p>
                                <div class="grid gap-4 sm:grid-cols-3">
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-medium text-muted-foreground">{{ t('settings.currentPassword') }}</label>
                                        <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                            <KeyRound class="size-4 shrink-0 text-primary" />
                                            <Input
                                                v-model="formPassword.currentPassword"
                                                type="password"
                                                class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                            />
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-medium text-muted-foreground">{{ t('auth.newPasswordLabel') }}</label>
                                        <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                            <KeyRound class="size-4 shrink-0 text-primary" />
                                            <Input
                                                v-model="formPassword.password"
                                                type="password"
                                                class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                            />
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-medium text-muted-foreground">{{ t('auth.confirmNewPassword') }}</label>
                                        <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                            <KeyRound class="size-4 shrink-0 text-primary" />
                                            <Input
                                                v-model="formPassword.password_confirmation"
                                                type="password"
                                                class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-wrap justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        @click="changePasswordDialog = false"
                                    >
                                        {{ t('common.cancel') }}
                                    </Button>
                                    <Button type="submit">
                                        Enregistrer
                                    </Button>
                                </div>
                            </form>

                            <div class="flex items-center justify-between gap-3 py-2.5">
                                <span class="flex shrink-0 items-center gap-2.5 text-sm text-muted-foreground">
                                    <Smartphone class="size-4" />
                                    {{ t('settings.twoFactor') }}
                                    <SettingsFieldHint
                                        :text="t(SETTINGS_TOOLTIPS.twoFactor)"
                                        :label="t('settings.twoFactor')"
                                    />
                                </span>
                                <Switch
                                    id="authTwoFactor"
                                    v-model:checked="enableTwoFactor"
                                    @update:checked="handleEnableAuth2Fa"
                                />

                                <Dialog v-model:open="twoFactorDialog">
                                    <DialogContent class="sm:max-w-160">
                                        <DialogHeader>
                                            <DialogTitle>{{ t('settings.twoFactor') }}</DialogTitle>
                                        </DialogHeader>
                                        <div class="text-center mx-12 mt-8">
                                            {{ t('settings.twoFactorActivationDescBefore') }}
                                            <span class="font-semibold text-primary">{{ user.email }}</span>{{ t('settings.twoFactorActivationDescAfter') }}
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
                                                {{ t('common.cancel') }}
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
                                                {{ t('settings.twoFactor') }}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div class="mt-8">
                                            {{ t('settings.confirmActionPassword') }}
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
                                                    {{ t('common.cancel') }}
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
                        class="rounded-lg border border-border bg-card p-6"
                    >
                        <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                            <h3 class="flex items-center gap-3">
                                <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                    <Wrench class="size-5" />
                                </span>
                                <span class="text-lg font-secondary">{{ t('settings.preferences') }}</span>
                            </h3>

                            <Button
                                variant="outline"
                                @click="proposalDialog = true"
                            >
                                <Sparkles class="size-4" />
                                {{ t('settings.aiBoost') }}
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

                        <div class="mt-8">
                            <div class="flex flex-col gap-1.5">
                                <label
                                    for="language"
                                    class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                                >
                                    {{ t('common.language') }}
                                    <SettingsFieldHint
                                        :text="t('settings.languageTooltip')"
                                        :label="t('common.language')"
                                    />
                                </label>
                                <Select
                                    v-model="formSetting"
                                    @update:model-value="handleChangeLanguage"
                                >
                                    <SelectTrigger class="h-11 w-full max-w-xs rounded-md border border-input">
                                        <Languages class="size-4 shrink-0 text-primary" />
                                        <SelectValue :placeholder="languages[formSetting]" />
                                    </SelectTrigger>

                                    <SelectContent>
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
                        class="rounded-lg border border-border bg-card p-6"
                    >
                        <h3 class="flex items-center gap-3">
                            <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <BellRing class="size-5" />
                            </span>
                            <span class="text-lg font-secondary">{{ t('settings.notification') }}</span>
                        </h3>

                        <div class="mt-4 divide-y divide-border">
                            <div class="flex items-center justify-between gap-3 py-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="newReplacement">{{ t('settings.newReplacementNotif') }}</Label>
                                    <SettingsFieldHint
                                        :text="t(SETTINGS_TOOLTIPS.newReplacement)"
                                        :label="t('settings.newReplacementNotif')"
                                    />
                                </div>
                                <Switch
                                    id="newReplacement"
                                    v-model:checked="notifNewReplacement"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                            <div class="flex items-center justify-between gap-3 py-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="acceptReplacement">{{ t('settings.acceptedReplacementNotif') }}</Label>
                                    <SettingsFieldHint
                                        :text="t(SETTINGS_TOOLTIPS.replacementAccepted)"
                                        :label="t('settings.acceptedReplacementNotif')"
                                    />
                                </div>
                                <Switch
                                    id="acceptReplacement"
                                    v-model:checked="notifAcceptReplacement"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                            <div class="flex items-center justify-between gap-3 py-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="digestWeekly">{{ t('settings.weeklyDigest') }}</Label>
                                    <SettingsFieldHint
                                        :text="t(SETTINGS_TOOLTIPS.digestWeekly)"
                                        :label="t('settings.weeklyDigest')"
                                    />
                                </div>
                                <Switch
                                    id="digestWeekly"
                                    v-model:checked="notifDigestWeekly"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                            <div class="flex items-center justify-between gap-3 py-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="marketingEmails">{{ t('settings.marketingEmails') }}</Label>
                                    <SettingsFieldHint
                                        :text="t(SETTINGS_TOOLTIPS.marketingEmails)"
                                        :label="t('settings.marketingEmails')"
                                    />
                                </div>
                                <Switch
                                    id="marketingEmails"
                                    v-model:checked="notifMarketingEmails"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                            <div class="flex items-center justify-between gap-3 py-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="urgentOnly">{{ t('settings.urgencyOnly') }}</Label>
                                    <SettingsFieldHint
                                        :text="t(SETTINGS_TOOLTIPS.urgentOnly)"
                                        :label="t('settings.urgencyOnly')"
                                    />
                                </div>
                                <Switch
                                    id="urgentOnly"
                                    v-model:checked="notifUrgentOnly"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                            <div class="flex items-center justify-between gap-3 py-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="smsUrgent">{{ t('settings.smsUrgency') }}</Label>
                                    <SettingsFieldHint
                                        :text="t(SETTINGS_TOOLTIPS.smsUrgent)"
                                        :label="t('settings.smsUrgency')"
                                    />
                                </div>
                                <Switch
                                    id="smsUrgent"
                                    v-model:checked="notifSmsUrgent"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                        </div>
                    </section>

                    <section class="rounded-lg border border-border bg-card p-6 space-y-4">
                        <h3 class="flex items-center gap-3">
                            <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-amber-400/15 text-amber-600">
                                <Crown class="size-5" />
                            </span>
                            <span class="text-lg font-secondary">Abonnement Infiswap Pro</span>
                        </h3>
                        <p class="text-sm text-muted-foreground">
                            <template v-if="isProSubscriber">
                                Votre abonnement est actif. Factures, moyen de paiement et résiliation
                                se gèrent depuis le portail sécurisé Stripe.
                            </template>
                            <template v-else>
                                Alertes instantanées, un boost offert par mois et contrats inclus.
                                Le reste du réseau demeure gratuit.
                            </template>
                        </p>
                        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <Button
                                v-if="isProSubscriber"
                                type="button"
                                :disabled="proLoading"
                                @click="openBillingPortal"
                            >
                                Gérer mon abonnement
                            </Button>
                            <Button
                                v-else
                                type="button"
                                variant="outline"
                                @click="navigateTo('/dashboard/subscriptions')"
                            >
                                Découvrir Infiswap Pro
                            </Button>
                        </div>
                    </section>

                    <section class="rounded-lg border border-border bg-card p-6 space-y-4">
                        <h3 class="flex items-center gap-3">
                            <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <ShieldCheck class="size-5" />
                            </span>
                            <span class="text-lg font-secondary">{{ t('settings.personalData') }}</span>
                        </h3>
                        <p class="text-sm text-muted-foreground">
                            {{ t('settings.personalDataDesc') }}
                        </p>
                        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                @click="openCookiePreferences"
                            >
                                <Cookie class="size-4" />
                                {{ t('settings.manageCookies') }}
                            </Button>
                            <Button
                                type="button"
                                :in-progress="isExportingData"
                                :disabled="isExportingData"
                                @click="exportPersonalData"
                            >
                                <Download class="size-4" />
                                {{ t('settings.exportData') }}
                            </Button>
                        </div>
                    </section>

                    <section>
                        <DeleteAccountSection />
                    </section>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, BellRing, Building2, Calendar, Camera, CircleEllipsis, CircleUser, Cookie, Crown, Download, Flag, GraduationCap, IdCard, KeyRound, Languages, LayoutGrid, Mail, Mailbox, Map, MapPin, Phone, ShieldCheck, Smartphone, Sparkles, SquarePen, Trash2, UserPlus, Users, VenusAndMars, Wrench } from 'lucide-vue-next';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getErrorMessage, goBack } from '~/lib/utils';
import { useRuntimeConfig } from '#app';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import InputPreferences from '@/components/InputPreferences.vue';
import DeleteAccountSection from '@/components/account/DeleteAccountSection.vue';
import { useAuth } from '~/composables/useAuth';
import { useSubmit } from '~/composables/useSubmit';
import FileUpload from '~/components/ui/form/FileUpload.vue';
import type { User, UserSettings } from '~/lib/types';
import { SETTINGS_TOOLTIPS } from '~/utils/settingsTooltips';
import { EDUCATION_LEVEL_OPTIONS, educationLevelLabel, hasRealIdentifier, isBelgiumProfile, type EducationLevelValue } from '~/utils/educationLevel';
import { INAMI_FORMAT_ERROR, isValidInamiFormat } from '~/utils/inamiNumber';

const { t } = useI18n();
const { $toast, $apifetch } = useNuxtApp();
const { openPreferences: openCookiePreferences } = useCookieConsent();

const {
    updateUser,
    updateAddressUser,
    updatePasswordUser,
    updateAvatarUser,
    activeTwoFactorAuth,
    verifyCode,
    deleteAvatar,
} = useAuth();
const { createPreferences, createNotifPreferences } = useAuth();

const {
    isPremium: isProSubscriber,
    loading: proLoading,
    openBillingPortal,
} = useProSubscription();

const isExportingData = ref(false);

async function exportPersonalData() {
    if (!user.value?.id || isExportingData.value) {
        return;
    }

    isExportingData.value = true;
    try {
        const response = await $apifetch<{ data: Record<string, unknown> }>(
            `/api/users/${user.value.id}/data-export`,
        );
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `infiswap-data-export-${user.value.id}.json`;
        link.click();
        URL.revokeObjectURL(url);
        $toast({ description: t('settings.exportDownloaded') });
    }
    catch (error) {
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
    }
    finally {
        isExportingData.value = false;
    }
}

const user = useState<User>('user');
const localePath = useLocalePath();
const dashboardRoute = computed(() => (user.value.type === 'institution' ? '/dashboard/institution' : '/dashboard'));
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
            return t('register.female');
        case 'M':
            return t('register.male');
        case 'X':
            return 'X';
        default:
            return '';
    }
});

const formattedCategory = computed(() => {
    switch (user.value.professional_category) {
        case 'salaried':
            return t('register.employee');
        case 'independent':
            return t('register.independent');
        default:
            return '';
    }
});

const educationLevelOptions = EDUCATION_LEVEL_OPTIONS;

const showEducationLevelSettings = computed(() => (
    user.value?.roles?.includes('nurse')
    && isBelgiumProfile({
        country: user.value?.country ?? user.value?.profile?.country,
        working_at: user.value?.profile?.working_at,
        profile: user.value?.profile,
    })
));

const formattedEducationLevel = computed(() => (
    educationLevelLabel(user.value?.education_level) ?? ''
));

const hasRealIdentifierDisplay = computed(() => hasRealIdentifier(user.value));

const identifierDisplayLabel = computed(() => {
    if (user.value?.identifier_unavailable || !hasRealIdentifierDisplay.value) {
        return t('settings.identifierNotProvided', { label: identifierLabel.value });
    }
    return user.value?.identifier_number || t('settings.identifierNotProvided', { label: identifierLabel.value });
});

const formattedCountry = computed(() => {
    if (user.value.profile && user.value.profile.country && user.value.profile?.country == 'be') {
        return t('home.map.countryBe');
    }

    return t('home.map.countryFr');
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
        name: user.value.institution?.name ?? '',
    },
    lastname: user.value.lastname,
    firstname: user.value.firstname,
    dateOfBirth: formatDate(user.value.date_of_birth),
    email: user.value.email,
    identifierNumber: user.value.identifier_number,
    phoneNumber: user.value.phone_number,
    gender: user.value.gender,
    professionalCategory: user.value.professional_category,
    educationLevel: (user.value.education_level ?? '') as EducationLevelValue | '',
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
        if (
            isBelgiumProfile({
                country: user.value?.country ?? user.value?.profile?.country ?? formAddress.country,
                working_at: user.value?.profile?.working_at ?? formAddress.workingAt,
                profile: user.value?.profile,
            })
            && !isValidInamiFormat(formPersonalInfo.identifierNumber)
        ) {
            $toast({
                title: 'Erreur',
                description: INAMI_FORMAT_ERROR,
                variant: 'destructive',
            });
            return;
        }

        const response = await updateUser({
            ...formPersonalInfo,
            educationLevel: formPersonalInfo.educationLevel || null,
        });

        if (response?.user) {
            user.value = {
                ...user.value,
                ...response.user,
            };
            formPersonalInfo.identifierNumber = response.user.identifier_number ?? '';
            formPersonalInfo.educationLevel = response.user.education_level ?? '';
        }
        else {
            user.value = {
                ...user.value,
                lastname: formPersonalInfo.lastname,
                firstname: formPersonalInfo.firstname,
                date_of_birth: formPersonalInfo.dateOfBirth,
                email: formPersonalInfo.email,
                identifier_number: formPersonalInfo.identifierNumber || null,
                phone_number: formPersonalInfo.phoneNumber,
                gender: formPersonalInfo.gender,
                professional_category: formPersonalInfo.professionalCategory,
                education_level: formPersonalInfo.educationLevel || null,
                education_level_label: educationLevelLabel(formPersonalInfo.educationLevel),
                has_real_identifier: Boolean(formPersonalInfo.identifierNumber),
            };
        }

        $toast({
            description: t('settings.updateSuccess'),
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
            if (user.value.profile) {
                user.value.profile = {
                    ...user.value.profile,
                    street_address: formAddress.streetAddress,
                    city: formAddress.city,
                    country: formAddress.country,
                    zip_code: formAddress.zipCode,
                    additional_info: formAddress.additionalInfo,
                    working_at: formAddress.workingAt,
                };
            }

            $toast({
                description: t('settings.updateSuccess'),
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

const languages = computed(() => ({
    fr: t('common.french'),
    nl: t('common.dutch'),
}));

const handleChangeLanguage = async () => {
    const formData = reactive({
        key: 'language',
        value: formSetting.value,
    });
    await createPreferences(formData);

    const { applyLocale } = useAppLocale();
    const switchLocalePath = useSwitchLocalePath();
    if (formSetting.value === 'fr' || formSetting.value === 'nl') {
        await applyLocale(formSetting.value, { persistSettings: false });
        await navigateTo(switchLocalePath(formSetting.value));
    }
};

const handleChangePassword = async () => {
    try {
        await updatePasswordUser(formPassword);
        $toast({
            description: t('settings.updateSuccess'),
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
const notifDigestWeekly = ref(setting.notification?.digest_weekly ?? false);
const notifMarketingEmails = ref(setting.notification?.marketing_emails ?? false);
const notifUrgentOnly = ref(setting.notification?.urgent_only ?? false);
const notifSmsUrgent = ref(setting.notification?.sms_urgent ?? false);

const handleChangeNotif = async () => {
    try {
        const formData = reactive({
            key: 'notification',
            value: {
                new_replacement: notifNewReplacement.value,
                replacement_accepted: notifAcceptReplacement.value,
                digest_weekly: notifDigestWeekly.value,
                marketing_emails: notifMarketingEmails.value,
                urgent_only: notifUrgentOnly.value,
                sms_urgent: notifSmsUrgent.value,
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
                description: t('settings.selectImage'),
                variant: 'destructive',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('profil_url', profileFile.value);

            const response = await updateAvatarUser(formData);

            if (user.value.profile) {
                user.value.profile = {
                    ...user.value.profile,
                    profil_url: response.user.profile.profil_url,
                };
            }

            $toast({
                description: t('settings.photoUpdated'),
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

        if (user.value.profile) {
            user.value.profile = {
                ...user.value.profile,
                profil_url: null,
            };
        }

        $toast({
            description: t('settings.photoDeleted'),
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
            description: `${t('settings.twoFactor')} ${t('settings.disabled').toLowerCase()}`,
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
            description: `${t('settings.twoFactor')} ${t('settings.enabled').toLowerCase()}`,
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

const genders = computed(() => ({
    M: t('register.male'),
    F: t('register.female'),
    X: 'X',
}));

const countries = computed(() => ({
    be: t('home.map.countryBe'),
    fr: t('home.map.countryFr'),
}));

const professionalCategory = computed(() => ({
    salaried: t('register.employee'),
    independent: t('register.independent'),
}));

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
    title: t('settings.title'),
});
</script>
