<template>
    <div>
        <LayoutsAppImage
            :src="'nurs_tech.png'"
            alt="logo-NursTech"
            class="hover:cursor-pointer"
            :class="classe"
            format="png"
            @click="handleClick"
        />

        <Dialog v-model:open="showNursTech">
            <DialogContent>
                <NurstechForm @close="showNursTech = false" />
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
const showNursTech = ref(false);

function handleClick() {
    if (isLoggedIn.value) {
        showNursTech.value = true;
    }
    else {
        navigateTo('/nurstech-by-infiswap');
    }
}
</script>
