// react
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity,
    Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { AuthContext } from "../context/AuthContext";
import ProgressBar from "../components/progressBar";
import VideoPlayer from "../components/VideoPlayer";

// expo
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

// firebase
import { storage } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [timer, setTimer] = useState(null);
    const [recording, setRecording] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [video, setVideo] = useState(null);
    const [type, setType] = useState("back");
    const cameraRef = useRef(null);
    const { user } = useContext(AuthContext);

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
                <Text>Asking permission for camera...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>No permission for camera</Text>
                <Button title="Ask permission" onPress={requestPermission} />
            </View>
        );
    }

    async function startRecording() {
        try {
            setRecording(true);
            setTimer(3);

            const videoDataPromise = cameraRef.current.recordAsync();

            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(countdown);
                        stopRecording();
                        setTimer(null);
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
            const blob = await uriToBlob(videoUri);
    
            const fileName = `video_${Date.now()}.mp4`;
            const today = new Date();
            const datePath = `${today.getDate()}.${today.getMonth() + 1}`;
            const user_uid = user.uid;
            const storageRef = ref(storage, `${user_uid}/${datePath}/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, blob);
    
            setUploading(true);
    
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progressValue = snapshot.bytesTransferred / snapshot.totalBytes;
                        setProgress(progressValue);
                    },
                    (error) => {
                        console.error("Virhe ladattaessa tiedostoa:", error);
                        setUploading(false);
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Video tallennettu:", downloadURL);
                        Alert.alert("Video uploaded!");
                        setUploading(false);
                        setProgress(0);
                        setVideo(null)
                        resolve(downloadURL);
                    }
                );
            });
        } catch (error) {
            console.error("Virhe saveVideo-funktiossa:", error);
            setUploading(false);
            return null;
        }
    }


    return (
        <View style={styles.container}>
            {!video ? (
                <CameraView
                    style={styles.camera}
                    facing={type}
                    ref={cameraRef}
                    mode="video"
                >
                    <View style={styles.overlay}>
                        <Text style={styles.headerText}>
                            Hello, what are you up to?
                        </Text>
                        {timer && <Text style={styles.timer}>{timer}</Text>}
                        <View style={styles.bottomRowButtons}>
                            <TouchableOpacity
                                style={styles.bottomButton}
                                onPress={() =>
                                    setType(type === "back" ? "front" : "back")
                                }
                            >
                                <Icon
                                    name="flip-camera-ios"
                                    size={25}
                                    color="white"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.bottomButton,
                                    recording && {
                                        opacity: 0.2,
                                        pointerEvents: "none",
                                    },
                                ]}
                                onPress={async () => {
                                    startRecording();
                                }}
                            >
                                <Icon
                                    name={"videocam"}
                                    size={25}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </CameraView>
            ) : (
                <View style={{ width: "100%", height: "100%" }}>
                    <VideoPlayer videoUrl={video} />
                    <View style={styles.overlay}>
                    {uploading && (
                        <ProgressBar progress={progress} />
                    )}
                        <Text style={styles.headerText}>
                            Happy with the video?
                        </Text>
                        <View style={styles.bottomRowButtons}>
                            <TouchableOpacity
                                style={styles.bottomButton}
                                onPress={async () => {
                                    saveVideo(video);
                                }}
                            >
                                <Icon name="save-alt" size={25} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setVideo(null)}
                                style={styles.bottomButton}
                            >
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
        height: "100%",
    },
    camera: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    progressBar: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
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
