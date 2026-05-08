<template>
    <form
        class="mb-12"
        @submit.prevent="submit"
    >
        <Separator class="my-4 lg:my-10" />

        <div class="mt-8 grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    {{ service?.id ? 'Mettre à jour le service' : 'Nouveau service' }}
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations à compléter
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-8">
                <InputIcon
                    v-model="formData.name"
                    :icon="Briefcase"
                    rounded="md"
                    label="Nom du service"
                    placeholder="Nom du service *"
                />

                <InputIcon
                    v-model="formData.phoneNumber"
                    :icon="Phone"
                    rounded="md"
                    label="N° de téléphone"
                    placeholder="N° de téléphone"
                />

                <div class="grid sm:grid-cols-2 gap-4">
                    <InputIcon
                        v-model="formData.address.street"
                        :icon="MapPin"
                        rounded="md"
                        label="Rue"
                        placeholder="Rue *"
                    />
                    <InputIcon
                        v-model="formData.address.zipCode"
                        :icon="Inbox"
                        rounded="md"
                        label="Code postal"
                        placeholder="Code postal *"
                    />
                </div>

                <div class="grid sm:grid-cols-2 gap-4">
                    <InputIcon
                        v-model="formData.address.city"
                        :icon="Building2"
                        rounded="md"
                        label="Ville"
                        placeholder="Ville *"
                    />
                    <InputIcon
                        v-model="formData.address.country"
                        :icon="MapPin"
                        rounded="md"
                        label="Pays"
                        placeholder="Pays"
                    />
                </div>

                <InputIcon
                    v-model="formData.address.additionnalInformation"
                    :icon="EllipsisHorizontalCircleIcon"
                    rounded="md"
                    label="Complément d'adresse"
                    placeholder="Complément d'adresse"
                />

                <Separator class="my-4 lg:my-10" />

                <div class="col-span-3 grid place-content-center">
                    <Button
                        type="submit"
                        class="rounded-md w-52"
                        :in-progress="inProgress"
                    >
                        {{ service?.id ? 'Mettre à jour' : 'Créer le service' }}
                    </Button>
                </div>
            </div>
        </div>
    </form>
</template>

<script lang="ts" setup>
import { Briefcase, Building2, Inbox, MapPin, Phone, Star } from 'lucide-vue-next';

const props = defineProps({
    service: {
        type: Object,
        default: () => ({
            id: undefined,
            name: '',
            phoneNumber: '',
            address: {
                street: '',
                city: '',
                zipCode: '',
                country: '',
                additionnalInformation: '',
            },
        }),
    },
});

const { create, update } = useInstitutionServices();

const { $toast } = useNuxtApp();

const formData = reactive({
    name: props.service?.name || '',
    phoneNumber: props.service?.phoneNumber || props.service?.phone_number || '',
    address: {
        street: props.service?.address?.street || '',
        city: props.service?.address?.city || '',
        zipCode: props.service?.address?.zipCode || '',
        country: props.service?.address?.country || '',
        additionnalInformation: props.service?.address?.additionnalInformation || '',
    },
});

watch(() => props.service, (newVal) => {
    if (newVal) {
        formData.name = newVal.name || '';
        formData.phoneNumber = newVal.phoneNumber || newVal.phone_number || '';
        formData.address = {
            street: newVal.address?.street || '',
            city: newVal.address?.city || '',
            zipCode: newVal.address?.zipCode || '',
            country: newVal.address?.country || '',
            additionnalInformation: newVal.address?.additionnalInformation || '',
        };
    }
}, { deep: true });

const resetForm = () => {
    formData.name = '';
    formData.phoneNumber = '';
    formData.address = {
        street: '',
        city: '',
        zipCode: '',
        country: '',
        additionnalInformation: '',
    };
};

const router = useRouter();

const { submit, inProgress } = useSubmit(async () => {
    try {
        const payload = {
            name: formData.name,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
        };

        if (props.service?.id) {
            await update(props.service.id, payload);
            $toast({
                description: 'Service mis à jour avec succès',
            });
        }
        else {
            await create(payload);

            resetForm();
            $toast({
                description: 'Service créé avec succès',
            });
            router.push('/dashboard/institution/services');
        }
    }
    catch (err) {
        if (err.data?.errors) {
            const firstError = Object.values(err.data.errors)[0][0];
            $toast({
                description: firstError,
                status: 'error',
                variant: 'destructive',
            });
        }
    }
});
</script>
