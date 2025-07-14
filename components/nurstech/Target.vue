<template>
    <div class="container mx-auto px-4 py-12">
        <div class="flex flex-col lg:flex-row items-start lg:items-stretch gap-8">
            <div class="flex w-full lg:w-1/2 gap-4">
                <LayoutsAppImage
                    src="home/nurse_with_binder.png"
                    alt="Infirmière 1"
                    class="w-1/2 h-auto object-cover rounded-lg"
                />
                <LayoutsAppImage
                    src="home/nurse_with_tablet_world.png"
                    alt="Infirmière 2"
                    class="w-1/2 h-auto object-cover rounded-lg"
                />
            </div>

            <div class="w-full lg:w-[45%] space-y-8 mt-6">
                <div>
                    <h1 class="text-lg font-bold text-primary mb-2">
                        Pour qui ?
                    </h1>
                    <p class="mb-3">
                        NURSTECH est conçu spécialement pour les infirmiers et infirmières libéraux qui souhaitent :
                    </p>
                    <div class="space-y-1 pl-2">
                        <p>- Gagner du temps dans la prise de contact</p>
                        <p>- Augmenter leur visibilité locale</p>
                        <p>- Offrir une présentation claire et professionnelle de leur activité</p>
                        <p>- Inspirer confiance dès le premier clic</p>
                    </div>
                </div>

                <div>
                    <h1 class="text-lg font-bold text-primary mb-4">
                        Pourquoi ça fonctionne ?
                    </h1>
                    <div class="space-y-2">
                        <div class="bg-primary text-white p-2 rounded-lg mb-4">
                            <p>
                                <span class="lg:ml-6">➡ Votre profil est priorisé dans les recherches sur Infiswap</span>
                            </p>
                        </div>
                        <div class="bg-primary text-white p-2 rounded-lg">
                            <p>
                                <span class="lg:ml-6">➡ Vos patients accèdent facilement aux bonnes informations</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
