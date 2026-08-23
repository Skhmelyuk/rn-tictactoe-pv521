import { Text, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface TitleGameProps {
  title: string;
}

export function TitleGame({ title }: TitleGameProps) {
  return <Text style={styles.title}>{title}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: "#2c3e50",
    marginBottom: 20,
    fontSize: 24,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "bold",
  },
});
