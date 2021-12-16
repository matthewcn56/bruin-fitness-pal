import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { AuthContext, AuthProvider } from "./navigation/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import RootStack from "./navigation/RootStack";

export default function App() {
  return (
    <AuthProvider>
      <RootStack />
    </AuthProvider>
  );
}
