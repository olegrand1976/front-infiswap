<template>
    <div class="min-w-0 w-full max-w-full overflow-x-hidden">
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
                        <BreadcrumbPage>{{ t('replacements.responsesTitle') }}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        <div class="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 class="font-secondary text-2xl sm:text-3xl font-semibold tracking-tight">
                    {{ t('replacements.responsesHeading') }} {{ t('replacements.responsesHeadingStrong') }}
                </h1>
                <p class="mt-2 text-sm text-muted-foreground">
                    {{ t('replacements.responsesHelpDesc') }}
                </p>
            </div>
            <Button
                href="/dashboard/replacements/create"
                class="rounded-md! inline-flex items-center gap-2"
            >
                <Plus class="size-4" />
                {{ t('nav.requestReplacement') }}
            </Button>
        </div>

        <template v-if="listResponse.length === 0">
            <div class="mt-10 flex flex-col items-center rounded-lg border border-dashed border-input bg-card px-6 py-16 text-center">
                <div class="mb-5 flex size-14 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Inbox class="size-7" />
                </div>
                <h2 class="font-secondary text-xl font-semibold">
                    {{ t('replacements.noResponsesTitle') }}
                </h2>
                <p class="mt-2 max-w-md text-sm text-muted-foreground">
                    {{ t('replacements.noResponsesDesc') }}
                </p>
                <Button
                    href="/dashboard/replacements/create"
                    class="rounded-md! mt-6 inline-flex items-center gap-2"
                >
                    <Plus class="size-4" />
                    {{ t('nav.requestReplacement') }}
                </Button>
            </div>
        </template>
        <template v-else>
            <div class="mt-8 flex flex-col gap-6">
                <div
                    v-for="(response, index) in listResponse"
                    :key="index"
                    class="rounded-lg border bg-card shadow-sm p-5"
                >
                    <div class="grid gap-6 lg:grid-cols-[300px_1fr]">
                        <div class="min-w-0">
                            <div class="mb-4 flex items-center justify-between gap-3">
                                <h3 class="font-secondary text-lg font-semibold">
                                    <template v-if="listResponse.length === 1">
                                        {{ t('replacements.period') }}
                                    </template>
                                    <template v-else>
                                        {{ t('replacements.period') }} {{ index + 1 }}
                                    </template>
                                </h3>

                                <Badge
                                    v-if="response.responses?.length != 0"
                                    class="bg-success text-success-foreground whitespace-nowrap"
                                >
                                    {{ response.responses?.length }}
                                    {{ response.responses?.length == 1 ? t('replacements.interested') : t('replacements.interestedPlural') }}
                                </Badge>
                            </div>

                            <div class="flex flex-col gap-3">
                                <div class="flex items-start gap-2.5">
                                    <CalendarRange class="size-4 shrink-0 text-primary mt-0.5" />
                                    <div class="min-w-0">
                                        <div class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                            {{ t('replacements.period') }}
                                        </div>
                                        <div class="text-sm">
                                            <template v-if="response?.parent?.start_date && response?.parent?.end_date">
                                                <template v-if="response.parent.start_date === response.parent.end_date">
                                                    {{ new Date(response.parent.start_date).toLocaleDateString('fr-FR') }}
                                                </template>
                                                <template v-else>
                                                    {{ new Date(response.parent.start_date).toLocaleDateString('fr-FR') }} -
                                                    {{ new Date(response.parent.end_date).toLocaleDateString('fr-FR') }}
                                                </template>
                                            </template>
                                            <template v-else-if="response?.parent?.periods.length > 0 ">
                                                <ul>
                                                    <li
                                                        v-for="(period) in response.parent.periods"
                                                        :key="period.id"
                                                    >
                                                        <template v-if="period.start_date === period.end_date">
                                                            {{ period.start_date }}   {{ new Date(period.start_date).toLocaleDateString('fr-FR') }}
                                                        </template>
                                                        <template v-else>
                                                            {{ new Date(period.start_date).toLocaleDateString('fr-FR') }} -
                                                            {{ new Date(period.end_date).toLocaleDateString('fr-FR') }}
                                                        </template>
                                                    </li>
                                                </ul>
                                            </template>
                                            <template v-else>
                                                {{ t('replacements.undefined') }}
                                            </template>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-start gap-2.5">
                                    <Clock class="size-4 shrink-0 text-primary mt-0.5" />
                                    <div class="min-w-0">
                                        <div class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                            {{ t('replacements.timeSlot') }}
                                        </div>
                                        <div class="text-sm">
                                            {{ formatTimeSlot(response?.parent?.time_slot) }}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-start gap-2.5">
                                    <Mailbox class="size-4 shrink-0 text-primary mt-0.5" />
                                    <div class="min-w-0">
                                        <div class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                            {{ t('replacements.colZip') }}
                                        </div>
                                        <div class="text-sm">
                                            {{ formatArray(response?.parent?.zip_codes) }}
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-start gap-2.5">
                                    <Building2 class="size-4 shrink-0 text-primary mt-0.5" />
                                    <div class="min-w-0">
                                        <div class="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                            {{ t('replacements.colCities') }}
                                        </div>
                                        <div class="text-sm">
                                            {{ formatArray(response?.parent?.cities) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="visibleResponses(response.responses).length != 0"
                            class="flex flex-col gap-2.5"
                        >
                            <div
                                v-for="responseDetail in visibleResponses(response.responses)"
                                :key="responseDetail.id"
                                class="grid grid-cols-1 items-center gap-3 rounded-md border border-input px-3.5 py-2.5 sm:grid-cols-[1fr_auto_auto]"
                            >
                                <div class="flex min-w-0 items-center gap-2.5">
                                    <span class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
                                        <img
                                            v-if="getRespondent(responseDetail)?.profil_url"
                                            class="size-8 object-cover object-center"
                                            :src="useRuntimeConfig().public.API_URL + '/storage/' + getRespondent(responseDetail)?.profil_url"
                                        >
                                        <CircleUser
                                            v-else
                                            class="size-4"
                                        />
                                    </span>
                                    <div class="min-w-0">
                                        <div class="truncate text-sm font-medium">
                                            {{ getRespondent(responseDetail)?.full_name }}
                                        </div>
                                        <div class="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Phone class="size-3 shrink-0" />
                                            <span class="truncate">{{ getRespondent(responseDetail)?.phone_number }} · {{ getRespondent(responseDetail)?.zip_code ?? '—' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <Badge
                                    v-if="responseDetail.status === 'confirmed'"
                                    class="bg-success text-success-foreground whitespace-nowrap"
                                >
                                    <BadgeCheck class="size-3" />
                                    {{ t('replacements.accepted') }}
                                </Badge>
                                <span
                                    v-else
                                    class="whitespace-nowrap text-xs text-muted-foreground"
                                >
                                    {{ t('replacements.statusPending') }}
                                </span>

                                <div class="flex items-center justify-end gap-1.5">
                                    <Button
                                        v-if="responseDetail.status === 'confirmed'"
                                        variant="outline"
                                        size="icon"
                                        class="size-8"
                                        :title="t('common.cancel')"
                                        @click="handleCancel(responseDetail)"
                                    >
                                        <X class="size-4" />
                                    </Button>
                                    <Button
                                        v-else
                                        variant="outline"
                                        size="icon"
                                        class="size-8"
                                        :title="t('replacements.accepted')"
                                        @click="handleAccept(responseDetail)"
                                    >
                                        <Check class="size-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        class="size-8"
                                        :title="t('replacements.detail')"
                                        @click="openNurseDialog(responseDetail)"
                                    >
                                        <Eye class="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p
                            v-else
                            class="py-6 text-center text-sm text-muted-foreground"
                        >
                            {{ t('replacements.empty') }}
                        </p>
                    </div>
                </div>
            </div>
        </template>

        <Dialog v-model:open="nurseDialog">
            <DialogContent class="sm:max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle
                        v-if="getRespondent(selectedUser)?.gender === 'F'"
                    >
                        Informations de l'infirmière
                    </DialogTitle>
                    <DialogTitle
                        v-else
                    >
                        Informations de l'infirmier
                    </DialogTitle>
                </DialogHeader>

                <div
                    v-if="selectedUser"
                    class="flex space-x-4 items-center mt-4"
                >
                    <LayoutsAppImage
                        :src="getRespondent(selectedUser)?.profil_url
                            ? useRuntimeConfig().public.API_URL + '/storage/' + getRespondent(selectedUser).profil_url
                            : '/icons/user-circle.png'"
                        class="w-8 h-8 sm:w-12 sm:h-12 rounded-full opacity-60"
                    />
                    <div class="flex flex-col space-y-2">
                        <h6 class="font-medium">
                            {{ getRespondent(selectedUser)?.full_name }}
                        </h6>
                    </div>
                </div>

                <div
                    v-if="selectedUser"
                    class="grid grid-cols-[40%_60%] border border-primary h-9 rounded-md items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-l-md text-primary-foreground font-semibold">
                        Numéro {{ identifierLabel }}
                    </h5>
                    <p class="ps-4">
                        {{ getRespondent(selectedUser)?.identifier_unavailable || !getRespondent(selectedUser)?.identifier_number
                            ? 'Pas de numéro INAMI renseigné'
                            : getRespondent(selectedUser)?.identifier_number }}
                    </p>
                </div>

                <div
                    v-if="selectedUser"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-md items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-l-md text-primary-foreground font-semibold">
                        <span class="hidden md:inline">Adresse e-mail</span>
                        <span class="md:hidden">Email</span>
                    </h5>
                    <p class="ps-4">
                        {{ getRespondent(selectedUser)?.email }}
                    </p>
                </div>

                <div
                    v-if="selectedUser"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-md items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-l-md text-primary-foreground font-semibold">
                        N° téléphone
                    </h5>
                    <p class="ps-4">
                        {{ getRespondent(selectedUser)?.phone_number }}
                    </p>
                </div>

                <div
                    v-if="selectedUser"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-md items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-l-md text-primary-foreground font-semibold">
                        Code postal
                    </h5>
                    <p class="ps-4">
                        {{ getRespondent(selectedUser)?.zip_code ?? '—' }}
                    </p>
                </div>

                <div
                    v-if="selectedUser"
                    class="mt-1 grid grid-cols-[40%_60%] border border-primary h-9 rounded-md items-center"
                >
                    <h5 class="h-9 flex ps-4 items-center bg-primary rounded-l-md text-primary-foreground font-semibold">
                        Ville
                    </h5>
                    <p class="ps-4">
                        {{ getRespondent(selectedUser)?.city ?? '—' }}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, BadgeCheck, Building2, CalendarRange, Check, CircleUser, Clock, Eye, Inbox, LayoutGrid, Mailbox, Phone, Plus, X } from 'lucide-vue-next';
import { useRuntimeConfig } from '#app';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getErrorMessage, goBack } from '~/lib/utils';
import { useListResponse, changeStatusReplacement } from '~/composables/useReplacements';
import type { ReplacementResponse, User } from '~/lib/types';

const { t } = useI18n();
const localePath = useLocalePath();

const user = useState<User>('user');
const { $toast } = useNuxtApp();
const { listResponse, getReplacementResponses } = useListResponse(user.value.id);
const { changeStatus } = changeStatusReplacement();
const nurseDialog = ref(false);
const selectedUser = ref(null);
const includeOlder = true;

const { identifierLabel } = useCountry();

useHead({
    title: () => t('replacements.responsesTitle'),
});

const visibleResponses = (responses: ReplacementResponse[]) => {
    const hasConfirmed = responses.some(response => response.status === 'confirmed');
    if (hasConfirmed) {
        return responses.filter(response => response.status === 'confirmed');
    }
    return responses;
};

const getRespondent = (responseDetail: ReplacementResponse) =>
    responseDetail.respondent
    ?? null;

const handleAccept = async (responseDetail: ReplacementResponse) => {
    try {
        await changeStatus(responseDetail.id, 'confirmed');
        responseDetail.status = 'confirmed';
    }
    catch (error) {
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
        console.error('Failed to update status:', error);
    }
};

const handleCancel = async (responseDetail: ReplacementResponse) => {
    try {
        await changeStatus(responseDetail.id, 'pending');
        responseDetail.status = 'pending';
        await getReplacementResponses(includeOlder);
    }
    catch (error) {
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
        console.error('Failed to update status:', error);
    }
};

const openNurseDialog = (responseDetail: ReplacementResponse) => {
    selectedUser.value = responseDetail;
    nurseDialog.value = true;
};

const formatArray = (jsonString: string) => {
    try {
        const array = JSON.parse(jsonString);
        return array.join(', ');
    }
    catch {
        return jsonString;
    }
};

const formatTimeSlot = (timeSlot: string) => {
    try {
        const slot = JSON.parse(timeSlot);

        const extractSlots = (obj): string[] => {
            const results: string[] = [];

            if (typeof obj !== 'object' || obj === null) {
                return results;
            }

            if ('start_at' in obj || 'end_at' in obj) {
                const start = obj.start_at ?? 'Non défini';
                const end = obj.end_at ?? 'Non défini';
                results.push(`${start} - ${end}`);
            }

            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    results.push(...extractSlots(obj[key]));
                }
            }

            return results;
        };

        return extractSlots(slot).join(' | ');
    }
    catch {
        return timeSlot;
    }
};

await getReplacementResponses(includeOlder);

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
mo
