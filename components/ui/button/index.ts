import { cva, type VariantProps } from 'class-variance-authority';

export { default as Button } from './Button.vue';

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm md:text-xs lg:text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/95 rounded-3xl',
                destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline:
          'border border-input bg-transparent text-primary shadow-sm hover:text-accent-foreground',
                secondary:
          'bg-secondary px-4 text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-3xl',
                dark: 'bg-gray-800 text-gray-100',
                success: 'bg-success text-white',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                none: '',
                light:
           'border border-white bg-transparent text-white shadow-sm hover:text-gray-300',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-10 rounded-md px-8',
                xl: 'h-10 rounded-3xl text-base px-12 py-2',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
