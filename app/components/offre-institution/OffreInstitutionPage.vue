<template>
    <div class="offre-institution text-slate-800 antialiased min-h-screen flex flex-col bg-[#f8fafc] scroll-smooth">
        <OffreInstitutionCountryModal
            v-if="showCountryModal"
            @select="handleCountrySelect"
        />

        <!-- TOP HEADER -->
        <header class="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <NuxtLink
                    to="/"
                    class="flex items-center"
                >
                    <svg
                        class="h-12 w-auto sm:h-14"
                        viewBox="0 0 420 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="InfiSwap"
                    >
                        <g transform="translate(10, 15)">
                            <rect
                                x="25"
                                y="5"
                                width="28"
                                height="66"
                                rx="6"
                                fill="#46d88e"
                                transform="rotate(-8, 39, 38)"
                            />
                            <rect
                                x="28"
                                y="8"
                                width="22"
                                height="60"
                                rx="4"
                                fill="#FEFEEA"
                                transform="rotate(-8, 39, 38)"
                            />
                            <circle
                                cx="34"
                                cy="11"
                                r="1.5"
                                fill="#1e293b"
                            />
                            <rect
                                x="33"
                                y="63"
                                width="8"
                                height="2"
                                rx="1"
                                fill="#46d88e"
                            />
                            <path
                                d="M 12 30 C 10 15, 22 5, 38 7 C 54 9, 65 20, 61 35 C 57 50, 42 62, 33 69"
                                stroke="#d3405c"
                                stroke-width="2.5"
                                fill="none"
                                stroke-linecap="round"
                            />
                            <circle
                                cx="12"
                                cy="30"
                                r="2.5"
                                fill="#d3405c"
                            />
                            <circle
                                cx="61"
                                cy="35"
                                r="2.5"
                                fill="#d3405c"
                            />
                            <path
                                d="M 33 69 C 25 76, 12 78, 8 68 C 4 58, 18 56, 14 68 C 10 80, -2 74, 1 65"
                                stroke="#d3405c"
                                stroke-width="1.8"
                                fill="none"
                            />
                            <circle
                                cx="14"
                                cy="68"
                                r="3.5"
                                fill="#d3405c"
                            />
                        </g>
                        <text
                            x="95"
                            y="65"
                            font-family="'Plus Jakarta Sans', sans-serif"
                            font-weight="800"
                            font-size="52"
                            letter-spacing="-1"
                        >
                            <tspan fill="#46d88e">infi</tspan><tspan fill="#d3405c">Swap</tspan>
                        </text>
                        <text
                            x="98"
                            y="90"
                            font-family="'Plus Jakarta Sans', sans-serif"
                            font-weight="500"
                            font-size="14"
                            fill="#46d88e"
                            letter-spacing="3.5"
                        >
                            vos soins sans interruption
                        </text>
                    </svg>
                </NuxtLink>

                <div
                    v-if="hasSelectedCountry"
                    class="hidden md:flex items-center space-x-6"
                >
                    <div class="flex rounded-lg border border-slate-200 overflow-hidden text-[11px] font-bold">
                        <button
                            type="button"
                            class="px-3 py-1.5 transition-colors"
                            :class="isBelgium ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                            @click="handleCountrySelect('be')"
                        >
                            BE
                        </button>
                        <button
                            type="button"
                            class="px-3 py-1.5 border-l border-slate-200 transition-colors"
                            :class="isFrance ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                            @click="handleCountrySelect('fr')"
                        >
                            FR
                        </button>
                    </div>
                    <span class="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {{ countryContent?.headerBadge }}
                    </span>
                    <div
                        v-if="isBelgium"
                        class="flex items-center space-x-2 border-l pl-6 border-slate-200"
                    >
                        <span class="text-xs text-slate-400">Partenariat officiel :</span>
                        <span class="font-bold text-slate-700 tracking-wider text-sm bg-slate-50 px-2 py-1 rounded">JAUMANA <span class="text-[#46d88e]">Soins</span></span>
                    </div>
                </div>

                <a
                    v-if="hasSelectedCountry"
                    :href="`tel:${contact.phoneTel}`"
                    class="bg-slate-950 hover:bg-slate-800 text-white transition-all px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                    <i class="fa-solid fa-phone text-[#46d88e]" />
                    <span>{{ contact.phoneDisplay }}</span>
                </a>
            </div>
        </header>

        <template v-if="hasSelectedCountry">
            <!-- TRUST STATS -->
            <section class="bg-gradient-to-r from-[#d3405c] to-[#b52a45] text-white py-3 shadow-md">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-trophy text-amber-300 text-lg animate-bounce" />
                        <span class="font-extrabold text-xs sm:text-sm uppercase tracking-wide">
                            {{ countryContent?.trustBannerLead }}
                        </span>
                    </div>
                    <div class="bg-white/10 px-4 py-1 rounded-full text-xs font-bold border border-white/25 flex items-center gap-2">
                        <i class="fa-solid fa-users text-[#46d88e]" />
                        <span>{{ countryContent?.trustBannerMembers }}</span>
                    </div>
                </div>
            </section>

            <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- HERO -->
                <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 sm:p-10 text-white mb-8 shadow-xl relative overflow-hidden">
                    <div class="absolute -right-16 -bottom-16 w-64 h-64 bg-[#46d88e] opacity-10 rounded-full blur-3xl" />
                    <div class="absolute right-1/4 -top-16 w-48 h-48 bg-[#d3405c] opacity-10 rounded-full blur-3xl" />
                    <div class="relative z-10 max-w-3xl">
                        <span class="bg-[#46d88e] text-slate-950 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 inline-flex items-center gap-1.5">
                            <i class="fa-solid fa-circle-check" /> Remplacements garantis par la communauté
                        </span>
                        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                            Garantissez la continuité de vos soins, <span class="text-[#46d88e]">à un coût largement inférieur à l'intérim.</span>
                        </h1>
                        <p
                            class="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed"
                            v-html="heroDescriptionHtml"
                        />
                        <div class="flex flex-wrap gap-3">
                            <button
                                type="button"
                                class="bg-[#46d88e] hover:bg-[#2ebd73] text-slate-950 px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md"
                                @click="scrollTo('presentation-folder')"
                            >
                                <i class="fa-solid fa-book-open" /> Découvrir l'Offre Institutionnelle
                            </button>
                            <button
                                type="button"
                                class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-5 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                                @click="scrollTo('simulateur')"
                            >
                                <i class="fa-solid fa-calculator text-[#d3405c]" /> Lancer le comparateur d'intérim
                            </button>
                        </div>
                    </div>
                </div>

                <!-- TWO PILLARS -->
                <div
                    class="grid grid-cols-1 gap-6 mb-10"
                    :class="isBelgium ? 'lg:grid-cols-2' : 'lg:grid-cols-1'"
                >
                    <div class="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden">
                        <div class="absolute top-0 right-0 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                            {{ countryContent?.diyPillarBadge }}
                        </div>
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Option 1 : Do-It-Yourself (Abonnement)</span>
                                <div class="text-right">
                                    <span class="text-slate-950 font-extrabold text-sm block">{{ diyMonthlyLabel }}</span>
                                    <span
                                        v-if="diyPromoActive"
                                        class="text-slate-400 text-[10px] line-through block"
                                    >{{ diyFullMonthlyLabel }}</span>
                                    <span class="text-slate-400 text-[10px] block">ou {{ diyYearlyShortLabel }} (2 mois offerts)</span>
                                    <span
                                        v-if="diyPromoActive"
                                        class="text-slate-400 text-[10px] line-through block"
                                    >{{ diyFullYearlyShortLabel }}</span>
                                    <span
                                        v-if="diyPromoActive"
                                        class="text-[#d3405c] text-[10px] font-bold block mt-1"
                                    >{{ diyPromoValidityLabel }}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <i class="fa-solid fa-laptop-code text-lg" />
                                </div>
                                <h3 class="text-xl font-bold text-slate-800">
                                    La Plateforme InfiSwap
                                </h3>
                            </div>
                            <p class="text-slate-600 text-sm mb-4 leading-relaxed">
                                Prenez le contrôle direct de vos remplacements. Publiez vos besoins en quelques clics. Vos annonces apparaissent <strong>en tête de liste</strong> auprès de notre communauté de <strong>{{ diyCommunityLabel }}</strong>. Vous les payez directement à leur tarif normal (sans commission horaire).
                            </p>
                            <ul class="space-y-2 mb-6">
                                <li class="text-xs text-slate-600 flex items-center gap-2">
                                    <i class="fa-solid fa-check text-[#46d88e]" /> Visibilité prioritaire immédiate sur l'application
                                </li>
                                <li class="text-xs text-slate-600 flex items-center gap-2">
                                    <i class="fa-solid fa-check text-[#46d88e]" /> <strong>Zéro commission</strong> horaire sur les soins effectués
                                </li>
                                <li class="text-xs text-slate-600 flex items-center gap-2">
                                    <i class="fa-solid fa-check text-[#46d88e]" /> {{ countryContent?.diyNetworkAccessLabel }}
                                </li>
                            </ul>
                        </div>
                        <button
                            type="button"
                            class="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 rounded-lg border border-slate-100 transition-all flex items-center justify-center gap-2"
                            @click="switchTab('diy-infiswap')"
                        >
                            En savoir plus <i class="fa-solid fa-arrow-right text-xs" />
                        </button>
                    </div>

                    <div
                        v-if="isBelgium"
                        class="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
                    >
                        <div class="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                            Partenariat InfiSwap × Jaumana
                        </div>
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="bg-[#d3405c]/10 text-[#d3405c] text-xs font-bold px-3 py-1 rounded-full">Option 2 : Encadrement professionnel (Partenariat Jaumana)</span>
                                <span class="text-slate-700 font-extrabold text-sm">Sécurisation &amp; suivi</span>
                            </div>
                            <p class="text-[10px] text-[#d3405c] font-semibold mb-3">
                                {{ OFFRE_INSTITUTION_JAUMANA_BELGIUM_ONLY_LABEL }}
                            </p>
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-[#d3405c]">
                                    <i class="fa-solid fa-handshake-angle text-lg" />
                                </div>
                                <h3 class="text-xl font-bold text-slate-800">
                                    Jaumana Soins : simplifier et sécuriser
                                </h3>
                            </div>
                            <p class="text-slate-600 text-sm mb-4 leading-relaxed">
                                Le partenariat <strong>InfiSwap × Jaumana Soins</strong> vous accompagne pour publier vos demandes sur la plateforme et encadrer professionnellement vos remplacements, en maison de repos comme à domicile.
                            </p>
                            <ul class="space-y-2 mb-6">
                                <li class="text-xs text-slate-600 flex items-center gap-2">
                                    <i class="fa-solid fa-check text-[#d3405c]" /> <strong>Étape 1 :</strong> convention Jaumana → publication de vos demandes sur InfiSwap
                                </li>
                                <li class="text-xs text-slate-600 flex items-center gap-2">
                                    <i class="fa-solid fa-check text-[#d3405c]" /> <strong>Étape 2 :</strong> encadrement pro. garantissant paiements, engagements des titulaires et protection anti-détournement
                                </li>
                                <li class="text-xs text-slate-600 flex items-center gap-2">
                                    <i class="fa-solid fa-check text-[#d3405c]" /> Expérience, discrétion et fiabilité au service de la continuité des soins
                                </li>
                            </ul>
                        </div>
                        <button
                            type="button"
                            class="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 rounded-lg border border-slate-100 transition-all flex items-center justify-center gap-2"
                            @click="switchTab('jaumana-premium')"
                        >
                            En savoir plus <i class="fa-solid fa-arrow-right text-xs" />
                        </button>
                    </div>
                </div>

                <!-- FOLDER -->
                <div
                    id="presentation-folder"
                    ref="presentationFolderRef"
                    class="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-4 min-h-[600px]"
                >
                    <div class="bg-slate-900 text-slate-300 p-4 border-r border-slate-800 flex flex-col justify-between">
                        <div>
                            <div class="p-3 mb-6">
                                <p class="text-[10px] text-[#46d88e] font-semibold uppercase tracking-widest">
                                    Sommaire du folder
                                </p>
                                <h2 class="text-lg font-bold text-white mt-1">
                                    Dossier de Présentation
                                </h2>
                            </div>
                            <nav class="space-y-1">
                                <button
                                    v-for="item in folderTabs"
                                    :key="item.id"
                                    type="button"
                                    class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all hover:bg-slate-800 hover:text-white"
                                    :class="tabNavClass(item.id)"
                                    @click="switchTab(item.id)"
                                >
                                    <i
                                        :class="item.icon"
                                        class="w-5 text-center"
                                    />
                                    <span>{{ item.label }}</span>
                                </button>
                            </nav>
                        </div>
                        <div class="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500">
                            <p class="font-medium text-slate-400">
                                InfiSwap SRL Belge
                            </p>
                            <p class="mt-1">
                                N° Entreprise : BE 0791.734.902
                            </p>
                        </div>
                    </div>

                    <div class="lg:col-span-3 p-6 sm:p-10 bg-white">
                        <!-- TAB: accueil -->
                        <div
                            v-show="activeTab === 'accueil'"
                            class="space-y-6"
                        >
                            <div class="border-b border-slate-100 pb-4">
                                <span class="text-xs font-semibold text-[#d3405c] uppercase tracking-wider">Partie 1</span>
                                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                    Le coût de la pénurie : sortir du piège de l'intérim classique
                                </h2>
                            </div>
                            <p
                                class="text-slate-600 leading-relaxed"
                                v-html="institutionContextLeadHtml"
                            />
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                                <div
                                    v-for="card in enjeuxCards"
                                    :key="card.title"
                                    class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3"
                                >
                                    <div class="text-[#d3405c] mt-1">
                                        <i :class="card.icon" />
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-slate-800 text-sm">
                                            {{ card.title }}
                                        </h4>
                                        <p class="text-xs text-slate-500 mt-1">
                                            {{ card.text }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="p-5 bg-[#46d88e]/10 border border-[#46d88e]/20 rounded-xl">
                                <h4 class="font-bold text-slate-900 flex items-center gap-2 mb-2">
                                    <i class="fa-solid fa-lightbulb text-[#46d88e]" /> {{ countryContent?.insightTitle }}
                                </h4>
                                <p
                                    class="text-slate-700 text-sm leading-relaxed"
                                    v-html="insightParagraphHtml"
                                />
                            </div>
                            <div class="pt-4 flex justify-end">
                                <button
                                    type="button"
                                    class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                                    @click="switchTab('reseau')"
                                >
                                    Découvrir la force des indépendantes <i class="fa-solid fa-arrow-right" />
                                </button>
                            </div>
                        </div>

                        <!-- TAB: reseau -->
                        <div
                            v-show="activeTab === 'reseau'"
                            class="space-y-6"
                        >
                            <div class="border-b border-slate-100 pb-4">
                                <span class="text-xs font-semibold text-[#46d88e] uppercase tracking-wider">Partie 2</span>
                                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                    La force et la sécurité d'un réseau d'indépendantes
                                </h2>
                            </div>
                            <p class="text-slate-600 leading-relaxed">
                                Faire appel à notre réseau d'infirmières indépendantes présente des avantages incomparables par rapport aux soignants salariés d'intérim traditionnels. C'est l'assurance d'une prestation de haute qualité, simplifiée sur le plan comptable et parfaitement en règle.
                            </p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                                <div
                                    v-for="adv in reseauAdvantages"
                                    :key="adv.title"
                                    class="p-5 border border-slate-100 bg-emerald-50/50 rounded-xl space-y-2"
                                >
                                    <h3 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                                        <i :class="adv.icon" /> {{ adv.title }}
                                    </h3>
                                    <p class="text-xs text-slate-600 leading-relaxed">
                                        {{ adv.text }}
                                    </p>
                                </div>
                            </div>
                            <div class="p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl flex flex-col md:flex-row items-center gap-6">
                                <div class="text-5xl text-[#46d88e]">
                                    <i class="fa-solid fa-users-gear animate-pulse" />
                                </div>
                                <div>
                                    <h4 class="font-extrabold text-sm uppercase text-[#46d88e] tracking-wider">
                                        {{ countryContent?.networkHighlightTitle }}
                                    </h4>
                                    <p
                                        class="text-xs text-slate-300 mt-1 leading-relaxed"
                                        v-html="networkHighlightHtml"
                                    />
                                </div>
                            </div>
                            <div class="pt-4 flex justify-between">
                                <button
                                    type="button"
                                    class="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-2"
                                    @click="switchTab('accueil')"
                                >
                                    <i class="fa-solid fa-arrow-left" /> Retour
                                </button>
                                <button
                                    type="button"
                                    class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                                    @click="switchTab('diy-infiswap')"
                                >
                                    Voir la solution Plateforme DIY <i class="fa-solid fa-arrow-right" />
                                </button>
                            </div>
                        </div>

                        <!-- TAB: diy -->
                        <div
                            v-show="activeTab === 'diy-infiswap'"
                            class="space-y-6"
                        >
                            <div class="border-b border-slate-100 pb-4">
                                <span class="text-xs font-semibold text-[#46d88e] uppercase tracking-wider">Partie 3</span>
                                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                    InfiSwap DIY : La plateforme d'autonomie
                                </h2>
                            </div>
                            <p class="text-slate-600 leading-relaxed">
                                InfiSwap est la <strong>1ère plateforme belge 100% automatisée</strong> de mise en relation directe pour remplacements d'infirmier(e)s. Pour les établissements de soins, notre modèle d'abonnement sans commission s'adapte à votre planification :
                            </p>
                            <div
                                v-if="diyPromoActive"
                                class="flex items-center gap-2 p-3 rounded-xl bg-[#d3405c]/10 border border-[#d3405c]/20 text-xs text-[#d3405c] font-semibold"
                            >
                                <i class="fa-solid fa-tags" />
                                <span>Offre promotionnelle — {{ diyPromoValidityLabel }}</span>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
                                    <span
                                        v-if="diyPromoActive"
                                        class="absolute top-3 right-3 bg-[#d3405c] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase"
                                    >Promo</span>
                                    <span
                                        v-else
                                        class="absolute top-3 right-3 bg-emerald-50 text-emerald-800 text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider"
                                    >Sans engagement</span>
                                    <h3 class="font-extrabold text-slate-900 text-sm">
                                        Abonnement Mensuel
                                    </h3>
                                    <p class="text-xs text-slate-400 mt-1">
                                        Flexibilité totale, arrêt de l'abonnement à tout moment.
                                    </p>
                                    <div class="mt-4 pb-4 border-b border-slate-100">
                                        <span class="text-3xl font-black text-slate-900">{{ diyMonthlyAmountLabel }}</span>
                                        <span class="text-xs text-slate-500">/ mois (HTVA)</span>
                                        <span
                                            v-if="diyPromoActive"
                                            class="block text-sm text-slate-400 line-through mt-1"
                                        >{{ diyFullMonthlyAmountLabel }} / mois</span>
                                    </div>
                                    <ul class="mt-4 space-y-2 text-xs text-slate-600">
                                        <li><i class="fa-solid fa-circle-check text-[#46d88e] mr-1.5" /> Facturation claire, résiliable mensuellement</li>
                                        <li><i class="fa-solid fa-circle-check text-[#46d88e] mr-1.5" /> Publication prioritaire <strong>En Haut de Liste</strong></li>
                                        <li><i class="fa-solid fa-circle-check text-[#46d88e] mr-1.5" /> Mise en relation directe et rapide avec {{ networkProfilesLabel }}</li>
                                    </ul>
                                </div>
                                <div class="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl border-2 border-[#46d88e]/40 shadow-sm relative">
                                    <span class="absolute top-3 right-3 bg-[#d3405c] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">Populaire (2 mois gratuits)</span>
                                    <span
                                        v-if="diyPromoActive"
                                        class="absolute top-9 right-3 bg-emerald-700 text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase"
                                    >Promo</span>
                                    <h3 class="font-extrabold text-slate-800 text-sm">
                                        Engagement Annuel
                                    </h3>
                                    <p class="text-xs text-slate-400 mt-1">
                                        Sécurité de remplacement à l'année au meilleur tarif.
                                    </p>
                                    <div class="mt-4 pb-4 border-b border-slate-100">
                                        <span class="text-3xl font-black text-slate-900">{{ diyYearlyAmountLabel }}</span>
                                        <span class="text-xs text-slate-500">/ an (HTVA)</span>
                                        <span
                                            v-if="diyPromoActive"
                                            class="block text-sm text-slate-400 line-through mt-1"
                                        >{{ diyFullYearlyAmountLabel }} / an</span>
                                    </div>
                                    <ul class="mt-4 space-y-2 text-xs text-slate-600">
                                        <li><i class="fa-solid fa-circle-check text-[#46d88e] mr-1.5" /> Équivaut à seulement <strong>{{ diyYearlyMonthlyEquivalentLabel }}</strong></li>
                                        <li><i class="fa-solid fa-circle-check text-[#46d88e] mr-1.5" /> 0% de commission sur les heures prestées</li>
                                        <li><i class="fa-solid fa-circle-check text-[#46d88e] mr-1.5" /> Économies massives par rapport aux agences</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="pt-4 flex justify-between">
                                <button
                                    type="button"
                                    class="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-2"
                                    @click="switchTab('reseau')"
                                >
                                    <i class="fa-solid fa-arrow-left" /> Retour
                                </button>
                                <button
                                    v-if="isBelgium"
                                    type="button"
                                    class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                                    @click="switchTab('jaumana-premium')"
                                >
                                    Découvrir le partenariat Jaumana <i class="fa-solid fa-arrow-right" />
                                </button>
                                <button
                                    v-else
                                    type="button"
                                    class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                                    @click="switchTab('simulateur-annonce')"
                                >
                                    Tester l'outil de simulation <i class="fa-solid fa-arrow-right" />
                                </button>
                            </div>
                        </div>

                        <!-- TAB: jaumana -->
                        <div
                            v-if="isBelgium"
                            v-show="activeTab === 'jaumana-premium'"
                            class="space-y-6"
                        >
                            <div class="border-b border-slate-100 pb-4">
                                <span class="text-xs font-semibold text-[#d3405c] uppercase tracking-wider">Partie 4</span>
                                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                    Partenariat InfiSwap × Jaumana Soins
                                </h2>
                                <p class="text-sm text-[#d3405c] font-semibold mt-2">
                                    {{ OFFRE_INSTITUTION_JAUMANA_BELGIUM_ONLY_LABEL }}
                                </p>
                                <p class="text-sm text-slate-500 mt-2">
                                    Pour mieux vous accompagner, pour mieux vous soutenir — des soins de qualité, sans interruption.
                                </p>
                            </div>
                            <p class="text-slate-600 leading-relaxed">
                                <strong>Jaumana Soins</strong> renforce sa collaboration avec <strong>InfiSwap</strong> pour simplifier la vie des institutions et sécuriser leurs remplacements, en <strong>maison de repos</strong> comme à <strong>domicile</strong>.
                            </p>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                                <div class="p-5 border border-slate-200 bg-white rounded-xl shadow-sm">
                                    <div class="flex items-center gap-2 mb-3">
                                        <span class="w-8 h-8 rounded-full bg-[#d3405c]/10 text-[#d3405c] flex items-center justify-center text-sm font-black">1</span>
                                        <i class="fa-solid fa-bullhorn text-[#d3405c]" />
                                        <h3 class="font-bold text-slate-900 text-sm">
                                            Publication sur InfiSwap
                                        </h3>
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed">
                                        Si votre établissement signe la <strong>convention avec Jaumana Soins</strong>, vos demandes de remplacement sont publiées pour vous sur <strong>InfiSwap</strong>.
                                    </p>
                                </div>
                                <div class="p-5 border border-[#46d88e]/30 bg-emerald-50/40 rounded-xl shadow-sm">
                                    <div class="flex items-center gap-2 mb-3">
                                        <span class="w-8 h-8 rounded-full bg-[#46d88e]/20 text-emerald-800 flex items-center justify-center text-sm font-black">2</span>
                                        <i class="fa-solid fa-shield-halved text-[#46d88e]" />
                                        <h3 class="font-bold text-slate-900 text-sm">
                                            Encadrement professionnel
                                        </h3>
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed mb-3">
                                        Si vous trouvez un remplaçant sur <strong>InfiSwap</strong> et souhaitez un encadrement professionnel qui :
                                    </p>
                                    <ul class="space-y-1.5 text-xs text-slate-700">
                                        <li><i class="fa-solid fa-circle-check text-[#46d88e] mr-1.5" /> <strong>garantit les paiements</strong></li>
                                        <li><i class="fa-solid fa-circle-check text-[#46d88e] mr-1.5" /> <strong>garantit les engagements des titulaires</strong></li>
                                        <li><i class="fa-solid fa-circle-check text-[#46d88e] mr-1.5" /> <strong>protège du détournement de patientèle</strong></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                <div
                                    v-for="value in jaumanaPartnershipValues"
                                    :key="value.title"
                                    class="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center"
                                >
                                    <i
                                        :class="value.icon"
                                        class="text-[#d3405c] text-lg mb-2 block"
                                    />
                                    <p class="text-[10px] font-bold text-slate-800 uppercase tracking-wide leading-snug">
                                        {{ value.title }}
                                    </p>
                                </div>
                            </div>
                            <div class="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <p class="text-sm font-semibold">
                                    <i class="fa-solid fa-phone text-[#46d88e] mr-2" />
                                    Contactez Jaumana Soins — nous sommes là pour vous <strong>simplifier</strong> la vie et <strong>sécuriser</strong> votre activité.
                                </p>
                                <a
                                    href="https://www.jaumana.be"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="shrink-0 bg-[#46d88e] hover:bg-[#2ebd73] text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-all text-center"
                                >
                                    www.jaumana.be
                                </a>
                            </div>
                            <div class="border-b border-slate-100 pb-2 mt-8 mb-4">
                                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conditions tarifaires institutionnelles</span>
                            </div>
                            <div class="flex flex-col md:flex-row gap-6 items-start">
                                <div class="flex-1 space-y-4">
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        Pour les établissements souhaitant déléguer la gestion administrative et la facturation, Jaumana Soins propose un encadrement intégral au taux de <strong>6&nbsp;% de la facturation globale</strong>, avec des taux horaires fixes compétitifs par rapport à l'intérim.
                                    </p>
                                    <div class="grid grid-cols-2 gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                                        <div class="text-center">
                                            <span class="text-[10px] text-slate-500 uppercase font-extrabold">Tarif Semaine</span>
                                            <div class="text-2xl font-black text-slate-900 mt-0.5">
                                                57,50 € / h
                                            </div>
                                        </div>
                                        <div class="text-center border-l border-red-200">
                                            <span class="text-[10px] text-slate-500 uppercase font-extrabold">Tarif Week-end</span>
                                            <div class="text-2xl font-black text-[#d3405c] mt-0.5">
                                                85,00 € / h
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full md:w-64 bg-slate-950 text-white p-4 rounded-xl text-center shadow-md">
                                    <span class="text-xs font-bold text-slate-400 uppercase">Tarif Jaumana</span>
                                    <div class="text-3xl font-black text-[#46d88e] mt-1">
                                        6 %
                                    </div>
                                    <p class="text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                                        de la facturation globale
                                    </p>
                                </div>
                            </div>
                            <div class="p-5 border border-slate-100 bg-slate-50 rounded-xl">
                                <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wider text-[#46d88e] mb-2">
                                    Où intervenir ?
                                </h3>
                                <p class="text-xs text-slate-600 leading-relaxed">
                                    Le partenariat couvre les <strong>remplacements à domicile</strong> et en <strong>maison de repos</strong>, pour une continuité de soins sans interruption.
                                </p>
                                <p class="border-t border-slate-200 pt-4 mt-4 text-xs text-slate-500 italic text-center">
                                    Ensemble, continuons à offrir des soins de qualité, sans interruption.
                                </p>
                            </div>
                            <div class="pt-4 flex justify-between">
                                <button
                                    type="button"
                                    class="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-2"
                                    @click="switchTab('diy-infiswap')"
                                >
                                    <i class="fa-solid fa-arrow-left" /> Retour
                                </button>
                                <button
                                    type="button"
                                    class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                                    @click="switchTab('simulateur-annonce')"
                                >
                                    Tester l'outil de simulation <i class="fa-solid fa-arrow-right" />
                                </button>
                            </div>
                        </div>

                        <!-- TAB: demo annonce -->
                        <div
                            v-show="activeTab === 'simulateur-annonce'"
                            class="space-y-6"
                        >
                            <div class="border-b border-slate-100 pb-4">
                                <span class="text-xs font-semibold text-[#46d88e] uppercase tracking-wider">Partie 5</span>
                                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                    Démo interactive : Publiez votre besoin en 30 secondes
                                </h2>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
                                <form
                                    class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3"
                                    @submit.prevent="simulateAdPublication"
                                >
                                    <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 pb-2 border-b">
                                        1. Créez votre annonce
                                    </h3>
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase">Titre du besoin</label>
                                        <input
                                            v-model="demoTitle"
                                            type="text"
                                            class="w-full mt-1 p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-[#46d88e] outline-none"
                                        >
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase">Code Postal</label>
                                            <input
                                                v-model="demoCp"
                                                type="text"
                                                class="w-full mt-1 p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-[#46d88e] outline-none"
                                            >
                                        </div>
                                        <div>
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase">Ville</label>
                                            <input
                                                v-model="demoCity"
                                                type="text"
                                                class="w-full mt-1 p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-[#46d88e] outline-none"
                                            >
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase">Date Début</label>
                                            <input
                                                v-model="demoStart"
                                                type="date"
                                                class="w-full mt-1 p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-[#46d88e] outline-none"
                                            >
                                        </div>
                                        <div>
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase">Shift de garde</label>
                                            <select
                                                v-model="demoShift"
                                                class="w-full mt-1 p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-[#46d88e] outline-none"
                                            >
                                                <option value="Matin">
                                                    Matin
                                                </option>
                                                <option value="Midi">
                                                    Midi
                                                </option>
                                                <option value="Soir">
                                                    Soir
                                                </option>
                                                <option value="Nuit">
                                                    Nuit
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        class="w-full bg-[#46d88e] hover:bg-[#2ebd73] text-slate-900 font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <i class="fa-solid fa-circle-arrow-up" /> Publier l'Annonce (Simulation)
                                    </button>
                                </form>
                                <div class="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-inner">
                                    <div
                                        class="bg-gradient-to-r from-[#d3405c]/20 to-slate-800 border-l-4 border-[#d3405c] p-3 rounded-r-md transition-all"
                                        :class="{ 'animate-pulse': adPulse }"
                                        :style="{ transform: adScale }"
                                    >
                                        <div class="flex items-center justify-between">
                                            <span class="bg-[#d3405c] text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                                                <i class="fa-solid fa-circle-arrow-up" /> TOP DE LISTE (Institutionnel)
                                            </span>
                                            <span class="text-[9px] text-slate-400">Aujourd'hui</span>
                                        </div>
                                        <h4 class="font-bold text-white text-xs mt-1">
                                            {{ demoTitle }}
                                        </h4>
                                        <div class="flex items-center gap-3 mt-1.5 text-[10px] text-slate-300">
                                            <span><i class="fa-solid fa-location-dot text-[#46d88e]" /> {{ demoCity }} ({{ demoCp }})</span>
                                            <span><i class="fa-solid fa-clock" /> {{ demoShift }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="pt-4 flex justify-between">
                                <button
                                    type="button"
                                    class="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-2"
                                    @click="switchTab(isBelgium ? 'jaumana-premium' : 'diy-infiswap')"
                                >
                                    <i class="fa-solid fa-arrow-left" /> Retour
                                </button>
                                <button
                                    type="button"
                                    class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                                    @click="switchTab('comparatif')"
                                >
                                    Consulter le comparatif <i class="fa-solid fa-arrow-right" />
                                </button>
                            </div>
                        </div>

                        <!-- TAB: comparatif -->
                        <div
                            v-show="activeTab === 'comparatif'"
                            class="space-y-6"
                        >
                            <div class="border-b border-slate-100 pb-4">
                                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Partie 6</span>
                                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                    Quelle formule convient le mieux à votre situation ?
                                </h2>
                            </div>
                            <div class="overflow-x-auto border border-slate-100 rounded-xl">
                                <table class="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr class="bg-slate-900 text-white font-bold">
                                            <th class="p-4 text-sm w-1/4">
                                                Caractéristique
                                            </th>
                                            <th
                                                class="p-4 text-sm text-[#46d88e]"
                                                :class="isBelgium ? 'w-3/8' : 'w-3/4'"
                                            >
                                                InfiSwap DIY (Abonnement)
                                            </th>
                                            <th
                                                v-if="isBelgium"
                                                class="p-4 text-sm text-[#d3405c] w-3/8"
                                            >
                                                Jaumana Soins (Encadrement pro.)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        <tr
                                            v-for="row in comparatifRows"
                                            :key="row.label"
                                            class="hover:bg-slate-50/50"
                                        >
                                            <td class="p-4 font-bold text-slate-700">
                                                {{ row.label }}
                                            </td>
                                            <td
                                                class="p-4 text-slate-800 text-xs"
                                                v-html="row.diy"
                                            />
                                            <td
                                                v-if="isBelgium"
                                                class="p-4 text-slate-800 text-xs"
                                                v-html="row.jaumana"
                                            />
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="pt-4 flex justify-between">
                                <button
                                    type="button"
                                    class="text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-2"
                                    @click="switchTab('simulateur-annonce')"
                                >
                                    <i class="fa-solid fa-arrow-left" /> Retour
                                </button>
                                <button
                                    type="button"
                                    class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
                                    @click="switchTab('contact')"
                                >
                                    Prendre contact <i class="fa-solid fa-arrow-right" />
                                </button>
                            </div>
                        </div>

                        <!-- TAB: contact -->
                        <div
                            v-show="activeTab === 'contact'"
                            class="space-y-6"
                        >
                            <div class="border-b border-slate-100 pb-4">
                                <span class="text-xs font-semibold text-[#d3405c] uppercase tracking-wider">Partie 7</span>
                                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                                    Discutons de vos besoins de remplacement
                                </h2>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="p-5 border border-slate-100 bg-slate-50 rounded-xl space-y-4">
                                    <h3 class="font-bold text-slate-800 text-base">
                                        Nos Coordonnées
                                    </h3>
                                    <ul class="space-y-3 text-xs text-slate-600">
                                        <li
                                            v-if="contact.contactName"
                                            class="flex items-center gap-2"
                                        >
                                            <i class="fa-solid fa-user text-[#46d88e] w-6 text-center" />
                                            <span>Contact : <span class="font-bold text-slate-900">{{ contact.contactName }}</span></span>
                                        </li>
                                        <li class="flex items-center gap-2">
                                            <i class="fa-solid fa-phone text-[#46d88e] w-6 text-center" />
                                            <span>Téléphone : <a
                                                :href="`tel:${contact.phoneTel}`"
                                                class="font-bold text-slate-900 hover:underline"
                                            >{{ contact.phoneDisplay }}</a></span>
                                        </li>
                                        <li class="flex items-center gap-2">
                                            <i class="fa-solid fa-envelope text-[#46d88e] w-6 text-center" />
                                            <span>E-mail : <a
                                                :href="`mailto:${contact.email}`"
                                                class="font-bold text-slate-900 hover:underline"
                                            >{{ contact.email }}</a></span>
                                        </li>
                                    </ul>
                                    <NuxtLink
                                        to="/contact"
                                        class="inline-flex bg-[#d3405c] hover:bg-[#be344f] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                                    >
                                        Formulaire de contact InfiSwap
                                    </NuxtLink>
                                </div>
                                <form
                                    class="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-3"
                                    @submit.prevent="submitContactForm"
                                >
                                    <h4 class="font-bold text-slate-800 text-sm mb-3">
                                        Demander une étude de vos besoins
                                    </h4>
                                    <input
                                        v-model="contactInstitution"
                                        type="text"
                                        placeholder="Nom de l'institution"
                                        required
                                        class="w-full p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-[#d3405c] outline-none"
                                    >
                                    <input
                                        v-model="contactEmail"
                                        type="email"
                                        placeholder="Adresse e-mail"
                                        required
                                        class="w-full p-2 border border-slate-200 rounded-md text-xs focus:ring-1 focus:ring-[#d3405c] outline-none"
                                    >
                                    <div
                                        v-if="contactAlert"
                                        class="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-xs text-center"
                                    >
                                        <i class="fa-solid fa-circle-check mr-1" /> {{ contactSuccessMessage }}
                                    </div>
                                    <div
                                        v-if="contactError"
                                        class="p-3 bg-red-50 text-red-800 border border-red-100 rounded-lg text-xs text-center"
                                    >
                                        <i class="fa-solid fa-circle-exclamation mr-1" /> {{ contactError }}
                                    </div>
                                    <button
                                        type="submit"
                                        class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                        :disabled="contactSubmitting"
                                    >
                                        {{ contactSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande' }}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SIMULATEUR -->
                <section
                    id="simulateur"
                    ref="simulateurRef"
                    class="mt-16 bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 max-w-4xl mx-auto"
                >
                    <div class="text-center max-w-xl mx-auto mb-8">
                        <span class="text-[10px] font-extrabold text-[#d3405c] uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full">Comparateur budgétaire interactif</span>
                        <h2 class="text-2xl font-bold text-slate-900 mt-2">
                            Intérim classique à 100€/h vs Solution d'Indépendantes
                        </h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div class="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Nombre d'heures de remplacement / mois :</label>
                                <input
                                    v-model.number="calcHours"
                                    type="range"
                                    min="10"
                                    max="300"
                                    class="w-full accent-[#46d88e]"
                                >
                                <div class="flex justify-between text-xs text-slate-500 font-semibold mt-1">
                                    <span>10h</span>
                                    <span class="text-slate-900 bg-white border border-slate-200 px-2.5 py-0.5 rounded shadow-sm">{{ calcHours }} heures</span>
                                    <span>300h</span>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Répartition des heures (Semaine vs Week-end) :</label>
                                <input
                                    v-model.number="calcWeekPct"
                                    type="range"
                                    min="0"
                                    max="100"
                                    class="w-full accent-[#d3405c]"
                                >
                                <div class="flex justify-between text-xs text-slate-500 font-semibold mt-1">
                                    <span>{{ calcWeekendPct }}% Week-end</span>
                                    <span class="text-slate-900 bg-white border border-slate-200 px-2.5 py-0.5 rounded shadow-sm">{{ calcWeekPct }}% Semaine</span>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tarif direct moyen de l'indépendante (DIY) :</label>
                                <select
                                    v-model.number="calcIndieRate"
                                    class="w-full p-2 border border-slate-200 bg-white rounded-md text-xs font-semibold focus:ring-1 focus:ring-[#46d88e] outline-none"
                                >
                                    <option :value="40">
                                        Économique : 40,00 € / heure
                                    </option>
                                    <option :value="45">
                                        Standard recommandé : 45,00 € / heure
                                    </option>
                                    <option :value="50">
                                        Spécialisé : 50,00 € / heure
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[280px]">
                            <div>
                                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <span class="w-2 h-2 rounded-full bg-[#46d88e]" /> Votre économie mensuelle moyenne (DIY)
                                </p>
                                <div class="text-4xl font-extrabold text-white mt-1">
                                    {{ formatEur(savingsDiy) }}
                                </div>
                                <p class="text-xs text-slate-400 mt-1">
                                    comparé à un coût d'intérim classique à <strong class="text-white">100 € / h</strong>.
                                </p>
                            </div>
                            <div class="border-t border-slate-800 pt-4 mt-6 space-y-3 text-xs">
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400"><i class="fa-solid fa-triangle-exclamation text-amber-500 mr-1.5" /> Intérim classique (100€/h) :</span>
                                    <span class="font-extrabold text-slate-200 font-mono">{{ formatEur(totalInterimCost) }}</span>
                                </div>
                                <div
                                    v-if="isBelgium"
                                    class="flex justify-between items-center"
                                >
                                    <span class="text-slate-400"><i class="fa-solid fa-handshake-angle text-[#d3405c] mr-1.5" /> Jaumana — Encadrement pro. (6% inc.) :</span>
                                    <span class="font-extrabold text-slate-200 font-mono">{{ formatEur(totalJaumanaCost) }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400"><i class="fa-solid fa-laptop-code text-[#46d88e] mr-1.5" /> InfiSwap DIY (Honoraires + Abo) :</span>
                                    <span class="font-extrabold text-[#46d88e] font-mono">{{ formatEur(totalDiyCost) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <!-- FOOTER -->
            <footer class="bg-slate-900 text-slate-400 py-12 mt-20 border-t border-slate-800">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div class="space-y-4">
                        <NuxtLink
                            to="/"
                            class="text-2xl font-extrabold tracking-tight text-white"
                        >
                            infi<span class="text-[#d3405c]">Swap</span>
                        </NuxtLink>
                        <p class="text-xs text-slate-500 leading-relaxed">
                            {{ countryContent?.footerTagline }}
                        </p>
                    </div>
                    <div>
                        <h4 class="font-bold text-white text-xs uppercase tracking-widest mb-4">
                            Pour les Institutions
                        </h4>
                        <ul class="space-y-2 text-xs">
                            <li>
                                <button
                                    type="button"
                                    class="hover:text-white transition-all"
                                    @click="switchTab('diy-infiswap')"
                                >
                                    Formule DIY Platform ({{ diyMonthlyPrice }}€)
                                </button>
                            </li>
                            <li v-if="isBelgium">
                                <button
                                    type="button"
                                    class="hover:text-white transition-all"
                                    @click="switchTab('jaumana-premium')"
                                >
                                    Partenariat Jaumana Soins
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    class="hover:text-white transition-all"
                                    @click="scrollTo('simulateur')"
                                >
                                    Calculateur d'économies
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold text-white text-xs uppercase tracking-widest mb-4">
                            Pour les Indépendants
                        </h4>
                        <ul class="space-y-2 text-xs">
                            <li>
                                <NuxtLink
                                    to="/register"
                                    class="hover:text-white transition-all"
                                >
                                    S'inscrire
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/dashboard/replacements"
                                    class="hover:text-white transition-all"
                                >
                                    Chercher un remplacement
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold text-white text-xs uppercase tracking-widest mb-4">
                            Contact & Légal
                        </h4>
                        <ul class="space-y-2 text-xs">
                            <li>
                                <NuxtLink
                                    to="/contact"
                                    class="hover:text-white transition-all"
                                >
                                    Nous contacter
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink
                                    to="/legal-notice"
                                    class="hover:text-white transition-all"
                                >
                                    Mentions Légales
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-600">
                    <p>© {{ currentYear }} InfiSwap. Tous droits réservés. {{ countryContent?.footerCopyright }}</p>
                </div>
            </footer>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { OffreInstitutionContact } from '~/lib/offreInstitutionContacts';
import type { OffreInstitutionCountry } from '~/lib/offreInstitutionCountry';
import {
    formatOffreInstitutionNetworkCount,
    getOffreInstitutionCountryContent,
    getOffreInstitutionNetworkMembersLabel,
    getOffreInstitutionNetworkProfilesLabel,
    interpolateOffreInstitutionContent,
    OFFRE_INSTITUTION_JAUMANA_BELGIUM_ONLY_LABEL,
} from '~/lib/offreInstitutionContent';
import {
    formatInstitutionDiyMonthlyLabel,
    formatInstitutionDiyYearlyLabel,
    INSTITUTION_DIY_FULL_MONTHLY,
    INSTITUTION_DIY_FULL_YEARLY,
} from '~/lib/offreInstitutionPricing';
import { submitInstitutionOfferStudy } from '~/composables/useContact';
import OffreInstitutionCountryModal from '~/components/offre-institution/OffreInstitutionCountryModal.vue';

type TabId = 'accueil' | 'reseau' | 'diy-infiswap' | 'jaumana-premium' | 'simulateur-annonce' | 'comparatif' | 'contact';

const props = defineProps<{
    contact: OffreInstitutionContact;
}>();

const {
    diyPromoActive,
    diyPromoValidityLabel,
    diyMonthlyPrice,
    diyYearlyPrice,
    calcDiyPlan,
    diyMonthlyLabel,
    diyFullMonthlyLabel,
    diyYearlyShortLabel,
    diyFullYearlyShortLabel,
    diyMonthlyAmountLabel,
    diyFullMonthlyAmountLabel,
    diyYearlyAmountLabel,
    diyFullYearlyAmountLabel,
    diyYearlyMonthlyEquivalentLabel,
} = useInstitutionDiyPricing();

const {
    selectedCountry,
    showCountryModal,
    hasSelectedCountry,
    isBelgium,
    isFrance,
    setCountry,
} = useOffreInstitutionCountry();

const activeTab = ref<TabId>('accueil');
const presentationFolderRef = ref<HTMLElement | null>(null);
const simulateurRef = ref<HTMLElement | null>(null);

const demoTitle = ref('Remplacement urgent - Infirmière de nuit');
const demoCp = ref('7130');
const demoCity = ref('Binche');
const demoStart = ref('');
const demoShift = ref('Nuit');
const adPulse = ref(true);
const adScale = ref('scale(1)');

const contactInstitution = ref('');
const contactEmail = ref('');
const contactAlert = ref(false);
const contactSubmitting = ref(false);
const contactError = ref('');

const contactSuccessMessage = computed(() =>
    props.contact.contactName
        ? `Demande reçue ! ${props.contact.contactName} vous contactera dans les 24h ouvrables.`
        : 'Demande reçue ! L\'équipe d\'InfiSwap vous contactera dans les 24h ouvrables.',
);

const calcHours = ref(80);
const calcWeekPct = ref(75);
const calcIndieRate = ref(45);

const currentYear = new Date().getFullYear();

const contentInterpolationValues = computed(() => ({
    networkMembers: getOffreInstitutionNetworkMembersLabel(),
    networkCountShort: `${formatOffreInstitutionNetworkCount()}+`,
    diyMonthlyLabel: diyMonthlyLabel.value,
}));

const countryContent = computed(() => {
    if (!selectedCountry.value) {
        return null;
    }

    return getOffreInstitutionCountryContent(selectedCountry.value);
});

function interpolateCountryContent(template: string): string {
    return interpolateOffreInstitutionContent(template, contentInterpolationValues.value);
}

const heroDescriptionHtml = computed(() =>
    countryContent.value ? interpolateCountryContent(countryContent.value.heroDescription) : '',
);

const institutionContextLeadHtml = computed(() =>
    countryContent.value ? countryContent.value.institutionContextLead : '',
);

const insightParagraphHtml = computed(() =>
    countryContent.value ? interpolateCountryContent(countryContent.value.insightParagraph) : '',
);

const networkHighlightHtml = computed(() =>
    countryContent.value ? interpolateCountryContent(countryContent.value.networkHighlight) : '',
);

const diyCommunityLabel = computed(() =>
    countryContent.value ? interpolateCountryContent(countryContent.value.diyCommunityLabel) : '',
);

const networkProfilesLabel = computed(() => getOffreInstitutionNetworkProfilesLabel());

const allFolderTabs = [
    { id: 'accueil' as TabId, label: '1. Contexte & Enjeux', icon: 'fa-solid fa-circle-info' },
    { id: 'reseau' as TabId, label: '2. Force des Indépendantes', icon: 'fa-solid fa-users' },
    { id: 'diy-infiswap' as TabId, label: '3. Formule InfiSwap (DIY)', icon: 'fa-solid fa-laptop-code' },
    { id: 'jaumana-premium' as TabId, label: '4. Partenariat Jaumana Soins', icon: 'fa-solid fa-handshake-angle', belgiumOnly: true },
    { id: 'simulateur-annonce' as TabId, label: '5. Démo : Publier un besoin', icon: 'fa-solid fa-mobile-screen-button' },
    { id: 'comparatif' as TabId, label: '6. Tableau Comparatif', icon: 'fa-solid fa-scale-balanced' },
    { id: 'contact' as TabId, label: '7. Prendre Contact', icon: 'fa-solid fa-paper-plane' },
];

const folderTabs = computed(() =>
    allFolderTabs.filter(tab => !tab.belgiumOnly || isBelgium.value),
);

const enjeuxCards = [
    { icon: 'fa-solid fa-euro-sign text-lg', title: 'Le piège des 100 € / heure', text: 'Les agences d\'intérim facturent des marges colossales sans valoriser le travail réel des soignants.' },
    { icon: 'fa-solid fa-clock-rotate-left text-lg', title: 'Absence de continuité', text: 'Chaque jour amène un nouvel intérimaire qu\'il faut reformer, déstabilisant les résidents de la maison de repos.' },
    { icon: 'fa-solid fa-file-shield text-lg', title: 'Risque juridique et de détournement', text: 'Aucune garantie contre le détournement de patientèle ou le manque de rigueur administrative.' },
    { icon: 'fa-solid fa-heart-crack text-lg', title: 'Motivation variable', text: 'Les statuts précaires des intérimaires nuisent parfois à leur engagement de long terme au sein de votre établissement.' },
];

const jaumanaPartnershipValues = [
    { icon: 'fa-solid fa-user-nurse', title: 'Expérience et autonomie' },
    { icon: 'fa-solid fa-heart-pulse', title: 'Respect et écoute des patients' },
    { icon: 'fa-solid fa-user-shield', title: 'Discrétion et fiabilité' },
    { icon: 'fa-solid fa-house-medical', title: 'Domicile et maison de repos' },
];

const reseauAdvantages = [
    { icon: 'fa-solid fa-medal text-emerald-600', title: 'Responsabilisation & Engagement', text: 'Les infirmières indépendantes gèrent leur propre patientèle et leur réputation professionnelle. Contrairement à l\'intérim, elles ont à cœur de fournir un travail rigoureux, professionnel, ponctuel et de s\'intégrer harmonieusement à vos équipes existantes.' },
    { icon: 'fa-solid fa-hand-holding-dollar text-emerald-600', title: 'Zéro charge sociale / patronale (ONSS)', text: 'Finies les déclarations Dimona complexes, les calculs d\'ancienneté ou les provisions pour congés payés. Vous réglez une facture de prestation claire et nette.' },
    { icon: 'fa-solid fa-rotate text-emerald-600', title: 'Continuité humaine des soins', text: 'Nous privilégions des collaborations régulières. L\'indépendante qui connaît votre maison de repos et ses résidents reviendra sur vos prochains shifts.' },
    { icon: 'fa-solid fa-shield-halved text-emerald-600', title: 'Cadre juridique de non-détournement', text: 'Toutes les collaborations sont protégées par un cadre réglementaire strict interdisant tout détournement de patientèle.' },
];

const comparatifRows = computed(() => {
    const monthly = formatInstitutionDiyMonthlyLabel(diyMonthlyPrice.value);
    const yearly = formatInstitutionDiyYearlyLabel(diyYearlyPrice.value);
    const fullMonthly = formatInstitutionDiyMonthlyLabel(INSTITUTION_DIY_FULL_MONTHLY);
    const fullYearly = formatInstitutionDiyYearlyLabel(INSTITUTION_DIY_FULL_YEARLY);

    const diyMonthlyTarif = diyPromoActive.value
        ? `<span class="text-slate-900 font-bold block">Tarif promo : ${monthly}</span><span class="text-slate-400 line-through block text-[10px]">${fullMonthly}</span><span class="text-emerald-600 block text-[10px] font-semibold">0% Commission Horaire</span>`
        : `<span class="text-slate-900 font-bold block">Tarif Standard : ${monthly}</span><span class="text-emerald-600 block text-[10px] font-semibold">0% Commission Horaire</span>`;

    const diyYearlyTarif = diyPromoActive.value
        ? `<span class="text-[#46d88e] font-extrabold block">${yearly} <span class="text-slate-400 font-normal text-[10px]">(2 mois gratuits offerts)</span></span><span class="text-slate-400 line-through block text-[10px]">${fullYearly}</span>`
        : `<span class="text-[#46d88e] font-extrabold block">${yearly} <span class="text-slate-400 font-normal text-[10px]">(2 mois gratuits offerts)</span></span>`;

    return [
        {
            label: 'Tarif / Commissions',
            diy: diyMonthlyTarif,
            jaumana: '<span class="block text-slate-900">57,50 € / h (Semaine)</span><span class="block text-[#d3405c]">85,00 € / h (Week-end)</span><span class="text-slate-400 block text-[10px] font-normal">+ 6 % de commission — encadrement professionnel</span>',
        },
        {
            label: 'Tarif Annuel (Engagement)',
            diy: diyYearlyTarif,
            jaumana: 'Non applicable (convention Jaumana)',
        },
        {
            label: 'Méthode de recherche',
            diy: 'Vous postez vos besoins de façon autonome sur InfiSwap.',
            jaumana: 'Convention Jaumana : vos demandes sont publiées pour vous sur InfiSwap.',
        },
        {
            label: 'Accès Réseau',
            diy: countryContent.value?.comparatifNetworkLabel ?? 'Réseau d\'entraide InfiSwap.',
            jaumana: 'Remplaçants trouvés sur InfiSwap, encadrés par Jaumana Soins.',
        },
        {
            label: 'Priorité des annonces',
            diy: '<span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold"><i class="fa-solid fa-star"></i> Top de Liste</span>',
            jaumana: '<span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold"><i class="fa-solid fa-star"></i> Publication InfiSwap + encadrement pro.</span>',
        },
        {
            label: 'Sécurité administrative & juridique',
            diy: 'Gérée par vous via la plateforme de mise en relation directe.',
            jaumana: 'Paiements garantis, engagements des titulaires garantis, protection anti-détournement.',
        },
    ];
});

const calcWeekendPct = computed(() => 100 - calcWeekPct.value);

const totalInterimCost = computed(() => calcHours.value * 100);

const totalJaumanaCost = computed(() => {
    const hoursWeek = (calcHours.value * calcWeekPct.value) / 100;
    const hoursWeekend = (calcHours.value * calcWeekendPct.value) / 100;
    const base = hoursWeek * 57.5 + hoursWeekend * 85;
    return base * 1.06;
});

const totalDiyCost = computed(() => calcHours.value * calcIndieRate.value + calcDiyPlan.value);

const savingsDiy = computed(() => Math.max(0, totalInterimCost.value - totalDiyCost.value));

const eurFormatter = new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' });

function formatEur(value: number) {
    return eurFormatter.format(value);
}

function handleCountrySelect(country: OffreInstitutionCountry) {
    setCountry(country);

    if (country === 'fr' && activeTab.value === 'jaumana-premium') {
        activeTab.value = 'accueil';
    }
}

function tabNavClass(tabId: TabId) {
    return activeTab.value === tabId
        ? 'bg-slate-800 text-white border-l-4 border-[#46d88e]'
        : 'text-slate-300';
}

function switchTab(tabId: TabId) {
    activeTab.value = tabId;
    if (import.meta.client && window.innerWidth < 1024 && presentationFolderRef.value) {
        presentationFolderRef.value.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollTo(id: string) {
    if (!import.meta.client) return;
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
}

function simulateAdPublication() {
    adPulse.value = false;
    adScale.value = 'scale(1.03)';
    setTimeout(() => {
        adScale.value = 'scale(1)';
    }, 300);
}

async function submitContactForm() {
    contactError.value = '';
    contactSubmitting.value = true;

    try {
        await submitInstitutionOfferStudy({
            institutionName: contactInstitution.value,
            email: contactEmail.value,
            repId: props.contact.repId,
        });
        contactAlert.value = true;
        contactInstitution.value = '';
        contactEmail.value = '';
        setTimeout(() => {
            contactAlert.value = false;
        }, 5000);
    }
    catch {
        contactError.value = 'Impossible d\'envoyer votre demande. Veuillez réessayer ou nous contacter par téléphone.';
    }
    finally {
        contactSubmitting.value = false;
    }
}

onMounted(() => {
    const today = new Date();
    demoStart.value = today.toISOString().slice(0, 10);
});
</script>

<style scoped>
.offre-institution {
    font-family: 'Plus Jakarta Sans', Poppins, sans-serif;
}

.offre-institution ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.offre-institution ::-webkit-scrollbar-track {
    background: #f1f5f9;
}

.offre-institution ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

.offre-institution ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
