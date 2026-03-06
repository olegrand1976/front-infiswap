<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <div class="flex mt-8">
            <Form class="grid grid-cols-1 sm:grid-cols-5 2xl:grid-cols-6 w-full gap-4">
                <div class="col-span-4 md:col-span-2 lg:col-span-1 lg:w-52 2xl:w-72">
                    <FormField name="days">
                        <FormItem>
                            <FormControl>
                                <div class="flex bg-primary space-x-3 rounded-full items-center justify-between ps-3 pe-1">
                                    <h5 class="text-white text-xs">
                                        Jours
                                    </h5>
                                    <Select>
                                        <SelectTrigger
                                            class="bg-white my-0.5 w-56 lg:w-36 2xl:w-52 rounded-full border-none text-xs"
                                            position="right"
                                        >
                                            <SelectValue
                                                :placeholder="selectedDaysPlaceholder"
                                                class="text-xs truncate"
                                            />
                                        </SelectTrigger>
                                        <SelectContent class="border-none">
                                            <SelectGroup class="w-32">
                                                <div
                                                    v-for="(day, index) in days"
                                                    :key="index"
                                                    class="flex items-center mb-2"
                                                >
                                                    <Checkbox
                                                        class="mr-2"
                                                        :checked="formData.selectedDays.includes(day)"
                                                        @update:checked="toggleDay(day)"
                                                    />
                                                    <label class="text-xs">{{ frenchDays[day] }}</label>
                                                </div>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>

                <div class="col-span-4 md:col-span-2 lg:w-64 lg:ml-6 xl:ml-0 xl:w-88 2xl:ml-16 2xl:w-104">
                    <FormField name="postalCode">
                        <FormItem>
                            <FormControl>
                                <div
                                    class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1"
                                    title="Saisissez le code postal puis appuyer sur Entrée pour l'ajouter"
                                >
                                    <h5 class="text-white text-xs">
                                        <span class="xl:hidden">CP</span>
                                        <span class="hidden xl:inline-block">Codes postaux</span>
                                    </h5>
                                    <TagsInput
                                        v-model="formData.postalCodeTags"
                                        class="w-56 2xl:w-72 flex items-center h-9 text-xs my-0.5 rounded-full border-none"
                                    >
                                        <div
                                            :class="[formData.postalCodeTags.length ? 'w-1/2' : 'hidden']"
                                            class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar"
                                        >
                                            <TagsInputItem
                                                v-for="item in formData.postalCodeTags"
                                                :key="item"
                                                :value="item"
                                                class="shrink-0 max-w-30"
                                            >
                                                <TagsInputItemText class="text-xs" />
                                                <TagsInputItemDelete @click="removeTag(formData.postalCodeTags, item)" />
                                            </TagsInputItem>
                                        </div>
                                        <TagsInputInput
                                            v-model="postalCodeInput"
                                            :class="[formData.postalCodeTags.length ? 'w-1/2' : 'w-full']"
                                            class="text-xs flex items-center"
                                            :placeholder="props.selectedCountry === 'fr' ? '75000' : '1000'"
                                            @blur="handleBlur"
                                            @keydown.enter="addTagFromInput(postalCodeInput, formData.postalCodeTags, v => { postalCodeInput = ''; return v; })"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>

                <div class="col-span-4 md:col-span-2 lg:col-span-1 lg:-ml-26 xl:-ms-16 lg:w-72 2xl:w-104 2xl:ml-4">
                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                                <div
                                    class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1"
                                    title="Saisissez la ville puis appuyer sur Entrée pour l'ajouter"
                                >
                                    <h5 class="text-white text-xs">
                                        Ville(s)
                                    </h5>
                                    <TagsInput
                                        v-model="formData.cityTags"
                                        class="w-56 2xl:w-72 flex items-center h-9 text-xs my-0.5 rounded-full border-none"
                                    >
                                        <div
                                            :class="[formData.cityTags.length ? 'w-1/2' : 'hidden']"
                                            class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar"
                                        >
                                            <TagsInputItem
                                                v-for="item in formData.cityTags"
                                                :key="item"
                                                :value="item"
                                                class="shrink-0 max-w-24"
                                            >
                                                <TagsInputItemText class="text-xs" />
                                                <TagsInputItemDelete @click="removeTag(formData.cityTags, item)" />
                                            </TagsInputItem>
                                        </div>
                                        <TagsInputInput
                                            v-model="cityInput"
                                            :class="[formData.cityTags.length ? 'w-1/2' : 'w-full']"
                                            class="text-xs flex items-center"
                                            :placeholder="props.selectedCountry === 'fr' ? 'Paris' : 'Bruxelles'"
                                            @blur="handleBlur"
                                            @keydown.enter="addTagFromInput(cityInput, formData.cityTags, v => { cityInput = ''; return v; })"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>

                <div class="col-span-4 md:col-span-2 lg:col-span-1 2xl:ml-52 flex gap-3">
                    <Button
                        class="bg-primary flex items-center justify-center text-sm h-11 px-4 w-full md:w-auto"
                        @click="reinitializeFilter"
                    >
                        <ArrowPathIcon class="w-6" />
                        <span class="ml-2 block lg:hidden text-xs md:text-sm">Réinitialiser</span>
                    </Button>
                    <Button
                        class="text-sm bg-primary flex items-center justify-center h-11 px-4 w-full md:w-auto 2xl:px-10"
                        @click="submitSearch"
                    >
                        <MagnifyingGlassIcon class="w-6" />
                        <span class="ml-2 text-xs md:text-sm">Rechercher</span>
                    </Button>
                </div>
            </Form>
        </div>

        <ClientOnly>
            <div class="grid my-8">
                <div
                    v-if="isCardMode && availableMissions.length > 0"
                    class="mb-8"
                >
                    <h2 class="font-semibold text-black/70 mb-4">
                        Missions disponibles ({{ availableMissions.length }})
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <MissionCard
                            v-for="mission in availableMissions"
                            :key="`mission-${mission.id}`"
                            :mission="mission"
                        />
                    </div>
                </div>

                <template v-if="props.groupByProvince && Object.keys(groupsByProvince).length > 0">
                    <div
                        v-for="(group, province) in groupsByProvince"
                        :key="province"
                        class="mb-8"
                    >
                        <h2 class="font-semibold text-black/70 mb-4">
                            {{ province }} ({{ group.length }})
                        </h2>

                        <template v-if="isCardMode">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <template v-if="loading || loadingSearch">
                                    <ReplacementCardSkeleton
                                        v-for="i in 6"
                                        :key="`sk-${i}`"
                                    />
                                </template>
                                <template v-else>
                                    <ReplacementCard
                                        v-for="r in group"
                                        :key="`r-${r.id}`"
                                        :replacement="formatReplacementForCard(r)"
                                    />
                                </template>
                            </div>
                        </template>

                        <template v-else>
                            <ReplacementTableSkeleton
                                v-if="loading || loadingSearch"
                                :type="props.type"
                                :count="6"
                            />
                            <ReplacementTable
                                v-else
                                :replacements="group"
                                :type="props.type"
                                :user-id="user.id"
                                :group-members="groupMembers"
                                :highlighted-zip-codes="isSubmitted ? formData.postalCodeTags : []"
                                :highlighted-cities="isSubmitted ? formData.cityTags : []"
                                @show-user-info="handleShowInfoUser"
                                @show-periods="handleShowPeriods"
                                @open-edit="openEditDialog"
                                @select-close="selectReplacement"
                            />
                        </template>
                    </div>
                </template>

                <template v-else>
                    <template v-if="isCardMode">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <template v-if="loading || loadingSearch">
                                <ReplacementCardSkeleton
                                    v-for="i in 6"
                                    :key="`sk-${i}`"
                                />
                            </template>
                            <template v-else>
                                <ReplacementCard
                                    v-for="r in currentReplacements"
                                    :key="`r-${r.id}`"
                                    :replacement="formatReplacementForCard(r)"
                                />
                            </template>
                        </div>
                    </template>

                    <template v-else>
                        <ReplacementTableSkeleton
                            v-if="loading || loadingSearch"
                            :type="props.type"
                            :count="8"
                        />
                        <ReplacementTable
                            v-else
                            :replacements="currentReplacements"
                            :type="props.type"
                            :user-id="user.id"
                            :group-members="groupMembers"
                            :highlighted-zip-codes="isSubmitted ? formData.postalCodeTags : []"
                            :highlighted-cities="isSubmitted ? formData.cityTags : []"
                            @show-user-info="handleShowInfoUser"
                            @show-periods="handleShowPeriods"
                            @open-edit="openEditDialog"
                            @select-close="selectReplacement"
                        />
                    </template>
                </template>

                <div class="mt-4">
                    <CustomPagination
                        v-if="pagination.total > 5"
                        :default-page="page"
                        :per-page="perPage"
                        :total="pagination.total"
                        @update:page="refreshReplacements"
                        @update:per-page="handlePerPageChange"
                    />
                </div>
            </div>
        </ClientOnly>

        <Dialog v-model:open="closeReplacementDialog">
            <DialogContent class="sm:max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Fermer le remplacement</DialogTitle>
                    <DialogDescription class="mt-3 mb-6">
                        Êtes-vous sûr de vouloir fermer ce remplacement ?
                    </DialogDescription>
                </DialogHeader>
                <div class="mt-4 sm:mt-8 flex justify-center sm:justify-end space-x-6 items-center">
                    <Button
                        variant="secondary"
                        class="bg-gray-200 hover:bg-gray-300 px-8"
                        @click="closeReplacementDialog = false"
                    >
                        Non
                    </Button>
                    <Button
                        variant="default"
                        class="px-8"
                        @click="handleCloseReplacement(selectedReplacement)"
                    >
                        Oui
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="editDialogOpen">
            <DialogContent class="sm:max-w-160 h-[70vh] sm:h-[60vh] flex flex-col bg-white rounded-lg shadow-xl p-0 pb-16">
                <div class="flex-1 overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle class="text-xl font-semibold text-primary">
                            Modifier le remplacement
                        </DialogTitle>
                        <DialogDescription class="mt-2 text-gray-600">
                            Modifiez les détails du remplacement ci-dessous.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        class="mt-6 space-y-6"
                        @submit.prevent="submit"
                    >
                        <template v-if="editFormData.periods.length > 0">
                            <h4 class="text-black/80 font-semibold">
                                Période de remplacement
                            </h4>
                            <div
                                v-for="(period, index) in editFormData.periods"
                                :key="index"
                                class="mb-3"
                            >
                                <div class="grid grid-cols-2 items-center relative gap-8">
                                    <div class="flex flex-col space-y-2">
                                        <label class="text-primary font-semibold">Date de début</label>
                                        <Input
                                            v-model="editFormData.periods[index].start_date"
                                            type="date"
                                            class="rounded-full w-full outline-gray-300 focus:border-primary"
                                        />
                                    </div>
                                    <div class="flex flex-col space-y-2">
                                        <label class="text-primary font-semibold">Date de fin</label>
                                        <Input
                                            v-model="editFormData.periods[index].end_date"
                                            type="date"
                                            class="rounded-full w-full outline-gray-300 focus:border-primary"
                                        />
                                    </div>
                                    <div
                                        v-if="index > 0"
                                        class="absolute right-0 top-0"
                                    >
                                        <XMarkIcon
                                            class="w-5 text-primary cursor-pointer"
                                            @click="removePeriod(index)"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                class="mt-6 cursor-pointer flex justify-center mx-auto items-center gap-3 text-primary"
                                @click="addPeriod"
                            >
                                <PlusIcon class="w-4" />
                                <p class="text-xs">
                                    Ajouter une période
                                </p>
                            </div>
                        </template>
                        <template v-else>
                            <div class="grid grid-cols-2 items-center gap-8">
                                <div class="flex flex-col space-y-2">
                                    <label class="text-primary font-semibold">Date de début</label>
                                    <Input
                                        v-model="editFormData.startDate"
                                        type="date"
                                        class="rounded-full w-full outline-gray-300 focus:border-primary"
                                    />
                                </div>
                                <div class="flex flex-col space-y-2">
                                    <label class="text-primary font-semibold">Date de fin</label>
                                    <Input
                                        v-model="editFormData.endDate"
                                        type="date"
                                        class="rounded-full w-full outline-gray-300 focus:border-primary"
                                    />
                                </div>
                            </div>
                        </template>
                        <div class="flex flex-col space-y-2">
                            <label class="text-primary font-semibold">Créneau horaire</label>
                            <div class="flex justify-between gap-4 sm:gap-8 items-center">
                                <InputTime
                                    v-model="editFormData.timeSlot.start_at"
                                    input-class="rounded-full border border-gray-300 focus:border-primary"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="editFormData.timeSlot.end_at"
                                    input-class="rounded-full border border-gray-300 focus:border-primary"
                                />
                            </div>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-8 items-center">
                            <div class="flex flex-col space-y-2 w-84 sm:w-auto">
                                <label class="text-primary font-semibold">Nombre de patients par jour</label>
                                <InputIcon
                                    v-model="editFormData.patientCount"
                                    placeholder="Entrer un nombre"
                                    class="border border-gray-300 rounded-full focus:border-primary"
                                />
                            </div>
                            <div class="flex flex-col space-y-2">
                                <label class="text-primary font-semibold">Type de soins</label>
                                <Select
                                    v-model="editFormData.careTypes"
                                    multiple
                                >
                                    <SelectTrigger
                                        class="w-84 sm:w-full bg-white rounded-full text-nowrap border border-gray-300 focus:border-primary"
                                        position="right"
                                    >
                                        <SelectValue class="truncate w-800">
                                            <template v-if="getSelectedCareTypesText(editFormData.careTypes)">
                                                {{ getSelectedCareTypesText(editFormData.careTypes) }}
                                            </template>
                                            <template v-else>
                                                <span class="text-black/60">Sélectionner</span>
                                            </template>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent class="border-none bg-white shadow-lg">
                                        <SelectGroup class="w-32">
                                            <div
                                                v-for="careType in careTypes"
                                                :key="careType.id"
                                                class="flex items-center space-x-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                                @click="handleCareTypeClick(editFormData, careType.id)"
                                            >
                                                <Checkbox
                                                    :checked="editFormData.careTypes.includes(careType.id)"
                                                    class="mr-2"
                                                />
                                                <label class="text-xs text-nowrap cursor-pointer">{{ careType.name }}</label>
                                            </div>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div class="grid sm:grid-cols-2 gap-8 items-center">
                            <InputTagManager
                                v-model="editFormData.zipCodes"
                                label="Codes postaux"
                                placeholder="6565, 4561, 1237"
                                :is-mobile="isMobileView"
                                :comma-validation="false"
                                :count="4"
                                @keydown.enter.prevent
                            />
                            <InputTagManager
                                v-model="editFormData.cities"
                                label="Villes"
                                placeholder="Anvers, Bruges, Gand"
                                :is-mobile="isMobileView"
                                :comma-validation="true"
                                :no-space-validation="true"
                                @keydown.enter.prevent
                            />
                        </div>
                        <div class="flex flex-col space-y-2">
                            <label class="text-primary font-semibold">Commentaire</label>
                            <Textarea
                                v-model="editFormData.comment"
                                placeholder="Écrivez un commentaire"
                                rows="6"
                                class="w-full border border-gray-400 focus:border-primary rounded-lg"
                            />
                        </div>
                    </form>
                </div>
                <div class="fixed w-full bottom-0 bg-white border-t border-gray-100 p-4 flex justify-end space-x-4">
                    <Button
                        variant="secondary"
                        class="bg-gray-200 hover:bg-gray-300 px-8"
                        @click="handleCloseEditDialog"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        class="bg-primary hover:bg-primary/90 text-white px-8"
                        @click="submit"
                    >
                        Enregistrer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="periodDialog">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle class="text-base font-semibold text-primary">
                        Période de remplacement
                    </DialogTitle>
                </DialogHeader>
                <div class="mt-3 text-sm grid grid-cols-2 items-center font-semibold text-gray-700">
                    <h5>Date de début</h5>
                    <h5>Date de fin</h5>
                </div>
                <div
                    v-for="period in selectedPeriods"
                    :key="period.id"
                    class="mt-1"
                >
                    <div class="text-sm grid grid-cols-2 items-center">
                        <span>{{ formatDate(period.start_date) }}</span>
                        <span>{{ formatDate(period.end_date) }}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog
            v-if="props.type === ''"
            v-model:open="filterRegionDialog"
        >
            <DialogContent class="max-h-[60vh] overflow-y-scroll pb-8 max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Zone géographique</DialogTitle>
                    <DialogDescription>
                        <template v-if="user.profile.country === 'fr'">
                            Entrez et cochez un ou plusieurs départements pour filtrer les remplacements.
                        </template>
                        <template v-else>
                            Cochez une ou plusieurs provinces pour filtrer les remplacements.
                        </template>
                    </DialogDescription>
                </DialogHeader>
                <template v-if="selectedCountry === 'fr'">
                    <div class="py-4">
                        <InputIcon
                            v-model="searchQuery"
                            placeholder="Entrer un département"
                        />
                        <div class="grid sm:grid-cols-2 gap-4 mt-8">
                            <div
                                v-for="region in filteredDepartments"
                                :key="region"
                                class="flex items-center"
                            >
                                <label
                                    :for="region"
                                    class="grid grid-cols-[10%_90%] items-center w-full text-sm font-medium border border-gray-300 rounded-full cursor-pointer hover:bg-primary hover:text-white group px-4 py-2 transition-colors"
                                    :class="{ 'bg-primary text-white': selectedRegions.includes(region) }"
                                >
                                    <Checkbox
                                        :id="region"
                                        :checked="selectedRegions.includes(region)"
                                        :value="region"
                                        class="group-hover:border-white"
                                        @update:checked="updateRegionSelection(region, $event)"
                                    />
                                    <span class="ml-1">{{ region }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="grid sm:grid-cols-2 gap-4 py-4">
                        <div
                            v-for="region in regions"
                            :key="region"
                            class="flex items-center"
                        >
                            <label
                                :for="region"
                                class="grid grid-cols-[10%_90%] items-center w-full text-sm font-medium border border-gray-300 rounded-full cursor-pointer hover:bg-primary hover:text-white group px-4 py-2 transition-colors"
                                :class="{ 'bg-primary text-white': selectedRegions.includes(region) }"
                            >
                                <Checkbox
                                    :id="region"
                                    :checked="selectedRegions.includes(region)"
                                    :value="region"
                                    class="group-hover:border-white"
                                    @update:checked="updateRegionSelection(region, $event)"
                                />
                                <span class="ml-1">{{ region }}</span>
                            </label>
                        </div>
                    </div>
                </template>
                <DialogFooter class="my-6 flex flex-col items-center sm:flex-row gap-4">
                    <Button
                        variant="secondary"
                        class="w-full sm:w-auto"
                        @click="cancelSelection"
                    >
                        Annuler
                    </Button>
                    <Button
                        class="w-full sm:w-auto"
                        @click="validateSelection"
                    >
                        Valider
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showInfoUser">
            <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-2">
                <UsersCard
                    v-if="showInfoUser"
                    :user="selectedUser"
                    :show-full-info="true"
                />
            </DialogContent>
        </Dialog>

        <ProposalLocationModal
            v-model="proposalDialog"
            v-model:newly-added-value="newlyAddedValue"
            title="Suggestions de villes"
            description="Sélectionnez les villes que vous souhaitez utiliser pour votre recherche de remplacements"
            :initial-zip-codes="formData.postalCodeTags"
            :initial-cities="formData.cityTags"
            :is-preference-mode="false"
            @update:initial-zip-codes="updateZipCodesFromModal"
            @update:initial-cities="updateCitiesFromModal"
        />
    </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon, ArrowPathIcon, XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline';
import { toRaw } from 'vue';
import ReplacementCard from '@/components/replacements/ReplacementCard.vue';
import ReplacementCardSkeleton from '@/components/replacements/ReplacementCardSkeleton.vue';
import ReplacementTable from '@/components/replacements/ReplacementTable.vue';
import ReplacementTableSkeleton from '@/components/replacements/ReplacementTableSkeleton.vue';
import MissionCard from '@/components/missions/MissionCard.vue';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@/components/ui/tags-input';
import { useReplacements, useSearchReplacements } from '~/composables/useReplacements';
import { regions, departments, selectDays } from '~/lib/utils';
import { PERPAGE } from '~/lib/constants';
import type { User, Replacement } from '~/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { InputTime } from '@/components/ui/input-time';
import InputTagManager from '@/components/InputTagManager.vue';
import { useCareTypes } from '@/composables/useCareTypes';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import ProposalLocationModal from '@/components/ProposalLocationModal.vue';

const { $toast } = useNuxtApp();

interface ReplacementProps {
    selectedRegions?: string[];
    type?: string;
    filters?: { type: string; role: string };
    displayMode?: 'table' | 'cards';
    groupByProvince: boolean;
    filteredProvinces?: any[];
    selectedCountry?: string;
    availableMissions?: any[];
}

const props = withDefaults(defineProps<ReplacementProps>(), {
    selectedRegions: () => [],
    type: '',
    filters: () => ({ type: 'all', role: 'all' }),
    displayMode: 'cards' as const,
    filteredProvinces: () => [],
    selectedCountry: 'be',
    availableMissions: () => [],
});

const isCardMode = computed<boolean>(() => (props.displayMode ?? 'cards') === 'cards');

const selectedUser = ref(null);
const showInfoUser = ref(false);
const selectedReplacement = ref<Replacement>(null);
const perPage = ref(PERPAGE);
const page = ref(1);
const pagination = ref({ current_page: 1, per_page: PERPAGE, total: 0, last_page: 1 });
const filterRegionDialog = ref(false);
const isMobileView = ref(false);
const isSubmitted = ref(false);
const closeReplacementDialog = ref(false);
const editDialogOpen = ref(false);
const periodDialog = ref(false);
const selectedPeriods = ref([]);
const postalCodeInput = ref('');
const cityInput = ref('');
const proposalDialog = ref(false);
const newlyAddedValue = ref<string>('');
const searchQuery = ref('');
const displayedDepartments = ref([]);

type ProvinceGroups = Record<string, Replacement[]>;

const { loading, updateReplacement, updateAgainReplacement, isClosed } = useReplacements();
const { loadingSearch, fetchReplacements } = useSearchReplacements();
const { careTypes, fetchCareTypes } = useCareTypes();

const user = useState<User>('user');
const { fetchGroupMembers } = useGroup();
const groupMembers = ref([]);

const localFilters = reactive({
    type: props.filters.type,
    role: props.filters.role,
});

let newRegions = [...props.selectedRegions];
let internalUpdate = false;

const emit = defineEmits(['update:selectedRegions']);

const initialReplacements = ref({ replacements: { data: [], current_page: 1, per_page: 10, total: 0, last_page: 1 } });
const currentReplacements = ref<Replacement[]>([]);

// Helper : exclut les remplacements de l'utilisateur connecté sur la page de recherche (type === '')
const filterOutCurrentUser = (data: any[]) => {
    if (props.type === '') {
        return data.filter((r: any) => r.user_id !== user.value.id);
    }
    return data;
};

const groupsByProvince = computed<ProvinceGroups>(() => {
    if (!props.groupByProvince) return {};
    const groups: ProvinceGroups = {};
    currentReplacements.value.forEach((r: any) => {
        const province = r.province || 'Autres';
        if (!groups[province]) groups[province] = [];
        groups[province].push(r);
    });
    return groups;
});

const formData = reactive({
    postalCodeTags: [] as string[],
    cityTags: [] as string[],
    selectedDays: [] as string[],
    type: props.type,
    country: props.selectedCountry,
    filters: localFilters,
});

onMounted(async () => {
    if (import.meta.client) {
        isMobileView.value = window.innerWidth <= 1024;
    }
    if (user.value.profile.country === 'fr') {
        displayedDepartments.value = getRandomItems(departments, 6);
    }
    await fetchInitialData(page.value, perPage.value);

    if (props.type === 'groups') {
        const groupIds = user.value.group_roles.map((g: any) => g.group_id);
        if (groupIds.length > 0) {
            const result = await fetchGroupMembers(groupIds);
            groupMembers.value = result ?? [];
            const userIds = groupMembers.value.map((u: any) => u.user_id);
            currentReplacements.value = currentReplacements.value.filter((r: any) => userIds.includes(r.user_id));
        }
    }
});

await fetchCareTypes();

const formatDate = (isoString: string) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const getRandomItems = (array: any[], count: number) => {
    return [...array].sort(() => 0.5 - Math.random()).slice(0, count);
};

const filteredDepartments = computed(() => {
    if (!searchQuery.value) return displayedDepartments.value;
    return departments.filter(dep => dep.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'all'];
const frenchDays: Record<string, string> = {
    monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi',
    friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche', all: 'Tous',
};

const selectedDaysPlaceholder = computed(() => {
    if (!formData.selectedDays.length) return 'Sélectionner';
    return formData.selectedDays.map(d => frenchDays[d]).join(', ');
});

const toggleDay = (day: string) => {
    formData.selectedDays = selectDays(day, formData.selectedDays);
};

const formatReplacementForCard = (r: any) => ({
    id: r.id,
    creator_name: r.user?.full_name || r.user?.name,
    periods: r.periods?.map((p: any) => ({ start_date: p.start_date, end_date: p.end_date })) || [],
    cities: typeof r.cities === 'string' ? JSON.parse(r.cities) : r.cities || [],
    zip_codes: typeof r.zip_codes === 'string' ? JSON.parse(r.zip_codes) : r.zip_codes || [],
    care_types: r.care_types || [],
    comment: r.comment || r.description,
    time_slot: (() => {
        const ts = typeof r.timeSlot === 'string' ? JSON.parse(r.timeSlot || '{}') : r.timeSlot || {};
        return {
            morning: ts.morning || (ts.start_at && ts.end_at ? { start_at: ts.start_at, end_at: ts.end_at } : {}),
            evening: ts.evening || {},
        };
    })(),
    patient_count: r.patient_count,
    status: r.status || (r.replaced_by ? 'filled' : 'available'),
    type: r.type,
    details: r.details || [],
    replaced_by: r.replaced_by,
});

const addTagFromInput = (inputValue: string, tagsArray: string[], clearFn: (v: string) => string) => {
    const value = inputValue.trim();
    if (value && !tagsArray.includes(value)) {
        tagsArray.push(value);
        clearFn(value);
    }
};

const removeTag = (tagsArray: string[], tagToRemove: string) => {
    const idx = tagsArray.indexOf(tagToRemove);
    if (idx !== -1) tagsArray.splice(idx, 1);
};

const handleBlur = (event: FocusEvent) => {
    const inputEl = event.target as HTMLElement;
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true }));
};

