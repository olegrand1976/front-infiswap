<template>
    <div>
        <DashboardAdminPageHeader
            title="Inviter un nouveau membre"
        />

        <DashboardAdminPageContent class="bg-gray-50/50 p-6 rounded-xl">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-8">
                <div class="p-4 hidden lg:block">
                    <h3 class="font-semibold text-gray-700">
                        Information
                    </h3>
                    <p class="mt-2 text-sm text-gray-500">
                        Saisissez les informations d'identification du futur membre.
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
                                v-model="newMember.firstname"
                                placeholder="Jean"
                                class="rounded-md"
                            />
                        </div>
                        <div class="grid gap-2">
                            <Label
                                for="lastname"
                                class="text-sm font-medium"
                            >Nom</Label>
                            <Input
                                id="lastname"
                                v-model="newMember.lastname"
                                placeholder="Dupont"
                                class="rounded-md"
                            />
                        </div>
                    </div>

                    <div class="grid gap-2">
                        <Label
                            for="email"
                            class="text-sm font-medium"
                        >E-mail</Label>
                        <Input
                            id="email"
                            v-model="newMember.email"
                            placeholder="jean.dupont@email.com"
                            type="email"
                            class="rounded-md"
                        />
                    </div>

                    <div class="grid gap-2">
                        <Label class="text-sm font-medium">Sexe</Label>
                        <Select v-model="newMember.gender">
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

            <Separator class="my-8" />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-8">
                <div class="p-4 hidden lg:block">
                    <h3 class="font-semibold text-gray-700">
                        Rôle & Accès
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
                        <Select v-model="newMember.role">
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

            <div class="flex items-center justify-center gap-4 mt-12 mb-8">
                <Button
                    variant="ghost"
                    as-child
                    class="w-40"
                >
                    <NuxtLink to="/dashboard/institution/members">Annuler</NuxtLink>
                </Button>
                <Button
                    :disabled="!isValid || saving"
                    :in-progress="saving"
                    class="w-64 rounded-lg shadow-lg shadow-primary/20"
                    @click="handleInvite"
                >
                    Créer l'invitation
                </Button>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { InformationCircleIcon as InfoIcon } from '@heroicons/vue/24/outline';
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
    addMember,
} = useInstitutionMembers();

useHead({ title: 'Nouvel utilisateur institution' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'institution'],
});

const newMember = reactive({
    email: '',
    role: '',
    firstname: '',
    lastname: '',
    gender: '',
});

const isValid = computed(() => {
    return newMember.email
        && newMember.role
        && newMember.firstname
        && newMember.lastname
        && newMember.gender;
});

onMounted(async () => {
    await getAvailableRoles();
});

const handleInvite = async () => {
    try {
        await addMember(
            newMember.email,
            newMember.role,
            newMember.firstname,
            newMember.lastname,
            newMember.gender,
        );
        navigateTo('/dashboard/institution/members');
    }
    catch (e: any) {}
};
</script>
