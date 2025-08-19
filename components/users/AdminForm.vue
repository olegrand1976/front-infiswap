<script setup lang="ts">
import { ADMIN_ROLES, BASIC_ROLES, LANGUAGES, SUPER_ADMIN_ROLES } from '~/lib/constants';
import type { AccountType, User } from '~/lib/types';
import { getRole } from '~/lib/utils';

const props = defineProps<{
    user?: User | null;
}>();

const { create, update, generatePassword, isSuperAdmin, isAdmin, isAdminGroup } = useAuth();
const { groups, myGroups, assignUser, groupsWithAdmin } = useGroup();
const isEditMode = computed(() => !!props.user);

function getGroupIdFromState() {
    const selectedGroupIdState = useState<number | null>('selectedGroupId', () => null);
    return selectedGroupIdState.value;
}

const getInitialValue = (user: User | null | undefined = props.user) => ({
    lastname: user?.lastname || null,
    firstname: user?.firstname || null,
    email: user?.email || null,
    identifierNumber: user?.identifier_number || null,
    password: null,
    passwordConfirmation: null,
    gender: user?.gender || null,
    phoneNumber: user?.phone_number || null,
    dateOfBirth: user?.date_of_birth || null,
    language: 'fr',
    group_roles: user?.group_roles || [],
    roles: user?.roles || ['nurse'],
    address: {
        street: user?.profile?.street_address || null,
        city: user?.profile?.city || null,
        country: user?.profile?.country || null,
        zipCode: user?.profile?.zip_code || null,
        additionalInformation: user?.profile?.additional_info || null,
    },
    settings: user?.settings
        ? JSON.parse(user.settings)
        : {
                language: 'fr',
                replacement: {
                    cities: [],
                    zip_codes: [],
                    days: [],
                },
                notification: {
                    new_replacement: true,
                    replacement_accepted: true,
                },
            },
    professionalCategory: user?.professional_category || null,
});

const form = reactive(getInitialValue());
const { $toast } = useNuxtApp();

const { submit, inProgress } = useSubmit(async () => {
    const normalizedDateOfBirth = (() => {
        if (!form.dateOfBirth) return null;

        const cleaned = (form.dateOfBirth ?? '').replace(/[/\s]/g, '-');

        const parts = cleaned.split('-');

        if (parts.length !== 3) return null;

        let year, month, day;

        if (parts[0].length === 4) {
            [year, month, day] = parts;
        }
        else {
            [day, month, year] = parts;
        }

        if (!year || !month || !day) return null;

        return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    })();

    form.dateOfBirth = normalizedDateOfBirth;

    if (isEditMode.value && props.user?.id) {
        const updatedUser = await update(props.user.id, JSON.parse(JSON.stringify(form)));
        resetForm(updatedUser);
        return;
    }

    await create(JSON.parse(JSON.stringify(form)));
    resetForm(undefined);
}, {
    onSuccess: () => {
        $toast({
            description: isEditMode.value ? 'Utilisateur mis à jour avec succès' : 'Utilisateur créé avec succès',
        });
    },
});

function resetForm(user?: User | null) {
    Object.assign(form, getInitialValue(user));
}

const generateNewPassword = () => {
    const password = generatePassword();

    form.password = password;
    form.passwordConfirmation = password;
};

watch(
    () => props.user,
    (newUser) => {
        resetForm(newUser);
    },
    { immediate: true },
);

const genders = [
    {
        value: 'M',
        label: 'Homme',
        name: 'homme',
    },
    {
        value: 'F',
        label: 'Femme',
        name: 'femme',
    },
    {
        value: 'X',
        label: 'X',
        name: 'neutre',
    },
];

const categoryPro = [
    {
        value: 'salaried',
        label: 'Salarié(e)',
        name: 'salarié(e)',
    },
    {
        value: 'independent',
        label: 'Indépendant(e)',
        name: 'indépendant(e)',
    },
];

const accountOptions = computed<AccountType[]>(() => {
    if (isSuperAdmin.value) return SUPER_ADMIN_ROLES;

    if (isAdmin.value) return ADMIN_ROLES;

    return BASIC_ROLES;
});

const toggleRole = (role: AccountType) => {
    const index = form.roles.indexOf(role);

    if (index > -1) {
        form.roles.splice(index, 1);
    }
    else {
        form.roles.push(role);
    }
};

const formattedRoles = computed(() => {
    return form.roles.map(getRole).join(', ');
});

onMounted(async () => {
    if (isAdmin.value) {
        await groupsWithAdmin();
    }
    else {
        await myGroups();
    }
});

const dataGroup = computed(() => {
    if (isAdmin.value) {
        return groups.value ?? [];
    }
    else {
        return (groups.value ?? []).filter(group => group.role_name === 'administrator');
    }
});

