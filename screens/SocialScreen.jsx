import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

import { COLORS } from "../styles/style";

const SocialScreen = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const userSnapshot = await getDocs(usersCollection);
                const userList = userSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setUsers(userList);
                setFilteredUsers(userList);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text) {
            const filtered = users.filter((user) =>
                user.displayName?.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    const handleUserPress = (user) => {
        navigation.navigate("VisitBlinkScreen", { user });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by name..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleUserPress(item)} activeOpacity={0.7}>
                            <View style={styles.userCard}>
                                <Text style={styles.userName}>
                                    {item.displayName || "No Name"}
                                </Text>
                                <Text style={styles.userEmail}>{item.email}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.noResults}>No users found</Text>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f2f5",
        padding: 10,
        marginVertical: 30,
    },
    searchInput: {
        marginVertical: 30,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 16,
    },
    userCard: {
        backgroundColor: "#ffffff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
    },
    userName: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.primary,
        flex: 1,
    },
    userEmail: {
        fontSize: 14,
        color: "#7f8c8d",
    },
    noResults: {
        textAlign: "center",
        fontSize: 16,
        color: "#888",
        marginTop: 20,
    },
});

export default SocialScreen;
