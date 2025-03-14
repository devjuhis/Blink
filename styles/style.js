import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#6200ea", // Violetti pääväri
  secondary: "#03dac6", // Turkoosi korosteväri
  background: "#f5f5f5", // Vaalea tausta
  text: "#333", // Tumma teksti
  white: "#fff",
  black: "#000",
  gray: "#aaa",
};

export const SIZES = {
  base: 8,
  padding: 16,
  margin: 16,
  borderRadius: 12,
  buttonHeight: 50,
};

export const FONTS = {
  regular: { fontSize: 16, fontWeight: "400" },
  bold: { fontSize: 18, fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "700" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    height: SIZES.buttonHeight,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Android varjo
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: SIZES.margin,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    ...FONTS.title,
    color: COLORS.text,
  },
  text: {
    ...FONTS.regular,
    color: COLORS.text,
  },
  subtext: {
    ...FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default styles;
