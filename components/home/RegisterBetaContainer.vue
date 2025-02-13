<template>
    <div class="w-full relative">
        <NuxtImg
            src="/container_register.png"
            class="w-full"
        />
        <div class="absolute bottom-[6%] text-xs text-white mx-8">
            <h2 class="font-semibold">
                Inscrivez-vous dès maintenant
            </h2>
            <p class="mt-2">
                Profitez d'une remise incroyable de 50 % sur votre abonnement dès aujourd'hui.
                Accédez à toutes nos fonctionnalités premium et bénéficiez d’un service de qualité
                à moitié prix ! Cette offre est limitée, alors n’attendez plus pour vous inscrire
                et démarrer votre expérience à prix réduit. Inscrivez-vous maintenant et
                économisez dès votre première année !
            </p>
            <Button
                variant="secondary"
                href="/register-beta"
                class="mt-3 text-primary w-36"
            >
                <span class="text-xs">S'inscrire</span>
            </Button>
        </div>
    </div>
</template>
