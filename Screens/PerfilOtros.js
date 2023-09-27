import React, { Component } from "react";
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


export default function Registro() {
  const navigation = useNavigation();
  const goReporteUsuario = () => {
    navigation.navigate("ReporteUsuario");
  };
  return (
    <View style={styles.container}>
      <Image style={styles.tinyLogo} source={require('../assets/yo.png')} />
      <View>
        <Text style={styles.bigText}>Pepito</Text>
      </View>
      <View style={[styles.textContainer, styles.espacioContainer]}>
        <Text style={styles.text}>Nivel de Telocambista: 
        <Text style={styles.text}> Principiante</Text></Text>
      </View>
      <TouchableOpacity style={styles.buttonReportar} onPress={goReporteUsuario}>
        <Text style={styles.buttonText}>Reportar</Text>
      </TouchableOpacity>
    </View>
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
    marginTop: 70, 
  },
  buttonReportar: {
    marginTop: 15, 
    backgroundColor: "red", 
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
});
