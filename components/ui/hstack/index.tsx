import React from 'react';
import { View, ViewProps } from 'react-native';
import { tv } from 'tailwind-variants';

const hstackStyle = tv({
    base: 'flex-row items-center',
    variants: {
        space: {
            xs: 'gap-1',
            sm: 'gap-2',
            md: 'gap-4',
            lg: 'gap-6',
            xl: 'gap-8',
            '2xl': 'gap-10',
            '3xl': 'gap-12',
            '4xl': 'gap-16',
        },
        reversed: {
            true: 'flex-row-reverse',
        },
    },
});

export interface HStackProps extends ViewProps {
    className?: string;
    space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    reversed?: boolean;
}

export const HStack = React.forwardRef<React.ElementRef<typeof View>, HStackProps>(
    ({ className, space, reversed, ...props }, ref) => {
        return (
            <View
                ref={ref}
                className={hstackStyle({ space, reversed, class: className })}
                {...props}
            />
        );
    }
);

HStack.displayName = 'HStack';
