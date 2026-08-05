<template>
    <div class="bg-white">
        <section class="relative overflow-hidden bg-gradient-to-b from-muted to-white px-6 py-10 text-center lg:py-20">
            <div class="absolute -left-16 -top-20 size-56 rounded-full bg-primary/10" />
            <div class="absolute -right-10 bottom-[-60px] size-40 rounded-full bg-primary/10" />
            <div class="mb-5 md:hidden">
                <LayoutsLogo class="w-48 mx-auto" />
            </div>
            <div class="relative mx-auto max-w-xl">
                <span class="mb-5 inline-flex items-center gap-1.5 rounded-full border border-input bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary shadow-sm">
                    <MessageCircle class="size-3.5" />
                    {{ $t('contact.heroEyebrow') }}
                </span>
                <h1 class="font-secondary text-3xl font-semibold text-dark lg:text-4xl">
                    {{ $t('contact.heroTitlePrefix') }} <span class="text-primary">{{ $t('contact.heroTitleHighlight') }}</span>
                </h1>
                <p class="mx-auto mt-3.5 max-w-md text-sm text-gray-500 lg:text-base">
                    {{ $t('contact.heroSubtitle') }}
                </p>
                <div class="mt-5 flex flex-wrap justify-center gap-2">
                    <span
                        v-for="reason in reasons"
                        :key="reason"
                        class="rounded-full border border-input bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 shadow-sm"
                    >
                        {{ reason }}
                    </span>
                </div>
            </div>
        </section>

        <div class="container pb-10 pt-10 lg:pt-12">
            <div class="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-input bg-white shadow-xl lg:grid-cols-[1.3fr_1fr]">
                <div class="p-8 lg:p-11">
                    <h2 class="font-secondary text-xl font-semibold text-dark">
                        {{ $t('contact.formTitle') }}
                    </h2>
                    <p class="mt-1 mb-6 text-sm text-gray-500">
                        {{ $t('contact.formSubtitle') }}
                    </p>

                    <form
                        class="flex flex-col"
                        @submit.prevent="submit"
                    >
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-medium text-gray-700">
                                    {{ $t('contact.namePlaceholder') }}
                                </label>
                                <InputIcon
                                    v-model="formData.name"
                                    :icon="CircleUser"
                                    rounded="md"
                                    :placeholder="$t('contact.namePlaceholder')"
                                    :errors="validationErrors.name"
                                    @blur="validateField('name')"
                                    @input="validateField('name')"
                                />
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-medium text-gray-700">
                                    {{ $t('auth.email') }}
                                </label>
                                <InputIcon
                                    v-model="formData.email"
                                    :icon="Mail"
                                    rounded="md"
                                    :placeholder="$t('auth.email')"
                                    :errors="validationErrors.email"
                                    @blur="validateField('email')"
                                    @input="validateField('email')"
                                />
                            </div>
                        </div>

                        <div class="mt-4 flex flex-col gap-1.5">
                            <label class="text-sm font-medium text-gray-700">
                                {{ $t('contact.phonePlaceholder') }}
                                <span class="text-xs font-normal text-muted-foreground">({{ $t('pricing.optional') }})</span>
                            </label>
                            <InputIcon
                                v-model="formData.phoneNumber"
                                :icon="Phone"
                                rounded="md"
                                :placeholder="$t('contact.phonePlaceholder')"
                                :errors="validationErrors.phoneNumber"
                                @blur="validateField('phoneNumber')"
                                @input="validateField('phoneNumber')"
                            />
                        </div>

                        <div class="mt-4 flex flex-col gap-1.5">
                            <label class="text-sm font-medium text-gray-700">
                                {{ $t('contact.message') }}
                            </label>
                            <Textarea
                                v-model="formData.message"
                                :placeholder="$t('contact.messagePlaceholder')"
                                class="min-h-24 rounded-md border-input"
                            />
                        </div>

                        <Button
                            type="submit"
                            class="mt-6 w-full font-bold"
                            :in-progress="inProgress"
                        >
                            {{ $t('contact.send') }}
                            <Send class="size-4" />
                        </Button>
                    </form>
                </div>

                <div class="flex flex-col bg-muted p-8 lg:p-10">
                    <h3 class="font-secondary text-lg font-semibold text-dark">
                        {{ $t('contact.infoTitle') }}
                    </h3>
                    <p class="mt-1 mb-5 text-xs text-gray-500">
                        {{ $t('contact.infoSubtitle') }}
                    </p>

                    <div class="flex flex-col">
                        <a
                            href="tel:0478023377"
                            class="flex items-center gap-3 border-b border-primary/10 py-3.5 last:border-0"
                        >
                            <span class="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-white text-primary shadow-sm">
                                <Phone class="size-4" />
                            </span>
                            <span>
                                <span class="block text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ $t('contact.phone') }}</span>
                                <span class="text-sm font-semibold text-dark">0478 02 33 77</span>
                            </span>
                        </a>

                        <a
                            href="mailto:info@infiswap.be"
                            class="flex items-center gap-3 border-b border-primary/10 py-3.5 last:border-0"
                        >
                            <span class="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-white text-primary shadow-sm">
                                <Mail class="size-4" />
                            </span>
                            <span>
                                <span class="block text-[11px] font-bold uppercase tracking-wide text-gray-400">Email</span>
                                <span class="text-sm font-semibold text-dark">info@infiswap.be</span>
                            </span>
                        </a>

                        <div class="flex items-center gap-3 border-b border-primary/10 py-3.5 last:border-0">
                            <span class="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-white text-primary shadow-sm">
                                <MapPin class="size-4" />
                            </span>
                            <span>
                                <span class="block text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ $t('contact.address') }}</span>
                                <span class="text-sm font-medium text-dark">Rue de la Résistance 92/A, 7131 Waudrez</span>
                            </span>
                        </div>

                        <a
                            href="https://www.ll-it-sc.be"
                            target="_blank"
                            rel="noopener"
                            class="flex items-center gap-3 py-3.5"
                        >
                            <span class="flex size-9.5 shrink-0 items-center justify-center rounded-[10px] bg-white text-primary shadow-sm">
                                <Globe class="size-4" />
                            </span>
                            <span>
                                <span class="block text-[11px] font-bold uppercase tracking-wide text-gray-400">{{ $t('contact.site') }}</span>
                                <span class="text-sm font-semibold text-dark">ll-it-sc.be</span>
                            </span>
                        </a>
                    </div>

                    <div class="mt-auto flex items-center gap-2 pt-5 text-xs text-gray-500">
                        <span class="size-1.5 shrink-0 rounded-full bg-success" />
                        {{ $t('contact.trustResponseTime') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CircleUser, Globe, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-vue-next';
import * as yup from 'yup';
import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';
import { submitContact } from '~/composables/useContact';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const { t } = useI18n();

const { $toast } = useNuxtApp();

const reasons = computed(() => [
    t('contact.reasonCreateAccount'),
    t('contact.reasonSearchReplacement'),
    t('contact.reasonInstitution'),
    t('contact.reasonOther'),
]);

const formData = reactive({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
});

const error = reactive({
    name: '',
    email: '',
    phoneNumber: '',
});

const schema = yup.object().shape({
    name: yup.string()
        .min(2, 'Le nom doit avoir minimum 2 caractères'),
    email: yup.string()
        .email('Email invalide'),
    phoneNumber: yup.string()
        .matches(/^\d{10}$/, 'Numéro invalide'),
});

const validateField = async (field: keyof typeof formData) => {
    try {
        await schema.validateAt(field, toRaw(formData));
        error[field] = '';
    }
    catch (err) {
        error[field] = (err as yup.ValidationError).message;
    }
};

const {
    submit,
    inProgress,
    validationErrors,
} = useSubmit(
    () => {
        return submitContact(formData).then(() => {
            $toast({
                description: 'Votre message a été envoyé avec succès !',
            });

            formData.name = '';
            formData.email = '';
            formData.phoneNumber = '';
            formData.message = '';
        });
    },
);

useHead({
    title: () => t('contact.title'),
    meta: [
        {
            name: 'description',
            content: 'Besoin d\'un remplacement infirmier ? Contactez l\'équipe InfiSwap pour toute demande d\'assistance ou d\'information.',
        },
    ],
});

definePageMeta({
    layout: 'guest',
});
</script>
