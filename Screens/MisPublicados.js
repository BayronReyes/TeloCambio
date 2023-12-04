import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Card, Drawer } from 'react-native-paper';
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { collection, getDocs, query, where, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MisPublicados() {
  const [userId, setUserId] = useState("");
  const navigation = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Cargando...");
  const [refreshing, setRefreshing] = useState(false);
  const [ofertas, setOfertas] = useState([]);
  const [numOfertasRecibidas, setNumOfertasRecibidas] = useState(0);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        // AQUI HACE QUE MUESTRE SOLO LAS OFERTAS DEL USUARIO QUE ESTA LOGEADO
        const offersRef = query(
          collection(db, 'Ofertas'),
          where('UsuarioGaleria', '==', auth.currentUser.uid),
          where('Estado', '==', 'pendiente')  // AQUI ESTA LA FUNCION QUE TRAE SOLO LOS QUE ESTAN PENDIENTE
        );
        const offersSnap = await getDocs(offersRef);
        const fetchedOfertas = [];
        for (let offerDoc of offersSnap.docs) {
          const ofertaData = offerDoc.data();
          // AQUI LLAMA A LA COLECCION Publicaciones Y OBTIENE LOS ARTICULOS SEGUN LOS UID DE OFERTAS
          const publicacionGaleriaRef = doc(db, 'Publicaciones', ofertaData.ArticuloGaleria);
          const publicacionOfertaRef = doc(db, 'Publicaciones', ofertaData.ArticuloOferta);
          const [publicacionGaleriaSnap, publicacionOfertaSnap] = await Promise.all([
            getDoc(publicacionGaleriaRef),
            getDoc(publicacionOfertaRef)
          ]);
          // AQUI YA CON LOS UID OBTENIDOS DE Publicaciones LLAMA A LA DATA DE LA OFERTA
          // ESTOS SON LOS DATOS QUE VA A MOSTRAR EN EL FRONT, SE OBTUVIERON COMPARANDO LOS UID DE Ofertas Y Publicaciones
          if (publicacionGaleriaSnap.exists() && publicacionOfertaSnap.exists()) {
            const galeriaData = publicacionGaleriaSnap.data();
            const ofertaData = publicacionOfertaSnap.data();
            // AQUI VERIFICA EL ESTADO DE LAS PUBLICACIONES, SI ESTAN INACTIVAS NO SE MUESTRAN LAS OFERTAS
            if (galeriaData.estadoPublicacion === 'activa' && ofertaData.estadoPublicacion === 'activa') {
              fetchedOfertas.push({
                id: offerDoc.id,
                fecha: ofertaData.fecha,
                ArticuloGaleria: {
                  imagenURL: galeriaData.imagenURL,
                  nombreArticulo: galeriaData.nombreArticulo
                },
                ArticuloOferta: {
                  imagenURL: ofertaData.imagenURL,
                  nombreArticulo: ofertaData.nombreArticulo
                }
            });
          }
        }
      }
      setNumOfertasRecibidas(fetchedOfertas.length);    
      setOfertas(fetchedOfertas);
    } catch (error) {
      console.error("Error al obtener ofertas:", error);
    }
  };
  fetchOfertas();
  },[]);

  const handleDeleteItem = async (itemId) => {
    try {
      await Promise.all([eliminarOfertasAsociadas(itemId), deleteDoc(doc(db, "Publicaciones", itemId))]);
      setDataSource((prevData) => prevData.filter(item => item.uid !== itemId));
      setNumOfertasRecibidas((prevNum) => Math.max(0, prevNum - 1));
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
    }
  };

  const eliminarOfertasAsociadas = async (itemId) => {
    try {
      const ofertasRef = query(collection(db, "Ofertas"), where("ArticuloGaleria", "==", itemId));
      const ofertasSnap = await getDocs(ofertasRef);
  
      console.log("Ofertas a eliminar:", ofertasSnap.docs.map(doc => doc.id));
  
      for (const ofertaDoc of ofertasSnap.docs) {
        const ofertaId = ofertaDoc.id;
        console.log("Eliminando oferta:", ofertaId);
        await deleteDoc(doc(db, "Ofertas", ofertaId));
      }
    } catch (error) {
      console.error("Error al eliminar ofertas asociadas:", error);
      throw error; // Propaga el error para que pueda ser capturado en la función que lo llama.
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  const goMiPerfil = () => {
    navigation.navigate("MiPerfil");
  };

  const goGaleria2 = () => {
    navigation.replace("Galeria2");
  };

  const goMisPublicados = () => {
    navigation.navigate("MisPublicados");
  };

  const goMisOfertas = () => {
    navigation.replace("MisOfertas");
  };

  const MisIntercambios = () => {
    navigation.navigate("MisIntercambios");
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

  const cerrarSesion = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem("isLoggedIn");
      navigation.navigate("Ingreso");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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
        <TouchableOpacity style={styles.drawerItem} onPress={goGaleria2}>
          <Text style={styles.drawerText}>Galería de Artículos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={goMisPublicados}>
          <Text style={styles.drawerText}>Mis Publicados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={goMisOfertas}>
          <Text style={styles.drawerText}>Mis Ofertas</Text>
          {numOfertasRecibidas > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{numOfertasRecibidas}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={MisIntercambios}>
          <Text style={styles.drawerText}>Mis Intercambios</Text>
        </TouchableOpacity>
      </Drawer.Section>

      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Image
          source={require("../assets/Salir.png")}
          style={styles.logoutImage}
        />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setUserId(user.uid);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const allItemsArray = [];
      const articulosPublicadosRef = await getDocs(
        query(
          collection(db, "Publicaciones"),
          where("uid", "==", userId),
          where("estadoPublicacion", "==", "activa")
        )
      );
  
      articulosPublicadosRef.forEach((postDoc) => {
        const postData = postDoc.data();
        allItemsArray.push({
          uid: postDoc.id,
          imagenURL: postData.imagenURL,
          nombreArticulo: postData.nombreArticulo,
          tipo: postData.tipo,
          estadoArticulo: postData.estadoArticulo,
          comuna: postData.comuna,
          fecha: postData.fecha,
        });
      });
  
      const loadingTimer = setTimeout(() => {
        setDataSource(allItemsArray);
        setLoading(false);
      }, 600);
  
      return () => clearTimeout(loadingTimer);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  
  
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>¡Ups! No tienes publicaciones vigentes.</Text>
    </View>
  );

  const formatDateFromDatabase = (timestamp) => {
    const date = timestamp.toDate();
    return getCurrentDateFormatted(date);
  }
  
  const getCurrentDateFormatted = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  

  useEffect(() => {
    //ESTE USEEFFECT HACE QUE LA GALERIA SE REFRESQUE PARA VER EL ARTICULO RECIEN SUBIDO
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPosts();
    });
    if (userId){
      fetchPosts();
    }
    return unsubscribe;
  }, [navigation, userId]);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };
  
  const renderItem = ({item}) => {
    return (
      <Card style={styles.containerCard}> 
        <Card.Title
        style={styles.containerCardContent} 
        title={<Text style={styles.textCard} >{item.nombreArticulo}</Text>} 
        subtitle={<Text style={styles.textCardDate} >Publicado el {formatDateFromDatabase(item.fecha)}</Text>}
        left={(props) => <Image style={styles.imagenList} source={{ uri: item.imagenURL }} />}
        right={(props) => (
          <TouchableOpacity
            onPress={() => handleDeleteItem(item.uid)}
          >
            <Image source={require("../assets/Eliminar.png")} style={styles.iconList} />
          </TouchableOpacity>
        )}
        />
      </Card>
    );
  };


  const renderDrawerAndroid = () => (
    <DrawerLayout
      ref={drawer}
      drawerWidth={200}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#63A355" />
            <Text>{loadingMessage}</Text>
          </View>      
        ) : (
          <FlatList
            data={dataSource}
            renderItem={renderItem}
            keyExtractor={(item) => (item && item.uid ? item.uid.toString() : 'defaultKey')}
            contentContainerStyle={{ ...styles.gridContainer, flexGrow: 1 }}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            ListEmptyComponent={EmptyListComponent}
            style={styles.containerFlatList}
          />
        )}
      </View>
    </DrawerLayout>
  );

  return Platform.OS === "ios" ? renderDrawerAndroid() : renderDrawerAndroid();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  containerDrawer: {
    flex: 1,
    padding: 5,
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1",
  },
  drawerItem: {
    backgroundColor: "#8AAD34",
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  drawerText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
    padding: 10,
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#7A7A7A",
    margin: 15,
  },
  logo: {
    width: 255,
    height: 55,
  },
  logoutButton: {
    alignItems: "center",
    marginTop: 20,
  },
  logoutImage: {
    width: 80,
    height: 80,
  },
  containerFlatList: {
    marginVertical: 15,
  },
  containerCard: {
    width: 'auto',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  containerCardContent: {
    width: 'auto',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  imagenList: {
    width: '200%',
    height: '200%',
    borderRadius: 10,
  },
  iconList: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  textCard: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 38,
  },
  textCardDate: {
    fontSize: 14,
    marginLeft: 38,
  },
  buttonCard: {
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
    backgroundColor: "#63A355",
  },
  textButton2: {
    color: "#ffffff",
  },
  gridContainer: {
    padding: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  emptyContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 18,
    color: 'grey'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: 9,
    right: 10,
    backgroundColor: "red",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
