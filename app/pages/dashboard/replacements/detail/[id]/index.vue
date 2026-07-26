<template>
    <div class="pt-2">
        <div
            v-if="showBoostOffer"
            class="mx-3 mb-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-3 sm:p-4 shadow-sm"
        >
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <ReplacementBoostStars size="md" />
                <div class="flex-1">
                    <p class="font-bold text-amber-900 text-sm sm:text-base">
                        {{ $t('replacements.published') }}
                    </p>
                    <p class="text-xs text-amber-800/80 mt-0.5">
                        Boost 2 — 7 j à 4,40 € recommandé (Boost 1 — 3 j à 2 € disponible).
                    </p>
                </div>
                <ReplacementBoostButton
                    variant="card"
                    show-price
                    @boost="openBoostPreview"
                />
            </div>
        </div>

        <ReplacementDetailBoostBlock
            v-if="replacement"
            :replacement="replacement"
            :is-owner="isReplacementOwner"
            :can-boost="canBoostThisReplacement"
            @boost="openBoostPreview"
            @manage="openBoostActive"
        />

        <div
            v-if="replacement"
            class="mx-3 mt-4"
        >
            <ReplacementShareButtons
                :replacement-id="replacement.id"
                :title="`${t('replacements.shareTitle', { date: replacement.start_date })}`"
            />
        </div>

        <div class="mt-6 flex flex-col space-y-8 sm:space-y-6 lg:space-y-0 lg:flex-row lg:space-x-3 justify-between">
            <div
                :class="{ 'w-full': !(user && replacement.user_id === user.id), 'w-full lg:w-[55%]': (user && replacement.user_id === user.id) }"
                class="rounded sm:bg-gray-100 sm:h-12 px-3 flex flex-col space-y-6 sm:space-y-0 sm:space-x-4 sm:flex-row justify-between sm:items-center"
            >
                <Button
                    class="text-sm w-auto"
                    @click="goBack"
                >
                    <span class="text-xs">{{ $t('common.back') }}</span>
                </Button>

                <div class="mt-20 sm:mt-0 flex flex-col space-y-6 sm:space-y-0 sm:flex-row w-full sm:w-auto sm:items-center sm:space-x-8">
                    <h4 class="font-semibold text-sm sm:text-primary sm:ml-4 xl:ml-0">
                        {{ $t('replacements.period') }}
                    </h4>
                    <div v-if="periods && periods.length > 0">
                        <Button
                            class="text-sm w-40 sm:w-auto bg-primary text-white"
                            @click="periodDialog = true"
                        >
                            <span class="text-xs">{{ $t('replacements.seePeriods') }}</span>
                        </Button>
                    </div>
                    <div
                        v-else
                        class="flex flex-col sm:flex-row sm:gap-10 space-y-4 sm:space-y-0"
                    >
                        <div class="flex justify-between items-center sm:justify-start sm:space-x-5 rounded-full bg-primary sm:w-40">
                            <span class="text-xs text-white ms-3">{{ $t('replacements.start') }}</span>
                            <div class="flex justify-center items-center text-primary rounded-full border-2 border-primary bg-white shadow w-40">
                                <Calendar class="w-4 h-4 ml-1 text-primary" />
                                <Input
                                    v-model="startDate"
                                    variant="transparent"
                                    class="text-xs font-semibold text-primary w-24"
                                    disabled
                                />
                            </div>
                        </div>
                        <div class="flex justify-between items-center sm:justify-start sm:space-x-5 rounded-full bg-primary sm:w-40">
                            <span class="text-xs text-white ms-3">{{ $t('replacements.end') }}</span>
                            <div class="flex justify-center items-center text-primary rounded-full border-2 border-primary bg-white shadow w-40">
                                <Calendar class="w-4 h-4 ml-1 text-primary" />
                                <Input
                                    v-model="endDate"
                                    variant="transparent"
                                    class="text-xs font-semibold text-primary w-24"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="user && replacement.user_id === user.id"
                class="mt-12 sm:mt-0 w-full sm:h-12 px-3 flex justify-between sm:items-center gap-2"
            >
                <div class="flex items-center text-center space-x-3 bg-primary h-10 border-2 border-primary rounded-full w-72">
                    <div>
                        <span
                            v-if="replacement.response_count < 2"
                            class="text-sm text-white text-nowrap ml-3"
                        >{{ $t('replacements.interestedOne') }}</span>
                        <span
                            v-else
                            class="text-sm font-semibold text-white text-nowrap ml-3"
                        >{{ $t('replacements.interestedMany') }}</span>
                    </div>
                    <div class="bg-white h-full flex items-center justify-center shadow w-72 rounded-full">
                        <div
                            class="font-bold text-primary"
                        >
                            {{ replacement.response_count ?? 0 }}
                        </div>
                    </div>
                </div>
                <div>
                    <Button
                        :href="`/dashboard/replacements/detail/${replacement.id}/list`"
                    >
                        <span class="text-sm font-semibold">{{ $t('replacements.seeList') }}</span>
                    </Button>
                </div>
            </div>
        </div>

        <Dialog v-model:open="periodDialog">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle class="text-xl font-semibold text-primary">
                        {{ $t('replacements.periodOfReplacement') }}
                    </DialogTitle>
                </DialogHeader>
                <div class="mt-3 text-sm grid grid-cols-2 items-center font-semibold text-gray-700">
                    <h5>
                        {{ $t('replacements.startDate') }}
                    </h5>
                    <h5>
                        {{ $t('replacements.endDate') }}
                    </h5>
                </div>
                <div
                    v-for="period in periods"
                    :key="period.id"
                    class="mt-1"
                >
                    <div class="grid grid-cols-2 items-center text-sm">
                        <span>
                            {{ formatDate(period.start_date) }}
                        </span>
                        <span>
                            {{ formatDate(period.end_date) }}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <section
            v-if="groupedDetails.length > 0"
            class="mt-8 sm:mt-6 2xl:mt-12 mb-8 h-auto flex flex-col items-center space-y-8"
        >
            <div
                v-for="group in groupedDetails"
                :key="group.date"
            >
                <div class="bg-gray-100 sm:w-md lg:w-lg 2xl:w-160 space-y-8 sm:space-y-0 space-x-6 p-8 relative rounded-2xl">
                    <div>
                        <div>
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Informations du créateur
                                </h4>
                            </div>
                            <div class="mt-4 space-y-4">
                                <div
                                    v-if="replacement.can_view_creator_contact"
                                    class="bg-gray-200 text-sm py-2 rounded px-3"
                                >
                                    <span>Nom : {{ replacement.user.full_name }}</span>
                                </div>
                                <div
                                    v-if="replacement.can_view_creator_contact"
                                    class="bg-gray-200 text-sm py-2 rounded px-3"
                                >
                                    <span>{{ $t('replacements.phoneLabel') }} {{ replacement.user.phone_number }}</span>
                                </div>
                                <div
                                    v-if="!replacement.can_view_creator_contact && (replacement.user?.zip_code || replacement.user?.city)"
                                    class="bg-gray-200 text-sm py-2 rounded px-3"
                                >
                                    <span v-if="replacement.user?.zip_code">{{ $t('replacements.zipLabel') }} {{ replacement.user.zip_code }}</span>
                                    <span v-if="replacement.user?.zip_code && replacement.user?.city"> — </span>
                                    <span v-if="replacement.user?.city">{{ $t('replacements.cityLabel') }} {{ replacement.user.city }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 h-10 flex px-2 bg-primary rounded items-center">
                            <h4 class="text-white text-sm flex items-center">
                                <Clock class="w-5 h-5 mr-2" />
                                <p class="w-full truncate text-ellipsis pr-2">
                                    {{ group.date }}
                                </p>
                            </h4>
                        </div>
                        <div class="rounded text-sm bg-gray-100 border border-gray-300 h-10 flex justify-center items-center my-4">
                            {{ group.times }}
                        </div>

                        <div class="mt-8">
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Type(s) de soin(s) à effectuer
                                </h4>
                            </div>
                            <div class="mt-4 space-y-4">
                                <div class="bg-gray-200 text-sm py-2 rounded px-3">
                                    <span>{{ group.careTypes }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8">
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    {{ $t('replacements.roleSought') }}
                                </h4>
                            </div>
                            <div class="mt-4 space-y-4">
                                <div class="bg-gray-200 text-sm py-2 rounded px-3">
                                    <span>{{ roles[replacement.role_type] }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-200 mt-8">
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    Zone(s) géographique(s) couverte(s)
                                </h4>
                            </div>
                            <!-- <div class="py-16 px-3 space-y-3">
                                <div class="bg-white text-xs flex space-x-3 items-center h-9 w-full border border-primary rounded-full">
                                    <div class="bg-primary h-9 text-white flex justify-start px-2 items-center rounded-full w-32">
                                        <Home class="w-5 h-5" />
                                        <span>{{ $t('replacements.colZip') }}</span>
                                    </div>
                                    <span>{{ group.zipCodes }}</span>
                                </div>
                                <div class="bg-white text-xs flex space-x-3 items-center h-9 w-full border border-primary rounded-full">
                                    <div class="bg-primary h-9 text-white flex justify-start px-2 items-center rounded-full w-32">
                                        <Home class="w-5 h-5" />
                                        <span>{{ $t('replacements.colCities') }}</span>
                                    </div>
                                    <span>{{ group.cities }}</span>
                                </div>
                            </div> -->
                            <div class="py-6 px-3 space-y-4">
                                <div class="bg-white text-xs flex items-start space-x-3 min-h-[60px] w-full border border-primary rounded-2xl p-2">
                                    <div class="bg-primary text-white flex justify-start px-3 items-center rounded-full min-w-[140px] h-10 shrink-0">
                                        <Home class="w-5 h-5 mr-2" />
                                        <span>{{ $t('replacements.colZip') }}</span>
                                    </div>

                                    <div class="flex-1 text-gray-700 break-words whitespace-normal leading-5 py-1">
                                        {{ group.zipCodes }}
                                    </div>
                                </div>

                                <div class="bg-white text-xs flex items-start space-x-3 min-h-[60px] w-full border border-primary rounded-2xl p-2">
                                    <div class="bg-primary text-white flex justify-start px-3 items-center rounded-full min-w-[140px] h-10 shrink-0">
                                        <Home class="w-5 h-5 mr-2" />
                                        <span>{{ $t('replacements.colCities') }}</span>
                                    </div>

                                    <div class="flex-1 text-gray-700 break-words whitespace-normal leading-5 py-1">
                                        {{ group.cities }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="replacement.comment"
                            class="bg-gray-200 mt-8"
                        >
                            <div class="h-10 flex bg-primary rounded justify-center items-center">
                                <h4 class="text-white text-sm text-center">
                                    {{ $t('replacements.description') }}
                                </h4>
                            </div>
                            <div class="py-4 px-3 space-y-3">
                                <div class="mt-2 space-y-4">
                                    <div class="bg-gray-200 text-sm py-2 rounded px-3">
                                        <span>{{ replacement.comment }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div
            v-if="user && replacement.user_id !== user.id && replacement.status != 'closed' && ((isInstitution && canApplyReplacements) || replacement.role_type == user.account_type)"
            class="flex justify-center mt-12"
        >
            <div class="flex flex-row items-center space-x-32">
                    <Form
                    v-if="replacement?.candidate == false"
                    class="flex flex-col items-center justify-center gap-2"
                    @submit="onInterestClick"
                >
                    <Button
                        type="submit"
                        size="lg"
                        data-testid="replacement-apply-submit"
                        class="bg-primary text-white rounded-xl px-6 py-2 shadow hover:bg-primary/90 transition"
                        :disabled="isDisabled || inProgress || identifierSaving"
                        :in-progress="inProgress || identifierSaving"
                    >
                        {{ $t('replacements.imInterested') }}
                    </Button>
                </Form>

                <div
                    v-else
                    class="flex items-center gap-2 text-success font-semibold"
                >
                    <CircleCheck class="w-6 h-6" />
                    <span>{{ $t('replacements.responseSent') }}</span>
                </div>

                <div
                    v-if="isAdminOfReplacementGroup"
                    class="flex justify-center"
                >
                    <Button
                        size="lg"
                        class="bg-primary text-white rounded-xl px-6 py-2 shadow hover:bg-primary/90 transition"
                        @click="openAssignModal"
                    >
                        {{ $t('replacements.assignSubstitute') }}
                    </Button>
                </div>
            </div>
        </div>

        <Dialog v-model:open="isAssignModalOpen">
            <DialogContent class="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
                <DialogHeader class="text-lg font-semibold mb-4">
                    <DialogTitle>
                        {{ $t('replacements.assignSubstitute') }}
                    </DialogTitle>
                </DialogHeader>

                <p class="text-sm text-gray-500 mb-4">
                    Cliquez sur un membre pour l'assigner comme remplaçant.
                </p>

                <ul class="space-y-2 max-h-80 overflow-y-auto">
                    <template v-if="groupMembers.length > 0">
                        <li
                            v-for="member in groupMembers"
                            :key="member.id"
                            class="flex justify-between items-center border rounded p-2 hover:bg-gray-50 cursor-pointer"
                            @click="selectAndSubmitReplacement(member.user_id)"
                        >
                            <div class="flex items-center gap-2">
                                <User class="size-5 text-primary" />
                                <span>{{ member?.firstname }} {{ member?.lastname }}</span>
                            </div>
                            <ArrowRight class="size-5 text-primary" />
                        </li>
                    </template>
                    <template v-else>
                        <li class="text-sm text-gray-400 text-center py-4">
                            Personne à affecter à ce remplacement pour le moment.
                        </li>
                    </template>
                </ul>

                <div class="flex justify-end mt-4">
                    <Button
                        variant="secondary"
                        @click="isAssignModalOpen = false"
                    >
                        {{ $t('common.close') }}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <ReplacementBoostModal
            v-if="isReplacementOwner"
            v-model:open="boostModalOpen"
            :replacement="replacement"
            @cancelled="onBoostCancelled"
        />

        <Dialog v-model:open="inamiPromptOpen">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{{ $t('replacements.inamiNumber') }}</DialogTitle>
                    <Dialog{{ $t('replacements.description') }}>
                        Votre numéro INAMI n'est pas renseigné. Vous pouvez le saisir maintenant (optionnel) ou indiquer que vous ne l'avez pas à disposition.
                    </Dialog{{ $t('replacements.description') }}>
                </DialogHeader>
                <div class="space-y-4 py-2">
                    <Input
                        v-model="inamiDraft"
                        :placeholder="$t('replacements.inamiNumber')"
                        inputmode="numeric"
                    />
                    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                            variant="secondary"
                            :disabled="identifierSaving"
                            @click="confirmInamiUnavailable"
                        >
                            {{ $t('replacements.notAvailable') }}
                        </Button>
                        <Button
                            :disabled="identifierSaving"
                            :in-progress="identifierSaving"
                            @click="confirmInamiNumber"
                        >
                            {{ $t('replacements.continue') }}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ArrowRight, Calendar, CircleCheck, Clock, Home, User } from 'lucide-vue-next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import ReplacementBoostStars from '~/components/replacements/ReplacementBoostStars.vue';
import ReplacementDetailBoostBlock from '~/components/replacements/ReplacementDetailBoostBlock.vue';
import ReplacementShareButtons from '~/components/replacements/ReplacementShareButtons.vue';
import ReplacementBoostModal from '~/components/replacements/ReplacementBoostModal.vue';
import ReplacementBoostButton from '~/components/replacements/ReplacementBoostButton.vue';
import { extractStripeSessionId, isStripeCheckoutSessionId } from '~/utils/accessReturn';
import {
    buildAnalyticsSeenKey,
    buildBoostCelebrationDedupeKey,
    shouldTrackPurchaseAnalytics,
} from '~/utils/purchaseCelebration';
import { useDetailReplacement, sendResponse } from '~/composables/useReplacements';
import { useInstitutions } from '~/composables/useInstitution';
import { hasRealIdentifier, isBelgiumProfile } from '~/utils/educationLevel';
import { INAMI_FORMAT_ERROR, isValidInamiFormat } from '~/utils/inamiNumber';

const user = useState('user');
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { $toast } = useNuxtApp();
const { updateIdentifier } = useAuth();
const replacementId = route.params.id;
const showBoostOffer = ref(false);
const boostModalOpen = ref(false);
const inamiPromptOpen = ref(false);
const inamiDraft = ref('');
const identifierSaving = ref(false);
const { triggerCelebration } = usePurchaseCelebration();
const { confirmBoost } = useSubscription();
function trackBoostPaidOnce(sessionId: string, planDays: number | null) {
    if (!import.meta.client) {
        return;
    }

    const key = buildAnalyticsSeenKey('boost', sessionId);

    if (!shouldTrackPurchaseAnalytics(sessionId, sessionStorage.getItem(key))) {
        return;
    }

    useProductAnalytics().trackEvent('boost_paid', {
        replacement_id: String(replacementId),
        plan_days: planDays ?? 0,
        is_first_boost: true,
    });
    sessionStorage.setItem(key, sessionId);
}

async function processBoostReturn() {
    if (route.query.boost !== 'success') {
        return;
    }

    const sessionId = extractStripeSessionId(route.query);

    if (!sessionId || !isStripeCheckoutSessionId(sessionId)) {
        await router.replace({ path: route.path, query: {} });
        return;
    }

    let granted = false;
    let planDays = null;

    for (let attempt = 0; attempt < 4; attempt++) {
        const result = await confirmBoost(Number(replacementId), sessionId);

        if (result.outcome === 'active') {
            granted = true;
            planDays = result.planDays;
            break;
        }

        if (result.outcome === 'auth_error') {
            break;
        }

        if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    await fetchReplacement();
    await router.replace({ path: route.path, query: {} });

    if (!granted) {
        return;
    }

    trackBoostPaidOnce(sessionId, planDays);
    triggerCelebration({
        variant: 'boost',
        replacementId: Number(replacementId),
        dedupeKey: buildBoostCelebrationDedupeKey(Number(replacementId), sessionId),
        planDays,
    });
}

const { replacement, fetchReplacement } = useDetailReplacement(replacementId);
const { canBoostReplacement } = useReplacementBoost();

const isReplacementOwner = computed(() =>
    user.value?.id != null && Number(replacement.value?.user_id) === Number(user.value.id),
);

const canBoostThisReplacement = computed(() =>
    replacement.value ? canBoostReplacement(replacement.value, 'me') : false,
);

const openBoostPreview = () => {
    if (isReplacementOwner.value) {
        boostModalOpen.value = true;
    }
};

const openBoostActive = () => {
    if (isReplacementOwner.value) {
        boostModalOpen.value = true;
    }
};

const onBoostCancelled = async () => {
    replacement.value.is_boosted = false;
    replacement.value.boosted_until = null;
    await fetchReplacement();
};

const { isDisabled } = sendResponse();
const { isAdminGroup, isInstitution } = useAuth();
const { currentInstitution, getSettings } = useInstitutions();

if (isInstitution.value) {
    getSettings();
}

const canApplyReplacements = computed(() => {
    if (!isInstitution.value || !currentInstitution.value) {
        return false;
    }
    const canApply = currentInstitution.value.can_apply_replacements;
    return canApply === true || canApply === 1 || canApply === '1';
});
const { fetchGroupMembers } = useGroup();

const periodDialog = ref(false);

const periods = computed(() => replacement.value.periods || []);

const formData = reactive({
    replacementId: replacementId,
    comment: '',
});

const roles = {
    nurse: 'Infirmier(e)',
    caregiver: 'Aide soignant(e)',
    midwife: 'Sage-femme',
};

const goBack = () => {
    if (window.history.length > 1) {
        window.history.back();
    }
    else {
        navigateTo(isInstitution.value ? '/dashboard/institution/replacements' : '/dashboard/replacements');
    }
};

const groupedDetails = computed(() => {
    const grouped = {};

    if (replacement.value.periods && replacement.value.periods.length > 0) {
        const periodRanges = replacement.value.periods.map(
            period => `${formatDate(period.start_date)}-${formatDate(period.end_date)}`,
        ).join(', ');
        const groupKey = 'classic';

        grouped[groupKey] = {
            date: periodRanges,
            times: new Set(),
            careTypes: new Set(),
            zipCodes: new Set(),
            cities: new Set(),
        };

        if (replacement.value.timeSlot) {
            const timeSlot = JSON.parse(replacement.value.timeSlot);
            if (timeSlot.morning && timeSlot.evening) {
                if (timeSlot.morning.start_at && timeSlot.morning.end_at) {
                    grouped[groupKey].times.add(`${formatTime(timeSlot.morning.start_at)}-${formatTime(timeSlot.morning.end_at)}`);
                }
                if (timeSlot.evening.start_at && timeSlot.evening.end_at) {
                    grouped[groupKey].times.add(`${formatTime(timeSlot.evening.start_at)}-${formatTime(timeSlot.evening.end_at)}`);
                }
            }
            else if (timeSlot.start_at && timeSlot.end_at) {
                grouped[groupKey].times.add(`${formatTime(timeSlot.start_at)}-${formatTime(timeSlot.end_at)}`);
            }
        }

        replacement.value.care_types.forEach(care => grouped[groupKey].careTypes.add(care.name));
        JSON.parse(replacement.value.zip_codes).forEach(zipCode => grouped[groupKey].zipCodes.add(zipCode));
        JSON.parse(replacement.value.cities).forEach(city => grouped[groupKey].cities.add(city));
    }
    else if (replacement.value.details?.length > 0) {
        replacement.value.details.forEach((detail) => {
            if (!grouped[detail.date]) {
                grouped[detail.date] = {
                    date: detail.date,
                    times: new Set(),
                    careTypes: new Set(),
                    zipCodes: new Set(),
                    cities: new Set(),
                };
            }

            grouped[detail.date].times.add(`${formatTime(detail.start_at)}-${formatTime(detail.end_at)}`);
            replacement.value.care_types.forEach(care => grouped[detail.date].careTypes.add(care.name));
            JSON.parse(replacement.value.zip_codes).forEach(zipCode => grouped[detail.date].zipCodes.add(zipCode));
            JSON.parse(replacement.value.cities).forEach(city => grouped[detail.date].cities.add(city));
        });
    }
    else if (replacement.value.timeSlot) {
        const timeSlot = JSON.parse(replacement.value.timeSlot);
        const date = formatDate(replacement.value.start_date);
        grouped[date] = {
            date: date,
            times: new Set(),
            careTypes: new Set(),
            zipCodes: new Set(),
            cities: new Set(),
        };

        if (timeSlot.morning && timeSlot.evening) {
            if (timeSlot.morning.start_at && timeSlot.morning.end_at) {
                grouped[date].times.add(`${formatTime(timeSlot.morning.start_at)} - ${formatTime(timeSlot.morning.end_at)}`);
            }
            if (timeSlot.evening.start_at && timeSlot.evening.end_at) {
                grouped[date].times.add(`${formatTime(timeSlot.evening.start_at)} - ${formatTime(timeSlot.evening.end_at)}`);
            }
        }
        else if (timeSlot.start_at && timeSlot.end_at) {
            grouped[date].times.add(`${formatTime(timeSlot.start_at)}-${formatTime(timeSlot.end_at)}`);
        }

        replacement.value.care_types.forEach(care => grouped[date].careTypes.add(care.name));
        JSON.parse(replacement.value.zip_codes).forEach(zipCode => grouped[date].zipCodes.add(zipCode));
        JSON.parse(replacement.value.cities).forEach(city => grouped[date].cities.add(city));
    }
    else {
        const date = formatDate(replacement.value.start_date);
        grouped[date] = {
            date: date,
            times: new Set(),
            careTypes: new Set(),
            zipCodes: new Set(),
            cities: new Set(),
        };

        replacement.value.care_types.forEach(care => grouped[date].careTypes.add(care.name));
        JSON.parse(replacement.value.zip_codes).forEach(zipCode => grouped[date].zipCodes.add(zipCode));
        JSON.parse(replacement.value.cities).forEach(city => grouped[date].cities.add(city));
    }

    return Object.values(grouped).map(group => ({
        date: group.date,
        times: Array.from(group.times).join(' / '),
        careTypes: Array.from(group.careTypes).join(', '),
        zipCodes: Array.from(group.zipCodes).join(', '),
        cities: Array.from(group.cities).join(', '),
    }));
});

const {
    submit,
    inProgress,
} = useSubmit(
    async () => {
        const payload = {
            ...formData,
        };

        if (isInstitution.value && user.value?.institution_id) {
            payload.institutionId = user.value.institution_id;
            payload.respondedBy = null;
        }
        else {
            payload.respondedBy = user.value?.id ?? null;
            payload.institutionId = null;
        }

        const success = await sendResponse().submitResponse(payload);
        if (!success) {
            return;
        }
    },
    {
        onSuccess: () => {
            replacement.value.candidate = true;
        },
        onError: (error) => {
            console.error('Erreur lors de l\'envoi de la réponse:', error);
        },
    },
);

const needsInamiPrompt = computed(() => {
    if (isInstitution.value) {
        return false;
    }
    if (!user.value?.roles?.includes('nurse')) {
        return false;
    }
    if (!isBelgiumProfile({
        country: user.value?.country ?? user.value?.profile?.country,
        working_at: user.value?.profile?.working_at,
        profile: user.value?.profile,
    })) {
        return false;
    }
    if (user.value?.identifier_unavailable) {
        return false;
    }
    return !hasRealIdentifier(user.value);
});

async function onInterestClick() {
    if (needsInamiPrompt.value) {
        inamiDraft.value = '';
        inamiPromptOpen.value = true;
        return;
    }
    await submit();
}

async function confirmInamiUnavailable() {
    identifierSaving.value = true;
    try {
        await updateIdentifier({ identifierUnavailable: true });
        inamiPromptOpen.value = false;
        await submit();
    }
    catch (error) {
        console.error(error);
        $toast({
            title: 'Erreur',
            description: 'Impossible d\'enregistrer cette information.',
            variant: 'destructive',
        });
    }
    finally {
        identifierSaving.value = false;
    }
}

async function confirmInamiNumber() {
    const value = inamiDraft.value.trim();
    if (
        value
        && isBelgiumProfile({
            country: user.value?.country ?? user.value?.profile?.country,
            working_at: user.value?.profile?.working_at,
            profile: user.value?.profile,
        })
        && !isValidInamiFormat(value)
    ) {
        $toast({
            title: 'Erreur',
            description: INAMI_FORMAT_ERROR,
            variant: 'destructive',
        });
        return;
    }
    identifierSaving.value = true;
    try {
        if (value) {
            await updateIdentifier({
                identifierNumber: value,
                identifierUnavailable: false,
            });
        }
        else {
            await updateIdentifier({ identifierUnavailable: true });
        }
        inamiPromptOpen.value = false;
        await submit();
    }
    catch (error) {
        console.error(error);
        $toast({
            title: 'Erreur',
            description: `${t('replacements.inamiNumber')} invalide ou déjà utilisé.`,
            variant: 'destructive',
        });
    }
    finally {
        identifierSaving.value = false;
    }
}

const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

const startDate = computed(() => {
    return replacement.value.start_date ? formatDate(replacement.value.start_date) : '';
});

const endDate = computed(() => {
    return replacement.value.end_date ? formatDate(replacement.value.end_date) : '';
});

await fetchReplacement();
useProductAnalytics().trackEvent('replacement_viewed', {
    replacement_id: String(replacementId),
});

onMounted(async () => {
    if (route.query.boost === 'success') {
        await processBoostReturn();
    }
    else if (route.query.boost === 'offer') {
        if (canBoostThisReplacement.value) {
            showBoostOffer.value = true;
            useProductAnalytics().trackEvent('boost_impression', {
                source: 'post_create',
                replacement_id: String(replacementId),
                responses_count: replacement.value?.responses_count ?? 0,
                boost_tier: 'boost2',
            });
        }
        router.replace({ path: route.path, query: {} });
    }
    else if (route.query.boost === 'cancel') {
        $toast({ variant: 'destructive', description: 'Paiement annulé.' });
        router.replace({ path: route.path, query: {} });
    }
});

const isAdminOfReplacementGroup = computed(() => {
    if (!replacement.value?.group_ids) return false;

    return replacement.value.group_ids.some(groupId => isAdminGroup(groupId));
});

const groupMembers = ref([]);
const isAssignModalOpen = ref(false);
const selectedMemberId = ref(null);

const openAssignModal = async () => {
    if (!replacement.value?.group_ids) return;

    const members = await fetchGroupMembers(replacement.value.group_ids);

    const userNurseId = user.value?.id ?? null;
    const replacementUserId = replacement.value?.user_id ?? null;

    const filteredMembers = members.filter(member =>
        member.user_id !== userNurseId && member.user_id !== replacementUserId,
    );

    groupMembers.value = filteredMembers;

    isAssignModalOpen.value = true;
};

const selectAndSubmitReplacement = async (userId) => {
    selectedMemberId.value = userId;

    const payload = {
        ...formData,
        respondedBy: userId,
    };

    await sendResponse().submitResponse(payload);
    replacement.value.has_confirmed_substitute = true;
    replacement.value.confirmed_substitute = {
        id: userId,
        type: 'user',
    };
    isAssignModalOpen.value = false;
};

useHead({
    title: 'Détail de remplacement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
