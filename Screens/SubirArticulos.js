import React, { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { auth, db , storage } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function SubirArticulos(){
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemCondition, setItemCondition] = useState('');
  const [itemTrade, setItemTrade] = useState('');
  
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'Usuarios', user.uid);
        getDoc(userDocRef).then((userDoc) => {
          if (userDoc.exists()) {  
            setUsername(userDoc.DB().username);
          }
        }).catch(error => {
          console.error("Error getting document:", error);
        });
      }
    })();
  }, []);
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const SubirArticulo = async () => {
    try {
      if (image) {
        const user = auth.currentUser;
        const uid = user ? user.uid : null;
        if (!uid) {
          console.error('No hay usuario autenticado');
          alert('Por favor, inicia sesión para subir un artículo');
          return; 
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;
        const response = await fetch(uploadUri);
        const blob = await response.blob();    
        const storage = getStorage();
        const storageRef = ref(storage, `Imagenes de Articulos/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);   
        uploadTask.on('state_changed', (snapshot) => {      
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Carga al ' + progress.toFixed(2) + '% completada');
          if (!firstAlertShown) {
            alert('Subiendo...');
            firstAlertShown = true;
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              console.error('El usuario no tiene permiso para acceder al objeto.');
              alert('El usuario no tiene permiso para acceder al objeto.');
              break;
            case 'storage/canceled':
              console.error('El usuario canceló la carga.');
              alert('El usuario canceló la carga.');
              break;
            case 'storage/unknown':
              console.error('Ocurrió un error desconocido, inspecciona la carga de errores para obtener detalles.');
              alert('Ocurrió un error desconocido, inspecciona la carga de errores para obtener detalles.');
              break;
            default:
              console.error('Error al subir archivo:', error);
              alert('Error al subir archivo: ' + error.message);
              break;
          }
        },
        async () => {
          try {
            const imageURL = await getDownloadURL(uploadTask.snapshot.ref);
            await setDoc(doc(db, 'Publicaciones', uid), {
              nombreArticulo: itemName,
              estadoArticulo: itemCondition,
              tipo: itemTrade,
              imagenURL: imageURL,
            });
            Alert.alert(
              '¡Felicitaciones Telocambista!',
              'Publicacion subida con éxito.', 
              [{text: 'OK', onPress: () => navigation.navigate('Galeria')}],
              { cancelable: false } 
            );
          } catch (error) {
            console.error('Error al obtener la URL de descarga:', error);
            alert('Error: ' + error.message);
          }
        });
      } 
    } 
    catch (error) {
      console.error("Error al subir el artículo:", error);
      alert('Error al subir el artículo. Por favor intenta de nuevo.');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Card>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </Card>
        <TouchableOpacity style={styles.cajaBoton} onPress={pickImage}>
          <Text style={styles.textoBoton}>Seleccionar Imagen</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerTextInput}>
        <Text style={styles.title}>Nombre del Artículo</Text>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Ej. Bicicleta"
            style={styles.textInput}
            onChangeText={setItemName}
            value={itemName}
          />
        </View>
        <Text style={styles.title}>Estado del Artículo</Text>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Nuevo/Usado"
            style={styles.textInput}
            onChangeText={setItemCondition}
            value={itemCondition}
          />
        </View>
        <Text style={styles.title}>Intercambio o Gratis</Text>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Intercambio o Gratis"
            style={styles.textInput}
            onChangeText={setItemTrade}
            value={itemTrade}
          />
        </View>
        <TouchableOpacity style={styles.cajaBotonP} onPress={SubirArticulo}>
          <Text style={styles.textoBotonP}>Publicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      paddingHorizontal: 15,
    },
    containerImage: {
      flex: 0.5,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
      paddingVertical: 15,
      paddingHorizontal: 15,
      margin: 10,
    },
    containerTextInput: {
      marginTop: 15,
      alignItems: "center",
      paddingVertical: 20,
    },
    cajaBoton: {
      backgroundColor: "#ffffff",
      borderRadius: 30,
      paddingVertical: 15,
      width: 250,
      marginTop: 15,
      borderWidth: 1,
      borderColor: "#8AAD34",
    },
    textoBoton:{
      textAlign: "center",
      color: "#8AAD34",
    },
    cajaTexto: {
      paddingVertical: 15,
      paddingHorizontal: 25,
      backgroundColor: "#cccccc50",
      borderRadius: 30,
      marginVertical: 7,
    },
    textInput: {
      paddingHorizontal: 15,
      color: "#a9a9a9",
    },
    title: {
      fontSize: 18,
      fontWeight: '500',
      paddingVertical: 15,
      alignItems: "center",
      textAlign: "center",
    },
    cajaBotonP: {
      backgroundColor: "#8AAD34",
      borderRadius: 30,
      paddingVertical: 15,
      width: 150,
      marginTop: 30,
      alignItems: "center",
    },
    textoBotonP:{
      textAlign: "center",
      color: "#ffffff",
      fontSize: 18,
      fontWeight: '500',
    },
    card: {
      margin: 10,
    },
    image: {
      width: 150, 
      height: 150,
      paddingVertical: 15,
      paddingHorizontal: 15,
      margin: 15,
    },
  }
);

