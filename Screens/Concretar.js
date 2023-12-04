// SACAR LA DESCRIPCION Y AGREGAR "NUEVO/USADO" Y "GRATIS/INTERCAMBIO"
import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, doc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig";

export default function Concretar({ route }) {
  const [ofertas, setOfertas] = useState([]);
  const ofertaId = route.params?.ofertaId;
  const [ofertaEspecifica, setOfertaEspecifica] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modo, setModo] = useState('telocambio'); // o 'teloregalo' según corresponda
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]); 

  useEffect(() => {
    const fetchOfertas = async () => {
      setIsLoading(true);
      try {
        const offersRef = query(
          collection(db, 'Ofertas'),
          where('UsuarioGaleria', '==', auth.currentUser.uid),
          where('Estado', '==', 'pendiente')
        );
        const offersSnap = await getDocs(offersRef);
        const fetchedOfertas = [];
        const idsTemporales = [];
        for (let offerDoc of offersSnap.docs) {
          const ofertaData = offerDoc.data();
          idsTemporales.push(ofertaData.ArticuloGaleria);
          idsTemporales.push(ofertaData.ArticuloOferta);
          const publicacionGaleriaRef = doc(db, 'Publicaciones', ofertaData.ArticuloGaleria);
          const publicacionOfertaRef = doc(db, 'Publicaciones', ofertaData.ArticuloOferta);
          const [publicacionGaleriaSnap, publicacionOfertaSnap] = await Promise.all([
            getDoc(publicacionGaleriaRef),
            getDoc(publicacionOfertaRef),
          ]);
          const userGaleriaQuery = query(collection(db, 'Usuarios'), where('uid', '==', ofertaData.UsuarioGaleria));
          const userOfertaQuery = query(collection(db, 'Usuarios'), where('uid', '==', ofertaData.UsuarioOferta));
          const [userGaleriaSnapshot, userOfertaSnapshot] = await Promise.all([
            getDocs(userGaleriaQuery),
            getDocs(userOfertaQuery),
          ]);
          const userGaleriaData = !userGaleriaSnapshot.empty ? userGaleriaSnapshot.docs[0].data() : null;
          const userOfertaData = !userOfertaSnapshot.empty ? userOfertaSnapshot.docs[0].data() : null;
          fetchedOfertas.push({
            nombreArticuloGaleria: publicacionGaleriaSnap.data()?.nombreArticulo,
            nombreArticuloOferta: publicacionOfertaSnap.data()?.nombreArticulo,
            idsPublicaciones: [ofertaData.ArticuloGaleria, ofertaData.ArticuloOferta],
            id: offerDoc.id,
            fecha: ofertaData.fecha,
            ArticuloGaleria: publicacionGaleriaSnap.data(),
            ArticuloOferta: publicacionOfertaSnap.data(),
            UsuarioGaleria: {
              imagenen: userGaleriaData && userGaleriaData.imagenen.length > 0 ? userGaleriaData.imagenen[0] : null,
              nombre_apellido: userGaleriaData ? userGaleriaData.nombre_apellido : null,
            },
            UsuarioOferta: {
              uid: userOfertaData?.uid,
              imagenen: userOfertaData && userOfertaData.imagenen.length > 0 ? userOfertaData.imagenen[0] : null,
              nombre_apellido: userOfertaData ? userOfertaData.nombre_apellido : null,
            },
          });
        }
        setOfertas(fetchedOfertas);
        if (ofertaId) {
          const ofertaEspecifica = fetchedOfertas.find(o => o.id === ofertaId);
          if (ofertaEspecifica) {
            setOfertaEspecifica(ofertaEspecifica);
          }
        }
      } catch (error) {
        console.error("Error al obtener ofertas:", error);
      }
      setIsLoading(false);
    };
    fetchOfertas();
  }, [ofertaId]);


  // ---------------  AQUI CAMBIA EL ESTADO DE LA OFERTA A COMPLETADA ----------------
  const actualizarEstadoOferta = async (ofertaId) => {
    const ofertaRef = doc(db, 'Ofertas', ofertaId);
    try {
      await updateDoc(ofertaRef, {
        Estado: 'completado',
      });
      console.log('Oferta actualizada a completado')
    } catch (error) {
      console.error('Error al actualizar la oferta:', error);
    }
  };

  const goToDatosCambio = (ofertaEspecifica, modo) => {
    if (ofertaEspecifica?.UsuarioOferta?.uid) {
      const itemParaPasar = {
        ArticuloGaleria: ofertaEspecifica.ArticuloGaleria,
        ArticuloOferta: ofertaEspecifica.ArticuloOferta,
        UsuarioOfertaUid: ofertaEspecifica.UsuarioOferta.uid,
        nombreArticuloGaleria: ofertaEspecifica.nombreArticuloGaleria,
        nombreArticuloOferta: ofertaEspecifica.nombreArticuloOferta
      };
      navigation.navigate('DatosCambio', { item: itemParaPasar, modo: modo });
    } else {
      console.error('Datos de oferta específica o ID de UsuarioOferta no disponibles', ofertaEspecifica);
    }
  };
  
  const manejarAceptarOferta = async (ofertaEspecifica) => {
    if (modo === 'telocambio' && ofertaEspecifica) {
      await actualizarEstadoOferta(ofertaEspecifica.id);
      const idsPublicacion = ofertaEspecifica.idsPublicaciones;
      if (idsPublicacion && idsPublicacion.length >= 2) {
        await actualizarEstadoPublicaciones(idsPublicacion[0], idsPublicacion[1]);
      } else {
        console.error('No hay suficientes IDs de publicación disponibles');
      }
      goToDatosCambio(ofertaEspecifica, 'telocambio');
    } else {
      console.error('Oferta específica no definida o modo no es telocambio');
    }
  };
  
  // --------------- AQUI CAMBIA EL ESTADO DE ACTIVA A INACTIVA LAS PUBLICACIONES, POR ENDE NO SE VEN EN NINGUN LADO ---------------
  const actualizarEstadoPublicaciones = async (idPublicacion1, idPublicacion2) => {
    try {
      const updates = [idPublicacion1, idPublicacion2].map(id => 
        updateDoc(doc(db, 'Publicaciones', id), { estadoPublicacion: 'inactiva' })
      );
      await Promise.all(updates);
      console.log('Estados de publicaciones actualizados a inactiva');
    } catch (error) {
      console.error('Error al actualizar las publicaciones: ', error);
    }
  };
  // ----------------- RECHAZAR UNA OFERTA -------------------------------------------------------------

  const manejarRechazarOferta = async (ofertaEspecifica) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de rechazar el intercambio?",
      [
        {
          text: "No",
          onPress: () => console.log("Rechazo cancelado"),
          style: "cancel"
        },
        {
          text: "Sí", 
          onPress: async () => {
            try {
              console.log("Dentro de manejarRechazarOferta, ofertaId:", ofertaEspecifica.id);
              const ofertaRef = doc(db, 'Ofertas', ofertaEspecifica.id);
              await deleteDoc(ofertaRef);
              setOfertas(prevOfertas => prevOfertas.filter(item => item.id !== ofertaEspecifica.id));
              Alert.alert("¡Éxito!", "El intercambio ha sido rechazado.");
            } catch (error) {
              console.error("Error al rechazar el intercambio:", error);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
      <View style={styles.container}>
        <Text style={{ ...styles.bigText, ...styles.boldTextTittle }}>
          Objetos de Intercambio
        </Text>
        {ofertaEspecifica ? (
          <View style={styles.itemContainer}>
            <Text style={styles.boldTextTittle}>Mi artículo</Text>
            <View style={styles.item}>
              {ofertaEspecifica.ArticuloGaleria.imagenURL && (
                <Image source={{ uri: ofertaEspecifica.ArticuloGaleria.imagenURL }} style={styles.imagen} />
              )}
              <View style={styles.detallesContainer}>
                <Text style={styles.text}>
                  {ofertaEspecifica.ArticuloGaleria.nombreArticulo}
                </Text>
                <Text style={styles.text}>
                  {ofertaEspecifica.ArticuloGaleria.estadoArticulo}
                </Text>
                <Text style={styles.text}>
                  {ofertaEspecifica.ArticuloGaleria.tipo}
                </Text>
              </View>
              {ofertaEspecifica.UsuarioGaleria.imagenen && (
                <Image source={{ uri: ofertaEspecifica.UsuarioGaleria.imagenen }} style={styles.fotoPerfil} />
              )}
            </View>
            <Text style={styles.boldTextTittle}>
              Artículo de {ofertaEspecifica.UsuarioOferta.nombre_apellido || 'Usuario desconocido'}
            </Text>
            <View style={styles.item}>
              {ofertaEspecifica.ArticuloOferta.imagenURL && (
                <Image source={{ uri: ofertaEspecifica.ArticuloOferta.imagenURL }} style={styles.imagen} />
              )}
              <View style={styles.detallesContainer}>
                <Text style={styles.text}>
                  {ofertaEspecifica.ArticuloOferta.nombreArticulo}
                </Text>
                <Text style={styles.text}>
                  {ofertaEspecifica.ArticuloOferta.estadoArticulo}
                </Text>
                <Text style={styles.text}>
                  {ofertaEspecifica.ArticuloOferta.tipo}
                </Text>
              </View>
              {ofertaEspecifica.UsuarioOferta.imagenen && (
                <Image source={{ uri: ofertaEspecifica.UsuarioOferta.imagenen }} style={styles.fotoPerfil} />
              )}
            </View>
            <TouchableOpacity
              style={styles.buttonAceptar}
              onPress={() => manejarAceptarOferta(ofertaEspecifica)}
            >
              <Text style={styles.buttonText}>Aceptar Oferta</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.buttonRechazar}
              onPress={() => manejarRechazarOferta(ofertaEspecifica)}
            >
              <Text style={styles.buttonText}>Rechazar Oferta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#63A355" />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  tinyLogo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  itemContainer: {
    width: "90%",
    alignItems: "center",
  },
  item: {
    width: "100%",
    backgroundColor: "#8AAD34",
    borderRadius: 7,
    padding: 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  boldText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  boldTextTittle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  bigText: {
    fontSize: 24,
    paddingBottom: 60,
  },
  espacioContainer: {
    marginTop: 20,
  },
  buttonPublicadas: {
    marginTop: 15,
    backgroundColor: "black",
    borderRadius: 5,
    width: 200,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAceptar: {
    marginTop: 15,
    backgroundColor: "#8AAD34",
    borderRadius: 5,
    width: 200,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRechazar: {
    marginTop: 15,
    backgroundColor: "#cc0000",
    borderRadius: 5,
    width: 200,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
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
  imagen: {
    width: 100,
    height: 100,
  },
  detallesContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#8AAD34",
    borderRadius: 7,
    marginVertical: 10,
  },
  fotoPerfil: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
