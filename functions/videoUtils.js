import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

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

                    const parts = video.name.split("_");
                    if (parts.length < 2) {
                        console.warn("Virheellinen tiedostonimi:", video.name);
                        return null;
                    }

                    const timestamp = parseInt(parts[1].split(".")[0], 10);
                    if (isNaN(timestamp)) {
                        console.warn("Virheellinen aikaleima:", video.name);
                        return null;
                    }

                    return {
                        url,
                        date: video.name,
                        timestamp: timestamp,
                    };
                })
            );

            allVideos.push(...videosData.filter(v => v !== null));
        }

        allVideos.sort((a, b) => b.timestamp - a.timestamp);

        return allVideos;
    } catch (error) {
        console.error("Error fetching all videos:", error);
        return [];
    }
};


export { fetchTodaysVideos, fetchMonthlyVideos };
