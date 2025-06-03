<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button variant="outline">
                Edit Profile
            </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ props.home ? 'Mis à jour' : 'Nouveau' }}</DialogTitle>
            </DialogHeader>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                <div>
                    <InputIcon
                        v-model="localHome.title"
                        rounded="md"
                        label="Nom"
                    />
                </div>
                <div>
                    <InputIcon
                        v-model="localHome.description"
                        rounded="md"
                        label="Description"
                    />
                </div>
                <div>
                    <Select
                        v-model="localHome.active"
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
                                    v-for="(status, index) in [{ active: true, label: 'Active' }, { active: false, label: 'Inactive' }]"
                                    :key="index"
                                    :value="status.active"
                                >
                                    <span class="text-sm">{{ status.label }}</span>
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter>
                <Button
                    type="submit"
                    @click="onSubmit"
                >
                    Enregistrer
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
    open: boolean;
    home?: HomeType;
    handleSave: (updatedHome: HomeType) => void;
}>();

const localHome = reactive<HomeType>({
    id: null,
    title: null,
    description: null,
    active: false,
});

watch(() => props.home, (newHome) => {
    if (newHome) {
        Object.assign(localHome, newHome);
    }
    else {
        localHome.id = null;
        localHome.title = null;
        localHome.description = null;
        localHome.active = 0;
    }
}, { immediate: true, deep: true });

const onSubmit = () => {
    props.handleSave({ ...localHome });
};
</script>
