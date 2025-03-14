
import { VideoView, useVideoPlayer } from "expo-video";
import { StyleSheet } from "react-native";

const VideoPlayer = ({ videoUrl }) => {
    const player = useVideoPlayer(videoUrl, (player) => {
        player.loop = true;
        player.play();
    });

    return (
        <VideoView
            style={styles.videocontainer}
            player={player}
            nativeControls={false}
            allowsFullscreen={false}
            contentFit="cover"
        />
    );
};
const styles = StyleSheet.create({
    videocontainer: {
        height: "100%",
        width: "100%",
        backgroundColor: "#000",
    }    
});
export default VideoPlayer;