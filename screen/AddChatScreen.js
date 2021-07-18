import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { app, db } from '../firebase'
import  firestore  from '@react-native-firebase/firestore'

const AddChatScreen = ({navigation}) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a new Chat",

        })
    },[navigation])

    const [input, setInput] = useState("");

    const createChat = async () => {
        await firestore().collection("chats").add({
            chatName: input
        }).then(() => {
            navigation.goBack();
        }).catch((error) => {
            alert(error)
        });
    }

    return (
        <View style={styles.container}>
            <Input 
                placeholder="Enter a new chat name" 
                value={input} 
                onChangeText={(text) => setInput(text)}
                leftIcon={
                    <Icon name='wechat' type='antdesign' size={24} color='black' />
                }
                onSubmitEditing={createChat}
            />
            <Button title='Create new chat' onPress={createChat} />
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 50,
        height: "100%",
    },
})
