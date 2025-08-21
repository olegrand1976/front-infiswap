<template>
    <div>
        <div class="bg-white py-24 sm:py-32">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <div class="mx-auto max-w-2xl lg:max-w-none">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Enfin la platerome ...
                        </h2>
                        <p class="mt-4 text-lg leading-8 text-gray-600">
                            Notre plateforme est reconnue et utilisée par des organisations du monde entier pour améliorer la productivité, optimiser les opérations et enrichir l’expérience client.
                        </p>
                    </div>

                    <div
                        class="mt-10 grid grid-cols-1 gap-y-5 place-items-center w-full mx-auto max-w-7xl px-5"
                    >
                        <!-- <div
                            class="flex flex-col justify-center items-center bg-[#FFF6F3] px-4 h-[126px] w-[100%] md:w-[281px] md:h-[192px] rounded-lg justify-self-center"
                        >
                            <div class="flex flex-row justify-center items-center">
                                <svg
                                    class="w-[35px] h-[35px] md:w-[50px] md:h-[50px]"
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z"
                                        stroke="#FF6D42"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <p class="font-bold text-3xl sm:text-4xl lg:text-5xl leading-9 text-primary ml-2">
                                    {{ counts.registration }}
                                </p>
                            </div>
                            <p class="font-medium text-base sm:text-lg leading-6 mt-3 md:mt-6 text-center">
                                Inscriptions de la semaine
                            </p>
                        </div> -->
                        <!-- <div
                            class="flex flex-col justify-center items-center bg-[#FFF6F3] px-4 h-[126px] w-[100%] md:w-[281px] md:h-[192px] rounded-lg justify-self-center"
                        >
                            <div class="flex flex-row justify-center items-center">
                                <svg
                                    class="w-[35px] h-[35px] md:w-[50px] md:h-[50px]"
                                    viewBox="0 0 51 50"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clip-path="url(#a)">
                                        <path
                                            d="m26.91 5.776 4.483 10.683a1.544 1.544 0 0 0 1.287.942l11.474.992a1.544 1.544 0 0 1 .876 2.715L36.325 28.7a1.559 1.559 0 0 0-.49 1.523l2.61 11.296a1.544 1.544 0 0 1-2.295 1.677l-9.86-5.982a1.53 1.53 0 0 0-1.59 0l-9.861 5.982a1.544 1.544 0 0 1-2.295-1.677l2.609-11.296a1.56 1.56 0 0 0-.49-1.523l-8.705-7.593a1.544 1.544 0 0 1 .876-2.715l11.474-.992a1.544 1.544 0 0 0 1.287-.942l4.483-10.683a1.544 1.544 0 0 1 2.833 0Z"
                                            stroke="#FF6D42"
                                            stroke-width="4.341"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="a">
                                            <path
                                                fill="#fff"
                                                d="M.8.2h49.4v49.4H.8z"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p class="font-bold text-3xl sm:text-4xl lg:text-5xl leading-9 text-primary ml-2">
                                    {{ counts.announce }}
                                </p>
                            </div>
                            <p class="font-medium text-base sm:text-lg leading-6 mt-3 md:mt-6 text-center">
                                Annonces de la semaine
                            </p>
                        </div> -->
                        <div
                            class="flex flex-col justify-center items-center bg-[#FFF6F3] px-4 h-[126px] w-full md:h-[192px] rounded-lg justify-self-center"
                        >
                            <div class="flex flex-row justify-center items-center">
                                <svg
                                    class="w-[35px] h-[35px] md:w-[50px] md:h-[50px]"
                                    viewBox="0 0 50 50"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g
                                        clip-path="url(#a)"
                                        stroke="#FF6D42"
                                        stroke-width="3.473"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path
                                            d="M10.811 39.091c-1.775-1.775-.598-5.505-1.5-7.69-.939-2.255-4.377-4.089-4.377-6.5 0-2.413 3.438-4.246 4.376-6.502.903-2.182-.274-5.914 1.501-7.69 1.776-1.775 5.508-.598 7.69-1.5 2.266-.939 4.09-4.377 6.501-4.377 2.412 0 4.246 3.438 6.501 4.376 2.185.903 5.915-.274 7.69 1.501 1.776 1.776.598 5.506 1.502 7.69.937 2.266 4.376 4.09 4.376 6.501 0 2.412-3.439 4.246-4.377 6.501-.903 2.185.274 5.915-1.5 7.69-1.776 1.776-5.506.598-7.69 1.501-2.256.938-4.09 4.377-6.502 4.377s-4.245-3.439-6.5-4.377c-2.183-.903-5.915.275-7.69-1.5Z"
                                        />
                                        <path d="m17.281 26.444 4.632 4.631L32.718 20.27" />
                                    </g>
                                    <defs>
                                        <clipPath id="a">
                                            <path
                                                fill="#fff"
                                                d="M.3.2h49.4v49.4H.3z"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p class="font-bold text-3xl sm:text-4xl lg:text-5xl leading-9 text-primary ml-2">
                                    {{ counts.nurses }}
                                </p>
                            </div>
                            <p class="font-medium text-base sm:text-lg leading-6 mt-3 md:mt-6 text-center">
                                Infirmier(ère) & Sage-femme & Aide-soignant(e)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useHome } from '@/composables/useHome';

const counts = await useHome().count();
</script>
