import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

// Omat
import mergeVideos from "../functions/mergeVideos";
import { fetchTodaysVideos } from "../functions/videoUtils";

import { COLORS } from "../styles/style";

const MergeButton = ({ user, uploading, setUploading, setProgress, setVideos }) => {
    const [hoursToMidnight, setHoursToMidnight] = useState(0);

    useEffect(() => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
    
        const diffMs = midnight - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        setHoursToMidnight(diffHours);
    }, []);

    return (
        <Pressable
            style={[styles.mergeButton, uploading && styles.disabledButton]}
            onPress={async () => {
                setUploading(true);
                const uploadSuccess = await mergeVideos(user, setProgress, setUploading, setVideos);

                if (uploadSuccess) {
                    const videosList = await fetchTodaysVideos(user);
                    setVideos(videosList);
                } else {
                    console.log("Videon yhdistäminen epäonnistui");
                }

                setUploading(false);
            }}
            disabled={uploading}
        >
            <Text style={styles.mergeButtonText}>
                Merge today's videos ({hoursToMidnight}h left)
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    mergeButton: {
        width: '100%',
        backgroundColor: COLORS.primary,
        marginVertical: 5,
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mergeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 300,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});

export default MergeButton;
