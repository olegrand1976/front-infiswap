<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="CRM - Suivi utilisateurs - Suivi commercial" />
        <DashboardAdminPageContent>
            <Tabs
                v-model="selectedCrm"
                class="mb-4"
            >
                <TabsList class="w-full">
                    <TabsTrigger
                        value="users"
                        class="w-full md:w-48 h-12"
                    >
                        Suivi des utilisateurs
                    </TabsTrigger>
                    <TabsTrigger
                        value="commercial"
                        class="w-full md:w-48 h-12"
                    >
                        Suivi commercial
                    </TabsTrigger>
                    <TabsTrigger
                        value="exUsers"
                        class="w-full md:w-48 h-12"
                    >
                        <span class="mr-2">Comptes supprimés</span>
                        <Badge v-if="trashCount > 0">
                            {{ trashCount }}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <div class="p-4 flex gap-3 items-center overflow-x-auto pb-3 px-4 scrollbar-hide">
                <InputIcon
                    v-model="option.name"
                    rounded="md"
                    placeholder="Filtrer par Nom ou Prénom"
                    class="w-[250px]"
                    @input="debouncedFilterUsers"
                />
                <InputIcon
                    v-model="option.zip"
                    rounded="md"
                    placeholder="Code postal"
                    class="w-[250px]"
                    type="numeric"
                    @input="debouncedFilterUsers"
                />
                <InputIcon
                    v-model="option.city"
                    rounded="md"
                    placeholder="Ville"
                    class="w-[250px]"
                    @input="debouncedFilterUsers"
                />
                <Select
                    v-model="option.insurance"
                    @update:model-value="debouncedFilterUsers"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>Nursassur</span>
                        <strong class="ml-4">
                            {{ option.insurance === 1 ? 'oui' : option.insurance === 0 ? 'non' : 'tous' }}
                        </strong>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="1">
                                <span class="ml-2">Oui</span>
                            </SelectItem>
                            <SelectItem :value="0">
                                <span class="ml-2">Non</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    v-model="option.site"
                    @update:model-value="debouncedFilterUsers"
                >
                    <SelectTrigger class="max-w-sm rounded-md gap-2">
                        <span>NursTech</span>
                        <strong class="ml-4">
                            {{ option.site === 1 ? 'oui' : option.site === 0 ? 'non' : 'tous' }}
                        </strong>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem :value="1">
                                <span class="ml-2">Oui</span>
                            </SelectItem>
                            <SelectItem :value="0">
                                <span class="ml-2">Non</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    class="rounded-md"
                    @click="resetFilter"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

            <div class="ml-4 my-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    v-for="tab in countryTabs"
                    :key="tab.value"
                    :class="[
                        'px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium transition-colors',
                        (tab.value === '' && option.country === '') || (tab.value !== '' && option.country === tab.value)
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700']"
                    @click="setCountryFilter(tab.value)"
                >
                    {{ tab.label }}
                </button>
            </div>

            <div
                v-if="isCountryLoading"
                class="px-4 space-y-3 mb-6"
            >
                <div
                    v-for="i in 6"
                    :key="i"
                    class="flex flex-col gap-6"
                >
                    <Skeleton class="h-12 rounded-md bg-gray-50" />
                </div>
            </div>
            <div v-else>
                <template v-if="selectedCrm === 'users'">
                    <CrmAdminList
                        :users="users"
                        :page="page"
                        :per-page="perPage"
                        @refresh-users="refreshUsers"
                        @handle-per-page-change="handlePerPageChange"
                        @set-sort="setSort"
                    />
                </template>
                <template v-else-if="selectedCrm === 'commercial'">
                    <CrmSaleAdminList
                        :users="users"
                        :page="page"
                        :per-page="perPage"
                        @refresh-users="refreshUsers"
                        @handle-per-page-change="handlePerPageChange"
                        @set-sort="setSort"
                        @user-updated="handleUserUpdate"
                    />
                </template>
                <template v-else-if="selectedCrm === 'exUsers'">
                    <CrmUserDeletedList
                        :users="users"
                        :page="page"
                        :per-page="perPage"
                        @refresh-users="refreshUsers"
                        @handle-per-page-change="handlePerPageChange"
                        @set-sort="setSort"
                        @user-updated="handleUserUpdate"
                    />
                </template>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import { InputIcon } from '~/components/ui/input-with-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { PERPAGE } from '~/lib/constants';