const fetchInitialData = async (p = 1, pp = PERPAGE, country = props.selectedCountry) => {
    try {
        const response = await fetchReplacements({
            postalCode: [], cities: [], selectedDays: [],
            type: props.type, country, filters: localFilters,
            provinces: newRegions, page: p, perPage: pp,
        });
        initialReplacements.value = response;
        currentReplacements.value = [...filterOutCurrentUser(response.replacements.data)];
        pagination.value = {
            current_page: response.replacements.current_page,
            per_page: response.replacements.per_page,
            total: response.replacements.total,
            last_page: response.replacements.last_page,
        };
    }
    catch (error) { console.error(error); }
};

const submitSearch = async () => {
    isSubmitted.value = true;
    const hasSearchCriteria = formData.selectedDays.length > 0
        || formData.postalCodeTags.length > 0
        || formData.cityTags.length > 0;

    if (hasSearchCriteria) {
        try {
            const response = await fetchReplacements({
                selectedDays: toRaw(formData.selectedDays),
                postalCode: toRaw(formData.postalCodeTags),
                cities: toRaw(formData.cityTags),
                type: toRaw(formData.type),
                filters: toRaw(formData.filters),
                page: page.value, perPage: perPage.value,
            });
            currentReplacements.value = [...filterOutCurrentUser(response.replacements.data)];
            pagination.value = {
                current_page: response.replacements.current_page,
                per_page: response.replacements.per_page,
                total: response.replacements.total,
                last_page: response.replacements.last_page,
            };
        }
        catch (error) { console.error(error); }
    }
    else {
        await fetchInitialData(page.value, perPage.value);
    }
};

