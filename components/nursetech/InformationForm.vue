<template>
    <div class="min-h-screen bg-white flex items-center justify-center p-6">
        <div class="bg-white rounded-[30px] shadow-xl flex flex-col md:flex-row w-full max-w-6xl overflow-hidden">
            <div class="w-full md:w-3/4 p-8 space-y-6">
                <h1 class="text-[#cc0033] font-semibold">
                    Formulaire d'information rapide ici,
                </h1>
                <p class="text-gray-700 text-sm">
                    nous vous contacterons rapidement pour connaître vos désidératas.
                </p>

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
                            class="bg-primary text-white px-6 py-3 rounded font-semibold text-sm w-full"
                        >
                            CRÉER MA PAGE MAINTENANT
                        </Button>
                    </div>
                </form>
            </div>

            <div class="w-full md:w-1/4 bg-primary relative flex items-center justify-center p-8">
                <div class="relative w-[300px] h-[300px] -translate-x-8">
                    <LayoutsAppImage
                        src="/home/rocket.png"
                        alt="Rocket"
                        class="absolute w-full h-full object-contain z-10"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
