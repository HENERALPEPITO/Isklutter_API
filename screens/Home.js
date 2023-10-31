import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import colors from '../colors';

const Home = () => {
    const navigation = useNavigation();
    const [recipientEmail, setRecipientEmail] = useState('');

    const handleRecipientEmailChange = (text) => {
        setRecipientEmail(text);
    };

    const goToChat = () => {
        navigation.navigate('Chat');
    };

    const startPrivateChat = async () => {
        try {
            const userQuerySnapshot = await firebase.firestore().collection('users').where('email', '==', recipientEmail).get();

            if (!userQuerySnapshot.empty) {
                const recipient = userQuerySnapshot.docs[0].data();
                navigation.navigate('PrivateMessage', { recipient });
            } else {
                alert('User not found. Please check the email address.');
            }
        } catch (error) {
            console.error('Error searching for user:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
                <Text>Community</Text>
            </TouchableOpacity>
            <TextInput
                placeholder="Recipient's Email"
                value={recipientEmail}
                onChangeText={handleRecipientEmailChange}
                style={styles.input}
            />
            <TouchableOpacity onPress={startPrivateChat} style={styles.privateChatButton}>
                <Text>Private Chat</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButton: {
        backgroundColor: colors.primary,
        height: 50,
        width: 150,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    privateChatButton: {
        backgroundColor: colors.secondary,
        height: 50,
        width: 150,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        flexDirection: 'row',
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        width: 200,
        padding: 5,
        marginTop: 10,
    },
});

export default Home;
