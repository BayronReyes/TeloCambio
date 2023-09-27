import React, { Component, useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";

export default function Registro(props) {
    const [data, setData] = useState({
      nombre_apellido: "",
      region: "",
      telefono: "",
      email: "",
      username: "",
      password: "",
    });

    const validateEmailDetails = (email) => {
      const [localPart, domainPart] = email.split('@');
      if (!domainPart || !localPart) {
        return "El correo electrónico debe contener un '@'.";
      }
      const domainParts = domainPart.split('.');
      if (domainParts.some(part => part.length === 0)) {
        return "La parte de dominio no debe tener puntos consecutivos o empezar/terminar con un punto.";
      }
      if (!domainPart.includes('.')) {
        return "La parte de dominio debe contener un punto ('.').";
      }
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!regex.test(email)) {
        return "El correo electrónico contiene caracteres no permitidos.";
      }
      return null;
    };

    const isValidPhoneNumber = (telefono) => {
      const regex = /^[0-9]{0,12}$/;
      return regex.test(telefono);
    };

    const handleRegister = async () => {
      let errorMessage = null;
      if (!data.password || !data.username || !data.email || !data.nombre_apellido || !data.telefono) {
        Alert.alert("Error", "Todos los campos son obligatorios.");
        return;
      }
      if (data.region === "") {
        Alert.alert("Error", "Selecciona una región.");
        return;
      }
      const trimmedEmail = data.email.trim();
      const emailValidationMessage = validateEmailDetails(trimmedEmail);
      if (emailValidationMessage !== null) {
        errorMessage = emailValidationMessage;
      }
      if (!isValidPhoneNumber(data.telefono)) {
        errorMessage = "El número de teléfono no es válido.";
      }
      if (errorMessage) {
        Alert.alert("Error", errorMessage);
        return;
      }
      try {
        const response = await createUserWithEmailAndPassword(auth, trimmedEmail, data.password);
        if (response.user) {
          const userDoc = doc(db, "Usuarios", data.username);
          const userDocSnapshot = await getDoc(userDoc);
          if (userDocSnapshot.exists()) {
            Alert.alert('Error', 'El nombre de usuario ya existe. Por favor, elige otro.');
            return;
          }
          await setDoc(userDoc, {
            uid: response.user.uid,
            nombre_apellido: data.nombre_apellido,
            region: data.region,
            telefono: data.telefono,
            email: data.email,
            username: data.username,
            password: data.password
          });
          Alert.alert('Registro exitoso!');
          props.navigation.navigate("Login");
        }
      } 
      catch (error) {
        console.error("Error al registrar el usuario:", error);
        errorMessage = "Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.";
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Este email ya está siendo usado por otra cuenta.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Por favor, introduce un email válido.";
            break;
          case 'auth/weak-password':
            errorMessage = "La contraseña es demasiado corta. Debe tener al menos 6 caracteres.";
            break;
          default:
            break;
        }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.padre}
    >
      <View style={styles.padre}>
        <View style={styles.tarjeta}>
          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Nombre y Apellido"
              style={{ paddingHorizontal: 15 }}
              onChangeText={(text) => setData({ ...data, nombre_apellido: text })}
              value={data.nombre_apellido}
            />
        </View>
        <View style={styles.cajaTexto}>
          <Picker
            selectedValue={data.region}
            onValueChange={(itemValue) => setData({ ...data, region: itemValue })}
          >
            <Picker.Item label="Selecciona una region"       value="" />
            <Picker.Item label="I	   Región de Tarapacá"     value="I	   Región de Tarapacá" />
            <Picker.Item label="II	 Región de Antofagasta"  value="II	 Región de Antofagasta" />
            <Picker.Item label="III	 Región de Atacama"      value="III	 Región de Atacama" />
            <Picker.Item label="IV	 Región de Coquimbo"     value="IV	 Región de Coquimbo" />
            <Picker.Item label="V	   Región de Valparaíso"   value="V	   Región de Valparaíso" />
            <Picker.Item label="VI	 Región de OHiggins"     value="VI	 Región de OHiggins" />
            <Picker.Item label="VII	 Región del Maule"       value="VII	 Región del Maule" />
            <Picker.Item label="VIII Región del Bio-bío"     value="VIII Región del Bio-bío" />
            <Picker.Item label="IX	 Región de La Araucanía" value="IX	 Región de La Araucanía" />
            <Picker.Item label="X	   Región de Los Lagos"    value="X	   Región de Los Lagos" />
            <Picker.Item label="XI	 Región Aysén"           value="XI	 Región Aysén" />
            <Picker.Item label="XII	 Región de Magallanes"   value="XII	 Región de Magallanes" />
            <Picker.Item label="R.M  Región Metropolitana"   value="R.M  Región Metropolitana de Santiago" />
            <Picker.Item label="XIV	 Región de Los Ríos"     value="XIV	 Región de Los Ríos" />
            <Picker.Item label="XV	 Región de Arica y Parinacota" value="XV	 Región de Arica y Parinacota" />
            <Picker.Item label="XVI	 Región de Ñuble"        value="XVI	 Región de Ñuble" />
          </Picker>
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Número de Teléfono (+569-XXXXXXX)"
            keyboardType="numeric"
            style={{ paddingHorizontal: 15 }}
            onChangeText={(text) => setData({ ...data, telefono: text })}
            value={data.telefono}
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Correo (telocambio@mail.cl)"
            style={{ paddingHorizontal: 15 }}
            onChangeText={(text) => setData({ ...data, email: text })}
            value={data.email}
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Nombre de Usuario"
            style={{ paddingHorizontal: 15 }}
            onChangeText={(text) => setData({ ...data, username: text })}
            value={data.username}
          />
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Contraseña"
            style={{ paddingHorizontal: 15 }}
            secureTextEntry={true}
            onChangeText={(text) => setData({ ...data, password: text })}
            value={data.password}
          />
        </View>
        <View style={styles.padreBoton}>
          <TouchableOpacity style={styles.cajaBoton} onPress={handleRegister}>
            <Text style={styles.textoBoton}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "white",
  },
  tarjeta: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: 340,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      with: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cajaTexto: {
    paddingVertical: 18,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 7,
  },
  padreBoton: {
    alignItems: "center",
  },
  cajaBoton: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20,
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
  },
});