const reinitializeFilter = () => {
    formData.postalCodeTags = [];
    formData.cityTags = [];
    formData.selectedDays = [];
    page.value = 1;
    isSubmitted.value = false;
    fetchInitialData(page.value, perPage.value);
};

const refreshReplacements = async (newPage: number) => {
    page.value = newPage;
    isSubmitted.value ? await submitSearch() : await fetchInitialData(newPage, perPage.value);
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    page.value = 1;
    isSubmitted.value ? await submitSearch() : await fetchInitialData(1, value);
};

const updateRegionSelection = (region: string, checked: boolean) => {
    internalUpdate = true;
    if (checked) { if (!newRegions.includes(region)) newRegions.push(region); }
    else { newRegions = newRegions.filter(r => r !== region); }
    emit('update:selectedRegions', newRegions);
};

const validateSelection = async () => {
    filterRegionDialog.value = false;
    await fetchInitialData(page.value, perPage.value);
    emit('update:selectedRegions', props.selectedRegions);
};

const cancelSelection = () => {
    emit('update:selectedRegions', []);
    filterRegionDialog.value = false;
};

const handleShowInfoUser = (replacementUser: any) => {
    selectedUser.value = replacementUser;
    showInfoUser.value = true;
};

const handleShowPeriods = (periods: any[]) => {
    selectedPeriods.value = periods;
    periodDialog.value = true;
};