import { useCrm } from '@/composables/useCrm';
import { useProduct } from '~/composables/useProduct';

useHead({ title: 'Suivi utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const selectedCrm = ref('users');
const isCountryLoading = ref(false);
const { getCrmPlus, users, trashCount } = useCrm();
const { getAll } = useProduct();
const route = useRoute();
const perPage = ref(PERPAGE);
const page = ref(1);

const countryTabs = [
    { label: 'Toutes', value: '' },
    { label: 'Belgique', value: 'be' },
    { label: 'France', value: 'fr' },
];

const setCountryFilter = async (country) => {
    if (option.value.country === country) return;

    isCountryLoading.value = true;
    option.value.country = country;
    page.value = 1;

    await filterUsers();

    isCountryLoading.value = false;
};

const emptyFilter = {
    name: null as string | null,
    zip: null as string | null,
    city: null as string | null,
    country: null as string | null,
    insurance: null as number | null,
    site: null as number | null,
    deleted: null as boolean | null,
};

const initialFilter = {
    ...emptyFilter,
    name: (route.query.name as string) ?? null,
    zip: null,
    city: null,
    country: '',
    insurance: null,
    site: null,
    deleted: false,
};

const option = ref({ ...initialFilter });

const debounce = (func, delay) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const filterUsers = async () => {
    const currentFilter = { ...option.value };

    if (selectedCrm.value === 'exUsers') {
        currentFilter.deleted = true;
    }
    else {
        currentFilter.deleted = false;
    }

    await getCrmPlus(page.value, perPage.value, currentFilter);
};

const debouncedFilterUsers = debounce(filterUsers, 100);

await getCrmPlus(page.value, perPage.value, option.value);

onMounted(async () => {
    if (option.value.name) {
        debouncedFilterUsers();
    }
    await getAll();
});

const refreshUsers = async (newPage: number) => {
    page.value = newPage;
    const currentFilter = { ...option.value };
    if (selectedCrm.value === 'exUsers') currentFilter.deleted = true;
    else currentFilter.deleted = false;

    await getCrmPlus(newPage, perPage.value, {
        ...currentFilter,
        sortOrder: sort.order,
        sortKey: sort.by,
    });
};

const handleUserUpdate = (updatedCrmObject) => {
    const index = users.value.data.findIndex(u => u.id === updatedCrmObject.user_id);
    if (index !== -1) {
        const existingUser = { ...users.value.data[index] };
        existingUser.crm = updatedCrmObject;
        users.value.data[index] = existingUser;
    }
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await getCrmPlus(page.value, value, option.value);
};

const resetFilter = async () => {
    const isSame = JSON.stringify(option.value) === JSON.stringify(emptyFilter);
    if (isSame) {
        return;
    }
    option.value = { ...emptyFilter };
    page.value = 1;
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
    await getCrmPlus(page.value, perPage.value, option.value);
};

const sort = reactive({
    order: 'DESC',
    by: null,
});

const toggleSort = () => {
    sort.order = sort.order === 'ASC' ? 'DESC' : 'ASC';
};

const setSort = async (columnKey: string) => {
    if (sort.by === columnKey) toggleSort();
    else {
        sort.by = columnKey;
        sort.order = 'DESC';
    }

    const currentFilter = { ...option.value };
    if (selectedCrm.value === 'exUsers') currentFilter.deleted = true;
    else currentFilter.deleted = false;

    await getCrmPlus(page.value, perPage.value, {
        ...currentFilter,
        sortOrder: sort.order,
        sortKey: sort.by,
    });
};

watch(selectedCrm, async () => {
    page.value = 1;
    await filterUsers();
});
</script>
