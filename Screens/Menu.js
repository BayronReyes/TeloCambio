import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function Home() {
  const navigation = useNavigation();

  const goGaleria = () => {
    navigation.navigate("Galeria");
  };

  const goSubirArticulos = () => {
    navigation.navigate("SubirArticulos");
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerGaleria}>
        <Text style={styles.title}>Galería de Artículos</Text>
        <TouchableOpacity onPress={goGaleria}>
          <Image
            source={require("../assets/GaleriaProducto.png")}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.containerGaleria}>
        <Text style={styles.title}>Subir Artículos</Text>
        <TouchableOpacity onPress={goSubirArticulos}>
          <Image
            source={require("../assets/SubirProducto.png")}
            style={styles.image}
          />
        </TouchableOpacity>
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
