import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Google from "expo-auth-session/providers/google";
import {
  EXPO_AUTH_CLIENT_ID,
  IOS_CLIENT_ID,
  EXPO_AUTH_CLIENT_SECRET,
} from "@env";
const Stack = createNativeStackNavigator();

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: EXPO_AUTH_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    clientSecret: EXPO_AUTH_CLIENT_SECRET,
  });

  useEffect(() => {
    console.log("Vars: " + EXPO_AUTH_CLIENT_ID + "," + IOS_CLIENT_ID);
  }, []);
  useEffect(() => {
    if (response && response.type === "success") {
      console.log(response);
    }
  }, [response]);
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button onPress={() => promptAsync()} title="LogIn!" />
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
