<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Des binômes" />

        <DashboardAdminPageContent>
            <div class="p-4 flex gap-3 items-center overflow-x-auto pb-3 px-4 scrollbar-hide">
                <InputIcon
                    v-model="option.zip"
                    rounded="md"
                    placeholder="Code postal"
                    class="w-[250px]"
                    type="number"
                    @input="debouncedFilterPartnerships"
                />
                <InputIcon
                    v-model="option.city"
                    rounded="md"
                    placeholder="Ville"
                    class="w-[250px]"
                    @input="debouncedFilterPartnerships"
                />
                <Button
                    class="rounded-md"
                >
                    <ArrowPathIcon class="md:mr-2" />
                    <span class="hidden md:inline-block">Restaurer</span>
                </Button>
            </div>

            <DataTable
                :data="demandPartners.data"
                :columns="columns"
            />

            <div>
                <CustomPagination
                    :default-page="page"
                    :per-page="perPage"
                    :total="demandPartners.total"
                    @update:page="refreshReplacement"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { Button } from '@/components/ui/button';

import { PERPAGE } from '~/lib/constants';
import { debounce } from '~/lib/utils';
import type { UserPartner } from '~/lib/types';

useHead({ title: 'Binômes' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { fetchDemandPartners, demandPartners } = usePartners();

const perPage = ref(PERPAGE);
const page = ref(1);

const initialFilter = {
    zip: null,
    city: null,
    type: null,
};

const option = ref({ ...initialFilter });

const filterPartnerships = async () => {
    const currentFilter = {
        ...option.value,
        postalCode: option.value.zip,
        cities: option.value.city,
    };

    await fetchDemandPartners({
        postalCode: currentFilter.zip,
        cities: currentFilter.city,
        page: page.value,
        perPage: perPage.value,
    });
};

const debouncedFilterPartnerships = debounce(filterPartnerships, 100);

const refreshReplacement = async (page: number) => {
    await fetchDemandPartners({
        postalCode: option.value.zip,
        cities: option.value.city,
        page: page,
        perPage: perPage.value,
    });
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;

    await fetchDemandPartners({
        postalCode: option.value.zip,
        cities: option.value.city,
        page: page.value,
        perPage: perPage.value,
    });
};

const columns: ColumnDef<UserPartner>[] = [

];
</script>
