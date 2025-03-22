<template>
    <div
        class="container font-light grid grid-cols-5 gap-8 justify-between mt-12"
    >
        <div
            class="col-span-5 lg:col-span-3 grid grid-cols-2 items-center shadow-lg rounded-lg overflow-hidden"
        >
            <div
                class="relative h-60 col-span-2 lg:col-span-1 lg:h-full w-full bg-red-200"
            >
                <LayoutsAppImage
                    src="/home/message_home_background.png"
                    class="w-full h-full"
                />
                <LayoutsAppImage
                    src="/home/mail-image.png"
                    class="absolute w-32 lg:w-36 top-1/2 bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            <div class="p-4 col-span-2 lg:col-span-1 text-start lg:text-start">
                <p class="font-bold mb-4">
                    Un peu de patience… on y est presque !
                </p>
                <p class="mb-4">
                    Notre équipe travaille
                    <strong class="text-primary font-semibold">d’arrache-pied</strong>
                    pour finaliser notre plateforme et vous offrir une expérience fluide,
                    performante et à la hauteur de vos attentes.
                </p>
                <p class="mb-4">
                    Nous savons que vous êtes impatients (et nous aussi !), mais chaque
                    ligne de code que nous écrivons rapproche le lancement de quelque
                    chose de
                    <strong class="text-primary font-semibold">vraiment exceptionnel</strong>.
                </p>
                <p class="mb-4">
                    🙏 Merci pour votre confiance et votre patience. On vous promet :
                    <em>ça vaudra le coup d’attendre !</em>
                </p>
            </div>
        </div>
        <div class="col-span-5 lg:col-span-2 grid place-content-center relative bg-rose-400 shadow-lg rounded-lg overflow-hidden p-4">
            <div class="text-white">
                <p>
                    Le lancement approche à grands pas ! Notre équipe finalise les
                    derniers détails pour vous offrir une plateforme exceptionnelle. Soyez
                    parmi les premiers informés dès sa mise en ligne.
                </p>
            </div>
        </div>
    </div>
</template>
