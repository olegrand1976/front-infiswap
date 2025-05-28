<template>
    <div>
        <div class="flex mt-6">
            <Form class="grid grid-cols-1 sm:grid-cols-5 2xl:grid-cols-6 w-full gap-4">
                <div class="col-span-4 md:col-span-2 lg:col-span-1 lg:w-52 2xl:w-72">
                    <FormField name="days">
                        <FormItem>
                            <FormControl>
                                <div class="flex bg-primary space-x-3 rounded-full items-center justify-between ps-3 pe-1">
                                    <h5 class="text-white text-xs">
                                        Jours
                                    </h5>
                                    <Select>
                                        <SelectTrigger
                                            class="bg-white my-0.5 w-56 lg:w-36 2xl:w-52 rounded-full flex space-x-1 lg:space-x-2 border border-none lg:text-sm md:text-xs"
                                            position="right"
                                        >
                                            <SelectValue
                                                :placeholder="selectedDaysPlaceholder"
                                                class="text-xs w-[200%] truncate"
                                            />
                                        </SelectTrigger>
                                        <SelectContent class="border border-none">
                                            <SelectGroup class="w-32">
                                                <div
                                                    v-for="(day, index) in days"
                                                    :key="index"
                                                    class="flex items-center space-2 mb-2"
                                                >
                                                    <Checkbox
                                                        class="mr-2"
                                                        :checked="formData.selectedDays.includes(day)"
                                                        @update:checked="toggleDay(day)"
                                                    />
                                                    <label class="text-xs">{{ frenchDays[day] }}</label>
                                                </div>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>
                <div class="col-span-4 md:col-span-2 lg:w-64 lg:ml-6 xl:ml-0 xl:w-[22rem] 2xl:ml-16 2xl:w-[26rem]">
                    <FormField name="postalCode">
                        <FormItem>
                            <FormControl>
                                <div
                                    class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1"
                                    title="Saisissez le code postal puis appuyer sur Entrée pour l'ajouter"
                                >
                                    <h5 class="text-white text-xs">
                                        <span class="xl:hidden">CP</span>
                                        <span class="hidden xl:inline-block">Codes postaux</span>
                                    </h5>
                                    <TagsInput
                                        v-model="formData.postalCodeTags"
                                        class="w-[14rem] 2xl:w-72 flex items-center h-9 text-xs my-0.5 rounded-full border border-none"
                                    >
                                        <div
                                            :class="[Array.isArray(formData.postalCodeTags) && formData.postalCodeTags.length ? 'w-1/2' : 'hidden']"
                                            class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar"
                                        >
                                            <TagsInputItem
                                                v-for="item in formData.postalCodeTags"
                                                :key="item"
                                                :value="item"
                                                class="flex-shrink-0 max-w-[7.5rem]"
                                            >
                                                <TagsInputItemText class="text-xs" />
                                                <TagsInputItemDelete @click="() => removeTag(formData.postalCodeTags, item)" />
                                            </TagsInputItem>
                                        </div>
                                        <TagsInputInput
                                            v-model="postalCodeInput"
                                            :class="[Array.isArray(formData.postalCodeTags) && formData.postalCodeTags.length ? 'w-1/2' : 'w-full']"
                                            class="text-xs flex items-center"
                                            placeholder="8793"
                                            @blur="handleBlur"
                                            @keydown.enter="() => addTag(postalCodeInput, formData.postalCodeTags)"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>
                <div class="col-span-4 md:col-span-2 lg:col-span-1 lg:-ml-[6.5rem] xl:-ms-16 lg:w-72 2xl:w-[26rem] 2xl:ml-4">
                    <FormField name="city">
                        <FormItem>
                            <FormControl>
                                <div
                                    class="flex space-x-3 bg-primary rounded-full items-center justify-between ps-3 pe-1"
                                    title="Saisissez la ville puis appuyer sur Entrée pour l'ajouter"
                                >
                                    <h5 class="text-white text-xs">
                                        <span class="xl:hidden">Ville(s)</span>
                                        <span class="hidden xl:inline-block">Ville(s)</span>
                                    </h5>
                                    <TagsInput
                                        v-model="formData.cityTags"
                                        class="w-[14rem] 2xl:w-72 flex items-center h-9 text-xs my-0.5 rounded-full border border-none"
                                    >
                                        <div
                                            :class="[Array.isArray(formData.cityTags) && formData.cityTags.length ? 'w-1/2' : 'hidden']"
                                            class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar"
                                        >
                                            <TagsInputItem
                                                v-for="item in formData.cityTags"
                                                :key="item"
                                                :value="item"
                                                class="flex-shrink-0 max-w-[6rem]"
                                            >
                                                <TagsInputItemText class="text-xs" />
                                                <TagsInputItemDelete @click="() => removeTag(formData.cityTags, item)" />
                                            </TagsInputItem>
                                        </div>
                                        <TagsInputInput
                                            v-model="cityInput"
                                            :class="[Array.isArray(formData.cityTags) && formData.cityTags.length ? 'w-1/2' : 'w-full']"
                                            class="text-xs flex items-center"
                                            placeholder="City38"
                                            @blur="handleBlur"
                                            @keydown.enter="() => addTag(cityInput, formData.cityTags)"
                                        />
                                    </TagsInput>
                                </div>
                            </FormControl>
                        </FormItem>
                    </FormField>
                </div>
                <div class="col-span-4 md:col-span-2 lg:col-span-1 2xl:ml-52 flex gap-3">
                    <Button
                        class="bg-primary flex items-center justify-center text-sm h-11 px-4 w-full md:w-auto"
                        @click="reinitializeFilter"
                    >
                        <ArrowPathIcon class="w-6" />
                        <span class="ml-2 block lg:hidden text-xs md:text-sm">Réinitialiser</span>
                    </Button>

                    <Button
                        class="text-sm bg-primary flex items-center justify-center h-11 px-4 w-full md:w-auto 2xl:px-10"
                        @click="submit"
                    >
                        <MagnifyingGlassIcon class="w-6" />
                        <span class="ml-2 text-xs md:text-sm">Rechercher</span>
                    </Button>
                </div>
            </Form>
        </div>

        <div class="grid my-8">
            <div class="hidden lg:block">
                <Table>
                    <TableHeader class="w-full">
                        <TableRow class="grid grid-cols-6 overflow-x-hidden gap-2 rounded-t-lg border-none">
                            <TableHead class="bg-primary w-full xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center text-white text-xs">
                                Jour
                            </TableHead>
                            <TableHead class="bg-primary w-full grid grid-cols-3 justify-center items-center text-white text-xs">
                                <div class="text-center">
                                    Matin
                                </div>
                                <div class="text-center">
                                    Midi
                                </div>
                                <div class="text-center">
                                    Soir
                                </div>
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Codes postaux
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Ville(s)
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Types de soins
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody class="rounded-b-lg">
                        <div v-if="loading && loadingSearch">
                            <TableRow
                                v-for="(_, index) in Array.from({ length: 10 })"
                                :key="index"
                                class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden h-16"
                            >
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                            </TableRow>
                        </div>
                        <div v-else-if="filteredReplacements.length === 0">
                            <p class="text-center text-gray-500 py-8">
                                Aucun résultat n'est trouvé
                            </p>
                        </div>
                        <div v-else>
                            <TableRow
                                v-for="replacement in filteredReplacements"
                                :key="replacement.id"
                                class="grid grid-cols-6 gap-2 border border-none overflow-x-hidden relative"
                            >
                                <div
                                    v-if="isUrgentReplacement(replacement) || replacement.replaced_by !== null"
                                    :class="[cn('-ml-[-2] text-xs absolute top-[5px] left-0 text-[0.7rem] font-bold px-2 py-[2px] rounded-br-[4px] z-10 animate-pulse shadow-md',
                                                { 'bg-yellow-400': replacement.replaced_by !== null },
                                                { 'bg-primary text-white ': replacement.replaced_by == null },
                                    )]"
                                >
                                    {{ replacement.replaced_by !== null ? 'FERMÉ' : 'URGENT' }}
                                </div>

                                <TableCell class="flex justify-center items-center bg-[#F1F2F7] xl:text-[0.75em] lg:text-[0.5em]">
                                    <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(replacement.start_date) }}</span>
                                    </div>
                                    <span class="flex items-center">au</span>
                                    <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(replacement.end_date) }}</span>
                                    </div>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs grid grid-cols-3 place-items-center">
                                    <div>
                                        <span v-if="hasShift(replacement, 'morning')">
                                            <CheckCircleIcon class="h-6 text-green-500" />
                                        </span>
                                        <span v-else />
                                    </div>
                                    <div>
                                        <span v-if="hasShift(replacement, 'afternoon')">
                                            <CheckCircleIcon class="h-6 text-green-500" />
                                        </span>
                                        <span v-else />
                                    </div>
                                    <div>
                                        <span v-if="hasShift(replacement, 'evening')">
                                            <CheckCircleIcon class="h-6 text-green-500" />
                                        </span>
                                        <span v-else />
                                    </div>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs">
                                    <div class="flex bg-[#E4E7F4] truncate h-10 rounded mt-3 items-center overflow-hidden">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                        <span
                                                            v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                            :key="index"
                                                            :class="[cn('mr-1', { 'text-success font-bold': isZipCodeHighlighted(zipCode) })]"
                                                        >
                                                            {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                        </span>
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span
                                                        v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                        :key="index"
                                                        :class="[cn('mr-1', { 'text-success font-bold': isZipCodeHighlighted(zipCode) })]"
                                                    >
                                                        {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs">
                                    <div class="flex bg-[#E4E7F4] truncate w-full h-10 rounded mt-3 items-center overflow-hidden">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                        <span
                                                            v-for="(city, index) in JSON.parse(replacement.cities)"
                                                            :key="index"
                                                            :class="[cn('mr-1', { 'text-success font-bold': hasMatchingCityFromUnique(city) })]"
                                                        >
                                                            {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
                                                        </span>
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <span
                                                        v-for="(city, index) in JSON.parse(replacement.cities)"
                                                        :key="index"
                                                        :class="[cn('mr-1', { 'text-success font-bold': hasMatchingCityFromUnique(city) })]"
                                                    >
                                                        {{ city }}{{ index < JSON.parse(replacement.cities).length - 1 ? ',' : '' }}
                                                    </span>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell class="bg-gray-100 text-xs pt-5">
                                    <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-start px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {{ getUniqueValues(replacement.care_types, careType => careType.name).join(', ') }}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {{ getUniqueValues(replacement.care_types, careType => careType.name).join(', ') }}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell class="text-xs flex items-center justify-center bg-[#F1F2F7] overflow-x-hidden pt-4">
                                    <template v-if="props.type === 'me'">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <EllipsisHorizontalIcon class="h-6 w-6 text-black hover:text-gray-600 cursor-pointer" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent class="w-48">
                                                <DropdownMenuItem as-child>
                                                    <NuxtLink
                                                        :href="`/dashboard/replacements/detail/${replacement.id}`"
                                                        class="flex items-center space-x-2 text-sm"
                                                    >
                                                        <EyeIcon class="h-4 w-4" />
                                                        <span>Voir</span>
                                                    </NuxtLink>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    class="flex items-center space-x-2 text-sm"
                                                    @click="openEditDialog(replacement)"
                                                >
                                                    <PencilSquareIcon class="h-4 w-4" />
                                                    <span>Modifier</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    v-if="user.nurse.id == replacement.nurse_id && replacement.replaced_by == null"
                                                    class="flex items-center space-x-2 text-sm"
                                                    @click="closeReplacementDialog = true"
                                                >
                                                    <XMarkIcon class="h-4 w-4" />
                                                    <span>Fermer</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </template>
                                    <template v-else>
                                        <Button
                                            class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white mx-auto justify-center items-center"
                                            :href="`/dashboard/replacements/detail/${replacement.id}`"
                                        >
                                            <EyeIcon class="h-6 mt-1" />
                                        </Button>
                                        <Button
                                            v-if="user.nurse.id == replacement.nurse_id && replacement.replaced_by == null"
                                            class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white mx-auto justify-center items-center"
                                            @click="closeReplacementDialog = true"
                                        >
                                            <XMarkIcon class="h-6 mt-1" />
                                        </Button>
                                    </template>

                                    <Dialog v-model:open="closeReplacementDialog">
                                        <DialogContent class="sm:max-w-lg overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Fermer le remplacement
                                                </DialogTitle>
                                                <DialogDescription class="mt-3 mb-6">
                                                    Etes-vous sur de vouloir fermer ce remplacement ?
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div class="mt-4 sm:mt-8 flex justify-center sm:justify-end space-x-6 items-center">
                                                <Button
                                                    variant="secondary"
                                                    class="bg-gray-200 hover:bg-gray-300 px-8"
                                                    @click="closeReplacementDialog = false"
                                                >
                                                    Non
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    class="px-8"
                                                    @click="handleCloseReplacement(replacement)"
                                                >
                                                    Oui
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <span class="bg-white h-[0.01em]" />
                            </TableRow>
                        </div>
                    </TableBody>
                </Table>
            </div>

            <div class="lg:hidden">
                <Table>
                    <TableHeader class="w-full">
                        <TableRow class="grid grid-cols-3 overflow-x-hidden gap-1 rounded-t-lg border-none">
                            <TableHead class="bg-primary w-full xl:col-span-1 lg:col-span-[1.5] flex justify-center items-center text-white text-xs">
                                Date
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Localité
                            </TableHead>
                            <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody class="rounded-b-lg">
                        <div v-if="loading && loadingSearch">
                            <TableRow
                                v-for="(_, index) in Array.from({ length: 10 })"
                                :key="index"
                                class="grid grid-cols-3 gap-1 border border-none overflow-x-hidden h-16"
                            >
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                                <TableCell><Skeleton class="h-10 w-full bg-gray-100" /></TableCell>
                            </TableRow>
                        </div>
                        <div v-else-if="filteredReplacements.length === 0">
                            <p class="text-center text-gray-500 py-8">
                                Aucun résultat n'est trouvé
                            </p>
                        </div>
                        <div v-else>
                            <TableRow
                                v-for="replacement in filteredReplacements"
                                :key="replacement.id"
                                class="grid grid-cols-3 gap-1 border border-none overflow-x-hidden relative gap-y-2"
                            >
                                <div
                                    v-if="isUrgentReplacement(replacement) || replacement.replaced_by !== null"
                                    :class="[cn('-ml-[-2] text-xs absolute top-[5px] left-0 text-[0.7rem] font-bold px-2 py-[2px] rounded-br-[4px] z-10 animate-pulse shadow-md',
                                                { 'bg-yellow-400': replacement.replaced_by !== null },
                                                { 'bg-primary text-white ': replacement.replaced_by == null },
                                    )]"
                                >
                                    {{ replacement.replaced_by !== null ? 'FERMÉ' : 'URGENT' }}
                                </div>

                                <TableCell class="flex flex-col items-center bg-[#F1F2F7] text-[0.75em] py-6">
                                    <template v-if="replacement.start_date !== replacement.end_date">
                                        <div class="flex h-6 py-1 px-2 mb-1 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(replacement.start_date) }}</span>
                                        </div>
                                        <span class="text-xs mb-1">au</span>
                                        <div class="flex h-6 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(replacement.end_date) }}</span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div
                                            class="flex h-full w-full justify-center items-center"
                                            style="min-height: 3rem;"
                                        >
                                            <span class="bg-[#E4E7F4] rounded px-2 py-1">{{ formatDate(replacement.start_date) }}</span>
                                        </div>
                                    </template>
                                </TableCell>

                                <TableCell class="bg-[#F1F2F7] text-xs px-2 py-4">
                                    <div class="bg-[#E4E7F4] rounded p-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger class="block w-full text-start">
                                                    <div class="flex flex-col space-y-1">
                                                        <span
                                                            v-for="(zipCode, index) in JSON.parse(replacement.zip_codes).slice(0, 3)"
                                                            :key="index"
                                                            :class="[cn('text-xs leading-snug', { 'text-success font-bold': isZipCodeHighlighted(zipCode) })]"
                                                        >
                                                            {{ zipCode }}
                                                        </span>

                                                        <span
                                                            v-if="JSON.parse(replacement.zip_codes).length > 3"
                                                            class="text-xs text-gray-500"
                                                        >
                                                            ...
                                                        </span>
                                                    </div>
                                                </TooltipTrigger>

                                                <TooltipContent class="text-sm max-w-[200px]">
                                                    <div class="flex flex-wrap gap-1">
                                                        <span
                                                            v-for="(zipCode, index) in JSON.parse(replacement.zip_codes)"
                                                            :key="'tooltip-' + index"
                                                            :class="[cn('text-xs', { 'text-success font-bold': isZipCodeHighlighted(zipCode) })]"
                                                        >
                                                            {{ zipCode }}{{ index < JSON.parse(replacement.zip_codes).length - 1 ? ',' : '' }}
                                                        </span>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </TableCell>

                                <TableCell class="text-xs bg-[#F1F2F7] overflow-x-hidden pt-4">
                                    <div class="flex flex-col items-center justify-center space-y-2">
                                        <template v-if="props.type === 'me'">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <EllipsisHorizontalIcon class="h-6 w-6 text-black hover:text-gray-600 cursor-pointer" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent class="w-48">
                                                    <DropdownMenuItem as-child>
                                                        <NuxtLink
                                                            :href="`/dashboard/replacements/detail/${replacement.id}`"
                                                            class="flex items-center space-x-2 text-sm"
                                                        >
                                                            <EyeIcon class="h-4 w-4" />
                                                            <span>Voir</span>
                                                        </NuxtLink>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        class="flex items-center space-x-2 text-sm"
                                                        @click="openEditDialog(replacement)"
                                                    >
                                                        <PencilSquareIcon class="h-4 w-4" />
                                                        <span>Modifier</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        v-if="user.nurse.id == replacement.nurse_id && replacement.replaced_by == null"
                                                        class="flex items-center space-x-2 text-sm"
                                                        @click="closeReplacementDialog = true"
                                                    >
                                                        <XMarkIcon class="h-4 w-4" />
                                                        <span>Fermer</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </template>
                                        <template v-else>
                                            <Button
                                                v-if="user.nurse.id == replacement.nurse_id && replacement.replaced_by == null"
                                                class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white justify-center items-center"
                                                @click="closeReplacementDialog = true"
                                            >
                                                <XMarkIcon class="h-6 mt-1" />
                                            </Button>
                                            <Button
                                                class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white justify-center items-center"
                                                :href="`/dashboard/replacements/detail/${replacement.id}`"
                                            >
                                                <EyeIcon class="h-6 mt-1" />
                                            </Button>
                                        </template>
                                    </div>

                                    <Dialog v-model:open="closeReplacementDialog">
                                        <DialogContent class="sm:max-w-lg overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Fermer le remplacement
                                                </DialogTitle>
                                                <DialogDescription class="mt-3 mb-6">
                                                    Etes-vous sur de vouloir fermer ce remplacement ?
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div class="mt-4 sm:mt-8 flex justify-center sm:justify-end space-x-6 items-center">
                                                <Button
                                                    variant="secondary"
                                                    class="bg-gray-200 hover:bg-gray-300 px-8"
                                                    @click="closeReplacementDialog = false"
                                                >
                                                    Non
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    class="px-8"
                                                    @click="handleCloseReplacement(replacement)"
                                                >
                                                    Oui
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                                <span class="bg-white h-[0.01em]" />
                            </TableRow>
                        </div>
                    </TableBody>
                </Table>
            </div>

            <div class="mt-4">
                <CustomPagination
                    v-if="pagination.total > 5"
                    :default-page="page"
                    :per-page="perPage"
                    :total="pagination.total"
                    @update:page="refreshReplacements"
                    @update:per-page="handlePerPageChange"
                />
            </div>
        </div>

        <Dialog v-model:open="editDialogOpen">
            <DialogContent class="sm:max-w-[40rem] h-[70vh] sm:h-[60vh] flex flex-col bg-white rounded-lg shadow-xl p-0 pb-16">
                <div class="flex-1 overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle class="text-xl font-semibold text-primary">
                            Modifier le remplacement
                        </DialogTitle>
                        <DialogDescription class="mt-2 text-gray-600">
                            Modifiez les détails du remplacement ci-dessous.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        class="mt-6 space-y-6"
                        @submit.prevent="submitEdit"
                    >
                        <div class="grid grid-cols-2 items-center gap-8">
                            <div class="flex flex-col space-y-2">
                                <label class="text-primary font-semibold">
                                    Date de début
                                </label>
                                <Input
                                    v-model="editFormData.startDate"
                                    type="date"
                                    class="rounded-full w-full outline-gray-300 focus:border-primary"
                                />
                            </div>

                            <div class="flex flex-col space-y-2">
                                <label class="text-primary font-semibold">
                                    Date de fin
                                </label>
                                <Input
                                    v-model="editFormData.endDate"
                                    type="date"
                                    class="rounded-full w-full outline-gray-300 focus:border-primary"
                                />
                            </div>
                        </div>

                        <div class="flex flex-col space-y-2">
                            <label class="text-primary font-semibold">
                                Créneau horaire
                            </label>
                            <div class="flex justify-between gap-4 sm:gap-8 items-center">
                                <InputTime
                                    v-model="editFormData.timeSlot.startAt"
                                    input-class="rounded-full border border-gray-300 focus:border-primary"
                                />
                                <p>à</p>
                                <InputTime
                                    v-model="editFormData.timeSlot.endAt"
                                    input-class="rounded-full border border-gray-300 focus:border-primary"
                                />
                            </div>
                        </div>

                        <div class="grid sm:grid-cols-2 gap-8 items-center">
                            <div class="flex flex-col space-y-2 w-[21rem] sm:w-auto">
                                <label class="text-primary font-semibold">
                                    Nombre de patients par jour
                                </label>
                                <InputIcon
                                    v-model="editFormData.patientCount"
                                    placeholder="Entrer un nombre"
                                    class="border border-gray-300 rounded-full focus:border-primary"
                                />
                            </div>

                            <div class="flex flex-col space-y-2">
                                <label class="text-primary font-semibold">
                                    Type de soins
                                </label>
                                <Select
                                    v-model="editFormData.careTypes"
                                    multiple
                                >
                                    <SelectTrigger
                                        class="w-[21rem] sm:w-full bg-white rounded-full text-nowrap border border-gray-300 focus:border-primary"
                                        position="right"
                                    >
                                        <SelectValue class="truncate w-[200rem]">
                                            <template v-if="getSelectedCareTypesText(editFormData.careTypes)">
                                                {{ getSelectedCareTypesText(editFormData.careTypes) }}
                                            </template>
                                            <template v-else>
                                                <span class="text-black/60">
                                                    Sélectionner
                                                </span>
                                            </template>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent class="border-none bg-white shadow-lg">
                                        <SelectGroup class="w-32">
                                            <div
                                                v-for="careType in careTypes"
                                                :key="careType.id"
                                                class="flex items-center space-x-2 mb-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                                @click="handleCareTypeClick(editFormData, careType.id)"
                                            >
                                                <Checkbox
                                                    :checked="editFormData.careTypes.includes(careType.id)"
                                                    class="mr-2"
                                                />
                                                <label class="text-xs text-nowrap cursor-pointer">
                                                    {{ careType.name }}
                                                </label>
                                            </div>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div class="grid sm:grid-cols-2 gap-8 items-center">
                            <InputTagManager
                                v-model="editFormData.zipCodes"
                                label="Codes postaux"
                                placeholder="6565, 4561, 1237"
                                :is-mobile="isMobileView"
                                :comma-validation="false"
                                :count="4"
                                @keydown.enter.prevent
                            />

                            <InputTagManager
                                v-model="editFormData.cities"
                                label="Villes"
                                placeholder="Anvers, Bruges, Gand"
                                :is-mobile="isMobileView"
                                :comma-validation="true"
                                :no-space-validation="true"
                                @keydown.enter.prevent
                            />
                        </div>

                        <div class="flex flex-col space-y-2">
                            <label class="text-primary font-semibold">
                                Commentaire
                            </label>
                            <Textarea
                                v-model="editFormData.comment"
                                placeholder="Écrivez un commentaire"
                                rows="6"
                                class="w-full border border-gray-400 focus:border-primary rounded-lg"
                            />
                        </div>
                    </form>
                </div>

                <div class="fixed w-full bottom-0 bg-white border-t border-gray-100 p-4 flex justify-end space-x-4">
                    <Button
                        variant="secondary"
                        class="bg-gray-200 hover:bg-gray-300 px-8"
                        @click="editDialogOpen = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        class="bg-primary hover:bg-primary/90 text-white px-8"
                        :in-progress="editInProgress"
                        @click="submitEdit"
                    >
                        Enregistrer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { MagnifyingGlassIcon, CheckCircleIcon, EyeIcon, ArrowPathIcon, XMarkIcon, EllipsisHorizontalIcon, PencilSquareIcon } from '@heroicons/vue/24/outline';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete } from '@/components/ui/tags-input';
