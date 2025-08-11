<template>
    <div>
        <DashboardAdminPageHeader :title="`Modification Produit`" />
        <DashboardAdminPageContent class="bg-gray-100">
            <ProductsAdminModalForm :product="product" />
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '~/lib/types';

useHead({ title: 'Modification produit' });

const route = useRoute();
const product = ref<Product>(null);
const { get } = useProduct();
const id = computed(() => route.params.id);

await get(Number(id.value)).then((response) => {
    product.value = response.data;
});

definePageMeta({
    layout: 'dashboard',
});
</script>
