import React, { useLayoutEffect, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomListItem from '../components/CustomListItem'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

const HomeScreen = ({navigation}) => {
    const [chats,setChats] = useState([]);

    const signOut = () => {
        auth().signOut().then(() => {
            navigation.replace("Login");
        });
    }

    useEffect(()=>{
    },[])

    useLayoutEffect(()=>{

        firestore().collection("chats").onSnapshot(snapshot => (
            setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        ))

        navigation.setOptions({
            title: "Signal",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{marginLeft: 20}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOut}>
                        <Avatar rounded source={{ uri: auth()?.currentUser?.photoURL }} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: 80, marginRight: 20}}>
                    <TouchableOpacity activeOpacity={0.5}>
                        <Icon 
                            size= {24}
                            name='camera'
                            type='simple-line-icon'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("AddChat")}>
                        <Icon 
                            size= {24}
                            name='pencil'
                            type='simple-line-icon'
                        />
                    </TouchableOpacity>
                </View>
            )
        })
    },[navigation])

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat",{
            id,
            chatName,
        })
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({id,data: {chatName}})=>(
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: "100%",
    }
})