import { useReplacements, useSearchReplacements } from '~/composables/useReplacements';
import { cn } from '@/lib/utils';
import { selectDays, getPeriodsFromTimeSlot } from '~/lib/utils';
import { PERPAGE } from '~/lib/constants';
import type { User, Replacement } from '~/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { InputTime } from '@/components/ui/input-time';
import InputTagManager from '@/components/InputTagManager.vue';
import { useCareTypes } from '@/composables/useCareTypes';

const { $toast } = useNuxtApp();

const props = defineProps({
    type: {
        type: String,
        required: false,
        default: '',
    },
    filterType: {
        type: String,
        required: false,
        default: 'all',
    },
});

const { loading, updateReplacement } = useReplacements();
const { loadingSearch, fetchReplacements } = useSearchReplacements();
const { careTypes, fetchCareTypes } = useCareTypes();

const perPage = ref(PERPAGE);
const page = ref(1);
const pagination = ref({
    current_page: 1,
    per_page: PERPAGE,
    total: 0,
    last_page: 1,
});

const isMobileView = ref(false);

onMounted(async () => {
    if (import.meta.client) {
        isMobileView.value = window.innerWidth <= 1024;
    }
    await fetchCareTypes();
    await fetchInitialData(page.value, perPage.value);
});

const user = useState<User>('user');
const settings = ref({});
try {
    settings.value = JSON.parse(user.value.settings);
}
catch (e) {
    console.error('Error parsing user settings:', e);
}

