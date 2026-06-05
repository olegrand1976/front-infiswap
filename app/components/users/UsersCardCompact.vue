<template>
    <div class="w-full max-w-full overflow-hidden rounded-t-xl bg-white">
        <div class="relative flex h-28 items-center justify-center bg-primary to-blue-700">
            <LayoutsAppImage
                :src="'logo_white.png'"
                alt="InfiSwap"
                class="pointer-events-none w-32 opacity-95"
                format="png"
            />

            <div class="absolute -bottom-11 left-1/2 flex -translate-x-1/2">
                <template v-if="institution">
                    <InstitutionLogoOrIcon
                        :name="institution.name"
                        :logo="institution.logo"
                        size="md"
                    />
                </template>
                <template v-else-if="user">
                    <div
                        class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-md"
                    >
                        <template v-if="!nursePhotoUrl">
                            <UserCircle
                                class="h-12 w-12 text-primary/70"
                                :stroke-width="1.25"
                            />
                        </template>
                        <ClientOnly v-else>
                            <img
                                v-if="!nursePhotoError"
                                :src="nursePhotoUrl"
                                alt=""
                                class="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                                @error="nursePhotoError = true"
                            >
                            <UserCircle
                                v-else
                                class="h-12 w-12 text-primary/70"
                                :stroke-width="1.25"
                            />
                            <template #fallback>
                                <UserCircle
                                    class="h-12 w-12 text-primary/70"
                                    :stroke-width="1.25"
                                />
                            </template>
                        </ClientOnly>
                    </div>
                </template>
            </div>
        </div>

        <div class="border-b border-gray-100 px-4 pb-3 pt-12 text-center">
            <p class="text-[10px] font-semibold uppercase tracking-wide text-primary">
                {{ roleLabel }}
            </p>
            <h2 class="mt-1 text-lg font-semibold leading-snug text-gray-900">
                {{ mainTitle }}
            </h2>
            <p
                v-if="secondaryLine"
                class="mt-1 text-sm text-gray-500"
            >
                {{ secondaryLine }}
            </p>
        </div>

        <div
            v-if="user && showFullInfo"
            class="space-y-2 border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-600"
        >
            <p
                v-if="user.email"
                class="flex items-center gap-2"
            >
                <Mail
                    class="h-4 w-4 shrink-0 text-primary"
                    :stroke-width="2"
                />
                <span class="truncate">{{ user.email }}</span>
            </p>
            <p
                v-if="user.phone_number"
                class="flex items-center gap-2"
            >
                <Phone
                    class="h-4 w-4 shrink-0 text-primary"
                    :stroke-width="2"
                />
                <span>{{ user.phone_number }}</span>
            </p>
        </div>
        <div
            v-else-if="user && !showFullInfo"
            class="space-y-2 border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-600"
        >
            <p
                v-if="cityLine"
                class="flex items-center gap-2"
            >
                <MapPin
                    class="h-4 w-4 shrink-0 text-primary"
                    :stroke-width="2"
                />
                <span>{{ cityLine }}</span>
            </p>
            <p
                v-if="user.phone_number"
                class="flex items-center gap-2"
            >
                <Phone
                    class="h-4 w-4 shrink-0 text-primary"
                    :stroke-width="2"
                />
                <span>{{ user.phone_number }}</span>
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Mail, MapPin, Phone, UserCircle } from 'lucide-vue-next';
import type { User } from '~/lib/types';

const props = withDefaults(
    defineProps<{
        institution: { id: number; name: string; logo?: string | null } | null;
        user: User | null;
        showFullInfo?: boolean;
    }>(),
    {
        showFullInfo: false,
    },
);

const { getStorageUrl } = useStorageUrl();

const nursePhotoError = ref(false);

watch(
    () => props.user?.profil_url || props.user?.profile?.profil_url,
    () => {
        nursePhotoError.value = false;
    },
);

const nursePhotoUrl = computed(() => {
    const u = props.user;
    if (!u) return null;
    return getStorageUrl(u.profil_url || u.profile?.profil_url);
});

const roleLabel = computed(() => {
    if (props.institution) return 'Institution';
    if (props.user) return props.user.gender === 'F' ? 'Infirmière' : 'Infirmier';
    return '';
});

const mainTitle = computed(() => {
    if (props.institution) return props.institution.name;
    const u = props.user;
    if (!u) return '';
    const full = u.full_name?.trim();
    if (full) return full;
    return [u.firstname, u.lastname].filter(Boolean).join(' ');
});

const secondaryLine = computed(() => {
    if (props.institution) return null;
    const u = props.user;
    if (!u?.professional_category) return null;
    const isFemale = u.gender === 'F';
    if (u.professional_category === 'salaried') return isFemale ? 'Salariée' : 'Salarié';
    if (u.professional_category === 'independent') return isFemale ? 'Indépendante' : 'Indépendant';
    return u.professional_category;
});

const cityLine = computed(() => {
    const u = props.user;
    if (!u) return '';
    const city = u.profile?.city ?? u.city;
    const zip = u.profile?.zip_code ?? u.zip_code;
    if (city && zip) return `${zip} ${city}`;
    return city || zip || '';
});
</script>
