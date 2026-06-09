<template>
    <div
        class="flex h-full min-h-0 w-full max-w-full flex-col overflow-hidden bg-card text-card-foreground transition-all duration-300"
        :class="compact ? 'rounded-lg' : 'rounded-xl'"
    >
        <div
            class="relative flex items-center justify-center bg-primary"
            :class="compact ? 'h-24' : 'h-36'"
        >
            <LayoutsAppImage
                :src="'logo_white.png'"
                alt="logo-InfiSwap"
                :class="compact ? 'mb-2 w-28 hover:cursor-pointer' : 'mb-8 w-48 hover:cursor-pointer'"
                format="png"
            />
            <img
                v-if="user.profil_url"
                :src="useRuntimeConfig().public.API_URL + '/storage/' + user.profil_url"
                alt="Photo de profil"
                class="absolute rounded-full border-background"
                :class="compact ? '-bottom-7 h-16 w-16 border-2' : '-bottom-14 h-28 w-28 border-4'"
            >
            <CircleUser
                v-else
                class="absolute rounded-full border-background bg-muted text-tertiary"
                :class="compact ? '-bottom-7 h-16 w-16 border-2' : '-bottom-14 h-28 w-28 border-4'"
            />
        </div>

        <div
            class="text-center"
            :class="compact ? 'px-3 pt-11' : 'px-5 pt-20'"
        >
            <h1
                class="mb-0.5 line-clamp-2 break-words leading-snug text-card-foreground hyphens-auto"
                :class="compact ? 'min-h-[2.25rem] text-base' : 'min-h-[3.5rem] text-2xl'"
            >
                <span class="font-semibold text-primary">{{ user.full_name }}</span>
            </h1>
            <p
                class="mb-0 line-clamp-2 font-semibold leading-snug text-muted-foreground"
                :class="compact ? 'min-h-[1.25rem] text-xs' : 'min-h-[2.75rem] text-base'"
            >
                {{ user.gender === 'F' ? 'Infirmière' : 'Infirmier' }}
                <template v-if="user.professional_category">
                    - {{ translatedCategory }}
                </template>
            </p>
        </div>

        <div
            v-if="isAdmin"
            class="px-6 mb-8 overflow-y-auto text-sm text-left text-gray-700 h-96"
        >
            <div class="flex gap-4 mb-4 border-b border-gray-300">
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'information' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'information'"
                >
                    Informations
                </button>
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'contact' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'contact'"
                >
                    Contact
                </button>
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'activite' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'activite'"
                >
                    Activité
                </button>
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'product' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'product'"
                >
                    Produit
                </button>
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'comment' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'comment'"
                >
                    Commentaire
                </button>
                <button
                    class="pb-2 border-b-2"
                    :class="activeTab === 'commercial' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                    @click="activeTab = 'commercial'"
                >
                    Commercial
                </button>
            </div>

            <div
                v-if="activeTab === 'activite'"
                class="p-4 space-y-3 border border-gray-200 rounded-lg"
            >
                <div
                    class="flex items-center gap-2 cursor-pointer"
                    title="Date de dernière post d'un remplacement"
                >
                    <Calendar class="w-5 h-5 text-primary" />
                    <p>Dernière post : <span class="font-semibold">{{ user.historic_activity?.last_post_date ?? '—' }}</span></p>
                </div>

                <div
                    class="flex items-center gap-2 cursor-pointer"
                    title="Date de dernière acceptation d'un remplacement"
                >
                    <Calendar class="w-5 h-5 text-primary" />
                    <p>Acceptation : <span class="font-semibold">{{ user.historic_activity?.last_accept_posted_date ?? '—' }}</span></p>
                </div>

                <div
                    class="flex items-center gap-2 cursor-pointer"
                    title="Date de dernière réponse à un remplacement posté"
                >
                    <Calendar class="w-5 h-5 text-primary" />
                    <p>Réponse : <span class="font-semibold">{{ user.historic_activity?.last_response_date ?? '—' }}</span></p>
                </div>

                <div
                    class="flex items-center gap-2 cursor-pointer"
                    title="Date de dernière acceptation sur un remplacement posté"
                >
                    <Calendar class="w-5 h-5 text-primary" />
                    <p>Accept. réponse : <span class="font-semibold">{{ user.historic_activity?.last_accept_response_date ?? '—' }}</span></p>
                </div>

                <div class="w-full my-2 border-t border-gray-300" />

                <div class="flex items-center gap-2">
                    <DocumentPlusIcon class="w-5 h-5 text-primary" />
                    <p>
                        Remplacements créés : <span class="font-semibold">{{ activityData.replacements_created }}</span>
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <DocumentCheckIcon class="w-5 h-5 text-primary" />
                    <p>
                        Remplacements acceptés : <span class="font-semibold">{{ activityData.replacements_accepted
                        }}</span>
                    </p>
                </div>

                <div class="flex items-center gap-2">
                    <ArrowPathRoundedSquareIcon class="w-5 h-5 text-primary" />
                    <p>Positionnements : <span class="font-semibold">{{ activityData.placements_made }}</span></p>
                </div>

                <div class="flex items-center gap-2">
                    <CircleCheck class="w-5 h-5 text-primary" />
                    <p>
                        Positionnements acceptés : <span class="font-semibold">{{ activityData.placements_accepted }}</span>
                    </p>
                </div>

                <div class="w-full my-2 border-t border-gray-300" />

                <div
                    v-if="user.ambassador === 1"
                    class="flex items-center gap-2"
                >
                    <Users class="w-5 h-5 text-primary" />
                    <p>Infirmiers parrainés : <span class="font-semibold">--</span></p>
                </div>
            </div>

            <div
                v-else-if="activeTab === 'information'"
                class="p-4 space-y-3 border border-gray-200 rounded-lg"
            >
                <p class="flex items-center gap-2 text-primary">
                    <Mail class="w-5 h-5" />
                    {{ user.email }}
                </p>
                <p class="flex items-center gap-2">
                    <Phone class="w-5 h-5 text-primary" />
                    {{ user.phone_number }}
                </p>
                <p class="flex items-center gap-2">
                    <Building2 class="w-5 h-5 text-primary" />
                    {{ user.city }}
                </p>
                <p class="flex items-center gap-2">
                    <Inbox class="w-5 h-5 text-primary" />
                    {{ user.zip_code }}
                </p>
                <p class="flex items-center gap-2">
                    <IdCard class="w-5 h-5 text-primary" />
                    {{ new Date(user.created_at).toLocaleDateString('fr-FR') }}
                </p>
            </div>

            <div
                v-else-if="activeTab === 'contact'"
                class="p-4 space-y-3 border border-gray-200 rounded-lg"
            >
                <p>
                    Date de dernier contact :
                    {{ user.contact_date ? new Date(user.contact_date).toLocaleDateString('fr-FR') : '- - -' }}
                </p>

                <p>Mode de contact : {{ user.contact_method ?? '- - -' }}</p>

                <p>
                    Date de dernière connexion :
                    {{
                        new Date(user.last_login_at ?? user.created_at).toLocaleDateString('fr-FR') + ' ' + new Date(user.last_login_at ?? user.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                    }}
                </p>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.insurance ? CircleCheck : XCircle"
                        :class="user.insurance ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>NursAssur</label>
                </div>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.site ? CircleCheck : XCircle"
                        :class="user.site ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>NursTech</label>
                </div>

                <div class="flex items-center gap-2">
                    <component
                        :is="user.ambassador ? CircleCheck : XCircle"
                        :class="user.ambassador ? 'text-green-500 w-5 h-5' : 'text-gray-300 w-5 h-5'"
                    />
                    <label>Ambassadeur</label>
                </div>

                <div class="flex items-center gap-2">
                    <XCircle class="w-5 h-5 text-gray-300" />
                    <label>Tournée</label>
                </div>
            </div>

            <div
                v-else-if="activeTab === 'product'"
                class="p-4 space-y-3 border border-gray-200 rounded-lg"
            >
                <div
                    v-if="user.product_activity_summary && user.product_activity_summary.length"
                    class="space-y-4"
                >
                    <div
                        v-for="item in user.product_activity_summary"
                        :key="item.product_id"
                        class="p-4 border rounded-md bg-gray-50"
                    >
                        <h3 class="font-semibold text-primary">
                            {{ item.product_name }}
                        </h3>
                        <p>
                            Date du dernier clic :
                            <span class="font-medium">
                                {{ item.last_click_date ? formatDate(item.last_click_date) : 'Aucun clic' }}
                            </span>
                        </p>
                        <p>
                            Date du dernier contact :
                            <span class="font-medium">
                                {{ item.last_contact_date ? formatDate(item.last_contact_date) : 'Aucun contact' }}
                            </span>
                        </p>
                    </div>
                </div>

                <p
                    v-else
                    class="text-gray-500"
                >
                    Aucune activité produit enregistrée.
                </p>
            </div>

            <div
                v-else-if="activeTab === 'comment'"
                class="space-y-3"
            >
                <div class="relative">
                    <Textarea
                        v-model="comment"
                        disabled
                        class="w-full h-36 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary peer"
                    />
                    <p class="hidden mt-1 text-sm text-gray-500 peer-focus:block">
                        Appuyez sur Entrée pour valider votre commentaire
                    </p>
                </div>
            </div>

            <div
                v-else-if="activeTab === 'commercial'"
                class="space-y-3"
            >
                <div class="relative p-4 border border-gray-200 rounded-lg">
                    <div class="flex gap-4 mb-4 border-b border-gray-300">
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'call' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'call'"
                        >
                            Appels
                        </button>
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'sale' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'sale'"
                        >
                            Ventes
                        </button>
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'recommandation' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'recommandation'"
                        >
                            Recommandation
                        </button>
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'meeting' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'meeting'"
                        >
                            Rendez-vous
                        </button>
                        <button
                            class="pb-2 border-b-2"
                            :class="tradeTab === 'pending' ? 'border-primary text-primary font-semibold' : 'border-transparent text-gray-500'"
                            @click="tradeTab = 'pending'"
                        >
                            Réponse en attente
                        </button>
                    </div>
                    <div v-if="tradeTab === 'call'">
                        <h2 class="mb-6 italic font-semibold text-center text-gray-700">
                            Le nombre d’appels passés sur une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col gap-4 md:flex-row md:items-end">
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col w-full gap-1">
                                <label class="text-sm font-medium text-gray-500">Nombre d'appels</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="tradeTab === 'sale'">
                        <h2 class="mb-6 italic font-semibold text-center text-gray-700">
                            Le nombre de ventes sur une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col gap-4 md:flex-row md:items-end">
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col w-full gap-1">
                                <p class="text-gray-700">
                                    Produit :
                                </p>
                                <Select v-model="form.produit_id">
                                    <SelectTrigger
                                        class="w-full bg-white border-2 border-gray-300 rounded-lg text-nowrap"
                                        position="right"
                                    >
                                        <SelectValue placeholder="Choisis un produit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            v-for="product in products"
                                            :key="product.id"
                                            :value="String(product.id)"
                                        >
                                            {{ product.name }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <!-- <p class="mt-3 text-sm text-gray-600">
                                    Produit sélectionné ID : <span class="font-semibold">{{ form.produit_id }}</span>
                                </p> -->
                            </div>

                            <div class="flex flex-col w-full gap-1">
                                <label class="text-sm font-medium text-gray-500">Nombre de ventes</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    v-model="form.number"
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="tradeTab === 'recommandation'">
                        <h2 class="mb-6 italic font-semibold text-center text-gray-700">
                            Le nombre de recommandation sur une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col gap-4 md:flex-row md:items-end">
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col w-full gap-1">
                                <label class="text-sm font-medium text-gray-500">Nombre de recommandation</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="tradeTab === 'meeting'">
                        <h2 class="mb-6 italic font-semibold text-center text-gray-700">
                            Le nombre de rendez-vous sur une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col gap-4 md:flex-row md:items-end">
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col w-full gap-1">
                                <label class="text-sm font-medium text-gray-500">Nombre de rendez-vous</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div v-else-if="tradeTab === 'pending'">
                        <h2 class="mb-6 italic font-semibold text-center text-gray-700">
                            Le nombre de réponses en attente pendant une période donnée
                        </h2>

                        <form
                            class="space-y-6"
                            @submit.prevent="submit"
                        >
                            <div class="flex flex-col gap-4 md:flex-row md:items-end">
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.start_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                                <div class="flex flex-col w-full gap-1">
                                    <InputIcon
                                        v-model="form.end_date"
                                        type="date"
                                        class="w-full h-10 px-3 bg-gray-200 border-none rounded-lg"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col w-full gap-1">
                                <label class="text-sm font-medium text-gray-500">Nombre de réponses en attente</label>
                                <InputIcon
                                    v-model="form.number"
                                    type="number"
                                    placeholder="12"
                                    rounded="md"
                                />
                            </div>

                            <div class="grid place-content-center">
                                <Button
                                    type="submit"
                                    class="rounded-lg w-52"
                                    :in-progress="inProgress"
                                >
                                    Sauvegarder
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-else
            class="flex min-h-0 flex-1 flex-col"
            :class="compact ? 'px-3' : 'px-5'"
        >
            <Separator
                class="h-px w-full shrink-0"
                :class="compact ? 'mt-2' : 'mt-4'"
            />
            <div
                class="grid min-h-0 flex-1 items-start text-left text-muted-foreground"
                :class="compact
                    ? 'grid-cols-[1rem_minmax(0,1fr)] gap-x-2 gap-y-1 py-2 text-xs'
                    : 'grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-2.5 py-4 text-sm'"
            >
                <template v-if="minimalInfo">
                    <Building2
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ user.city || user.profile.city || 'Non renseigné' }}</span>
                    <Inbox
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ user.zip_code || user.profile.zip_code || 'Non renseigné' }}</span>
                </template>
                <template v-else-if="showFullInfo">
                    <Mail
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug text-primary">{{ user.email || 'Non renseigné' }}</span>
                    <LayoutsAppImage
                        src="/icons/gender.png"
                        class="shrink-0 justify-self-start"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{
                        user.gender === 'F' ? 'Femme'
                        : user.gender === 'M' ? 'Homme'
                            : user.gender || 'Non renseigné'
                    }}</span>
                    <Phone
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ user.phone_number || 'Non renseigné' }}</span>
                    <Building2
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ user.city || user.profile.city || 'Non renseigné' }}</span>
                    <Inbox
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ user.zip_code || user.profile.zip_code || 'Non renseigné' }}</span>
                    <IdCard
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ user.identifier_number || 'Non renseigné' }}</span>
                </template>
                <template v-else>
                    <Building2
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ user.city || user.profile.city || 'Non renseigné' }}</span>
                    <Inbox
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ user.zip_code || user.profile.zip_code || 'Non renseigné' }}</span>
                    <Phone
                        class="shrink-0 text-primary"
                        :class="iconSz"
                    />
                    <span class="min-w-0 break-words leading-snug">{{ user.phone_number || 'Non renseigné' }}</span>
                </template>
            </div>
            <Separator class="mb-0 h-px w-full shrink-0" />
        </div>
        <div
            class="w-full shrink-0 bg-primary"
            :class="compact ? 'h-2 rounded-b-lg' : 'h-4 rounded-b-xl'"
        />
    </div>