const postalCodeInput = ref('');
const cityInput = ref('');

const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const normalizeTime = (time) => {
    if (!time) return null;
    return time.split(':').slice(0, 2).join(':');
};

const hasShift = (replacement, period) => {
    const periods = new Set();

    const timeSlotRaw = replacement.time_slot || replacement.timeSlot;
    if (timeSlotRaw) {
        const timeSlot = typeof timeSlotRaw === 'string' ? JSON.parse(timeSlotRaw) : timeSlotRaw;
        if (timeSlot.start_at) {
            const startAt = normalizeTime(timeSlot.start_at);
            const endAt = normalizeTime(timeSlot.end_at);

            const timeSlotPeriods = getPeriodsFromTimeSlot(startAt, endAt);
            timeSlotPeriods.forEach(p => periods.add(p));
        }
    }

    if (replacement.details && Array.isArray(replacement.details)) {
        replacement.details.forEach((detail) => {
            if (detail.start_at) {
                const startAt = normalizeTime(detail.start_at);
                const endAt = normalizeTime(detail.end_at);

                const detailPeriods = getPeriodsFromTimeSlot(startAt, endAt);
                detailPeriods.forEach(p => periods.add(p));
            }
        });
    }

    return periods.has(period);
};

const isUrgentReplacement = (replacement) => {
    return !replacement.time_slot && replacement.details.length > 0;
};

