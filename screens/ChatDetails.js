import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import {
    collection,
    query,
    orderBy,
    getDocs,
    addDoc,
    serverTimestamp,
    onSnapshot,
} from "firebase/firestore";
import { auth, firestore } from "../src/firebase";

export default function ChatDetails({ route }) {
    const { chat } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [unsubscribe, setUnsubscribe] = useState(null);

    const fetchUserNameByEmail = async (userEmail) => {
        try {

            const q = query(collection(firestore, "users"), where("email", "==", userEmail));

            const querySnapshot = await getDocs(q);

            if (querySnapshot.size === 1) {

                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();


                return userData.name;
            } else {

                return "Unknown User";
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return "Unknown User";
        }
    };

    useEffect(() => {
        const fetchChatMessages = async () => {
            try {
                const q = query(
                    collection(firestore, "chatrooms", chat.id, "messages"),
                    orderBy("timestamp")
                );

                const querySnapshot = await getDocs(q);
                const chatMessages = [];

                querySnapshot.forEach((doc) => {
                    const messageData = doc.data();
                    chatMessages.push(messageData);
                });

                setMessages(chatMessages);

                const unsubscribeListener = onSnapshot(q, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const newMessageData = change.doc.data();
                            setMessages((prevMessages) => [...prevMessages, newMessageData]);
                        }
                    });
                });

                setUnsubscribe(unsubscribeListener);
            } catch (error) {
                console.error("Error fetching chat messages:", error);
            }
        };

        fetchChatMessages();
    }, [chat.id]);

    const sendMessage = async () => {
        if (newMessage.trim() === "") {
            return;
        }

        try {
            const newMessageData = {
                text: newMessage,
                sender: auth.currentUser.email,
                timestamp: serverTimestamp(),
            };


            await addDoc(collection(firestore, "chatrooms", chat.id, "messages"), newMessageData);


            setMessages((prevMessages) => [...prevMessages, newMessageData]);


            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const renderMessage = ({ item }) => {
        const senderName = item.sender.split("@")[0]
        const isCurrentUser = item.sender === auth.currentUser.email;

        return (
            <View
                style={[
                    styles.messageItem,
                    isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
                ]}
            >
                <Text style={styles.messageSender}>{senderName}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    messagesContainer: {
        paddingHorizontal: 16,
    },
    messageItem: {
        marginBottom: 16,
        maxWidth: "70%",
        alignSelf: "flex-start",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    messageText: {
        fontSize: 25,
        backgroundColor: "#f2f2f2",
        padding: 8,
        borderRadius: 8,
        borderColor: "black",
        borderWidth: 0.5
    },
    messageSender: {
        fontSize: 20,
        color: "#888888",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: "#6200EE",
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    sendButtonText: {
        color: "#ffffff",
        fontSize: 16,
    },
    currentUserMessage: {
        marginBottom: 16,
        maxWidth: "70%",
        alignSelf: "flex-end",
        flexDirection: "column",
        alignItems: "flex-end",
        backgroundColor: "#DCF8C6",
        borderRadius: 10,
        padding: 10,
    },


    otherUserMessage: {
        marginBottom: 16,
        maxWidth: "70%",
        alignSelf: "flex-start",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#F2F2F2",
        borderRadius: 10,
        padding: 10,
    },
});
