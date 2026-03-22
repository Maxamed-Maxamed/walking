// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];
type SymbolName = Extract<SymbolViewProps["name"], string>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const SYMBOL_TO_MATERIAL_ICON = [
  ["house.fill", "home"],
  ["paperplane.fill", "send"],
  ["chevron.left.forwardslash.chevron.right", "code"],
  ["chevron.right", "chevron-right"],
] as const satisfies readonly (readonly [SymbolName, MaterialIconName])[];

type IconSymbolName = (typeof SYMBOL_TO_MATERIAL_ICON)[number][0];

const SYMBOL_TO_MATERIAL_ICON_MAP = new Map<IconSymbolName, MaterialIconName>(
  SYMBOL_TO_MATERIAL_ICON,
);
const FALLBACK_ICON: MaterialIconName = "help";

function resolveMaterialIconName(name: IconSymbolName): MaterialIconName {
  return SYMBOL_TO_MATERIAL_ICON_MAP.get(name) ?? FALLBACK_ICON;
}

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={resolveMaterialIconName(name)}
      style={style}
    />
  );
}
