<template>
    <div class="max-w-2xl mx-auto">
        <DashboardAdminPageHeader title="Devenir un établissement" />

        <DashboardAdminPageContent class="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-6">
            <p class="text-sm text-muted-foreground">
                Réservé aux comptes infirmiers sans établissement rattaché. Votre profil infirmier reste actif — vous pourrez basculer entre les deux espaces une fois validé.
            </p>

            <div class="grid gap-2">
                <Label for="name">Nom de l'établissement</Label>
                <Input
                    id="name"
                    v-model="form.institutionName"
                    placeholder="Clinique Saint-Jean"
                />
            </div>

            <div class="grid gap-2">
                <Label for="company">N° d'entreprise (optionnel)</Label>
                <Input
                    id="company"
                    v-model="form.companyNumber"
                    placeholder="BE0123456789"
                />
            </div>

            <div class="grid gap-2">
                <Label for="street">Adresse</Label>
                <Input
                    id="street"
                    v-model="form.address.street"
                    placeholder="Rue de la Loi 1"
                />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="zip">Code postal</Label>
                    <Input
                        id="zip"
                        v-model="form.address.zipCode"
                        placeholder="1000"
                    />
                </div>
                <div class="grid gap-2">
                    <Label for="city">Ville</Label>
                    <Input
                        id="city"
                        v-model="form.address.city"
                        placeholder="Bruxelles"
                    />
                </div>
            </div>

            <div class="grid gap-2">
                <Label for="country">Pays</Label>
                <Input
                    id="country"
                    v-model="form.address.country"
                    placeholder="Belgique"
                />
            </div>

            <div class="flex gap-3 pt-4">
                <Button
                    variant="ghost"
                    @click="navigateTo('/dashboard')"
                >
                    Annuler
                </Button>
                <Button
                    :disabled="!canSubmit || saving"
                    :in-progress="saving"
                    @click="handleSubmit"
                >
                    Devenir un établissement
                </Button>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const { switchView, refresh } = useAuth();
const { onboardInstitution, saving } = useInstitutions();

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'become-institution'],
});

useHead({ title: 'Devenir un établissement' });

const form = reactive({
    institutionName: '',
    companyNumber: '',
    address: {
        street: '',
        city: '',
        zipCode: '',
        country: 'Belgique',
    },
});

const canSubmit = computed(() =>
    form.institutionName
    && form.address.street
    && form.address.city
    && form.address.zipCode
    && form.address.country,
);

const handleSubmit = async () => {
    await onboardInstitution({ ...form });
    await refresh();
    await switchView('institution');
};
</script>
