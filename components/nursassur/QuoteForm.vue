<template>
    <div class="container my-20 lg:my-3232">
        <h2 class="text-2xl text-primary font-bold">
            Formulaire
        </h2>

        <section class="mt-8 grid lg:grid-cols-4 bg-white shadow-xl rounded-3xl relative">
            <form
                class="lg:col-span-3 lg:w-[80%] xl:w-[70%] space-y-6 py-6 px-6 sm:px-12"
                @submit.prevent="submit"
            >
                <div class="space-y-2">
                    <label class="text-primary font-semibold">
                        Nom
                    </label>
                    <input
                        v-model="formData.name"
                        type="text"
                        class="w-full border border-gray-300 rounded-md text-sm py-3 px-2 focus:outline-none focus:ring-1 focus:ring-primary mt-4"
                    >
                </div>

                <div class="space-y-2">
                    <label class="text-primary font-semibold">
                        Email
                    </label>
                    <input
                        v-model="formData.email"
                        type="email"
                        class="w-full border border-gray-300 rounded-md text-sm py-3 px-2 focus:outline-none focus:ring-1 focus:ring-primary mt-4"
                    >
                </div>

                <div class="space-y-2">
                    <label class="text-primary font-semibold">
                        Téléphone
                    </label>
                    <input
                        v-model="formData.phone"
                        type="text"
                        class="w-full border border-gray-300 rounded-md text-sm py-3 px-2 focus:outline-none focus:ring-1 focus:ring-primary mt-4"
                    >
                </div>

                <div class="space-y-2">
                    <label class="text-primary font-semibold">
                        Commentaire
                    </label>
                    <textarea
                        v-model="formData.description"
                        rows="5"
                        class="w-full border border-gray-300 rounded text-sm p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <Button
                    class="!mt-12 !mb-4 !rounded-md !w-full"
                    type="submit"
                    :in-progress="inProgress"
                >
                    CRÉER MON DEVIS NURSASSUR
                </Button>
            </form>

            <div class="hidden lg:block lg:col-span-1 bg-primary relative h-full rounded-r-3xl" />

            <LayoutsAppImage
                src="home/woman_nurse_plus.png"
                class="hidden lg:block absolute top-1/3 right-12 xl:right-24 w-80 xl:w-96"
            />
        </section>

        <p class="mt-8 font-medium text-xs">
            📩  Recevez une proposition personnalisée <span class="text-primary">en moins de 48h</span>
        </p>
    </div>
</template>

<script lang="ts" setup>
import { useService } from '~/composables/useService';

const { submitContact } = useService();
const { $toast } = useNuxtApp();

const props = defineProps<{
    selectedItems?: string[];
}>();

const emit = defineEmits<{
    (e: 'update:selectedItems', value: string[]): void;
}>();

const formData = reactive({
    product: 'NursAssur',
    name: '',
    email: '',
    phone: '',
    description: '',
    interested_products: [],
});

const resetFormData = () => {
    formData.product = 'NursAssur';
    formData.name = '';
    formData.email = '';
    formData.phone = '';
    formData.description = '';
    formData.interested_products = [];

    const selected = ref<string[]>(props.selectedItems ? [...props.selectedItems] : []);
    selected.value = [];

    emit('update:selectedItems', selected.value);
};

const {
    submit,
    inProgress,
} = useSubmit(
    () => {
        formData.interested_products = props.selectedItems.filter(
            item => item !== 'Autre (à préciser dans le formulaire)',
        );

        return submitContact(formData).then(() => {
            $toast({
                description: 'Demande de devis envoyé avec succès',
            });

            resetFormData();
        });
    },
);
</script>
