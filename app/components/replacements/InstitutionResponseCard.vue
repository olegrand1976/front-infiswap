<template>
    <div class="flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground transition-all duration-300">
        <div class="relative flex h-36 items-center justify-center bg-primary">
            <LayoutsAppImage
                :src="'logo_white.png'"
                alt="logo-InfiSwap"
                class="w-48 mb-8 hover:cursor-pointer"
                format="png"
            />
            <img
                v-if="logoUrl"
                :src="logoUrl"
                :alt="institution.name"
                class="absolute -bottom-14 h-28 w-28 rounded-lg border-4 border-background object-cover bg-card"
            >
            <div
                v-else
                class="absolute -bottom-14 flex h-28 w-28 items-center justify-center rounded-lg border-4 border-background bg-muted text-primary"
                aria-hidden="true"
            >
                <Building2
                    class="w-14 h-14 shrink-0"
                    stroke-width="1.5"
                />
            </div>
        </div>

        <div class="px-5 pt-20 text-center">
            <h1
                class="mb-1 min-h-[3.5rem] text-2xl leading-snug text-card-foreground line-clamp-2 break-words hyphens-auto"
            >
                <span class="font-semibold text-primary">{{ institution.name }}</span>
            </h1>
            <p class="mb-0 min-h-[2.75rem] font-semibold leading-snug text-muted-foreground">
                Institution
            </p>
        </div>

        <div class="flex min-h-0 flex-1 flex-col px-5">
            <Separator class="mt-4 h-px w-full shrink-0" />
            <div class="grid min-h-0 flex-1 grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2.5 py-4 text-left text-sm text-muted-foreground">
                <template v-if="showFullInfo">
                    <PhoneIcon class="size-5 shrink-0 text-primary" />
                    <span class="min-w-0 break-words leading-snug">{{ displayPhone }}</span>
                    <MapPinIcon class="size-5 shrink-0 text-primary" />
                    <span class="min-w-0 break-words leading-snug">{{ institution.street_address || '—' }}</span>
                    <BuildingOffice2Icon class="size-5 shrink-0 text-primary" />
                    <span class="min-w-0 break-words leading-snug">{{ displayCity }}</span>
                    <InboxArrowDownIcon class="size-5 shrink-0 text-primary" />
                    <span class="min-w-0 break-words leading-snug">{{ displayZip }}</span>
                    <IdentificationIcon class="size-5 shrink-0 text-primary" />
                    <span class="min-w-0 break-words leading-snug">{{ displayCompanyNumber }}</span>
                </template>
                <template v-else>
                    <BuildingOffice2Icon class="size-5 shrink-0 text-primary" />
                    <span class="min-w-0 break-words leading-snug">{{ displayCity }}</span>
                    <InboxArrowDownIcon class="size-5 shrink-0 text-primary" />
                    <span class="min-w-0 break-words leading-snug">{{ displayZip }}</span>
                    <PhoneIcon class="size-5 shrink-0 text-primary" />
                    <span class="min-w-0 break-words leading-snug">{{ displayPhone }}</span>
                </template>
            </div>
            <Separator class="mb-0 h-px w-full shrink-0" />
        </div>
        <div class="h-4 w-full shrink-0 rounded-b-xl bg-primary" />
    </div>
</template>

<script lang="ts" setup>
import {
    BuildingOffice2Icon,
    IdentificationIcon,
    InboxArrowDownIcon,
    MapPinIcon,
    PhoneIcon,
} from '@heroicons/vue/24/solid';
import { Building2 } from 'lucide-vue-next';
import { useInstitutions } from '~/composables/useInstitution';

export type InstitutionResponsePayload = {
    id: number;
    name: string;
    logo?: string | null;
    phone_number?: string | null;
    company_number?: string | null;
    city?: string | null;
    zip_code?: string | number | null;
    street_address?: string | null;
    country?: string | null;
};

const props = withDefaults(defineProps<{
    institution: InstitutionResponsePayload;
    showFullInfo?: boolean;
}>(), {
    showFullInfo: false,
});

const { getLogoUrl } = useInstitutions();

const logoUrl = computed(() => {
    const logo = props.institution.logo;
    if (!logo) return null;
    if (typeof logo === 'string' && (logo.startsWith('http://') || logo.startsWith('https://'))) {
        return logo;
    }
    return getLogoUrl(logo) || null;
});

const displayPhone = computed(() => props.institution.phone_number || 'Non renseigné');
const displayCity = computed(() => props.institution.city || 'Non renseigné');
const displayZip = computed(() => {
    const z = props.institution.zip_code;
    if (z === null || z === undefined || z === '') return 'Non renseigné';
    return String(z);
});
const displayCompanyNumber = computed(() => props.institution.company_number || 'Non renseigné');
</script>
