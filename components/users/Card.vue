<template>
    <div class="bg-white rounded-xl max-w-full w-full overflow-hidden transition-all duration-300">
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
                <span class="font-semibold text-primary">{{ user.firstname }}</span> <span class="text-primary">{{
                    user.lastname }}</span>
            </h1>
            <p class="text-gray-500 font-semibold mb-4">
                {{ user.gender === 'F' ? 'Infirmière' : 'Infirmier' }}
                <template v-if="user.professional_category">
                    - {{ translatedCategory }}
                </template>
            </p>
        </div>

        <div
            v-if="isAdmin"
            class="px-6 text-left text-sm text-gray-700 mb-8 h-96 overflow-y-auto"
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
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'product' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'product'"
                >
                    Produit
                </button>
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'comment' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'comment'"
                >
                    Commentaire
                </button>
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'commercial' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'commercial'"
                >
                    Commercial
                </button>
            </div>

            <div
                v-if="activeTab === 'activite'"
                class="space-y-3 border border-gray-200 rounded-lg p-4"
            >
                <div
                    class="flex items-center gap-2 cursor-pointer"
                    title="Date de dernière post d'un remplacement"
                >
                    <CalendarDaysIcon class="w-5 h-5 text-primary" />
                    <p>Dernière post : <span class="font-semibold">{{ user.historic_activity?.last_post_date ?? '—' }}</span></p>
                </div>

                <div
                    class="flex items-center gap-2 cursor-pointer"
                    title="Date de dernière acceptation d'un remplacement"
                >
                    <CalendarDaysIcon class="w-5 h-5 text-primary" />
                    <p>Acceptation : <span class="font-semibold">{{ user.historic_activity?.last_accept_posted_date ?? '—' }}</span></p>
                </div>

                <div
                    class="flex items-center gap-2 cursor-pointer"
                    title="Date de dernière réponse à un remplacement posté"
                >
                    <CalendarDaysIcon class="w-5 h-5 text-primary" />
                    <p>Réponse : <span class="font-semibold">{{ user.historic_activity?.last_response_date ?? '—' }}</span></p>
                </div>

                <div
                    class="flex items-center gap-2 cursor-pointer"
                    title="Date de dernière acceptation sur un remplacement posté"
                >
                    <CalendarDaysIcon class="w-5 h-5 text-primary" />
                    <p>Accept. réponse : <span class="font-semibold">{{ user.historic_activity?.last_accept_response_date ?? '—' }}</span></p>
                </div>

                <div class="border-t border-gray-300 w-full my-2" />

                <div class="flex items-center gap-2">
                    <DocumentPlusIcon class="w-5 h-5 text-primary" />
                    <p>
                        Remplacements créés : <span class="font-semibold">{{ activityData.replacements_created }}</span>
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <DocumentCheckIcon class="w-5 h-5 text-primary" />
                    <p>
                        Remplacements acceptés : <span class="font-semibold">{{ activityData.replacements_accepted
                        }}</span>
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <ArrowPathRoundedSquareIcon class="w-5 h-5 text-primary" />
                    <p>Positionnements : <span class="font-semibold">{{ activityData.placements_made }}</span></p>
                </div>

                <div class="flex items-center gap-2">
                    <CheckCircleIcon class="w-5 h-5 text-primary" />
                    <p>
                        Positionnements acceptés : <span class="font-semibold">{{ activityData.placements_accepted }}</span>
                    </p>
                </div>

                <div class="border-t border-gray-300 w-full my-2" />

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
                class="space-y-3 border border-gray-200 rounded-lg p-4"
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
                class="space-y-3 border border-gray-200 rounded-lg p-4"
            >
                <p>
                    Date de dernier contact :
                    {{ user.contact_date ? new Date(user.contact_date).toLocaleDateString('fr-FR') : '- - -' }}
                </p>

                <p>Mode de contact : {{ user.contact_method ?? '- - -' }}</p>

                <p>
                    Date de dernière connexion :
                    {{
                        new Date(user.last_login_at ?? user.created_at).toLocaleDateString('fr-FR') + ' ' + new Date(user.last_login_at ?? user.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                    }}
                </p>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.insurance ? CheckCircleIcon : XCircleIcon"
                        :class="user.insurance ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>NursAssur</label>
                </div>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.site ? CheckCircleIcon : XCircleIcon"
                        :class="user.site ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>NursTech</label>
                </div>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.ambassador ? CheckCircleIcon : XCircleIcon"
                        :class="user.ambassador ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>Ambassadeur</label>
                </div>

                <div class="flex items-center gap-2">
                    <XCircleIcon class="text-gray-300 w-5 h-5" />
                    <label>Tournée</label>
                </div>
            </div>

            <div
                v-else-if="activeTab === 'product'"
                class="space-y-3 border border-gray-200 rounded-lg p-4"
            >
                <div
                    v-if="user.product_activity_summary && user.product_activity_summary.length"
                    class="space-y-4"
                >
                    <div
                        v-for="item in user.product_activity_summary"
                        :key="item.product_id"
                        class="p-4 border rounded-md bg-gray-50"
                    >
                        <h3 class="font-semibold text-primary">
                            {{ item.product_name }}
                        </h3>
                        <p>
                            Date du dernier clic :
                            <span class="font-medium">
                                {{ item.last_click_date ? formatDate(item.last_click_date) : 'Aucun clic' }}
                            </span>
                        </p>
                        <p>
                            Date du dernier contact :
                            <span class="font-medium">
                                {{ item.last_contact_date ? formatDate(item.last_contact_date) : 'Aucun contact' }}
                            </span>
                        </p>
                    </div>
                </div>

                <p
                    v-else
                    class="text-gray-500"
                >
                    Aucune activité produit enregistrée.
                </p>
            </div>

            <div
                v-else-if="activeTab === 'comment'"
                class="space-y-3"
            >
                <div class="relative">
                    <Textarea
                        v-model="comment"
                        disabled
                        class="w-full h-[9rem] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary peer"
                    />
                    <p class="text-sm text-gray-500 mt-1 hidden peer-focus:block">
                        Appuyez sur Entrée pour valider votre commentaire
                    </p>
                </div>
            </div>

            <div
                v-else-if="activeTab === 'commercial'"
                class="space-y-3"
            >
                <div class="relative border border-gray-200 rounded-lg p-4">
                    <div class="flex gap-4 mb-4 border-b border-gray-300">
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'call' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'call'"
                        >
                            Appels
                        </button>
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'sale' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'sale'"
                        >
                            Ventes
                        </button>
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'recommandation' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'recommandation'"
                        >
                            Recommandation
                        </button>
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'meeting' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'meeting'"
                        >
                            Rendez-vous
                        </button>
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'pending' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'pending'"
                        >
                            Réponse en attente
                        </button>
                    </div>
                    <div v-if="tradeTab === 'call'">
                        <h2 class="text-center italic font-semibold text-gray-700 mb-6">
                            Le nombre d’appels passés sur une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col md:flex-row md:items-end gap-4">
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col gap-1 w-full">
                                <label class="text-gray-500 text-sm font-medium">Nombre d'appels</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="tradeTab === 'sale'">
                        <h2 class="text-center italic font-semibold text-gray-700 mb-6">
                            Le nombre de ventes sur une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col md:flex-row md:items-end gap-4">
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col gap-1 w-full">
                                <p class="text-gray-700">
                                    Produit :
                                </p>
                                <Select v-model="form.produit_id">
                                    <SelectTrigger
                                        class="w-full bg-white rounded-lg text-nowrap border-2 border-gray-300"
                                        position="right"
                                    >
                                        <SelectValue placeholder="Choisis un produit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            v-for="product in products"
                                            :key="product.id"
                                            :value="String(product.id)"
                                        >
                                            {{ product.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <!-- <p class="mt-3 text-sm text-gray-600">
                                    Produit sélectionné ID : <span class="font-semibold">{{ form.produit_id }}</span>
                                </p> -->
                            </div>

                            <div class="flex flex-col gap-1 w-full">
                                <label class="text-gray-500 text-sm font-medium">Nombre de ventes</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    v-model="form.number"
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="tradeTab === 'recommandation'">
                        <h2 class="text-center italic font-semibold text-gray-700 mb-6">
                            Le nombre de recommandation sur une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col md:flex-row md:items-end gap-4">
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col gap-1 w-full">
                                <label class="text-gray-500 text-sm font-medium">Nombre de recommandation</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="tradeTab === 'meeting'">
                        <h2 class="text-center italic font-semibold text-gray-700 mb-6">
                            Le nombre de rendez-vous sur une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col md:flex-row md:items-end gap-4">
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col gap-1 w-full">
                                <label class="text-gray-500 text-sm font-medium">Nombre de rendez-vous</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="tradeTab === 'pending'">
                        <h2 class="text-center italic font-semibold text-gray-700 mb-6">
                            Le nombre de réponse en attente pendant une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col md:flex-row md:items-end gap-4">
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                                <div class="flex flex-col gap-1 w-full">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 bg-gray-200 rounded-lg border-none px-3"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col gap-1 w-full">
                                <label class="text-gray-500 text-sm font-medium">Nombre de réponse en attente</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
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
                <template v-if="minimalInfo">
                    <p class="flex items-center gap-2">
                        <BuildingOffice2Icon class="w-5 h-5 text-primary" />
                        {{ user.city || user.profile.city || 'Non renseigné' }}
                    </p>
                    <p class="flex items-center gap-2">
                        <InboxArrowDownIcon class="w-5 h-5 text-primary" />
                        {{ user.zip_code || user.profile.zip_code || 'Non renseigné' }}
                    </p>
                </template>
                <template v-else-if="showFullInfo">
                    <p class="flex items-center gap-2 text-primary">
                        <EnvelopeIcon class="w-5 h-5" />
                        {{ user.email || 'Non renseigné' }}
                    </p>
                    <p class="flex items-center gap-2">
                        <LayoutsAppImage
                            src="/icons/gender.png"
                            class="h-5"
                        />
                        {{
                            user.gender === 'F' ? 'Femme'
                            : user.gender === 'M' ? 'Homme'
                                : user.gender || 'Non renseigné'
                        }}
                    </p>
                    <p class="flex items-center gap-2">
                        <PhoneIcon class="w-5 h-5 text-primary" />
                        {{ user.phone_number || 'Non renseigné' }}
                    </p>
                    <p class="flex items-center gap-2">
                        <BuildingOffice2Icon class="w-5 h-5 text-primary" />
                        {{ user.city || user.profile.city || 'Non renseigné' }}
                    </p>
                    <p class="flex items-center gap-2">
                        <InboxArrowDownIcon class="w-5 h-5 text-primary" />
                        {{ user.zip_code || user.profile.zip_code || 'Non renseigné' }}
                    </p>
                    <p class="flex items-center gap-2">
                        <IdentificationIcon class="w-5 h-5 text-primary" />
                        {{ user.identifier_number || 'Non renseigné' }}
                    </p>
                </template>
                <template v-else>
                    <p class="flex items-center gap-2">
                        <BuildingOffice2Icon class="w-5 h-5 text-primary" />
                        {{ user.city || user.profile.city || 'Non renseigné' }}
                    </p>
                    <p class="flex items-center gap-2">
                        <InboxArrowDownIcon class="w-5 h-5 text-primary" />
                        {{ user.zip_code || user.profile.zip_code || 'Non renseigné' }}
                    </p>
                    <p class="flex items-center gap-2">
                        <PhoneIcon class="w-5 h-5 text-primary" />
                        {{ user.phone_number || 'Non renseigné' }}
                    </p>
                </template>
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
    CalendarDaysIcon,
} from '@heroicons/vue/24/solid';
import type { User } from '~/lib/types';
import { useRuntimeConfig } from '#app';

const { isAdmin } = useAuth();
const activeTab = ref('information');
const tradeTab = ref('call');

const props = withDefaults(defineProps<{
    user: User;
    showFullInfo?: boolean;
    minimalInfo?: boolean;
}>(), {
    showFullInfo: false,
    minimalInfo: false,
});

const { activityUser } = useReplacements();
const { getAll } = useProduct();
const { crmUser } = useCrm();
const activityData = ref(null);

const products = ref<{ id: number; name: string }[]>([]);
// const selectedProduct = ref<string>('');

onMounted(async () => {
    const result = await getAll();
    products.value = result;
});

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

const translatedCategory = computed(() => {
    if (!props.user.professional_category) return '';

    const isFemale = props.user.gender === 'F';

    if (props.user.professional_category === 'salaried') {
        return isFemale ? 'Salariée' : 'Salarié';
    }

    if (props.user.professional_category === 'independent') {
        return isFemale ? 'Indépendante' : 'Indépendant';
    }

    return props.user.professional_category;
});

const { $toast } = useNuxtApp();

const form = ref({
    start_date: '',
    end_date: '',
    produit_id: null,
    number: '',
    type: '',
});

watch(tradeTab, (val) => {
    form.value.type = val;
}, { immediate: true });

const { submit, inProgress } = useSubmit(async () => {
    await crmUser(form.value);
}, {
    onSuccess: () => {
        $toast({
            description: 'Données mis à jour avec succès',
        });
    },
});

const comment = ref(props.user.comment_crm ?? '');

loadActivity();

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}
</script>
