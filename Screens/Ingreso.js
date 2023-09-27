import React, { Component } from "react";
import {
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import {appFirebase, auth} from "../firebaseConfig";
import googleIcon from '../assets/GoogleButton.png';


export default function Ingreso() {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, 
      gestureEnabled: false,
    });
  }, [navigation]);

  const goLogin = () => {
    navigation.navigate("Login");
  };
  const goRegistro = () => {
    navigation.navigate("Registro");
  };
  const provider = new GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        navigation.navigate("Menu");
      })
      .catch((error) => {
        console.error("Error al autenticar con Google:", error);
      });
  };

  return (
    <View style={styles.padre}>
      <View>
          <Image
            source={require("../assets/LogoTeLoCambio.png")}
            style={styles.logo}
          />
        </View>
      <View style={styles.padreBoton}>
        <TouchableOpacity style={styles.cajaBotonL} onPress={goLogin}>
          <Text style={styles.textoBoton}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.padreBoton}>
        <TouchableOpacity style={styles.cajaBotonR} onPress={goRegistro}>
          <Text style={styles.textoBoton}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.padreBoton}>
        <TouchableOpacity
          style={styles.cajaBotonG}
          onPress={handleGoogleSignIn}
        >
          <Image source={googleIcon} style={{ width: 24, height: 24 }} />
          <Text style={styles.textoBotonG}>Iniciar sesión con Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
//Estilos para los botones y texto
const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  padreBoton: {
    alignItems: "center",
  },
  cajaBotonL: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 25,
    width: 300,
    marginTop: 35,
  },
  cajaBotonR: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 25,
    width: 300,
    marginTop: 35,
  },
  cajaBotonG: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 33,
    width: 300,
    marginTop: 55,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#dbdbdb",
    borderWidth: 1,
  },
  textoBotonG: {
    color: "#555",
    marginLeft: 10,
    fontSize: 16,
    textAlign: "center",
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
  },
  logo: {
    width: 250,
    height: 120,
    marginBottom : 50,
  }
});
