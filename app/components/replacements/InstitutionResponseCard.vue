<template>
    <div class="flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden rounded-lg bg-card text-card-foreground transition-all duration-300">
        <div
            class="relative flex items-center justify-center bg-primary"
            :class="compact ? 'h-24' : 'h-36'"
        >
            <LayoutsAppImage
                :src="'logo_white.png'"
                alt="logo-InfiSwap"
                :class="compact ? 'mb-2 w-28 hover:cursor-pointer' : 'mb-8 w-48 hover:cursor-pointer'"
                format="png"
            />
            <img
                v-if="logoUrl"
                :src="logoUrl"
                :alt="institution.name"
                class="absolute rounded-lg border-background object-cover bg-card"
                :class="compact ? '-bottom-7 h-16 w-16 border-2' : '-bottom-14 h-28 w-28 border-4'"
            >
            <div
                v-else
                class="absolute flex items-center justify-center rounded-lg border-background bg-muted text-primary"
                :class="compact ? '-bottom-7 h-16 w-16 border-2' : '-bottom-14 h-28 w-28 border-4'"
                aria-hidden="true"
            >
                <Building2
                    :class="compact ? 'size-8 shrink-0' : 'h-14 w-14 shrink-0'"
                    stroke-width="1.5"
                />
            </div>
        </div>

        <div
            class="text-center"
            :class="compact ? 'px-3 pt-11' : 'px-5 pt-20'"
        >
            <h1
                class="mb-0.5 line-clamp-2 break-words leading-snug text-card-foreground hyphens-auto"
                :class="compact ? 'min-h-[2.25rem] text-base' : 'min-h-[3.5rem] text-2xl'"
            >
                <span class="font-semibold text-primary">{{ institution.name }}</span>
            </h1>
            <p
                class="mb-0 font-semibold leading-snug text-muted-foreground"
                :class="compact ? 'min-h-[1.25rem] text-xs' : 'min-h-[2.75rem] text-base'"
            >
                Institution
            </p>
        </div>

        <div
            class="flex min-h-0 flex-1 flex-col"
            :class="compact ? 'px-3' : 'px-5'"
        >
            <Separator
                class="h-px w-full shrink-0"
                :class="compact ? 'mt-2' : 'mt-4'"
            />
            <div
                class="grid min-h-0 flex-1 items-start text-left text-muted-foreground"
                :class="compact
                    ? 'grid-cols-[1rem_minmax(0,1fr)] gap-x-2 gap-y-1 py-2 text-xs'
                    : 'grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-2.5 py-4 text-sm'"
            >
                <template v-if="showFullInfo">
                    <Phone
                        class="shrink-0 text-primary"
                        :class="compact ? 'size-4' : 'size-5'"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ displayPhone }}</span>
                    <MapPin
                        class="shrink-0 text-primary"
                        :class="compact ? 'size-4' : 'size-5'"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ institution.street_address || '—' }}</span>
                    <Building2
                        class="shrink-0 text-primary"
                        :class="compact ? 'size-4' : 'size-5'"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ displayCity }}</span>
                    <Inbox
                        class="shrink-0 text-primary"
                        :class="compact ? 'size-4' : 'size-5'"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ displayZip }}</span>
                    <IdCard
                        class="shrink-0 text-primary"
                        :class="compact ? 'size-4' : 'size-5'"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ displayCompanyNumber }}</span>
                </template>
                <template v-else>
                    <Building2
                        class="shrink-0 text-primary"
                        :class="compact ? 'size-4' : 'size-5'"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ displayCity }}</span>
                    <Inbox
                        class="shrink-0 text-primary"
                        :class="compact ? 'size-4' : 'size-5'"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ displayZip }}</span>
                    <Phone
                        class="shrink-0 text-primary"
                        :class="compact ? 'size-4' : 'size-5'"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ displayPhone }}</span>
                </template>
            </div>
            <Separator class="mb-0 h-px w-full shrink-0" />
        </div>
        <div
            class="w-full shrink-0 rounded-b-lg bg-primary"
            :class="compact ? 'h-2' : 'h-4'"
        />
    </div>
</template>

<script lang="ts" setup>
import { Building2, IdCard, Inbox, MapPin, Phone } from 'lucide-vue-next';
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
    /** Carte dense (ex. grille liste remplacements) */
    compact?: boolean;
}>(), {
    showFullInfo: false,
    compact: false,
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
