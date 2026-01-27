<template>
    <div class="mb-4 space-y-8">
        <div class="grid lg:grid-cols-3 gap-6">
            <template v-if="isLoading">
                <div class="lg:col-span-2">
                    <Skeleton class="h-48 w-full rounded-2xl" />
                </div>
            </template>
            <div
                v-else
                class="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl shadow-xl p-8 text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
                <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-2xl" />
                <div class="relative z-10 flex flex-col lg:flex-row gap-6 items-center">
                    <div class="flex-shrink-0">
                        <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                            <PlusIcon class="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <div class="flex-1 text-center lg:text-left">
                        <h2 class="text-2xl font-bold mb-2">
                            Besoin d'un infirmier rapidement ?
                        </h2>
                        <p class="text-white/90 mb-6 text-lg">
                            Publiez une mission et recevez des candidatures en quelques minutes.
                        </p>
                        <Button
                            class="bg-white text-primary hover:bg-gray-50 font-semibold px-8 py-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            @click="handleCreateMission"
                        >
                            <PlusIcon class="w-5 h-5 mr-2" />
                            Publier une mission
                        </Button>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-1 grid grid-cols-2 gap-4">
                <template v-if="isLoading">
                    <div
                        v-for="i in 4"
                        :key="i"
                        class="rounded-xl shadow-lg p-6"
                    >
                        <Skeleton class="h-8 w-8 rounded-lg mb-2" />
                        <Skeleton class="h-10 w-20 mb-2" />
                        <Skeleton class="h-4 w-24" />
                    </div>
                </template>
                <template v-else>
                    <div class="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-2">
                                <BriefcaseIcon class="w-8 h-8 text-white/80" />
                                <span class="text-xs font-semibold text-white/80 bg-white/20 px-2 py-1 rounded-full">En cours</span>
                            </div>
                            <p class="text-white text-4xl font-bold mb-1">
                                {{ dataReports?.stats?.mission?.in_progress || 0 }}
                            </p>
                            <p class="text-white/80 text-sm font-medium">
                                Missions actives
                            </p>
                        </div>
                    </div>

                    <div class="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-2">
                                <ClipboardDocumentCheckIcon class="w-8 h-8 text-white/80" />
                                <span class="text-xs font-semibold text-white/80 bg-white/20 px-2 py-1 rounded-full">Ouvertes</span>
                            </div>
                            <p class="text-white text-4xl font-bold mb-1">
                                {{ dataReports?.stats?.mission?.open || 0 }}
                            </p>
                            <p class="text-white/80 text-sm font-medium">
                                À pourvoir
                            </p>
                        </div>
                    </div>

                    <div class="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-amber-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-2">
                                <ClockIcon class="w-8 h-8 text-white/80" />
                                <span class="text-xs font-semibold text-white/80 bg-white/20 px-2 py-1 rounded-full">En attente</span>
                            </div>
                            <p class="text-white text-4xl font-bold mb-1">
                                {{ dataReports?.stats?.timesheet_validate || 0 }}
                            </p>
                            <p class="text-white/80 text-sm font-medium">
                                Feuilles de temps
                            </p>
                        </div>
                    </div>

                    <div class="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <div class="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-2">
                                <DocumentTextIcon class="w-8 h-8 text-white/80" />
                                <span class="text-xs font-semibold text-white/80 bg-white/20 px-2 py-1 rounded-full">En attente</span>
                            </div>
                            <p class="text-white text-4xl font-bold mb-1">
                                {{ dataReports?.stats?.mission?.invoice_pending || 0 }}
                            </p>
                            <p class="text-white/80 text-sm font-medium">
                                Factures
                            </p>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50/50 shadow-xl rounded-2xl border border-gray-200/50 backdrop-blur-sm">
                <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-48 -mt-48 blur-3xl" />
                <div class="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full -ml-36 -mb-36 blur-3xl" />
                <div class="relative z-10 p-6">
                    <div class="flex justify-between items-start mb-6">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                                <BriefcaseIcon class="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Vos récentes missions
                                </h3>
                                <p class="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Suivez l'état de vos missions en temps réel
                                </p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                class="text-gray-600 hover:text-primary hover:bg-primary/10 rounded-xl px-4 py-2 transition-all duration-300"
                                :disabled="isLoading"
                                @click="refreshData"
                            >
                                <ArrowPathIcon
                                    class="w-5 h-5 transition-transform duration-300"
                                    :class="{ 'animate-spin': isLoading }"
                                />
                            </Button>
                            <Button
                                variant="ghost"
                                class="group text-primary font-semibold hover:bg-primary/10 rounded-xl px-5 py-2.5 transition-all duration-300 hover:scale-105 hover:shadow-md border border-transparent hover:border-primary/20"
                                @click="handleShowMissions"
                            >
                                <span class="flex items-center gap-2">
                                    Voir tout
                                    <ArrowRightIcon class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </Button>
                        </div>
                    </div>

                    <Tabs
                        v-model="activeTab"
                        class="mb-6"
                        @update:model-value="handleTabChange"
                    >
                        <TabsList class="w-full bg-gradient-to-r from-gray-100 to-gray-50 p-1.5 rounded-2xl shadow-inner border border-gray-200/50">
                            <TabsTrigger
                                value="open"
                                class="group relative w-full lg:w-64 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-emerald-600 font-bold rounded-xl transition-all duration-300 data-[state=active]:scale-[1.02] px-6 py-3"
                            >
                                <span class="flex items-center justify-center gap-2">
                                    <ClipboardDocumentCheckIcon class="w-5 h-5" />
                                    À pourvoir
                                    <span
                                        v-if="dataReports?.missions?.open?.length > 0"
                                        class="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold"
                                    >
                                        {{ dataReports.missions.open.length }}
                                    </span>
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="in_progress"
                                class="group relative w-full lg:w-64 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600 font-bold rounded-xl transition-all duration-300 data-[state=active]:scale-[1.02] px-6 py-3"
                            >
                                <span class="flex items-center justify-center gap-2">
                                    <ClockIcon class="w-5 h-5" />
                                    En cours
                                    <span
                                        v-if="dataReports?.missions?.in_progress?.length > 0"
                                        class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold"
                                    >
                                        {{ dataReports.missions.in_progress.length }}
                                    </span>
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="open"
                            class="mt-6"
                        >
                            <div class="hidden lg:block">
                                <div
                                    v-if="isLoading"
                                    class="overflow-hidden rounded-2xl border border-gray-200/50 shadow-sm bg-white/50 backdrop-blur-sm"
                                >
                                    <Table class="w-full">
                                        <TableHeader>
                                            <TableRow class="bg-gradient-to-r from-emerald-50/50 to-emerald-50/30 border-b border-emerald-100/50">
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow
                                                v-for="i in 5"
                                                :key="i"
                                                class="border-b border-gray-100/50"
                                            >
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-16" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                                <div
                                    v-else-if="!dataReports?.missions?.open || dataReports.missions.open.length == 0"
                                    class="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200"
                                >
                                    <div class="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <BriefcaseIcon class="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <p class="text-gray-600 font-semibold text-lg mb-1">
                                        Aucune mission pour le moment
                                    </p>
                                    <p class="text-gray-400 text-sm">
                                        Publiez votre première mission pour commencer
                                    </p>
                                </div>
                                <div
                                    v-else
                                    class="overflow-hidden rounded-2xl border border-gray-200/50 shadow-sm bg-white/50 backdrop-blur-sm"
                                >
                                    <Table class="w-full">
                                        <TableHeader>
                                            <TableRow class="bg-gradient-to-r from-emerald-50/50 to-emerald-50/30 border-b border-emerald-100/50">
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <BuildingOffice2Icon class="w-4 h-4 text-emerald-600" />
                                                        Service
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <CalendarIcon class="w-4 h-4 text-emerald-600" />
                                                        Date de début
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <CalendarIcon class="w-4 h-4 text-emerald-600" />
                                                        Date de fin
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <ClockIcon class="w-4 h-4 text-emerald-600" />
                                                        Horaire
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <UserGroupIcon class="w-4 h-4 text-emerald-600" />
                                                        Candidats
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <CalendarDaysIcon class="w-4 h-4 text-emerald-600" />
                                                        Création
                                                    </span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow
                                                v-for="(mission, index) in dataReports.missions.open"
                                                :key="mission.id"
                                                class="group border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-white transition-all duration-200"
                                                :class="{ 'border-b-0': index === dataReports.missions.open.length - 1 }"
                                            >
                                                <TableHead class="py-5 px-6">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                                            <BuildingOffice2Icon class="w-5 h-5 text-emerald-600" />
                                                        </div>
                                                        <span class="text-gray-900 font-semibold">
                                                            {{ mission.service?.name || '-' }}
                                                        </span>
                                                    </div>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 text-gray-700 font-medium">
                                                    {{ formatToDMY(mission.start_date) }}
                                                </TableHead>
                                                <TableHead class="py-5 px-6 text-gray-700 font-medium">
                                                    {{ formatToDMY(mission.end_date) || '-' }}
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <div class="flex items-center gap-2">
                                                        <span class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
                                                            {{ formatTime(mission.time_start_at) }}
                                                        </span>
                                                        <span class="text-gray-400">→</span>
                                                        <span class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
                                                            {{ formatTime(mission.time_end_at) }}
                                                        </span>
                                                    </div>
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <span class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/30">
                                                        <UserGroupIcon class="w-4 h-4" />
                                                        {{ mission.matching_candidates?.length || 0 }}
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 text-gray-600 text-sm font-medium">
                                                    {{ formatRelativeDate(mission.created_at) }}
                                                </TableHead>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div class="lg:hidden mt-4 space-y-3">
                                <div
                                    v-if="!dataReports?.missions?.open || dataReports.missions.open.length == 0"
                                    class="text-center py-12"
                                >
                                    <BriefcaseIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p class="text-gray-500">
                                        Aucune mission pour le moment
                                    </p>
                                </div>
                                <div
                                    v-for="mission in dataReports.missions.open"
                                    v-else
                                    :key="mission.id"
                                    class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div class="flex justify-between">
                                        <span class="text-sm text-gray-500">Service</span>
                                        <span class="font-semibold text-sm text-gray-500">{{ mission.service?.name || '-' }}</span>
                                    </div>

                                    <div class="mt-2 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p class="text-gray-500">
                                                Début
                                            </p>
                                            <p>{{ formatToDMY(mission.start_date) }}</p>
                                        </div>

                                        <div>
                                            <p class="text-gray-500">
                                                Fin
                                            </p>
                                            <p>{{ formatToDMY(mission.start_date) }}</p>
                                        </div>

                                        <div>
                                            <p class="text-gray-500">
                                                Horaire
                                            </p>
                                            <p>
                                                {{ formatTime(mission.time_start_at) }}
                                                <span class="mx-1 text-gray-500">→</span>
                                                {{ formatTime(mission.time_end_at) }}
                                            </p>
                                        </div>

                                        <div>
                                            <p class="text-gray-500">
                                                Nb.candidats
                                            </p>
                                            <p>
                                                {{ mission.matching_candidates.length }}
                                            </p>
                                        </div>
                                    </div>

                                    <p class="mt-3 text-xs text-gray-400">
                                        Créée {{ mission.created_at }}
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="in_progress"
                            class="mt-6"
                        >
                            <div class="hidden lg:block">
                                <div
                                    v-if="isLoading"
                                    class="overflow-hidden rounded-2xl border border-gray-200/50 shadow-sm bg-white/50 backdrop-blur-sm"
                                >
                                    <Table class="w-full">
                                        <TableHeader>
                                            <TableRow class="bg-gradient-to-r from-blue-50/50 to-blue-50/30 border-b border-blue-100/50">
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-5 w-24" />
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow
                                                v-for="i in 5"
                                                :key="i"
                                                class="border-b border-gray-100/50"
                                            >
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-16" />
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <Skeleton class="h-6 w-full" />
                                                </TableHead>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                                <div
                                    v-else-if="!dataReports?.missions?.in_progress || dataReports.missions.in_progress.length == 0"
                                    class="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200"
                                >
                                    <div class="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <BriefcaseIcon class="w-10 h-10 text-blue-500" />
                                    </div>
                                    <p class="text-gray-600 font-semibold text-lg mb-1">
                                        Aucune mission en cours
                                    </p>
                                    <p class="text-gray-400 text-sm">
                                        Vos missions actives apparaîtront ici
                                    </p>
                                </div>
                                <div
                                    v-else
                                    class="overflow-hidden rounded-2xl border border-gray-200/50 shadow-sm bg-white/50 backdrop-blur-sm"
                                >
                                    <Table class="w-full">
                                        <TableHeader>
                                            <TableRow class="bg-gradient-to-r from-blue-50/50 to-blue-50/30 border-b border-blue-100/50">
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <BuildingOffice2Icon class="w-4 h-4 text-blue-600" />
                                                        Service
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <CalendarIcon class="w-4 h-4 text-blue-600" />
                                                        Date de début
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <CalendarIcon class="w-4 h-4 text-blue-600" />
                                                        Date de fin
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <ClockIcon class="w-4 h-4 text-blue-600" />
                                                        Horaire
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <UserIcon class="w-4 h-4 text-blue-600" />
                                                        Infirmier
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 font-bold text-gray-800 text-sm">
                                                    <span class="flex items-center gap-2">
                                                        <CalendarDaysIcon class="w-4 h-4 text-blue-600" />
                                                        Création
                                                    </span>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow
                                                v-for="(mission, index) in dataReports.missions.in_progress"
                                                :key="mission.id"
                                                class="group border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-white transition-all duration-200"
                                                :class="{ 'border-b-0': index === dataReports.missions.in_progress.length - 1 }"
                                            >
                                                <TableHead class="py-5 px-6">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                            <BuildingOffice2Icon class="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <span class="text-gray-900 font-semibold">
                                                            {{ mission.service?.name || '-' }}
                                                        </span>
                                                    </div>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 text-gray-700 font-medium">
                                                    {{ formatToDMY(mission.start_date) }}
                                                </TableHead>
                                                <TableHead class="py-5 px-6 text-gray-700 font-medium">
                                                    {{ formatToDMY(mission.end_date) || '-' }}
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <div class="flex items-center gap-2">
                                                        <span class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
                                                            {{ formatTime(mission.time_start_at) }}
                                                        </span>
                                                        <span class="text-gray-400">→</span>
                                                        <span class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
                                                            {{ formatTime(mission.time_end_at) }}
                                                        </span>
                                                    </div>
                                                </TableHead>
                                                <TableHead class="py-5 px-6">
                                                    <span class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30">
                                                        <UserIcon class="w-4 h-4" />
                                                        {{ mission.accepted_candidate?.full_name || '-' }}
                                                    </span>
                                                </TableHead>
                                                <TableHead class="py-5 px-6 text-gray-600 text-sm font-medium">
                                                    {{ formatRelativeDate(mission.created_at) }}
                                                </TableHead>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div class="lg:hidden mt-4 space-y-3">
                                <div
                                    v-if="!dataReports?.missions?.in_progress || dataReports.missions.in_progress.length == 0"
                                    class="text-center py-12"
                                >
                                    <BriefcaseIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p class="text-gray-500">
                                        Aucune mission pour le moment
                                    </p>
                                </div>
                                <div
                                    v-for="mission in dataReports.missions.in_progress"
                                    v-else
                                    :key="mission.id"
                                    class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div class="flex justify-between">
                                        <span class="text-sm text-gray-500">Service</span>
                                        <span class="font-semibold text-sm text-gray-500">{{ mission.service?.name || '-' }}</span>
                                    </div>

                                    <div class="mt-2 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p class="text-gray-500">
                                                Début
                                            </p>
                                            <p>{{ mission.start_date }}</p>
                                        </div>

                                        <div>
                                            <p class="text-gray-500">
                                                Fin
                                            </p>
                                            <p>{{ mission.end_date }}</p>
                                        </div>

                                        <div>
                                            <p class="text-gray-500">
                                                Horaire
                                            </p>
                                            <p>
                                                {{ formatTime(mission.time_start_at) }}
                                                <span class="mx-1 text-gray-500">→</span>
                                                {{ formatTime(mission.time_end_at) }}
                                            </p>
                                        </div>

                                        <div>
                                            <p class="text-gray-500">
                                                Infirmier
                                            </p>
                                            <p>{{ mission.accepted_candidate.full_name }}</p>
                                        </div>
                                    </div>

                                    <p class="mt-3 text-xs text-gray-400">
                                        Créée {{ mission.created_at }}
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <div class="lg:col-span-1 bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <BellIcon class="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">
                            Notifications
                        </h3>
                        <p class="text-xs text-gray-500">
                            Dernières activités
                        </p>
                    </div>
                </div>
                <div
                    v-if="isLoading"
                    class="space-y-3"
                >
                    <div
                        v-for="i in 3"
                        :key="i"
                        class="bg-gray-50 border border-gray-200 rounded-xl p-4"
                    >
                        <div class="flex gap-3 items-start">
                            <Skeleton class="w-10 h-10 rounded-lg" />
                            <div class="flex-1 space-y-2">
                                <Skeleton class="h-4 w-3/4" />
                                <Skeleton class="h-3 w-1/2" />
                                <Skeleton class="h-3 w-1/4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-else-if="dataReports?.notifications?.missions?.length == 0 && dataReports?.notifications?.timesheets?.length == 0"
                    class="py-12"
                >
                    <div class="text-center">
                        <BellSlashIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p class="text-sm text-gray-500">
                            Aucune notification
                        </p>
                    </div>
                </div>
                <div
                    v-else
                    class="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar"
                >
                    <div
                        v-for="notification in dataReports?.notifications?.missions"
                        :key="notification.id"
                        class="group bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                        @click="handleReadNotification(notification, 'mission')"
                    >
                        <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                            <UserPlusIcon class="w-5 h-5 text-white" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h6 class="text-sm font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                Nouveau candidat
                            </h6>
                            <p class="text-xs text-gray-600 mb-2">
                                Mission #{{ notification.notifiable_id }}
                            </p>
                            <p class="text-xs text-gray-400">
                                {{ formatRelativeDate(notification.created_at) }}
                            </p>
                        </div>
                    </div>
                    <div
                        v-for="notification in dataReports?.notifications?.timesheets"
                        :key="notification.mission_id"
                        class="group bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start hover:shadow-md hover:border-amber-200 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                        @click="handleReadNotification(notification, 'timesheet')"
                    >
                        <div class="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                            <ClipboardDocumentListIcon class="w-5 h-5 text-white" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h6 class="text-sm font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                                {{ notification.data.length > 1 ? `${notification.data.length} jours` : `${notification.data.length} jour` }} à valider
                            </h6>
                            <p class="text-xs text-gray-600 mb-2">
                                Mission #{{ notification.mission_id }}
                            </p>
                            <p class="text-xs text-gray-400">
                                {{ formatRelativeDate(notification.data[0].created_at) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    ClipboardDocumentListIcon,
    UserPlusIcon,
    PlusIcon,
    BriefcaseIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    DocumentTextIcon,
    BellIcon,
    BellSlashIcon,
    ArrowRightIcon,
    ArrowPathIcon,
    BuildingOffice2Icon,
    CalendarIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    UserIcon,
} from '@heroicons/vue/24/outline';
import { formatRelativeDate, formatTime, formatToDMY } from '~/composables/useDate';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';

useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const router = useRouter();

const handleCreateMission = () => {
    router.push('/dashboard/institution/missions/create');
};

const handleShowMissions = () => {
    router.push('/dashboard/institution/missions');
};

const { reports, getReports } = useReports();
const { markAsRead } = useNotifications();

const defaultReports = {
    stats: {
        mission: {
            in_progress: 0,
            open: 0,
            invoice_pending: 0,
        },
        timesheet_validate: 0,
    },
    missions: {
        open: [],
        in_progress: [],
    },
    notifications: {
        missions: [],
        timesheets: [],
    },
};

const dataReports = useState('institutionDashboardReports', () => defaultReports);
const isLoading = useState('institutionDashboardLoading', () => true);

const loadReports = async () => {
    try {
        isLoading.value = true;
        await getReports();
        if (reports.value) {
            dataReports.value = reports.value;
        }
    }
    catch (error) {
        console.error('Error loading reports:', error);
    }
    finally {
        isLoading.value = false;
    }
};

const { $toast } = useNuxtApp();

const refreshData = async () => {
    await loadReports();
    $toast({
        description: 'Données mises à jour avec succès',
    });
};

onMounted(() => {
    if (!reports.value || Object.keys(reports.value).length === 0) {
        loadReports();
    }
    else {
        dataReports.value = reports.value;
        isLoading.value = false;
    }
});

const activeTab = ref('open');
const handleTabChange = async (newTab: string) => {
    activeTab.value = newTab;
};

const handleReadNotification = async (notification, typeNotif) => {
    if (typeNotif == 'mission') {
        const response = await markAsRead(notification.id);

        if (response.data) {
            router.push(`/dashboard/institution/missions/candidacy/${notification.notifiable_id}`);
        }
    }
    else {
        for (const notif of notification.data) {
            await markAsRead(notif.id);
        }

        router.push(
            `/dashboard/institution/missions/timesheet/${notification.mission_id}`,
        );
    }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>
