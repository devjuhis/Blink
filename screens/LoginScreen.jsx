import React, { useState, useContext } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../styles/style";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Fill all fields");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(userCredential.user);
            setUser(userCredential.user);
        } catch (e) {
            Alert.alert("Error", "Check email and password");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Log in</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Go</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.link}>No acoount? Register here!</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 12,
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    link: {
        marginTop: 10,
        color: COLORS.primary,
    },
});

export default LoginScreen;
