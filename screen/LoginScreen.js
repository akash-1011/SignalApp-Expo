import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Button, Image, Input } from 'react-native-elements'
import auth from '@react-native-firebase/auth'

const LoginScreen = ({navigation}) => {

    useEffect(()=>{
        const unsubscribe = auth().onAuthStateChanged((authUser)=>{
            if(authUser){
                navigation.replace("Home");
            }
        })

        return unsubscribe
    },[auth])

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = () => {
        auth().signInWithEmailAndPassword(email,password)
        .then((authUser) => {
            console.log(authUser)
        })
        .catch(error => alert(error));
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "padding"} style={styles.container}>
            <StatusBar barStyle="default" />
            <Image 
                source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Signal-Logo.svg/225px-Signal-Logo.svg.png"
                }}
                style={styles.image}
            />
            <View style={styles.inputContainer}>
                <Input placeholder="Email" autoFocus type="email" value={email} onChangeText={(text) => setEmail(text)}/>
                <Input placeholder="Password" secureTextEntry type="password" value={password} onSubmitEditing={signIn} onChangeText={(text) => setPassword(text)} />
            </View>

            <Button containerStyle={styles.button} raised onPress={signIn} title="Login" />
            <Button containerStyle={styles.button} raised onPress={() => navigation.navigate("Register")} type="outline" title="Register" />
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    image: {
        width: 150, 
        height: 150, 
        borderRadius: 20, 
        marginBottom: 10,
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,
    }
})
