<template>
    <div>
        <LayoutsAppImage
            :src="'nurs_assur.png'"
            alt="logo-NursAssur"
            class="hover:cursor-pointer"
            :class="classe"
            format="png"
            @click="handleClick"
        />

        <Dialog v-model:open="showNursAssur">
            <DialogContent>
                <NursassurForm @close="showNursAssur = false" />
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue';

defineProps<{
    classe?: string;
}>();

const { isLoggedIn } = useAuth();
const showNursAssur = ref(false);

function handleClick() {
    if (isLoggedIn.value) {
        showNursAssur.value = true;
    }
    else {
        navigateTo('/');
    }
}
</script>
