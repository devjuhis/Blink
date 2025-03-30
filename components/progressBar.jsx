import * as Progress from "react-native-progress";
import { View, Text, StyleSheet } from "react-native";

export default function ProgressBar({ progress }) {
    return (
        <View style={styles.progressBar}>
            <Text style={styles.progressText}>
                Uploading: {(progress * 100).toFixed(2)}%
            </Text>
            <Progress.Bar
                progress={progress}
                width={300}
                color="#6200ee"
                borderRadius={5}
                borderWidth={3}
                borderColor="#ddd"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    progressBar: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 100,
    },
    progressText: {
        color: "white",
        marginBottom: 5,
    },
});
