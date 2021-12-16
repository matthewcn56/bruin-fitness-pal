import React, { useContext } from "react";
import { View, Button, StatusBar, StyleSheet } from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import { SafeAreaView, Text } from "react-native";

interface LoginProps {}

export default function LoginScreen() {
  const { promptLogin, isValidToken, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button
        onPress={() => promptLogin()}
        title="Log In With Your UCLA Email!"
      />
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
