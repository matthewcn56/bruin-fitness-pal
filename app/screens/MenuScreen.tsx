import React, { useContext } from "react";
import { SafeAreaView, View, Text, Button } from "react-native";
import { AuthContext } from "../navigation/AuthProvider";
import { SERVER_BASE_URL } from "@env";

export default function MenuScreen() {
  const { logout } = useContext(AuthContext);
  return (
    <SafeAreaView>
      <View>
        <Text>This is Our Menu Screen!</Text>
        <Text>Today's Menu...</Text>
        <Button title="Log Out!" onPress={() => logout()} />
      </View>
    </SafeAreaView>
  );
}

async function getHoursAndHalls() {
  const infoRes = await fetch();
}
