import { type ReactNode } from 'react';
import { View, Text } from 'react-native';
import { Logo } from '@/components/ui/logo';

interface AuthScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  logoSize?: number;
  footer?: ReactNode;
}

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  logoSize = 80,
  footer,
}: AuthScreenLayoutProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Logo size={logoSize} />
      <Text className="mt-4 text-2xl font-bold text-ink">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 text-base text-muted">{subtitle}</Text>
      ) : null}
      <View className="mt-6 w-full gap-3">{children}</View>
      {footer ? <View className="mt-6">{footer}</View> : null}
    </View>
  );
}
