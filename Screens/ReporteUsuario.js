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
      causa_reporte: "",
      reporte: "",
    });
    const navigation = useNavigation();
    const goPerfilOtros = () => {
      navigation.navigate("PerfilOtros");
    };
    const handleRegister = async () => {
      let errorMessage = null;
      if (data.causa_reporte === "") {
        Alert.alert("Error", "Selecciona una causa del reporte.");
        return;
      }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.padre}
    >
      <View style={styles.padre}>
        <View style={styles.tarjeta}>
        <View style={styles.cajaPicker}>
          <Picker
            selectedValue={data.causa_reporte}
            onValueChange={(itemValue) => setData({ ...data, causa_reporte: itemValue })}
          >
            <Picker.Item label="Causa del reporte"       value="" />
            <Picker.Item label="No responde al intercambio"     value="No responde al intercambio" />
            <Picker.Item label="Las fotos son falsas o robadas"  value="Las fotos son falsas o robadas" />
            <Picker.Item label="Estafa"      value="Estafa" />
            <Picker.Item label="Otros"      value="Otros" />
          </Picker>
        </View>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Escriba su reporte"
            style={{ paddingHorizontal: 15 }}
            onChangeText={(text) => setData({ ...data, reporte: text })}
            value={data.reporte}
            multiline={true} // Habilitar múltiples líneas
            numberOfLines={5}
            maxLength={140}
          />
        </View>
        <View style={styles.padreBoton}>
          <TouchableOpacity style={styles.cajaBotonReportar} onPress={handleRegister}>
            <Text style={styles.textoBoton}>Reportar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cajaBotonCancelar} onPress={goPerfilOtros}>
            <Text style={styles.textoBoton}>Cancelar</Text>
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
  cajaPicker: {
    paddingVertical: 0,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 10,
      
  },
  cajaTexto: {
    paddingVertical: 18,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 10,  
    width:300,
    height: 180,
  },
  padreBoton: {
    alignItems: "center",
  },
  cajaBotonCancelar: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20,
    width:200,
  },
  cajaBotonReportar: {
    backgroundColor: "#cc0000",
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20,
    width:250,
    height: 70,
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});




