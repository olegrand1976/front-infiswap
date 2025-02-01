<template>
    <div class="container h-[3.5rem] flex items-center rounded-lg -mt-2 bg-gray-100">
        <div class="flex justify-between w-full">
            <div>
                <Form>
                    <FormField name="search">
                        <FormItem>
                            <FormControl>
                                <div class="flex w-96 bg-gray-200 rounded-full items-center justify-between ps-3 pe-1">
                                    <Input
                                        :v-model="search"
                                        placeholder="Rechercher"
                                        class="w-full text-xs"
                                    />
                                    <Button
                                        type="submit"
                                        class="bg-primary text-white w-7 h-7 rounded-full"
                                    >
                                        <MagnifyingGlassIcon class="h-7 w-7" />
                                    </Button>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </Form>
            </div>

            <div class="flex space-x-8 items-center justify-end">
                <div class="relative">
                    <div class="absolute -top-3 -right-3">
                        <Badge class="pl-1.5">
                            {{ emailCount }}
                        </Badge>
                    </div>
                    <EnvelopeIcon class="h-7 w-7 text-gray-500" />
                </div>
                <div class="relative">
                    <div class="absolute -top-3 -right-3">
                        <Badge class="pl-1.5">
                            {{ notificationCount }}
                        </Badge>
                    </div>
                    <BellIcon class="h-7 w-7 text-gray-500" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon, EnvelopeIcon, BellIcon } from '@heroicons/vue/24/solid';
import { Badge } from '@/components/ui/badge';

const search = ref('');
const emailCount = ref(13);
const notificationCount = ref(2);
</script>
