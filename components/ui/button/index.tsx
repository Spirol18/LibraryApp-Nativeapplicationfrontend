import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';
import { tv } from 'tailwind-variants';

const buttonStyle = tv({
    base: 'flex-row items-center justify-center rounded-md gap-2',
    variants: {
        action: {
            primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700',
            secondary: 'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700',
            positive: 'bg-success-500 hover:bg-success-600 active:bg-success-700',
            negative: 'bg-error-500 hover:bg-error-600 active:bg-error-700',
        },
        variant: {
            solid: '',
            outline: 'bg-transparent border border-outline-300 hover:bg-background-50 active:bg-background-100',
            link: 'bg-transparent hover:bg-background-50 active:bg-background-100',
        },
        size: {
            xs: 'px-2 py-1',
            sm: 'px-3 py-1.5',
            md: 'px-4 py-2',
            lg: 'px-5 py-2.5',
            xl: 'px-6 py-3',
        },
    },
    defaultVariants: {
        action: 'primary',
        variant: 'solid',
        size: 'md',
    },
});

const buttonTextStyle = tv({
    base: 'font-bold font-body',
    variants: {
        action: {
            primary: 'text-typography-0',
            secondary: 'text-typography-0',
            positive: 'text-typography-0',
            negative: 'text-typography-0',
        },
        variant: {
            solid: 'text-typography-0',
            outline: 'text-typography-900',
            link: 'text-typography-900',
        },
        size: {
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-md',
            lg: 'text-lg',
            xl: 'text-xl',
        },
    },
    defaultVariants: {
        action: 'primary',
        variant: 'solid',
        size: 'md',
    },
});


type ButtonContextType = {
    action?: 'primary' | 'secondary' | 'positive' | 'negative';
    variant?: 'solid' | 'outline' | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const ButtonContext = React.createContext<ButtonContextType>({});

export interface ButtonProps extends PressableProps {
    className?: string;
    action?: 'primary' | 'secondary' | 'positive' | 'negative';
    variant?: 'solid' | 'outline' | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
    ({ className, action = 'primary', variant = 'solid', size = 'md', ...props }, ref) => {
        return (
            <ButtonContext.Provider value={{ action, variant, size }}>
                <Pressable
                    ref={ref}
                    className={buttonStyle({ action, variant, size, class: className })}
                    {...props}
                />
            </ButtonContext.Provider>
        );
    }
);

Button.displayName = 'Button';

export const ButtonText = ({ className, ...props }: React.ComponentProps<typeof Text> & { className?: string }) => {
    const { action, variant, size } = React.useContext(ButtonContext);
    return <Text className={buttonTextStyle({ action, variant, size, class: className })} {...props} />;
};

export const ButtonIcon = ({ as: Icon, className, ...props }: { as: any; className?: string } & any) => {
    const { action, variant, size } = React.useContext(ButtonContext);
    // Simple color logic - normally specific icon components handle this or we pass color prop
    // Here we'll rely on the parent defining color via className or inherit
    // But usually icons need 'color' prop.
    const color = variant === 'solid' ? '#FFFFFF' : '#181719'; // simplified
    return <Icon color={color} size={16} {...props} />;
};
