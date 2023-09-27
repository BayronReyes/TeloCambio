import React, { useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  DrawerLayoutAndroid
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";

export default function Registro() {
  const navigation = useNavigation();

  const goPublicaciones = () => {
    navigation.navigate("MisPublicados");
  };
  const goOfertas = () => {
    navigation.navigate("MisOfertas");
  };

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

  const [active, setActive] = React.useState("");

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        <Image style={styles.tinyLogo} source={require('../assets/yo.png')} />
        <View>
          <Text style={styles.bigText}>Juan Pérez</Text>
        </View>
        <View style={[styles.textContainer, styles.espacioContainer]}>
          <Text style={styles.text}>Nivel de Telocambista:
            <Text style={styles.text}> Principiante</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.buttonPublicadas} onPress={goPublicaciones}>
          <Text style={styles.buttonText}>Cosas Publicadas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonReportar, styles.buttonPublicadas]} onPress={goOfertas}>
          <Text style={styles.buttonText}>Ofertas recibidas</Text>
        </TouchableOpacity>
      </View>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
  tinyLogo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  textContainer: {
    backgroundColor: "#8AAD34",
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 7,
    width: 330,
    padding: 15,
    margin: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white'
  },
  bigText: {
    fontSize: 24,
  },
  espacioContainer: {
    marginTop: 40,
  },
  buttonPublicadas: {
    marginTop: 15,
    backgroundColor: "black",
    borderRadius: 5,
    width: 200,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  containerDrawer: {
    flex: 1,
    padding: 16,
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1",
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: "center",
  },
  drawerItem: {
    backgroundColor: "#8AAD34",
    margin: 10,
    borderRadius: 30,
  },
  drawerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
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
