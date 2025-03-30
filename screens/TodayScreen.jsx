import React, { useState, useContext, useCallback, useRef } from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';

// omat
import { AuthContext } from "../context/AuthContext";
import ProgressBar from "../components/progressBar";
import MergeButton from "../components/mergeButton";
import VideoPlayer from "../components/VideoPlayer";
import { fetchTodaysVideos } from "../functions/videoUtils";

const ProfileScreen = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const prevVideosRef = useRef();

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            console.log('ladataan');

            const getVideos = async () => {
                if (user) {
                    const todaysVideos = await fetchTodaysVideos(user);
                    console.log(todaysVideos);
                        
                    if (isActive) {
                        setVideos(todaysVideos);
                        prevVideosRef.current = todaysVideos;
                        setLoading(false);
                    }
                }
            };

            getVideos();

            return () => {
                isActive = false;
                setVideos([]);
                setLoading(true);
                setUploading(false);
                setProgress(0);
            };
        }, [user])
    );

    return (
        <>
            {uploading && <ProgressBar progress={progress} />}

            <View style={styles.container}>
                <MergeButton
                    user={user}
                    uploading={uploading}
                    setUploading={setUploading}
                    setProgress={setProgress}
                    setVideos={setVideos}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        data={videos}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <VideoPlayer
                                videoUrl={item.url}
                                videoDate={item.date}
                            />
                        )}
                        contentContainerStyle={styles.listContainer}
                        snapToAlignment="center"
                        decelerationRate="fast"
                        pagingEnabled={true}
                        //initialNumToRender={1} // Renderöi vain yhden videon alussa
                        //maxToRenderPerBatch={1} // Lataa videot yksi kerrallaan
                    />
                )}
            </View>
        </>
    );    
};


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        paddingHorizontal: 10,
        marginTop: 50,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    }
});

export default ProfileScreen;
