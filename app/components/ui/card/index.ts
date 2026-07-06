import { cva, type VariantProps } from 'class-variance-authority';

export { default as Card } from './Card.vue';
export { default as CardContent } from './CardContent.vue';
export { default as CardDescription } from './CardDescription.vue';
export { default as CardFooter } from './CardFooter.vue';
export { default as CardHeader } from './CardHeader.vue';
export { default as CardTitle } from './CardTitle.vue';

export const cardVariants = cva(
    'bg-white rounded-2xl shadow-lg transform transition duration-300 ease-in-out group',
    {
        variants: {
            hover: {
                default:
          'cursor-pointer hover:cursor-pointer text-primary hover:scale-105 focus:scale-105 hover:bg-primary',
                none: 'cursor-default',
            },
        },
        defaultVariants: {
            hover: 'default',
        },
    },
);

export type CardVariants = VariantProps<typeof cardVariants>;
