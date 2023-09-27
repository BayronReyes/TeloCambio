import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  lovigationContainer,
} from "@react-navigation/native";
import Login from "./Screens/Login";
import Home from "./Screens/Home";
import Ingreso from "./Screens/Ingreso";
import Registro from "./Screens/Registro";
import Galeria from "./Screens/Galeria";
import SubirArticulos from "./Screens/SubirArticulos";
import Concretar from "./Screens/Concretar";
import DatosCambio from "./Screens/DatosCambio";
import DetalleCambio from "./Screens/DetalleCambio";
import DetalleGratis from "./Screens/DetalleGratis";
import MiPerfil from "./Screens/MiPerfil";
import MisOfertas from "./Screens/MisOfertas";
import MisPublicados from "./Screens/MisPublicados";
import PerfilOtros from "./Screens/PerfilOtros";
import ReporteUsuario from "./Screens/ReporteUsuario";

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Home",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />

        <Stack.Screen
          name="Ingreso"
          component={Ingreso}
          options={{
            title: "Ingresar",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "Inicio de Sesión",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{
            title: "Registro",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="Galeria"
          component={Galeria}
          options={{
            title: "Galería",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="SubirArticulos"
          component={SubirArticulos}
          options={{
            title: "Subir Artículos",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="Concretar"
          component={Concretar}
          options={{
            title: "Concretar intercambio",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="DatosCambio"
          component={DatosCambio}
          options={{
            title: "Datos de quien aceptaste la oferta",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="DetalleCambio"
          component={DetalleCambio}
          options={{
            title: "Detalle de un articulo cuando es para cambio",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="DetalleGratis"
          component={DetalleGratis}
          options={{
            title: "Detalle de un articulo cuando es gratis",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="MiPerfil"
          component={MiPerfil}
          options={{
            title: "Mi perfil de usuario",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="MisOfertas"
          component={MisOfertas}
          options={{
            title: "Mis ofertas recibidas",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="MisPublicados"
          component={MisPublicados}
          options={{
            title: "Mis articulos publicados",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="PerfilOtros"
          component={PerfilOtros}
          options={{
            title: "Perfil de otros Telocambistas",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="ReporteUsuario"
          component={ReporteUsuario}
          options={{
            title: "Reporte Usuario",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
