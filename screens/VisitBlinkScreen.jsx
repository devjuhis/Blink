import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRoute, useFocusEffect } from "@react-navigation/native";

// Omien tiedostojen importit
import { fetchMonthlyVideos } from "../functions/videoUtils";
import { COLORS } from "../styles/style";
import VideoPlayer from "../components/VideoPlayer";

const BlinksScreen = () => {
    const route = useRoute();

    const [user, setUser] = useState(route.params?.user);
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

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{user?.displayName || ""}</Text>
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
