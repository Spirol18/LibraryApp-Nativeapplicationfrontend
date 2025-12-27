import { LucideIcon, Menu, Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { ViewProps } from 'react-native';

export const Icon = ({
    as: As,
    className,
    size = 'md',
    ...props
}: {
    as?: LucideIcon | any;
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
} & ViewProps & any) => {
    if (!As) return null;

    // mapping size string to number if needed, or use class
    const sizeMap = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32
    }
    const pxSize = typeof size === 'string' ? sizeMap[size as keyof typeof sizeMap] : size;

    return <As size={pxSize} className={className} {...props} />;
};

export const SunIcon = Sun;
export const MoonIcon = Moon;
export const MenuIcon = Menu;