const selectReplacement = (replacement: Replacement) => {
    selectedReplacement.value = replacement;
    closeReplacementDialog.value = true;
};

const handleCloseReplacement = async (replacement: Replacement) => {
    (replacement as any).status = 'closed';
    try {
        const response = await updateReplacement(replacement);
        if (response) {
            $toast({ description: response.message });
            closeReplacementDialog.value = false;
            fetchInitialData(page.value, perPage.value);
        }
    }
    catch (error) { console.error(error); }
};

const updateZipCodesFromModal = (zipCodes: string[]) => { formData.postalCodeTags = [...zipCodes]; };
const updateCitiesFromModal = (cities: string[]) => {
    formData.cityTags = [...cities];
    submitSearch();
};

const editFormData = reactive({
    id: null as number | null,
    userId: user.value.id,
    replacedBy: null,
    visibility: '',
    type: '',
    periods: [] as { start_date: string; end_date: string }[],
    startDate: '',
    endDate: '',
    patientCount: null as number | null,
    zipCodes: [] as string[],
    cities: [] as string[],
    careTypes: [] as number[],
    timeSlot: { start_at: '', end_at: '' },
    status: '',
    comment: '',
});

const resetEditFormData = () => {
    editFormData.id = null;
    editFormData.userId = user.value.id;
    editFormData.replacedBy = null;
    editFormData.visibility = '';
    editFormData.type = '';
    editFormData.periods = [];
    editFormData.startDate = '';
    editFormData.endDate = '';
    editFormData.patientCount = null;
    editFormData.zipCodes = [];
    editFormData.cities = [];
    editFormData.careTypes = [];
    editFormData.timeSlot = { start_at: '', end_at: '' };
    editFormData.status = '';
    editFormData.comment = '';
};

