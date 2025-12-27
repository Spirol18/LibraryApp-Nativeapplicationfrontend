import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { tv } from 'tailwind-variants';

const headingStyle = tv({
    base: 'text-typography-900 font-heading font-bold',
    variants: {
        size: {
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-md',
            lg: 'text-lg',
            xl: 'text-xl',
            '2xl': 'text-2xl',
            '3xl': 'text-3xl',
            '4xl': 'text-4xl',
            '5xl': 'text-5xl',
            '6xl': 'text-6xl',
        },
    },
});

export interface HeadingProps extends RNTextProps {
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
}

export const Heading = React.forwardRef<React.ElementRef<typeof RNText>, HeadingProps>(
    ({ className, size = 'lg', ...props }, ref) => {
        return (
            <RNText
                ref={ref}
                className={headingStyle({ size, class: className })}
                {...props}
            />
        );
    }
);

Heading.displayName = 'Heading';