</template>

<script lang="ts" setup>
import { Building2, Calendar, CircleCheck, CircleUser, IdCard, Inbox, Mail, Phone, Users, XCircle } from 'lucide-vue-next';
import type { User } from '~/lib/types';
import { useRuntimeConfig } from '#app';

const { isAdmin } = useAuth();
const activeTab = ref('information');
const tradeTab = ref('call');

const props = withDefaults(defineProps<{
    user: User;
    showFullInfo?: boolean;
    minimalInfo?: boolean;
    /** Carte dense (ex. grille liste remplacements) */
    compact?: boolean;
}>(), {
    showFullInfo: false,
    minimalInfo: false,
    compact: false,
});

const iconSz = computed(() => (props.compact ? 'size-4' : 'size-5'));

const { activityUser } = useReplacements();
const { getAll } = useProduct();
const { crmUser } = useCrm();
const activityData = ref(null);
const products = ref<{ id: number; name: string }[]>([]);
const emit = defineEmits(['close', 'refresh-users', 'user-updated']);
const { $toast } = useNuxtApp();
const defaultForm = {
    user_id: props.user.id,
    client_type: 'user',
    start_date: '',
    end_date: '',
    number: '',
    produit_id: '',
    type: '',
};
const form = ref({ ...defaultForm });
const comment = ref(props.user.comment_crm ?? '');

