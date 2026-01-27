<template>
    <div class="lg:ml-20 xl:ml-0">
        <ArrowLeftIcon
            class="size-6 cursor-pointer hover:text-primary"
            title="Retour"
            @click="goBack"
        />

        <div class="mt-6 flex items-center justify-between w-full">
            <h1 class="flex w-full py-3 rounded-lg text-primary sm:bg-gray-100 sm:px-9">
                <span class="ml-1 font-semibold">Missions</span>
            </h1>
        </div>

        <Tabs
            v-model="activeTab"
            class="mt-8"
            @update:model-value="handleTabChange"
        >
            <TabsList class="grid w-full grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                    value="offers"
                    class="flex flex-col items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                >
                    <div class="flex items-center gap-2">
                        <MegaphoneIcon class="w-5 h-5 text-primary" />
                        <span class="font-medium">Offres</span>
                        <Badge
                            v-if="offersCount > 0"
                            class="ml-1 bg-primary text-white text-xs"
                        >
                            {{ offersCount }}
                        </Badge>
                    </div>
                    <span class="text-xs text-gray-500">Nouvelles missions disponibles</span>
                </TabsTrigger>

                <TabsTrigger
                    value="my-missions"
                    class="flex flex-col items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                >
                    <div class="flex items-center gap-2">
                        <BriefcaseIcon class="w-5 h-5 text-success" />
                        <span class="font-medium">Mes missions</span>
                        <Badge
                            v-if="myMissionsCount > 0"
                            class="ml-1 bg-success text-white text-xs"
                        >
                            {{ myMissionsCount }}
                        </Badge>
                    </div>
                    <span class="text-xs text-gray-500">Missions acceptées</span>
                </TabsTrigger>

                <TabsTrigger
                    value="candidacy"
                    class="flex flex-col items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
                >
                    <div class="flex items-center gap-2">
                        <UserCircleIcon class="w-5 h-5 text-orange-500" />
                        <span class="font-medium">Candidatures</span>
                        <Badge
                            v-if="candidacyCount > 0"
                            class="ml-1 bg-orange-500 text-white text-xs"
                        >
                            {{ candidacyCount }}
                        </Badge>
                    </div>
                    <span class="text-xs text-gray-500">Mes candidatures</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent
                value="offers"
                class="mt-6"
            >
                <div
                    v-if="isLoadingOffers"
                    class="flex items-center justify-center py-20"
                >
                    <div class="flex flex-col items-center gap-4">
                        <ArrowPathIcon class="w-12 h-12 animate-spin text-primary" />
                        <p class="text-gray-500">
                            Chargement des offres...
                        </p>
                    </div>
                </div>

                <template v-else>
                    <form
                        class="grid items-center w-full grid-cols-1 gap-6 md:grid-cols-6"
                        @submit.prevent="searchMission"
                    >
                        <div
                            class="flex items-center justify-between w-full col-span-2 2xl:col-span-1 space-x-3 rounded-full bg-primary ps-3 pe-1"
                        >
                            <h5 class="text-xs text-white">
                                <span>Institution</span>
                            </h5>
                            <InputIcon
                                v-model="option.institutionName"
                                class="my-1"
                                :input-class="true"
                                placeholder="INAMI"
                            />
                        </div>
                        <div
                            class="flex items-center justify-between w-full col-span-2 2xl:col-span-1 space-x-3 rounded-full bg-primary ps-3 pe-1"
                        >
                            <h5 class="text-xs text-white">
                                <span>Date</span>
                            </h5>
                            <InputIcon
                                v-model="option.date"
                                class="my-1"
                                :input-class="true"
                                type="date"
                            />
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

                    <div
                        v-if="isSearching"
                        class="flex items-center gap-2 justify-center mt-10"
                    >
                        <ArrowPathIcon class="w-6 h-6 animate-spin text-primary" />
                        <span>Recherche en cours...</span>
                    </div>
                    <div
                        v-else-if="dataMissions.length !== 0"
                        class="mt-8 grid md:grid-cols-2 2xl:grid-cols-3 gap-6"
                    >
                        <div
                            v-for="mission in dataMissions"
                            :key="mission.id"
                            class="group relative rounded-lg border-2 border-gray-100 bg-white p-6 shadow transition hover:shadow-lg hover:border-primary/30"
                        >
                            <div class="flex items-start justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="shrink-0">
                                        <img
                                            v-if="mission.institution?.profil_url"
                                            :src="mission.institution?.profil_url"
                                            alt="Institution Logo"
                                            class="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                                        >
                                        <div
                                            v-else
                                            class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                                        >
                                            {{ mission.institution.institution_name.charAt(0).toUpperCase() }}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 class="text-sm font-semibold text-gray-900">
                                            {{ mission.institution.institution_name }} {{ mission.service != 'null' ? `- ${mission.service.name}` : '' }}
                                        </h2>
                                        <p class="text-xs text-gray-500">
                                            Publié {{ formatRelativeDate(mission.created_at) }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5">
                                <p
                                    class="text-sm leading-relaxed text-gray-700 text-wrap"
                                    :class="!isExpanded[mission.id] ? 'line-clamp-3': ''"
                                >
                                    {{ mission.description }}
                                </p>
                                <button
                                    class="mt-2 text-sm text-primary font-semibold hover:underline focus:outline-none"
                                    @click="toggleExpand(mission.id)"
                                >
                                    {{ isExpanded[mission.id] ? 'Voir moins' : 'Voir plus' }}
                                </button>
                            </div>

                            <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                <CalendarIcon class="h-4 w-4 text-gray-400" />
                                <span>
                                    {{ formatToDMY(mission.start_date) }}
                                    <span class="mx-1 text-gray-300">→</span>
                                    {{ formatToDMY(mission.end_date) }}
                                </span>
                            </div>
                            <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                <ClockIcon class="h-4 w-4 text-gray-400" />
                                <span>
                                    {{ formatTime(mission.time_start_at) }}
                                    <span class="mx-1 text-gray-300">→</span>
                                    {{ formatTime(mission.time_end_at) }}
                                </span>
                            </div>
                            <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                <AcademicCapIcon class="h-4 w-4 text-gray-400" />
                                <span>
                                    {{ mission.required_diploma }}
                                </span>
                            </div>

                            <div class="mt-6 flex items-center justify-end gap-3">
                                <Button
                                    class="bg-primary hover:bg-primary/90"
                                    @click="handleApply(mission.id)"
                                >
                                    Postuler
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="mt-10 text-center">
                            <MegaphoneIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p class="text-gray-500 text-lg font-medium">
                                Aucune offre de mission trouvée
                            </p>
                            <p class="text-gray-400 text-sm mt-2">
                                De nouvelles missions apparaîtront ici lorsqu'elles seront publiées
                            </p>
                        </div>
                    </div>

                    <div class="mt-4">
                        <CustomPagination
                            v-if="missions.data.length > 0"
                            :default-page="page"
                            :per-page="perPage"
                            :total="missions.meta.total"
                            @update:page="changePage"
                            @update:per-page="handlePerPageChange"
                        />
                    </div>
                </template>
            </TabsContent>

            <TabsContent
                value="my-missions"
                class="mt-6"
            >
                <div
                    v-if="isLoadingMyMissions"
                    class="flex items-center justify-center py-20"
                >
                    <div class="flex flex-col items-center gap-4">
                        <ArrowPathIcon class="w-12 h-12 animate-spin text-success" />
                        <p class="text-gray-500">
                            Chargement de vos missions...
                        </p>
                    </div>
                </div>

                <template v-else>
                    <form
                        class="grid items-center w-full grid-cols-1 gap-6 md:grid-cols-6"
                        @submit.prevent="searchMyMissions"
                    >
                        <div
                            class="flex items-center justify-between w-full col-span-2 2xl:col-span-1 space-x-3 rounded-full bg-success ps-3 pe-1"
                        >
                            <h5 class="text-xs text-white">
                                <span>Institution</span>
                            </h5>
                            <InputIcon
                                v-model="myMissionsOption.institutionName"
                                class="my-1"
                                :input-class="true"
                                placeholder="INAMI"
                            />
                        </div>
                        <div
                            class="flex items-center justify-between w-full col-span-2 2xl:col-span-1 space-x-3 rounded-full bg-success ps-3 pe-1"
                        >
                            <h5 class="text-xs text-white">
                                <span>Date</span>
                            </h5>
                            <InputIcon
                                v-model="myMissionsOption.date"
                                class="my-1"
                                :input-class="true"
                                type="date"
                            />
                        </div>

                        <div class="flex items-center justify-between w-full col-span-2 gap-6 md:justify-start">
                            <Button
                                class="flex items-center justify-center px-4 text-sm bg-success h-11"
                                @click="reinitializeMyMissionsFilter"
                            >
                                <ArrowPathIcon class="w-6" />
                                <span class="block ml-2 text-sm md:hidden">Réinitialiser</span>
                            </Button>
                            <Button
                                type="submit"
                                class="flex items-center justify-center px-4 text-sm bg-success h-11"
                            >
                                <MagnifyingGlassIcon class="w-6" />
                                <span class="ml-2 text-sm">Rechercher</span>
                            </Button>
                        </div>
                    </form>

                    <Tabs
                        v-model="myMissionsStatusTab"
                        class="my-6"
                    >
                        <TabsList class="w-full bg-gray-100">
                            <TabsTrigger
                                value="in_progress"
                                class="flex-1"
                            >
                                En cours
                            </TabsTrigger>
                            <TabsTrigger
                                value="completed"
                                class="flex-1"
                            >
                                Terminé
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="in_progress">
                            <div
                                v-if="isSearchingMyMissions"
                                class="flex items-center gap-2 justify-center mt-10"
                            >
                                <ArrowPathIcon class="w-6 h-6 animate-spin text-success" />
                                <span>Recherche en cours...</span>
                            </div>
                            <div
                                v-else-if="dataMyMissions.in_progress.length !== 0"
                                class="mt-8 grid md:grid-cols-2 2xl:grid-cols-3 gap-6"
                            >
                                <div
                                    v-for="mission in dataMyMissions.in_progress"
                                    :key="mission.id"
                                    class="group relative rounded-lg border-2 border-success/30 bg-white p-6 shadow transition hover:shadow-lg hover:border-success/50"
                                >
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-center gap-4">
                                            <div class="shrink-0">
                                                <img
                                                    v-if="mission.institution?.profil_url"
                                                    :src="mission.institution?.profil_url"
                                                    alt="Institution Logo"
                                                    class="h-12 w-12 rounded-full object-cover ring-2 ring-success/20"
                                                >
                                                <div
                                                    v-else
                                                    class="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-sm font-semibold text-success"
                                                >
                                                    {{ mission.institution.institution_name.charAt(0).toUpperCase() }}
                                                </div>
                                            </div>

                                            <div>
                                                <h2 class="text-sm font-semibold text-gray-900">
                                                    {{ mission.institution.institution_name }}
                                                </h2>
                                                <p class="text-xs text-gray-500">
                                                    Publié {{ formatRelativeDate(mission.created_at) }}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge class="bg-success text-white">
                                            En cours
                                        </Badge>
                                    </div>

                                    <div class="mt-5">
                                        <p
                                            class="text-sm leading-relaxed text-gray-700"
                                            :class="!isExpanded[mission.id] ? 'line-clamp-3': ''"
                                        >
                                            {{ mission.description }}
                                        </p>
                                        <button
                                            class="mt-2 text-sm text-success font-semibold hover:underline focus:outline-none"
                                            @click="toggleExpand(mission.id)"
                                        >
                                            {{ isExpanded[mission.id] ? 'Voir moins' : 'Voir plus' }}
                                        </button>
                                    </div>

                                    <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <CalendarIcon class="h-4 w-4 text-gray-400" />
                                        <span>
                                            {{ formatToDMY(mission.start_date) }}
                                            <span class="mx-1 text-gray-300">→</span>
                                            {{ formatToDMY(mission.end_date) }}
                                        </span>
                                    </div>
                                    <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                        <ClockIcon class="h-4 w-4 text-gray-400" />
                                        <span>
                                            {{ formatTime(mission.time_start_at) }}
                                            <span class="mx-1 text-gray-300">→</span>
                                            {{ formatTime(mission.time_end_at) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div class="mt-10 text-center">
                                    <BriefcaseIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <p class="text-gray-500 text-lg font-medium">
                                        Aucune mission en cours
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="completed">
                            <div
                                v-if="isSearchingMyMissions"
                                class="flex items-center gap-2 justify-center mt-10"
                            >
                                <ArrowPathIcon class="w-6 h-6 animate-spin text-success" />
                                <span>Recherche en cours...</span>
                            </div>
                            <div
                                v-else-if="dataMyMissions.completed.length !== 0"
                                class="mt-8 grid md:grid-cols-2 2xl:grid-cols-3 gap-6"
                            >
                                <div
                                    v-for="mission in dataMyMissions.completed"
                                    :key="mission.id"
                                    class="group relative rounded-lg border-2 border-gray-200 bg-white p-6 shadow transition hover:shadow-lg opacity-75"
                                >
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-center gap-4">
                                            <div class="shrink-0">
                                                <img
                                                    v-if="mission.institution?.profil_url"
                                                    :src="mission.institution?.profil_url"
                                                    alt="Institution Logo"
                                                    class="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
                                                >
                                                <div
                                                    v-else
                                                    class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600"
                                                >
                                                    {{ mission.institution.institution_name.charAt(0).toUpperCase() }}
                                                </div>
                                            </div>

                                            <div>
                                                <h2 class="text-sm font-semibold text-gray-900">
                                                    {{ mission.institution.institution_name }}
                                                </h2>
                                                <p class="text-xs text-gray-500">
                                                    Terminé {{ formatRelativeDate(mission.updated_at) }}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge class="bg-gray-400 text-white">
                                            Terminé
                                        </Badge>
                                    </div>

                                    <div class="mt-5">
                                        <p
                                            class="text-sm leading-relaxed text-gray-700"
                                            :class="!isExpanded[mission.id] ? 'line-clamp-3': ''"
                                        >
                                            {{ mission.service }}
                                        </p>
                                    </div>

                                    <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <CalendarIcon class="h-4 w-4 text-gray-400" />
                                        <span>
                                            {{ formatToDMY(mission.start_date, true) }}
                                            <span class="mx-1 text-gray-300">→</span>
                                            {{ formatToDMY(mission.end_date, true) }}
                                        </span>
                                    </div>
                                    <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                        <AcademicCapIcon class="h-4 w-4 text-gray-400" />
                                        <span>
                                            {{ mission.required_diploma }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div class="mt-10 text-center">
                                    <BriefcaseIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                    <p class="text-gray-500 text-lg font-medium">
                                        Aucune mission terminée
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </template>
            </TabsContent>

            <TabsContent
                value="candidacy"
                class="mt-6"
            >
                <div
                    v-if="isLoadingCandidacy"
                    class="flex items-center justify-center py-20"
                >
                    <div class="flex flex-col items-center gap-4">
                        <ArrowPathIcon class="w-12 h-12 animate-spin text-orange-500" />
                        <p class="text-gray-500">
                            Chargement de vos candidatures...
                        </p>
                    </div>
                </div>

                <template v-else>
                    <form
                        class="grid items-center w-full grid-cols-1 gap-6 md:grid-cols-6"
                        @submit.prevent="searchCandidacy"
                    >
                        <div
                            class="flex items-center justify-between w-full col-span-2 2xl:col-span-1 space-x-3 rounded-full bg-orange-500 ps-3 pe-1"
                        >
                            <h5 class="text-xs text-white">
                                <span>Institution</span>
                            </h5>
                            <InputIcon
                                v-model="candidacyOption.institutionName"
                                class="my-1"
                                :input-class="true"
                                placeholder="INAMI"
                            />
                        </div>
                        <div
                            class="flex items-center justify-between w-full col-span-2 2xl:col-span-1 space-x-3 rounded-full bg-orange-500 ps-3 pe-1"
                        >
                            <h5 class="text-xs text-white">
                                <span>Date</span>
                            </h5>
                            <InputIcon
                                v-model="candidacyOption.responseDate"
                                class="my-1"
                                :input-class="true"
                                type="date"
                            />
                        </div>

                        <div class="flex items-center justify-between w-full col-span-2 gap-6 md:justify-start">
                            <Button
                                class="flex items-center justify-center px-4 text-sm bg-orange-500 h-11"
                                @click="reinitializeCandidacyFilter"
                            >
                                <ArrowPathIcon class="w-6" />
                                <span class="block ml-2 text-sm md:hidden">Réinitialiser</span>
                            </Button>
                            <Button
                                type="submit"
                                class="flex items-center justify-center px-4 text-sm bg-orange-500 h-11"
                            >
                                <MagnifyingGlassIcon class="w-6" />
                                <span class="ml-2 text-sm">Rechercher</span>
                            </Button>
                        </div>
                    </form>

                    <div
                        v-if="isSearchingCandidacy"
                        class="flex items-center gap-2 justify-center mt-10"
                    >
                        <ArrowPathIcon class="w-6 h-6 animate-spin text-orange-500" />
                        <span>Recherche en cours...</span>
                    </div>
                    <div
                        v-else-if="dataResponses.length !== 0"
                        class="mt-12"
                    >
                        <div
                            v-for="(missionResponses, date) in dataResponses"
                            :key="date"
                            class="grid grid-cols-6 gap-8 mb-8"
                        >
                            <div class="col-span-1 flex gap-8 relative">
                                <h3 class="text-sm text-gray-600 font-semibold">
                                    {{ formatToDMY(date) }}
                                </h3>
                                <div class="border-r border-orange-300 gap-8" />
                                <div class="absolute top-0 right-7 w-6 h-6 rounded-full bg-orange-500/60" />
                            </div>

                            <div class="col-span-5 grid grid-cols-2 gap-4">
                                <div
                                    v-for="response in missionResponses"
                                    :key="response.id"
                                    class="group relative rounded-lg border-2 border-orange-100 bg-white p-6 shadow transition hover:shadow-lg hover:border-orange-300"
                                >
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-center gap-4">
                                            <div class="shrink-0">
                                                <img
                                                    v-if="response.mission.institution?.profil_url"
                                                    :src="response.mission.institution?.profil_url"
                                                    alt="Institution Logo"
                                                    class="h-12 w-12 rounded-full object-cover ring-2 ring-orange-200"
                                                >
                                                <div
                                                    v-else
                                                    class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600"
                                                >
                                                    {{ response.mission.institution.institution_name.charAt(0).toUpperCase() }}
                                                </div>
                                            </div>

                                            <div>
                                                <h2 class="text-sm font-semibold text-gray-900">
                                                    {{ response.mission.institution.institution_name }}
                                                </h2>
                                                <p class="text-xs text-gray-500">
                                                    Publié {{ formatRelativeDate(response.mission.created_at) }}
                                                </p>
                                            </div>
                                        </div>

                                        <Badge :class="['text-xs min-w-24', statusClasses[response.status] ?? 'bg-gray-200 text-gray-700']">
                                            {{ statusResponse[response?.status] }}
                                        </Badge>
                                    </div>

                                    <div class="mt-5">
                                        <p
                                            class="text-sm leading-relaxed text-gray-700"
                                            :class="!isExpanded[response.id] ? 'line-clamp-3': ''"
                                        >
                                            {{ response.mission.description }}
                                        </p>
                                        <button
                                            class="mt-2 text-sm text-orange-500 font-semibold hover:underline focus:outline-none"
                                            @click="toggleExpand(response.id)"
                                        >
                                            {{ isExpanded[response.id] ? 'Voir moins' : 'Voir plus' }}
                                        </button>
                                    </div>

                                    <div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                        <CalendarIcon class="h-4 w-4 text-gray-400" />
                                        <span>
                                            {{ formatToDMY(response.mission.start_date) }}
                                            <span class="mx-1 text-gray-300">→</span>
                                            {{ formatToDMY(response.mission.end_date) }}
                                        </span>
                                    </div>
                                    <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                        <AcademicCapIcon class="h-4 w-4 text-gray-400" />
                                        <span>
                                            {{ response.mission.required_diploma }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="mt-10 text-center">
                            <UserCircleIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p class="text-gray-500 text-lg font-medium">
                                Aucune candidature trouvée
                            </p>
                            <p class="text-gray-400 text-sm mt-2">
                                Vos candidatures apparaîtront ici une fois que vous aurez postulé
                            </p>
                        </div>
                    </div>

                    <div class="mt-4">
                        <CustomPagination
                            v-if="responses.data.length > 0"
                            :default-page="candidacyPage"
                            :per-page="candidacyPerPage"
                            :total="responses.meta.total"
                            @update:page="changeCandidacyPage"
                            @update:per-page="handleCandidacyPerPageChange"
                        />
                    </div>
                </template>
            </TabsContent>
        </Tabs>
    </div>
</template>

<script lang="ts" setup>
import { AcademicCapIcon, ArrowLeftIcon, ArrowPathIcon, BriefcaseIcon, CalendarIcon, ClockIcon, MagnifyingGlassIcon, MegaphoneIcon, UserCircleIcon } from '@heroicons/vue/24/outline';
import { formatRelativeDate, formatTime, formatToDMY } from '~/composables/useDate';
import { PERPAGE } from '~/lib/constants';
import { debounce, goBack } from '~/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

useHead({
    title: 'Missions',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
    ssr: false,
});

const statusResponse = {
    pending: 'En attente',
    accepted: 'Accepté',
    rejected: 'Rejeté',
};

const statusClasses: Record<string, string> = {
    pending: 'bg-orange-200 text-orange-700',
    accepted: 'bg-success text-white',
    rejected: 'bg-red-500 text-white',
};

const activeTab = ref('offers');
const myMissionsStatusTab = ref('in_progress');
const isSearching = ref(false);
const isSearchingMyMissions = ref(false);
const isSearchingCandidacy = ref(false);
const isExpanded = ref<Record<number, boolean>>({});
const isLoadingOffers = ref(true);
const isLoadingMyMissions = ref(true);
const isLoadingCandidacy = ref(true);

const { getAll, missions } = useMissions();
const myMissionsState = useState('myMissions', () => ({ data: [], meta: {} }));
const { getAll: getCandidacy, responses } = useMissionResponses();

const perPage = ref(PERPAGE);
const page = ref(1);
const myMissionsPerPage = ref(PERPAGE);
const myMissionsPage = ref(1);
const candidacyPerPage = ref(PERPAGE);
const candidacyPage = ref(1);

const initialFilter = {
    institutionName: '',
    date: '',
    type: 'nurse',
};

const myMissionsInitialFilter = {
    institutionName: '',
    date: '',
    type: 'me',
};

const candidacyInitialFilter = {
    institutionName: '',
    responseDate: '',
    type: 'nurse',
};

const option = ref({ ...initialFilter });
const myMissionsOption = ref({ ...myMissionsInitialFilter });
const candidacyOption = ref({ ...candidacyInitialFilter });

const dataMissions = computed(() => missions.value.data ?? []);

const dataMyMissions = computed(() => {
    if (!myMissionsState.value?.data) {
        return {
            in_progress: [],
            completed: [],
        };
    }
    return (myMissionsState.value.data ?? []).reduce<Record<string, any[]>>(
        (acc, mission) => {
            const status = mission.status || 'in_progress';
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(mission);
            return acc;
        },
        {
            in_progress: [],
            completed: [],
        },
    );
});

const offersCount = computed(() => missions.value.meta?.total || 0);
const myMissionsCount = computed(() => {
    const inProgress = dataMyMissions.value.in_progress?.length || 0;
    const completed = dataMyMissions.value.completed?.length || 0;
    return inProgress + completed;
});
const candidacyCount = computed(() => responses.value.meta?.total || 0);

async function loadOffers() {
    isLoadingOffers.value = true;
    try {
        await getAll(page.value, perPage.value, option.value);
    }
    catch (error) {
        console.error('Error loading offers:', error);
    }
    finally {
        isLoadingOffers.value = false;
    }
}

async function loadMyMissions() {
    isLoadingMyMissions.value = true;
    try {
        const { $apifetch } = useNuxtApp();
        const response = await $apifetch('api/institution/missions/', {
            params: {
                page: myMissionsPage.value,
                perPage: myMissionsPerPage.value,
                ...myMissionsOption.value,
            },
        });
        myMissionsState.value = response;
    }
    catch (error) {
        console.error('Error loading my missions:', error);
    }
    finally {
        isLoadingMyMissions.value = false;
    }
}

async function loadCandidacy() {
    isLoadingCandidacy.value = true;
    try {
        await getCandidacy(candidacyPage.value, candidacyPerPage.value, {
            date: candidacyOption.value.responseDate,
            institutionName: candidacyOption.value.institutionName,
            type: 'nurse',
        });
    }
    catch (error) {
        console.error('Error loading candidacy:', error);
    }
    finally {
        isLoadingCandidacy.value = false;
    }
}

onMounted(async () => {
    await Promise.all([
        loadOffers(),
        loadMyMissions(),
        loadCandidacy(),
    ]);
});

const dataResponses = computed<Record<string, any[]>>(() => {
    if (!responses.value?.data) {
        return {};
    }
    return (responses.value.data ?? []).reduce((acc, response) => {
        const date = response.responded_at
            ? response.responded_at.slice(0, 10)
            : 'unknown';

        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(response);
        return acc;
    }, {} as Record<string, any[]>);
});

const filterMissions = async () => {
    const currentFilter = { ...option.value };
    await getAll(
        page.value,
        perPage.value,
        {
            date: currentFilter.date,
            institutionName: currentFilter.institutionName,
            type: 'nurse',
        });
};

const filterMyMissions = async () => {
    const currentFilter = { ...myMissionsOption.value };
    await loadMyMissions();
};

const filterCandidacy = async () => {
    const currentFilter = { ...candidacyOption.value };
    await getCandidacy(
        candidacyPage.value,
        candidacyPerPage.value,
        {
            date: currentFilter.responseDate,
            institutionName: currentFilter.institutionName,
            type: 'nurse',
        });
};

const changePage = async (pge: number) => {
    page.value = pge;
    await filterMissions();
};

const handlePerPageChange = async (value: number) => {
    perPage.value = value;
    await filterMissions();
};

const changeCandidacyPage = async (pge: number) => {
    candidacyPage.value = pge;
    await filterCandidacy();
};

const handleCandidacyPerPageChange = async (value: number) => {
    candidacyPerPage.value = value;
    await filterCandidacy();
};

const searchMission = debounce(async () => {
    isSearching.value = true;
    page.value = 1;
    await filterMissions();
    isSearching.value = false;
}, 100);

const expandedMissions = ref<Record<number, boolean>>({});

const searchMyMissions = debounce(async () => {
    isSearchingMyMissions.value = true;
    myMissionsPage.value = 1;
    await filterMyMissions();
    isSearchingMyMissions.value = false;
}, 100);

const searchCandidacy = debounce(async () => {
    isSearchingCandidacy.value = true;
    candidacyPage.value = 1;
    await filterCandidacy();
    isSearchingCandidacy.value = false;
}, 100);

const toggleExpand = (id: number) => {
    isExpanded.value[id] = !isExpanded.value[id];
};

const reinitializeFilter = async () => {
    option.value.date = '';
    option.value.institutionName = '';
    page.value = 1;
    await filterMissions();
};

const reinitializeMyMissionsFilter = async () => {
    myMissionsOption.value.date = '';
    myMissionsOption.value.institutionName = '';
    myMissionsPage.value = 1;
    await filterMyMissions();
};

const reinitializeCandidacyFilter = async () => {
    candidacyOption.value.responseDate = '';
    candidacyOption.value.institutionName = '';
    candidacyPage.value = 1;
    await filterCandidacy();
};

const handleTabChange = async (newTab: string) => {
    activeTab.value = newTab;
    if (newTab === 'offers' && !missions.value.data.length) {
        await loadOffers();
    }
    else if (newTab === 'my-missions' && !myMissionsState.value.data.length) {
        await loadMyMissions();
    }
    else if (newTab === 'candidacy' && !responses.value.data.length) {
        await loadCandidacy();
    }
};

const handleApply = (missionId: number) => {
    const router = useRouter();
    router.push(`/dashboard/missions/${missionId}/apply`);
};

watch(
    () => [option.value.institutionName, option.value.date],
    async ([newInstitution, newDate], [oldInstitution, oldDate]) => {
        const wasFiltered
            = (oldInstitution && !newInstitution)
                || (oldDate && !newDate);

        if (wasFiltered) {
            page.value = 1;
            await filterMissions();
        }
    },
);
</script>
