import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/style";
import { useNavigation } from "@react-navigation/native";

//omat
import { AuthContext } from "../context/AuthContext";
import DaysInRow from "../components/daysInRow";
import LastPost from "../components/lastPost";

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
                Welcome to Blink {"\n"} {user?.displayName || ""}!
            </Text>
            <Text style={styles.subtext}>
                Film Blinks of your day and share them with your friends 📹
            </Text>
            
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Camera")}
            >
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>

            <DaysInRow user={user}></DaysInRow>
            <LastPost user={user}></LastPost>
        </View>
    );
};

export default HomeScreen;