const openEditDialog = (replacement: any) => {
    const fmtDate = (d: string) => d ? new Date(d).toISOString().split('T')[0] : '';
    const fmtTime = (t: string) => t ? t.split(':').slice(0, 2).join(':') : '';

    editFormData.id = replacement.id;
    editFormData.userId = replacement.user_id;
    editFormData.replacedBy = replacement.replaced_by ?? null;
    editFormData.visibility = replacement.visibility;
    editFormData.status = replacement.status;
    editFormData.type = replacement.type;
    editFormData.startDate = fmtDate(replacement.start_date);
    editFormData.endDate = fmtDate(replacement.end_date);
    editFormData.patientCount = replacement.patient_count;
    editFormData.zipCodes = Array.isArray(replacement.zip_codes)
        ? replacement.zip_codes
        : JSON.parse(replacement.zip_codes || '[]');
    editFormData.cities = Array.isArray(replacement.cities)
        ? replacement.cities
        : JSON.parse(replacement.cities || '[]');
    editFormData.careTypes = replacement.care_types?.map((ct: any) => ct.id) || [];

    if (replacement.periods?.length > 0) {
        editFormData.periods = replacement.periods.map((p: any) => ({
            start_date: fmtDate(p.start_date),
            end_date: fmtDate(p.end_date),
        }));
    }

    const ts = replacement.timeSlot
        ? (typeof replacement.timeSlot === 'string' ? JSON.parse(replacement.timeSlot) : replacement.timeSlot)
        : replacement.details?.length > 0
            ? { start_at: replacement.details.at(-1).start_at, end_at: replacement.details.at(-1).end_at }
            : {};
    editFormData.timeSlot.start_at = fmtTime(ts.start_at);
    editFormData.timeSlot.end_at = fmtTime(ts.end_at);
    editFormData.comment = replacement.comment || '';
    editDialogOpen.value = true;
};

