<script setup lang="ts">
import { GraduationCap } from 'lucide-vue-next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { User } from '~/lib/types';
import { EDUCATION_LEVEL_OPTIONS, needsEducationLevel } from '~/utils/educationLevel';

const user = useState<User>('user');
const { updateEducationLevel } = useAuth();
const { $toast } = useNuxtApp();

const open = computed({
    get: () => needsEducationLevel(user.value),
    set: () => {},
});

const selectedLevel = ref<'a1' | 'a2' | ''>('');
const saving = ref(false);

async function save() {
    if (!selectedLevel.value) {
        return;
    }

    saving.value = true;
    try {
        await updateEducationLevel(selectedLevel.value);
        $toast({
            title: 'Niveau enregistré',
            description: 'Votre niveau d\'études a bien été mis à jour.',
        });
    }
    catch (error) {
        console.error(error);
        $toast({
            title: 'Erreur',
            description: 'Impossible d\'enregistrer le niveau d\'études.',
            variant: 'destructive',
        });
    }
    finally {
        saving.value = false;
    }
}
</script>

<template>
    <Dialog :open="open">
        <DialogContent
            class="sm:max-w-md [&>button.absolute]:hidden"
            @escape-key-down.prevent
            @pointer-down-outside.prevent
            @interact-outside.prevent
        >
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2">
                    <GraduationCap class="h-5 w-5 text-primary" />
                    Niveau d'études
                </DialogTitle>
                <DialogDescription>
                    Pour les infirmier(ère)s en Belgique, indiquez votre niveau d'études afin d'améliorer la qualité des candidatures.
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-3 py-2">
                <label
                    v-for="level in EDUCATION_LEVEL_OPTIONS"
                    :key="level.value"
                    class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition"
                    :class="selectedLevel === level.value ? 'border-primary bg-primary/5' : 'border-gray-200'"
                >
                    <input
                        v-model="selectedLevel"
                        type="radio"
                        class="accent-primary"
                        name="education-level-gate"
                        :value="level.value"
                    >
                    <span class="font-medium text-gray-800">{{ level.label }}</span>
                </label>
            </div>

            <div class="pt-2">
                <Button
                    type="button"
                    class="w-full"
                    :disabled="!selectedLevel || saving"
                    :in-progress="saving"
                    @click="save"
                >
                    Valider
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>
