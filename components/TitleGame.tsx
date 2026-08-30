import useTheme, { ColorScheme } from "@/context/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

interface TitleGameProps {
  title: string;
}

export function TitleGame({ title }: TitleGameProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      letterSpacing: 1.5,
      textTransform: "uppercase",
      textAlign: "center",
      color: colors.text,
    },
  });