const filteredReplacements = computed(() => {
    return currentReplacements.value.filter(
        replacement => props.filterType === 'all' || (props.filterType === 'urgent') === isUrgentReplacement(replacement),
    );
});

const replacement = ref<Replacement | undefined>();

const formData = reactive({
    postalCodeTags: Array.isArray(replacement.value?.zip_codes)
        ? replacement.value.zip_codes
        : replacement.value?.zip_codes
            ? [replacement.value.zip_codes]
            : [],
    cityTags: Array.isArray(replacement.value?.cities)
        ? replacement.value.cities
        : replacement.value?.cities
            ? [replacement.value.cities]
            : [],
    selectedDays: [],
    type: props.type,
});

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'all'];
const frenchDays = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche',
    all: 'Tous',
};

const toggleDay = (day: string) => {
    formData.selectedDays = selectDays(day, formData.selectedDays);
};

const selectedDaysPlaceholder = computed(() => {
    if (formData.selectedDays.length === 0) {
        return 'Sélectionner';
    }
    return formData.selectedDays.map(day => frenchDays[day]).join(', ');
});

const initialReplacements = ref({
    replacements: {
        data: [],
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    },
});
const currentReplacements = ref([]);

const fetchInitialData = async (page = 1, perPage = PERPAGE) => {
    const response = await fetchReplacements({
        postalCode: [],
        cities: [],
        selectedDays: [],
        type: props.type,
        page,
        perPage,
    });
    initialReplacements.value = response;
    currentReplacements.value = response.replacements.data;
    pagination.value = {
        current_page: response.replacements.current_page,
        per_page: response.replacements.per_page,
        total: response.replacements.total,
        last_page: response.replacements.last_page,
    };
};

