<template>
    <Select
        :model-value="currentLocale"
        @update:model-value="onLocaleChange"
    >
        <SelectTrigger
            class="flex md:w-24 lg:w-auto space-x-1 lg:space-x-2 border border-none lg:text-sm md:text-xs"
            position="left"
        >
            <SelectValue />
        </SelectTrigger>

        <SelectContent class="border border-none">
            <SelectGroup class="w-20">
                <div
                    v-for="language in LANGUAGES"
                    :key="language.value"
                    class="flex justify-center items-center"
                >
                    <SelectItem :value="language.value">
                        <div class="flex space-x-1">
                            <LayoutsAppImage
                                :src="language.icon"
                                :alt="language.name"
                                class="w-4 h-3 my-auto mr-2"
                                format="png"
                            />
                            <span class="md:text-xs lg:text-sm">{{ language.label }}</span>
                        </div>
                    </SelectItem>
                </div>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>

<script lang="ts" setup>
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LANGUAGES } from '~/lib/constants';
import { isAppLocale, type AppLocale } from '~/utils/appLocale';

const { locale: currentLocale, applyLocale } = useAppLocale();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();

async function onLocaleChange(value: unknown) {
    if (!isAppLocale(value)) {
        return;
    }

    const next = value as AppLocale;
    await applyLocale(next);
    await router.push(switchLocalePath(next));
}
</script>
