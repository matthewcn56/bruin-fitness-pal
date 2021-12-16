import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MenuScreen from "../screens/MenuScreen";
import NutritionScreen from "../screens/NutritionScreen";
const HomeTab = createMaterialBottomTabNavigator<HomeStackParamList>();
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

type HomeStackParamList = {
  Menu: undefined;
  Nutrition: undefined;
};
export default function HomeStack() {
  return (
    <HomeTab.Navigator initialRouteName="Menu">
      <HomeTab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarLabel: "Menu",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="food-fork-drink"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <HomeTab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          tabBarLabel: "Nutrition",
          tabBarIcon: ({ color }) => (
            <Ionicons name="fitness" color={color} size={26} />
          ),
        }}
      />
    </HomeTab.Navigator>
  );
}
