import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/style";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

import Icon from "react-native-vector-icons/MaterialIcons";

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logOut} onPress={logout}>
                <Icon name="logout" size={25}></Icon>
            </TouchableOpacity>

            <Text style={styles.title}>
                Welcome to Blink {user?.displayName || ""}!
            </Text>
            <Text style={styles.subtext}>
                Film a 10s video of your day and share it with your friends 📹
            </Text>
            
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Camera")}
            >
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
