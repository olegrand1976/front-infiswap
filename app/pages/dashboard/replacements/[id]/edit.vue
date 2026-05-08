<template>
    <div class="lg:ml-20 xl:ml-0 pb-16">
        <div class="mt-2 flex items-center gap-2 text-primary sm:bg-gray-100 sm:px-4 rounded-lg">
            <ArrowLeft
                class="size-5 cursor-pointer hover:text-primary"
                title="Retour"
                @click="goBack"
            />
            <h1 class="py-3 text-primary font-bold">
                Modifier le <strong>remplacement</strong>
            </h1>
        </div>

        <div
            v-if="loadingReplacement"
            class="mt-16 flex justify-center items-center"
        >
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>

        <form
            v-else
            class="mt-6"
            @submit.prevent="submit"
        >
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 2xl:px-24">
                <div class="sm:mx-12 lg:mx-6">
                    <div class="shadow pb-8">
                        <h2 class="text-white font-medium text-center bg-primary px-4 py-4 rounded-t-lg">
                            Périodes de remplacement
                        </h2>

                        <div class="flex flex-col space-y-4 justify-center items-center mx-auto mt-6">
                            <div class="flex flex-col space-y-4 w-full px-4 gap-6">
                                <div
                                    v-for="(period, index) in formData.periods"
                                    :key="index"
                                    class="flex flex-col sm:flex-row justify-center relative gap-4 xl:gap-12 items-center"
                                >
                                    <div class="flex flex-col space-y-1 w-full sm:w-auto">
                                        <label class="font-semibold text-primary text-sm text-center">
                                            Date de début
                                        </label>
                                        <input
                                            v-model="period.start_date"
                                            type="date"
                                            class="outline-gray-200 rounded-full border border-gray-300 px-3 py-2 w-full"
                                        >
                                    </div>
                                    <div class="flex flex-col space-y-1 w-full sm:w-auto">
                                        <label class="font-semibold text-primary text-sm text-center">
                                            Date de fin
                                        </label>
                                        <input
                                            v-model="period.end_date"
                                            type="date"
                                            class="outline-gray-200 rounded-full border border-gray-300 px-3 py-2 w-full"
                                        >
                                    </div>
                                    <X
                                        v-if="formData.periods.length > 1"
                                        class="w-5 h-5 text-primary cursor-pointer shrink-0"
                                        @click="removePeriod(index)"
                                    />
                                </div>
                            </div>

                            <Button
                                class="mt-4 mx-auto rounded-full flex space-x-1 items-center cursor-pointer"
                                size="sm"
                                type="button"
                                @click="addPeriod"
                            >
                                <Plus class="w-5 h-5" />
                                <span>Ajouter une période</span>
                            </Button>
                        </div>
                    </div>

                    <div class="mt-6 flex flex-col space-y-2">
                        <label class="text-primary font-semibold">
                            Nombre de patients par jour
                        </label>
                        <Input
                            v-model="formData.patientCount"
                            placeholder="Entrer un nombre"
                            type="number"
                            class="border border-gray-300 rounded-full"
                        />
                    </div>
                </div>

                <div class="flex flex-col space-y-4 text-sm sm:mx-10 lg:mx-0 lg:mr-12">
                    <div>
                        <label class="text-primary font-semibold">
                            Créneau horaire
                        </label>
                        <div class="mt-2 grid sm:grid-cols-[20%_80%] lg:grid-cols-1 xl:grid-cols-[12%_88%] 2xl:grid-cols-[10%_90%] xl:space-x-8 items-center">
                            <label class="font-medium text-gray-700">
                                Matin :
                            </label>
                            <div class="lg:mt-2 xl:mt-0 flex space-x-2 sm:space-x-5 lg:space-x-2 xl:space-x-3 2xl:space-x-5 items-center">
                                <p>De</p>
                                <InputTime
                                    v-model="formData.timeSlot.morning.startAt"
                                    class="w-full"
                                    input-class="rounded-full"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="formData.timeSlot.morning.endAt"
                                    class="w-full"
                                    input-class="rounded-full"
                                />
                            </div>
                        </div>
                        <div class="mt-4 grid sm:grid-cols-[20%_80%] lg:grid-cols-1 xl:grid-cols-[12%_88%] 2xl:grid-cols-[10%_90%] xl:space-x-8 items-center">
                            <label class="font-medium text-gray-700">
                                Soir :
                            </label>
                            <div class="lg:mt-2 xl:mt-0 flex space-x-2 sm:space-x-5 lg:space-x-2 xl:space-x-3 2xl:space-x-5 items-center">
                                <p>De</p>
                                <InputTime
                                    v-model="formData.timeSlot.evening.startAt"
                                    class="w-full"
                                    input-class="rounded-full"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="formData.timeSlot.evening.endAt"
                                    class="w-full"
                                    input-class="rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col space-y-2">
                        <label class="text-primary font-semibold">
                            Type de soins
                        </label>
                        <Select
                            v-model="formData.careTypes"
                            multiple
                        >
                            <SelectTrigger
                                class="w-full bg-white rounded-full text-nowrap border border-gray-300"
                                position="right"
                            >
                                <SelectValue class="truncate">
                                    <template v-if="getSelectedCareTypesText(formData.careTypes)">
                                        {{ getSelectedCareTypesText(formData.careTypes) }}
                                    </template>
                                    <template v-else>
                                        <span class="text-black/60">Sélectionner</span>
                                    </template>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent class="border-none bg-white shadow-lg">
                                <SelectGroup>
                                    <div
                                        v-for="careType in careTypes"
                                        :key="careType.id"
                                        class="flex items-center space-x-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                        @click="handleCareTypeClick(careType.id)"
                                    >
                                        <Checkbox
                                            :checked="formData.careTypes.includes(careType.id)"
                                            class="mr-2"
                                        />
                                        <label class="text-xs text-nowrap cursor-pointer">{{ careType.name }}</label>
                                    </div>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <InputTagManager
                        v-model="formData.zipCodes"
                        label="Codes postaux"
                        placeholder="6565, 4561, 1237"
                        :is-mobile="isMobile"
                        :comma-validation="false"
                        :count="4"
                        @keydown.enter.prevent
                    />

                    <InputTagManager
                        v-model="formData.cities"
                        label="Villes"
                        placeholder="Anvers, Bruges, Gand"
                        :is-mobile="isMobile"
                        :comma-validation="true"
                        :no-space-validation="true"
                        @keydown.enter.prevent
                    />

                    <div class="flex flex-col space-y-2">
                        <label class="text-primary font-semibold">
                            Commentaire
                        </label>
                        <Textarea
                            v-model="formData.comment"
                            placeholder="Écrivez un commentaire..."
                            rows="6"
                            class="w-full border border-gray-400 focus:border-primary rounded-lg"
                        />
                    </div>
                </div>
            </section>

            <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
                <Button
                    variant="secondary"
                    type="button"
                    class="bg-gray-200 hover:bg-gray-300 px-10 rounded-full"
                    @click="router.push('/dashboard/replacements/me')"
                >
                    Annuler
                </Button>
                <Button
                    type="submit"
                    class="bg-primary hover:bg-primary/90 text-white px-10 rounded-full"
                    :disabled="inProgress"
                >
                    <span v-if="inProgress">Enregistrement…</span>
                    <span v-else>Enregistrer</span>
                </Button>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeft, Plus, Star, X } from 'lucide-vue-next';

