import {
  useColorScheme as useNativeColorScheme,
  type ColorSchemeName,
} from "react-native";

export function useColorScheme(): ColorSchemeName {
  return useNativeColorScheme();
}

export function resolveColorScheme(
  colorScheme: ColorSchemeName,
): "light" | "dark" {
  return colorScheme === "dark" ? "dark" : "light";
}
