<template>
    <div class="bg-white rounded-xl max-w-sm w-full overflow-hidden transition-all duration-300">
        <div class="relative h-36 bg-primary to-blue-700 flex items-center justify-center">
            <LayoutsAppImage :src="'logo_white.png'" alt="logo-InfiSwap" class="w-48 hover:cursor-pointer mb-8"
                format="png" />
            <img v-if="user.profil_url" :src="useRuntimeConfig().public.API_URL + '/storage/' + user.profil_url"
                alt="Photo de profil" class="absolute w-28 h-28 rounded-full border-4 border-white -bottom-14">
            <UserCircleIcon v-else
                class="absolute w-28 h-28 text-white bg-gray-300 rounded-full border-4 border-white -bottom-14" />
        </div>

        <div class="pt-20 px-6 text-center">
            <h1 class="text-2xl text-gray-800 dark:text-white mb-1">
                <span class="font-semibold text-primary">{{ user.firstname }}</span> <span class="text-primary">{{
                    user.lastname }}</span>
            </h1>
            <p class="text-gray-500 font-semibold mb-4">
                {{ user.gender === 'F' ? 'Infirmière' : 'Infirmier' }}
            </p>
        </div>

        <div
            v-if="isAdmin"
            class="px-6 text-left text-sm text-gray-700 mb-8"
        >
            <div class="flex gap-4 mb-4 border-b border-gray-300">
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'information' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'information'"
                >
                    Informations
                </button>
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'contact' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'contact'"
                >
                    Contact
                </button>
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'activite' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'activite'"
                >
                    Activité
                </button>
            </div>

            <div
                v-if="activeTab === 'activite'"
                class="space-y-3"
            >
                <div class="flex items-center gap-2">
                    <DocumentPlusIcon class="w-5 h-5 text-primary" />
                    <p>Remplacements créés : <span class="font-semibold">{{ activityData.replacements_created }}</span></p>
                </div>

                <div class="flex items-center gap-2">
                    <DocumentCheckIcon class="w-5 h-5 text-primary" />
                    <p>Remplacements acceptés : <span class="font-semibold">{{ activityData.replacements_accepted }}</span></p>
                </div>

                <div class="flex items-center gap-2">
                    <ArrowPathRoundedSquareIcon class="w-5 h-5 text-primary" />
                    <p>Positionnements : <span class="font-semibold">{{ activityData.placements_made }}</span></p>
                </div>

                <div class="flex items-center gap-2">
                    <CheckCircleIcon class="w-5 h-5 text-primary" />
                    <p>Positionnements acceptés : <span class="font-semibold">{{ activityData.placements_accepted }}</span></p>
                </div>

                <div
                    v-if="user.ambassador === 1"
                    class="flex items-center gap-2"
                >
                    <UserGroupIcon class="w-5 h-5 text-primary" />
                    <p>Infirmiers parrainés : <span class="font-semibold">--</span></p>
                </div>
            </div>

            <div
                v-else-if="activeTab === 'information'"
                class="space-y-3"
            >
                <p class="flex items-center gap-2 text-primary">
                    <EnvelopeIcon class="w-5 h-5" />
                    {{ user.email }}
                </p>
                <p class="flex items-center gap-2">
                    <PhoneIcon class="w-5 h-5 text-primary" />
                    {{ user.phone_number }}
                </p>
                <p class="flex items-center gap-2">
                    <BuildingOffice2Icon class="w-5 h-5 text-primary" />
                    {{ user.city }}
                </p>
                <p class="flex items-center gap-2">
                    <InboxArrowDownIcon class="w-5 h-5 text-primary" />
                    {{ user.zip_code }}
                </p>
                <p class="flex items-center gap-2">
                    <IdentificationIcon class="w-5 h-5 text-primary" />
                    {{ new Date(user.created_at).toLocaleDateString('fr-FR') }}
                </p>
            </div>

            <div
                v-else-if="activeTab === 'contact'"
                class="space-y-3"
            >
                <p>Date du contact : {{ new Date().toLocaleDateString('fr-FR') }}</p>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.biotrax ? CheckCircleIcon : XCircleIcon"
                        :class="user.biotrax ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>Biotrax</label>
                </div>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.insurance ? CheckCircleIcon : XCircleIcon"
                        :class="user.insurance ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>Assurances</label>
                </div>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.site ? CheckCircleIcon : XCircleIcon"
                        :class="user.site ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>Site</label>
                </div>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.ambassador ? CheckCircleIcon : XCircleIcon"
                        :class="user.ambassador ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>Ambassadeur</label>
                </div>
            </div>
        </div>
        <div
            v-else
            class="px-6"
        >
            <div class="my-4">
                <Separator class="w-full h-1 bg-gray-200" />
            </div>
            <div class="text-left text-sm text-gray-500 space-y-2 px-6">
                <p class="flex items-center gap-2">
                    <BuildingOffice2Icon class="w-5 h-5 text-primary" />
                    {{ user.city }}
                </p>
                <p class="flex items-center gap-2">
                    <InboxArrowDownIcon class="w-5 h-5 text-primary" />
                    {{ user.zip_code }}
                </p>
                <p class="flex items-center gap-2">
                    <PhoneIcon class="w-5 h-5 text-primary" />
                    {{ user.phone_number }}
                </p>
            </div>
            <div class="pb-10">
                <Separator class="w-full h-1 bg-gray-200 my-3" />
            </div>
        </div>
        <div class="bg-primary h-4 w-full rounded-b-xl" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
    UserCircleIcon,
    InboxArrowDownIcon,
    BuildingOffice2Icon,
    CheckCircleIcon,
    XCircleIcon,
    DocumentPlusIcon,
    DocumentCheckIcon,
    ArrowPathRoundedSquareIcon,
    UserGroupIcon,
    EnvelopeIcon,
    PhoneIcon,
    IdentificationIcon,
} from '@heroicons/vue/24/solid';
import type { User } from '~/lib/types';
import { useRuntimeConfig } from '#app';

const { isAdmin } = useAuth();
const activeTab = ref('information');

const props = defineProps<{
    user: User;
}>();

const { activityUser } = useReplacements();
const activityData = ref(null);

async function loadActivity() {
    if (!props.user || !props.user.id) return;
    try {
        const result = await activityUser(props.user.id);
        activityData.value = result.activity;
    }
    catch (e) {
        console.error('Erreur chargement activité utilisateur', e);
    }
}

loadActivity();
</script>