const groupId = getGroupIdFromState();

const adminGroups = computed(() => {
    if (groupId) {
        const matchedGroup = groups.value.find(group => group.id === groupId);
        return matchedGroup ? [matchedGroup] : [];
    }
    if (isAdmin.value) {
        return groups.value;
    }
    return groups.value.filter(group => isAdminGroup(group.id));
});

const isSubmitDisabled = computed(() => {
    if (isAdmin.value) return false;

    if (groupId) {
        return !isAdminGroup(groupId);
    }

    return adminGroups.value.length === 0;
});

const formattedGroup = computed(() => {
    return form.group_roles.map(g => g.group_name).join(', ');
});

const selectedGroupIds = ref<number[]>(form.group_roles.map(g => g.group_id));

watch(selectedGroupIds, (newIds) => {
    form.group_roles = newIds.map(id => ({
        group_id: id,
        group_name: dataGroup.value.find(dg => dg.id === id)?.name || '',
        role_id: 0,
        role_name: '',
        created_at: new Date().toISOString(),
    }));
}, { immediate: true });

const formAssign = {
    email: '',
};

function toggleArray<T>(arr: T[], item: T, getKey: (i: T) => unknown = i => i): T[] {
    const index = arr.findIndex(i => getKey(i) === getKey(item));
    if (index === -1) {
        return [...arr, item];
    }
    return arr.filter(i => getKey(i) !== getKey(item));
}

const { submit: submitAssign, inProgress: inProgressAssign } = useSubmit(async () => {
    await assignUser(groupId, formAssign);
}, {
    onSuccess: () => {
        $toast({
            title: 'Succès !',
            description: 'Personne assignée avec succès.',
        });
        navigateTo('/dashboard/group');
    },
});

const route = useRoute();
</script>

