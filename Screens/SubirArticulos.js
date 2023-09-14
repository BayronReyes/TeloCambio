import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.containerGaleria}>
        <Text style={styles.title}>SUBIR ARTICULOS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  containerGaleria: {
    alignItems: "center",
    paddingVertical: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "white",
    justifyContent: "center",
  },
});