// const selectedProduct = ref<string>('');

const admin = isAdmin ?? ref(false);
onMounted(async () => {
    if (admin.value === true) {
        const result = await getAll();
        products.value = result;
    }
});

async function loadActivity() {
    if (!props.user || !props.user.id) return;
    try {
        const result = await activityUser(props.user.id);
        activityData.value = result.activity;
    }
    catch (e) {
        console.error('Erreur chargement activité utilisateur', e);
    }
}

const translatedCategory = computed(() => {
    if (!props.user.professional_category) return '';

    const isFemale = props.user.gender === 'F';

    if (props.user.professional_category === 'salaried') {
        return isFemale ? 'Salariée' : 'Salarié';
    }

    if (props.user.professional_category === 'independent') {
        return isFemale ? 'Indépendante' : 'Indépendant';
    }

    return props.user.professional_category;
});

watch(tradeTab, (val) => {
    form.value.type = val;
}, { immediate: true });

const { submit, inProgress } = useSubmit(async () => {
    const payload = {
        user_id: form.value.user_id,
        client_type: form.value.client_type,
        last_contact_date: form.value.start_date,
        last_contact_method: null,
        last_comment: comment.value ?? null,
        history: [
            {
                action_type: form.value.type,
                number_of_times: form.value.number,
                start_date: form.value.start_date,
                end_date: form.value.end_date,
                product_id: form.value.produit_id,
                method: null,
                status: null,
                other_informations: null,
                comment: comment.value ?? '',
                // referred_id: props.user.id,
            },
        ],
    };

    // await crmUser(payload);
    const response = await crmUser(payload);
    return response.crm;
}, {
    onSuccess: (updatedUser) => {
        $toast({
            description: 'Données mises à jour avec succès',
        });
        form.value = { ...defaultForm };
        comment.value = '';
        // emit('refresh-users');
        emit('user-updated', updatedUser);
        emit('close');
    },
});

loadActivity();

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}
</script>
