import firestore from '@react-native-firebase/firestore'
import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import auth from '@react-native-firebase/auth'

const ChatScreen = ({navigation, route}) => {
    const [input,setInput] = useState("");
    const [messages,setMessages] = useState([]);
     useLayoutEffect(()=>{
         navigation.setOptions({
             title: route.params.chatName,
             headerBackTitleVisible: false,
             headerTextAlign: "left",
             headerTitle: () => (
                 <View style={{flexDirection: "row",alignItems:"center"}}>
                    <Avatar rounded source={{uri: messages[messages.length - 1]?.data.photoURL}}/>
                    <Text style={{color:"#fff",marginLeft: 10,fontWeight:"700"}}>{route.params.chatName}</Text>
                 </View>
             ),
            headerLeft: () => (
                <TouchableOpacity style={{marginLeft:10}} onPress={navigation.goBack}>
                    <Icon 
                        type="antdesign"
                        name="arrowleft"
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: 80, marginRight: 20}}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Icon 
                            size= {24}
                            name='video-camera'
                            type='font-awesome'
                            color="#fff"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("AddChat")}>
                        <Icon 
                            size= {24}
                            name='call'
                            type='ionicon'
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            )
         })
     },[])

     const sendMessage = () => {
        Keyboard.dismiss();
        firestore().collection("chats").doc(route.params.id).collection("messages").add({
            timestamp: firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth().currentUser.displayName,
            email: auth().currentUser.email,
            photoURL: auth().currentUser.photoURL,
        })

        setInput("");
     }

     useLayoutEffect(()=>{
         const unsubscribe = firestore().collection("chats").doc(route.params.id).collection("messages").orderBy("timestamp","asc").onSnapshot((snapshot)=>setMessages(
             snapshot.docs.map((doc)=>({
                 id: doc.id,
                 data: doc.data()
             }))
         ))
         return unsubscribe;
     },[route])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
            <StatusBar barStyle="light-content"/>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} style={styles.container} keyboardVerticalOffset={90}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
                <>
                    <ScrollView contentContainerStyle={{paddingTop: 16}}>
                        {messages.map(({id,data}) => (
                            data.email === auth().currentUser.email ? (
                                <View key={id} style={styles.reciever}>
                                    <Avatar rounded size={30} containerStyle={{position: "absolute", bottom: -15, right: -5}} position="absolute" bottom={-15} right={-5} source={{uri: data.photoURL}}/>
                                    <Text style={styles.recieverText}>{data.message}</Text>
                                </View>
                            ) : (
                                <View key={id} style={styles.sender}>
                                    <Avatar rounded size={30} containerStyle={{position: "absolute", bottom: -15,left: -5}} position="absolute" bottom={-15} left={-5} source={{uri: data.photoURL}}/>
                                    <Text style={styles.senderText}>{data.message}</Text>
                                    <Text style={styles.senderName}>{data.displayName}</Text>
                                </View>
                            )
                        ))}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput placeholder="Signal Message" value={input} onChangeText={(text) => setInput(text)} onSubmitEditing={sendMessage} style={styles.textInput}/>
                        <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                            <Icon name="send" type="ionicon" color="#2b68e6" size={24}/>
                        </TouchableOpacity>
                    </View>
                </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 16,
        borderColor: "transparent",
        backgroundColor: "#ECECEC",
        borderWidth: 1,
        padding: 10,
        color: "grey",
        borderRadius: 30,
    },
    sender: {
        padding: 15,
        backgroundColor: "#2B68E6",
        alignSelf: "flex-start",
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        margin: 16,
        maxWidth: "80%",
        position: 'relative',
    },
    reciever: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        borderBottomRightRadius: 0,
        marginRight: 16,
        marginBottom: 20,
        maxWidth: "80%",
        position: 'relative',
    },
    senderName: {
        left: 8,
        bottom: -2,
        paddingRight: 10,
        fontSize: 10,
        color: "white",
    },
    senderText: {
        color: "white",
        fontWeight: "600",
        marginLeft: 10,
        marginBottom: 16,
    },
    recieverText: {
        color: "black",
        fontWeight: "600",
        marginLeft: 10,
    },
})
