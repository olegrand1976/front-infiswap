<template>
    <div class="lg:ml-20 xl:ml-0">
        <ArrowLeftIcon
            class="size-6 cursor-pointer hover:text-primary"
            title="Retour"
            @click="goBack"
        />

        <div class="mt-6 flex items-center justify-between w-full">
            <h1 class="flex w-full py-3 rounded-lg text-primary sm:bg-gray-100 sm:px-9">
                Rechercher <span class="ml-1 font-semibold">un binôme</span>
            </h1>
        </div>

        <form
            class="grid items-center w-full grid-cols-1 gap-6 mt-8 md:grid-cols-6"
            @submit.prevent="search"
        >
            <div
                class="flex items-center justify-between w-full col-span-2 space-x-3 rounded-full bg-primary ps-3 pe-1"
                title="Saisissez le code postal puis appuyer sur Entrée pour l'ajouter"
            >
                <h5 class="text-xs text-white">
                    <span class="hidden sm:block lg:hidden xl:block">Codes postaux</span>
                    <span class="sm:hidden lg:block xl:hidden">CP</span>
                </h5>
                <TagsInput
                    v-model="searchFormData.postalCodeTags"
                    class="flex items-center h-9 text-xs my-0.5 rounded-full border border-none"
                >
                    <div
                        :class="[Array.isArray(searchFormData.postalCodeTags) && searchFormData.postalCodeTags.length ? 'w-1/2' : 'hidden']"
                        class="flex items-center space-x-1 overflow-x-auto whitespace-nowrap no-scrollbar"
                    >
                        <TagsInputItem
                            v-for="item in searchFormData.postalCodeTags"
                            :key="item"
                            :value="item"
                            class="flex-shrink-0"
                        >
                            <TagsInputItemText class="text-xs" />
                            <TagsInputItemDelete @click="() => removeTag(searchFormData.postalCodeTags, item)" />
                        </TagsInputItem>
                    </div>
                    <TagsInputInput
                        v-model="postalCodeInput"
                        :class="[Array.isArray(searchFormData.postalCodeTags) && searchFormData.postalCodeTags.length ? 'w-1/2' : 'w-full']"
                        class="flex items-center text-xs"
                        placeholder="8793"
                        @blur="handleBlur"
                        @keydown.enter="() => addTag(postalCodeInput, searchFormData.postalCodeTags)"
                    />
                </TagsInput>
            </div>

            <div
                class="flex items-center justify-between w-full col-span-2 space-x-3 rounded-full bg-primary ps-3 pe-1"
                title="Saisissez la ville puis appuyer sur Entrée pour l'ajouter"
            >
                <h5 class="text-xs text-white">
                    <span>Ville(s)</span>
                </h5>
                <TagsInput
                    v-model="searchFormData.cityTags"
                    class="flex items-center h-9 text-xs my-0.5 rounded-full border border-none"
                >
                    <div
                        :class="[Array.isArray(searchFormData.cityTags) && searchFormData.cityTags.length ? 'w-1/2' : 'hidden']"
                        class="flex items-center space-x-1 overflow-x-auto max-w-52 md:max-w-40 whitespace-nowrap no-scrollbar"
                    >
                        <TagsInputItem
                            v-for="item in searchFormData.cityTags"
                            :key="item"
                            :value="item"
                            class="flex-shrink-0"
                        >
                            <TagsInputItemText class="text-xs" />
                            <TagsInputItemDelete @click="() => removeTag(searchFormData.cityTags, item)" />
                        </TagsInputItem>
                    </div>
                    <TagsInputInput
                        v-model="cityInput"
                        :class="[Array.isArray(searchFormData.cityTags) && searchFormData.cityTags.length ? 'w-1/2' : 'w-full']"
                        class="flex items-center text-xs"
                        placeholder="City38"
                        @blur="handleBlur"
                        @keydown.enter="() => addTag(cityInput, searchFormData.cityTags)"
                    />
                </TagsInput>
            </div>

            <div class="flex items-center justify-between w-full col-span-2 gap-6 md:justify-start">
                <Button
                    class="flex items-center justify-center px-4 text-sm bg-primary h-11"
                    @click="reinitializeFilter"
                >
                    <ArrowPathIcon class="w-6" />
                    <span class="block ml-2 text-sm md:hidden">Réinitialiser</span>
                </Button>
                <Button
                    type="submit"
                    class="flex items-center justify-center px-4 text-sm bg-primary h-11"
                >
                    <MagnifyingGlassIcon class="w-6" />
                    <span class="ml-2 text-sm">Rechercher</span>
                </Button>
            </div>
        </form>

        <Tabs
            v-model="activeTab"
            class="my-6"
            @update:model-value="handleTabChange"
        >
            <TabsList class="w-full">
                <TabsTrigger
                    value="in_search"
                    class="w-full md:w-48"
                >
                    Recherche
                </TabsTrigger>
                <!-- <TabsTrigger
                    value="available"
                    class="w-full md:w-48"
                >
                    Disponible
                </TabsTrigger> -->
                <TabsTrigger
                    value="my_requests"
                    class="w-full md:w-48"
                >
                    Mes demandes
                </TabsTrigger>
            </TabsList>

            <TabsContent value="in_search">
                <div class="grid my-8">
                    <Table>
                        <TableHeader class="w-full">
                            <TableRow class="grid grid-cols-3 gap-2 overflow-x-hidden border-none rounded-t-lg md:grid-cols-4">
                                <TableHead class="flex items-center justify-center w-full col-span-1 text-xs text-white bg-primary">
                                    Code postal
                                </TableHead>
                                <TableHead class="flex items-center justify-center w-full col-span-1 text-xs text-white bg-primary">
                                    Ville
                                </TableHead>
                                <TableHead class="items-center justify-center hidden w-full col-span-1 text-xs text-white bg-primary md:flex">
                                    Description
                                </TableHead>
                                <TableHead class="flex items-center justify-center w-full col-span-1 text-xs text-white bg-primary">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody class="rounded-b-lg">
                            <div v-if="loading">
                                <TableRow
                                    v-for="(_, index) in Array.from({ length: 10 })"
                                    :key="index"
                                    class="grid h-16 grid-cols-3 gap-2 overflow-x-hidden border border-none md:grid-cols-4"
                                >
                                    <TableCell><Skeleton class="w-full h-10 bg-gray-100" /></TableCell>
                                    <TableCell><Skeleton class="w-full h-10 bg-gray-100" /></TableCell>
                                    <TableCell><Skeleton class="hidden w-full h-10 bg-gray-100 md:block" /></TableCell>
                                    <TableCell><Skeleton class="w-full h-10 bg-gray-100" /></TableCell>
                                </TableRow>
                            </div>
                            <div v-else-if="demandPartners.data.length !== 0">
                                <TableRow
                                    v-for="partnership in demandPartners.data"
                                    :key="partnership.id"
                                    class="relative grid grid-cols-3 gap-2 overflow-x-hidden border border-none md:grid-cols-4"
                                >
                                    <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <span
                                                :class="[cn({ 'text-success font-bold': isSubmitted && searchFormData.postalCodeTags.includes(partnership.user.zip_code) })]"
                                            >
                                                {{ partnership.user.zip_code }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <span
                                                :class="[cn({ 'text-success font-bold': isSubmitted && searchFormData.cityTags.includes(partnership.user.city) })]"
                                            >
                                                {{ partnership.user.city }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="hidden md:flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <span>
                                                {{ partnership.description }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <EllipsisHorizontalIcon class="w-6 cursor-pointer" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent class="w-48">
                                                    <DropdownMenuItem
                                                        class="flex items-center space-x-2 text-sm cursor-pointer"
                                                        @click="handleShowDetail(partnership)"
                                                    >
                                                        <EyeIcon class="w-4 h-4" />
                                                        <span>Détail</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </div>
                            <div v-else>
                                <p class="py-8 text-center text-gray-500">
                                    Aucun résultat n'est trouvé
                                </p>
                            </div>
                        </TableBody>
                    </Table>

                    <div class="mt-4">
                        <CustomPagination
                            v-if="demandPartners.data.length > 0"
                            :default-page="page"
                            :per-page="perPage"
                            :total="demandPartners.total"
                            @update:page="changePage"
                            @update:per-page="changePerPage"
                        />
                    </div>
                </div>
            </TabsContent>

            <!-- <TabsContent value="available">
                <div class="grid my-8">
                    <Table>
                        <TableHeader class="w-full">
                            <TableRow class="grid grid-cols-3 gap-2 overflow-x-hidden border-none rounded-t-lg md:grid-cols-4">
                                <TableHead class="flex items-center justify-center w-full col-span-1 text-xs text-white bg-primary">
                                    Code postal
                                </TableHead>
                                <TableHead class="flex items-center justify-center w-full col-span-1 text-xs text-white bg-primary">
                                    Ville
                                </TableHead>
                                <TableHead class="items-center justify-center hidden w-full col-span-1 text-xs text-white bg-primary md:flex">
                                    Description
                                </TableHead>
                                <TableHead class="flex items-center justify-center w-full col-span-1 text-xs text-white bg-primary">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody class="rounded-b-lg">
                            <div v-if="loading">
                                <TableRow
                                    v-for="(_, index) in Array.from({ length: 10 })"
                                    :key="index"
                                    class="grid h-16 grid-cols-3 gap-2 overflow-x-hidden border border-none md:grid-cols-4"
                                >
                                    <TableCell><Skeleton class="w-full h-10 bg-gray-100" /></TableCell>
                                    <TableCell><Skeleton class="w-full h-10 bg-gray-100" /></TableCell>
                                    <TableCell><Skeleton class="hidden w-full h-10 bg-gray-100 md:block" /></TableCell>
                                    <TableCell><Skeleton class="w-full h-10 bg-gray-100" /></TableCell>
                                </TableRow>
                            </div>
                            <div v-else-if="demandPartners.data.length !== 0">
                                <TableRow
                                    v-for="partnership in demandPartners.data"
                                    :key="partnership.id"
                                    class="relative grid grid-cols-3 gap-2 overflow-x-hidden border border-none md:grid-cols-4"
                                >
                                    <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <span
                                                :class="[cn({ 'text-success font-bold': isSubmitted && searchFormData.postalCodeTags.includes(partnership.user.zip_code) })]"
                                            >
                                                {{ partnership.user.zip_code }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <span
                                                :class="[cn({ 'text-success font-bold': isSubmitted && searchFormData.cityTags.includes(partnership.user.city) })]"
                                            >
                                                {{ partnership.user.city }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="hidden md:flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <span>
                                                {{ partnership.description }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <EllipsisHorizontalIcon class="w-6 cursor-pointer" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent class="w-48">
                                                    <DropdownMenuItem
                                                        class="flex items-center space-x-2 text-sm cursor-pointer"
                                                        @click="handleShowDetail(partnership)"
                                                    >
                                                        <EyeIcon class="w-4 h-4" />
                                                        <span>Détail</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </div>
                            <div v-else>
                                <p class="py-8 text-center text-gray-500">
                                    Aucun résultat n'est trouvé
                                </p>
                            </div>
                        </TableBody>
                    </Table>

                    <div class="mt-4">
                        <CustomPagination
                            v-if="demandPartners.data.length > 0"
                            :default-page="page"
                            :per-page="perPage"
                            :total="demandPartners.total"
                            @update:page="changePage"
                            @update:per-page="changePerPage"
                        />
                    </div>
                </div>
            </TabsContent> -->

            <TabsContent value="my_requests">
                <div class="grid my-8">
                    <Table>
                        <TableHeader class="w-full">
                            <TableRow class="grid grid-cols-3 gap-2 overflow-x-hidden border-none rounded-t-lg md:grid-cols-5">
                                <TableHead class="items-center justify-center hidden w-full col-span-1 text-xs text-white bg-primary md:flex">
                                    Code postal
                                </TableHead>
                                <TableHead class="items-center justify-center hidden w-full col-span-1 text-xs text-white bg-primary md:flex">
                                    Ville
                                </TableHead>
                                <TableHead class="flex items-center justify-center w-full col-span-1 text-xs text-white bg-primary">
                                    Type de demande
                                </TableHead>
                                <TableHead class="flex items-center justify-center w-full col-span-1 text-xs text-white bg-primary">
                                    Description
                                </TableHead>
                                <TableHead class="flex items-center justify-center w-full col-span-1 text-xs text-white bg-primary">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody class="rounded-b-lg">
                            <div v-if="loading">
                                <TableRow
                                    v-for="(_, index) in Array.from({ length: 10 })"
                                    :key="index"
                                    class="grid h-16 grid-cols-3 gap-2 overflow-x-hidden border border-none md:grid-cols-5"
                                >
                                    <TableCell><Skeleton class="w-full h-10 bg-gray-100" /></TableCell>
                                    <TableCell><Skeleton class="w-full h-10 bg-gray-100" /></TableCell>
                                    <TableCell><Skeleton class="hidden w-full h-10 bg-gray-100 md:block" /></TableCell>
                                    <TableCell><Skeleton class="hidden w-full h-10 bg-gray-100 md:block" /></TableCell>
                                    <TableCell><Skeleton class="w-full h-10 bg-gray-100" /></TableCell>
                                </TableRow>
                            </div>
                            <div v-else-if="demandPartners.data.length !== 0">
                                <TableRow
                                    v-for="partnership in demandPartners.data"
                                    :key="partnership.id"
                                    class="relative grid grid-cols-3 gap-2 overflow-x-hidden border border-none md:grid-cols-5"
                                >
                                    <TableCell class="hidden md:flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <span>
                                                {{ partnership.user.zip_code }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="hidden md:flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <span>
                                                {{ partnership.user.city }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <span>
                                                {{ partnership.type === 'in_search' ? 'À la recherche' : 'Disponible' }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-start items-center w-full">
                                            <span class="w-full truncate">
                                                {{ partnership.description }}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell class="flex justify-center items-center bg-[#F1F2F7] text-xs">
                                        <div class="h-10 rounded bg-[#E4E7F4] px-3 flex justify-center items-center gap-3 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <EllipsisHorizontalIcon class="w-6 cursor-pointer" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent class="w-48">
                                                    <DropdownMenuItem
                                                        class="flex items-center space-x-2 text-sm cursor-pointer"
                                                        @click="handleShowDetail(partnership)"
                                                    >
                                                        <EyeIcon class="w-4 h-4" />
                                                        <span>Détail</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        @click="closePartenershipDialog = true;
                                                                selectedPartnership = partnership"
                                                    >
                                                        <XMarkIcon class="w-4 h-4" />
                                                        <span>Fermer</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </div>
                            <div v-else>
                                <p class="py-8 text-center text-gray-500">
                                    Aucun résultat n'est trouvé
                                </p>
                            </div>
                        </TableBody>
                    </Table>

                    <div class="mt-4">
                        <CustomPagination
                            v-if="demandPartners.data.length > 0"
                            :default-page="page"
                            :per-page="perPage"
                            :total="demandPartners.total"
                            @update:page="changePage"
                            @update:per-page="changePerPage"
                        />
                    </div>
                </div>
            </TabsContent>

            <Dialog v-model:open="closePartenershipDialog">
                <DialogContent class="overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Fermer la demande</DialogTitle>
                        <DialogDescription class="mt-3 mb-6">
                            Etes-vous sur de vouloir fermer cette demande ?
                        </DialogDescription>
                    </DialogHeader>
                    <div class="flex items-center justify-center mt-4 space-x-6 sm:mt-8 sm:justify-end">
                        <Button
                            variant="secondary"
                            class="px-8 bg-gray-200 hover:bg-gray-300"
                            @click="closePartenershipDialog= false"
                        >
                            Non
                        </Button>
                        <Button
                            variant="default"
                            class="px-8"
                            @click="handleClosePartenership(selectedPartnership)"
                        >
                            Oui
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog v-model:open="detailDialog">
                <DialogContent class="sm:max-w-lg h-[50vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Détail</DialogTitle>
                    </DialogHeader>

                    <div
                        v-if="selectedPartnership"
                        class="flex items-center justify-center mx-auto mt-4 w-80"
                    >
                        <UsersCard
                            :user="selectedPartnership.user"
                            :minimal-info="true"
                        />
                    </div>

                    <div class="flex flex-col px-8 mt-4 space-y-2 sm:px-16">
                        <label class="font-semibold text-primary">
                            Type de demande
                        </label>
                        <p v-if="selectedPartnership.type == 'in_search'">
                            À la recherche d'une collaboration
                        </p>
                        <p v-else>
                            Disponible pour une collaboration
                        </p>
                    </div>

                    <div class="flex flex-col px-8 mt-4 space-y-2 sm:px-16">
                        <label class="font-semibold text-primary">
                            Description
                        </label>
                        <p>
                            {{ selectedPartnership.description }}
                        </p>
                    </div>

                    <div v-if="!selectedPartnership.has_responded && selectedPartnership.user.id != user.id">
                        <Button
                            class="flex items-center justify-center mx-auto my-6 w-80"
                            @click="handleMakeResponse"
                        >
                            S'intéresser
                        </Button>
                        <Button
                            variant="secondary"
                            class="flex items-center justify-center mx-auto my-6 w-80"
                            @click="cancelSelection"
                        >
                            Annuler
                        </Button>
                    </div>
                    <div
                        v-else-if="selectedPartnership.has_responded"
                        class="flex items-center justify-center gap-3 p-3 mx-auto my-6 bg-gray-100 rounded-full text-success w-80"
                    >
                        <CheckBadgeIcon class="w-8" />
                        <p class="font-semibold">
                            Réponse envoyée
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog v-model:open="responseDialog">
                <DialogContent
                    class="overflow-y-auto sm:max-w-xl"
                >
                    <form @submit.prevent="submit">
                        <div class="flex flex-col space-y-3">
                            <label class="font-semibold text-primary">
                                * Ajouter une description (optionnel)
                            </label>
                            <Textarea
                                v-model="formData.description"
                                placeholder="Écrivez ici"
                                :rows="6"
                                class="border border-gray-300 focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div class="flex gap-3 mt-8 text-gray-700">
                            <InformationCircleIcon class="w-8" />
                            <p class="text-sm">
                                En vous proposant comme candidat pour cette demande, vous témoignez de votre volonté de collaborer et de former un binôme avec la personne qui a posté cette demande.
                            </p>
                        </div>

                        <div class="my-8">
                            <Button
                                type="submit"
                                class="flex items-center justify-center w-64 mx-auto"
                                :in-progress="inProgress"
                            >
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog v-model:open="preferenceDialog">
                <DialogContent
                    class="overflow-y-auto sm:max-w-xl"
                >
                    <DialogHeader>
                        <DialogTitle>
                            Afficher par préférence
                        </DialogTitle>
                    </DialogHeader>
                    <p class="text-center sm:text-start">
                        Souhaitez-vous afficher la liste de recherche en se basant sur votre préférence ?
                    </p>

                    <DialogFooter class="flex flex-col items-center gap-4 my-6 sm:flex-row sm:space-x-4">
                        <Button
                            variant="secondary"
                            class="w-full sm:w-auto"
                            @click="cancelFilterPreference"
                        >
                            Non
                        </Button>
                        <Button
                            class="w-full sm:w-auto"
                            @click="acceptFilterPreference"
                        >
                            Oui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Tabs>
    </div>
</template>

<script lang="ts" setup>
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    EllipsisHorizontalIcon,
    EyeIcon,
    CheckBadgeIcon,
    InformationCircleIcon,
    XMarkIcon,
    ArrowLeftIcon,
} from '@heroicons/vue/24/outline';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePartners } from '@/composables/usePartners';
import { cn } from '@/lib/utils';
import type { User, UserPartner } from '~/lib/types';
import { PERPAGE } from '~/lib/constants';
import { goBack } from '~/lib/utils';

const selectedPartnership = ref<UserPartner | null>(null);

const perPage = ref(PERPAGE);
const page = ref(1);
const activeTab = ref('in_search');
const user = useState<User>('user');
const setting = JSON.parse(user.value.settings);

const { $toast } = useNuxtApp();

const formData = reactive({
    userPartnerId: null,
    userInterestedId: null,
    status: 'pending',
    description: '',
});

const detailDialog = ref(false);
const responseDialog = ref(false);
const preferenceDialog = ref(true);

const handleShowDetail = (partnership: UserPartner) => {
    selectedPartnership.value = partnership;
    detailDialog.value = true;
};

const handleMakeResponse = () => {
    detailDialog.value = false;
    responseDialog.value = true;
};

const cancelSelection = () => {
    detailDialog.value = false;
    responseDialog.value = null;
};

const { fetchDemandPartners, demandPartners, sendResponse, loading, updatePartnership } = usePartners();

const postalCodeInput = ref('');
const cityInput = ref('');

const searchFormData = reactive({
    postalCodeTags: [],
    cityTags: [],
    type: activeTab.value,
});

const cancelFilterPreference = async () => {
    searchFormData.postalCodeTags = [];
    searchFormData.cityTags = [];
    preferenceDialog.value = false;
    await loadDemandPartners();
};

const acceptFilterPreference = async () => {
    searchFormData.postalCodeTags = setting?.replacement?.zip_codes || [];
    searchFormData.cityTags = setting?.replacement?.cities || [];
    preferenceDialog.value = false;
    await loadDemandPartners();
};

const fetchInitialData = async (pageNum, perPageNum) => {
    await fetchDemandPartners({
        postalCode: searchFormData.postalCodeTags,
        cities: searchFormData.cityTags,
        type: searchFormData.type,
        page: pageNum,
        perPage: perPageNum,
    });
};

const closePartenershipDialog = ref(false);

const handleClosePartenership = async (partnership) => {
    partnership.status = 'closed';
    try {
        const response = await updatePartnership(partnership);
        if (response) {
            $toast({
                description: 'Succès',
            });
            closePartenershipDialog.value = false;
            fetchInitialData(page.value, perPage.value);
        }
    }
    catch (error) {
        console.error(error);
    }
};

const isSubmitted = ref(false);

const loadDemandPartners = async () => {
    await fetchDemandPartners({
        postalCode: searchFormData.postalCodeTags,
        cities: searchFormData.cityTags,
        // type: searchFormData.type,
        page: page.value,
        perPage: perPage.value,
    });
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

const addTag = (inputRef, tagArrayRef, transformFn = val => val) => {
    const value = transformFn(inputRef.value.trim());
    if (value && !tagArrayRef.value.includes(value)) {
        tagArrayRef.value.push(value);
        inputRef.value = '';
    }
    isSubmitted.value = false;
};

const handleTabChange = async (newTab: string) => {
    activeTab.value = newTab;
    searchFormData.type = newTab;
    page.value = 1;
    await fetchDemandPartners({
        postalCode: searchFormData.postalCodeTags,
        cities: searchFormData.cityTags,
        type: searchFormData.type,
        page: page.value,
        perPage: perPage.value,
    });
};

const search = async () => {
    page.value = 1;
    isSubmitted.value = true;
    await loadDemandPartners();
};

const changePage = async (newPage: number) => {
    page.value = newPage;
    await loadDemandPartners();
};

const changePerPage = async (newPerPage: number) => {
    perPage.value = newPerPage;
    page.value = 1;
    await loadDemandPartners();
};

const removeTag = async (tagArrayRef, tagToRemove) => {
    const updatedTags = tagArrayRef.filter(tag => tag !== tagToRemove);

    if (tagArrayRef === searchFormData.postalCodeTags) {
        searchFormData.postalCodeTags = updatedTags;
    }
    else if (tagArrayRef === searchFormData.cityTags) {
        searchFormData.cityTags = updatedTags;
    }

    isSubmitted.value = false;
    await loadDemandPartners();
};

const reinitializeFilter = async () => {
    searchFormData.postalCodeTags = [];
    searchFormData.cityTags = [];
    searchFormData.type = activeTab.value;
    isSubmitted.value = false;
    page.value = 1;
    await loadDemandPartners();
};

let response = null;

const { submit, inProgress } = useSubmit(async () => {
    formData.userPartnerId = selectedPartnership.value.id;
    formData.userInterestedId = selectedPartnership.value.user.id;

    response = await sendResponse(formData);
}, {
    onSuccess: () => {
        $toast({
            description: response.message,
        });
        const partnership = demandPartners.value.data.find(p => p.id === formData.userPartnerId);
        if (partnership) {
            partnership.has_responded = true;
        }
        responseDialog.value = false;
    },
});

useHead({
    title: 'Chercher un partenaire',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
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
