<template>
    <NuxtLayout name="guest">
        <template #title> Mon <strong>Planning</strong> </template>
        <template #logo>
            <LayoutsLogo class="w-96 md:w-80" />
        </template>
    </NuxtLayout>

    <!-- Section Hero -->
    <section class="flex flex-col md:flex-row items-center justify-between gap-10 px-5 py-10 md:px-10 md:py-16">
        <div class="md:w-1/2">
            <img src="../assets/images/home/online_medical.webp" alt="Infirmier en action"
                class="w-full h-auto rounded-xl shadow-lg" />
        </div>
        <div class="md:w-1/2 text-left">
            <h2 class="text-3xl sm:text-4xl font-bold text-red-500">Le module "Planning"</h2>
            <h2 class="text-3xl sm:text-4xl text-red-500">de notre plateforme</h2>
            <h2 class="text-xl sm:text-2xl mt-3">Offre une solution en ligne intuitive</h2>

            <p class="text-gray-700 mt-4 leading-relaxed">
                Offre une solution en ligne intuitive pour les bureaux de tarification
                et les infirmiers indépendants, simplifiant la gestion des tournées et
                des agences. Accessible depuis un PC ou un smartphone, ce module
                garantit une organisation efficace, où que vous soyez.
            </p>
            <button class="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-600 transition">
                Contactez-nous
            </button>
        </div>
    </section>

    <section class="container mx-auto py-16 px-6">
        <div class="flex flex-col md:flex-row gap-10 items-stretch">
            <!-- Colonne gauche avec ligne et texte -->
            <div class="w-full md:w-2/3 flex flex-col justify-between">
                <h3 class="text-2xl sm:text-3xl font-bold text-red-500 ml-5 sm:ml-20">
                    Fonctionnalités clés
                </h3>

                <h3 class="text-2xl sm:text-3xl text-red-500 ml-5 sm:ml-20 mb-4">
                    du Module "Planning"
                </h3>

                <div class="relative flex justify-center space-x-12 sm:space-x-16">
                    <!-- Barre verticale avec flex pour centrer les points -->
                    <div class="relative flex flex-col items-center w-1 bg-red-500 rounded-full h-full">
                        <!-- Points rouges alignés au centre -->
                        <div class="absolute top-1/6 w-6 h-6 bg-red-500 rounded-full"></div>
                        <div class="absolute top-1/4 w-6 h-6 bg-red-500 rounded-full"></div>
                        <div class="absolute top-1/2 w-6 h-6 bg-red-500 rounded-full -translate-y-1/2"></div>
                        <div class="absolute top-2/3 w-6 h-6 bg-red-500 rounded-full"></div>
                        <div class="absolute top-4/2 w-6 h-6 bg-red-500 rounded-full"></div>
                    </div>

                    <!-- Conteneur des éléments -->
                    <div class="space-y-10 sm:space-y-20 pl-5 sm:pl-10">
                        <!-- Élément 1 -->
                        <div class="relative bg-pink-100 p-6 sm:p-8 rounded-lg shadow-md">
                            <h4 class="text-lg sm:text-xl font-semibold text-red-500">Création et gestion des tournées</h4>
                            <p class="text-gray-700 mt-2">Planifiez vos tournées selon vos plages horaires et optimisez
                                les déplacements en ajoutant les détails des visites.</p>
                        </div>

                        <!-- Élément 2 -->
                        <div class="relative bg-pink-100 p-6 sm:p-8 rounded-lg shadow-md">
                            <h4 class="text-lg sm:text-xl font-semibold text-red-500">Tableau de bord interactif</h4>
                            <p class="text-gray-700 mt-2">Visualisez l'ensemble des tournées et accédez aux informations des patients en un clic.</p>
                        </div>

                        <!-- Élément 3 -->
                        <div class="relative bg-pink-100 p-6 sm:p-8 rounded-lg shadow-md">
                            <h4 class="text-lg sm:text-xl font-semibold text-red-500">Agenda synchronisé et mobile-friendly</h4>
                            <p class="text-gray-700 mt-2">Synchronisez vos tournées avec un agenda personnel pour y accéder en permanence sur PC et mobile.</p>
                        </div>

                        <!-- Élément 4 -->
                        <div class="relative bg-pink-100 p-6 sm:p-8 rounded-lg shadow-md">
                            <h4 class="text-lg sm:text-xl font-semibold text-red-500">Personnalisation avancée</h4>
                            <p class="text-gray-700 mt-2">Paramétrez chaque tournée selon vos besoins et dupliquez les tournées récurrentes.</p>
                        </div>

                        <!-- Élément 5 -->
                        <div class="relative bg-pink-100 p-6 sm:p-8 rounded-lg shadow-md">
                            <h4 class="text-lg sm:text-xl font-semibold text-red-500">Collaboration fluide</h4>
                            <p class="text-gray-700 mt-2">Partagez les plannings avec votre équipe et assurez une meilleure coordination.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Colonne droite avec images et texte -->
            <div class="w-full md:w-1/3 flex flex-col items-center space-y-6 min-h-full">
                <img src="../assets/images/home/bon_infirmier.jpg" alt="Infirmière avec tablette"
                    class="rounded-lg shadow-md w-full h-auto" />
                <div class="bg-red-500 text-white p-3 rounded-t-lg text-center shadow-md w-full">
                    <h4 class="text-lg font-semibold">SUCCESS</h4>
                </div>
                <div class="bg-white rounded-b-lg text-center shadow-md w-full">
                    <p class="text-gray-800">
                        Inscrivez-vous à notre newsletter<br />
                        pour recevoir nos futures communications.<br />
                        Vous pouvez vous désabonner à tout moment.<br />
                        Pour en savoir plus sur notre<br />
                        politique de protection des données
                        <span class="text-red-500 font-semibold cursor-pointer hover:underline">cliquez ici</span>.
                    </p>
                    <button
                        class="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition">
                        En savoir plus
                    </button>
                </div>
                <img src="../assets/images/home/cc62cd9.png" alt="Aide-soignante avec patient"
                    class="rounded-lg shadow-md w-full h-auto" />
            </div>
        </div>
    </section>

    <section class="bg-red-500 text-white text-center py-4 px-6 max-w-7xl mx-auto">
        <h3 class="text-2xl sm:text-3xl font-bold">
            Avantages pour les Infirmiers et Bureaux de Tarification
        </h3>
    </section>

    <section class="bg-red-500 text-white text-center py-4 px-4 mt-4 max-w-7xl mx-auto">
        <h3 class="text-2xl sm:text-3xl font-bold">
            Un Outil Moderne et Performant au Service des Soins
        </h3>
    </section>

    <section class="bg-red-500 text-white text-center py-6 px-6 mt-4 mb-5 max-w-7xl mx-auto">
        <h3 class="text-2xl sm:text-3xl font-bold">
            Simplifiez vos tournées, restez connectés
        </h3>
        <p class="mt-2">
            et offrez un service optimal grâce au module "Planning", disponible
            partout, à tout moment.
        </p>
    </section>
</template>
