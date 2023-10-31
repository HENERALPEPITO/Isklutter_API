import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, TextInput, Button } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function PrivateMessage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Private Chat',
    });
  }, [navigation]);

  const onSend = useCallback(
    (newMessages = []) => {
      const updatedMessages = GiftedChat.append(messages, newMessages);
      setMessages(updatedMessages);

      // Add the sent message to your database (Firestore)
      const { _id, createdAt, text, user } = newMessages[0];
      addDoc(collection(database, 'privateChats'), {
        _id,
        createdAt,
        text,
        user,
      });
    },
    [messages]
  );

  useEffect(() => {
    const collectionRef = collection(database, 'privateChats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return unsubscribe;
  }, []);

  const handleInputMessageChange = (text) => {
    setInputMessage(text);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') {
      return;
    }

    onSend([
      {
        _id: new Date().getTime(),
        text: inputMessage,
        createdAt: new Date(),
        user: {
          _id: auth?.currentUser?.email,
          // You can set an avatar for the user here
        },
      },
    ]);

    setInputMessage('');
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: auth?.currentUser?.email,
        }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TextInput
          value={inputMessage}
          onChangeText={handleInputMessageChange}
          placeholder="Type your message"
          style={{ flex: 1, padding: 10, borderRadius: 20, backgroundColor: '#fff' }}
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
}
