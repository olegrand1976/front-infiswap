<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Créer le compte institution">
            <template #action>
                <Button
                    variant="outline"
                    @click="navigateTo(`/dashboard/admin/institutions/${id}/show`)"
                >
                    Retour à la fiche
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div
                v-if="loading"
                class="flex justify-center items-center py-12"
            >
                <RollingLoader :loading="loading" />
            </div>

            <form
                v-else-if="institution"
                class="bg-white rounded-lg shadow p-6 max-w-2xl space-y-6"
                @submit.prevent="handleSubmit"
            >
                <p class="text-sm text-gray-600">
                    Convertit la fiche importée en compte institution. Un e-mail avec les identifiants sera envoyé à l'administrateur.
                </p>

                <div class="space-y-4">
                    <h2 class="text-lg font-semibold text-gray-800">
                        Institution
                    </h2>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Nom
                        </label>
                        <InputIcon
                            :model-value="institution.name"
                            rounded="md"
                            disabled
                            class="w-full opacity-80"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Numéro d'entreprise
                        </label>
                        <InputIcon
                            v-model="form.companyNumber"
                            rounded="md"
                            placeholder="Optionnel"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="space-y-4">
                    <h2 class="text-lg font-semibold text-gray-800">
                        Administrateur
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Prénom <span class="text-red-500">*</span>
                            </label>
                            <InputIcon
                                v-model="form.firstname"
                                rounded="md"
                                class="w-full"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Nom <span class="text-red-500">*</span>
                            </label>
                            <InputIcon
                                v-model="form.lastname"
                                rounded="md"
                                class="w-full"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Email <span class="text-red-500">*</span>
                            </label>
                            <InputIcon
                                v-model="form.email"
                                type="email"
                                rounded="md"
                                class="w-full"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Téléphone
                            </label>
                            <InputIcon
                                v-model="form.phoneNumber"
                                type="tel"
                                rounded="md"
                                class="w-full"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Genre <span class="text-red-500">*</span>
                            </label>
                            <Select v-model="form.gender">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">
                                        Homme
                                    </SelectItem>
                                    <SelectItem value="F">
                                        Femme
                                    </SelectItem>
                                    <SelectItem value="X">
                                        X
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <InputIcon
                                v-model="form.password"
                                type="text"
                                rounded="md"
                                class="w-full"
                                placeholder="Auto si vide"
                            />
                        </div>
                        <div class="flex items-end">
                            <Button
                                type="button"
                                variant="outline"
                                class="w-full"
                                @click="generatePassword"
                            >
                                Générer un mot de passe
                            </Button>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <h2 class="text-lg font-semibold text-gray-800">
                        Adresse
                    </h2>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Rue <span class="text-red-500">*</span>
                        </label>
                        <InputIcon
                            v-model="form.address.street"
                            rounded="md"
                            class="w-full"
                            required
                        />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Code postal <span class="text-red-500">*</span>
                            </label>
                            <InputIcon
                                v-model="form.address.zipCode"
                                rounded="md"
                                class="w-full"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Ville <span class="text-red-500">*</span>
                            </label>
                            <InputIcon
                                v-model="form.address.city"
                                rounded="md"
                                class="w-full"
                                required
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                Pays <span class="text-red-500">*</span>
                            </label>
                            <Select v-model="form.address.country">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Pays" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="be">
                                        Belgique
                                    </SelectItem>
                                    <SelectItem value="fr">
                                        France
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        @click="navigateTo(`/dashboard/admin/institutions/${id}/show`)"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        :in-progress="saving"
                        :disabled="!canSubmit"
                    >
                        Créer le compte
                    </Button>
                </div>
            </form>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { Institution } from '~/lib/types';
import { Button } from '@/components/ui/button';
import { InputIcon } from '~/components/ui/input-with-icon';
import RollingLoader from '~/components/RollingLoader.vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

useHead({ title: 'Créer le compte institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const route = useRoute();
const id = computed(() => Number(route.params.id));
const { get, createInstitutionAccount, saving } = useInstitutions();
const { generatePassword: generatePasswordFn } = useAuth();

const institution = ref<Institution | null>(null);
const loading = ref(true);

const form = reactive({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    gender: 'X' as 'M' | 'F' | 'X',
    password: '',
    passwordConfirmation: '',
    companyNumber: '',
    address: {
        street: '',
        city: '',
        zipCode: '',
        country: 'be',
        workingAt: ['Belgique'] as string[],
    },
});

const canSubmit = computed(() => (
    !!form.firstname.trim()
    && !!form.lastname.trim()
    && !!form.email.trim()
    && !!form.gender
    && !!form.address.street.trim()
    && !!form.address.city.trim()
    && !!form.address.zipCode.trim()
    && !!form.address.country
));

function normalizeCountry(country?: string | null): string {
    if (!country) {
        return 'be';
    }
    const value = country.trim().toLowerCase();
    if (value === 'fr' || value === 'france') {
        return 'fr';
    }
    return 'be';
}

function workingAtFromCountry(country: string): string[] {
    return country === 'fr' ? ['France'] : ['Belgique'];
}

function generatePassword() {
    const password = generatePasswordFn();
    form.password = password;
    form.passwordConfirmation = password;
}

function populateFromInstitution(data: Institution) {
    const profile = data.profile;
    const country = normalizeCountry(profile?.country ?? data.address?.country);

    form.email = data.email || data.main_user?.email || '';
    form.phoneNumber = data.phone_number || data.main_user?.phone_number || '';
    form.companyNumber = data.company_number || '';
    form.firstname = data.main_user?.firstname && data.main_user.firstname !== 'Contact'
        ? data.main_user.firstname
        : '';
    form.lastname = data.main_user?.lastname && data.main_user.lastname !== data.name
        ? data.main_user.lastname
        : '';
    form.address.street = profile?.street_address || data.address?.street_address || '';
    form.address.city = profile?.city || data.address?.city || '';
    form.address.zipCode = profile?.zip_code || data.address?.zip_code || '';
    form.address.country = country;
    form.address.workingAt = workingAtFromCountry(country);
}

watch(() => form.address.country, (country) => {
    form.address.workingAt = workingAtFromCountry(country);
});

async function handleSubmit() {
    if (!canSubmit.value || !institution.value) {
        return;
    }

    if (form.password) {
        form.passwordConfirmation = form.password;
    }

    await createInstitutionAccount(institution.value.id, {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim() || null,
        gender: form.gender,
        password: form.password || null,
        passwordConfirmation: form.password ? form.passwordConfirmation : null,
        companyNumber: form.companyNumber.trim() || null,
        address: {
            ...form.address,
            street: form.address.street.trim(),
            city: form.address.city.trim(),
            zipCode: form.address.zipCode.trim(),
        },
    });

    await navigateTo(`/dashboard/admin/institutions/${institution.value.id}/show`);
}

onMounted(async () => {
    try {
        const response = await get(id.value);
        institution.value = response.data;

        if (!institution.value?.can_create_account) {
            await navigateTo(`/dashboard/admin/institutions/${id.value}/show`, { replace: true });
            return;
        }

        populateFromInstitution(institution.value);
    }
    finally {
        loading.value = false;
    }
});
</script>
