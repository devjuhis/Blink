import React, { useState, useRef, useCallback } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { getStorage, ref, listAll } from "firebase/storage";

const DaysInRow = ({ user }) => {
    const [days, setDays] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const storage = getStorage();
                    const userFolderRef = ref(storage, `${user.uid}`);

                    const folders = await listAll(userFolderRef);
                    const folderNames = folders.prefixes.map(folder => folder.name);

                    const folderDates = folderNames
                        .map(name => {
                            const parts = name.split(".");
                            if (parts.length !== 2) return null;
                            const day = parseInt(parts[0], 10);
                            const month = parseInt(parts[1], 10) - 1;
                            const year = new Date().getFullYear();
                            return new Date(year, month, day);
                        })
                        .filter(date => date && !isNaN(date.getTime()));

                    folderDates.sort((a, b) => b - a);

                    let streak = 0;
                    let currentDate = new Date();

                    for (let date of folderDates) {
                        if (
                            date.getDate() === currentDate.getDate() &&
                            date.getMonth() === currentDate.getMonth()
                        ) {
                            streak++;
                            currentDate.setDate(currentDate.getDate() - 1);
                        } else {
                            break;
                        }
                    }
                    setDays(streak);

                    fadeIn();
                } catch (e) {
                    console.log(e);
                }
            };

            fetchData();
        }, [])
    );


    return (
        <View style={styles.container}>
            <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                {days} {days === 1 ? "day" : "days"} in a row{" "}
                {days >= 5 ? "🔥" : days >= 3 ? "💪" : days >= 1 ? "👍" : "🙂"}
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        paddingVertical: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
        marginTop: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    text: {
        fontSize: 20,
        fontWeight: 300,
        color: "#fff",
        textAlign: "center",
    },
});

export default DaysInRow;
