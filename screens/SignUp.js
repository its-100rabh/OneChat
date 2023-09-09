import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Signup({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>Sign-up's closed for now</Text>
            <Text style={{ color: "green", fontSize: 30, fontWeight: "bold", padding: 16 }}>Go back to Login screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    message: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'blue',
        textAlign: 'center',
    },
});
