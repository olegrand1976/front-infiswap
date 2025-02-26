import { cva, type VariantProps } from 'class-variance-authority';

export { default as Input } from './Input.vue';

export const inputVariants = cva(
    'flex h-9 rounded-md border border-none font-sans bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-90',
    {
        variants: {
            variant: {
                default: 'outline outline-none border border-none',
                transparent: 'outline outline-none border border-none text-white bg-transparent placeholder:text-white',
                light: 'outline outline-none border border-none bg-gray-100',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export type InputVariants = VariantProps<typeof inputVariants>;
