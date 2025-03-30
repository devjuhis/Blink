import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

// Haetaan tämän päivän videot Firebase Storagesta
const fetchTodaysVideos = async (user) => {
    try {
        const storage = getStorage();
        const today = new Date();
        const datePath = `${today.getDate()}.${today.getMonth() + 1}`;
        const videosRef = ref(storage, `${user.uid}/${datePath}`);
        const videoList = await listAll(videosRef);

        const videosData = await Promise.all(
            videoList.items.map(async (video) => {
                const url = await getDownloadURL(video);
                return {
                    url,
                    date: video.name,
                };
            })
        );

        return videosData;
    } catch (error) {
        console.error("Error fetching videos:", error);
    }
};

const fetchMonthlyVideos = async (user) => {
    try {
        const storage = getStorage();
        const userFolderRef = ref(storage, `${user.uid}`);

        const allItems = await listAll(userFolderRef);

        const allVideos = [];
        for (let prefix of allItems.prefixes) {

            const videoList = await listAll(prefix);
            const videosData = await Promise.all(
                videoList.items.map(async (video) => {
                    const url = await getDownloadURL(video);
                    return {
                        url,
                        date: video.name,
                    };
                })
            );
            allVideos.push(...videosData);
        }

        return allVideos.reverse();
    } catch (error) {
        console.error("Error fetching all videos:", error);
    }
};



export { fetchTodaysVideos, fetchMonthlyVideos };
