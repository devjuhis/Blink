import { fetchTodaysVideos } from "../functions/videoUtils";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";

export default async function mergeVideos(user, setProgress, setUploading, setVideos) {
    try {
        setUploading(true);
        setProgress(0);

        const todaysVideos = await fetchTodaysVideos(user);
        if (!todaysVideos || todaysVideos.length < 2) {
            console.log("Ei tarpeeksi videoita yhdistettäväksi");
            setUploading(false);
            return null;
        }

        const formData = new FormData();
        todaysVideos.forEach((video) => {
            formData.append("videos", {
                uri: video.url,
                type: "video/mp4",
                name: video.date,
            });
        });

        // Lähetetään videot backendille yhdistettäväksi
        //http://192.168.10.213:5000/api/blink/videos
        //https://macrohub-backend-6-3-25-macrohub.2.rahtiapp.fi/api/blink/videos
        const response = await fetch("http://192.168.10.213:5000/api/blink/videos", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            console.log("Virhe yhdistettäessä videoita:", response.statusText);
            throw new Error("Backend palautti virheen.");
        }

        const blob = await response.blob();
        const fileName = `video_${Date.now()}.mp4`;
        const today = new Date();
        const datePath = `${today.getDate()}.${today.getMonth() + 1}`;
        const user_uid = user.uid;

        const storage = getStorage();
        const userFolderRef = ref(storage, `${user_uid}/${datePath}/`);

        // Poistetaan vanhat videot
        try {
            const listResult = await listAll(userFolderRef);
            const deletePromises = listResult.items.map((fileRef) => deleteObject(fileRef));
            await Promise.all(deletePromises);
            console.log("Vanhat videot poistettu.");
        } catch (deleteError) {
            console.error("Virhe poistettaessa vanhoja videoita:", deleteError);
        }

        // Aloitetaan uuden videon lataus Firebaseen
        const storageRef = ref(storage, `${user_uid}/${datePath}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progressValue = snapshot.bytesTransferred / snapshot.totalBytes;
                    setProgress(progressValue);
                },
                (error) => {
                    console.error("Latausvirhe:", error);
                    setUploading(false);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setProgress(0);
                        setUploading(false);

                        const updatedVideoList = await fetchTodaysVideos(user);
                        setVideos(updatedVideoList);

                        resolve(downloadURL);
                        setVideos(todaysVideos)
                    } catch (error) {
                        console.error("Virhe haettaessa latauslinkkiä:", error);
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.error("Virhe yhdistettäessä videoita:", error);
        setUploading(false);
    }
}
