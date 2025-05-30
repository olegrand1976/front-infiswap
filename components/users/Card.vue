<template>
    <div class="bg-white rounded-xl max-w-sm w-full overflow-hidden transition-all duration-300">
        <div class="relative h-36 bg-primary to-blue-700 flex items-center justify-center">
            <LayoutsAppImage
                :src="'logo_white.png'"
                alt="logo-InfiSwap"
                class="w-48 hover:cursor-pointer mb-8"
                format="png"
            />
            <img
                v-if="user.profil_url"
                :src="useRuntimeConfig().public.API_URL + '/storage/' + user.profil_url"
                alt="Photo de profil"
                class="absolute w-28 h-28 rounded-full border-4 border-white -bottom-14"
            >
            <UserCircleIcon
                v-else
                class="absolute w-28 h-28 text-white bg-gray-300 rounded-full border-4 border-white -bottom-14"
            />
        </div>

        <div class="pt-20 px-6 text-center">
            <h1 class="text-2xl text-gray-800 dark:text-white mb-1">
                <span class="font-semibold text-primary">{{ user.firstname }}</span> <span class="text-primary">{{ user.lastname }}</span>
            </h1>
            <p class="text-gray-500 font-semibold mb-4">
                {{ user.gender === 'F' ? 'Infirmière' : 'Infirmier' }}
            </p>
        </div>

        <div class="px-6">
            <div class="my-4">
                <Separator class="w-full h-1 bg-gray-200" />
            </div>
            <div class="text-left text-sm text-gray-500 space-y-2 px-6">
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
                    {{ user.identifier_number }}
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
import {
    IdentificationIcon,
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    InboxArrowDownIcon,
    BuildingOffice2Icon,
} from '@heroicons/vue/24/solid';
import type { User } from '~/lib/types';
import { useRuntimeConfig } from '#app';

defineProps<{
    user: User;
}>();
</script>
