import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const ProfileScreen = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const storage = getStorage();
                const videosRef = ref(storage, "videos/");
                const videoList = await listAll(videosRef);

                const videosData = await Promise.all(
                    videoList.items.map(async (video) => {
                        const url = await getDownloadURL(video);
                        return {
                            url,
                            date: extractDateFromFilename(video.name),
                        };
                    })
                );

                setVideos(videosData);
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>My Blinks</Text>

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
                />
            )}
        </View>
    );
};

const VideoPlayer = ({ videoUrl, videoDate }) => {
    const player = useVideoPlayer(videoUrl, (player) => {
        player.loop = true;
    });

    const { isPlaying } = useEvent(player, "playingChange", {
        isPlaying: player.playing,
    });

    return (
        <Pressable
            onPress={() => {
                if (isPlaying) {
                    player.pause();
                } else {
                    player.play();
                }
            }}
            style={styles.videoContainer}
        >
            <VideoView
                style={styles.video}
                player={player}
                nativeControls={false}
                allowsFullscreen={false}
                contentFit="fill"
            />
            <View style={styles.overlay}>
                <Icon style={styles.overlayPlayIcon} name={isPlaying ? "pause" : "play-arrow"} size={25} color="white"></Icon>
                <Text style={styles.overlayText}>{videoDate}</Text>
            </View>
        </Pressable>
    );
};

const extractDateFromFilename = (filename) => {
    const match = filename.match(/(\d{13})/);
    if (match) {
        const timestamp = parseInt(match[0], 10); 
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);

        return `${day}.${month}.${year}`;
    }
    return "Some day";
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: '10 10 0 10',
        marginTop: 50,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        justifyContent: "start",
        alignItems: "center",
    },
    overlayText: {
        position: "relative",
        top: 60,
        color: "#fff",
        fontSize: 20,
        fontWeight: "300",
    },
    overlayPlayIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    videoContainer: {
        width: 300,
        height: 480,
        marginBottom: 20,
        alignItems: "center",
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
    },
    video: {
        backgroundColor: "black",
        width: "100%",
        height: "100%",
    },
});

export default ProfileScreen;
