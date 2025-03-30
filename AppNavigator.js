import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./context/AuthContext.js";

// Sivut
import HomeScreen from "./screens/HomeScreen";
import CameraScreen from "./screens/CameraScreen";
import SocialScreen from "./screens/SocialScreen";
import TodayScreen from "./screens/TodayScreen.jsx";
import BlinksScreen from "./screens/BlinksScreen.jsx";
import VisitBlinksScreen from "./screens/VisitBlinkScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Home") iconName = "home";
                    else if (route.name === "Camera") iconName = "camera";
                    else if (route.name === "Social") iconName = "people";
                    else if (route.name === "TodaysBlinks")
                        iconName = "journal";
                    else if (route.name === "MyBlinks") iconName = "grid";

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "#6200ea",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="TodaysBlinks" component={TodayScreen} />
            <Tab.Screen name="MyBlinks" component={BlinksScreen} />
            <Tab.Screen name="Social" component={SocialScreen} />
            <Tab.Screen name="Camera" component={CameraScreen} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user || null;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen
                        name="Main"
                        component={BottomTabs}
                        options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="VisitBlinkScreen"
                            component={VisitBlinksScreen}
                            options={{ headerShown: true, title: 'Go back' }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default AppNavigator;
