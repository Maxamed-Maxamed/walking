import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends Omit<ViewProps, 'className'> {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <View
      className={twMerge(clsx('rounded-2xl p-4 bg-surface shadow-sm'), className)}
      {...props}
    >
      {children}
    </View>
  );
}