<template>
    <div v-if="!props.user && groupId && !route.path.includes('/dashboard/admin/users/create')">
        <form @submit.prevent="submitAssign">
            <p class="text-gray-700 text-sm md:text-base leading-relaxed my-6 ml-4">
                Associez un(e) infirmier(e) à votre groupe en renseignant son email.
            </p>

            <div class="grid grid-cols-3 gap-4 lg:gap-8">
                <div class="p-4 hidden lg:block">
                    <h3 class="font-semibold text-gray-600">
                        Infirmier(e) déjà inscrit(e)
                    </h3>
                    <p class="mt-2 text-md text-gray-500">
                        Renseignez l'email pour associer.
                    </p>
                </div>

                <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                    <InputIcon
                        v-model="formAssign.email"
                        rounded="md"
                        label="Email"
                        placeholder="Email"
                    />
                </div>
            </div>

            <div class="col-span-3 grid place-content-center mt-4">
                <Button
                    type="submit"
                    class="rounded-md w-52"
                    :in-progress="inProgressAssign"
                >
                    Associer
                </Button>
            </div>

            <Separator class="my-4 lg:my-10" />
        </form>
        <p class="text-gray-700 text-sm md:text-base leading-relaxed mb-4 ml-4">
            Invitez un(e) nouvel(le) infirmier(e) en complétant le formulaire d’inscription.
        </p>
    </div>

    <form @submit.prevent="submit">
        <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    Information
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les information personnelles
                </p>
            </div>
            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                <div>
                    <InputIcon
                        v-model="form.lastname"
                        rounded="md"
                        label="Nom"
                    />
                </div>
                <div>
                    <InputIcon
                        v-model="form.firstname"
                        rounded="md"
                        label="Prénom"
                    />
                </div>
                <div>
                    <InputIcon
                        v-model="form.identifierNumber"
                        rounded="md"
                        label="INAMI"
                    />
                </div>
                <div>
                    <InputIcon
                        v-model="form.email"
                        rounded="md"
                        type="email"
                        label="Email"
                    />
                </div>
                <div>
                    <Select
                        v-model="form.gender"
                        label="Sexe"
                    >
                        <SelectTrigger
                            position="right"
                            class="rounded-md"
                        >
                            <SelectValue placeholder="Séléctionner..." />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup>
                                <SelectItem
                                    v-for="(gender, index) in genders"
                                    :key="index"
                                    :value="gender.value"
                                >
                                    <span class="text-sm">{{ gender.label }}</span>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <InputIcon
                        v-model="form.phoneNumber"
                        rounded="md"
                        label="Téléphone"
                    />
                </div>
                <div>
                    <InputIcon
                        v-model="form.dateOfBirth"
                        rounded="md"
                        label="Date de naissance"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                        ex : 01 01 1990 ou 01-01-1990 ou 01/01/1990
                    </p>
                </div>
                <div>
                    <Select
                        v-model="form.language"
                        label="Langue"
                    >
                        <SelectTrigger
                            position="right"
                            class="rounded-md"
                        >
                            <SelectValue placeholder="Séléctionner..." />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup>
                                <SelectItem
                                    v-for="(lang, index) in LANGUAGES"
                                    :key="index"
                                    :value="lang.value"
                                >
                                    <span class="text-sm">{{ lang.label }}</span>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Select
                        v-model="form.professionalCategory"
                        label="Catégorie professionnel"
                    >
                        <SelectTrigger
                            position="right"
                            class="rounded-md"
                        >
                            <SelectValue placeholder="Séléctionner..." />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup>
                                <SelectItem
                                    v-for="(category, index) in categoryPro"
                                    :key="index"
                                    :value="category.value"
                                >
                                    <span class="text-sm">{{ category.label }}</span>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div class="relative">
                    <span
                        class="absolute right-2 top-0.5 z-40 text-primary text-xs font-bold cursor-pointer"
                        @click="generateNewPassword"
                    >Générer</span>
                    <InputIcon
                        v-model="form.password"
                        rounded="md"
                        type="password"
                        label="Mot de passe"
                    />
                </div>
                <div>
                    <InputIcon
                        v-model="form.passwordConfirmation"
                        rounded="md"
                        type="password"
                        label="Confirmation mot de passe"
                    />
                </div>
            </div>
        </div>
        <Separator class="my-4 lg:my-10" />
        <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    Adresse
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations d'addresse
                </p>
            </div>
            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                <div>
                    <InputIcon
                        v-model="form.address.street"
                        rounded="md"
                        label="N° et rue"
                    />
                </div>
                <div>
                    <InputIcon
                        v-model="form.address.city"
                        rounded="md"
                        label="Ville"
                    />
                </div>
                <div>
                    <InputIcon
                        v-model="form.address.zipCode"
                        rounded="md"
                        label="Code postal"
                    />
                </div>
                <div>
                    <InputIcon
                        v-model="form.address.additionalInformation"
                        rounded="md"
                        label="Complément d'adresse"
                    />
                </div>
            </div>
        </div>
        <Separator class="my-4 lg:my-10" />
        <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    Préférence
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations sur les codes postaux de préférence
                </p>
            </div>
            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                <InputTagManager
                    v-model="form.settings.replacement.zip_codes"
                    placeholder="1099"
                    class="pt-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :is-mobile="false"
                    :comma-validation="false"
                    label="Codes postaux"
                    @keydown.enter.prevent
                />
            </div>
        </div>
        <Separator class="my-4 lg:my-10" />
        <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    Compte
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations de compte
                </p>
            </div>
            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                <div>
                    <Select
                        v-model="form.roles"
                        label="Type de compte"
                        multiple
                        class="w-full"
                    >
                        <SelectTrigger
                            position="right"
                            class="rounded-md text-nowrap"
                        >
                            <SelectValue>
                                {{ formattedRoles }}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent class="border border-none w-full">
                            <SelectGroup class="w-full">
                                <div
                                    v-for="(role, index) in accountOptions"
                                    :key="index"
                                    :value="role"
                                    class="cursor-pointer"
                                    @click="toggleRole(role)"
                                >
                                    <Checkbox
                                        :checked="form.roles.includes(role)"
                                        class="mr-2"
                                    />
                                    <span class="text-sm">{{ getRole(role) }}</span>
                                </div>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div class="w-full">
                    <Select
                        v-model="selectedGroupIds"
                        multiple
                        class="w-full"
                    >
                        <SelectTrigger
                            position="right"
                            class="rounded-md text-nowrap"
                        >
                            <SelectValue>
                                <template v-if="selectedGroupIds.length > 0">
                                    {{ formattedGroup }}
                                </template>
                                <template v-else>
                                    <span class="text-gray-500">Sélectionner...</span>
                                </template>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <div
                                    v-for="group in dataGroup"
                                    :key="group.id"
                                    class="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100"
                                    @click.stop="selectedGroupIds = toggleArray(selectedGroupIds, group.id)"
                                >
                                    <Checkbox
                                        :checked="selectedGroupIds.includes(group.id)"
                                        class="mr-2"
                                    />
                                    <span class="text-sm">{{ group.name }}</span>
                                </div>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
        <Separator class="my-4 lg:my-10" />
        <div
            v-if="!isSubmitDisabled"
            class="col-span-3 grid place-content-center"
        >
            <Button
                type="submit"
                class="rounded-md w-52"
                :in-progress="inProgress"
                :disabled="isSubmitDisabled"
            >
                {{ props.user ? 'Sauvegarder' : 'Créer un utilisateur' }}
            </Button>
        </div>
    </form>
</template>