const handleCloseEditDialog = () => { resetEditFormData(); editDialogOpen.value = false; };
const addPeriod = () => editFormData.periods.push({ start_date: '', end_date: '' });
const removePeriod = (index: number) => { if (index > 0) editFormData.periods.splice(index, 1); };

const handleCareTypeClick = (fd: typeof editFormData, careTypeId: number) => {
    const idx = fd.careTypes.indexOf(careTypeId);
    idx === -1 ? fd.careTypes.push(careTypeId) : fd.careTypes.splice(idx, 1);
    fd.careTypes = [...fd.careTypes];
};

const getSelectedCareTypesText = (selectedIds: number[]) =>
    careTypes.value.filter(ct => selectedIds.includes(ct.id)).map(ct => ct.name).join(', ');

const { submit } = useSubmit(async () => {
    try {
        const response = await updateAgainReplacement(editFormData);
        if (response) {
            editDialogOpen.value = false;
            $toast({ description: 'Remplacement mis à jour' });
            await refreshReplacements(page.value);
        }
    }
    catch (error) { console.error(error); }
});

watch(() => props.filters, (newFilters) => {
    if (newFilters) {
        localFilters.type = newFilters.type;
        localFilters.role = newFilters.role;
        fetchInitialData(page.value, perPage.value);
    }
}, { deep: true });

