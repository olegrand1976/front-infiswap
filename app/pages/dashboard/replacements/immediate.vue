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
                                :to="localePath('/dashboard')"
                                class="flex items-center gap-1.5"
                            >
                                <LayoutGrid class="size-3.5" />
                                {{ t('nav.dashboard') }}
                            </NuxtLink>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{{ t('replacements.immediateTitle') }}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        <Form
            class="mt-4 mb-12"
            @submit="submit"
        >
            <div class="rounded-lg shadow-md border bg-card px-6 sm:px-8 md:px-10 py-8">
                <div class="text-center mb-8">
                    <h1 class="font-secondary text-xl sm:text-2xl font-semibold">
                        {{ t('replacements.immediateHelp') }}
                    </h1>
                    <p class="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                        {{ t('replacements.immediateHelpDesc') }}
                    </p>
                </div>

                <div class="space-y-6">
                    <div class="grid gap-4 sm:grid-cols-3">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.startTime') }} *</label>
                            <InputTime
                                v-model="formData.startTime"
                                container-class="w-full"
                                input-container-class="w-full"
                                input-class="w-full h-11! rounded-md! border! border-input! pr-10 focus:ring-2 focus:ring-primary/20"
                                icon-class="text-primary"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.endTime') }} *</label>
                            <InputTime
                                v-model="formData.endTime"
                                container-class="w-full"
                                input-container-class="w-full"
                                input-class="w-full h-11! rounded-md! border! border-input! pr-10 focus:ring-2 focus:ring-primary/20"
                                icon-class="text-primary"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.patientsPerDay') }} *</label>
                            <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                <Users class="size-4 shrink-0 text-primary" />
                                <Input
                                    v-model="formData.patientCount"
                                    placeholder="10"
                                    class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="block relative lg:hidden">
                        <Button
                            size="sm"
                            class="absolute -top-2 right-0 rounded-md"
                            @click="openProposalDialog('')"
                        >
                            <Sparkles class="size-3.5" />
                            {{ t('settings.aiBoost') }}
                        </Button>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.colZip') }} *</label>
                            <InputTagManager
                                v-model="formData.zipCodes"
                                :icon="Mailbox"
                                rounded="md"
                                :placeholder="
                                    user.profile.country == 'fr'
                                        ? '75000, 40990, 89550'
                                        : '6565,4561,1237'
                                "
                                class="w-full"
                                :is-mobile="true"
                                :comma-validation="false"
                                @keydown.enter.prevent
                                @item-added="onZipCodeAdded"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5 mt-4">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.colCities') }} *</label>
                            <InputTagManager
                                v-model="formData.cities"
                                :icon="Building2"
                                rounded="md"
                                :placeholder="
                                    user.profile.country
                                        ? 'Paris, Landes, Yonne'
                                        : 'Anvers, Bruges, Gand'
                                "
                                class="w-full"
                                :is-mobile="true"
                                :comma-validation="true"
                                :no-space-validation="true"
                                @keydown.enter.prevent
                                @item-added="onCityAdded"
                            />
                        </div>
                    </div>

                    <div class="hidden relative lg:grid lg:grid-cols-2 lg:gap-4">
                        <Button
                            size="sm"
                            class="absolute -top-2 right-0 rounded-md inline-flex items-center gap-2"
                            @click="openProposalDialog('')"
                        >
                            <Sparkles class="size-3.5" />
                            {{ t('settings.aiBoost') }}
                        </Button>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.colZip') }} *</label>
                            <InputTagManager
                                v-model="formData.zipCodes"
                                :icon="Mailbox"
                                rounded="md"
                                placeholder="6565,4561,1237"
                                class="w-full"
                                :is-mobile="false"
                                :comma-validation="false"
                                @keydown.enter.prevent
                                @item-added="onZipCodeAdded"
                                @open-proposal="openProposalDialog"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.colCities') }} *</label>
                            <InputTagManager
                                v-model="formData.cities"
                                :icon="Building2"
                                rounded="md"
                                placeholder="Anvers, Bruges, Gand"
                                class="w-full"
                                :comma-validation="true"
                                :no-space-validation="true"
                                @keydown.enter.prevent
                                @item-added="onCityAdded"
                                @open-proposal="openProposalDialog"
                            />
                        </div>
                    </div>

                    <ProposalLocationModal
                        v-model="proposalDialog"
                        v-model:newly-added-value="newlyAddedValue"
                        :title="t('replacements.suggestions')"
                        :description="t('replacements.suggestionsDesc')"
                        :initial-zip-codes="formData.zipCodes"
                        :initial-cities="formData.cities"
                        :is-preference-mode="false"
                        @update:initial-zip-codes="updateZipCodes"
                        @update:initial-cities="updateCities"
                    />

                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.careType') }}</label>
                        <Select
                            v-model="formData.careTypes"
                            multiple
                        >
                            <SelectTrigger
                                class="h-11 w-full rounded-md border border-input text-nowrap"
                                position="right"
                            >
                                <Stethoscope class="size-4 shrink-0 text-primary" />
                                <SelectValue class="truncate w-800">
                                    <template v-if="getSelectedCareTypesText(formData.careTypes)">
                                        {{ getSelectedCareTypesText(formData.careTypes) }}
                                    </template>
                                    <template v-else>
                                        <span class="text-muted-foreground">
                                            {{ t('replacements.selectCareType') }}
                                        </span>
                                    </template>
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent class="border border-none">
                                <SelectGroup class="w-32">
                                    <div
                                        v-for="careType in careTypes"
                                        :key="careType.id"
                                        class="flex items-center space-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                        @click="handleCareTypeClick(formData, careType.id)"
                                    >
                                        <Checkbox
                                            :checked="formData.careTypes.includes(careType.id)"
                                            class="mr-2"
                                        />
                                        <label class="text-xs text-nowrap cursor-pointer">
                                            {{ careType.name }}
                                        </label>
                                    </div>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div
                    v-if="hasMultipleValidRoles"
                    class="mt-8 flex flex-col gap-1.5"
                >
                    <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.askAs') }}</label>
                    <div class="flex flex-wrap gap-2">
                        <label
                            class="flex flex-1 min-w-[150px] items-center gap-2 rounded-md border border-input px-4 py-2.5 cursor-pointer transition-colors hover:border-primary"
                            :class="{ 'border-primary bg-primary/5': selectedRole === 'nurse' }"
                        >
                            <input
                                id="nurse"
                                v-model="selectedRole"
                                type="radio"
                                name="roleType"
                                value="nurse"
                                class="accent-primary size-4 shrink-0"
                            >
                            <span class="text-sm font-medium">{{ t('replacements.roleNurse') }}</span>
                        </label>
                        <label
                            class="flex flex-1 min-w-[150px] items-center gap-2 rounded-md border border-input px-4 py-2.5 cursor-pointer transition-colors hover:border-primary"
                            :class="{ 'border-primary bg-primary/5': selectedRole === 'caregiver' }"
                        >
                            <input
                                id="caregiver"
                                v-model="selectedRole"
                                type="radio"
                                name="roleType"
                                value="caregiver"
                                class="accent-primary size-4 shrink-0"
                            >
                            <span class="text-sm font-medium">{{ t('replacements.roleAide') }}</span>
                        </label>
                        <label
                            class="flex flex-1 min-w-[150px] items-center gap-2 rounded-md border border-input px-4 py-2.5 cursor-pointer transition-colors hover:border-primary"
                            :class="{ 'border-primary bg-primary/5': selectedRole === 'midwife' }"
                        >
                            <input
                                id="midwife"
                                v-model="selectedRole"
                                type="radio"
                                name="roleType"
                                value="midwife"
                                class="accent-primary size-4 shrink-0"
                            >
                            <span class="text-sm font-medium">{{ t('replacements.roleMidwife') }}</span>
                        </label>
                    </div>
                </div>

                <div class="flex justify-center mt-10">
                    <Button
                        type="submit"
                        class="rounded-md! w-full max-w-sm inline-flex items-center justify-center gap-2"
                        :in-progress="inProgress"
                    >
                        <Save class="size-4" />
                        {{ t('nav.publishReplacement') }}
                    </Button>
                </div>
            </div>
        </Form>

        <ConfirmProfileCountryModal
            v-if="showCountryModal"
            :pending="countryPending"
            @select="onCountrySelect"
            @dismiss="cancelCountryModal"
        />
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Building2, LayoutGrid, Mailbox, Save, Sparkles, Stethoscope, Users } from 'lucide-vue-next';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { InputTime } from '@/components/ui/input-time';
import InputTagManager from '@/components/InputTagManager.vue';
import ConfirmProfileCountryModal from '~/components/replacements/ConfirmProfileCountryModal.vue';
import type { AccountType, CountryCode, User } from '~/lib/types';

