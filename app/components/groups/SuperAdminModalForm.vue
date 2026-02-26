<template>
    <form
        @submit.prevent="submit"
    >
        <Separator class="my-4 lg:my-10" />

        <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    Nouveau groupe
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations à compléter
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                <InputIcon
                    v-model="form.name"
                    rounded="md"
                    label="Nom"
                    placeholder="Nom"
                />
            </div>
        </div>

        <Separator class="my-4 lg:my-10" />

        <div class="col-span-3 grid place-content-center">
            <Button
                type="submit"
                class="rounded-md w-52"
                :in-progress="inProgress"
            >
                Créer
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { newGroup } = useGroup();
const { refresh } = useAuth();

const form = {
    name: '',
};

const { submit, inProgress } = useSubmit(async () => {
    try {
        await newGroup(form);
        await refresh();

        $toast({
            description: 'Groupe créer avec succès',
        });

        navigateTo({
            path: '/dashboard/admin/groups',
        });
    }
    catch (err) {
        console.log('erreur ', err);
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
