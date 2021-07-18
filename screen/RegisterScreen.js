import React, { useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView, StatusBar, StyleSheet, View } from 'react-native'
import { Button, Input, Text } from 'react-native-elements'
import auth from '@react-native-firebase/auth';

const RegisterScreen = ({navigation}) => {
    
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [imageUrl,setImageUrl] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Login",
        });
    },[navigation])

    const register = () => {
        auth().createUserWithEmailAndPassword(email,password)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName: name,
                    photoURL: imageUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
                })
            }).catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "padding"} style={styles.container}>
            <StatusBar style="auto" />
            <Text h3 style={{marginBottom: 50}}>Create a Signal account</Text>
            <View style={styles.inputContainer} >
                <Input placeholder="Full Name" autoFocus type="text" value={name} onChangeText={(text) => setName(text) }/>
                <Input placeholder="Email" type="email" value={email} onChangeText={(text) => setEmail(text) }/>
                <Input placeholder="Password" secureTextEntry type="password" value={password} onChangeText={(text) => setPassword(text) }/>
                <Input placeholder="Profile Picture URL (optional)" type="text" value={imageUrl} onSubmitEditing={register} onChangeText={(text) => setImageUrl(text) }/>
            </View>
            <Button containerStyle={styles.button} raised onPress={register} title="Register" /> 
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    inputContainer: {
        width: 300,
    },
    button: {
        width: 200,
        marginTop: 10,
    },
})
