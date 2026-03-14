import { clsx, type ClassValue } from 'clsx';
import { Pressable, Text, type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs)) as string;
}

interface ButtonProps extends Omit<PressableProps, 'className'> {
  variant?: ButtonVariant;
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-primary rounded-xl py-4 disabled:opacity-50',
    text: 'text-white text-base font-semibold',
  },
  secondary: {
    container: 'bg-secondary rounded-xl py-4 disabled:opacity-50',
    text: 'text-white text-base font-semibold',
  },
  outline: {
    container: 'border-2 border-primary rounded-xl py-4 bg-transparent disabled:opacity-50',
    text: 'text-primary text-base font-semibold',
  },
  ghost: {
    container: 'rounded-xl py-4 bg-transparent disabled:opacity-50',
    text: 'text-primary text-base font-semibold',
  },
  destructive: {
    container: 'bg-error rounded-xl py-4 disabled:opacity-50',
    text: 'text-white text-base font-semibold',
  },
};

export function Button({
  variant = 'primary',
  className,
  textClassName,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  return (
    <Pressable
      className={cn(styles.container, 'items-center justify-center', className)}
      disabled={disabled}
      {...props}
    >
      <Text className={cn(styles.text, 'text-center', textClassName)}>
        {children}
      </Text>
    </Pressable>
  );
}
