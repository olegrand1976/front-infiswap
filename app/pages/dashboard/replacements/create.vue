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
                        <BreadcrumbPage>{{ t('replacements.createTitle') }}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        <form
            class="mt-4 mb-12"
            @submit.prevent="submit"
        >
            <div class="rounded-lg shadow-md px-2 border bg-card sm:px-8 md:px-10 py-8">
                <div class="text-center mb-8">
                    <h1 class="font-secondary text-xl sm:text-2xl font-semibold">
                        {{ t('replacements.createHeading') }} {{ t('replacements.createHeadingStrong') }}
                    </h1>
                    <p class="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                        {{ t('replacements.createHelpDesc') }}
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div>
                        <div class="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                            <CalendarRange class="size-4" />
                            {{ t('replacements.selectPeriods') }}
                        </div>

                        <div class="rounded-md border border-input bg-background p-4">
                            <MultiRangeCalendar
                                v-model="calendarValue"
                                class="flex flex-col justify-center md:block"
                                @update:model-value="handleCalendarUpdate"
                            />
                        </div>

                        <div class="relative my-6 text-center">
                            <hr class="border-t border-input">
                            <span class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-card px-3 text-xs font-medium text-muted-foreground">
                                {{ t('replacements.or') }}
                            </span>
                        </div>

                        <p class="mb-3 text-center text-xs font-semibold text-muted-foreground">
                            {{ t('replacements.manualPeriods') }}
                        </p>

                        <div class="flex flex-col gap-3">
                            <div
                                v-for="(period, index) in formData.periods"
                                :key="index"
                                class="relative flex flex-col gap-3 rounded-md border border-input p-3 pr-10 sm:flex-row sm:items-end sm:pr-3"
                            >
                                <div class="flex flex-1 flex-col gap-1.5 min-w-0">
                                    <label class="text-xs font-medium text-muted-foreground">
                                        {{ t('replacements.startDate') }}
                                    </label>
                                    <input
                                        v-model="period.startDate"
                                        type="date"
                                        data-testid="replacement-period-start"
                                        class="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                                        @change="handleManualDateUpdate(index)"
                                    >
                                </div>
                                <div class="flex flex-1 flex-col gap-1.5 min-w-0">
                                    <label class="text-xs font-medium text-muted-foreground">
                                        {{ t('replacements.endDate') }}
                                    </label>
                                    <input
                                        v-model="period.endDate"
                                        type="date"
                                        data-testid="replacement-period-end"
                                        class="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                                        @change="handleManualDateUpdate(index)"
                                    >
                                </div>
                                <Button
                                    v-if="formData.periods.length > 1"
                                    type="button"
                                    class="absolute top-2 right-2 p-0 size-8 rounded-md sm:static sm:ml-2"
                                    @click="removePeriod(index)"
                                >
                                    <Trash2 :size="4" />
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            class="mt-3 w-full rounded-md inline-flex items-center gap-2"
                            @click="addPeriod"
                        >
                            <Plus class="size-4" />
                            {{ t('replacements.addPeriod') }}
                        </Button>
                    </div>

                    <div class="space-y-6 text-sm">
                        <div class="flex flex-col gap-4">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.timeSlot') }}</label>

                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-2">
                                    <div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                        <Sunrise class="size-4" />
                                    </div>
                                    <span class="text-sm font-medium">{{ t('replacements.morning') }}</span>
                                </div>
                                <div class="grid grid-cols-2 gap-2 pl-10">
                                    <div class="flex flex-col gap-1 min-w-0">
                                        <span class="text-xs text-muted-foreground">De</span>
                                        <InputTime
                                            v-model="formData.timeSlot.morning.startAt"
                                            time-range="morning"
                                            container-class="min-w-0 w-full"
                                            input-container-class="w-full"
                                            input-class="w-full h-9! rounded-md! border! border-input! pr-10"
                                        />
                                    </div>
                                    <div class="flex flex-col gap-1 min-w-0">
                                        <span class="text-xs text-muted-foreground">à</span>
                                        <InputTime
                                            v-model="formData.timeSlot.morning.endAt"
                                            time-range="morning"
                                            container-class="min-w-0 w-full"
                                            input-container-class="w-full"
                                            input-class="w-full h-9! rounded-md! border! border-input! pr-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-2">
                                    <div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                        <Sunset class="size-4" />
                                    </div>
                                    <span class="text-sm font-medium">{{ t('replacements.evening') }}</span>
                                </div>
                                <div class="grid grid-cols-2 gap-2 pl-10">
                                    <div class="flex flex-col gap-1 min-w-0">
                                        <span class="text-xs text-muted-foreground">De</span>
                                        <InputTime
                                            v-model="formData.timeSlot.evening.startAt"
                                            time-range="evening"
                                            container-class="min-w-0 w-full"
                                            input-container-class="w-full"
                                            input-class="w-full h-9! rounded-md! border! border-input! pr-10"
                                        />
                                    </div>
                                    <div class="flex flex-col gap-1 min-w-0">
                                        <span class="text-xs text-muted-foreground">à</span>
                                        <InputTime
                                            v-model="formData.timeSlot.evening.endAt"
                                            time-range="evening"
                                            container-class="min-w-0 w-full"
                                            input-container-class="w-full"
                                            input-class="w-full h-9! rounded-md! border! border-input! pr-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.patientsPerDay') }}</label>
                            <div class="flex h-11 items-center gap-2 rounded-md border border-input px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                                <Users class="size-4 shrink-0 text-primary" />
                                <Input
                                    v-model="formData.patientCount"
                                    :placeholder="t('replacements.enterNumber')"
                                    class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                                />
                            </div>
                        </div>

                        <div class="relative">
                            <Button
                                type="button"
                                size="sm"
                                class="absolute -top-2 right-0 rounded-md inline-flex items-center gap-2"
                                @click="openProposalDialog('')"
                            >
                                <Sparkles class="size-3.5" />
                                {{ t('settings.aiBoost') }}
                            </Button>

                            <div class="grid gap-4 lg:grid-cols-2">
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.colZip') }}</label>
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
                                        :is-mobile="isMobile"
                                        :comma-validation="false"
                                        :count="4"
                                        @keydown.enter.prevent
                                        @item-added="onZipCodeAdded"
                                        @open-proposal="openProposalDialog"
                                    />
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.colCities') }}</label>
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
                                        :is-mobile="isMobile"
                                        :comma-validation="true"
                                        :no-space-validation="true"
                                        :digits-only="false"
                                        @keydown.enter.prevent
                                        @item-added="onCityAdded"
                                        @open-proposal="openProposalDialog"
                                    />
                                </div>
                            </div>
                        </div>

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
                                            class="flex items-center space-x-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
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

                        <div
                            v-if="hasMultipleValidRoles"
                            class="flex flex-col gap-1.5"
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

                        <div class="flex flex-col gap-1.5">
                            <label class="text-xs font-medium text-muted-foreground">{{ t('replacements.description') }}</label>
                            <Textarea
                                v-model="formData.comment"
                                :placeholder="t('replacements.descriptionPlaceholder')"
                                rows="6"
                                class="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex justify-center mt-10">
                    <Button
                        type="submit"
                        class="rounded-md! w-full max-w-sm inline-flex items-center justify-center gap-2"
                        data-testid="replacement-create-submit"
                        :in-progress="inProgress"
                    >
                        <Save class="size-4" />
                        {{ t('nav.publishReplacement') }}
                    </Button>
                </div>
            </div>
        </form>

        <ProposalLocationModal
            v-model="proposalDialog"
            v-model:newly-added-value="newlyAddedValue"
            :title="t('replacements.suggestions')"
            :description="t('replacements.suggestionsDesc')"
            :initial-zip-codes="formData.zipCodes"
            :initial-cities="formData.cities"
            :is-preference-mode="false"
            :country-code="countryCode"
            @update:initial-zip-codes="updateZipCodes"
            @update:initial-cities="updateCities"
        />

        <ConfirmProfileCountryModal
            v-if="showCountryModal"
            :pending="countryPending"
            @select="onCountrySelect"
            @dismiss="cancelCountryModal"
        />
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, Building2, CalendarRange, LayoutGrid, Mailbox, Plus, Save, Sparkles, Stethoscope, Sunrise, Sunset, Trash2, Users } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { InputTime } from '@/components/ui/input-time';
import { Input } from '@/components/ui/input';
import { useReplacements } from '@/composables/useReplacements';
import InputTagManager from '@/components/InputTagManager.vue';
import { useCareTypes } from '@/composables/useCareTypes';
import MultiRangeCalendar from '@/components/MultiRangeCalendar.vue';
import ConfirmProfileCountryModal from '~/components/replacements/ConfirmProfileCountryModal.vue';
import type { User } from '~/lib/types';
import { goBack } from '~/lib/utils';
import { validateCreateReplacementForm } from '~/utils/platformAccess';
import { resolveProfileCountryCode } from '~/utils/profileCountry';
import {
    clearReplacementListFilterCookies,
    useConfirmProfileCountry,
} from '~/composables/useConfirmProfileCountry';

