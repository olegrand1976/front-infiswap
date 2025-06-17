<template>
    <div class="bg-white py-12">
        <div class="container">
            <div>
                <h1 class="text-[#cc0033] font-semibold text-xl lg:text-2xl">
                    Formulaire d'information rapide ici,
                </h1>
                <p class="text-gray-700 text-sm">
                    nous vous contacterons rapidement pour connaître vos désidératas.
                </p>
            </div>
            <div class="bg-white rounded-[30px] shadow-xl flex flex-col md:flex-row w-full overflow-hidden relative">
                <div class="w-full md:w-3/4 p-8 space-y-6 z-10">
                    <form class="space-y-4">
                        <input type="text" placeholder="Name *" class="w-full border border-gray-300 rounded text-sm py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-[#cc0033]" />
                        <input type="email" placeholder="Email" class="w-full border border-gray-300 rounded text-sm py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-[#cc0033]" />
                        <input type="text" placeholder="Phone number *" class="w-full border border-gray-300 rounded text-sm py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-[#cc0033]" />
                        <textarea placeholder="Commentaire*" rows="4" class="w-full border border-gray-300 rounded text-sm p-2 focus:outline-none focus:ring-2 focus:ring-[#cc0033]"></textarea>

                        <div class="flex items-center space-x-2 text-xs text-gray-400">
                            <input type="checkbox" id="remember" />
                            <label for="remember">Enregistrer mon nom, mon email et mon site dans le navigateur pour mes prochains commentaires.</label>
                        </div>

                        <div class="border border-gray-300 rounded px-6 py-4 w-full">
                            <input type="checkbox" id="captcha" />
                            <label for="captcha" class="ml-2 text-sm">I’m not a robot</label>
                        </div>

                        <div class="w-full">
                            <Button
                                type="submit"
                                class="bg-primary text-white px-6 py-3 rounded font-semibold text-sm w-full">
                                CRÉER MA PAGE MAINTENANT
                            </Button>
                        </div>
                    </form>
                </div>

                <div class="hidden md:block w-1/4 bg-primary relative z-0"></div>

                <div class="absolute inset-y-0 left-3/4 transform -translate-x-1/2 flex items-center justify-center z-20">
                    <LayoutsAppImage
                        src="/home/rocket.png"
                        alt="Rocket"
                        class="w-[400px] h-[400px] object-contain"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
