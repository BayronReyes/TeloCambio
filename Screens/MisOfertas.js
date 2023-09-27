import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Image, DrawerLayoutAndroid, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";

export default function MisOfertas() {
  const navigation = useNavigation();

  const goMiPerfil = () => {
    navigation.navigate("MiPerfil");
  };
  const goGaleria = () => {
    navigation.navigate("Galeria");
  };
  const goMisPublicados = () => {
    navigation.navigate("MisPublicados");
  };
  const goMisOfertas = () => {
    navigation.navigate("MisOfertas");
  };

  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("left");
  const changeDrawerPosition = () => {
    if (drawerPosition === "left") {
      setDrawerPosition("right");
    } else {
      setDrawerPosition("left");
    }
  };

  const navigationView = () => (
    <View style={[styles.containerDrawer, styles.navigationContainer]}>
      <View>
        <Image
          source={require("../assets/LogoTeLoCambio.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.separatorLine} />
      <Drawer.Section>
        <TouchableOpacity style={styles.drawerItem} onPress={goMiPerfil}>
          <Text style={styles.drawerText}>Mi Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={goGaleria}>
          <Text style={styles.drawerText}>Galeria de Artículos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={goMisPublicados}>
          <Text style={styles.drawerText}>Mis Publicados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={goMisOfertas}>
          <Text style={styles.drawerText}>Mis Ofertas</Text>
        </TouchableOpacity>
      </Drawer.Section>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View>
        <Text>Hola Mundo Guapo</Text>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  containerDrawer: {
    flex: 1,
    padding: 16,
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1",
  },
  drawerItem: {
    backgroundColor: "#8AAD34",
    margin: 10,
    borderRadius: 30,
  },
  drawerText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
    padding: 12,
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 10,
  },
  logo: {
    width: 260,
    height: 47,
  },
});