import { goBack } from '~/lib/utils';
import { validateImmediateReplacementForm } from '~/utils/platformAccess';
import { resolveProfileCountryCode } from '~/utils/profileCountry';
import {
    clearReplacementListFilterCookies,
    useConfirmProfileCountry,
} from '~/composables/useConfirmProfileCountry';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const user = useState<User>('user');
const localePath = useLocalePath();
const validRoles = ['nurse', 'caregiver', 'midwife'];
const selectedRole = ref<AccountType | null | undefined>(null);
const {
    showModal: showCountryModal,
    pending: countryPending,
    ensureProfileCountry,
    onSelect: onCountrySelect,
    cancel: cancelCountryModal,
} = useConfirmProfileCountry();

const roleType = computed(() => {
    return user.value.roles.find(role => validRoles.includes(role));
});

const hasMultipleValidRoles = computed(() => {
    const userRoles = user.value.roles || [];
    const matchingRoles = userRoles.filter(role => validRoles.includes(role));
    return matchingRoles.length >= 2;
});

const { careTypes, fetchCareTypes } = useCareTypes();
const { t } = useI18n();
const { $toast } = useNuxtApp();
const { sendUrgentReplacement } = useReplacements();
const { getCitiesFomZipCode, getZipCodesFromCity } = useLocation();
const countryCode = computed<CountryCode>(() => resolveProfileCountryCode(user.value?.profile) ?? 'be');

