import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { View, Text, StyleSheet, Animated } from "react-native";

const LastPost = ({ user }) => {
    const [lastVideo, setLastVideo] = useState("Ei löydy videoita");
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        const fetchLatestVideo = async () => {
            try {
                const storage = getStorage();
                const userFolderRef = ref(storage, `${user.uid}`);

                const result = await listAll(userFolderRef);
                const folderNames = result.prefixes.map(folder => folder.name);

                if (folderNames.length === 0) {
                    console.log("Ei löydy videoita.");
                    setLastVideo("Ei löydy videoita");
                    return;
                }

                folderNames.sort((a, b) => {
                    const [dayA, monthA] = a.split(".").map(Number);
                    const [dayB, monthB] = b.split(".").map(Number);
                    return new Date(2024, monthB - 1, dayB) - new Date(2024, monthA - 1, dayA);
                });

                const latestFolder = folderNames[folderNames.length - 1];
                console.log("Viimeisin kansio:", latestFolder);

                const latestFolderRef = ref(storage, `${user.uid}/${latestFolder}`);
                const latestFiles = await listAll(latestFolderRef);

                if (latestFiles.items.length === 0) {
                    console.log("Viimeisimmässä kansiossa ei ole videoita.");
                    setLastVideo("Ei löydy videoita");
                    return;
                }

                const latestVideoRef = latestFiles.items[latestFiles.items.length - 1];
                const videoURL = await getDownloadURL(latestVideoRef);

                const video = latestVideoRef.name;
                const timestamp = video.split("_")[1].split(".")[0];

                const date = new Date(Number(timestamp));

                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                const isToday =
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

                const isYesterday =
                    date.getDate() === yesterday.getDate() &&
                    date.getMonth() === yesterday.getMonth() &&
                    date.getFullYear() === yesterday.getFullYear();

                const hours = date.getHours().toString().padStart(2, "0");
                const minutes = date.getMinutes().toString().padStart(2, "0");

                let formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()} at ${hours}:${minutes}`;

                if (isToday) {
                    formattedDate = `📅 Today at ${hours}:${minutes}`;
                } else if (isYesterday) {
                    formattedDate = `📅 yesterday at ${hours}:${minutes}`;
                }

                setLastVideo(formattedDate);

                console.log("Latauslinkki:", videoURL);
            } catch (error) {
                console.error("Virhe haettaessa viimeisintä videota:", error);
                setLastVideo("Virhe ladattaessa");
            }
        };

        fetchLatestVideo();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

    }, [user, fadeAnim]);

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