watch(() => props.selectedCountry, (newCountry) => {
    if (newCountry) fetchInitialData(page.value, perPage.value, newCountry);
});

watch(() => props.filteredProvinces, (newProvinces, oldProvinces) => {
    if (newProvinces !== oldProvinces) {
        newRegions = [...newProvinces as string[]];
        if (internalUpdate) { internalUpdate = false; return; }
        fetchInitialData(page.value, perPage.value);
    }
}, { deep: true });

watch(
    [() => formData.postalCodeTags, () => formData.cityTags, () => formData.selectedDays],
    ([newPostalCodes, newCities, newDays]) => {
        if (!newPostalCodes.length && !newCities.length && !newDays.length) {
            // ✅ FIX : exclure les remplacements de l'utilisateur connecté lors de la réinitialisation
            currentReplacements.value = [...filterOutCurrentUser(initialReplacements.value.replacements.data)];
            pagination.value = {
                current_page: initialReplacements.value.replacements.current_page,
                per_page: initialReplacements.value.replacements.per_page,
                total: initialReplacements.value.replacements.total,
                last_page: initialReplacements.value.replacements.last_page,
            };
            isSubmitted.value = false;
        }
        else if (isSubmitted.value) {
            submitSearch();
        }
    },
    { deep: true },
);

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>

<style>
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