onMounted(async () => {
    await ensureProfileCountry();
    if (hasMultipleValidRoles.value) {
        selectedRole.value = null;
        formData.roleType = null;
    }
    else {
        selectedRole.value = roleType.value;
        formData.roleType = roleType.value;
    }
});

await fetchCareTypes();

const formData = reactive({
    startTime: '',
    endTime: '',
    patientCount: '',
    roleType: roleType.value,
    zipCodes: [],
    cities: [],
    careTypes: [],
    zipCodesInput: '',
    citiesInput: '',
});

watch(selectedRole, (newVal) => {
    if (newVal) {
        formData.roleType = newVal;
    }
});

const proposalDialog = ref(false);
const newlyAddedValue = ref<string>('');

const updateZipCodes = (newZipCodes: string[]) => {
    formData.zipCodes = [...newZipCodes];
};

const updateCities = (newCities: string[]) => {
    formData.cities = [...newCities];
};

const openProposalDialog = (value: string) => {
    newlyAddedValue.value = value;
    proposalDialog.value = true;
};

const onZipCodeAdded = async (zip: string) => {
    const citiesFromZip = await getCitiesFomZipCode(zip, countryCode.value);
    if (!citiesFromZip) return;

    const citiesSet = new Set(formData.cities);
    citiesFromZip.forEach(city => citiesSet.add(city));
    formData.cities = Array.from(citiesSet);
    openProposalDialog(zip);
};

const onCityAdded = async (city: string) => {
    const zipCodes = await getZipCodesFromCity(city, countryCode.value);
    if (zipCodes.length) {
        const zipCodesSet = new Set(formData.zipCodes);
        zipCodes.forEach(zipCode => zipCodesSet.add(zipCode));
        formData.zipCodes = Array.from(zipCodesSet);
    }
    openProposalDialog(city);
};

const handleCareTypeClick = (timeSlot, careTypes) => {
    const index = timeSlot.careTypes.indexOf(careTypes);
    if (index === -1) {
        timeSlot.careTypes.push(careTypes);
    }
    else {
        timeSlot.careTypes.splice(index, 1);
    }
    timeSlot.careTypes = [...timeSlot.careTypes];
};

const getSelectedCareTypesText = (selectedIds) => {
    return careTypes.value
        .filter(ct => selectedIds.includes(ct.id))
        .map(ct => ct.name)
        .join(', ');
};

const pendingReplacement = useState('pendingReplacement', () => null);
const { submit, inProgress } = useSubmit(async () => {
    const validationError = validateImmediateReplacementForm(formData);

    if (validationError) {
        $toast({
            variant: 'destructive',
            description: validationError,
        });
        return;
    }

    const countryOk = await ensureProfileCountry();
    if (!countryOk) {
        $toast({
            variant: 'destructive',
            description: t('replacements.confirmCountryToPublish'),
        });
        return;
    }

    try {
        const result = await sendUrgentReplacement(formData);
        if (result === true) {
            $toast({
                description: t('replacements.immediateCreated'),
            });

            clearReplacementListFilterCookies();
            navigateTo('/dashboard/replacements/me');
        }
    }
    catch (err) {
        if (err.response?.status === 401) {
            pendingReplacement.value = formData;
            return navigateTo('/register-immediate');
        }
        console.error('Erreur soumise:', err);
        throw err;
    }
});

useHead({
    title: () => t('replacements.immediateTitle'),
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth'],
});
</script>
