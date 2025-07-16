<template>
    <div class="container my-20 lg:my-32">
        <h2 class="text-center text-2xl font-semibold text-primary lg:text-start">
            💡 Je suis intéressé-e par les produits suivants:
        </h2>

        <div class="mt-6 grid lg:grid-cols-2 gap-16 items-stretch h-full">
            <section class="grid gap-4">
                <div
                    v-for="item in items"
                    :key="item"
                    class="flex items-center"
                >
                    <label
                        :for="item"
                        class="grid grid-cols-[8%_92%] bg-gray-100 items-center w-full rounded-md cursor-pointer hover:bg-primary hover:text-white group px-4 py-3 transition-colors"
                        :class="{ 'bg-primary text-white font-medium': selectedItems.includes(item) }"
                    >
                        <Checkbox
                            :id="item"
                            :checked="selectedItems.includes(item)"
                            :value="item"
                            class="group-hover:border-white"
                            @update:checked="updateSelection(item, $event)"
                        />
                        <span class="ml-1">
                            {{ item }}
                        </span>
                    </label>
                </div>
            </section>

            <section class="hidden lg:grid gap-4">
                <LayoutsAppImage
                    src="home/nurse_woman.png"
                    class="h-80 w-full object-cover rounded-3xl"
                />
                <LayoutsAppImage
                    src="home/article_role-of-nursing-info_header.jpg"
                    class="h-full w-full rounded-3xl"
                />
            </section>
        </div>
    </div>
</template>

<script lang="ts" setup>
const selectedItems = ref([]);

const items = [
    'Responsabilité civile professionnelle',
    'Protection juridique professionnelle',
    'Assurance véhicule professionnel',
    'Assurance prévoyance (arrêt maladie, invalidité...)',
    'Assurance hospitalisation adaptée',
    'Crédit (personnel, société, hypothécaire) -> solution sur mesure',
    'Autre (à préciser dans le formulaire)',
];

const updateSelection = (item: string, checked: boolean) => {
    if (checked) {
        if (!selectedItems.value.includes(item)) {
            selectedItems.value = [...selectedItems.value, item];
        }
    }
    else {
        selectedItems.value = selectedItems.value.filter(r => r !== item);
    }
};
</script>
