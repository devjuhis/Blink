import React, { useState, useCallback, useRef } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { Text, StyleSheet, Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const LastPost = ({ user }) => {
    const [lastVideo, setLastVideo] = useState("Loading...");
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fetchLatestVideo = async () => {
        try {
            if (!user) {
                return;
            }

            const storage = getStorage();
            const userFolderRef = ref(storage, `${user.uid}`);
            const result = await listAll(userFolderRef);
            const folderNames = result.prefixes.map(folder => folder.name);

            if (folderNames.length === 0) {
                setLastVideo("No videos found");
                return;
            }

            folderNames.sort((a, b) => {
                const currentYear = new Date().getFullYear(); 
                const [dayA, monthA] = a.split(".").map(Number);
                const [dayB, monthB] = b.split(".").map(Number);
            
                const dateA = new Date(currentYear, monthA - 1, dayA);
                const dateB = new Date(currentYear, monthB - 1, dayB);
            
                return dateA - dateB;
            });

            const latestFolder = folderNames[folderNames.length - 1];
            const latestFolderRef = ref(storage, `${user.uid}/${latestFolder}`);
            const latestFiles = await listAll(latestFolderRef);

            if (latestFiles.items.length === 0) {
                setLastVideo("No videos found");
                return;
            }

            const latestVideoRef = latestFiles.items[latestFiles.items.length - 1];
            await getDownloadURL(latestVideoRef);

            const video = latestVideoRef.name;
            const parts = video.split("_");
            if (parts.length < 2) {
                setLastVideo("Unknown date");
                return;
            }
            const timestamp = parts[1].split(".")[0];
            const date = new Date(Number(timestamp));

            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);

            const isToday = date.toDateString() === today.toDateString();
            const isYesterday = date.toDateString() === yesterday.toDateString();

            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");

            let formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()} at ${hours}:${minutes}`;

            if (isToday) {
                formattedDate = `📅 Today at ${hours}:${minutes}`;
            } else if (isYesterday) {
                formattedDate = `📅 Yesterday at ${hours}:${minutes}`;
            }

            setLastVideo(formattedDate);
        } catch (error) {
            console.error("Virhe haettaessa viimeisintä videota:", error);
            setLastVideo("Loading error");
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchLatestVideo();

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }, [])
    );

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Last Video</Text>
            <Text style={styles.videoText}>{lastVideo}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        paddingVertical: 30,
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        alignItems: "center",
        marginTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 5,
    },
    videoText: {
        fontSize: 16,
        color: "#ddd",
    },
});

export default LastPost;
