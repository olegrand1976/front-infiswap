<template>
    <div>
        <DashboardAdminPageHeader title="Inviter un nouveau membre" />

        <DashboardAdminPageContent class="bg-gray-50/50 p-6 rounded-xl">
            <div class="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                <span :class="stepClass(1)">1. E-mail</span>
                <ChevronRight class="w-4 h-4" />
                <span :class="stepClass(2)">2. Identité</span>
                <ChevronRight class="w-4 h-4" />
                <span :class="stepClass(3)">3. Rôle</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-8">
                <div class="p-4 hidden lg:block">
                    <h3 class="font-semibold text-gray-700">
                        Étape 1 — E-mail
                    </h3>
                    <p class="mt-2 text-sm text-gray-500">
                        Saisissez l'adresse e-mail puis cliquez sur « Vérifier » pour continuer.
                    </p>
                </div>
                <div class="col-span-3 lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                    <div class="grid gap-2 relative">
                        <Label
                            for="email"
                            class="text-sm font-medium"
                        >E-mail</Label>
                        <div class="flex gap-2">
                            <Input
                                id="email"
                                v-model="form.email"
                                placeholder="jean.dupont@email.com"
                                type="email"
                                class="rounded-md flex-1"
                                autocomplete="off"
                                @input="onEmailInput"
                                @keydown.enter.prevent="checkEmail"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                class="shrink-0 rounded-md"
                                :disabled="!form.email || checkingEmail"
                                :in-progress="checkingEmail"
                                @click="checkEmail"
                            >
                                Vérifier
                            </Button>
                        </div>
                        <p
                            v-if="!emailChecked"
                            class="text-xs text-muted-foreground"
                        >
                            Cliquez sur « Vérifier » ou appuyez sur Entrée pour passer à l'étape suivante.
                        </p>
                        <div
                            v-if="emailSuggestions.length > 0"
                            class="absolute z-10 top-[4.5rem] left-0 right-[7.5rem] bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto"
                        >
                            <button
                                v-for="suggestion in emailSuggestions"
                                :key="suggestion.id"
                                type="button"
                                class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                @mousedown.prevent="pickEmail(suggestion.email)"
                            >
                                {{ suggestion.email }}
                            </button>
                        </div>
                        <p
                            v-if="emailInvalid"
                            class="text-xs text-red-600"
                        >
                            Veuillez saisir une adresse e-mail valide.
                        </p>
                        <p
                            v-else-if="alreadyMember"
                            class="text-xs text-red-600"
                        >
                            Cet utilisateur fait déjà partie de votre institution.
                        </p>
                        <p
                            v-else-if="otherInstitution"
                            class="text-xs text-red-600"
                        >
                            Cet utilisateur est déjà rattaché à une autre institution.
                        </p>
                        <p
                            v-else-if="userFound"
                            class="text-xs text-green-700 font-medium"
                        >
                            Compte trouvé — passez à l'étape 2 pour confirmer l'identité.
                        </p>
                        <p
                            v-else-if="emailChecked && !userFound"
                            class="text-xs text-amber-700 font-medium"
                        >
                            Aucun compte trouvé — complétez l'identité à l'étape 2 pour créer une invitation.
                        </p>
                    </div>
                </div>
            </div>

            <div
                v-if="showIdentityFields"
                class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-8"
            >
                <div class="p-4 hidden lg:block">
                    <h3 class="font-semibold text-gray-700">
                        Étape 2 — Identité
                    </h3>
                    <p class="mt-2 text-sm text-gray-500">
                        {{ userFound ? 'Informations du compte existant.' : 'Informations du futur membre.' }}
                    </p>
                </div>
                <div class="col-span-3 lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label
                                for="firstname"
                                class="text-sm font-medium"
                            >Prénom</Label>
                            <Input
                                id="firstname"
                                v-model="form.firstname"
                                placeholder="Jean"
                                class="rounded-md"
                                :readonly="userFound"
                                :class="{ 'bg-gray-50': userFound }"
                            />
                        </div>
                        <div class="grid gap-2">
                            <Label
                                for="lastname"
                                class="text-sm font-medium"
                            >Nom</Label>
                            <Input
                                id="lastname"
                                v-model="form.lastname"
                                placeholder="Dupont"
                                class="rounded-md"
                                :readonly="userFound"
                                :class="{ 'bg-gray-50': userFound }"
                            />
                        </div>
                    </div>

                    <div
                        v-if="!userFound"
                        class="grid gap-2"
                    >
                        <Label class="text-sm font-medium">Sexe</Label>
                        <Select v-model="form.gender">
                            <SelectTrigger class="rounded-md w-full">
                                <SelectValue
                                    placeholder="Sélectionner le genre"
                                    class="w-full"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="M">
                                    Homme
                                </SelectItem>
                                <SelectItem value="F">
                                    Femme
                                </SelectItem>
                                <SelectItem value="X">
                                    Autre
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Separator
                v-if="showIdentityFields"
                class="my-8"
            />

            <div
                v-if="emailChecked"
                class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-8"
            >
                <div class="p-4 hidden lg:block">
                    <h3 class="font-semibold text-gray-700">
                        Étape 3 — Rôle & Accès
                    </h3>
                    <p class="mt-2 text-sm text-gray-500">
                        Définissez les permissions du membre au sein de l'institution.
                    </p>
                </div>
                <div class="col-span-3 lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-6">
                    <div class="grid gap-2">
                        <Label
                            for="role"
                            class="text-sm font-medium"
                        >Type de compte</Label>
                        <Select v-model="form.role">
                            <SelectTrigger
                                id="role"
                                class="rounded-md w-full"
                            >
                                <SelectValue
                                    placeholder="Choisir un rôle"
                                    class="w-full"
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="role in roles"
                                    :key="role.id"
                                    :value="role.name"
                                >
                                    {{ role.name === 'administrator' ? 'Administrateur' : 'Gestionnaire' }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div class="mt-2 text-xs text-muted-foreground bg-blue-50 p-3 rounded-md border border-blue-100 flex gap-2">
                            <InfoIcon class="w-4 h-4 text-blue-500 shrink-0" />
                            <span>
                                <strong>Administrateur :</strong> Accès total (gestion des membres, facturation, paramètres).<br>
                                <strong>Gestionnaire :</strong> Accès opérationnel (missions, remplacements, planning).
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="emailChecked"
                class="flex items-center justify-center gap-4 mt-12 mb-8"
            >
                <Button
                    variant="ghost"
                    as-child
                    class="w-40"
                >
                    <NuxtLink to="/dashboard/institution/members">Annuler</NuxtLink>
                </Button>
                <Button
                    :disabled="!canSubmit || saving"
                    :in-progress="saving"
                    class="w-64 rounded-lg shadow-lg shadow-primary/20"
                    @click="handleInvite"
                >
                    {{ userFound ? 'Ajouter le membre' : 'Créer l\'invitation' }}
                </Button>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { ChevronRight, Info as InfoIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const {
    roles,
    saving,
    getAvailableRoles,
    lookupByEmail,
    searchByEmail,
    addMember,
} = useInstitutionMembers();

useHead({ title: 'Nouvel utilisateur institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'institution'],
});

const form = reactive({
    email: '',
    role: '',
    firstname: '',
    lastname: '',
    gender: '',
});

const emailSuggestions = ref<{ id: number; email: string }[]>([]);
const checkingEmail = ref(false);
const emailChecked = ref(false);
const emailInvalid = ref(false);
const userFound = ref(false);
const alreadyMember = ref(false);
const otherInstitution = ref(false);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const showIdentityFields = computed(() => emailChecked.value && !alreadyMember.value && !otherInstitution.value);

const canSubmit = computed(() => {
    if (!form.email || !form.role || alreadyMember.value || otherInstitution.value) {
        return false;
    }
    if (userFound.value) {
        return true;
    }
    return !!(form.firstname && form.lastname && form.gender);
});

function stepClass(step: number) {
    const active = step === 1
        ? !emailChecked.value
        : step === 2
            ? emailChecked.value && !form.role
            : emailChecked.value && !!form.role;
    return active ? 'font-semibold text-primary' : 'text-muted-foreground';
}

function resetLookupState() {
    emailChecked.value = false;
    emailInvalid.value = false;
    userFound.value = false;
    alreadyMember.value = false;
    otherInstitution.value = false;
    form.firstname = '';
    form.lastname = '';
    form.gender = '';
    form.role = '';
}

function onEmailInput() {
    resetLookupState();
    emailSuggestions.value = [];

    if (searchTimeout) clearTimeout(searchTimeout);

    if (form.email.length < 2) return;

    searchTimeout = setTimeout(async () => {
        try {
            emailSuggestions.value = await searchByEmail(form.email);
        }
        catch {
            emailSuggestions.value = [];
        }
    }, 300);
}

function pickEmail(email: string) {
    form.email = email;
    emailSuggestions.value = [];
    checkEmail();
}

async function checkEmail() {
    emailSuggestions.value = [];
    emailInvalid.value = false;

    if (!isValidEmail(form.email)) {
        resetLookupState();
        emailInvalid.value = true;
        return;
    }

    checkingEmail.value = true;

    try {
        const result = await lookupByEmail(form.email);
        emailChecked.value = true;
        userFound.value = !!result.found;
        alreadyMember.value = !!result.already_member;
        otherInstitution.value = !!result.other_institution;

        if (result.found && result.user) {
            form.firstname = result.user.firstname ?? '';
            form.lastname = result.user.lastname ?? '';
            form.gender = result.user.gender ?? '';
        }
    }
    catch {
        resetLookupState();
    }
    finally {
        checkingEmail.value = false;
    }
}

onMounted(async () => {
    await getAvailableRoles();
});

const handleInvite = async () => {
    try {
        if (userFound.value) {
            await addMember(form.email, form.role);
        }
        else {
            await addMember(form.email, form.role, form.firstname, form.lastname, form.gender);
        }
        navigateTo('/dashboard/institution/members');
    }
    catch {
        // addMember already displays an error toast
    }
};
</script>
