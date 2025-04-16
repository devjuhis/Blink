import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Omat
import { fetchMonthlyVideos } from "../functions/videoUtils";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../styles/style";
import VideoPlayer from "../components/VideoPlayer";

const BlinksScreen = () => {
    const { user } = useContext(AuthContext);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            
            const getVideos = async () => {
                const userVideos = await fetchMonthlyVideos(user);
                if (isActive) {
                    setVideos(userVideos);
                    setLoading(false);
                }
            };

            getVideos();

            return () => {
                isActive = false;
                setVideos([]);
                setLoading(true); 
            };
        },[user])
    );

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>User not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>MyBlinks</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={videos}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <VideoPlayer videoUrl={item.url} videoDate={item.date} />
                    )}
                    contentContainerStyle={styles.listContainer}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    pagingEnabled={true}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 50,
        backgroundColor: COLORS.background,
    },
    text: {
        fontSize: 18,
        color: COLORS.text,
        textAlign: "center",
        marginVertical: 10,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default BlinksScreen;
