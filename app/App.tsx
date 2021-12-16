import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext, AuthProvider } from "./navigation/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { promptLogin, isValidToken, logout } = useContext(AuthContext);
  return isValidToken ? (
    <SafeAreaView>
      <Text> Logged in!</Text>
      <Button onPress={() => logout()} title="Log Out!" />
    </SafeAreaView>
  ) : (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button
        onPress={() => promptLogin()}
        title="Log In With Your UCLA Email!"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

//use the sub as hash!
