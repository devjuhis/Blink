import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/style";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {

  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to blink!</Text>
      <Text style={styles.subtext}>Film 10s video of your day and share it with your friends 📹</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Camera")}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
