import React, { useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import HomeStack from "./HomeStack";
import { AuthContext } from "./AuthProvider";
import { NavigationContainer } from "@react-navigation/native";
const Stack = createStackNavigator();
export type RootStackParamsList = {
  Login: undefined;
  Home: undefined;
};

const RootStackNavigator = createStackNavigator<RootStackParamsList>();

export default function RootStack() {
  const { isValidToken } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <RootStackNavigator.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isValidToken ? (
          <RootStackNavigator.Screen name="Home" component={HomeStack} />
        ) : (
          <RootStackNavigator.Screen name="Login" component={LoginScreen} />
        )}
      </RootStackNavigator.Navigator>
    </NavigationContainer>
  );
}
