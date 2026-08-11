<template>
    <div>
        <form class="w-full grid 2xl:grid-cols-2 gap-6">
            <div>
                <label class="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    {{ t('replacements.colZip') }}
                    <SettingsFieldHint
                        :text="t(SETTINGS_TOOLTIPS.zipCodesPreference)"
                        :label="t('replacements.colZip')"
                    />
                </label>
                <div class="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                        v-for="i in filledZipIndexes"
                        :key="'zip-chip-' + i"
                        class="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 py-1 pl-2.5 pr-1 text-xs font-semibold text-primary"
                    >
                        {{ zipInputs[i] }}
                        <button
                            type="button"
                            class="flex size-4 items-center justify-center rounded-full bg-primary/20 text-[10px] leading-none hover:bg-primary/30"
                            :aria-label="t('settings.preferencesRemove')"
                            @click="removeZip(i)"
                        >
                            ✕
                        </button>
                    </span>

                    <button
                        v-if="nextEmptyZipIndex !== -1"
                        type="button"
                        class="inline-flex items-center gap-1 rounded-full border border-dashed border-input px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
                        @click="openAddModal"
                    >
                        + {{ t('settings.preferencesAdd') }}
                    </button>
                </div>
            </div>

            <div>
                <label class="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    {{ t('replacements.colCities') }}
                    <SettingsFieldHint
                        :text="t(SETTINGS_TOOLTIPS.citiesPreference)"
                        :label="t('replacements.colCities')"
                    />
                </label>
                <div class="mt-2 flex flex-wrap items-center gap-1.5">
                    <span
                        v-for="i in filledCityIndexes"
                        :key="'city-chip-' + i"
                        class="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 py-1 pl-2.5 pr-1 text-xs font-semibold text-primary"
                    >
                        {{ cityInputs[i] }}
                        <button
                            type="button"
                            class="flex size-4 items-center justify-center rounded-full bg-primary/20 text-[10px] leading-none hover:bg-primary/30"
                            :aria-label="t('settings.preferencesRemove')"
                            @click="removeCity(i)"
                        >
                            ✕
                        </button>
                    </span>

                    <button
                        v-if="nextEmptyCityIndex !== -1"
                        type="button"
                        class="inline-flex items-center gap-1 rounded-full border border-dashed border-input px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
                        @click="openAddModal"
                    >
                        + {{ t('settings.preferencesAdd') }}
                    </button>
                </div>
            </div>
        </form>

        <Dialog v-model:open="modalOpen">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>{{ t('settings.preferencesAdd') }}</DialogTitle>
                    <DialogDescription>
                        Renseignez le code postal ou la ville — l'autre se complète automatiquement.
                    </DialogDescription>
                </DialogHeader>

                <div class="mt-2 space-y-4">
                    <div class="space-y-1.5">
                        <label class="text-xs font-medium text-muted-foreground">
                            {{ t('replacements.colZip') }}
                        </label>
                        <InputIcon
                            v-model="modalZip"
                            type="text"
                            rounded="md"
                            :placeholder="user.profile.country === 'fr' ? '75000' : '1000'"
                            :disabled="nextEmptyZipIndex === -1"
                            class="w-full"
                        />
                        <p
                            v-if="nextEmptyZipIndex === -1"
                            class="text-[11px] text-muted-foreground"
                        >
                            Limite de 4 codes postaux atteinte.
                        </p>
                        <p
                            v-else-if="zipAlreadyExists"
                            class="text-[11px] text-destructive"
                        >
                            Ce code postal est déjà dans vos préférences.
                        </p>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-xs font-medium text-muted-foreground">
                            {{ t('replacements.colCities') }}
                        </label>
                        <InputIcon
                            v-model="modalCity"
                            type="text"
                            rounded="md"
                            :placeholder="user.profile.country === 'fr' ? 'Paris' : 'Bruxelles'"
                            :disabled="nextEmptyCityIndex === -1"
                            class="w-full"
                        />
                        <p
                            v-if="nextEmptyCityIndex === -1"
                            class="text-[11px] text-muted-foreground"
                        >
                            Limite de 4 villes atteinte.
                        </p>
                        <p
                            v-else-if="cityAlreadyExists"
                            class="text-[11px] text-destructive"
                        >
                            Cette ville est déjà dans vos préférences.
                        </p>
                        <p
                            v-else-if="modalLookupLoading"
                            class="text-[11px] text-muted-foreground"
                        >
                            Recherche…
                        </p>
                    </div>
                </div>

                <DialogFooter class="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                        variant="secondary"
                        class="w-full sm:w-auto"
                        @click="modalOpen = false"
                    >
                        {{ t('common.cancel') }}
                    </Button>
                    <Button
                        class="w-full sm:w-auto"
                        :disabled="!hasAddableValue"
                        @click="confirmAddPair"
                    >
                        {{ t('settings.preferencesAdd') }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '~/composables/useAuth';
import type { CountryCode, User } from '~/lib/types';
import { SETTINGS_TOOLTIPS } from '~/utils/settingsTooltips';

const { t } = useI18n();

const props = defineProps<{
    initialZipCodes: string[];
    initialCities: string[];
}>();

const emit = defineEmits<{
    (e: 'update:initialZipCodes', v: string[]): void;
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    (e: 'update:initialCities', v: string[]): void;
    (e: 'open-proposal', v: string): void;
}>();

const { createPreferences } = useAuth();
const { getCitiesFomZipCode, getZipCodesFromCity } = useLocation();
const user = useState<User>('user');

const countryCode = computed<CountryCode>(() => (user.value.profile.country === 'fr' ? 'fr' : 'be'));

const zipCodes = ref([...props.initialZipCodes]);
const cities = ref([...props.initialCities]);

const zipInputs = ref([
    props.initialZipCodes[0] || '',
    props.initialZipCodes[1] || '',
    props.initialZipCodes[2] || '',
    props.initialZipCodes[3] || '',
]);

const cityInputs = ref([
    props.initialCities[0] || '',
    props.initialCities[1] || '',
    props.initialCities[2] || '',
    props.initialCities[3] || '',
]);

watch(
    () => [props.initialZipCodes, props.initialCities],
    ([z, c]) => {
        zipCodes.value = [...z];
        cities.value = [...c];

        zipInputs.value = [
            z[0] || '',
            z[1] || '',
            z[2] || '',
            z[3] || '',
        ];

        cityInputs.value = [
            c[0] || '',
            c[1] || '',
            c[2] || '',
            c[3] || '',
        ];
    },
);

async function savePreferences(addedValue?: string) {
    const newZipList = zipInputs.value.filter(v => v.trim());
    const newCityList = cityInputs.value.filter(v => v.trim());

    const formData = {
        key: 'replacement',
        value: {
            zip_codes: newZipList,
            cities: newCityList,
        },
    };

    try {
        await createPreferences(formData);
        await nextTick();
        emit('update:initialZipCodes', formData.value.zip_codes);
        emit('update:initialCities', formData.value.cities);

        if (addedValue) emit('open-proposal', addedValue);
    }
    catch (err) {
        console.error(err);
    }
}

function isInitialZip(index: number) {
    const initial = props.initialZipCodes[index] || '';
    const current = zipInputs.value[index] || '';
    return current === initial && current.trim() !== '';
}

function isInitialCity(index: number) {
    const initial = props.initialCities[index] || '';
    const current = cityInputs.value[index] || '';
    return current === initial && current.trim() !== '';
}

const slotIndexes = [0, 1, 2, 3];

const filledZipIndexes = computed(() => slotIndexes.filter(i => isInitialZip(i)));
const nextEmptyZipIndex = computed(() => slotIndexes.find(i => !isInitialZip(i)) ?? -1);

const filledCityIndexes = computed(() => slotIndexes.filter(i => isInitialCity(i)));
const nextEmptyCityIndex = computed(() => slotIndexes.find(i => !isInitialCity(i)) ?? -1);

async function removeZip(index: number) {
    zipInputs.value[index] = '';
    await savePreferences();
}

async function removeCity(index: number) {
    cityInputs.value[index] = '';
    await savePreferences();
}

// --- Ajout par modal, avec autocomplétion code postal <-> ville ---

const modalOpen = ref(false);
const modalZip = ref('');
const modalCity = ref('');
const modalLookupLoading = ref(false);

let suppressAutofill = false;
let zipLookupTimeout: ReturnType<typeof setTimeout> | null = null;
let cityLookupTimeout: ReturnType<typeof setTimeout> | null = null;

function openAddModal() {
    modalZip.value = '';
    modalCity.value = '';
    modalOpen.value = true;
}

watch(modalZip, (value) => {
    if (suppressAutofill) return;
    if (zipLookupTimeout) clearTimeout(zipLookupTimeout);

    const trimmed = value.trim();
    if (!/^\d{4,5}$/.test(trimmed)) return;

    zipLookupTimeout = setTimeout(async () => {
        modalLookupLoading.value = true;
        const matchedCities = await getCitiesFomZipCode(trimmed, countryCode.value);
        modalLookupLoading.value = false;

        if (matchedCities.length) {
            suppressAutofill = true;
            modalCity.value = matchedCities[0];
            await nextTick();
            suppressAutofill = false;
        }
    }, 300);
});

watch(modalCity, (value) => {
    if (suppressAutofill) return;
    if (cityLookupTimeout) clearTimeout(cityLookupTimeout);

    const trimmed = value.trim();
    if (trimmed.length < 2 || /^\d+$/.test(trimmed)) return;

    cityLookupTimeout = setTimeout(async () => {
        modalLookupLoading.value = true;
        const matchedZips = await getZipCodesFromCity(trimmed, countryCode.value);
        modalLookupLoading.value = false;

        if (matchedZips.length) {
            suppressAutofill = true;
            modalZip.value = matchedZips[0];
            await nextTick();
            suppressAutofill = false;
        }
    }, 300);
});

const zipAlreadyExists = computed(() => {
    const value = modalZip.value.trim();
    if (!value) return false;
    return zipInputs.value.some((v, i) => isInitialZip(i) && v === value);
});

const cityAlreadyExists = computed(() => {
    const value = modalCity.value.trim().toLowerCase();
    if (!value) return false;
    return cityInputs.value.some((v, i) => isInitialCity(i) && v.toLowerCase() === value);
});

const canAddZip = computed(() =>
    modalZip.value.trim() !== '' && !zipAlreadyExists.value && nextEmptyZipIndex.value !== -1,
);

const canAddCity = computed(() =>
    modalCity.value.trim() !== '' && !cityAlreadyExists.value && nextEmptyCityIndex.value !== -1,
);

const hasAddableValue = computed(() => canAddZip.value || canAddCity.value);

async function confirmAddPair() {
    if (!hasAddableValue.value) return;

    if (canAddZip.value) {
        zipInputs.value[nextEmptyZipIndex.value] = modalZip.value.trim();
    }
    if (canAddCity.value) {
        cityInputs.value[nextEmptyCityIndex.value] = modalCity.value.trim();
    }

    await savePreferences();
    modalOpen.value = false;
}
</script>
