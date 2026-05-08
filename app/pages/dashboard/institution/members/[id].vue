<template>
    <div>
        <DashboardAdminPageHeader
            title="Modifier le membre"
        />

        <DashboardAdminPageContent class="bg-gray-50/50 p-6 rounded-xl">
            <div
                v-if="loadingMember"
                class="flex flex-col gap-4 justify-center items-center py-24 text-center"
            >
                <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p class="text-muted-foreground animate-pulse text-lg font-medium italic">
                    Chargement des données...
                </p>
            </div>

            <template v-else>
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-8">
                    <div class="p-4 hidden lg:block">
                        <h3 class="font-semibold text-gray-700">
                            Information
                        </h3>
                        <p class="mt-2 text-sm text-gray-500">
                            Modifier les informations d'identification du membre.
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
                                    v-model="member.firstname"
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
                                    v-model="member.lastname"
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
                                v-model="member.email"
                                placeholder="jean.dupont@email.com"
                                type="email"
                                class="rounded-md"
                                disabled
                            />
                            <p class="text-xs text-muted-foreground italic">
                                L'adresse e-mail ne peut pas être modifiée.
                            </p>
                        </div>

                        <div class="grid gap-2">
                            <Label class="text-sm font-medium">Sexe</Label>
                            <Select v-model="member.gender">
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
                            <Select v-model="member.role">
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
                        @click="handleUpdate"
                    >
                        Enregistrer les modifications
                    </Button>
                </div>
            </template>
        </DashboardAdminPageContent>
    </div>
</template>

<script lang="ts" setup>
import { Info, Star } from 'lucide-vue-next';

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
    getMember,
    updateMember,
} = useInstitutionMembers();

const route = useRoute();
const loadingMember = ref(true);

useHead({ title: 'Modifier le membre' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'institution'],
});

const member = reactive({
    id: null as number | null,
    email: '',
    role: '',
    firstname: '',
    lastname: '',
    gender: '',
});

const isValid = computed(() => {
    return member.role
        && member.firstname
        && member.lastname
        && member.gender;
});

onMounted(async () => {
    try {
        await getAvailableRoles();
        const data = await getMember(route.params.id as string);
        member.id = data.id;
        member.email = data.email;
        member.firstname = data.firstname;
        member.lastname = data.lastname;
        member.gender = data.gender;
        member.role = data.institution_role;
    }
    catch (e) {
        navigateTo('/dashboard/institution/members');
    }
    finally {
        loadingMember.value = false;
    }
});

const handleUpdate = async () => {
    if (!member.id) return;
    try {
        await updateMember(member.id, {
            firstname: member.firstname,
            lastname: member.lastname,
            gender: member.gender,
            role: member.role,
        });
        navigateTo('/dashboard/institution/members');
    }
    catch (e: any) {}
};
</script>