const { t } = useI18n();
const localePath = useLocalePath();
const user = useState<User>('user');
const { getCitiesFomZipCode, getZipCodesFromCity } = useLocation();
const { careTypes, fetchCareTypes } = useCareTypes();
const { submitReplacement } = useReplacements();
const router = useRouter();
const { isInstitution } = useAuth();
const {
    showModal: showCountryModal,
    pending: countryPending,
    ensureProfileCountry,
    onSelect: onCountrySelect,
    cancel: cancelCountryModal,
} = useConfirmProfileCountry();
const validRoles = ['nurse', 'caregiver', 'midwife'];
const selectedRole = ref(null);

const roleType = computed(() => {
    return user.value.roles.find(role => validRoles.includes(role));
});
const hasMultipleValidRoles = computed(() => {
    const userRoles = user.value.roles || [];
    const matchingRoles = userRoles.filter(role => validRoles.includes(role));
    return matchingRoles.length >= 2;
});

const isMobile = ref(false);
const countryCode = computed(() => resolveProfileCountryCode(user.value?.profile) ?? 'be');
onMounted(async () => {
    if (import.meta.client) {
        isMobile.value = window.innerWidth <= 1024;
    }
    if (isInstitution.value) {
        router.push('/dashboard/institution');
        return;
    }
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
    periods: [
        {
            startDate: '',
            endDate: '',
        },
    ],
    patientCount: null as number | null,
    roleType: roleType.value,
    zipCodes: [] as string[],
    cities: [] as string[],
    careTypes: [] as number[],
    timeSlot: {
        morning: {
            startAt: '',
            endAt: '',
        },
        evening: {
            startAt: '',
            endAt: '',
        },
    },
    comment: '',
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
    if (citiesFromZip.length) {
        const citiesSet = new Set(formData.cities);
        citiesFromZip.forEach(city => citiesSet.add(city));
        formData.cities = Array.from(citiesSet);
    }

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

const calendarValue = ref<{ start: string | null; end: string | null }[]>([
    { start: null, end: null },
]);

watch(
    () => formData.periods,
    () => {
        calendarValue.value = formData.periods.map(period => ({
            start: period.startDate || null,
            end: period.endDate || null,
        }));
    },
    { deep: true },
);

const handleCalendarUpdate = (
    ranges: { start: string | null; end: string | null }[],
) => {
    if (!Array.isArray(ranges)) {
        console.error('Expected ranges to be an array:', ranges);
        return;
    }
    if (
        formData.periods.length === 1
        && !formData.periods[0].startDate
        && !formData.periods[0].endDate
    ) {
        formData.periods[0] = {
            startDate: ranges[0]?.start || null,
            endDate: ranges[0]?.end || null,
        };
    }
    else {
        formData.periods = ranges.map(range => ({
            startDate: range.start || null,
            endDate: range.end || null,
        }));
    }
};

const handleManualDateUpdate = (index: number) => {
    const period = formData.periods[index];
    if (period.startDate && period.endDate) {
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        if (startDate > endDate) {
            formData.periods[index] = {
                startDate: period.endDate,
                endDate: period.startDate,
            };
        }
    }
    calendarValue.value = formData.periods.map(period => ({
        start: period.startDate || null,
        end: period.endDate || null,
    }));
};

const addPeriod = () => {
    formData.periods.push({
        startDate: null,
        endDate: null,
    });
    calendarValue.value.push({ start: null, end: null });
};

const removePeriod = (index: number) => {
    formData.periods.splice(index, 1);
    calendarValue.value.splice(index, 1);
};

const handleCareTypeClick = (formData, careTypeId) => {
    const index = formData.careTypes.indexOf(careTypeId);
    if (index === -1) {
        formData.careTypes.push(careTypeId);
    }
    else {
        formData.careTypes.splice(index, 1);
    }
    formData.careTypes = [...formData.careTypes];
};

const getSelectedCareTypesText = (selectedIds: number[]): string => {
    return careTypes.value
        .filter(ct => selectedIds.includes(ct.id))
        .map(ct => ct.name)
        .join(', ');
};

const resetForm = () => {
    formData.periods = [
        {
            startDate: null,
            endDate: null,
        },
    ];
    calendarValue.value = [{ start: null, end: null }];
    formData.patientCount = null;
    formData.zipCodes = [];
    formData.cities = [];
    formData.careTypes = [];
    formData.timeSlot.morning.startAt = null;
    formData.timeSlot.morning.endAt = null;
    formData.timeSlot.evening.startAt = null;
    formData.timeSlot.evening.endAt = null;
    formData.comment = '';
    formData.zipCodesInput = '';
    formData.citiesInput = '';
};

const { submit, inProgress } = useSubmit(
    async () => {
        const validationError = validateCreateReplacementForm(formData);

        if (validationError) {
            toast.error(validationError);
            return;
        }

        const countryOk = await ensureProfileCountry();
        if (!countryOk) {
            toast.error(t('replacements.confirmCountryToPublish'));
            return;
        }

        await submitReplacement(formData);
    },
    {
        onSuccess: () => {
            toast.success(t('replacements.createSuccess'));
            resetForm();
            clearReplacementListFilterCookies();
            router.push('/dashboard/replacements/me');
        },
    },
);

useHead({
    title: () => t('replacements.createTitle'),
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
