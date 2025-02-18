<template>
    <NuxtLayout name="guest">
      <template #title>
        Mon <strong>Planning</strong>
      </template>
      <template #logo>
        <LayoutsLogo class="w-64 sm:w-80 md:w-96" />
      </template>
    </NuxtLayout>
  
    <!-- Section Hero -->
    <section class="flex flex-col lg:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-10 sm:py-16 bg-pink-100">
      <div class="w-full lg:w-1/2">
        <img 
          src="../assets/images/home/black_nurse.png" 
          alt="Infirmier en action" 
          class="w-full h-auto rounded-xl shadow-lg"
        />
      </div>
      <div class="w-full lg:w-1/2 text-center lg:text-left">
        <h2 class="text-3xl sm:text-4xl font-bold text-red-500">Le module "Planning"</h2>
        <p class="text-gray-700 mt-4 leading-relaxed">
          Offre une solution en ligne intuitive pour les bureaux de tarification et les infirmiers indépendants,
          simplifiant la gestion des tournées et des agences. Accessible depuis un PC ou un smartphone,
          ce module garantit une organisation efficace, où que vous soyez.
        </p>
        <button class="mt-6 bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition">
          Contactez-nous
        </button>
      </div>
    </section>
  
    <!-- Section Fonctionnalités -->
    <section class="container mx-auto max-w-screen-lg py-10 sm:py-16 px-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-10">
        <!-- Colonne gauche avec ligne et texte -->
        <div class="lg:col-span-2">
          <h3 class="text-2xl sm:text-3xl font-bold text-red-500 mb-6 sm:mb-8">Fonctionnalités clés du Module "Planning"</h3>
          <div class="relative border-l-4 border-red-500 pl-6 space-y-8">
            <div>
              <h4 class="text-lg sm:text-xl font-semibold text-red-500">Création et gestion des tournées</h4>
              <p class="text-gray-700 mt-2">Planifiez vos tournées selon vos plages horaires et optimisez les déplacements en ajoutant les détails des visites.</p>
            </div>
            <div>
              <h4 class="text-lg sm:text-xl font-semibold text-red-500">Tableau de bord interactif</h4>
              <p class="text-gray-700 mt-2">Visualisez l'ensemble des tournées et accédez aux informations des patients en un clic.</p>
            </div>
            <div>
              <h4 class="text-lg sm:text-xl font-semibold text-red-500">Agenda synchronisé et mobile-friendly</h4>
              <p class="text-gray-700 mt-2">Synchronisez vos tournées avec un agenda personnel pour y accéder en permanence sur PC et mobile.</p>
            </div>
            <div>
              <h4 class="text-lg sm:text-xl font-semibold text-red-500">Personnalisation avancée</h4>
              <p class="text-gray-700 mt-2">Paramétrez chaque tournée selon vos besoins et dupliquez les tournées récurrentes.</p>
            </div>
            <div>
              <h4 class="text-lg sm:text-xl font-semibold text-red-500">Collaboration fluide</h4>
              <p class="text-gray-700 mt-2">Partagez les plannings avec votre équipe et assurez une meilleure coordination.</p>
            </div>
          </div>
        </div>
  
        <!-- Colonne droite avec images et texte -->
        <div class="flex flex-col items-center space-y-6">
          <img src="../assets/images/home/bon_infirmier.jpg" alt="Infirmière avec tablette" class="rounded-lg shadow-md w-full h-auto">
          <div class="bg-red-500 text-white p-3 rounded-t-lg text-center shadow-md w-full">
            <h4 class="text-lg font-semibold">SUCCESS</h4>
          </div>
          <div class="bg-white rounded-b-lg text-center shadow-md w-full p-4">
            <p class="text-gray-800 text-sm sm:text-base">
              Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
              Vous pouvez vous désabonner à tout moment.
              Pour en savoir plus sur notre <span class="text-red-500 font-semibold cursor-pointer hover:underline">politique de protection des données</span>.
            </p>
            <button class="mt-4 px-5 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition">
              En savoir plus
            </button>
          </div>
          <img src="../assets/images/home/cc62cd9.png" alt="Aide-soignante avec patient" class="rounded-lg shadow-md w-full h-auto">
        </div>
      </div>
    </section>
  
    <!-- Section CTA -->
    <section class="bg-red-500 text-white text-center py-6 px-6">
      <h3 class="text-xl sm:text-2xl font-bold">Avantages pour les Infirmiers et Bureaux de Tarification</h3>
    </section>
  
    <section class="bg-red-500 text-white text-center py-6 px-6 mt-4">
      <h3 class="text-xl sm:text-2xl font-bold">Un Outil Moderne et Performent au Service des Soins</h3>
    </section>
  
    <section class="bg-red-500 text-white text-center py-6 px-6 mt-4 mb-5">
      <h3 class="text-xl sm:text-2xl font-bold">Simplifiez vos tournées, restez connectés</h3>
      <p class="mt-2">et offrez un service optimal grâce au module "Planning", disponible partout, à tout moment.</p>
    </section>
  </template>
  
  <script lang="ts" setup>
  useHead({
    title: 'Mon planning',
  });
  </script>
  