import { toast } from 'vue-sonner';
import { useReplacements } from '@/composables/useReplacements';
import { InputTime } from '@/components/ui/input-time';
import InputTagManager from '@/components/InputTagManager.vue';
import { useCareTypes } from '@/composables/useCareTypes';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { goBack } from '~/lib/utils';

const route = useRoute();
const router = useRouter();
const replacementId = computed(() => Number(route.params.id));

const { careTypes, fetchCareTypes } = useCareTypes();
const { updateAgainReplacement } = useReplacements();
const { $apifetch } = useNuxtApp();

const loadingReplacement = ref(true);
const isMobile = ref(false);
const inProgress = ref(false);

const formData = reactive({
    id: null as number | null,
    userId: null as number | null,
    replacedBy: null,
    visibility: '',
    status: '',
    type: '',
    periods: [] as { start_date: string; end_date: string }[],
    patientCount: null as number | null,
    zipCodes: [] as string[],
    cities: [] as string[],
    careTypes: [] as number[],
    timeSlot: {
        morning: {
            startAt: '',
            endAt: '',
        },
        evening: {
            startAt: '',
            endAt: '',
        },
    },
    comment: '',
});

const fmtDate = (d: string) => d ? new Date(d).toISOString().split('T')[0] : '';

const loadReplacement = async () => {
    try {
        loadingReplacement.value = true;
        const res = await $apifetch(`/api/replacements/${replacementId.value}`);
        const r = res.replacement;

        formData.id = r.id;
        formData.userId = r.user_id;
        formData.replacedBy = r.confirmed_substitute?.id ?? null;
        formData.visibility = r.visibility ?? '';
        formData.status = r.status ?? '';
        formData.type = r.type ?? '';
        formData.patientCount = r.patient_count ?? null;
        formData.zipCodes = Array.isArray(r.zip_codes)
            ? r.zip_codes
            : JSON.parse(r.zip_codes || '[]');
        formData.cities = Array.isArray(r.cities)
            ? r.cities
            : JSON.parse(r.cities || '[]');
        formData.careTypes = (r.care_types ?? []).map((ct: any) => ct.id ?? ct);
        formData.comment = r.comment || '';

        const ts = typeof r.timeSlot === 'string' ? JSON.parse(r.timeSlot || '{}') : r.timeSlot || {};
        formData.timeSlot = {
            morning: {
                startAt: ts.morning?.start_at || ts.morning?.startAt || '',
                endAt: ts.morning?.end_at || ts.morning?.endAt || '',
            },
            evening: {
                startAt: ts.evening?.start_at || ts.evening?.startAt || '',
                endAt: ts.evening?.end_at || ts.evening?.endAt || '',
            },
        };

        if (r.periods && r.periods.length > 0) {
            formData.periods = r.periods.map((p: any) => ({
                start_date: fmtDate(p.start_date),
                end_date: fmtDate(p.end_date),
            }));
        }
        else {
            formData.periods = [{
                start_date: fmtDate(r.start_date),
                end_date: fmtDate(r.end_date),
            }];
        }
    }
    catch (e) {
        console.error('Impossible de charger le remplacement:', e);
        toast.error('Impossible de charger le remplacement.');
        router.push('/dashboard/replacements/me');
    }
    finally {
        loadingReplacement.value = false;
    }
};

const addPeriod = () => formData.periods.push({ start_date: '', end_date: '' });
const removePeriod = (i: number) => {
    if (formData.periods.length > 1) formData.periods.splice(i, 1);
};

const handleCareTypeClick = (id: number) => {
    const idx = formData.careTypes.indexOf(id);
    if (idx === -1) formData.careTypes.push(id);
    else formData.careTypes.splice(idx, 1);
    formData.careTypes = [...formData.careTypes];
};

const getSelectedCareTypesText = (ids: number[]) =>
    careTypes.value.filter((ct: any) => ids.includes(ct.id)).map((ct: any) => ct.name).join(', ');

const submit = async () => {
    if (inProgress.value) return;
    inProgress.value = true;
    try {
        await updateAgainReplacement(formData);
        toast.success('Remplacement mis à jour avec succès.');
        router.push('/dashboard/replacements/me');
    }
    catch (e: any) {
        const msg = e?.data?.message || 'Une erreur est survenue.';
        toast.error(msg);
    }
    finally {
        inProgress.value = false;
    }
};

onMounted(async () => {
    isMobile.value = window.innerWidth <= 1024;
    await loadReplacement();
});

await fetchCareTypes();

useHead({ title: 'Modifier le remplacement' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
