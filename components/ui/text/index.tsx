import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { tv } from 'tailwind-variants';

const textStyle = tv({
    base: 'text-typography-700 font-body',
    variants: {
        size: {
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
            '2xl': 'text-2xl',
            '3xl': 'text-3xl',
            '4xl': 'text-4xl',
            '5xl': 'text-5xl',
            '6xl': 'text-6xl',
        },
        bold: {
            true: 'font-bold',
        },
    },
});

export interface TextProps extends RNTextProps {
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    bold?: boolean;
}

export const Text = React.forwardRef<React.ElementRef<typeof RNText>, TextProps>(
    ({ className, size = 'md', bold, ...props }, ref) => {
        return (
            <RNText
                ref={ref}
                className={textStyle({ size, bold, class: className })}
                {...props}
            />
        );
    }
);

Text.displayName = 'Text';
