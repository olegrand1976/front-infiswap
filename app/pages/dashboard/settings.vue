<template>
    <div class="lg:ml-20 xl:ml-0">
        <ArrowLeft
            class="size-6 cursor-pointer hover:text-primary mt-4"
            :title="$t('common.back')"
            @click="goBack"
        />

        <div class="mt-6 bg-gray-100 flex flex-col space-y-4 sm:space-y-0 sm:flex-row py-4 sm:py-0 px-4 rounded-lg items-center sm:h-12">
            <h1 class="text-primary">
                {{ $t('settings.title') }}
            </h1>
        </div>

        <form class="mt-6 mb-12">
            <div class="flex justify-center sm:justify-start space-x-4 items-center sm:w-96 h-20 sm:h-28 px-1 py-2 rounded-full border border-gray-300">
                <ProfileLifetimeAccessBadge size="lg">
                    <ProfileInamiVerifiedBadge size="lg">
                        <div class="relative">
                            <SquarePen
                                class="w-5 text-gray-600 absolute -top-1 -right-2 sm:-right-1 cursor-pointer"
                                @click="profileDialog = true"
                            />
                            <Trash2
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
                    </ProfileInamiVerifiedBadge>
                </ProfileLifetimeAccessBadge>

                <Dialog v-model:open="profileDialog">
                    <DialogContent class="sm:max-w-160">
                        <DialogHeader>
                            <DialogTitle>{{ $t('settings.editPhoto') }}</DialogTitle>
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
                                {{ $t('settings.save') }}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog v-model:open="deleteAvatarDialog">
                    <DialogContent class="sm:max-w-md h-52">
                        <DialogHeader>
                            <DialogTitle>{{ $t('settings.confirmDelete') }}</DialogTitle>
                            <DialogDescription>
                                {{ $t('settings.deletePhotoConfirm') }}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="gap-4 sm:gap-4">
                            <Button
                                variant="outline"
                                @click="deleteAvatarDialog = false"
                            >
                                {{ $t('common.cancel') }}
                            </Button>
                            <Button
                                @click="handleDeleteAvatar"
                            >
                                {{ $t('common.confirm') }}
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
                                <IdCard class="w-6 text-gray-400" />
                                <span class="text-lg">{{ $t('settings.generalInfo') }}</span>
                            </h3>

                            <SquarePen
                                class="w-5 text-black/60 hover:text-primary cursor-pointer"
                                @click="personalInfoDialog = true"
                            />

                            <Dialog v-model:open="personalInfoDialog">
                                <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle class="text-center">
                                            {{ $t('settings.updateTitle') }}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        {{ $t('settings.updatePersonalDesc') }}
                                    </DialogDescription>

                                    <form class="mt-4 space-y-3">
                                        <div
                                            v-if="user.type == 'institution'"
                                            class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                        >
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.institutionName') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.institutionName)"
                                                    :label="$t('settings.institutionName')"
                                                />
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.institution.name"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.lastname') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.lastname)"
                                                    :label="$t('settings.lastname')"
                                                />
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.lastname"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.firstname') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.firstname)"
                                                    :label="$t('settings.firstname')"
                                                />
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.firstname"
                                                type="text"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.birthDate') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.dateOfBirth)"
                                                    :label="$t('settings.birthDate')"
                                                />
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.dateOfBirth"
                                                type="date"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary w-full truncate sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.email') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.email)"
                                                    :label="$t('settings.email')"
                                                />
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.email"
                                                type="email"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.identifierNumber', { label: identifierLabel }) }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.identifierNumber)"
                                                    :label="$t('settings.identifierNumber', { label: identifierLabel })"
                                                />
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.identifierNumber"
                                                type="text"
                                                :placeholder="!formPersonalInfo.identifierNumber ? '19960116' : ''"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-gray-400 h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.phone') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.phoneNumber)"
                                                    :label="$t('settings.phone')"
                                                />
                                            </p>
                                            <Input
                                                v-model="formPersonalInfo.phoneNumber"
                                                type="text"
                                                :placeholder="!formPersonalInfo.phoneNumber ? '00 32 2 374 XX XX' : ''"
                                                class="w-full sm:w-auto sm:bg-transparent placeholder:text-gray-400 h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                                            />
                                        </div>

                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.gender') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.gender)"
                                                    :label="$t('settings.gender')"
                                                />
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
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.professionalCategory') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.professionalCategory)"
                                                    :label="$t('settings.professionalCategory')"
                                                />
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

                                        <div
                                            v-if="showEducationLevelSettings"
                                            class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                        >
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.educationLevel') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.educationLevel)"
                                                    :label="$t('settings.educationLevel')"
                                                />
                                            </p>
                                            <Select v-model="formPersonalInfo.educationLevel">
                                                <SelectTrigger
                                                    class="w-full text-black bg-gray-100 sm:bg-transparent text-nowrap border-none"
                                                    position="right"
                                                >
                                                    <SelectValue :value="formPersonalInfo.educationLevel" />
                                                </SelectTrigger>
                                                <SelectContent class="border-none">
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

                                        <div class="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8 pt-6">
                                            <Button
                                                variant="secondary"
                                                class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                                                @click="personalInfoDialog = false"
                                            >
                                                {{ $t('common.cancel') }}
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
                                        <Building2 class="w-5" />
                                        <span>{{ $t('settings.institutionName') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.institutionName)"
                                            :label="$t('settings.institutionName')"
                                        />
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ user.institution?.name || '' }}
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
                                        <CircleUser class="w-5" />
                                        <span>{{ $t('settings.lastname') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.lastname)"
                                            :label="$t('settings.lastname')"
                                        />
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
                                        <UserPlus class="w-5" />
                                        <span>{{ $t('settings.firstname') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.firstname)"
                                            :label="$t('settings.firstname')"
                                        />
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
                                        <Calendar class="w-5" />
                                        <span>{{ $t('settings.birthDate') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.dateOfBirth)"
                                            :label="$t('settings.birthDate')"
                                        />
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
                                        <Mail class="w-5" />
                                        <span class="truncate w-full">{{ $t('settings.email') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.email)"
                                            :label="$t('settings.email')"
                                        />
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
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.identifierNumber)"
                                            :label="$t('settings.identifierNumber', { label: identifierLabel })"
                                        />
                                    </label>
                                </div>
                                <p
                                    class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded"
                                    :class="{ 'text-gray-400': !hasRealIdentifierDisplay }"
                                >
                                    {{ identifierDisplayLabel }}
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
                                        <Phone class="w-5" />
                                        <span>{{ $t('settings.phone') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.phoneNumber)"
                                            :label="$t('settings.phone')"
                                        />
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
                                        <span>{{ $t('settings.gender') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.gender)"
                                            :label="$t('settings.gender')"
                                        />
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
                                        <Users class="text-white w-5" />
                                        <span>{{ $t('settings.professionalCategory') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.professionalCategory)"
                                            :label="$t('settings.professionalCategory')"
                                        />
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ formattedCategory || ' - ' }}
                                </p>
                            </div>

                            <div
                                v-if="showEducationLevelSettings"
                                class="block sm:grid sm:grid-cols-2 sm:border sm:border-primary sm:h-9 sm:rounded-full"
                                @click="personalInfoDialog = true"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        class="text-primary sm:text-white flex items-center space-x-3 mb-1 sm:mb-0"
                                    >
                                        <GraduationCap class="text-white w-5" />
                                        <span>{{ $t('settings.educationLevel') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.educationLevel)"
                                            :label="$t('settings.educationLevel')"
                                        />
                                    </label>
                                </div>
                                <p class="border border-gray-300 rounded-full h-9 flex items-center indent-3 bg-transparent sm:border-none sm:rounded">
                                    {{ formattedEducationLevel || ' - ' }}
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
                                <MapPin class="w-6 text-gray-400" />
                                <span class="text-lg">{{ $t('settings.address') }}</span>
                            </h3>

                            <SquarePen
                                class="w-5 text-black/50 hover:text-primary cursor-pointer"
                                @click="addressInfoDialog = true"
                            />

                            <Dialog v-model:open="addressInfoDialog">
                                <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle class="text-center">
                                            {{ $t('settings.updateTitle') }}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        {{ $t('settings.updateAddressDesc') }}
                                    </DialogDescription>

                                    <form class="mt-4 space-y-3">
                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.street') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.street)"
                                                    :label="$t('settings.street')"
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
                                                {{ $t('settings.city') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.city)"
                                                    :label="$t('settings.city')"
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
                                                {{ $t('settings.country') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.country)"
                                                    :label="$t('settings.country')"
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
                                                {{ $t('settings.workCountry') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.workingAt)"
                                                    :label="$t('settings.workCountry')"
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
                                                {{ $t('settings.zipCode') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.zipCode)"
                                                    :label="$t('settings.zipCode')"
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
                                                {{ $t('settings.extra') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.additionalInfo)"
                                                    :label="$t('settings.extra')"
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
                                                {{ $t('common.cancel') }}
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
                                        <span>{{ $t('settings.street') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.street)"
                                            :label="$t('settings.street')"
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
                                        <span>{{ $t('settings.city') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.city)"
                                            :label="$t('settings.city')"
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
                                        <span>{{ $t('settings.country') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.country)"
                                            :label="$t('settings.country')"
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
                                        <span>{{ $t('settings.workCountry') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.workingAt)"
                                            :label="$t('settings.workCountry')"
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
                                        <span>{{ $t('settings.zipCode') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.zipCode)"
                                            :label="$t('settings.zipCode')"
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
                                        <span>{{ $t('settings.extra') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.additionalInfo)"
                                            :label="$t('settings.extra')"
                                        />
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
                                <MapPin class="w-6 text-gray-400" />
                                <span class="text-lg">{{ $t('settings.address') }}</span>
                            </h3>

                            <SquarePen
                                class="w-5 text-black/50 hover:text-primary cursor-pointer"
                                @click="addressInfoDialog = true"
                            />

                            <Dialog v-model:open="addressInfoDialog">
                                <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle class="text-center">
                                            {{ $t('settings.updateTitle') }}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        {{ $t('settings.updateAddressDesc') }}
                                    </DialogDescription>

                                    <form class="mt-4 space-y-3">
                                        <div class="grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                            <p class="text-primary sm:text-white sm:bg-primary flex items-center gap-1.5 h-full ps-4 rounded-s-full">
                                                {{ $t('settings.street') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.street)"
                                                    :label="$t('settings.street')"
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
                                                {{ $t('settings.city') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.city)"
                                                    :label="$t('settings.city')"
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
                                                {{ $t('settings.country') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.country)"
                                                    :label="$t('settings.country')"
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
                                                {{ $t('settings.workCountry') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.workingAt)"
                                                    :label="$t('settings.workCountry')"
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
                                                {{ $t('settings.zipCode') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.zipCode)"
                                                    :label="$t('settings.zipCode')"
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
                                                {{ $t('settings.extra') }}
                                                <SettingsFieldHint
                                                    variant="onPrimary"
                                                    :text="$t(SETTINGS_TOOLTIPS.additionalInfo)"
                                                    :label="$t('settings.extra')"
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
                                                {{ $t('common.cancel') }}
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
                                        <span>{{ $t('settings.street') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.street)"
                                            :label="$t('settings.street')"
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
                                        <span>{{ $t('settings.city') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.city)"
                                            :label="$t('settings.city')"
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
                                        <span>{{ $t('settings.country') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.country)"
                                            :label="$t('settings.country')"
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
                                        <span>{{ $t('settings.workCountry') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.workingAt)"
                                            :label="$t('settings.workCountry')"
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
                                        <span>{{ $t('settings.zipCode') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.zipCode)"
                                            :label="$t('settings.zipCode')"
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
                                        <span>{{ $t('settings.extra') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t(SETTINGS_TOOLTIPS.additionalInfo)"
                                            :label="$t('settings.extra')"
                                        />
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
                                <ShieldCheck class="w-6 text-gray-400" />
                                <span class="text-lg">{{ $t('settings.security') }}</span>
                            </h3>
                        </div>

                        <div class="mt-4 space-y-3">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <label
                                        for="currentPassword"
                                        class="font-normal flex items-center space-x-3"
                                    >
                                        <KeyIcon class="w-5 " />
                                        <span>{{ $t('settings.password') }}</span>
                                    </label>
                                    <SettingsFieldHint
                                        :text="$t(SETTINGS_TOOLTIPS.password)"
                                        :label="$t('settings.password')"
                                    />
                                </div>

                                <SquarePen
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
                                                    {{ $t('common.confirm') }} mot de passe
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
                                                    {{ $t('common.cancel') }}
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
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <label
                                        for="authTwoFactor"
                                        class="text-primary truncate font-semibold sm:font-normal sm:text-black sm:flex sm:items-center sm:space-x-3"
                                    >
                                        <Smartphone class="w-5 hidden sm:block" />
                                        <span class="w-full truncate">{{ $t('settings.twoFactor') }}</span>
                                    </label>
                                    <SettingsFieldHint
                                        :text="$t(SETTINGS_TOOLTIPS.twoFactor)"
                                        :label="$t('settings.twoFactor')"
                                    />
                                </div>
                                <Switch
                                    id="authTwoFactor"
                                    v-model:checked="enableTwoFactor"
                                    @update:checked="handleEnableAuth2Fa"
                                />

                                <Dialog v-model:open="twoFactorDialog">
                                    <DialogContent class="sm:max-w-160">
                                        <DialogHeader>
                                            <DialogTitle>{{ $t('settings.twoFactor') }}</DialogTitle>
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
                                                {{ $t('common.cancel') }}
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
                                                {{ $t('settings.twoFactor') }}
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
                                                    {{ $t('common.cancel') }}
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
                                <Wrench class="w-6 text-gray-400" />
                                <span class="text-lg">{{ $t('settings.preferences') }}</span>
                            </h3>

                            <Button
                                variant="outline"
                                class="font-bold text-xs text-primary -mt-1 lg:-mt-2"
                                @click="proposalDialog = true"
                            >
                                {{ $t('settings.aiBoost') }}
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
                                class="block sm:grid sm:grid-cols-[40%_60%] sm:border sm:border-primary sm:h-9 sm:rounded-full"
                            >
                                <div class="sm:bg-primary flex flex-col sm:flex-row sm:items-center sm:text-white sm:ps-4 sm:rounded-s-full">
                                    <label
                                        for="language"
                                        class="text-primary mb-4 sm:mb-0 font-semibold sm:text-white sm:flex sm:items-center sm:space-x-3"
                                    >
                                        <LanguageIcon class="w-5 hidden sm:block" />
                                        <span>{{ $t('common.language') }}</span>
                                        <SettingsFieldHint
                                            variant="onPrimary"
                                            :text="$t('settings.languageTooltip')"
                                            :label="$t('common.language')"
                                        />
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

                    <section
                        v-if="user.type != 'institution'"
                        class="mt-4 xl:mt-0 shadow rounded-lg p-6"
                    >
                        <h3 class="flex items-center space-x-4">
                            <BellRing class="w-6 text-gray-400" />
                            <span class="text-lg">{{ $t('settings.notification') }}</span>
                        </h3>

                        <div class="mt-4 space-y-4">
                            <div class="flex justify-between items-center gap-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="newReplacement">{{ $t('settings.newReplacementNotif') }}</Label>
                                    <SettingsFieldHint
                                        :text="$t(SETTINGS_TOOLTIPS.newReplacement)"
                                        :label="$t('settings.newReplacementNotif')"
                                    />
                                </div>
                                <Switch
                                    id="newReplacement"
                                    v-model:checked="notifNewReplacement"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                            <div class="flex justify-between items-center gap-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="acceptReplacement">{{ $t('settings.acceptedReplacementNotif') }}</Label>
                                    <SettingsFieldHint
                                        :text="$t(SETTINGS_TOOLTIPS.replacementAccepted)"
                                        :label="$t('settings.acceptedReplacementNotif')"
                                    />
                                </div>
                                <Switch
                                    id="acceptReplacement"
                                    v-model:checked="notifAcceptReplacement"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                                <div class="flex justify-between items-center gap-3">
                                    <div class="flex items-center gap-1.5 min-w-0">
                                        <Label for="digestWeekly">{{ $t('settings.weeklyDigest') }}</Label>
                                        <SettingsFieldHint
                                            :text="$t(SETTINGS_TOOLTIPS.digestWeekly)"
                                            :label="$t('settings.weeklyDigest')"
                                        />
                                    </div>
                                    <Switch
                                        id="digestWeekly"
                                        v-model:checked="notifDigestWeekly"
                                        @update:checked="handleChangeNotif"
                                    />
                                </div>
                                <div class="flex justify-between items-center gap-3">
                                    <div class="flex items-center gap-1.5 min-w-0">
                                        <Label for="marketingEmails">{{ $t('settings.marketingEmails') }}</Label>
                                        <SettingsFieldHint
                                            :text="$t(SETTINGS_TOOLTIPS.marketingEmails)"
                                            :label="$t('settings.marketingEmails')"
                                        />
                                    </div>
                                    <Switch
                                        id="marketingEmails"
                                        v-model:checked="notifMarketingEmails"
                                        @update:checked="handleChangeNotif"
                                    />
                                </div>
                            <div class="flex justify-between items-center gap-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="urgentOnly">{{ $t('settings.urgencyOnly') }}</Label>
                                    <SettingsFieldHint
                                        :text="$t(SETTINGS_TOOLTIPS.urgentOnly)"
                                        :label="$t('settings.urgencyOnly')"
                                    />
                                </div>
                                <Switch
                                    id="urgentOnly"
                                    v-model:checked="notifUrgentOnly"
                                    @update:checked="handleChangeNotif"
                                />
                            </div>
                            <div class="flex justify-between items-center gap-3">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Label for="smsUrgent">{{ $t('settings.smsUrgency') }}</Label>
                                    <SettingsFieldHint
                                        :text="$t(SETTINGS_TOOLTIPS.smsUrgent)"
                                        :label="$t('settings.smsUrgency')"
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

                    <!-- <section class="mt-8 grid grid-cols-6 sm:grid-cols-5 gap-2 shadow rounded-lg p-6">
                        <div class="mb-2 sm:mb-0 col-span-6 sm:col-span-2 flex space-x-1 h-9 justify-center items-center bg-success text-white rounded-full">
                            <ChartPieIcon class="w-5" />
                            <label>{{ $t('settings.accountStatus') }}</label>
                        </div>
                        <div
                            :class="isActivated ? 'text-white bg-primary' : 'text-black border border-gray-300'"
                            class="col-span-2 sm:col-span-1 flex h-9 items-center justify-center rounded-full cursor-pointer"
                            @click="enterPasswordActivateDialog = true"
                        >
                            {{ $t('settings.enabled') }}
                        </div>

                        <Dialog v-model:open="enterPasswordActivateDialog">
                            <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle class="text-center">
                                        {{ $t('settings.accountStatus') }}
                                    </DialogTitle>
                                </DialogHeader>
                                <div class="mt-8">
                                    Veuillez confirmer votre action en entrant votre mot de passe
                                </div>

                                <form class="mt-4 space-y-3">
                                    <div class="mb-0 sm:mb-12 grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                        <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                            {{ $t('settings.password') }}
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
                                            {{ $t('common.cancel') }}
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
                            {{ $t('settings.disabled') }}
                        </div>

                        <Dialog v-model:open="enterPasswordDeactivateDialog">
                            <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle class="text-center">
                                        {{ $t('settings.accountStatus') }}
                                    </DialogTitle>
                                </DialogHeader>
                                <div class="mt-8">
                                    Veuillez confirmer votre action en entrant votre mot de passe
                                </div>

                                <form class="mt-4 space-y-3">
                                    <div class="mb-0 sm:mb-12 grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                                        <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                                            {{ $t('settings.password') }}
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
                                            {{ $t('common.cancel') }}
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
                            {{ $t('settings.suspended') }}
                        </div>
                    </section> -->

                    <section class="mt-4 shadow rounded-lg p-6 space-y-4">
                        <h3 class="flex items-center space-x-4">
                            <Crown class="w-6 text-amber-500" />
                            <span class="text-lg">Abonnement Infiswap Pro</span>
                        </h3>
                        <p class="text-sm text-gray-600">
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

                    <section class="mt-4 shadow rounded-lg p-6 space-y-4">
                        <h3 class="flex items-center space-x-4">
                            <ShieldCheck class="w-6 text-gray-400" />
                            <span class="text-lg">{{ $t('settings.personalData') }}</span>
                        </h3>
                        <p class="text-sm text-gray-600">
                            {{ $t('settings.personalDataDesc') }}
                        </p>
                        <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                class="border-gray-300"
                                @click="openCookiePreferences"
                            >
                                {{ $t('settings.manageCookies') }}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                class="border-primary text-primary"
                                :in-progress="isExportingData"
                                :disabled="isExportingData"
                                @click="exportPersonalData"
                            >
                                {{ $t('settings.exportData') }}
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
import { ArrowLeft, BellRing, Building2, Calendar, CircleUser, Crown, GraduationCap, IdCard, Mail, Map, MapPin, Phone, ShieldCheck, Smartphone, SquarePen, Trash2, UserPlus, Users, Wrench } from 'lucide-vue-next';
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
import { EDUCATION_LEVEL_OPTIONS, educationLevelLabel, hasRealIdentifier, isBelgiumProfile } from '~/utils/educationLevel';
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
    // updateStatusAccount,
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
        $toast({ description: 'Export téléchargé.' });
    } catch (error) {
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
    } finally {
        isExportingData.value = false;
    }
}

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
        return 'Pas de numéro INAMI renseigné';
    }
    return user.value?.identifier_number || 'Pas de numéro INAMI renseigné';
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
    educationLevel: user.value.education_level ?? '',
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

const languages = {
    fr: 'Français',
    nl: 'Nederlands',
};

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
                description: 'Veuillez sélectionner une image',
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

        if (user.value.profile) {
            user.value.profile = {
                ...user.value.profile,
                profil_url: null,
            };
        }

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
    title: t('settings.title'),
});
</script>
