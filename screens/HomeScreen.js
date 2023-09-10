import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import {
    collection,
    query,
    where,
    getDocs,
    FirebaseFirestore,
} from "firebase/firestore";
import { auth, firestore } from "../src/firebase";
import ChatDetails from "./ChatDetails";

export default function HomeScreen({ route, navigation }) {
    const { userEmail } = route.params;
    const [userChats, setUserChats] = useState([]);



    const getInitials = (name) => {
        const nameArray = name.split(" ");
        if (nameArray.length >= 2) {
            return nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase();
        } else {
            return nameArray[0][0].toUpperCase();
        }
    };
    useEffect(() => {
        console.log("userEmail:", userEmail);

        const fetchChatData = async () => {
            try {
                console.log("Fetching chat data for user:", userEmail);

                const q = query(
                    collection(firestore, "chatrooms"),
                    where("members", "array-contains", userEmail)
                );
                const querySnapshot = await getDocs(q);

                const chats = [];

                querySnapshot.forEach((doc) => {
                    const chatData = doc.data();

                    const chat = {
                        id: doc.id,
                        ...chatData,
                    };
                    chats.push(chat);
                });

                setUserChats(chats);
            } catch (error) {
                console.error("Error fetching chat data:", error);
            }
        };

        fetchChatData();
    }, [userEmail]);



    const navigateToChat = (chat) => {
        console.log("Navigating to chat:", chat);
        navigation.navigate("ChatDetails", { chat });
    };


    const renderChatItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigateToChat(item)} style={styles.chatItem}>
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarInitials}>{getInitials(item.name)}</Text>
            </View>
            <View style={styles.chatContent}>
                <Text style={styles.chatName}>{item.name}</Text>

            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.centeredContent}>
                <Text style={{ fontSize: 20, color: "white", }}>Welcome to Chat Screen</Text>
            </View>
            <FlatList
                data={userChats}
                keyExtractor={(item) => item.name}
                renderItem={renderChatItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    centeredContent: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "yellowgreen",
        padding: 25,

    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        backgroundColor: "#ffffff",
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    chatContent: {
        flex: 1,
    },
    chatName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        color: "#888888",
    },
    avatarInitials: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
});