const refreshReplacements = async (newPage: number) => {
    page.value = newPage;
    if (isSubmitted.value) {
        await submit();
    }
    else {
        await fetchInitialData(newPage, perPage.value);
    }
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    page.value = 1;
    if (isSubmitted.value) {
        await submit();
    }
    else {
        await fetchInitialData(1, value);
    }
};

const isSubmitted = ref(false);

const isZipCodeHighlighted = (zipCode) => {
    if (!isSubmitted.value) return false;
    return formData.postalCodeTags.includes(zipCode.toString().trim());
};

const getUniqueValues = (details, extractor, transformer = x => x) => {
    const values = details
        .flatMap(detail => extractor(detail) || [])
        .map(transformer)
        .filter(value => value);

    return [...new Set(values)];
};

const hasMatchingCityFromUnique = (city) => {
    if (!isSubmitted.value) return false;

    const normalizedCity = city.toLowerCase().trim();
    return formData.cityTags.some(tag => tag.toLowerCase() === normalizedCity)
        || formData.cityTags.some(tag => tag.toLowerCase().includes(normalizedCity));
};

const addTag = (inputRef, tagArrayRef, transformFn = val => val) => {
    const value = transformFn(inputRef.value.trim());
    if (value && !tagArrayRef.value.includes(value)) {
        tagArrayRef.value.push(value);
        inputRef.value = '';
    }
};

