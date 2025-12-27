import React from 'react';
import { View, ViewProps } from 'react-native';
import { tv } from 'tailwind-variants';

const vstackStyle = tv({
    base: 'flex-col',
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
            true: 'flex-col-reverse',
        },
    },
});

export interface VStackProps extends ViewProps {
    className?: string;
    space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    reversed?: boolean;
}

export const VStack = React.forwardRef<React.ElementRef<typeof View>, VStackProps>(
    ({ className, space, reversed, ...props }, ref) => {
        return (
            <View
                ref={ref}
                className={vstackStyle({ space, reversed, class: className })}
                {...props}
            />
        );
    }
);

VStack.displayName = 'VStack';
