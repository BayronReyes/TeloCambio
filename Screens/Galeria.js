import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  DrawerLayoutAndroid,
  DrawerLayoutIOS,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { products } from "./common/Articulos";
import { FlatList } from "react-native-gesture-handler";
import MyProductItem from "./common/MyProductItem";
import { Drawer} from "react-native-paper";

export default function Home() {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, 
      gestureEnabled: false, 
    });
  }, [navigation]);

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
      {/* Título "TeloCambio" encima de la línea superior, mi opcion B era dejarlo como texto */}
      <View>
          <Image
            source={require("../assets/LogoTeLoCambio.png")}
            style={styles.logo}
          />
        </View>

      {/* Línea de separación */}
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

  const [categoryList, setcategoryList] = useState([]);
  const [AccesoriosList, setAccesoriosList] = useState([]);
  const [ComidaList, setComidaList] = useState([]);
  const [DeportesList, setDeportesList] = useState([]);
  const [FerreteriaList, setFerreteriaList] = useState([]);
  const [HogarList, setHogarList] = useState([]);
  const [InstrumentosList, setInstrumentosList] = useState([]);
  const [JuguetesList, setJuguetesList] = useState([]);
  const [LibrosList, setLibrosList] = useState([]);

  useEffect(() => {
    console.log(products);
    let tempCategory = [];
    products.category.map((item) => {
      tempCategory.push(item);
    });
    setcategoryList(tempCategory);
    setAccesoriosList(products.category[0].data);
    setComidaList(products.category[1].data);
    setDeportesList(products.category[2].data);
    setFerreteriaList(products.category[3].data);
    setHogarList(products.category[4].data);
    setInstrumentosList(products.category[5].data);
    setJuguetesList(products.category[6].data);
    setLibrosList(products.category[7].data);
  }, []);

  const renderDrawerAndroid = () => (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <ScrollView>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={categoryList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.HorizontalScroll}
                  mode="elevated"
                >
                  <Text style={styles.textButton}>{item.category}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <Text style={styles.titleCategory}>Accesorios</Text>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={AccesoriosList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <MyProductItem item={item} />;
            }}
          />
        </View>

        <Text style={styles.titleCategory}>Comida</Text>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={ComidaList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <MyProductItem item={item} />;
            }}
          />
        </View>

        <Text style={styles.titleCategory}>Deportes</Text>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={DeportesList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <MyProductItem item={item} />;
            }}
          />
        </View>

        <Text style={styles.titleCategory}>Ferreteria</Text>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={FerreteriaList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <MyProductItem item={item} />;
            }}
          />
        </View>
      </ScrollView>
    </DrawerLayoutAndroid>
  );

  const renderDrawerIOS = () => (
    <DrawerLayoutIOS
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <ScrollView>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={categoryList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.HorizontalScroll}
                  mode="elevated"
                >
                  <Text style={styles.textButton}>{item.category}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <Text style={styles.titleCategory}>Accesorios</Text>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={AccesoriosList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <MyProductItem item={item} />;
            }}
          />
        </View>

        <Text style={styles.titleCategory}>Comida</Text>
        <View style={{ marginTop: 15 }}>
          <FlatList

            data={ComidaList}

            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <MyProductItem item={item} />;
            }}
          />
        </View>

        <Text style={styles.titleCategory}>Deportes</Text>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={DeportesList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <MyProductItem item={item} />;
            }}
          />
        </View>


        <Text style={styles.titleCategory}>Ferreteria</Text>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={FerreteriaList}

            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <MyProductItem item={item} />;
            }}
          />
        </View>
      </ScrollView>
    </DrawerLayoutIOS>
  );

  return Platform.OS === "ios" ? renderDrawerIOS() : renderDrawerAndroid();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  HorizontalScroll: {
    padding: 10,
    marginLeft: 20,
    borderRadius: 20,
    backgroundColor: "#8AAD34",
    opacity: 30,
  },
  titleCategory: {
    marginTop: 20,
    marginLeft: 20,
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
  },
  textButton: {
    color: "#ffffff",
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
    width:260,
    height: 47,
  },
});

