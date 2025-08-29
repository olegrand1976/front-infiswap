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
                    type="number"
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
                />
            </template>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/solid';
import { Button } from '@/components/ui/button';
import { InputIcon } from '~/components/ui/input-with-icon';
import { PERPAGE } from '~/lib/constants';
import { useCrm } from '@/composables/useCrm';
import { useProduct } from '~/composables/useProduct';

useHead({ title: 'Suivi utilisateurs' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const selectedCrm = ref('users');
const { getCrmPlus, users } = useCrm();
const { getAll } = useProduct();
const route = useRoute();
const perPage = ref(PERPAGE);
const page = ref(1);

const emptyFilter = {
    name: null as string | null,
    zip: null as string | null,
    city: null as string | null,
    insurance: null as number | null,
    site: null as number | null,
};

const initialFilter = {
    ...emptyFilter,
    name: (route.query.name as string) ?? null,
    zip: null,
    city: null,
    insurance: null,
    site: null,
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
    await getCrmPlus(newPage, perPage.value, { ...option.value, sortOrder: sort.order, sortKey: sort.by });
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
    if (sort.by === columnKey) {
        toggleSort();
    }
    else {
        sort.by = columnKey;
        sort.order = 'DESC';
    }
    await getCrmPlus(page.value, perPage.value, { ...option.value, sortOrder: sort.order, sortKey: sort.by });
};
</script>
