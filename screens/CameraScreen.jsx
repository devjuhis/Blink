// react
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useState, useEffect, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';

// expo
import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { VideoView, useVideoPlayer } from "expo-video";

// firebase
import { storage } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [timer, setTimer] = useState(null);
    const [recording, setRecording] = useState(false);
    const [video, setVideo] = useState(null);
    const [type, setType] = useState("back");
    const cameraRef = useRef(null);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setVideo(null);
            };
        }, [])
    );

    useEffect(() => {
        (async () => {
            await MediaLibrary.requestPermissionsAsync();
            if (!permission || !permission.granted) {
                requestPermission();
            }
        })();
    }, []);

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text>Pyydetään kameran käyttöoikeutta...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>Kameran käyttöoikeutta ei ole annettu</Text>
                <Button title="Pyydä lupa" onPress={requestPermission} />
            </View>
        );
    }

    async function startRecording() {
        try {
            setRecording(true);
            setTimer(3); 
            
            const videoDataPromise = cameraRef.current.recordAsync();
    
            const countdown = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(countdown);
                        stopRecording();
                        setTimer(null)
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
    
            const videoData = await videoDataPromise;
            setVideo(videoData.uri);
            console.log("Video saved at:", videoData.uri);
            
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    }
    
    async function stopRecording() {
        try {
            await cameraRef.current.stopRecording();
            setRecording(false);
        } catch (error) {
            console.error("Error stopping recording:", error);
        }
    }

    async function uriToBlob(uri) {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    }

    async function saveVideo(videoUri) {
        if (!videoUri) {
            console.error("Virhe: Videon URI puuttuu.");
            return null;
        }
    
        try {
            // Muunnetaan URI Blobiksi
            const blob = await uriToBlob(videoUri);
    
            // Luo tiedostoviite Firebase Storageen
            const fileName = `video_${Date.now()}.mp4`;
            const storageRef = ref(storage, `videos/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, blob);
    
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Lataus etenee: ${progress.toFixed(2)}%`);
                    },
                    (error) => {
                        console.error("Virhe ladattaessa tiedostoa:", error);
                        reject(error);
                    },
                    async () => {
                        // Haetaan ladatun tiedoston URL
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Video tallennettu:", downloadURL);
                        Alert.alert("Video uploaded!")
                        setVideo(null);
                        resolve(downloadURL);
                    }
                );
            });
        } catch (error) {
            console.error("Virhe saveVideo-funktiossa:", error);
            return null;
        }
    }

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
                contentFit="fill"
            />
        );
    };
    
    
    return (
        <View style={styles.container}>
            {!video ? (
                <CameraView style={styles.camera} facing={type} ref={cameraRef} mode="video">
                    <View style={styles.overlay}>
                        <Text style={styles.headerText}>Hello, what are you up to?</Text>  
                        {timer && <Text style={styles.timer}>{timer}</Text>}
                        <View style={styles.bottomRowButtons}>
                            <TouchableOpacity
                                style={styles.bottomButton}
                                onPress={() => setType(type === "back" ? "front" : "back")}
                            >
                                <Icon name="flip-camera-ios" size={25} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.bottomButton,
                                    recording && { opacity: 0.2, pointerEvents: 'none' },
                                ]}
                                onPress={async () => {
                                    startRecording();
                                }}
                            >
                                <Icon name={"videocam"} size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </CameraView>
            ) : (
                <View style={{ width: "100%", height: "100%" }}>
                    <VideoPlayer videoUrl={video} />
                    <View style={styles.overlay}>
                        <Text style={styles.headerText}>Happy with the video?</Text>
                        <View style={styles.bottomRowButtons}>
                            <TouchableOpacity
                                style={styles.bottomButton}
                                onPress={async () => {
                                    saveVideo(video);
                                }}
                            >
                                <Icon name="save-alt" size={25} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setVideo(null)} style={styles.bottomButton}>
                                <Icon name="refresh" size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    camera: {
        width: "100%",
        height: "100%"
    },
    videocontainer: {
        height: "100%",
        width: "100%",
        backgroundColor: "#000"
    },
    overlay: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    bottomRowButtons: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        padding: 10,
    },
    bottomButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        borderRadius: 10,
        padding: 15,
        backgroundColor: "rgba(98, 0, 234, 0.6)",
        flex: 1,
    },
    text: {
        color: "white",
        fontSize: 16,
    },
    headerText: {
        color: "white",
        fontSize: 18,
        position: "absolute",
        top: "10%",
        width: "100%",
        textAlign: "center",
    },
    timer: {
        color: "white",
        fontSize: 40,
        fontWeight: 600,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: "100%",
        textAlign: "center",
    },
});
