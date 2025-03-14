import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Tuodaan sivut
import HomeScreen from "./screens/HomeScreen.jsx";
import CameraScreen from "./screens/CameraScreen.jsx";
import SocialScreen from "./screens/SocialScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";

// Luodaan navigaattorit
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigaatio
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Camera") iconName = "camera";
          else if (route.name === "Social") iconName = "people";
          else if (route.name === "MyBlinks") iconName = "journal";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6200ea",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyBlinks" component={ProfileScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
    </Tab.Navigator>
  );
};

// Stack Navigaatio (voi lisätä esim. profiilin tai asetukset)
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

