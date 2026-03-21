import { Image } from "expo-image";

interface LogoProps {
  size?: number;
  className?: string;
}

const DEFAULT_SIZE = 96;

export function Logo({ size = DEFAULT_SIZE, className }: LogoProps) {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      style={{ width: size, height: size }}
      contentFit="contain"
      className={className}
    />
  );
}
