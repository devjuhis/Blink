import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// expo
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";

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

const VideoPlayer = ({ videoUrl, videoDate, screen }) => {
    const player = useVideoPlayer(videoUrl, (player) => {
        player.loop = true;
        player.muted = true;
    });

    const { isPlaying } = useEvent(player, "playingChange", {
        isPlaying: player.playing,
    });

    useEffect(() => {
        if (screen === "full") {
            player.play();
        }
    }, [screen, player]);

    const dynamicStyles = screen === 'full' ? fullScreenStyles : normalScreenStyles;

    return (
        <Pressable
            onPress={() => {
                if (isPlaying) {
                    player.pause();
                } else {
                    player.play();
                }
            }}
            style={dynamicStyles.videoContainer}
        >
            <VideoView
                style={dynamicStyles.video}
                player={player}
                nativeControls={false}
                allowsFullscreen={false}
                staysActiveInBackground={false}
                contentFit="cover"
            />
            <View style={dynamicStyles.overlay}>
                <Icon style={dynamicStyles.overlayPlayIcon} name={isPlaying ? "pause" : "play-arrow"} size={25} color="white" />
                <Text style={dynamicStyles.overlayText}>
                    {videoDate ? extractDateFromFilename(videoDate) : null}
                </Text>
            </View>
        </Pressable>
    );
};

const normalScreenStyles = StyleSheet.create({
    videoContainer: {
        width: 340,
        height: 590,
        marginBottom: 10,
        marginTop: 10,
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
});

const fullScreenStyles = StyleSheet.create({
    videoContainer: {
        height: "100%",
        width: "100%",
        backgroundColor: "#000",
    },

    video: {
        backgroundColor: "black",
        width: "100%",
        height: "100%",
    },

    overlay: {
        display: 'none',
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
        display: 'none',
        position: "relative",
        top: 60,
        color: "#fff",
        fontSize: 20,
        fontWeight: "300",
    },

    overlayPlayIcon: {
        display: 'none',
        position: 'absolute',
        top: 15,
        right: 15,
    },
});

export default VideoPlayer;
