import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { StyleSheet, View } from 'react-native'
import { Avatar,Text, ListItem } from 'react-native-elements'

const CustomListItem = ({id,chatName,enterChat}) => {
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(()=>{
        const unsubscribe = firestore()
                .collection("chats")
                .doc(id)
                .collection("messages")
                .orderBy("timestamp","asc")
                .onSnapshot((snapshot)=>
                    setChatMessages(snapshot.docs.map((doc)=>doc.data()))
                )
        
        return unsubscribe;
    },[])

    return (
        <ListItem key={id} onPress={()=> enterChat(id,chatName)} key={id} bottomDivider>
            <Avatar 
                rounded
                source={{
                    uri: chatMessages[chatMessages.length - 1]?.photoURL ||  
                        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
                }}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "700"}}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    <Text style={{fontWeight: "700"}}>{chatMessages?.[chatMessages.length - 1]?.displayName}</Text> : {chatMessages?.[chatMessages.length -1]?.message} 
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({})
