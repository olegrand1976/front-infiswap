<template>
    <form
        class="w-full"
        @submit.prevent="submit"
    >
        <Separator class="my-4 lg:my-10" />

        <div class="grid lg:grid-cols-3 gap-8 items-center">
            <div class="lg:col-span-1">
                <h3 class="font-semibold text-lg">
                    Utilisateur sélectionné
                </h3>
                <p class="mt-2">
                    L'utilisateur à attribuer le bon de commande
                </p>
            </div>

            <div class="lg:col-span-2 flex gap-8">
                <InputIcon
                    rounded="md"
                    class="max-w-full"
                    :model-value="user?.full_name"
                    :disabled="true"
                />

                <Button
                    class="rounded-md"
                    @click="showModalUser = true"
                >
                    <EyeIcon />
                    <span>Détail</span>
                </Button>

                <Dialog
                    v-model:open="showModalUser"
                    class="fixed inset-0 flex justify-center items-center bg-black/50"
                >
                    <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-2">
                        <UsersCard :user="user" />
                    </DialogContent>
                </Dialog>
            </div>
        </div>

        <Separator class="my-4 lg:my-10" />

        <div class="grid grid-cols-3 gap-8 items-center">
            <div class="lg:col-span-1 text-nowrap lg:text-wrap">
                <h3 class="font-semibold text-lg">
                    Information
                </h3>
                <p class="mt-2">
                    Les informations à compléter
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-8">
                <Select
                    v-model="formData.formula"
                    label="Formule"
                    class="font-medium"
                >
                    <SelectTrigger
                        position="right"
                        class="rounded-md mt-2 text-nowrap"
                    >
                        <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent class="border border-none">
                        <SelectGroup>
                            <SelectItem :value="'starter'">
                                <span class="text-sm">Starter</span>
                            </SelectItem>
                            <SelectItem :value="'standard'">
                                <span class="text-sm">Standard</span>
                            </SelectItem>
                            <SelectItem :value="'custom_domain'">
                                <span class="text-sm">Nom de domaine personnalisé</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div class="flex flex-col space-y-3 text-gray-600 text-sm">
                    <label class="font-medium">
                        Mode de paiement
                    </label>
                    <div class="flex gap-8 items-center">
                        <div class="flex gap-3 items-center">
                            <input
                                id="monthly"
                                v-model="formData.paymentMode"
                                type="radio"
                                value="monthly"
                            >
                            <label
                                for="monthly"
                                class="text-sm"
                            >
                                Mensuel
                            </label>
                        </div>

                        <div class="flex gap-3 items-center">
                            <input
                                id="yearly"
                                v-model="formData.paymentMode"
                                type="radio"
                                value="yearly"
                            >
                            <label
                                for="yearly"
                                class="text-sm"
                            >Annuel</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Separator class="my-10" />

        <Button
            class="rounded-md mt-4 flex justify-center mx-auto w-64"
            type="submit"
            :in-progress="inProgress"
        >
            Créer
        </Button>

        <Dialog
            v-model:open="showSignPDFModal"
        >
            <DialogContent class="max-w-lg text-center">
                <DialogHeader>
                    <DialogTitle class="text-xl font-semibold text-green-600">
                        Félicitations !
                    </DialogTitle>
                </DialogHeader>
                <div class="mt-4 text-gray-700">
                    Votre bon de commande a été créé avec succès.
                </div>

                <DialogFooter class="mt-6 flex justify-center">
                    <Button
                        variant="secondary"
                        class="px-6 rounded-xl shadow-md hover:shadow-lg"
                        @click="handleReportSign"
                    >
                        Consulter la liste
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </form>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeIcon } from '@heroicons/vue/24/outline';
import { useContract } from '@/composables/useContract';
import { useAuth } from '@/composables/useAuth';

const props = defineProps<{
    initialContract?: any;
    mode?: 'create' | 'edit';
}>();

const user = ref(null);
const { $toast } = useNuxtApp();
const router = useRouter();
const { create, update } = useContract();
const { show } = useAuth();

const showModalUser = ref(false);
const showSignPDFModal = ref(false);

const fetchUser = async () => {
    if (props.mode === 'edit' && props.initialContract?.user_id) {
        try {
            user.value = await show(props.initialContract.user_id);
        }
        catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            $toast({
                description: 'Erreur lors de la récupération de l\'utilisateur',
                status: 'error',
                variant: 'destructive',
            });
        }
    }
    else {
        const storedUser = localStorage.getItem('user_contract');
        if (storedUser) {
            user.value = JSON.parse(storedUser);
        }
    }
};

await fetchUser();

const formData = reactive({
    userId: props.initialContract?.user_id || user.value?.id || null,
    formula: props.initialContract?.formula || '',
    paymentMode: props.initialContract?.payment_mode || '',
});

const resetForm = () => {
    formData.userId = user.value?.id || null;
    formData.formula = '';
    formData.paymentMode = '';
};

watch(
    () => props.initialContract,
    async (newVal) => {
        if (newVal) {
            formData.userId = newVal.user_id || null;
            formData.formula = newVal.formula || '';
            formData.paymentMode = newVal.payment_mode || '';

            if (props.mode === 'edit' && newVal.user_id) {
                try {
                    const response = await show(newVal.user_id);
                    user.value = response.user;
                }
                catch (error) {
                    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
                }
            }
        }
    },
    { immediate: true },
);

const { submit, inProgress } = useSubmit(async () => {
    try {
        if (props.mode === 'edit') {
            await update(props.initialContract.id, formData);
            $toast({ description: 'Contrat modifié avec succès !' });
            router.push('/dashboard/admin/contracts/nurstech');
        }
        else {
            const result = await create(formData);
            if (result.contract) {
                resetForm();
                showSignPDFModal.value = true;
            }
        }
    }
    catch (error) {
        $toast({
            description: error,
            status: 'error',
            variant: 'destructive',
        });
    }
});

const handleReportSign = () => {
    showSignPDFModal.value = false;
    localStorage.removeItem('user_contract');
    router.push('/dashboard/admin/contracts/nurstech');

    $toast({
        description: 'Bon de commande créé avec succès !',
    });
};
</script>