const removeTag = (tagArrayRef, tagToRemove) => {
    tagArrayRef.value = tagArrayRef.value.filter(tag => tag !== tagToRemove);
};

const handleBlur = (event) => {
    const inputEl = event.target;
    const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
    });

    inputEl.dispatchEvent(enterEvent);
};

const submit = async () => {
    isSubmitted.value = true;

    const hasSearchCriteria = formData.selectedDays.length > 0
        || formData.postalCodeTags.length > 0
        || formData.cityTags.length > 0;

    if (hasSearchCriteria) {
        const response = await fetchReplacements({
            selectedDays: Array.from(formData.selectedDays),
            postalCode: toRaw(formData.postalCodeTags),
            cities: toRaw(formData.cityTags),
            type: toRaw(formData.type),
            page: page.value,
            perPage: perPage.value,
        });

        currentReplacements.value = response.replacements.data;
        pagination.value = {
            current_page: response.replacements.current_page,
            per_page: response.replacements.per_page,
            total: response.replacements.total,
            last_page: response.replacements.last_page,
        };
    }
    else {
        await fetchInitialData(page.value, perPage.value);
    }
};

const reinitializeFilter = () => {
    formData.postalCodeTags = [];
    formData.cityTags = [];
    formData.selectedDays = [];
    page.value = 1;
};

