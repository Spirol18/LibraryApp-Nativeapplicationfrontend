import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Pressable, Text as RNText } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none',
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary active:bg-primary/90 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-primary/90' })
        ),
        destructive: cn(
          'bg-destructive active:bg-destructive/90 dark:bg-destructive/60 shadow-sm shadow-black/5',
          Platform.select({
            web: 'hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
          })
        ),
        outline: cn(
          'border-border bg-background active:bg-accent dark:bg-input/30 dark:border-input dark:active:bg-input/50 border shadow-sm shadow-black/5',
          Platform.select({
            web: 'hover:bg-accent dark:hover:bg-input/50',
          })
        ),
        secondary: cn(
          'bg-secondary active:bg-secondary/80 shadow-sm shadow-black/5',
          Platform.select({ web: 'hover:bg-secondary/80' })
        ),
        ghost: cn(
          'active:bg-accent dark:active:bg-accent/50',
          Platform.select({ web: 'hover:bg-accent dark:hover:bg-accent/50' })
        ),
        link: '',
      },
      size: {
        default: cn('h-10 px-4 py-2 sm:h-9', Platform.select({ web: 'has-[>svg]:px-3' })),
        sm: cn('h-9 gap-1.5 rounded-md px-3 sm:h-8', Platform.select({ web: 'has-[>svg]:px-2.5' })),
        lg: cn('h-11 rounded-md px-6 sm:h-10', Platform.select({ web: 'has-[>svg]:px-4' })),
        icon: 'h-10 w-10 sm:h-9 sm:w-9',
        xs: 'h-8 px-2 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  cn(
    'text-foreground text-sm font-medium',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-white',
        outline: cn(
          'group-active:text-accent-foreground',
          Platform.select({ web: 'group-hover:text-accent-foreground' })
        ),
        secondary: 'text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: cn(
          'text-primary group-active:underline',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })
        ),
      },
      size: {
        default: '',
        sm: '',
        lg: '',
        icon: '',
        xs: 'text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    action?: 'primary' | 'secondary' | 'positive' | 'negative';
    children?: React.ReactNode;
  };

const ButtonContext = React.createContext<VariantProps<typeof buttonVariants>>({});

function Button({ className, variant, size, action, children, ...props }: ButtonProps) {
  // Map Gluestack 'action' to our variants
  const resolvedVariant = action === 'secondary' ? 'secondary' : action === 'negative' ? 'destructive' : variant;
  const resolvedSize = size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : size;

  return (
    <ButtonContext.Provider value={{ variant: resolvedVariant, size: resolvedSize }}>
      <Pressable
        className={cn(props.disabled && 'opacity-50', buttonVariants({ variant: resolvedVariant, size: resolvedSize }), className)}
        role="button"
        {...props}
      >
        {children}
      </Pressable>
    </ButtonContext.Provider>
  );
}

const ButtonText = ({ className, ...props }: React.ComponentProps<typeof RNText> & { className?: string }) => {
  const { variant, size } = React.useContext(ButtonContext);
  return <RNText className={cn(buttonTextVariants({ variant, size }), className)} {...props} />;
};

const ButtonIcon = ({ as: Icon, className, color, size, ...props }: { as: any; className?: string; color?: string; size?: number } & any) => {
  const { variant } = React.useContext(ButtonContext);
  const resolvedColor = color || (variant === 'default' ? 'white' : 'black');
  const resolvedSize = size || 16;
  return <Icon color={resolvedColor} size={resolvedSize} className={className} {...props} />;
};

export { Button, ButtonIcon, ButtonText, buttonTextVariants, buttonVariants };
export type { ButtonProps };

