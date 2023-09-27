import React, { Component, useState  } from "react";
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
import * as Clipboard from 'expo-clipboard';

function copyToClipboard(text, type) {
  Clipboard.setString(text);
  let message = "";
  if (type === "correo") {
    message = "Correo copiado al portapapeles.";
  } else if (type === "telefono") {
    message = "Teléfono copiado al portapapeles.";
  }
  Alert.alert(message);
}

export default function Registro() {
  return (
    <View style={styles.container}>
      <Image style={styles.tinyLogo} source={require('../assets/yo.png')} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Juan Pérez</Text>
      </View>
      <TouchableOpacity onPress={() => copyToClipboard("juan.perez@example.com", "correo")}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>juan.perez@example.com</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => copyToClipboard("+52 123 456 7890", "telefono")}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>+52 123 456 7890</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 5,
    width: 280,
    padding: 20,
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white'
  }
});