watch(() => formData.postalCodeTags, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});

watch(() => formData.cityTags, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});

watch(() => formData.selectedDays, () => {
    if (isSubmitted.value) isSubmitted.value = false;
});

watch(
    [
        () => formData.postalCodeTags,
        () => formData.cityTags,
        () => formData.selectedDays,
    ],
    ([newPostalCodes, newCities, newDays]) => {
        if (
            newPostalCodes.length === 0
            && newCities.length === 0
            && newDays.length === 0
        ) {
            currentReplacements.value = initialReplacements.value.replacements.data;
            pagination.value = {
                current_page: initialReplacements.value.replacements.current_page,
                per_page: initialReplacements.value.replacements.per_page,
                total: initialReplacements.value.replacements.total,
                last_page: initialReplacements.value.replacements.last_page,
            };
            isSubmitted.value = false;
        }
        else if (isSubmitted.value) {
            submit();
        }
    },
    { deep: true },
);

const closeReplacementDialog = ref(false);

const handleCloseReplacement = async (replacement) => {
    replacement.status = 'closed';
    const response = await updateReplacement(replacement);

    if (response) {
        $toast({
            description: response.message,
        });

        currentReplacements.value = currentReplacements.value.filter(r => r.id !== replacement.id);
        pagination.value.total -= 1;
        closeReplacementDialog.value = false;
    }
};

