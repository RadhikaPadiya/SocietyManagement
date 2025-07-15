import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  useEffect(() => {
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log("AsyncStorage cleared on app launch.");
      } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
      }
    };

    clearStorage();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
