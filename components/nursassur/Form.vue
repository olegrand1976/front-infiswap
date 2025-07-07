<template>
    <div class="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow duration-300 max-w-md mx-auto">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-800 text-center">
                Demande de renseignements
            </h2>
            <p class="text-xs text-gray-500 text-center mt-1">
                NursAssur Concierge
            </p>
        </div>

        <form
            action="mailto:o.legrand@ll-it-sc.be?subject=NURSASSUR%20-%20CONTACT"
            method="post"
            enctype="text/plain"
            class="p-6 space-y-5"
        >
            <div class="space-y-1">
                <label
                    for="sujet"
                    class="block text-sm font-medium text-gray-700"
                >
                    Sujet souhaité :
                </label>
                <div class="relative">
                    <select
                        id="sujet"
                        name="Sujet"
                        class="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                    >
                        <option class="hover:bg-blue-50">
                            Véhicule
                        </option>
                        <option>Maison</option>
                        <option>Assurances</option>
                        <option>Professionnelles</option>
                        <option>Épargne</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg
                            class="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="space-y-1">
                <label
                    for="commentaire"
                    class="block text-sm font-medium text-gray-700"
                >
                    Commentaire :
                </label>
                <textarea
                    id="commentaire"
                    name="Commentaire"
                    rows="4"
                    class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                    placeholder="Décrivez votre demande en détails..."
                ></textarea>
            </div>

            <div class="pt-2">
                <button
                    type="submit"
                    class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-xs hover:shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 active:scale-95"
                >
                    Envoyer la demande
                </button>
            </div>
        </form>
    </div>
</template>