const editDialogOpen = ref(false);
const editInProgress = ref(false);
const editFormData = reactive({
    startDate: '',
    endDate: '',
    patientCount: null,
    zipCodes: [],
    cities: [],
    careTypes: [],
    timeSlot: {
        startAt: '',
        endAt: '',
    },
    comment: '',
});

const openEditDialog = (replacement: Replacement) => {
    const formatDateToInput = (isoDate: string) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toISOString().split('T')[0];
    };

    const formatTimeToInput = (time: string) => {
        if (!time) return '';
        return time.split(':').slice(0, 2).join(':');
    };

    editFormData.startDate = formatDateToInput(replacement.start_date);
    editFormData.endDate = replacement.end_date ? formatDateToInput(replacement.end_date) : '';
    editFormData.patientCount = replacement.patient_count;
    editFormData.zipCodes = Array.isArray(replacement.zip_codes)
        ? replacement.zip_codes
        : JSON.parse(replacement.zip_codes || '[]');
    editFormData.cities = Array.isArray(replacement.cities)
        ? replacement.cities
        : JSON.parse(replacement.cities || '[]');
    editFormData.careTypes = replacement.care_types?.map(ct => ct.id) || [];

    const timeSlot = replacement.timeSlot
        ? typeof replacement.timeSlot === 'string'
            ? JSON.parse(replacement.timeSlot)
            : replacement.timeSlot
        : {};
    editFormData.timeSlot.startAt = formatTimeToInput(timeSlot.start_at || '');
    editFormData.timeSlot.endAt = formatTimeToInput(timeSlot.end_at || '');

    editFormData.comment = replacement.comment || '';
    editDialogOpen.value = true;
};

const handleCareTypeClick = (formData, careTypeId) => {
    const index = formData.careTypes.indexOf(careTypeId);
    if (index === -1) {
        formData.careTypes.push(careTypeId);
    }
    else {
        formData.careTypes.splice(index, 1);
    }
    formData.careTypes = [...formData.careTypes];
};

const getSelectedCareTypesText = (selectedIds) => {
    return careTypes.value
        .filter(ct => selectedIds.includes(ct.id))
        .map(ct => ct.name)
        .join(', ');
};

const submitEdit = async () => {
    editInProgress.value = true;
    setTimeout(() => {
        editInProgress.value = false;
        editDialogOpen.value = false;
        $toast({
            description: 'Remplacement mis à jour',
        });
    }, 1000);
};

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});
</script>

<style>
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
